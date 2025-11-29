export interface MoveResult {
    payload: any;
    isTurnOver: boolean;
    isGameOver: boolean;
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
//# sourceMappingURL=IGameLogic.d.ts.map