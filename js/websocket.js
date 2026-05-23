import { eventBus } from "./events.js";

const socket = new WebSocket('ws://localhost:3000/ws');

socket.onopen = (event) => console.log('WebSocket connection opened:', event);
socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
    const message = JSON.parse(event.data);

    publishMessageReceivedEvent(message);
};
socket.onclose = (event) => console.log('WebSocket connection closed:', event);
socket.onerror = (error) => console.error('WebSocket error:', error);

function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        console.log("Sending message through websocket");
        
        socket.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not open.');
    }
}

function publishMessageReceivedEvent(msg) {
    const messageReceivedEvent = new CustomEvent('MessageReceived', { detail: msg});
    eventBus.dispatchEvent(messageReceivedEvent);
}
eventBus.addEventListener('SendMessage', (event) => sendMessage(event.detail))