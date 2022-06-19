import {Player} from "../api/player"
import {Chess, PieceType, ShortMove, Square} from "chess.js"
import {GameInfo} from "../api/response"
import {chunk} from "../util/chunk"

export class Game {
  readonly chess = new Chess()

  readonly players: [Player | undefined, Player | undefined] = [undefined, undefined]

  readonly moveTimestamps: number[] = [Date.now()]

  isCenterPiece(piece: PieceType): boolean {
    return ["d4", "d5", "e4", "e5"].some(square => this.chess.get(square as Square)?.type === piece)
  }

  readonly maxPlayers = 2

  readonly gameEnd: Promise<GameInfo>

  onGameEnd!: (response: GameInfo) => void

  timeTerminate: NodeJS.Timeout

  winner: Player | undefined = undefined

  onTimeout() {
    this.winner = this.currentPlayerId === 0 ? this.players[1] : this.players[0]
    this.onGameEnd(this.response)
  }

  constructor(readonly id: number, readonly maxTime: number) {
    this.gameEnd = new Promise<GameInfo>(resolve => {
      this.onGameEnd = resolve
    })

    this.timeTerminate = setTimeout(() => this.onTimeout(), maxTime)
  }

  get isFull(): boolean {
    return this.players.every(it => !!it)
  }

  get isDraw(): boolean {
    return this.chess.in_draw()
  }

  get isOver(): boolean {
    return this.chess.game_over() || this.isCenterPiece("k")
  }

  get timeLeft(): [number, number] {
    return [this.moveTimestamps, this.moveTimestamps.slice(1)].map(
      it =>
        this.maxTime - chunk(it, 2).reduce((accumulator, [a, b]) => accumulator + ((b || Date.now()) - a), 0),
    ) as [number, number]
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
    if (this.currentPlayer?.playerID !== player.playerID) return false

    const currentPlayer = this.currentPlayer
    const valid = !!this.chess.move(move)
    if (this.isOver) {
      clearTimeout(this.timeTerminate)
      this.winner = this.chess.in_checkmate() || this.isCenterPiece("k") ? currentPlayer : undefined
      this.onGameEnd(this.response)
      return true
    }

    this.moveTimestamps.push(Date.now())
    clearTimeout(this.timeTerminate)
    this.timeTerminate = setTimeout(() => this.onTimeout(), this.timeLeft[this.currentPlayerId])

    return valid
  }

  get moveHistory(): string[] {
    return this.chess.history()
  }

  get activePlayers(): [Player, Player] {
    return this.players.filter(it => !!it) as [Player, Player]
  }

  get currentPlayerId(): number {
    return this.chess.turn() === "b" ? 1 : 0
  }

  get currentPlayer(): Player {
    return this.players[this.currentPlayerId]!
  }

  get fen(): string {
    return this.chess.fen()
  }

  get response(): GameInfo {
    return {
      activePlayerList: this.activePlayers,
      ID: this.id,
      timeLeft: this.timeLeft,
      moveHistory: this.moveHistory,
      maxPlayerNumber: 2,
      currentPlayer: this.currentPlayer,
      fen: this.fen,
      winner: this.winner,
      over: this.isOver,
      draw: this.isDraw,
    }
  }
}
