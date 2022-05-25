import {getGamesRoute} from "./get-games"
import {RequestType} from "../request"
import {GAMES, initState} from "../../state"
import {Game} from "../../game/game"

describe("get games", function() {
  beforeEach(function() {
    initState()
  })

  it("should return all games", function() {
    const game1 = new Game(123)
    const game2 = new Game(12)
    GAMES[123] = game1
    GAMES[12] = game2

    const response = getGamesRoute({
      type: RequestType.GET_GAMES,
    })

    expect(response.type).toBe(RequestType.GET_GAMES)
    expect(response.games).toEqual([
      game1.response,
      game2.response,
    ])
  })
})
