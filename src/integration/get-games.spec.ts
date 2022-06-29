import {WebSocket} from "ws"
import {GAMES, initState, PORT} from "../state"
import {importThisFile} from "../app"
import {RequestType} from "../api/request"
import {GetGamesRequest} from "../api/routes/get-games"
import {Game} from "../game/game"

describe("integration", function () {
  beforeEach(() => {
    initState()
    importThisFile()
  })

  describe("get-games", function () {
    it("should return active games", function () {
      const client = new WebSocket(`ws://localhost:${PORT}`)

      GAMES[123] = new Game(123)

      const getGamesRequest: GetGamesRequest = {
        type: RequestType.GET_GAMES,
      }

      return new Promise(resolve => {
        client.on("message", data => {
          const response = JSON.parse(data.toString())
          expect(response.type).toBe(RequestType.GET_GAMES)
          expect(response.games.length).toBe(1)

          resolve(0)
        })
        client.on("open", () => {
          client.send(JSON.stringify(getGamesRequest))
        })
      })
    })
  })
})
