import { Game } from "./game.js";

// map id to object
let rooms = new Map();

function getRoom(roomId){
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

function makeMove(roomId, user, move) {
    let room = rooms.get(roomId);
    if(room.isPlaying == true){
        room.game.playMove(user, move);
    }else{
        throw new Error("No game has started")
    }
}

function leaveRoom(roomId, user) {
    let room = rooms.get(roomId);
    room.removeUser(user);
}

export default {
    getRoom,
    newRoom,
    joinRoom,
    makeMove,
    leaveRoom
}

class Room {
    static nextRoomId = 1;
    constructor(user) {
        this.id = Room.nextRoomId;
        Room.nextRoomId++;

        this.users = {};
        this.users[user.id] = user;

        this.isPlaying = false;
    }

    addUser(user) {
        if (Object.keys(this.users).length >= 2) {
            throw new Error("This room is full");
        }
        this.users[user.id] = user;
    }

    removeUser(user) {
        delete this.users[user.id];
    }

    startGame(){
        if(Object.keys(this.users).length !== 2){
            throw new Error("Insufficient number of players");
        }
        this.game = new Game();
        this.isPlaying = true;
    }
}