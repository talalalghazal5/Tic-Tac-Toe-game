export function HandleClientConnected(ws) {
    ws.send("Client Connected")
}

export function HandleMessageRecieved(ws, msg) {
    ws.send(msg)
}

export function HandleClientDisconnected() {
    console.log("Client Disconnected")
}

export default {
    HandleClientConnected,
    HandleMessageRecieved,
    HandleClientDisconnected
}