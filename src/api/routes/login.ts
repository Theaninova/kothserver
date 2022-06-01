import {ClientRequest, RequestType} from "../request"
import {ErrorResponse, PlayerInfoResponse} from "../response"
import {generateID, PLAYER_NAMES, playerValid, PLAYERS, playerFree} from "../../state"

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
      type: RequestType.LOGIN,
    }
  } else if (playerFree(request.username, request.playerID)) {
    PLAYER_NAMES[request.username] = request.playerID
    PLAYERS[request.playerID] = {
      playerID: request.playerID,
      playerName: request.username,
    }
    return {
      playerName: request.username,
      playerID: request.playerID,
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
    }

    return {
      playerName: request.username,
      playerID: id,
      type: RequestType.LOGIN,
    }
  }
}
