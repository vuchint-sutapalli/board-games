import { WebSocket } from "ws";
export declare class GameManager {
    private games;
    private pendingUsers;
    private users;
    constructor();
    addUser(user: WebSocket): void;
    removeUser(user: WebSocket): void;
    private addHandler;
}
//# sourceMappingURL=GameManager.d.ts.map