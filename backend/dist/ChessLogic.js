import { Chess } from "chess.js";
export class ChessLogic {
    board;
    constructor() {
        this.board = new Chess();
    }
    makeMove(move) {
        // The 'move' method throws an error on invalid moves, which fulfills the interface contract.
        const result = this.board.move(move);
        return { board: this.getBoardState(), move: result };
    }
    isGameOver() {
        return this.board.isGameOver();
    }
    getWinner() {
        if (!this.isGameOver()) {
            return null;
        }
        // If the game is over, the winner is the opposite of the current turn's color.
        return this.board.turn() === "w" ? "black" : "white";
    }
    getBoardState() {
        // For chess, we will use the FEN string as the board state.
        // The interface expects an array, but we'll handle this on the frontend.
        return this.board.fen();
    }
    getInitialPayload(playerIdentifier) {
        return {
            board: this.getBoardState(),
            player: playerIdentifier,
            color: playerIdentifier === "P1" ? "white" : "black",
        };
    }
}
//# sourceMappingURL=ChessLogic.js.map