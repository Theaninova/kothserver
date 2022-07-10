import {ClientRequest, RequestType} from "../request"
import {ErrorResponse, GameResponse, IllegalMoveResponse, UnauthorizedResponse} from "../response"
import {GAMES, playerValid} from "../../state"
import {Square} from "chess.js"
import {onGameEnd} from "./start-tournament"

export interface MoveRequest extends ClientRequest<RequestType.MOVE> {
  username: string
  playerID: number
  gameID: number
  move: string
}

export type MoveResponse = GameResponse<RequestType.MOVE>

export function moveRoute(
  request: MoveRequest,
): MoveResponse | ErrorResponse | UnauthorizedResponse | IllegalMoveResponse {
  if (!playerValid(request.username, request.playerID)) {
    return {
      type: RequestType.UNAUTHORIZED,
    }
  }

  const game = GAMES[request.gameID]
  if (!game) {
    return {
      type: RequestType.ERROR,
      message: `Game ${request.gameID} does not exist`,
    }
  }

  if (game.currentPlayer.playerID !== request.playerID) {
    return {
      type: RequestType.ILLEGAL_MOVE,
      message: "Not your turn",
    }
  }

  const match = request.move.match(/([a-h][1-8])([a-h][1-8])([NnBbQqRr])?/)

  if (!match) {
    return {
      type: RequestType.ILLEGAL_MOVE,
      message: "Format Mismatch",
    }
  }

  const [, from, to, promotion] = match
  if (
    game.move(game.currentPlayer, {from: from as Square, to: to as Square, promotion: promotion as never})
  ) {
    return {
      ...game.response,
      type: RequestType.MOVE,
    }
  }

  return {
    type: RequestType.ILLEGAL_MOVE,
    message: "Illegal move",
  }
}
