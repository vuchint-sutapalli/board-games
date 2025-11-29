import type { IGameLogic } from "./Logics/IGameLogic.js";
import { WebSocket } from "ws";
export declare class Game {
    player1: WebSocket;
    player2: WebSocket;
    private gameLogic;
    private startTime;
    private turn;
    constructor(user1: WebSocket, user2: WebSocket, gameLogic: IGameLogic);
    makeMove(player: WebSocket, move: any): void;
    private broadcast;
    private getPlayerIdentifier;
}
//# sourceMappingURL=Game.d.ts.map