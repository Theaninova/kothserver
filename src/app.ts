import {WebSocketServer} from "ws"
import {PORT} from "./state"
import {messageHandler} from "./api/message-handler"
import {determineTargets} from "./api/determine-targets"
import {RequestType} from "./api/request"

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function importThisFile() {}

export const server = new WebSocketServer({
  port: PORT,
})

server.on("connection", socket => {
  socket.addEventListener("message", event => {
    try {
      const response = messageHandler(event.data)
      const socketResponse = JSON.stringify(response)

      for (const target of determineTargets(response, socket)) {
        target.send(socketResponse)
      }
    } catch (error) {
      console.error(error)
      socket.send(
        JSON.stringify({
          type: RequestType.INTERNAL_SERVER_ERROR,
          message: error instanceof Error ? error.message : JSON.stringify(error),
        }),
      )
    }
  })
})

console.log(`Server listening on port ${PORT}`)
