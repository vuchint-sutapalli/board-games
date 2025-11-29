const BOARD_SIZE = 25;
const EXTRA_TURN_SQUARES = [5, 12, 18];
/**
 * A simple game where landing on specific squares grants an extra turn.
 * This demonstrates a "chain reaction" where a single player can make multiple moves
 * before their turn is officially over.
 */
export class ChainReactionLogic {
    playerPositions;
    winner;
    constructor() {
        this.playerPositions = { P1: 0, P2: 0 };
        this.winner = undefined;
    }
    getInitialPayload(player) {
        return {
            color: player,
            boardSize: BOARD_SIZE,
            extraTurnSquares: EXTRA_TURN_SQUARES,
            playerPositions: this.playerPositions,
        };
    }
    makeMove(move, player) {
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
        const result = {
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
    isGameOver() {
        return !!this.winner;
    }
    getWinner() {
        return this.winner;
    }
}
//# sourceMappingURL=ChainReactionLogic.js.map