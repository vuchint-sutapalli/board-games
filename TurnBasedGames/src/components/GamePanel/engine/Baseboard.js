export default class BaseBoard {
	constructor(cells) {
		this.cells = cells;
	}

	// clone() will be implemented by the concrete board, returning an instance of itself
	clone() {
		throw new Error("clone() must be implemented by a subclass.");
	}

	// These methods define the interface for any game board
	// 'move' is an abstract concept; its structure depends on the specific game.
	makeMove(move, mark) {
		throw new Error("makeMove(move, mark) must be implemented by a subclass.");
	}

	availableMoves() {
		throw new Error("availableMoves() must be implemented by a subclass.");
	}

	winner() {
		// This method should return the winner if any, or null
		throw new Error("winner() must be implemented by a subclass.");
	}

	isGameOver() {
		// This method should return true if the game is over (win or tie)
		throw new Error("isGameOver() must be implemented by a subclass.");
	}
}
