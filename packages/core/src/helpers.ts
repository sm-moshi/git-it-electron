/**
 * This module is used by every challenge's verify file and is an API for writing
 * partial challenge completion messages to the DOM and setting a challenge
 * as complete when all parts of a challenge have passed.
 *
 * It also sets the language for each challenge's verify's process's Git to
 * English.
 */

import * as process from "node:process";
import {
	challengeIncomplete as challengeIncompleteHandler,
	enableClearStatus,
} from "./challenge-completed.js";

// Set each challenge verifying process to use
// English language pack
// Potentially move this to user-data.js
process.env.LANG = "C";

const ul = document.getElementById("verify-list") as HTMLUListElement | null;

export function addToList(message: string, status: boolean): void {
	if (!ul) return;

	const li = document.createElement("li");
	const newContent = document.createTextNode(message);
	li.appendChild(newContent);

	if (status) {
		li.classList.add("verify-pass");
	} else {
		li.classList.add("verify-fail");
	}

	ul.appendChild(li);
	// TODO: potentially do this with domify and push
	// TODO: into an array and add to dom once
}

export function markChallengeCompleted(challenge: string): void {
	const challengeElement = document.getElementById(challenge);
	challengeElement?.classList.add("completed");
	enableClearStatus(challenge);
}

export function challengeIncomplete(): void {
	challengeIncompleteHandler();
}
