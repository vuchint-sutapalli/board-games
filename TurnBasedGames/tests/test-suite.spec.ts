import { expect } from "@playwright/test";
import {
	clickTicTacToeCell,
	gotoDashboard,
	openGame,
	startSnakeAndLadderVsHuman,
	startTicTacToeVsComputer,
	test,
	waitForComputerMove,
} from "./Fixtures/games";

// ---------- Tests ----------
test("tic tac toe vs computer - computer wins (P2)", async ({ page }) => {
	await startTicTacToeVsComputer(page);

	// Original move sequence
	await clickTicTacToeCell(page, 2);
	await waitForComputerMove(page);

	await clickTicTacToeCell(page, 0);
	await waitForComputerMove(page);

	await clickTicTacToeCell(page, 5);

	await expect(page.getByText("Winner: P2")).toBeVisible();
});

test("tic tac toe vs computer - perfect draw", async ({ page }) => {
	await startTicTacToeVsComputer(page);

	// Same sequence as your original "perfect draw" test
	await clickTicTacToeCell(page, 4);
	await waitForComputerMove(page);

	await clickTicTacToeCell(page, 2);
	await waitForComputerMove(page);

	await clickTicTacToeCell(page, 3);
	await waitForComputerMove(page);

	await clickTicTacToeCell(page, 7);
	await waitForComputerMove(page);

	await clickTicTacToeCell(page, 8);

	await expect(page.getByText("ℹ️Game Over! It's a draw!")).toBeVisible();
});

test("dashboard shows all games and their images", async ({ page }) => {
	await gotoDashboard(page);

	// Cards visible on dashboard
	await expect(page.getByRole("img", { name: "Chess game" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Chess" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Tic Tac Toe" })).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Snake and Ladder" })
	).toBeVisible();

	// Tic Tac Toe card navigation
	await openGame(page, "Tic Tac Toe");
	await expect(
		page.getByRole("img", { name: "Tic Tac Toe game" })
	).toBeVisible();

	// Snake and Ladder card navigation
	await openGame(page, "Snake and Ladder");
	await expect(
		page.getByRole("img", { name: "Snake and Ladder game" })
	).toBeVisible();
});

test("tic tac toe vs computer - game initialization", async ({ page }) => {
	await startTicTacToeVsComputer(page);

	await expect(page.getByText("You are Player: P1")).toBeVisible();
	await expect(page.getByText("Turn: P1")).toBeVisible();
});

test("tic tac toe - multiplayer connection works", async ({
	player1,
	player2,
}) => {
	// --- Player 1 joins and waits ---
	await gotoDashboard(player1);
	await openGame(player1, "Tic Tac Toe");
	await player1.getByRole("button", { name: "Play vs Human" }).click();

	await expect(
		player1.getByText("Waiting for another player...")
	).toBeVisible();
	await expect(
		player1.getByRole("heading", { name: /tictactoe/i })
	).toBeVisible();

	// --- Player 2 joins ---
	await gotoDashboard(player2);
	await openGame(player2, "Tic Tac Toe");
	await player2.getByRole("button", { name: "Play vs Human" }).click();

	// --- Both sides see consistent roles/turns ---
	await expect(player2.getByText("You are Player: P2")).toBeVisible();
	await expect(player2.getByText("Turn: P1")).toBeVisible();

	await expect(player1.getByText("You are Player: P1")).toBeVisible();
	await expect(player1.getByText("Turn: P1")).toBeVisible();
});

test("snake and ladder - multiplayer connection works", async ({
	player1,
	player2,
}) => {
	// --- Player 1 joins first and waits ---
	await startSnakeAndLadderVsHuman(player1);

	await expect(
		player1.getByText("Waiting for another player...")
	).toBeVisible();
	await expect(
		player1.getByRole("heading", { name: /snake ladder/i })
	).toBeVisible();

	// --- Player 2 joins ---
	await gotoDashboard(player2);
	await openGame(player2, "Snake and Ladder");
	await expect(
		player2.getByRole("img", { name: /snake and ladder game/i })
	).toBeVisible();
	await player2.getByRole("button", { name: "Play vs Human" }).click();

	// --- Role & turn sync ---
	await expect(player2.getByText("You are Player: P2")).toBeVisible();
	await expect(player2.getByText("Turn: P1")).toBeVisible();
	await expect(
		player2.getByRole("heading", { name: /snake ladder/i })
	).toBeVisible();

	await expect(player1.getByText("You are Player: P1")).toBeVisible();
	await expect(player1.getByText("Turn: P1")).toBeVisible();
	await expect(
		player1.getByRole("heading", { name: /snake ladder/i })
	).toBeVisible();
});
