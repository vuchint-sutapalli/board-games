import React from "react";
import { Zap } from "lucide-react";

export default function SoundToggle({ soundOn, setSoundOn }) {
	return (
		<button
			aria-label="toggle sound"
			title="Toggle sound"
			onClick={() => setSoundOn((s) => !s)}
			className="p-2 rounded-lg bg-white/6"
		>
			<Zap className="w-5 h-5" />
		</button>
	);
}
