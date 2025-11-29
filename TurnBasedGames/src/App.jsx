import React, { useEffect, useState } from "react";
import GamePanel from "./components/GamePanel/GamePanel";
import InfoPanel from "./components/GamePanel/InfoPanel";
import { useGame } from "./components/GamePanel/hooks/useGame";

export default function App() {
	const [gameType, setGameType] = useState("tic-tac-toe");
	const [mode, setMode] = useState("human-vs-human");
	const [playerMark, setPlayerMark] = useState("X");
	const [soundOn, setSoundOn] = useState(true);

	useEffect(() => {
		const saved = localStorage.getItem("ttt_app_v1");
		if (saved) {
			try {
				const p = JSON.parse(saved);
				if (p.mode) setMode(p.mode);
				if (p.playerMark) setPlayerMark(p.playerMark);
			} catch (e) {
				console.warn("failed to load saved game", e);
			}
		}
	}, []);

	const game = useGame(gameType, mode, playerMark, soundOn);

	useEffect(() => {
		localStorage.setItem(
			"ttt_app_v1",
			JSON.stringify({ scores: game.engine.scores, mode, playerMark })
		);
	}, [game.engine.scores, mode, playerMark]);

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
				<GamePanel
					{...{
						gameType,
						setGameType,
						mode,
						setMode,
						playerMark,
						setPlayerMark,
						soundOn,
						setSoundOn,
						...game,
					}}
				/>
				<InfoPanel
					history={game.engine.history}
					currentIndex={game.engine.current}
					onJumpTo={game.handleJumpTo}
				/>
			</div>
		</div>
	);
}
