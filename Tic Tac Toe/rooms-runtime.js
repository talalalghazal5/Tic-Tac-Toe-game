import { Room } from "./Room.js";

// map id to object
let rooms = new Map();
// map userId to roomId
let playersRooms = new Map();

function getRooms() {
    return Array.from(rooms.values());
}

function getRoom(roomId) {
    return rooms.get(roomId);
}

function newRoom(user) {
    let room = new Room(user);
    rooms.set(room.id, room);
    playersRooms.set(user.id, room.id);
    return room;
}

function joinRoom(roomId, user) {
    let room = rooms.get(roomId);
    room.addUser(user);
    playersRooms.set(user.id, room.id);
    return room;
}

function leaveRoom(user) {
    let room = getPlayerRoom(user.id);
    room.removeUser(user);
    playersRooms.delete(user.id);
    if (Object.keys(room.users).length == 0) {
        rooms.delete(roomId)
    }
}

function setPlayerReady(user, isReady) {
    let room = getPlayerRoom(user.id)
    if (room.isPlaying == true) {
        throw new Error("Game has started")
    } else {
        user.isReady = isReady;
    }

    //should be moved to Room class
    let players = Object.values(room.users);
    if (players.length == 2 && players.every(player => player.isReady == true)) {
        room.startGame();
    }
}

function makeMove(user, move) {
    let room = getPlayerRoom(user.id)
    if (room.isPlaying == true) {
        room.game.playMove(user, move);
    } else {
        throw new Error("No game has started")
    }
}

function getPlayerRoom(userId) {
    let roomId = playersRooms.get(userId);
    if(roomId == null){
        throw new Error("Player is not in any room");
    }
    return rooms.get(roomId);
}

export default {
    getRooms,
    getRoom,
    newRoom,
    joinRoom,
    leaveRoom,
    makeMove,
    setPlayerReady
}