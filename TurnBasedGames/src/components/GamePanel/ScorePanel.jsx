import React from "react";

export default function ScorePanel({ scores }) {
	return (
		<div className="p-3 rounded-lg bg-white/3">
			<div className="text-sm text-slate-200">Scores</div>
			<div className="text-xs text-slate-300">
				X: {scores.X} • O: {scores.O} • Ties: {scores.ties}
			</div>
		</div>
	);
}
