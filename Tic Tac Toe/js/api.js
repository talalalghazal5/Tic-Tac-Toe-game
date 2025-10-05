import { eventBus } from "./events.js"

function sendMessage(method, extraData = {}) {
    const data = { method, ...extraData };
    const customEvent = new CustomEvent('SendMessage', { detail: data });
    eventBus.dispatchEvent(customEvent);
}

function setUsername(newUsername) {
    sendMessage("setUsername", { username: newUsername });
}

function getUserDetails() {
    sendMessage("getUserDetails");
}

function getRooms() {
    sendMessage("getRooms");
}

function newRoom() {
    sendMessage("newRoom");
}

function joinRoom(roomId) {
    sendMessage("joinRoom", { roomId });
}

function leaveRoom() {
    sendMessage("leaveRoom");
}

function setReady(isReady) {
    sendMessage("setReady", { isReady });
}

function playMove(move) {
    sendMessage("makeMove", { move });
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