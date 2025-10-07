import { clients } from "./websocket-controller.js";
import roomsRuntime from "./rooms-runtime.js";

function broadcastToRoom(roomId, message) {
    const room = roomsRuntime.getRoom(roomId);
    if (room) {
        for (const userId in room.users) {
            const client = clients.get(parseInt(userId));
            if (client && client.readyState === client.OPEN) {
                client.send(JSON.stringify(message));
            }
        }
    }
}

export {
    broadcastToRoom
}   