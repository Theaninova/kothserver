import {Player} from "./api/player"

function expectation(ratingA: number, ratingB: number, raWinProbability = 400): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / raWinProbability))
}

function calculateElo(rating: number, expected: number, actual: number, kFactor = 32): number {
  return rating + kFactor * (actual - expected)
}

function actual(player: Player, winner?: Player): number {
  return winner ? (winner.playerID === player.playerID ? 1 : 0) : 0.5
}

export const INITIAL_RATING = 1500

export function recalculateElo(players: [Player, Player], winner?: Player): [Player, Player] {
  const [playerA, playerB] = players
  const [ratingA, ratingB] = [playerA.rating, playerB.rating]
  const [expectedA, expectedB] = [expectation(ratingA, ratingB), expectation(ratingB, ratingA)]
  const [actualA, actualB] = [actual(playerA, winner), actual(playerB, winner)]
  return [
    {
      ...playerA,
      rating: calculateElo(ratingA, expectedA, actualA),
    },
    {
      ...playerB,
      rating: calculateElo(ratingB, expectedB, actualB),
    },
  ]
}
