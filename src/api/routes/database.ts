import {ClientRequest, RequestType} from "../request"

export interface DatabaseRequest extends ClientRequest<RequestType.DATABASE> {
  gameCount: number,
  gameID: number,
  gameType: string,
}
