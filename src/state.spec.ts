import {GAMES, generateID, initState, PLAYER_NAMES, PLAYERS} from "./state"

describe("state", function() {
  beforeEach(function() {
    initState()
  })

  it("should initialize the state", function() {
    expect(GAMES).toEqual({})
    expect(PLAYERS).toEqual({})
    expect(PLAYER_NAMES).toEqual({})
  })

  it("should generate a unique ID", function() {
    const id1 = generateID(GAMES)
    const id2 = generateID(GAMES)
    expect(id1).toBeGreaterThan(0)
    expect(id1).not.toEqual(id2)
  })

  it("should generate a unique ID", function() {
    const id1 = generateID(PLAYERS)
    const id2 = generateID(PLAYERS)
    expect(id1).toBeGreaterThan(0)
    expect(id1).not.toEqual(id2)
  })
})

describe("player", function() {
  beforeEach(function() {
    initState()
  })

  // TODO: playerValid & playerFree should be covered by other tests,
  // but for the sake of completeness they should be covered here explicitly
})
