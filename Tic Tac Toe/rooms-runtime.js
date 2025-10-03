import { Room } from "./Room.js";

// map id to object
let rooms = new Map();

function getRoom(roomId) {
    return rooms.get(roomId);
}

function newRoom(user) {
    let room = new Room(user);
    rooms.set(room.id, room);
    return room;
}

function joinRoom(roomId, user) {
    let room = rooms.get(roomId);
    room.addUser(user);
    return room;
}

function leaveRoom(roomId, user) {
    let room = rooms.get(roomId);
    room.removeUser(user);
}

function setPlayerReady(roomId, user, isReady) {
    let room = rooms.get(roomId);
    if (room.isPlaying == true) {
        throw new Error("Game has started")
    } else {
        user.isReady = isReady;
    }

    let players = Object.values(room.users);
    if (players.length == 2 && players.every(player => player.isReady == true)) {
        room.startGame();
    }

}

function makeMove(roomId, user, move) {
    let room = rooms.get(roomId);
    if (room.isPlaying == true) {
        room.game.playMove(user, move);
    } else {
        throw new Error("No game has started")
    }
}

export default {
    getRoom,
    newRoom,
    joinRoom,
    leaveRoom,
    makeMove,
    setPlayerReady
}