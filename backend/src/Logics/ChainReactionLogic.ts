import type { IGameLogic, MoveResult } from "./IGameLogic.js";

const BOARD_SIZE = 25;
const EXTRA_TURN_SQUARES = [5, 12, 18];

/**
 * A simple game where landing on specific squares grants an extra turn.
 * This demonstrates a "chain reaction" where a single player can make multiple moves
 * before their turn is officially over.
 */
export class ChainReactionLogic implements IGameLogic {
	private playerPositions: { P1: number; P2: number };
	private winner: "P1" | "P2" | undefined;

	constructor() {
		this.playerPositions = { P1: 0, P2: 0 };
		this.winner = undefined;
	}

	getInitialPayload(player: "P1" | "P2"): object {
		return {
			color: player,
			boardSize: BOARD_SIZE,
			extraTurnSquares: EXTRA_TURN_SQUARES,
			playerPositions: this.playerPositions,
		};
	}

	makeMove(move: any, player: "P1" | "P2"): MoveResult {
		if (this.winner) {
			throw new Error("Game is already over.");
		}

		const roll = Math.floor(Math.random() * 6) + 1;
		const currentPosition = this.playerPositions[player];
		let newPosition = currentPosition + roll;

		let isGameOver = false;
		if (newPosition >= BOARD_SIZE) {
			newPosition = BOARD_SIZE;
			this.winner = player;
			isGameOver = true;
		}

		this.playerPositions[player] = newPosition;

		// --- Core Chain Reaction Logic ---
		// If the player lands on a special square, their turn is NOT over.
		const isTurnOver = !EXTRA_TURN_SQUARES.includes(newPosition) || isGameOver;

		const result: MoveResult = {
			payload: {
				player,
				roll,
				newPosition,
				playerPositions: this.playerPositions,
				message: isTurnOver
					? `Player ${player} landed on ${newPosition}`
					: `Player ${player} landed on ${newPosition} and gets an extra turn!`,
			},
			isTurnOver,
			isGameOver,
		};

		if (this.winner) {
			result.winner = this.winner;
		}

		return result;
	}

	isGameOver(): boolean {
		return !!this.winner;
	}

	getWinner(): "P1" | "P2" | undefined {
		return this.winner;
	}
}
