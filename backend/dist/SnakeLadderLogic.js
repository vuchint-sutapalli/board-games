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
export class SnakeLadderLogic {
    cells;
    size;
    snakes;
    ladders;
    constructor(cells = null, size = 100, snakes = defaultSnakes, ladders = defaultLadders) {
        // If cells are provided, use them; otherwise, create a new empty board.
        this.cells = cells ? [...cells] : Array(size).fill(null);
        this.size = size;
        this.snakes = snakes; // Array of [start, end] pairs
        this.ladders = ladders; // Array of [start, end] pairs
    }
    makeMove(move, player) {
        // The server generates the dice roll, ignoring any client input.
        const roll = Math.floor(Math.random() * 6) + 1;
        const currentIndex = this.cells.findIndex((cell) => cell === player);
        // Convert array index to board position (1-100). If not on board, start at 0.
        const currentPosition = currentIndex === -1 ? 0 : currentIndex + 1;
        let newPosition = currentPosition + roll;
        // If the new position overshoots the board, it's an invalid move.
        // The player loses their turn and does not move.
        if (newPosition > this.size) {
            return { board: this.cells, roll };
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
        return { board: this.cells, roll };
    }
    // makeMove(move: { from: string; to: string }) {
    // 	// The 'move' method throws an error on invalid moves, which fulfills the interface contract.
    // 	this.board.move(move);
    // }
    isGameOver() {
        // The game is over when someone reaches the last cell
        return this.getWinner() !== null;
    }
    getWinner() {
        // The winner is the first player to reach the last cell
        const winner = this.cells[this.size - 1];
        // Check for a truthy value to handle both null and undefined
        if (winner) {
            return winner; // Return the player's mark directly
        }
        return null;
    }
    getBoardState() {
        return this.cells;
    }
    getSnakes() {
        return this.snakes;
    }
    getLadders() {
        return this.ladders;
    }
    getInitialPayload(playerIdentifier) {
        return {
            player: playerIdentifier,
            board: this.getBoardState(),
            snakes: this.getSnakes(),
            ladders: this.getLadders(),
        };
    }
}
//# sourceMappingURL=SnakeLadderLogic.js.map