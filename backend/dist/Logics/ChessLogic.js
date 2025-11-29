import { Chess, Move } from "chess.js";
export class ChessLogic {
    board;
    constructor() {
        this.board = new Chess();
    }
    makeMove(move, player) {
        // Explicitly check if the player making the move matches the current turn color
        const turnColor = this.board.turn(); // 'w' or 'b'
        const playerColor = player === "P1" ? "w" : "b";
        if (turnColor !== playerColor) {
            throw new Error("Not your turn.");
        }
        // The 'move' method throws an error on invalid moves, which fulfills the interface contract.
        this.board.move(move);
        const isGameOver = this.isGameOver();
        const winner = this.getWinner();
        const result = {
            payload: { board: this.getBoardState() },
            isTurnOver: true, // A turn is always over after one move in Chess
            isGameOver,
        };
        if (winner) {
            result.winner = winner;
        }
        return result;
    }
    isGameOver() {
        return this.board.isGameOver();
    }
    getWinner() {
        if (!this.isGameOver()) {
            return undefined;
        }
        // If the game is over, the winner is the opposite of the current turn's color.
        // P1 is white, P2 is black.
        const winnerColor = this.board.turn() === "w" ? "black" : "white";
        return winnerColor === "white" ? "P1" : "P2";
    }
    getBoardState() {
        // For chess, we will use the FEN string as the board state.
        return this.board.fen();
    }
    getInitialPayload(player) {
        return {
            board: this.getBoardState(),
            player: player,
        };
    }
}
//# sourceMappingURL=ChessLogic.js.map