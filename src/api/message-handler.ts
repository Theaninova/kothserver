import {Data} from "ws"
import {ClientRequest, RequestType} from "./request"
import {ROUTES} from "./routes"
import {ServerResponse} from "./response"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function messageHandler(raw: Data): ServerResponse<RequestType> & any {
  try {
    const request = JSON.parse(raw as unknown as string) as ClientRequest<RequestType>
    const stamp = request.stamp

    const route = ROUTES[request.type]

    if (!route) {
      return {
        type: RequestType.NOT_IMPLEMENTED,
        message: `Route ${request.type} not implemented`,
        stamp,
      }
    }

    return {...route!(request), stamp}
  } catch (error) {
    return {
      type: RequestType.INVALID_REQUEST,
      message: `Invalid Request: ${error}`,
    }
  }
}
