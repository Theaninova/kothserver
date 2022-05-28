import {ClientRequest, RequestType} from "../request"
import {GameResponse, ServerResponse, UnauthorizedResponse} from "../response"
import {GAMES, PLAYERS, playerValid} from "../../state"

export enum JoinType {
  PLAYER = 1,
  // TODO
}

export interface JoinGameRequest extends ClientRequest<RequestType.JOIN_GAME> {
  username: string,
  playerID: number,
  joinAsPlayer: JoinType,
  gameID: number,
}

export type JoinGameResponse = GameResponse<RequestType.JOIN_GAME>

export interface GameFullError extends ServerResponse<RequestType.FULL> {
  message: string
}

export interface GameNotFoundError extends ServerResponse<RequestType.NOT_FOUND> {
  message: string
}

export function joinGameRoute(request: JoinGameRequest): JoinGameResponse | GameFullError | GameNotFoundError | UnauthorizedResponse {
  const game = GAMES[request.gameID]
  if (!game) {
    return {
      type: RequestType.NOT_FOUND,
      message: `Game ${request.gameID} does not exist`,
    }
  }

  if (game.isFull) {
    return {
      type: RequestType.FULL,
      message: "Game is full",
    }
  }

  if (!playerValid(request.username, request.playerID)) {
    return {
      type: RequestType.UNAUTHORIZED,
    }
  }

  game.join(PLAYERS[request.playerID])

  return {
    type: RequestType.JOIN_GAME,
    ...game.response,
  }
}
