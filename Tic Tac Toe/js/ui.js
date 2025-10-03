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
        case 'gameStateUpdate': //todo
            const { board, isOver, winner } = msg.data;

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
            break;
        default:
            break;
    }
}

eventBus.addEventListener('MessageReceived', (event) => processReceivedMessage(event.detail));