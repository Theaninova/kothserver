import {Player} from "../api/player"
import {Chess, PieceType, ShortMove, Square} from "chess.js"
import {GameInfo} from "../api/response"

export class Game {
  private readonly chess = new Chess()

  private readonly players: [Player | undefined, Player | undefined] = [undefined, undefined]

  private isCenterPiece(piece: PieceType): boolean {
    return ["d4", "d5", "e4", "e5"].some(square => this.chess.get(square as Square)?.type === piece)
  }

  readonly maxPlayers = 2

  constructor(readonly id: number) {}

  get isFull(): boolean {
    return this.players.every(it => !!it)
  }

  get isDraw(): boolean {
    return this.chess.in_draw() || this.isCenterPiece("k")
  }

  get isOver(): boolean {
    return this.chess.game_over()
  }

  join(player: Player): boolean {
    if (this.isFull) return false
    for (let i = 0; i < this.players.length; i++) {
      if (!this.players[i]) {
        this.players[i] = player
        return true
      }
    }
    return true
  }

  leave(player: Player) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i] === player) {
        this.players[i] = undefined
        return true
      }
    }
    return false
  }

  move(player: Player, move: string | ShortMove): boolean {
    if (this.players[this.chess.turn() === "b" ? 1 : 0]?.playerID !== player.playerID) return false

    return !!this.chess.move(move)
  }

  get moveHistory(): string[] {
    return this.chess.history()
  }

  get winner(): Player | undefined {
    return undefined
  }

  get activePlayers(): Player[] {
    return this.players.filter(it => !!it) as Player[]
  }

  get currentPlayer(): Player {
    return this.players[this.chess.turn() === "b" ? 1 : 0]!
  }

  get fen(): string {
    return this.chess.fen()
  }

  get response(): GameInfo {
    return {
      activePlayerList: this.activePlayers,
      ID: this.id,
      moveHistory: this.moveHistory,
      maxPlayerNumber: 2,
      currentPlayer: this.currentPlayer,
      fen: this.fen,
      over: this.isOver,
      draw: this.isDraw,
    }
  }
}
