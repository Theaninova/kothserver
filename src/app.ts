import {WebSocketServer} from "ws"
import {PORT} from "./state"
import {messageHandler} from "./api/message-handler"
import {determineTargets} from "./api/determine-targets"

export const server = new WebSocketServer({
  port: PORT,
})

server.on("connection", socket => {
  socket.addEventListener("message", event => {
    const response = messageHandler(event.data)
    const socketResponse = JSON.stringify(response)

    for (const target of determineTargets(response, socket)) {
      target.send(socketResponse)
    }
  })
})

console.log(`Server listening on port ${PORT}`)
