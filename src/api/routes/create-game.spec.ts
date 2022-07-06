import {CreateGameResponse, createGameRoute} from "./create-game"
import {RequestType} from "../request"
import {GAMES, initState, PLAYER_NAMES, PLAYERS} from "../../state"

describe("create game route", function () {
  beforeEach(function () {
    initState()
  })

  it("should bypass auth with a parameter", function () {
    const response = createGameRoute({} as never, true) as CreateGameResponse

    expect(GAMES[response.ID]).toBeDefined()
  })

  it("should not allow unauthorized players to create games", function () {
    const response = createGameRoute({
      username: "test",
      playerID: 1,
      type: RequestType.CREATE_GAME,
    })

    expect(response).toEqual({
      type: RequestType.UNAUTHORIZED,
    })
  })

  it("should create a new game", function () {
    PLAYERS[1] = {
      playerID: 1,
      playerName: "test",
      rating: 1,
    }
    PLAYER_NAMES["test"] = 1

    const response = createGameRoute({
      username: "test",
      playerID: 1,
      type: RequestType.CREATE_GAME,
    }) as CreateGameResponse

    expect(response).toEqual({
      type: RequestType.CREATE_GAME,
      ID: response.ID,
      activePlayerList: [],
      currentPlayer: undefined,
      draw: false,
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      maxPlayerNumber: 2,
      moveHistory: [],
      over: false,
    })
  })
})
