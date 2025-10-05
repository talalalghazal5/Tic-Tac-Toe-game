import express from "express";
import expressWs from "express-ws";
import { HandleClientConnected, HandleMessageRecieved, HandleClientDisconnected } from "./websocket-controller.js";

const port = 3000;
const app = express();
expressWs(app);

app.get("/", (req, res) => {
    res.send("Welcome to tic-tac-toe api!");
});

app.ws('/ws', (ws, req) => {
    HandleClientConnected(ws);

    ws.on('message', (msg) => {
        HandleMessageRecieved(ws, msg);
    })

    ws.on('close', () => {
        HandleClientDisconnected(ws);
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
