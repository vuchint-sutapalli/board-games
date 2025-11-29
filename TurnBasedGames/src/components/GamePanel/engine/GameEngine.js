import TicTacToeBoard from "./TicTacToeBoard"; // Import the specific board implementation

export default class GameEngine {
	// The engine is initialized with a specific board instance and player list
	constructor(board, players = ["X", "O"]) {
		this.initialBoard = board;
		this.players = players;
		this.history = [this.initialBoard.clone()];
		this.current = 0;
		this.turnIndex = 0; // Use an index to support more than 2 players
		this.scores = {
			...this.players.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}),
			ties: 0,
		};
	}

	get turn() {
		return this.players[this.turnIndex];
	}

	getBoard() {
		return this.history[this.current].clone();
	}

	// A "move" is now an abstract object, not just an index.
	// For Tic-Tac-Toe, a move could be { index: 5 }
	makeMove(move) {
		const board = this.getBoard();
		// Delegate move validation and execution to the board
		if (!board.makeMove(move, this.turn)) return false; // Let the board interpret the move object

		this.history = this.history.slice(0, this.current + 1);
		this.history.push(board);
		this.current++;

		// Ask the board about the game state, don't assume
		const winner = board.winner(); // This method now comes from the specific board
		if (winner) {
			this.scores[winner.mark]++;
		} else if (board.isGameOver()) {
			// Use the generic isGameOver
			// A more generic "is the game over?" check
			this.scores.ties++;
		}

		// Advance turn to the next player
		this.turnIndex = (this.turnIndex + 1) % this.players.length;
		return true;
	}

	undo() {
		if (this.current === 0) return false;
		this.current--;
		this.turnIndex =
			(this.turnIndex - 1 + this.players.length) % this.players.length;
		return true;
	}

	redo() {
		if (this.current >= this.history.length - 1) return false;
		this.current++;
		// When redoing, we need to advance the turn as well
		this.turnIndex = (this.turnIndex + 1) % this.players.length;
		return true;
	}

	reset() {
		this.history = [this.initialBoard.clone()];
		this.current = 0;
		this.turnIndex = 0;
		// Reset scores as well
		this.scores = {
			...this.players.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}),
			ties: 0,
		};
	}
}
