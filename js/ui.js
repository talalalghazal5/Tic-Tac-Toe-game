import api from "./api.js";
import { eventBus } from "./events.js";

$(document).ready(function () {
    $("#result").hide();

    //restart the game:
    $("#playAgain").click(function () {
        location.reload(true);
    })

    $("#setUsername").click(function () {
        console.log("setUsernameClicked");
        api.setUsername("HELL");
    })

    $("#getDetails").click(function () {
        console.log("getDetailsClicked");
        api.getUserDetails();
    })

    $("#getRooms").click(function () {
        console.log("getRoomsClicked");
        api.getRooms();
    })

    $("#newRoom").click(function () {
        console.log("newRoomClicked");
        api.newRoom();
    })

    $("#joinRoom").click(function () {
        console.log("joinRoomClicked");
        api.joinRoom(1);
    })

    $("#leaveRoom").click(function () {
        console.log("leaveRoomClicked");
        api.leaveRoom();
    })

    $("#ready").click(function () {
        console.log("readyClicked");
        api.setReady(true);
    })

    $("#notReady").click(function () {
        console.log("notReadyClicked");
        api.setReady(false);
    })

    // The main game:
    $(".cell").click(function () {
        if (!$(this).text()) { // check if the cell is visually empty
            const row = $(this).attr("row");
            const col = $(this).attr("col");
            // Send the move to the server
            api.playMove({ row, col });
        }
    });
});

function processReceivedMessage(msg) {
    console.log("Received message from server:", msg);

    // processing a game state update from the server
    switch (msg.type) {
        case 'playerRoomUpdate':
            updateRoomElements(msg.room);
            if (msg.room.isPlaying) {
                updateGame(msg.room.game);
            }
            break;
        case 'userDataUpdate':
            updateUserDataElements(msg.user);
        default:
            break;
    }
}

eventBus.addEventListener('MessageReceived', (event) => processReceivedMessage(event.detail));

function updateGame(game) {
    const { board, isOver, winner } = game;

    // Update the board
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const cell = $(`.cell[row='${r}'][col='${c}']`);
            const symbol = board[r][c];
            if (symbol !== 0) {
                cell.text(symbol);
            } else {
                cell.text('');
            }
        }
    }

    // Update game status
    if (isOver) {
        if (winner) {
            $("#message").text("Player " + winner.username + " wins!");
        } else {
            $("#message").text("It's a Draw");
        }
        $("#result").show();
        $(".cell").addClass(" disabled");
    }
}

function updateRoomElements(room){
    $('#numberOfPlayersInRoom').text(Object.keys(room.users).length);
    $('#numberOfReadyPlayers').text(Object.values(room.users).filter(user => user.isReady).length);
    $('#roomId').text(room.id);
}

function updateUserDataElements(user){
    $('#userId').text(user.id);
    $('#username').text(user.username);
}