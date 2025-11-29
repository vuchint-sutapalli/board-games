// src/screens/GamePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import SnakesAndLaddersBoardComponent from "../components/Boards/SnakesAndLaddersBoard";
import TurnIndicator from "../components/TurnIndicator";
import Dice from "../components/Dice";
import { useMultiplayerGame } from "../hooks/useMultiplayerGame";
import ChessBoard from "../components/Boards/ChessBoard";
import TicTacToeBoard from "../components/Boards/TicTacToeBoard";

// A helper to parse query params
function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export default function GamePage() {
	const { gameType } = useParams();
	const query = useQuery();
	const opponent = query.get("opponent");

	// --- Generic Multiplayer State ---
	const {
		player,
		turn,
		message,
		boardState,
		gameConfig,
		winner,
		lastMove,
		makeMove,
	} = useMultiplayerGame(gameType, opponent);

	// --- Game-Specific State (for Snake & Ladder) ---
	const [isRolling, setIsRolling] = useState(false);
	const [diceRoll, setDiceRoll] = useState(null);
	const [playerPositions, setPlayerPositions] = useState({});

	// Effect to handle game-specific updates when the board changes
	useEffect(() => {
		if (gameType === "snake-ladder" && lastMove) {
			// Set the final dice roll immediately to be used in the Dice component
			setDiceRoll(lastMove.roll);

			// After a delay, stop the dice animation and update the board positions to trigger the token animation.
			const animationTimer = setTimeout(() => {
				setIsRolling(false); // Stop dice animation

				if (boardState) {
					// Update player positions to trigger the token animation
					const newPositions = {};
					// The boardState is now an array of arrays, e.g., [['P1'], [], ['P2']]
					boardState.forEach((cell, index) => {
						// If a cell array has players in it, iterate through them
						cell.forEach((player) => {
							newPositions[player] = index + 1;
						});
					});
					setPlayerPositions(newPositions);
				}
			}, 750); // Delay to allow dice animation to be seen

			return () => clearTimeout(animationTimer);
		}
	}, [boardState, lastMove, gameType]);

	// --- Game-Specific Actions ---
	const handleDiceRoll = () => {
		setIsRolling(true);
		makeMove({}); // Send an empty move object to signal a roll
	};

	if (opponent === "bot") {
		return <div>Playing against a bot is not implemented yet.</div>;
	}

	if (!gameConfig) {
		return (
			<div className="w-screen flex items-center justify-center min-h-screen bg-slate-900 text-white p-8">
				<div className="flex flex-col items-center justify-center gap-6 text-center">
					<div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-500"></div>
					<h2 className="text-3xl font-bold text-white capitalize">
						{gameType.replace("-", " ")}
					</h2>
					<p className="text-xl text-gray-300">
						{message || "Waiting for opponent to join..."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-screen flex items-center justify-center min-h-screen bg-slate-900 text-white p-4 md:p-8">
			<div className="flex flex-col w-full md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-20">
				{/* --- Game Board (takes up available space) --- */}
				<div className="w-full md:w-auto flex justify-center">
					{gameType === "snake-ladder" && (
						<SnakesAndLaddersBoardComponent
							playerPositions={playerPositions}
							snakes={gameConfig.snakes} // Comes from INIT_GAME payload
							ladders={gameConfig.ladders}
						/>
					)}
					{gameType === "chess" && (
						<ChessBoard
							fen={boardState}
							onMove={(move) => makeMove(move)}
							player={player}
							isMyTurn={turn === player}
						/>
					)}
					{gameType === "tictactoe" && (
						<TicTacToeBoard
							board={boardState}
							onCellClick={(index) => makeMove({ index })}
						/>
					)}
				</div>

				{/* --- Info and Controls --- */}
				<div className="flex flex-col items-center text-center w-full max-w-md md:w-80 bg-slate-800/50 p-6 rounded-xl">
					<h2 className="text-3xl md:text-4xl font-bold mb-4 capitalize">
						{gameType.replace("-", " ")}
					</h2>
					<div className="mb-8 text-center">
						<p className="text-lg text-gray-300">
							You are Player:{" "}
							<span className="font-bold text-white">{player}</span>
						</p>
						<p className="h-6 text-xl font-semibold mt-2">
							{winner ? (
								<span className="text-amber-400">Winner: {winner}</span>
							) : turn ? (
								<span className="text-sky-400">Turn: {turn}</span>
							) : (
								""
							)}
						</p>
					</div>

					{/* Game-Specific Controls */}
					{gameType === "snake-ladder" && (
						<div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-6 w-full">
							<button
								onClick={handleDiceRoll}
								disabled={turn !== player || isRolling}
								className="w-full sm:w-auto px-8 py-4 text-xl bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70 transform hover:scale-105"
								title={
									turn !== player ? "Waiting for opponent" : "Roll the dice"
								}
							>
								{isRolling
									? "Rolling..."
									: turn === player
									? "Roll Dice"
									: "Opponent's Turn"}
							</button>
							<div className="h-24 w-24 flex items-center justify-center">
								{(diceRoll || isRolling) && (
									<Dice roll={diceRoll} loading={isRolling} />
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
