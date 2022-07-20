import {ClientRequest, RequestType} from "../request"
import {GameResponse, UnauthorizedResponse} from "../response"
import {GAMES, generateID, playerValid} from "../../state"
import {Game} from "../../game/game"

export interface CreateGameRequest extends ClientRequest<RequestType.CREATE_GAME> {
  username: string
  playerID: number
  timeout?: number
  gameRetentionTime?: number
}

export type CreateGameResponse = GameResponse<RequestType.CREATE_GAME>

export function createGameRoute(
  request: CreateGameRequest,
  internalAuth = false,
): CreateGameResponse | UnauthorizedResponse {
  if (
    !internalAuth &&
    !playerValid(request.username, request.playerID) &&
    request.username !== "PawnAttack"
  ) {
    return {
      type: RequestType.UNAUTHORIZED,
    }
  }

  const id = generateID(GAMES)
  const game = (GAMES[id] = new Game(id, request.timeout, request.gameRetentionTime))

  return {
    ...game.response,
    type: RequestType.CREATE_GAME,
  }
}
