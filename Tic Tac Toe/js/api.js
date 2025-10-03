import { eventBus } from "./events.js"

function setUsername(newUsername) {
    let data = {
        method: "setUsername",
        username: newUsername
    };
    let customEvent = new CustomEvent('SendMessage', { detail: data });
    eventBus.dispatchEvent(customEvent);
}

function getUserDetails() {
    let data = {
        method: "getUserDetails"
    };
    let customEvent = new CustomEvent('SendMessage', { detail: data });
    eventBus.dispatchEvent(customEvent);
}

function getRooms(params) {
    let data = {
        method: "getRooms"
    };
    let customEvent = new CustomEvent('SendMessage', { detail: data });
    eventBus.dispatchEvent(customEvent);
}

function newRoom() {
    let data = {
        method: "newRoom"
    };
    let customEvent = new CustomEvent('SendMessage', { detail: data });
    eventBus.dispatchEvent(customEvent);
}

function joinRoom(roomId) {
    let data = {
        method: "joinRoom",
        roomId: roomId
    };
    let customEvent = new CustomEvent('SendMessage', { detail: data });
    eventBus.dispatchEvent(customEvent);
}

function leaveRoom() {
    let data = {
        method: "leaveRoom"
    };
    let customEvent = new CustomEvent('SendMessage', { detail: data });
    eventBus.dispatchEvent(customEvent);
}

function setReady(params) {
  //todo
}

function playMove(move) {//todo
    let data = {
        method: "playMove",
        move: move
    };
    let customEvent = new CustomEvent('SendMessage', { detail: data });
    eventBus.dispatchEvent(customEvent);
}

export default {
    setUsername,
    getUserDetails,
    getRooms,
    newRoom,
    joinRoom,
    leaveRoom,
    setReady,
    playMove
}