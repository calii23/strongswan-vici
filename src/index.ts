import {createConnection, NetConnectOpts, Socket} from 'net';
import {parse} from 'url';
import {EventEmitter} from './event';
import {InboundPacket, PacketType, Section} from './protocol/general';
import {ViciWriter} from './protocol/writer';
import {ViciReader} from './protocol/reader';
import {ByPriority, ReloadSettingsStatus, Stats, Version} from './types';
import {ReloadSettingsResponse, StatsResponse} from './protocol/packet';

interface ViciEvents {
  error(error: Error): void;

  packet(packet: InboundPacket): void;

  connect(): void;
  disconnect(dueError: boolean): void;

  idle(): void;
}

export class Vici extends EventEmitter<ViciEvents> {
  private readonly connectionOptions: NetConnectOpts;
  private connection: Socket | null = null;
  private buffer: Buffer | null = null;

  public constructor(socket: string = 'unix:///var/run/charon.vici', private readonly timeout: number = 5000, private readonly keepAliveFor: number = 10000) {
    super();
    const url = parse(socket);

    if (url.protocol === 'unix:') {
      if (!url.path) throw new Error('Missing path for unix socket url: ' + socket);
      this.connectionOptions = {path: url.path};
    } else if (url.protocol === 'tcp:') {
      if (!url.hostname) throw new Error('Missing host for tcp socket url: ' + socket);
      if (!url.port) throw new Error('Missing host for tcp socket url: ' + socket);
      this.connectionOptions = {
        host: url.hostname,
        port: Number(url.port)
      };
    } else {
      throw new Error('Only unix or tcp connections are supported! Invalid socket url: ' + socket);
    }
  }

  public connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const connection = createConnection(this.connectionOptions);
      connection.setTimeout(this.keepAliveFor);
      connection.on('connect', () => {
        this.connection = connection;
        this.emit('connect');
        resolve();
      });
      connection.on('error', err => {
        if (this.connection === connection) {
          this.emit('error', err);
        } else {
          reject(err);
        }
      });
      connection.on('close', had_error => {
        this.connection = null;
        this.emit('disconnect', had_error);
      });
      connection.on('timeout', () => {
        if (this.connection === connection) {
          this.emit('idle');
          this.close();
        }
      });

      connection.on('data', data => {
        if (this.buffer) {
          this.buffer = Buffer.concat([this.buffer, data]);
        } else {
          this.buffer = data;
        }

        this.processData();
      });
    });
  }

  public close(): void {
    if (this.connection) {
      this.connection.end();
      this.connection = null;
    }
  }

  public async sendPacket(type: PacketType, packet: string | Section): Promise<void> {
    if (!this.connection) {
      await this.connect();
    }
    const writer = new ViciWriter();
    writer.writePacket(type, packet);
    this.connection!.write(writer.packet);
  }

  public version(): Promise<Version> {
    return this.doCommand<Version>('version');
  }

  public async stats(): Promise<Stats> {
    const response = await this.doCommand<StatsResponse>('stats');

    const workersByPriority: ByPriority = {
      critical: parseInt(response.workers.active.critical),
      high: parseInt(response.workers.active.high),
      medium: parseInt(response.workers.active.medium),
      low: parseInt(response.workers.active.low)
    };
    const queuesByPriority: ByPriority = {
      critical: parseInt(response.queues.critical),
      high: parseInt(response.queues.high),
      medium: parseInt(response.queues.medium),
      low: parseInt(response.queues.low)
    };

    return {
      runningSince: new Date(response.uptime.since),
      workers: {
        total: parseInt(response.workers.total),
        running: Object.values(workersByPriority).reduce((a, b) => a + b),
        idle: parseInt(response.workers.idle),
        activeByPriority: workersByPriority
      },
      queues: Object.values(queuesByPriority).reduce((a, b) => a + b),
      queuesByPriority,
      ikeSas: parseInt(response.ikesas.total),
      ikeSasHalfOpen: parseInt(response.ikesas['half-open']),
      memory: {
        nomMappedSpace: parseInt(response.mallinfo.sbrk),
        mappedSpace: parseInt(response.mallinfo.mmap),
        used: parseInt(response.mallinfo.used),
        free: parseInt(response.mallinfo.free),
      }
    };
  }

  public async reloadSettings(): Promise<ReloadSettingsStatus> {
    const response = await this.doCommand<ReloadSettingsResponse>('reload-settings');

    const success = response.success === 'yes';
    if (response.errmsg) {
      return {
        success,
        error: response.errmsg
      };
    } else {
      return {success};
    }
  }

  public async doCommand<T extends object>(command: string): Promise<T> {
    await this.sendPacket(PacketType.CMD_REQUEST, command);
    const packet = await this.nextPacket(packet => packet.type === PacketType.CMD_RESPONSE || packet.type === PacketType.CMD_UNKNOWN);
    if (packet.type === PacketType.CMD_UNKNOWN) {
      throw new Error('This command seems not to be supported by the charon server!');
    }
    return packet.payload as T;
  }

  private nextPacket(filter: (packet: InboundPacket) => boolean): Promise<InboundPacket> {
    return new Promise((resolve, reject) => {
      const packetListener: ViciEvents['packet'] = packet => {
        if (filter(packet)) {
          this.off('packet', packetListener);
          this.off('error', errorListener);
          clearTimeout(timeout);
          resolve(packet);
        }
      };
      const errorListener: ViciEvents['error'] = error => {
        this.off('packet', packetListener);
        clearTimeout(timeout);
        reject(error);
      };
      const timeout = setTimeout(() => {
        this.off('packet', packetListener);
        this.off('error', errorListener);
        reject(new Error('Waiting for response timed out!'));
      }, this.timeout);
      this.on('packet', packetListener);
      this.once('error', errorListener);
    });
  }

  private processData(): void {
    try {
      const reader = new ViciReader(this.buffer!);
      let packet: InboundPacket | boolean;

      while (packet = reader.readPacket()) {
        this.emit('packet', packet);
      }

      if (reader.readBytes === this.buffer!.byteLength) {
        this.buffer = null;
      } else {
        this.buffer = this.buffer!.subarray(reader.readBytes);
      }
    } catch (e) {
      this.buffer = null;
      this.emit('error', e);
    }
  }
}
