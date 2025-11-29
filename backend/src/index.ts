import { createServer } from "http";
import { WebSocketServer } from "ws";

import { GameManager } from "./GameManager.js";

// Use the PORT environment variable provided by Railway, fallback to 8080 for local dev
const port = process.env.PORT || 8080;

// Create a simple HTTP server
const server = createServer((req, res) => {
	// Respond to HTTP requests (like health checks)
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("I am alive!\n");
});

// Attach the WebSocket server to the HTTP server
const wss = new WebSocketServer({ server });

const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
	gameManager.addUser(ws);

	ws.on("error", console.error);

	ws.on("message", function message(data) {
		console.log("received: %s", data);
	});

	ws.send("something");

	ws.on("close", function close() {
		gameManager.removeUser(ws);
	});
});

// Start listening
server.listen(port, () => {
	console.log(`🚀 Server is listening on port ${port}`);
});
