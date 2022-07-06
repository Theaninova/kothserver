import type {ClientRequest} from "../request"
import {RequestType} from "../request"
import {GameInfo, GameResponse, ServerResponse} from "../response"
import {CONNECTIONS, GAMES, PLAYERS} from "../../state"
import {Game} from "../../game/game"
import {recalculateElo} from "../../elo"
import {shuffle} from "../../util/shuffle"
import {chunk} from "../../util/chunk"
import {CreateGameResponse, createGameRoute} from "./create-game"

export interface StartTournamentRequest extends ClientRequest<RequestType.START_TOURNAMENT> {
  ticks: number
  gameTimeout: number
}

export type GameStartedResponse = GameResponse<RequestType.GAME_STARTED>

export type StartTournamentResponse = ServerResponse<RequestType.START_TOURNAMENT>

export function onGameEnd(game: Game) {
  const players = recalculateElo(game.activePlayers, game.winner)
  if (!process.env.NO_LOG) {
    console.log("[ELO_CHANGE]", performance.now(), players)
  }
  for (const player of players) {
    PLAYERS[player.playerID] = player
  }
}

export function startTournamentRoute(request: StartTournamentRequest): StartTournamentResponse {
  void tournamentManager(request)

  return {
    type: RequestType.START_TOURNAMENT,
  }
}

async function tournamentManager(tournament: StartTournamentRequest): Promise<void> {
  if (!process.env.NO_LOG) {
    console.log("[TOURNAMENT_START]", performance.now(), Object.values(PLAYERS), tournament)
  }

  for (let i = 0; i < tournament.ticks; i++) {
    if (!process.env.NO_LOG) {
      console.log("[TOURNAMENT_TICK]", performance.now(), i)
    }
    await tournamentTick()
  }

  if (!process.env.NO_LOG) {
    console.log("[TOURNAMENT_END]", performance.now(), Object.values(PLAYERS))
  }
}

async function tournamentTick(): Promise<GameInfo[]> {
  return Promise.all(
    chunk(shuffle(Object.values(PLAYERS)), 2)
      .filter(it => it.length === 2)
      .map(players => {
        const game = GAMES[(createGameRoute({} as never, true) as CreateGameResponse).ID]
        for (const player of players) {
          game.join(player)
          setTimeout(() =>
            CONNECTIONS[player.playerID].send(
              JSON.stringify({
                ...game.response,
                type: RequestType.GAME_STARTED,
              }),
            ),
          )
        }
        return game.gameEnd
      }),
  )
}
