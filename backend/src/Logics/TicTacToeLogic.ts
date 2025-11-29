import type { IGameLogic, MoveResult } from "./IGameLogic.js";

export class TicTacToeLogic implements IGameLogic {
	private cells: (string | null)[];

	constructor(cells: (string | null)[] | null = null) {
		// If cells are provided, use them; otherwise, create a new empty board.
		this.cells = cells ? [...cells] : Array(9).fill(null);
	}

	makeMove(move: any, player: "P1" | "P2"): MoveResult {
		const { index } = move; // Expects move to be { index: number }
		if (this.cells[index]) {
			throw new Error("Cell already taken");
		}
		this.cells[index] = player;

		const isGameOver = this.isGameOver();
		const winner = this.getWinner();

		const result: MoveResult = {
			payload: { board: this.getBoardState() },
			isTurnOver: true, // A turn is always over after one move in Tic Tac Toe
			isGameOver,
		};

		if (winner) {
			result.winner = winner;
		}

		return result;
	}

	isGameOver() {
		return !!this.getWinner() || this.cells.every((cell) => cell !== null);
	}

	getWinner() {
		const lines: [number, number, number][] = [
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
				return this.cells[a] as "P1" | "P2";
			}
		}
		return undefined;
	}

	getBoardState(): (string | null)[] {
		return [...this.cells];
	}

	getInitialPayload(player: "P1" | "P2") {
		return {
			player: player,
			board: this.getBoardState(),
		};
	}
}
