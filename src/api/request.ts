export enum RequestType {
  LOGIN = 0,

  GET_GAMES = 1,
  CREATE_GAME = 2,
  JOIN_GAME = 3,

  MOVE = 4,
  DATABASE = 5,

  START_TOURNAMENT = 6,

  ERROR = -1,
  ILLEGAL_MOVE = -2,
  NOT_IMPLEMENTED = -3,
  INVALID_REQUEST = -4,
  UNAUTHORIZED = -5,
  FULL = -6,
  NOT_FOUND = -7,
}

export interface ClientRequest<T extends RequestType> {
  type: T
  stamp?: number
}
