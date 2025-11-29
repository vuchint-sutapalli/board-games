import BaseBoard from "./Baseboard";

const defaultLadders = [
	[4, 25],
	[13, 46],
	[42, 63],
	[50, 69],
	[62, 81],
	[74, 92],
];

const defaultSnakes = [
	[27, 5],
	[40, 3],
	[43, 18],
	[54, 31],
	[66, 45],
	[89, 53],
	[95, 77],
	[98, 41],
];

export default class SnakeAndLaddersBoard extends BaseBoard {
	constructor(
		cells = null,
		size = 100,
		snakes = defaultSnakes,
		ladders = defaultLadders
	) {
		// If cells are provided, use them; otherwise, create a new empty board.
		super(cells ? [...cells] : Array(size).fill(null));
		this.size = size;
		this.snakes = snakes; // Array of [start, end] pairs
		this.ladders = ladders; // Array of [start, end] pairs
	}

	clone() {
		// Pass the current cells state to the new instance to create a true clone.
		return new SnakeAndLaddersBoard(
			this.cells,
			this.size,
			this.snakes,
			this.ladders
		);
	}

	makeMove(move, player) {
		// Expects move to be { roll: number }
		// 'move' will be the result of a dice roll (1-6)
		const { roll } = move;
		const currentIndex = this.cells.findIndex((cell) => cell === player);

		// Convert array index to board position (1-100). If not on board, start at 0.
		const currentPosition = currentIndex === -1 ? 0 : currentIndex + 1;

		let newPosition = currentPosition + roll;

		// If the new position overshoots the board, it's an invalid move.
		// The player loses their turn and does not move.
		if (newPosition > this.size) {
			return true;
		}

		// Check for snakes and ladders
		for (const [start, end] of this.snakes) {
			if (newPosition === start) {
				// Compare board position with snake start
				newPosition = end; // Slide down the snake
				break;
			}
		}
		for (const [start, end] of this.ladders) {
			if (newPosition === start) {
				// Compare board position with ladder start
				newPosition = end; // Climb up the ladder
				break;
			}
		}

		// Update the board
		// Only clear the old position if the player was on the board
		if (currentIndex !== -1) {
			this.cells[currentIndex] = null;
		}
		// Convert final board position back to an array index before updating
		this.cells[newPosition - 1] = player;

		return true;
	}

	availableMoves() {
		// In Snake and Ladders, the "moves" are the possible dice rolls (1-6)
		return [1, 2, 3, 4, 5, 6];
	}

	winner() {
		// The winner is the first player to reach the last cell
		if (this.cells[this.size - 1] !== null) {
			return { mark: this.cells[this.size - 1] };
		}
		return null;
	}

	isGameOver() {
		// The game is over when someone reaches the last cell
		return this.winner() !== null;
	}
}
