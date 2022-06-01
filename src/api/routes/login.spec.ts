import {loginRoute} from "./login"
import {RequestType} from "../request"
import {ErrorResponse, PlayerInfoResponse} from "../response"
import {initState, PLAYER_NAMES, PLAYERS} from "../../state"

describe("login route", function () {
  beforeEach(function () {
    initState()
  })

  it("should allow login with new username", function () {
    const response = loginRoute({
      type: RequestType.LOGIN,
      username: "test",
    }) as PlayerInfoResponse<RequestType.LOGIN>

    expect(response.type).toBe(RequestType.LOGIN)
    expect(typeof response.playerID).toBe("number")
    expect(response.playerName).toBe("test")

    expect(PLAYER_NAMES["test"]).toBe(response.playerID)
    expect(PLAYERS[response.playerID]).toEqual({
      playerID: response.playerID,
      playerName: "test",
    })
  })

  it("should refuse login with wrong ID", function () {
    const firstPlayer = loginRoute({
      type: RequestType.LOGIN,
      username: "test",
    }) as PlayerInfoResponse<RequestType.LOGIN>

    const response = loginRoute({
      type: RequestType.LOGIN,
      username: "test",
      playerID: firstPlayer.playerID + 1,
    }) as ErrorResponse

    expect(response.type).toBe(RequestType.ERROR)
    expect(response.message).toBe("Username/ID mismatch")
  })

  it("should login a player with an ID supplied that doesn't exist yet", function () {
    const response = loginRoute({
      type: RequestType.LOGIN,
      username: "test",
      playerID: 1,
    }) as PlayerInfoResponse<RequestType.LOGIN>

    expect(response.type).toBe(RequestType.LOGIN)
    expect(response.playerID).toBe(1)
    expect(response.playerName).toBe("test")

    expect(PLAYER_NAMES["test"]).toBe(response.playerID)
    expect(PLAYERS[response.playerID]).toEqual({
      playerID: 1,
      playerName: "test",
    })
  })

  it("should login an existing user", function () {
    const firstPlayer = loginRoute({
      type: RequestType.LOGIN,
      username: "test",
    }) as PlayerInfoResponse<RequestType.LOGIN>

    const response = loginRoute({
      type: RequestType.LOGIN,
      username: "test",
      playerID: firstPlayer.playerID,
    }) as PlayerInfoResponse<RequestType.LOGIN>

    expect(response.type).toBe(RequestType.LOGIN)
    expect(response.playerID).toBe(firstPlayer.playerID)
    expect(response.playerName).toBe("test")
  })
})
