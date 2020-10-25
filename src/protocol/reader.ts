import {ElementType, InboundPacket, PacketType, Section} from './general';

export class ViciReader {
  private cursor: number = 0;
  private packetEnd: number;

  public constructor(private readonly data: Buffer) {
    this.packetEnd = data.length;
  }

  public get remaining(): number {
    return this.packetEnd - this.cursor;
  }

  public get readBytes(): number {
    return this.cursor;
  }

  public readPacket(): InboundPacket | false {
    if (this.remaining < 4) return false;

    const length = this.readUInt32();
    if (this.remaining < length) {
      this.cursor -= 4;
      return false;
    }
    this.packetEnd = this.cursor + length;
    const type: PacketType = this.readUInt8();

    let event: string | undefined = undefined;
    if (type === PacketType.EVENT) {
      event = this.readShortString();
    }

    const payload = this.readSection();
    this.packetEnd = this.data.length;

    return {
      type,
      event,
      payload
    };
  }

  public readUInt8(): number {
    this.ensureLength(1);
    const number = this.data.readUInt8(this.cursor);
    this.cursor += 1;
    return number;
  }

  public readUInt16(): number {
    this.ensureLength(2);
    const number = this.data.readUInt16BE(this.cursor);
    this.cursor += 2;
    return number;
  }

  public readUInt32(): number {
    this.ensureLength(4);
    const number = this.data.readUInt32BE(this.cursor);
    this.cursor += 4;
    return number;
  }

  public readSection(): Section {
    const section: Section = {};

    while (this.remaining) {
      const type: ElementType = this.readUInt8();

      switch (type) {
        case ElementType.SECTION_START:
          section[this.readShortString()] = this.readSection();
          break;
        case ElementType.SECTION_END:
          return section;
        case ElementType.KEY_VALUE:
          section[this.readShortString()] = this.readLongString();
          break;
        case ElementType.LIST_START:
          section[this.readShortString()] = this.readList();
          break;
        default:
          throw new Error(`Invalid code for element type in section: ${type}`);
      }
    }

    return section;
  }

  public readList(): string[] {
    const list: string[] = [];

    while (this.remaining) {
      const type: ElementType = this.readUInt8();

      switch (type) {
        case ElementType.LIST_ITEM:
          list.push(this.readLongString());
          break;
        case ElementType.LIST_END:
          return list;
        default:
          throw new Error(`Invalid code for element type in list: ${type}`);
      }
    }

    throw new Error('Unfinished list!');
  }

  public readShortString(): string {
    return this.readString(this.readUInt8());
  }

  public readLongString(): string {
    return this.readString(this.readUInt16());
  }

  private readString(length: number): string {
    this.ensureLength(length);
    const string = this.data.toString('utf8', this.cursor, this.cursor + length);
    this.cursor += length;
    return string;
  }

  private ensureLength(length: number): void {
    if (this.remaining < length) {
      throw new Error(`Expected at least ${length} remaining bytes! Got only ${this.remaining}`);
    }
  }
}
