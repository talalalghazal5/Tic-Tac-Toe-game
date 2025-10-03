import { Game } from "./Game.js";

export class Room {
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

    startGame() {
        if (Object.keys(this.users).length !== 2) {
            throw new Error("Insufficient number of players");
        }
        this.game = new Game();
        this.isPlaying = true;
    }
}
