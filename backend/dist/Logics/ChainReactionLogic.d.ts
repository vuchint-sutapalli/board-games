import type { IGameLogic, MoveResult } from "./IGameLogic.js";
/**
 * A simple game where landing on specific squares grants an extra turn.
 * This demonstrates a "chain reaction" where a single player can make multiple moves
 * before their turn is officially over.
 */
export declare class ChainReactionLogic implements IGameLogic {
    private playerPositions;
    private winner;
    constructor();
    getInitialPayload(player: "P1" | "P2"): object;
    makeMove(move: any, player: "P1" | "P2"): MoveResult;
    isGameOver(): boolean;
    getWinner(): "P1" | "P2" | undefined;
}
//# sourceMappingURL=ChainReactionLogic.d.ts.map