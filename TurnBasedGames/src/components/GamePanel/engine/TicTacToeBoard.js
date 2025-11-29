import BaseBoard from "./Baseboard";

export default class TicTacToeBoard extends BaseBoard {
	constructor(cells = null) {
		super(cells ? [...cells] : Array(9).fill(null));
	}

	clone() {
		return new TicTacToeBoard(this.cells);
	}

	makeMove(move, mark) {
		const { index } = move; // Expects move to be { index: number }
		if (this.cells[index]) throw new Error("Cell already taken");
		this.cells[index] = mark;
		return true; // Indicate that the move was successful
	}

	availableMoves() {
		return this.cells.map((c, i) => (c ? null : i)).filter((v) => v !== null);
	}

	// isGameOver for Tic-Tac-Toe means either there's a winner or the board is full
	isGameOver() {
		return this.winner() !== null || this.cells.every((cell) => cell !== null);
	}

	winner() {
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
			if (
				this.cells[a] &&
				this.cells[a] === this.cells[b] &&
				this.cells[a] === this.cells[c]
			) {
				return { mark: this.cells[a], line: [a, b, c] };
			}
		}
		return null;
	}
}
