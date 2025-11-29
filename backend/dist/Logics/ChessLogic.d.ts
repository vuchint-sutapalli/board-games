import type { IGameLogic, MoveResult } from "./IGameLogic.js";
export declare class ChessLogic implements IGameLogic {
    private board;
    constructor();
    makeMove(move: {
        from: string;
        to: string;
    }, player: "P1" | "P2"): MoveResult;
    isGameOver(): boolean;
    getWinner(): "P1" | "P2" | undefined;
    getBoardState(): string;
    getInitialPayload(player: "P1" | "P2"): {
        board: string;
        player: "P1" | "P2";
    };
}
//# sourceMappingURL=ChessLogic.d.ts.map