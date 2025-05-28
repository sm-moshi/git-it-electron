/**
 * Renderer Process—This module is required by the index page.
 * It touches the DOM by showing progress in challenge completion.
 * It also handles the clear buttons and writing to user-data.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import type { UserData } from "./user-data.js";
import { getData } from "./user-data.js";

document.addEventListener("DOMContentLoaded", async () => {
	const data = await getData();

	// Buttons
	const clearAllButtons = document.querySelectorAll<HTMLButtonElement>(
		".js-clear-all-challenges",
	);
	const leftOffButton = document.getElementById(
		"left-off-from",
	) as HTMLAnchorElement | null;

	// Sections
	const showFirstRun = document.getElementById("show-first-run");
	const showWipRun = document.getElementById("show-wip-run");
	const showFinishedRun = document.getElementById("show-finished-run");

	updateIndex(data.contents);

	// Listen for Clear All Button Events, trigger confirmation dialog
	clearAllButtons.forEach((button) => {
		button.addEventListener("click", async () => {
			const response = await window.api.confirmClear();
			if (response === 1) return; // User clicked "No"
			clearAllChallenges(data);
		});
	});

	/**
	 * Show the first run UI state
	 */
	function showFirstRunState(): void {
		if (showFirstRun) showFirstRun.style.display = "block";
		if (showWipRun) showWipRun.style.display = "none";
		if (showFinishedRun) showFinishedRun.style.display = "none";
	}

	/**
	 * Show the work in progress UI state
	 */
	function showWipState(): void {
		if (showWipRun) showWipRun.style.display = "block";
		if (showFirstRun) showFirstRun.style.display = "none";
		if (showFinishedRun) showFinishedRun.style.display = "none";
	}

	/**
	 * Show the all completed UI state
	 */
	function showCompletedState(): void {
		if (showFirstRun) showFirstRun.style.display = "none";
		if (showWipRun) showWipRun.style.display = "none";
		if (showFinishedRun) showFinishedRun.style.display = "block";
	}

	/**
	 * Handle a completed challenge
	 */
	function handleCompletedChallenge(
		challengeData: Record<string, any>,
		challengeKey: string,
		circles: NodeListOf<HTMLElement>,
		counter: number,
	): void {
		showWipState();

		// Mark the corresponding circle as completed
		circles[counter]?.classList.add("completed");

		// Show the button to go to next challenge
		if (leftOffButton && challengeData[challengeKey].next_challenge) {
			leftOffButton.href = path.join(
				__dirname,
				"..",
				"challenges",
				`${challengeData[challengeKey].next_challenge}.html`,
			);
		}
	}

	/**
	 * Update UI based on completion count
	 */
	function updateUIState(completed: number, totalChallenges: number): void {
		if (completed === 0) {
			showFirstRunState();
		} else if (completed === totalChallenges) {
			showCompletedState();
		}
		// WIP state is already shown in handleCompletedChallenge
	}

	/**
	 * Go through each challenge in user data to see which are completed
	 */
	function updateIndex(challengeData: Record<string, any>): void {
		const circles = document.querySelectorAll<HTMLElement>(".progress-circle");
		let counter = 0;
		let completed = 0;

		for (const challengeKey in challengeData) {
			if (challengeData[challengeKey]?.completed) {
				handleCompletedChallenge(challengeData, challengeKey, circles, counter);
				completed++;
			}
			counter++;
		}

		updateUIState(completed, Object.keys(challengeData).length);
	}

	function clearAllChallenges(userData: UserData): void {
		for (const challengeKey in userData.contents) {
			if (userData.contents[challengeKey]?.completed) {
				userData.contents[challengeKey].completed = false;
			}
		}

		fs.writeFileSync(userData.path, JSON.stringify(userData.contents, null, 2));

		// If they clear all challenges, go back to first run HTML
		const circles = document.querySelectorAll<HTMLElement>(".progress-circle");
		circles.forEach((circle) => {
			circle.classList.remove("completed");
		});

		showFirstRunState();
	}
});
