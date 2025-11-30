export type MoveResult = {
	payload: any;
	isTurnOver: boolean;
	isGameOver: boolean;
	winner?: "P1" | "P2" | null;
};

export interface IGameLogic {
	getInitialPayload(player: "P1" | "P2"): any;
	makeMove(move: any, player: "P1" | "P2"): MoveResult;
	isGameOver(): boolean;
	getBoard(): any; // Add this line

	// These are likely needed for your AI, so let's ensure they are part of the interface
	availableMoves?(): number[];
	clone?(): IGameLogic;
	winner?(): { mark: "P1" | "P2" } | null;
}
