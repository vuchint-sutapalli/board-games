import type { IGameLogic } from "./IGameLogic.js";
export declare class SnakeLadderLogic implements IGameLogic {
    private cells;
    private size;
    private snakes;
    private ladders;
    constructor(cells?: null, size?: number, snakes?: [number, number][], ladders?: [number, number][]);
    makeMove(move: any, player: string): {
        board: (string | null)[];
        roll: number;
    };
    isGameOver(): boolean;
    getWinner(): string | null;
    getBoardState(): (string | null)[];
    getSnakes(): [number, number][];
    getLadders(): [number, number][];
    getInitialPayload(playerIdentifier: string): {
        player: string;
        board: (string | null)[];
        snakes: [number, number][];
        ladders: [number, number][];
    };
}
//# sourceMappingURL=SnakeLadderLogic.d.ts.map