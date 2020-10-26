import {ElementType, PacketType, Section} from './general';

export class ViciWriter {
  private buffer: Buffer = Buffer.alloc(512);
  private cursor: number = 0;

  public get packet(): Buffer {
    const packet = Buffer.concat([new Uint8Array(4), this.buffer.subarray(0, this.cursor)]);
    packet.writeUInt32BE(this.cursor);
    return packet;
  }

  public writePacket(type: PacketType, payload: (string | Section)[]): void {
    this.writeUInt8(type);
    for (const payloadElement of payload) {
      if (typeof payloadElement === 'string') {
        this.writeShortString(payloadElement);
      } else {
        this.writeSection(payloadElement);
      }
    }
  }

  public writeUInt8(value: number): void {
    this.ensureLength(1);
    this.cursor = this.buffer.writeUInt8(value, this.cursor);
  }

  public writeUInt16(value: number): void {
    this.ensureLength(2);
    this.cursor = this.buffer.writeUInt16BE(value, this.cursor);
  }

  public writeUInt32(value: number): void {
    this.ensureLength(4);
    this.cursor = this.buffer.writeUInt32BE(value, this.cursor);
  }

  public writeSection(data: Section) {
    for (const key in data) {
      if (!data.hasOwnProperty(key)) continue;
      const value = data[key];

      if (typeof value === 'string') {
        this.ensureLength(key.length + value.length + 4);
        this.writeUInt8(ElementType.KEY_VALUE);
        this.writeShortString(key);
        this.writeLongString(value);
      } else if (Array.isArray(value)) {
        this.writeUInt8(ElementType.LIST_START);
        this.writeShortString(key);
        this.writeList(value);
      } else {
        this.writeUInt8(ElementType.SECTION_START);
        this.writeShortString(key);
        this.writeSection(value);
      }
    }

    this.writeUInt8(ElementType.SECTION_END);
  }

  public writeList(data: string[]): void {
    data.forEach(value => {
      this.writeUInt8(ElementType.LIST_ITEM);
      this.writeLongString(value);
    });
    this.writeUInt8(ElementType.LIST_END);
  }

  public writeShortString(value: string): void {
    const length = Buffer.byteLength(value);
    this.writeUInt8(length);
    this.ensureLength(length);
    this.cursor += this.buffer.write(value, this.cursor);
  }

  public writeLongString(value: string): void {
    const length = Buffer.byteLength(value);
    this.writeUInt16(length);
    this.ensureLength(length);
    this.cursor += this.buffer.write(value, this.cursor);
  }

  private get remaining(): number {
    return this.buffer.length - this.cursor;
  }

  private ensureLength(length: number): void {
    if (this.remaining < length) {
      const newBuffer = Buffer.alloc(this.buffer.length + length + 512);
      this.buffer.copy(newBuffer);
      this.buffer = newBuffer;
    }
  }
}
