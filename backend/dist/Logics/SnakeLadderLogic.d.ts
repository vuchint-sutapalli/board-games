import type { IGameLogic, MoveResult } from "./IGameLogic.js";
export declare class SnakeLadderLogic implements IGameLogic {
    private cells;
    private size;
    private snakes;
    private ladders;
    constructor(cells?: null, size?: number, snakes?: [number, number][], ladders?: [number, number][]);
    makeMove(move: any, player: "P1" | "P2"): MoveResult;
    isGameOver(): boolean;
    getWinner(): "P1" | "P2" | undefined;
    getBoardState(): ("P1" | "P2")[][];
    getSnakes(): [number, number][];
    getLadders(): [number, number][];
    getInitialPayload(player: "P1" | "P2"): {
        player: "P1" | "P2";
        board: ("P1" | "P2")[][];
        snakes: [number, number][];
        ladders: [number, number][];
    };
}
//# sourceMappingURL=SnakeLadderLogic.d.ts.map