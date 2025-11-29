import type { IGameLogic } from "./IGameLogic.js";
export declare class ChessLogic implements IGameLogic {
    private board;
    constructor();
    makeMove(move: {
        from: string;
        to: string;
    }): {
        board: string;
        move: import("chess.js").Move;
    };
    isGameOver(): boolean;
    getWinner(): string | null;
    getBoardState(): string;
    getInitialPayload(playerIdentifier: string): {
        board: string;
        player: string;
        color: string;
    };
}
//# sourceMappingURL=ChessLogic.d.ts.map