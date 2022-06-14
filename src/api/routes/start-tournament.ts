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
  for (let i = 0; i < tournament.ticks; i++) {
    await tournamentTick()
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
            CONNECTIONS[player.playerID].send({
              ...game.response,
              type: RequestType.GAME_STARTED,
            }),
          )
        }
        return game.gameEnd
      }),
  )
}
