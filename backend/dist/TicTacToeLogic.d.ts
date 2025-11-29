import type { IGameLogic } from "./IGameLogic.js";
export declare class TicTacToeLogic implements IGameLogic {
    private cells;
    constructor(cells?: (string | null)[] | null);
    makeMove(move: any, mark: string): {
        board: (string | null)[];
        success: boolean;
    };
    isGameOver(): boolean;
    getWinner(): string | null;
    getBoardState(): (string | null)[];
    getInitialPayload(playerIdentifier: string): {
        player: string;
        board: (string | null)[];
    };
}
//# sourceMappingURL=TicTacToeLogic.d.ts.map