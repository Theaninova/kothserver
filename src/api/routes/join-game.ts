import {ClientRequest, RequestType} from "../request"

export enum JoinType {
  PLAYER = 1,
  // TODO
}

export interface JoinGameRequest extends ClientRequest<RequestType.JOIN_GAME> {
  username: string,
  playerID: string,
  joinAsPlayer: JoinType,
  gameID: number,
}
