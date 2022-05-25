import {ClientRequest, RequestType} from "../request"
import {GameInfo, ServerResponse} from "../response"
import {GAMES} from "../../state"

export type GetGamesRequest = ClientRequest<RequestType.GET_GAMES>

export interface GetGamesResponse extends ServerResponse<RequestType.GET_GAMES> {
  games: GameInfo[]
}

export function getGamesRoute(_request: GetGamesRequest): GetGamesResponse {
  return {
    type: RequestType.GET_GAMES,
    games: Object.values(GAMES).map(it => it.response).sort((a, b) => b.ID - a.ID),
  }
}
