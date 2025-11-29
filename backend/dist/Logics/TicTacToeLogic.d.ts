import type { IGameLogic, MoveResult } from "./IGameLogic.js";
export declare class TicTacToeLogic implements IGameLogic {
    private cells;
    constructor(cells?: (string | null)[] | null);
    makeMove(move: any, player: "P1" | "P2"): MoveResult;
    isGameOver(): boolean;
    getWinner(): "P1" | "P2" | undefined;
    getBoardState(): (string | null)[];
    getInitialPayload(player: "P1" | "P2"): {
        player: "P1" | "P2";
        board: (string | null)[];
    };
}
//# sourceMappingURL=TicTacToeLogic.d.ts.map