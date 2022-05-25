import {RequestType} from "./request"
import {CONNECTIONS, initState} from "../state"
import {determineTargets} from "./determine-targets"
import {WebSocket} from "ws"

describe("determine targets", function() {
  beforeEach(function() {
    initState()
  })

  it("should add the current socket to connections if it logs in", function() {
    const socketMock = {
      id: "123",
    } as unknown as WebSocket

    const targets = determineTargets({
      type: RequestType.LOGIN,
      playerID: 123,
    }, socketMock)

    expect(targets).toEqual([socketMock])
    expect(CONNECTIONS[123]).toEqual(socketMock)
  })
})
