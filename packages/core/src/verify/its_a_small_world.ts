import { spawnGit } from "@git-it-nx/git";
import {
	addToList,
	challengeIncomplete,
	markChallengeCompleted,
} from "../helpers.js";
import { updateData } from "../user-data.js";

const url = "http://reporobot.jlord.us/collab?username=";
const currentChallenge = "its_a_small_world";

/**
 * Verifies that the user has added Reporobot as a collaborator on their fork.
 */
export function verifySmallWorldChallenge(): void {
	spawnGit("config user.username", (err: Error | null, stdout: string) => {
		if (err) {
			addToList(`Error: ${err.message}`, false);
			return challengeIncomplete();
		}
		const username = stdout.trim();
		collaborating(username);
	});

	/**
	 * Check that they've added RR as a collaborator
	 */
	async function collaborating(username: string): Promise<void> {
		try {
			const response = await fetch(url + username);

			if (!response.ok) {
				addToList(`HTTP Error: ${response.status}`, false);
				return challengeIncomplete();
			}

			const body = (await response.json()) as {
				collab: boolean;
				error?: string;
			};

			if (body.collab === true) {
				addToList("Reporobot has been added!", true);
				markChallengeCompleted(currentChallenge);
				updateData(currentChallenge);
			} else {
				// If they have a non 200 error, log it so that we can use
				// devtools to help user debug what went wrong
				if (body.error) {
					console.log("StatusCode:", response.status, "Body:", body);
				}
				addToList("Reporobot doesn't have access to the fork.", false);
				challengeIncomplete();
			}
		} catch (error) {
			addToList(`Error: ${(error as Error).message}`, false);
			challengeIncomplete();
		}
	}
}
