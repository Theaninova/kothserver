import {Game} from "./game"

describe("game", function () {
  it("should timeout if player 1 doesn't move and let player 2 win", async function () {
    const game = new Game(1, 20)
    game.join(1234 as never)
    game.join(5678 as never)

    return game.gameEnd.then(game => {
      expect(game.winner).toBe(5678)
    })
  })

  it("should timeout if player 2 doesn't move and let player 1 win", async function () {
    const game = new Game(1, 20)
    game.join(1234 as never)
    game.join(5678 as never)
    expect(game.move(1234 as never, "a3")).toBe(true)

    return game.gameEnd.then(game => {
      expect(game.winner).toBe(1234)
    })
  })

  it("should have the current player be the first player that joined", function () {
    const game = new Game(1, 20)
    game.join(1234 as never)
    game.join(5678 as never)
    expect(game.currentPlayer).toBe(1234)
  })

  it("should have the current player switched after a legal move", function () {
    const game = new Game(1, 20)
    game.join(1234 as never)
    game.join(5678 as never)
    expect(game.move(1234 as never, "a3")).toBe(true)
    expect(game.currentPlayer).toBe(5678)
  })

  it("should not accept an illegal move", function () {
    const game = new Game(1, 20)
    game.join(1234 as never)
    game.join(5678 as never)
    expect(
      game.move(1234 as never, {
        from: "a2",
        to: "a5",
      }),
    ).toBe(false)
  })

  it("should end on win", async function () {
    const game = new Game(1, 20)
    game.join(1234 as never)
    game.join(5678 as never)
    game.chess.load("4k3/8/8/8/8/3Q4/8/4K3 w - - 0 1")
    const onEnd = game.gameEnd.then(response => {
      expect(response.winner).toBe(1234)
    })
    expect(
      game.move(1234 as never, {
        from: "d3",
        to: "e3",
      }),
    ).toBe(true)

    return onEnd
  })

  it("should end when king reaches the center", function () {
    const game = new Game(1, 20)
    game.join(1234 as never)
    game.join(5678 as never)
    game.chess.load("4k3/8/8/8/8/4K3/8/8 w - - 0 1")
    const onEnd = game.gameEnd.then(response => {
      expect(response.winner).toBe(1234)
    })
    expect(
      game.move(1234 as never, {
        from: "e3",
        to: "e4",
      }),
    ).toBe(true)

    return onEnd
  })
})
