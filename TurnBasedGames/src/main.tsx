import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./screens/Landing";
import GamePage from "./screens/GamePage";
import { SnackbarProvider } from "./SnackbarContext";

// import App from './App.jsx'

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<SnackbarProvider>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/local/:gameType" element={<App />} />
					<Route path="/play/:gameType" element={<GamePage />} />
				</Routes>
			</SnackbarProvider>
		</BrowserRouter>
	</StrictMode>
);
