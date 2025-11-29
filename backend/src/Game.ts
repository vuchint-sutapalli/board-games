import type { IGameLogic } from "./Logics/IGameLogic.js";
import { WebSocket } from "ws";
import { GAME_OVER, MOVE, INIT_GAME } from "./messages.js";

export class Game {
	public player1: WebSocket;
	public player2: WebSocket;

	private gameLogic: IGameLogic;
	private startTime: Date;
	private turn: WebSocket; // Keep track of whose turn it is

	constructor(user1: WebSocket, user2: WebSocket, gameLogic: IGameLogic) {
		this.player1 = user1;
		this.player2 = user2;
		this.gameLogic = gameLogic;
		this.startTime = new Date();
		this.turn = this.player1; // Player 1 starts

		this.player1.send(
			JSON.stringify({
				type: INIT_GAME,
				payload: this.gameLogic.getInitialPayload("P1"),
			})
		);
		this.player2.send(
			JSON.stringify({
				type: INIT_GAME,
				payload: this.gameLogic.getInitialPayload("P2"),
			})
		);
	}

	makeMove(player: WebSocket, move: any) {
		// Validate that it's the correct player's turn
		if (this.turn !== player) {
			// Send a structured error message back to the client
			player.send(
				JSON.stringify({
					type: "ERROR",
					payload: { message: "Not your turn" },
				})
			);
			return;
		}

		let moveResult;
		try {
			const playerIdentifier = this.getPlayerIdentifier(player);
			moveResult = this.gameLogic.makeMove(move, playerIdentifier);
		} catch (error) {
			// If the move is invalid, the logic will throw an error.
			console.error("Invalid move:", error);
			return;
		}

		// --- Core Change for Chain Reactions ---
		// Only switch turns if the game logic says the turn is over.
		// For a simple game, `isTurnOver` will always be true.
		// For a chain reaction game, it might be false, waiting for another move from the same player
		// or for an automatic cascade to be processed. We default to `true` for
		// backward compatibility with simple game logics.
		const isTurnOver = moveResult.isTurnOver ?? true;

		// Determine whose turn it will be next and get their identifier
		const nextTurnWebSocket = isTurnOver
			? this.turn === this.player1
				? this.player2
				: this.player1
			: this.turn;
		const nextTurnIdentifier = this.getPlayerIdentifier(nextTurnWebSocket);

		// Broadcast the result of the move, now including whose turn it is next
		this.broadcast({
			type: MOVE,
			payload: { ...moveResult.payload, turn: nextTurnIdentifier },
		});

		if (isTurnOver) {
			this.turn = this.turn === this.player1 ? this.player2 : this.player1;
		}

		if (moveResult.isGameOver ?? this.gameLogic.isGameOver()) {
			const winner = moveResult.winner;
			[this.player1, this.player2].forEach((p) =>
				p.send(
					JSON.stringify({
						type: GAME_OVER,
						payload: {
							winner: winner,
							time: new Date().getTime() - this.startTime.getTime(),
						},
					})
				)
			);
		}
	}

	private broadcast(message: object) {
		const moveMessage = JSON.stringify(message);
		this.player1.send(moveMessage);
		this.player2.send(moveMessage);
	}

	private getPlayerIdentifier(player: WebSocket): "P1" | "P2" {
		return player === this.player1 ? "P1" : "P2";
	}
}
