# Protocol

We use WebSockets for communication, and JSON for data exchange.

## Base Message Format

```ts
interface Message {
  type: RequestType;    // number, see options below
  stamp?: number | any; // This can be filled with anything you like,
                        // and will simply be copied to the response.
                        // you can use this to match requests and responses,
                        // for example using timestamps.
}
```

## Migration

* Errors are no longer returned as a string, but have their own type
  and will contain a `message` field. This should make it easier to
  handle errors.
* The optional `stamp` field can be added to any message and will be
  copied to the response. It can be filled with anything you like,
  with the intended use being to match requests and responses.
* The `type` field is now included in responses.
* The `GAME_STARTED` message is now used to indicate that you have been
  assigned a game.
* Move responses will be replicated to all players.

## Message Types

All error responses have a negative `type` value, as well as a `message` property.

```ts
enum RequestType {
  LOGIN = 0,

  GET_GAMES = 1,
  CREATE_GAME = 2,
  JOIN_GAME = 3,

  MOVE = 4,
  DATABASE = 5,

  START_TOURNAMENT = 6,
  GET_PLAYERS = 7,
  GAME_STARTED = 8,

  ERROR = -1,
  ILLEGAL_MOVE = -2,
  NOT_IMPLEMENTED = -3,
  INVALID_REQUEST = -4,
  UNAUTHORIZED = -5,
  FULL = -6,
  NOT_FOUND = -7,
}
```

## Specific Responses

```ts
export interface Player {
  playerName: string
  playerID: number
  rating: number
}
```

```ts
interface GameInfo {
  activePlayerList: Player[]
  ID: number
  moveHistory: string[]
  maxPlayerNumber: 2
  currentPlayer: Player
  fen: string
  over: boolean
  draw: boolean
}
```

## Requests

Every specific request and response *extends* the base message

### Login

```ts
interface LoginRequest {
  username: string
  playerID?: number
}

type LoginResponse = Player
```

Errors: `ERROR`

### Get Games

```ts
type GetGamesRequest = Message

interface GetGamesResponse {
  games: GameInfo[]
}
```

### Create Game

```ts
interface CreateGameRequest {
  username: string
  playerID: number
}

type CreateGameResponse = GameInfo
```

Errors: `UNAUTHORIZED`

### Join Game

```ts
/**
 * This is unused
 */
export enum JoinType {
  PLAYER = 1,
  // TODO
}

interface JoinGameRequest {
  username: string
  playerID: number
  joinAsPlayer: JoinType
  gameID: number
}

type JoinGameResponse = GameInfo
```

Errors: `FULL`, `NOT_FOUND`, `UNAUTHORIZED`

### Move

*Caution*: The response will be replicated for all players in the game.

```ts
interface MoveRequest {
  username: string
  playerID: number
  gameID: number
  move: string
}

type MoveResponse = GameInfo
```

Errors: `ERROR`, `UNAUTHORIZED`, `ILLEGAL_MOVE`

### Database

`Not implemented`

### Start Tournament

```ts
interface StartTournamentRequest {
  ticks: number
  gameTimeout: number
}

type StartTournamentResponse = Message
```

### Get Players

`Not implemented`

### Game Started

*Caution*: This is a special message that cannot be sent by the client.

It's used in conjunction with tournaments and will notify the client that
a game they are participating in has started.

```ts
type GameStartedResponse = Message
```
