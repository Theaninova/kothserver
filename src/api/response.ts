import {RequestType} from "./request"
import {Player} from "./player"

export interface ServerResponse<T extends RequestType> {
  type: T
  stamp?: number
}

export type PlayerInfoResponse<T extends RequestType> = ServerResponse<T> & Player

export interface GameInfo {
  activePlayerList: Player[]
  timeLeft?: [number, number]
  moveTimestamps: number[]
  ID: number
  moveHistory: string[]
  maxPlayerNumber: 2
  currentPlayer: Player
  winner?: Player
  fen: string
  over: boolean
  draw: boolean
}

export interface GameResponse<T extends RequestType> extends ServerResponse<T>, GameInfo {}

export interface ErrorResponse extends ServerResponse<RequestType.ERROR> {
  message: string
}

export type UnauthorizedResponse = ServerResponse<RequestType.UNAUTHORIZED>

export interface IllegalMoveResponse extends ServerResponse<RequestType.ILLEGAL_MOVE> {
  message: string
}

export interface NotImplementedResponse extends ServerResponse<RequestType.NOT_IMPLEMENTED> {
  message: string
}
