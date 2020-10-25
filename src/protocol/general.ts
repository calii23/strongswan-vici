export const enum PacketType {
  CMD_REQUEST = 0,
  CMD_RESPONSE = 1,
  CMD_UNKNOWN = 2,
  EVENT_REGISTER = 3,
  EVENT_UNREGISTER = 4,
  EVENT_CONFIRM = 5,
  EVENT_UNKNOWN = 6,
  EVENT = 7
}

export const enum ElementType {
  SECTION_START = 1,
  SECTION_END = 2,
  KEY_VALUE = 3,
  LIST_START = 4,
  LIST_ITEM = 5,
  LIST_END = 6
}

export interface InboundPacket {
  type: PacketType;
  payload: Section;
}

export type Section = {
  [key: string]: string | string[] | Section;
};
