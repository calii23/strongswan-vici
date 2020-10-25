import {createConnection, NetConnectOpts, Socket} from 'net';
import {parse} from 'url';
import {EventEmitter} from './event';

interface ViciEvents {
  error(error: Error): void;
}

export class Vici extends EventEmitter<ViciEvents> {
  private readonly connectionOptions: NetConnectOpts;
  private connection: Socket | null = null;
  private buffer: Buffer | null = null;

  public constructor(socket: string = 'unix:///var/run/charon.vici') {
    super();
    const url = parse(socket);

    if (url.protocol === 'unix:') {
      if (!url.path) throw new Error('Missing path for unix socket url: ' + socket);
      this.connectionOptions = {path: url.path};
    } else if (url.protocol === 'tcp:') {
      if (!url.host) throw new Error('Missing host for tcp socket url: ' + socket);
      if (!url.port) throw new Error('Missing host for tcp socket url: ' + socket);
      this.connectionOptions = {
        host: url.host,
        port: Number(url.port)
      };
    } else {
      throw new Error('Only unix or tcp connections are supported! Invalid socket url: ' + socket);
    }
  }

  public connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const connection = createConnection(this.connectionOptions);
      connection.on('connect', () => {
        this.connection = connection;
        resolve();
      });
      connection.on('error', err => {
        if (this.connection === connection) {
          this.connection = null;
          this.emit('error', err);
        } else {
          reject(err);
        }
      });
      connection.on('close', () => this.connection = null);
      connection.on('timeout', () => {
        const error = new Error('The connection has been timed out');
        if (this.connection === connection) {
          this.connection = null;
          this.emit('error', error);
        } else {
          reject(error);
        }
      });

      connection.on('data', data => {
        if (this.buffer) {
          data = Buffer.concat([this.buffer, data]);
        }

        try {
          // TODO: decode the packet
          this.buffer = null;
        } catch {
          this.buffer = data;
        }
      });
    });
  }

  public close(): void {
    if (this.connection) {
      this.connection.end();
      this.connection = null;
    }
  }

  // TODO: sending packets
}
