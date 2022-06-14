import {Game} from "./game/game"
import {Player} from "./api/player"
import {WebSocket} from "ws"

export const PORT = Number(process.env.PORT) || 8025

export let GAMES: Record<number, Game> = {}
export let PLAYERS: Record<number, Player> = {}
export let PLAYER_NAMES: Record<string, number> = {}
export let CONNECTIONS: Record<number, WebSocket> = {}

export function initState() {
  GAMES = {}
  PLAYERS = {}
  PLAYER_NAMES = {}
  CONNECTIONS = {}
}

export function generateID(target: Record<number, unknown>): number {
  let id
  do {
    id = Math.floor(Math.random() * 1_000_000)
  } while (target[id])
  return id
}

export function playerValid(username?: string, playerID?: number): playerID is number {
  return !!playerID && !!username && !!PLAYER_NAMES[username] && username === PLAYERS[playerID]?.playerName
}

export function playerFree(username?: string, playerID?: number): playerID is number {
  return !!playerID && !!username && !PLAYER_NAMES[username] && !PLAYERS[playerID]
}
