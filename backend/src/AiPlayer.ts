import type { IGameLogic } from "./Logics/IGameLogic.js";

type PlayerMark = "P1" | "P2";

//strategy engine
export default class AIPlayer {
	public mark: PlayerMark;
	private opponent: PlayerMark;

	constructor(mark: PlayerMark) {
		this.mark = mark;
		// Fix: Correctly determine the opponent based on backend marks
		this.opponent = mark === "P1" ? "P2" : "P1";
	}

	private evaluate(board: IGameLogic): number {
		const win = board.winner!();
		if (!win) return 0;
		if (win.mark === this.mark) return 10;
		if (win.mark === this.opponent) return -10;
		return 0;
	}

	private minimax(
		board: IGameLogic,
		depth: number,
		isMaximizing: boolean,
		alpha: number,
		beta: number
	): number {
		const score = this.evaluate(board);
		if (Math.abs(score) === 10 || board.isGameOver() || depth === 0)
			return score;

		if (isMaximizing) {
			let best = -Infinity;
			for (const move of board.availableMoves!()) {
				const copy = board.clone!();
				copy.makeMove(move, this.mark);
				const val = this.minimax(copy, depth - 1, false, alpha, beta);
				best = Math.max(best, val);
				alpha = Math.max(alpha, best);
				if (beta <= alpha) break;
			}
			return best;
		} else {
			let best = Infinity;
			for (const move of board.availableMoves!()) {
				const copy = board.clone!();
				copy.makeMove(move, this.opponent);
				const val = this.minimax(copy, depth - 1, true, alpha, beta);
				best = Math.min(best, val);
				beta = Math.min(beta, best);
				if (beta <= alpha) break;
			}
			return best;
		}
	}

	findBestMove(board: IGameLogic): number | null {
		let bestVal = -Infinity;
		let bestMove: number | null = null;

		// The AI's search depth will be the number of empty cells remaining.
		// This is a safe way to access this information via the interface.
		const availableMoves = board.availableMoves!();
		const depth = availableMoves.length;

		for (const move of availableMoves) {
			// Create a copy of the board to simulate the move
			const copy = board.clone!();
			copy.makeMove(move, this.mark);

			// Calculate the value of the board state after this move
			const moveVal = this.minimax(copy, depth - 1, false, -Infinity, Infinity);

			// If this move is better than the best one found so far, update it.
			if (moveVal > bestVal) {
				bestVal = moveVal;
				bestMove = move;
			}
		}
		return bestMove;
	}
}
