import React from "react";

export default function TurnIndicator({ turn }) {
	return (
		<div className="p-3 rounded-lg bg-white/3">
			<div className="text-sm text-slate-200">Turn</div>
			<div className="font-semibold text-lg">{turn}</div>
		</div>
	);
}
