
# Tic-Tac-Toe WebSocket API Documentation

This document provides a detailed explanation of the WebSocket communication between the Tic-Tac-Toe game client (frontend) and the server (backend).

## Overview

The application uses a WebSocket connection for real-time, two-way communication between the client and the server. This allows for immediate updates on game state, player actions, and room changes.

## WebSocket API

- **URL**: `ws://localhost:3000/ws`

The client establishes a WebSocket connection to this endpoint to start communication with the server.

## Message Format

All messages, both sent and received, are in JSON format.

### Generic Message Structure

```json
{
  "method": "methodName",
  "parameter1": "value1",
  "parameter2": "value2"
}
```

- `method`: (For client-sent messages) A string that specifies the action to be performed.
- `type`: (For server-sent messages) A string that specifies the type of update.
- Additional parameters may be included depending on the message type.

---

## Sent Messages (Client to Server)

These are the messages that the client sends to the server to perform actions.

### `setUsername`

Sets or updates the username for the current user.

**Parameters:**
- `username` (string): The new username.

**Example:**
```json
{
  "method": "setUsername",
  "username": "PlayerOne"
}
```

### `getUserDetails`

Requests the current user's details from the server.

**Example:**
```json
{
  "method": "getUserDetails"
}
```

### `getRooms`

Requests the list of all available game rooms.

**Example:**
```json
{
  "method": "getRooms"
}
```

### `newRoom`

Creates a new game room. The user who creates the room automatically joins it.

**Example:**
```json
{
  "method": "newRoom"
}
```

### `joinRoom`

Joins an existing game room.

**Parameters:**
- `roomId` (number): The ID of the room to join.

**Example:**
```json
{
  "method": "joinRoom",
  "roomId": 1
}
```

### `leaveRoom`

Leaves the current game room.

**Example:**
```json
{
  "method": "leaveRoom"
}
```

### `setReady`

Sets the player's ready status within a room. The game starts when both players are ready.

**Parameters:**
- `isReady` (boolean): The player's ready status.

**Example:**
```json
{
  "method": "setReady",
  "isReady": true
}
```

### `makeMove`

Makes a move on the Tic-Tac-Toe board.

**Parameters:**
- `move` (object): An object containing the row and column of the move.
  - `row` (number): The row index (0, 1, or 2).
  - `col` (number): The column index (0, 1, or 2).

**Example:**
```json
{
  "method": "makeMove",
  "move": {
    "row": 0,
    "col": 1
  }
}
```

---

## Received Messages (Server to Client)

These are the messages that the server sends to the client to provide updates.

### `userDataUpdate`

Sent when the user's data (like username or ID) is updated. This is also sent upon initial connection.

**Parameters:**
- `user` (object): The user object.
  - `id` (number): The user's unique ID.
  - `username` (string): The user's username.

**Example:**
```json
{
  "type": "userDataUpdate",
  "user": {
    "id": 1,
    "username": "PlayerOne"
  }
}
```

### `rooms`

A list of all available rooms. Sent in response to `getRooms`.

**Parameters:**
- `rooms` (array): An array of room objects.

**Example:**
```json
{
  "rooms": [
    { "id": 1, "users": { "1": { "id": 1, "username": "PlayerOne" } }, "isPlaying": false },
    { "id": 2, "users": { "2": { "id": 2, "username": "PlayerTwo" } }, "isPlaying": false }
  ]
}
```

### `room`

Details of a specific room. Sent in response to `getRoom`, `newRoom`, and `joinRoom`.

**Parameters:**
- `room` (object): The room object.

**Example:**
```json
{
  "room": {
    "id": 1,
    "users": {
      "1": { "id": 1, "username": "PlayerOne" },
      "2": { "id": 2, "username": "PlayerTwo" }
    },
    "isPlaying": false
  }
}
```

### `playerRoomUpdate`

Sent to all players in a room when the room's state changes (e.g., a player joins, leaves, or readies up).

**Parameters:**
- `room` (object): The updated room object.

**Example:**
```json
{
  "type": "playerRoomUpdate",
  "room": {
    "id": 1,
    "users": {
      "1": { "id": 1, "username": "PlayerOne", "isReady": true },
      "2": { "id": 2, "username": "PlayerTwo", "isReady": false }
    },
    "isPlaying": false
  }
}
```

### `gameUpdate`

Sent to all players in a room when the game state changes (e.g., a move is made, the game starts, or the game ends).

**Parameters:**
- `game` (object): The updated game state.
  - `board` (array): A 3x3 array representing the game board.
  - `currentPlayerIndex` (number): The index of the current player.
  - `isOver` (boolean): Whether the game is over.
  - `winner` (object | null): The winning player object, or `null` if there is no winner or the game is a draw.

**Example:**
```json
{
  "type": "gameUpdate",
  "game": {
    "board": [
      ["X", "O", 0],
      [0, "X", 0],
      [0, 0, "O"]
    ],
    "currentPlayerIndex": 0,
    "isOver": false,
    "winner": null
  }
}
```

### `error`

Sent when an error occurs on the server.

**Parameters:**
- `message` (string): A description of the error.

**Example:**
```json
{
  "message": "Error processing the request"
}
```
