import { test as base, expect, Page } from "@playwright/test";

const domainUrl = "https://board-games-zeta.vercel.app/";

// ---------- Helpers ----------

async function gotoDashboard(page: Page) {
	await page.goto(domainUrl);
}

async function openGame(
	page: Page,
	gameName: "Chess" | "Tic Tac Toe" | "Snake and Ladder"
) {
	await page.getByRole("button", { name: gameName }).click();
}

async function startTicTacToeVsComputer(page: Page) {
	await gotoDashboard(page);
	await openGame(page, "Tic Tac Toe");
	await page.getByRole("button", { name: "Play vs Computer" }).click();
}

async function startSnakeAndLadderVsHuman(page: Page) {
	await gotoDashboard(page);
	await openGame(page, "Snake and Ladder");
	await expect(
		page.getByRole("img", { name: /snake and ladder game/i })
	).toBeVisible();
	await page.getByRole("button", { name: "Play vs Human" }).click();
}

async function waitForComputerMove(page: Page) {
	// You can later replace this with a smarter wait
	// (e.g. waiting for "Turn: P2" to appear).
	await page.waitForTimeout(1000);
}

// Tic-tac-toe board cell click by index (reusing your nth indexes)
async function clickTicTacToeCell(page: Page, index: number) {
	await page.getByRole("button").nth(index).click();
}

// ---------- Fixtures for multiplayer (two players) ----------

type Fixtures = {
	player1: Page;
	player2: Page;
};

const test = base.extend<Fixtures>({
	player1: async ({ browser }, run) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		await run(page);
		await context.close();
	},
	player2: async ({ browser }, run) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		await run(page);
		await context.close();
	},
});
export {
	test,
	gotoDashboard,
	openGame,
	startTicTacToeVsComputer,
	startSnakeAndLadderVsHuman,
	waitForComputerMove,
	clickTicTacToeCell,
};
