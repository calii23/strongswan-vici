import {createConnection, NetConnectOpts, Socket} from 'net';
import {parse} from 'url';
import {EventEmitter} from './event';
import {
  InboundPacket,
  PacketType,
  RawChildRekeyEvent,
  RawChildUpdownEvent,
  RawClearCredsResponse,
  RawControlLogEvent,
  RawFlushCertsRequest,
  RawFlushCertsResponse,
  RawGetAlgorithmsResponse,
  RawGetAuthoritiesResponse,
  RawGetConnsResponse,
  RawGetCountersRequest,
  RawGetCountersResponse,
  RawGetKeysResponse,
  RawGetPoolsRequest,
  RawGetPoolsResponse,
  RawGetSharedResponse,
  RawIkeRekeyEvent,
  RawIkeUpdownEvent,
  RawInitiateRequest,
  RawInitiateResponse,
  RawInstallRequest,
  RawInstallResponse,
  RawListAuthoritiesRequest,
  RawListAuthorityEvent,
  RawListCertEvent,
  RawListCertsRequest,
  RawListConnEvent,
  RawListConnsRequest,
  RawListPoliciesRequest,
  RawListPolicyEvent,
  RawListSaEvent,
  RawListSasRequest,
  RawLoadAuthorityRequest,
  RawLoadAuthorityResponse,
  RawLoadCertRequest,
  RawLoadCertResponse,
  RawLoadConnRequest,
  RawLoadConnResponse,
  RawLoadKeyRequest,
  RawLoadKeyResponse,
  RawLoadPoolRequest,
  RawLoadPoolResponse,
  RawLoadSharedRequest,
  RawLoadSharedResponse,
  RawLoadTokenRequest,
  RawLoadTokenResponse,
  RawLogEvent,
  RawRedirectRequest,
  RawRedirectResponse,
  RawRekeyRequest,
  RawRekeyResponse,
  RawResetCountersRequest,
  RawResetCountersResponse,
  RawStatsResponse,
  RawTerminateRequest,
  RawTerminateResponse,
  RawUninstallRequest,
  RawUninstallResponse,
  RawUnloadAuthorityRequest,
  RawUnloadAuthorityResponse,
  RawUnloadConnRequest,
  RawUnloadConnResponse,
  RawUnloadKeyRequest,
  RawUnloadKeyResponse,
  RawUnloadPoolRequest,
  RawUnloadPoolResponse,
  RawUnloadSharedRequest,
  RawUnloadSharedResponse,
  ReloadSettingsResponse,
  Section,
  VersionResponse
} from './protocol';
import {ViciWriter} from './protocol/writer';
import {ViciReader} from './protocol/reader';
import {ControlLogEvent, EventName, LogEvent, ReloadSettingsStatus, Stats, Version} from './types';
import {convertControlLog, convertLog, convertReloadSettings, convertStats} from './protocol/packet/convert';
import {noParallel} from './utils';

interface ViciEvents {
  error(error: Error): void;

  packet(packet: InboundPacket): void;

  connect(): void;
  disconnect(dueError: boolean): void;
  idle(): void;

  remoteEvent(event: string, payload: Section): void;
  subscribe(event: string): void;
  unsubscribe(event: string): void;

  log(message: LogEvent): void;
  controlLog(message: ControlLogEvent): void;
  listSa(message: RawListSaEvent): void;
  listPolicy(message: RawListPolicyEvent): void;
  listConn(message: RawListConnEvent): void;
  listCert(message: RawListCertEvent): void;
  listAuthority(message: RawListAuthorityEvent): void;
  ikeUpdown(message: RawIkeUpdownEvent): void;
  ikeRekey(message: RawIkeRekeyEvent): void;
  childUpdown(message: RawChildUpdownEvent): void;
  childRekey(message: RawChildRekeyEvent): void;
}

export class Vici extends EventEmitter<ViciEvents> {
  private readonly connectionOptions: NetConnectOpts;
  private connection: Socket | null = null;
  private buffer: Buffer | null = null;
  private subscribed: Set<string> = new Set();

  public constructor(socket: string = 'unix:///var/run/charon.vici', private readonly timeout: number = 5000, private readonly idleTimeout: number = 10000) {
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
      connection.setTimeout(this.idleTimeout);
      connection.on('connect', () => {
        this.connection = connection;
        this.emit('connect');
        this.subscribeMany(...this.subscribed)
            .then(() => resolve());
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
        if (this.connection === connection && this.subscribed.size === 0) {
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
      this.subscribed.clear();
      this.connection.end();
      this.connection = null;
    }
  }

  public async sendPacket(type: PacketType, ...packet: (string | Section)[]): Promise<void> {
    if (!this.connection) {
      await this.connect();
    }
    const writer = new ViciWriter();
    writer.writePacket(type, packet);
    this.connection!.write(writer.packet);
  }

  public version(): Promise<Version> {
    return this.doCommand('version');
  }

  public stats(): Promise<Stats> {
    return this.doCommand('stats')
        .then(convertStats);
  }

  public reloadSettings(): Promise<ReloadSettingsStatus> {
    return this.doCommand('reload-settings')
        .then(convertReloadSettings);
  }

  public doCommand(command: 'version'): Promise<VersionResponse>;
  public doCommand(command: 'stats'): Promise<RawStatsResponse>;
  public doCommand(command: 'reload-settings'): Promise<ReloadSettingsResponse>;
  public doCommand(command: 'initiate', request: RawInitiateRequest): Promise<RawInitiateResponse>;
  public doCommand(command: 'terminate', request: RawTerminateRequest): Promise<RawTerminateResponse>;
  public doCommand(command: 'rekey', request: RawRekeyRequest): Promise<RawRekeyResponse>;
  public doCommand(command: 'redirect', request: RawRedirectRequest): Promise<RawRedirectResponse>;
  public doCommand(command: 'install', request: RawInstallRequest): Promise<RawInstallResponse>;
  public doCommand(command: 'uninstall', request: RawUninstallRequest): Promise<RawUninstallResponse>;
  public doCommand(command: 'list-sas', request: RawListSasRequest): Promise<void>;
  public doCommand(command: 'list-policies', request: RawListPoliciesRequest): Promise<void>;
  public doCommand(command: 'list-conns', request: RawListConnsRequest): Promise<void>;
  public doCommand(command: 'get-conns'): Promise<RawGetConnsResponse>;
  public doCommand(command: 'list-certs', request: RawListCertsRequest): Promise<void>;
  public doCommand(command: 'list-authorities', request: RawListAuthoritiesRequest): Promise<void>;
  public doCommand(command: 'get-authorities'): Promise<RawGetAuthoritiesResponse>;
  public doCommand(command: 'load-conn', request: RawLoadConnRequest): Promise<RawLoadConnResponse>;
  public doCommand(command: 'unload-conn', request: RawUnloadConnRequest): Promise<RawUnloadConnResponse>;
  public doCommand(command: 'load-cert', request: RawLoadCertRequest): Promise<RawLoadCertResponse>;
  public doCommand(command: 'load-key', request: RawLoadKeyRequest): Promise<RawLoadKeyResponse>;
  public doCommand(command: 'unload-key', request: RawUnloadKeyRequest): Promise<RawUnloadKeyResponse>;
  public doCommand(command: 'get-keys'): Promise<RawGetKeysResponse>;
  public doCommand(command: 'load-token', request: RawLoadTokenRequest): Promise<RawLoadTokenResponse>;
  public doCommand(command: 'load-shared', request: RawLoadSharedRequest): Promise<RawLoadSharedResponse>;
  public doCommand(command: 'unload-shared', request: RawUnloadSharedRequest): Promise<RawUnloadSharedResponse>;
  public doCommand(command: 'get-shared'): Promise<RawGetSharedResponse>;
  public doCommand(command: 'flush-certs', request: RawFlushCertsRequest): Promise<RawFlushCertsResponse>;
  public doCommand(command: 'clear-creds'): Promise<RawClearCredsResponse>;
  public doCommand(command: 'load-authority', request: RawLoadAuthorityRequest): Promise<RawLoadAuthorityResponse>;
  public doCommand(command: 'unload-authority', request: RawUnloadAuthorityRequest): Promise<RawUnloadAuthorityResponse>;
  public doCommand(command: 'load-pool', request: RawLoadPoolRequest): Promise<RawLoadPoolResponse>;
  public doCommand(command: 'unload-pool', request: RawUnloadPoolRequest): Promise<RawUnloadPoolResponse>;
  public doCommand(command: 'get-pools', request: RawGetPoolsRequest): Promise<RawGetPoolsResponse>;
  public doCommand(command: 'get-algorithms'): Promise<RawGetAlgorithmsResponse>;
  public doCommand(command: 'get-counters', request: RawGetCountersRequest): Promise<RawGetCountersResponse>;
  public doCommand(command: 'reset-counters', request: RawResetCountersRequest): Promise<RawResetCountersResponse>;
  public doCommand(command: string): Promise<Section>;
  public doCommand(command: string, payload: Section): Promise<Section>;
  @noParallel
  public async doCommand(command: string, payload?: object): Promise<object | void> {
    await this.sendPacket(PacketType.CMD_REQUEST, command, ...payload ? [payload as Section] : []);
    const packet = await this.nextPacket(packet => packet.type === PacketType.CMD_RESPONSE || packet.type === PacketType.CMD_UNKNOWN);
    if (packet.type === PacketType.CMD_UNKNOWN) {
      throw new Error('This command seems not to be supported by the charon server!');
    }
    return packet.payload;
  }

  public listSas(): Promise<RawListSaEvent> {
    return this.processListingEvent('list-sas', 'list-sa');
  }

  public listPolicies(): Promise<RawListPolicyEvent> {
    return this.processListingEvent('list-policies', 'list-policy');
  }

  public listConns(): Promise<RawListConnEvent> {
    return this.processListingEvent('list-conns', 'list-conn');
  }

  public listCerts(): Promise<RawListCertEvent> {
    return this.processListingEvent('list-certs', 'list-cert');
  }

  public listAuthority(): Promise<RawListAuthorityEvent> {
    return this.processListingEvent('list-authorities', 'list-authority');
  }

  @noParallel
  public async subscribe(event: EventName | string): Promise<void> {
    if (this.subscribed.has(event)) return;
    await this.sendPacket(PacketType.EVENT_REGISTER, event);
    const packet = await this.nextPacket(packet => packet.type === PacketType.EVENT_CONFIRM || packet.type === PacketType.EVENT_UNKNOWN);
    if (packet.type === PacketType.EVENT_UNKNOWN) {
      throw new Error(`The event ${event} is not supported by the charon server!`);
    }
    this.subscribed.add(event);
    this.emit('subscribe', event);
  }

  public subscribeMany(...events: (EventName | string)[]): Promise<void> {
    return Promise.all(events.map(event => this.unsubscribe(event))) as Promise<any>;
  }

  @noParallel
  public async unsubscribe(event: EventName | string): Promise<boolean> {
    if (!this.subscribed.has(event)) return false;
    if (!this.connection) return true;

    await this.sendPacket(PacketType.EVENT_UNREGISTER, event);
    const packet = await this.nextPacket(packet => packet.type === PacketType.EVENT_CONFIRM || packet.type === PacketType.EVENT_UNKNOWN);
    if (packet.type === PacketType.EVENT_UNKNOWN) {
      return false;
    }
    this.subscribed.delete(event);
    this.emit('unsubscribe', event);

    return true;
  }

  public unsubscribeAll(): Promise<boolean> {
    return Promise.all([...this.subscribed].map(event => this.unsubscribe(event)))
        .then(result => result.every(value => value));
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
        this.processPacket(packet);
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

  private processPacket(packet: InboundPacket): void {
    this.emit('packet', packet);

    if (packet.type === PacketType.EVENT) {
      this.processEvent(packet.event!, packet.payload);
    }
  }

  private processEvent(event: string, payload: Section) {
    this.emit('remoteEvent', event, payload);

    switch (event) {
      case 'log':
        this.emit('log', convertLog(payload as unknown as RawLogEvent));
        break;
      case 'control-log':
        this.emit('controlLog', convertControlLog(payload as unknown as RawControlLogEvent));
        break;
      case 'list-sa':
        this.emit('listSa', payload as unknown as RawListSaEvent);
        break;
      case 'list-policy':
        this.emit('listPolicy', payload as RawListPolicyEvent);
        break;
      case 'list-conn':
        this.emit('listConn', payload as unknown as RawListConnEvent);
        break;
      case 'list-cert':
        this.emit('listCert', payload as unknown as RawListCertEvent);
        break;
      case 'list-authority':
        this.emit('listAuthority', payload as RawListAuthorityEvent);
        break;
      case 'ike-updown':
        this.emit('ikeUpdown', payload as RawIkeUpdownEvent);
        break;
      case 'ike-rekey':
        this.emit('ikeRekey', payload as RawIkeRekeyEvent);
        break;
      case 'child-updown':
        this.emit('childUpdown', payload as RawChildUpdownEvent);
        break;
      case 'child-rekey':
        this.emit('childRekey', payload as RawChildRekeyEvent);
        break;
    }
  }

  private async processListingEvent<T>(command: string, eventName: EventName): Promise<T> {
    const subscribedBefore = this.subscribed.has(eventName);
    if (!subscribedBefore) await this.subscribe(eventName);
    const result: T = {} as T;
    const listener: (event: string, payload: Section) => void = (event, payload) => {
      if (event === eventName) {
        Object.assign(result, payload);
      }
    };
    this.on('remoteEvent', listener);
    await this.doCommand(command);
    this.off('remoteEvent', listener);
    if (!subscribedBefore) await this.unsubscribe(eventName);
    return result;
  }
}
