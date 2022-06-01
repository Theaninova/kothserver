import {ClientRequest, RequestType} from "../request"
import {GameResponse, UnauthorizedResponse} from "../response"
import {GAMES, generateID, playerValid} from "../../state"
import {Game} from "../../game/game"

export interface CreateGameRequest extends ClientRequest<RequestType.CREATE_GAME> {
  username: string
  playerID: number
}

export type CreateGameResponse = GameResponse<RequestType.CREATE_GAME>

export function createGameRoute(request: CreateGameRequest): CreateGameResponse | UnauthorizedResponse {
  if (!playerValid(request.username, request.playerID)) {
    return {
      type: RequestType.UNAUTHORIZED,
    }
  }

  const id = generateID(GAMES)
  const game = (GAMES[id] = new Game(id))

  return {
    ...game.response,
    type: RequestType.CREATE_GAME,
  }
}
