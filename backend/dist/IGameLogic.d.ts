/**
 * Defines the common interface for any game's logic.
 * This allows the main Game class to be independent of any specific game rules.
 */
export interface IGameLogic {
    /**
     * Attempts to make a move. Throws an error on an invalid move.
     * @param move The move details, specific to the game (e.g., { from, to } for chess).
     */
    makeMove(move: any, player?: string): any;
    /**
     * Checks if the game has concluded.
     */
    isGameOver(): boolean;
    /**
     * Returns the identifier of the winner ('white', 'black', 'X', 'O'), or 'draw'. Returns null if the game is ongoing.
     */
    getWinner(): any;
    getBoardState(): any;
    getSnakes?(): [number, number][];
    getLadders?(): [number, number][];
    getInitialPayload(playerIdentifier: string): object;
}
//# sourceMappingURL=IGameLogic.d.ts.map