import {ServerResponse} from "./response"
import {RequestType} from "./request"
import {CONNECTIONS} from "../state"
import {WebSocket} from "ws"
import {LoginResponse} from "./routes/login"
import {MoveResponse} from "./routes/move"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function determineTargets(response: ServerResponse<RequestType> & any, self: WebSocket): WebSocket[] {
  switch (response.type) {
    case RequestType.LOGIN:
      CONNECTIONS[(response as LoginResponse).playerID] = self
      return [self]
    case RequestType.MOVE:
      return (response as MoveResponse).activePlayerList.map(player => CONNECTIONS[player.playerID])
  }

  return [self]
}
