import TicTacToeBoard from "./TicTacToeBoard"; // Import the specific board implementation
//strategy engine
export default class AIPlayer {
	constructor(mark) {
		this.mark = mark;
		this.opponent = mark === "X" ? "O" : "X";
	}

	evaluate(board) {
		const win = board.winner();
		if (!win) return 0;
		if (win.mark === this.mark) return 10;
		if (win.mark === this.opponent) return -10;
		return 0;
	}

	minimax(board, depth, isMaximizing, alpha, beta) {
		const score = this.evaluate(board); // The evaluate method is still valid
		if (Math.abs(score) === 10 || board.isGameOver() || depth === 0)
			return score; // Use isGameOver

		if (isMaximizing) {
			let best = -Infinity;
			for (const move of board.availableMoves()) {
				const copy = board.clone();
				copy.makeMove(move, this.mark);
				const val = this.minimax(copy, depth - 1, false, alpha, beta);
				best = Math.max(best, val);
				alpha = Math.max(alpha, best);
				if (beta <= alpha) break;
			}
			return best;
		} else {
			let best = Infinity;
			for (const move of board.availableMoves()) {
				const copy = board.clone();
				copy.makeMove(move, this.opponent);
				const val = this.minimax(copy, depth - 1, true, alpha, beta);
				best = Math.min(best, val);
				beta = Math.min(beta, best);
				if (beta <= alpha) break;
			}
			return best;
		}
	}

	findBestMove(board) {
		console.log(`AI i strying to find next move ${board}`);

		let bestVal = -Infinity;
		let bestMove = null;
		//get empty cell count
		const depth = 9 - board.cells.filter((cell) => cell !== null).length;
		for (const move of board.availableMoves()) {
			const copy = board.clone(); // clone will return TicTacToeBoard
			copy.makeMove(move, this.mark);
			const moveVal = this.minimax(copy, depth - 1, false, -Infinity, Infinity);
			if (moveVal > bestVal) {
				bestVal = moveVal;
				bestMove = move;
			}
		}
		return bestMove;
	}
}
