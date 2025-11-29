import React from "react";

export default function OptionsPanel({
	mode,
	setMode,
	playerMark,
	setPlayerMark,
	onNewRound,
}) {
	return (
		<div className="mt-4 p-3 rounded-lg bg-white/2 text-sm text-slate-300">
			<div className="mb-2">Options</div>
			<div className="flex flex-wrap gap-2">
				<select
					value={mode}
					onChange={(e) => setMode(e.target.value)}
					className="rounded p-2 bg-white/5"
				>
					<option value="human-vs-ai">Human vs AI</option>
					<option value="human-vs-human">Human vs Human</option>
				</select>

				<select
					value={playerMark}
					onChange={(e) => setPlayerMark(e.target.value)}
					className="rounded p-2 bg-white/5"
				>
					<option value="X">Play as X</option>
					<option value="O">Play as O</option>
				</select>

				<button onClick={onNewRound} className="rounded px-3 py-2 bg-white/6">
					New Round
				</button>
			</div>
		</div>
	);
}
