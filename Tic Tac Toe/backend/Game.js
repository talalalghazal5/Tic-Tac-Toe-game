export class Game {
    constructor(players) {
        this.players = players; // players[0] is 'X', players[1] is 'O'
        this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.currentPlayerIndex = 0; // Index for this.players
        this.playCounter = 0;
        this.isOver = false;
        this.winner = null;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    // move = { row: r, col: c }
    // user is the user object making the move
    playMove(user, move) {
        if (this.isOver) {
            throw new Error("Game is over.");
        }

        if (user.id !== this.getCurrentPlayer().id) {
            throw new Error("Not your turn.");
        }

        const { row, col } = move;
        if (this.board[row][col] !== 0) {
            throw new Error("Cell is already taken.");
        }

        const symbol = this.currentPlayerIndex === 0 ? 'X' : 'O';
        this.board[row][col] = symbol;
        this.playCounter++;

        if (this.checkWinner(symbol)) {
            this.isOver = true;
            this.winner = this.getCurrentPlayer();
        } else if (this.playCounter === 9) {
            this.isOver = true; // It's a draw
        } else {
            // Switch player
            this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        }
    }

    checkWinner(playerSymbol) {
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] === playerSymbol && this.board[i][1] === playerSymbol && this.board[i][2] === playerSymbol) {
                return true;
            }
            if (this.board[0][i] === playerSymbol && this.board[1][i] === playerSymbol && this.board[2][i] === playerSymbol) {
                return true;
            }
        }

        // Check diagonals
        if (this.board[0][0] === playerSymbol && this.board[1][1] === playerSymbol && this.board[2][2] === playerSymbol) {
            return true;
        }
        if (this.board[0][2] === playerSymbol && this.board[1][1] === playerSymbol && this.board[2][0] === playerSymbol) {
            return true;
        }

        return false;
    }
}