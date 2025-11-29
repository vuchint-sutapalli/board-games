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
    cells; // Each cell is an array of players
    size;
    snakes;
    ladders;
    constructor(cells = null, size = 100, snakes = defaultSnakes, ladders = defaultLadders) {
        // Each cell is an array, allowing multiple players per cell.
        this.cells = cells ? cells : Array.from({ length: size }, () => []);
        this.size = size;
        this.snakes = snakes; // Array of [start, end] pairs
        this.ladders = ladders; // Array of [start, end] pairs
    }
    makeMove(move, player) {
        // The server generates the dice roll, ignoring any client input.
        const roll = Math.floor(Math.random() * 6) + 1;
        const currentIndex = this.cells.findIndex((cell) => cell.includes(player));
        // Convert array index to board position (1-100). If not on board, start at 0.
        const currentPosition = currentIndex === -1 ? 0 : currentIndex + 1;
        let newPosition = currentPosition + roll;
        // If the new position overshoots the board, the player does not move.
        if (newPosition > this.size) {
            return {
                payload: { board: this.cells, roll },
                isTurnOver: true,
                isGameOver: false, // No winner property when there's no winner
            };
        }
        let isGameOver = false;
        let winner = undefined;
        let wasSwallowedBySnake = false;
        // Check for snakes and ladders
        for (const [start, end] of this.snakes) {
            if (newPosition === start) {
                // Compare board position with snake start
                wasSwallowedBySnake = true;
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
        // Check for a win condition
        if (newPosition === this.size) {
            isGameOver = true;
            winner = player;
        }
        // Update the board
        // Only clear the old position if the player was on the board
        if (currentIndex !== -1) {
            // Remove the player from their old cell
            const oldCell = this.cells[currentIndex];
            // This check satisfies the strict compiler that the cell is not undefined
            if (oldCell) {
                this.cells[currentIndex] = oldCell.filter((p) => p !== player);
            }
        }
        // Add the player to their new cell
        const newCell = this.cells[newPosition - 1];
        // This check satisfies the strict compiler that the cell is not undefined
        // before we push the player into it.
        if (newCell) {
            newCell.push(player);
        }
        // The turn is NOT over if the roll is 6, the player was NOT swallowed by a snake, AND the game is not over.
        const isTurnOver = roll !== 6 || wasSwallowedBySnake || isGameOver;
        const result = {
            payload: { board: this.cells, roll, player },
            isTurnOver,
            isGameOver,
        };
        if (winner)
            result.winner = winner;
        return result;
    }
    isGameOver() {
        // The game is over when someone reaches the last cell
        return !!this.getWinner();
    }
    getWinner() {
        // The winner is the first player to reach the last cell
        const finalCell = this.cells[this.size - 1];
        if (finalCell && finalCell.length > 0) {
            // If multiple players finish on the same turn, the first one in the array wins.
            return finalCell[0];
        }
        return undefined;
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
    getInitialPayload(player) {
        return {
            player: player,
            board: this.getBoardState(),
            snakes: this.getSnakes(),
            ladders: this.getLadders(),
        };
    }
}
//# sourceMappingURL=SnakeLadderLogic.js.map