import {ClientRequest, RequestType} from "../request"
import {ErrorResponse, PlayerInfoResponse} from "../response"
import {generateID, PLAYER_NAMES, playerValid, PLAYERS, playerFree} from "../../state"
import {INITIAL_RATING} from "../../elo"

export interface LoginRequest extends ClientRequest<RequestType.LOGIN> {
  username: string
  playerID?: number
}

export type LoginResponse = PlayerInfoResponse<RequestType.LOGIN>

export function loginRoute(request: LoginRequest): LoginResponse | ErrorResponse {
  if (playerValid(request.username, request.playerID)) {
    return {
      playerName: request.username,
      playerID: request.playerID,
      rating: INITIAL_RATING,
      type: RequestType.LOGIN,
    }
  } else if (playerFree(request.username, request.playerID)) {
    PLAYER_NAMES[request.username] = request.playerID
    PLAYERS[request.playerID] = {
      playerID: request.playerID,
      playerName: request.username,
      rating: INITIAL_RATING,
    }
    return {
      ...PLAYERS[request.playerID],
      type: RequestType.LOGIN,
    }
  } else if (request.username && PLAYER_NAMES[request.username]) {
    return {
      type: RequestType.ERROR,
      message: "Username/ID mismatch",
    }
  } else {
    const id = generateID(PLAYERS)
    PLAYER_NAMES[request.username] = id
    PLAYERS[id] = {
      playerID: id,
      playerName: request.username,
      rating: INITIAL_RATING,
    }

    return {
      ...PLAYERS[id],
      type: RequestType.LOGIN,
    }
  }
}
