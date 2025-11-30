import type { IGameLogic, MoveResult } from "./IGameLogic.js";

const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
] as const;

export class TicTacToeLogic implements IGameLogic {
	public cells: (null | "P1" | "P2")[];

	constructor(boardState: (null | "P1" | "P2")[] | null = null) {
		this.cells = boardState ?? Array(9).fill(null);
	}

	getInitialPayload(player: "P1" | "P2") {
		return {
			player,
			board: this.cells,
			game: "tic-tac-toe",
		};
	}

	makeMove(move: { index: number }, player: "P1" | "P2"): MoveResult {
		console.log(move, player, this.cells);

		if (this.cells[move.index] !== null) {
			throw new Error("Cell is already occupied");
		}
		this.cells[move.index] = player;
		const winnerResult = this.winner();

		return {
			payload: {
				board: this.cells,
			},
			isTurnOver: true, // In Tic-Tac-Toe, a move always ends the turn.
			isGameOver: !!winnerResult || this.isGameOver(),
			winner: winnerResult ? winnerResult.mark : null,
		};
	}

	isGameOver(): boolean {
		return !this.cells.includes(null) || !!this.winner();
	}

	winner(): { mark: "P1" | "P2" } | null {
		for (const combination of WINNING_COMBINATIONS) {
			const [a, b, c] = combination;
			if (
				this.cells[a] &&
				this.cells[a] === this.cells[b] &&
				this.cells[a] === this.cells[c]
			) {
				return { mark: this.cells[a] as "P1" | "P2" };
			}
		}
		return null;
	}

	availableMoves(): number[] {
		return this.cells
			.map((cell, index) => (cell === null ? index : null))
			.filter((index) => index !== null) as number[];
	}

	/**
	 * Returns the logic instance itself, which contains the board state
	 * and methods needed by the AI.
	 */
	getBoard(): IGameLogic {
		return this;
	}

	/**
	 * Creates a deep copy of the current game logic state.
	 * The AI uses this to simulate moves without affecting the real game.
	 */
	clone(): IGameLogic {
		// Create a new instance with a copy of the current cells array
		return new TicTacToeLogic([...this.cells]);
	}
}
