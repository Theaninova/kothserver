import {ClientRequest, RequestType} from "./request"
import {loginRoute} from "./routes/login"
import {ServerResponse} from "./response"
import {moveRoute} from "./routes/move"
import {createGameRoute} from "./routes/create-game"
import {getGamesRoute} from "./routes/get-games"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ROUTES: Partial<Record<RequestType, (request: ClientRequest<RequestType> & any) => ServerResponse<RequestType>>> = {
  [RequestType.LOGIN]: loginRoute,
  [RequestType.MOVE]: moveRoute,
  [RequestType.CREATE_GAME]: createGameRoute,
  [RequestType.GET_GAMES]: getGamesRoute,
}
