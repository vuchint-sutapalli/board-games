export class TicTacToeLogic {
    cells;
    constructor(cells = null) {
        // If cells are provided, use them; otherwise, create a new empty board.
        this.cells = cells ? [...cells] : Array(9).fill(null);
    }
    makeMove(move, mark) {
        const { index } = move; // Expects move to be { index: number }
        if (this.cells[index])
            throw new Error("Cell already taken");
        this.cells[index] = mark;
        return { board: this.getBoardState(), success: true }; // Indicate that the move was successful
    }
    isGameOver() {
        return (this.getWinner() !== null || this.cells.every((cell) => cell !== null));
    }
    getWinner() {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (const [a, b, c] of lines) {
            if (this.cells[a] &&
                this.cells[a] === this.cells[b] &&
                this.cells[a] === this.cells[c]) {
                return this.cells[a]; // Return only the winner's mark (e.g., 'X' or 'O')
            }
        }
        return null;
    }
    getBoardState() {
        return [...this.cells];
    }
    getInitialPayload(playerIdentifier) {
        return {
            player: playerIdentifier,
            board: this.getBoardState(),
        };
    }
}
//# sourceMappingURL=TicTacToeLogic.js.map