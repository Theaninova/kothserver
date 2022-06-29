import {WebSocket} from "ws"
import {initState, PORT} from "../state"
import {importThisFile} from "../app"
import {JoinGameRequest} from "../api/routes/join-game"
import {RequestType} from "../api/request"

describe("game", function () {
  beforeEach(() => {
    initState()
    importThisFile()
  })

  it("should join a new player", function () {
    const client = new WebSocket(`ws://localhost:${PORT}`)

    const joinRequest: JoinGameRequest = {
      type: RequestType.JOIN_GAME,
      username: "abc",
      playerID: 123,
    }

    return new Promise(resolve => {
      client.on("message", data => {
        const response = JSON.parse(data.toString())
        expect(response.type).toBe("join")
        expect(response.playerID).toBeGreaterThan(0)
        expect(response.playerName).toBe("player1")
        expect(response.games).toEqual([])
        expect(true).toBe(false)

        resolve(0)
      })

      client.send(JSON.stringify(joinRequest))
    })
  })
})
