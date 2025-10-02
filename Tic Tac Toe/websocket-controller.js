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
    console.log(`new user connected, user details: ${user}`);

    ws.send(JSON.stringify(user));

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
                    id: ws.user.id,
                    username: ws.user.username
                }));
                break;

            case 'setUsername':
                ws.user.username = data.username;
                ws.send(JSON.stringify({ message: "Username updated successfuly" }))
                break;

            case 'getRoom':
                var room = roomsRuntime.getRoom(data.roomId);
                ws.send(JSON.stringify({ room: room }))
                break;

            case 'newRoom':
                var room = roomsRuntime.newRoom(ws.user);
                ws.send(JSON.stringify({ room: room }))
                break;

            case 'joinRoom':
                var room = roomsRuntime.joinRoom(data.roomId, ws.user);
                ws.send(JSON.stringify({ room: room }))
                break;

            // case 'makeMove':
            //     roomsRuntime.makeMove(data.roomId, ws.user, data.move);
            //     break;

            case 'leaveRoom':
                roomsRuntime.leaveRoom(data.roomId, ws.user);
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

function HandleClientDisconnected() {
    console.log("Client Disconnected")
}

export default {
    HandleClientConnected,
    HandleMessageRecieved,
    HandleClientDisconnected
}