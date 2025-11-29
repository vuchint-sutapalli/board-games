import React from "react";
import Board from "./Board";
import SnakesAndLaddersBoardComponent from "../Boards/SnakesAndLaddersBoard";
import TurnIndicator from "../TurnIndicator";
import ScorePanel from "./ScorePanel";
import OptionsPanel from "./OptionsPanel";
import SoundToggle from "./SoundToggle";
import { RefreshCw } from "lucide-react";

export default function GamePanel({
	gameType,
	setGameType,
	mode,
	setMode,
	playerMark,
	setPlayerMark,
	soundOn,
	setSoundOn,
	engine,
	boardState,
	diceRoll,
	animateKey,
	lastMoveRef,
	handleCellClick,
	handleDiceRoll,
	handleUndo,
	handleRedo,
	handleReset,
}) {
	const winner = engine.getBoard().winner();

	return (
		<div className="bg-white/5 p-4 rounded-2xl shadow-2xl backdrop-blur flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h2 className="text-xl font-semibold">
						{gameType === "tic-tac-toe" ? "Tic-Tac-Toe" : "Snakes & Ladders"}
					</h2>
					<select
						value={gameType}
						onChange={(e) => setGameType(e.target.value)}
						className="bg-slate-700 text-white rounded mt-1"
					>
						<option value="tic-tac-toe">Tic-Tac-Toe</option>
						<option value="snake-and-ladders">Snakes & Ladders</option>
					</select>
					<p className="text-sm text-slate-300">
						Mode: {mode.replace(/-/g, " ")}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<SoundToggle soundOn={soundOn} setSoundOn={setSoundOn} />
					<button
						onClick={handleReset}
						title="Reset"
						className="p-2 rounded-lg bg-white/6"
						aria-label="reset game"
					>
						<RefreshCw className="w-5 h-5" />
					</button>
				</div>
			</div>

			{gameType === "tic-tac-toe" ? (
				<Board
					cells={boardState}
					onCellClick={handleCellClick}
					winningLine={winner && winner.line}
					lastMove={lastMoveRef.current}
					animateKey={animateKey}
				/>
			) : (
				<SnakesAndLaddersBoardComponent
					cells={boardState}
					snakes={engine.initialBoard.snakes}
					ladders={engine.initialBoard.ladders}
				/>
			)}

			<div className="mt-4 grid grid-cols-2 gap-2">
				<TurnIndicator turn={engine.turn} />
				<div className="p-3 rounded-lg bg-white/3 flex items-center justify-between">
					<ScorePanel scores={engine.scores} />
					{gameType === "snake-and-ladders" && (
						<div className="flex flex-col items-center">
							<button
								onClick={handleDiceRoll}
								className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold"
							>
								Roll Dice
							</button>
							{diceRoll && <p className="mt-2">You rolled a {diceRoll}</p>}
						</div>
					)}
					{gameType === "tic-tac-toe" && mode !== "human-vs-ai" && (
						<div className="flex gap-2 ml-2">
							<button
								onClick={handleUndo}
								disabled={mode === "human-vs-ai"}
								className={`px-3 py-1 rounded bg-white/6 transition-opacity ${
									mode === "human-vs-ai"
										? "opacity-50 cursor-not-allowed"
										: "hover:bg-white/10"
								}`}
							>
								Undo
							</button>
							<button
								onClick={handleRedo}
								disabled={mode === "human-vs-ai"}
								className={`px-3 py-1 rounded bg-white/6 transition-opacity ${
									mode === "human-vs-ai"
										? "opacity-50 cursor-not-allowed"
										: "hover:bg-white/10"
								}`}
							>
								Redo
							</button>
						</div>
					)}
				</div>
			</div>

			{gameType === "tic-tac-toe" && (
				<OptionsPanel
					mode={mode}
					setMode={setMode}
					playerMark={playerMark}
					setPlayerMark={setPlayerMark}
					onNewRound={handleReset}
				/>
			)}

			{winner ? (
				<div className="mt-auto pt-4">
					<div className="text-sm">Winner</div>
					<div className="font-bold text-lg">{winner.mark} wins!</div>
				</div>
			) : engine.getBoard().isGameOver() ? (
				<div className="mt-4 p-3 rounded-lg bg-slate-500/20 text-slate-200">
					It's a tie!
				</div>
			) : null}
		</div>
	);
}
