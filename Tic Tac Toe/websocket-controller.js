import roomsRuntime from "./rooms-runtime.js";

let clients = new Map();
let nextClientId = 1;

function HandleClientConnected(ws) {
    console.log("Client Connected");

    let clientId = nextClientId;
    clients.set(clientId, ws);
    ws.user = new Object();
    ws.user.id = clientId
    ws.user.username = `User${clientId}`;

    let user = {
        id: ws.user.id,
        username: ws.user.username
    };
    console.log(`new user connected, user details: ${JSON.stringify(user)}`);

    ws.send(JSON.stringify({ type: "userDataUpdate", user }));

    nextClientId++;
}

function HandleMessageRecieved(ws, msg) {
    let data;
    try {
        data = JSON.parse(msg);
        console.log(data);

        switch (data.method) {
            case 'getUserDetails':
                ws.send(JSON.stringify({
                    type: "userDataUpdate",
                    user: ws.user
                }));
                break;

            case 'setUsername':
                ws.user.username = data.username;
                ws.send(JSON.stringify({ type: "userDataUpdate", user: ws.user }))
                break;

            case 'getRooms':
                var rooms = roomsRuntime.getRooms();
                console.log(rooms);

                ws.send(JSON.stringify({ rooms: rooms }))
                break;

            case 'getRoom':
                var room = roomsRuntime.getRoom(data.roomId);
                ws.send(JSON.stringify({ room: room }))
                break;

            case 'newRoom':
                var room = roomsRuntime.newRoom(ws.user);
                ws.send(JSON.stringify({ type: 'playerRoomUpdate', room: room }))
                break;

            case 'joinRoom':
                var room = roomsRuntime.joinRoom(data.roomId, ws.user);
                ws.send(JSON.stringify({ room: room }))
                break;

            case 'setReady':
                roomsRuntime.setPlayerReady(ws.user, data.isReady);
                break;

            case 'leaveRoom':
                roomsRuntime.leaveRoom(ws.user);
                break;

            case 'makeMove':
                roomsRuntime.makeMove(ws.user, data.move);
                break;

            default:
                ws.send(JSON.stringify({ error: "method is not recognized" }))
                break;
        }
    } catch (error) {
        console.log(error);
        ws.send(JSON.stringify({ message: "Error processing the request" }));
    }
}

function HandleClientDisconnected(ws) {
    console.log("Client Disconnected");
    try {
        roomsRuntime.leaveRoom(ws.user);
    } catch (error) {
        // It's possible the user was not in any room; log for debugging if needed
        // console.log("No room to leave or error:", error.message);
    }

    if (ws.user && ws.user.id) {
        clients.delete(ws.user.id);
    }
}

export {
    clients,
    HandleClientConnected,
    HandleMessageRecieved,
    HandleClientDisconnected
}