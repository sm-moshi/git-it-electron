import { spawnGit } from "@git-it-nx/git";
import {
	addToList,
	challengeIncomplete,
	markChallengeCompleted,
} from "../helpers.js";
import { updateData } from "../user-data.js";

const currentChallenge = "requesting_you_pull_please";
const url = "http://reporobot.jlord.us/pr?username=";

/**
 * Verifies that the user has submitted a pull request to the original repository.
 */
export function verifyPRChallenge(): void {
	spawnGit("config user.username", (err: Error | null, stdout: string) => {
		if (err) {
			addToList(`Error: ${err.message}`, false);
			return challengeIncomplete();
		}
		const username = stdout.trim();
		pullrequest(username);
	});

	async function pullrequest(username: string): Promise<void> {
		try {
			const response = await fetch(url + username);

			if (!response.ok) {
				addToList(`HTTP Error: ${response.status}`, false);
				return challengeIncomplete();
			}

			const body = (await response.json()) as { pr: boolean };

			if (body.pr) {
				addToList("Found your pull request!", true);
				markChallengeCompleted(currentChallenge);
				updateData(currentChallenge);
			} else {
				addToList(
					`No merged pull request found for ${username}. If you did make a pull request, return to its website to see comments.`,
					false,
				);
				challengeIncomplete();
			}
		} catch (error) {
			addToList(`Error: ${(error as Error).message}`, false);
			challengeIncomplete();
		}
	}
}
