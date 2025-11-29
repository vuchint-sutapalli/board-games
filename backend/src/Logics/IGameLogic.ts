export interface MoveResult {
	payload: any; // Data sent to the client (e.g., new board state)
	isTurnOver: boolean; // Did the turn end?
	isGameOver: boolean; // Did the game end?
	winner?: "P1" | "P2" | "Opponent Disconnected";
}

export interface IGameLogic {
	/**
	 * Returns the initial state and configuration for a specific player.
	 */
	getInitialPayload(player: "P1" | "P2"): object;

	/**
	 * Processes a move, updates the game state, and returns the result.
	 */
	makeMove(move: any, player: "P1" | "P2"): MoveResult;

	isGameOver(): boolean;

	getWinner(): "P1" | "P2" | undefined;
}
