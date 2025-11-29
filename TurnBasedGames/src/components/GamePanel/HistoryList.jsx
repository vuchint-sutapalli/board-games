import React from "react";

export default function HistoryList({ history, currentIndex, onJumpTo }) {
	return (
		<div className="flex flex-col gap-2">
			{history.map((b, idx) => (
				<button
					key={idx}
					onClick={() => onJumpTo(idx)}
					className={`text-left p-2 rounded ${
						currentIndex === idx ? "bg-emerald-600/20" : "bg-white/3"
					}`}
				>
					<div className="text-sm">Move {idx}</div>
					<div className="text-xs text-slate-300">
						{b.cells.map((c) => (c ? c : "-")).join(" ")}
					</div>
				</button>
			))}
		</div>
	);
}
