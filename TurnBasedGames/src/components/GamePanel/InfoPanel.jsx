import React from "react";
import HistoryList from "./HistoryList";

export default function InfoPanel({ history, currentIndex, onJumpTo }) {
	return (
		<div className="bg-white/5 p-4 rounded-2xl shadow-2xl backdrop-blur">
			<div className="mb-4">
				<h3 className="text-lg font-semibold">Move history & replay</h3>
				<p className="text-sm text-slate-300">
					Click a past move to view the board at that point.
				</p>
			</div>

			<HistoryList
				history={history}
				currentIndex={currentIndex}
				onJumpTo={onJumpTo}
			/>

			<div className="mt-4">
				<h4 className="font-semibold">Accessibility & Tips</h4>
				<ul className="list-disc ml-5 text-sm text-slate-300 mt-2">
					<li>
						Use keyboard to navigate: Tab to focus a cell, Enter to place mark.
					</li>
					<li>Game state persists scores & mode to localStorage.</li>
					<li>AI uses minimax with alpha-beta pruning for optimal play.</li>
				</ul>
			</div>

			<div className="mt-6 text-xs text-slate-400">
				Built with OOP core classes (Board, GameEngine, AIPlayer) and a small
				React UI.
			</div>
		</div>
	);
}
