import { Room } from "./Room.js";
import { broadcastToRoom } from "./websocket-broadcaster.js";

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
    if (playersRooms.has(user.id)) {
        throw new Error("Player is already in a room.");
    }
    let room = new Room(user);
    rooms.set(room.id, room);
    playersRooms.set(user.id, room.id);
    user.isReady = false;
    broadcastToRoom(room.id, { type: 'playerRoomUpdate', room: room });
    return room;
}

function joinRoom(roomId, user) {
    if (playersRooms.has(user.id)) {
        throw new Error("Player is already in a room.");
    }
    let room = rooms.get(roomId);
    if (!room) {
        throw new Error("Room not found.");
    }
    if (room.isPlaying) {
        throw new Error("Cannot join a room with a game in progress.");
    }
    room.addUser(user);
    playersRooms.set(user.id, room.id);
    user.isReady = false;
    broadcastToRoom(room.id, { type: 'playerRoomUpdate', room: room });
    return room;
}

function leaveRoom(user) {
    let room = getPlayerRoom(user.id);
    room.removeUser(user);
    
    playersRooms.delete(user.id);
    if (Object.keys(room.users).length == 0) {
        rooms.delete(room.id);
    } else {
        broadcastToRoom(room.id, { type: 'playerRoomUpdate', room: room });
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
    broadcastToRoom(room.id, { type: 'playerRoomUpdate', room: room });
}

function makeMove(user, move) {
    let room = getPlayerRoom(user.id)
    if (room.isPlaying == true) {
        room.game.playMove(user, move);
        broadcastToRoom(room.id, { type: 'playerRoomUpdate', room: room });
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