import { spawnGit } from "@git-it-nx/git";
import type { GitHubUser } from "../../../types/src/api-types.js";
import {
	addToList,
	challengeIncomplete,
	markChallengeCompleted,
} from "../helpers.js";
import { updateData } from "../user-data.js";

const currentChallenge = "githubbin";
const total = 3;
let counter = 0;
let user = "";

/**
 * Verifies that the user has set up Git config with username,
 * exists on GitHub, and that the usernames match (case sensitive).
 */
export function verifyGitHubbinChallenge(): void {
	counter = 0;

	spawnGit("config user.username", (err: Error | null, stdout: string) => {
		if (err) {
			addToList(`Error: ${err.message}`, false);
			return challengeIncomplete();
		}

		user = stdout.trim();
		if (user === "") {
			addToList("No username found.", false);
			challengeIncomplete();
		} else {
			counter++;
			addToList("Username added to Git config!", true);
			checkGitHub(user);
		}
	});

	async function checkGitHub(user: string): Promise<void> {
		try {
			const response = await fetch(`https://api.github.com/users/${user}`, {
				headers: {
					"User-Agent": "git-it-electron",
					Accept: "application/vnd.github.v3+json",
				},
			});

			if (response.status === 404) {
				addToList(
					"GitHub account matching Git config\nusername wasn't found.",
					false,
				);
				return challengeIncomplete();
			}

			if (!response.ok) {
				addToList(`GitHub API Error: ${response.status}`, false);
				return challengeIncomplete();
			}

			const body = (await response.json()) as GitHubUser;
			counter++;
			addToList("You're on GitHub!", true);
			checkCapitals(body.login, user);
		} catch (error) {
			addToList(`Error: ${(error as Error).message}`, false);
			challengeIncomplete();
		}
	}

	function checkCapitals(githubUsername: string, configUsername: string): void {
		if (new RegExp(githubUsername).exec(configUsername)) {
			counter++;
			addToList("Username same on GitHub and\nGit config!", true);
		} else {
			addToList("GitHub & Git config usernames\ndo not match.", false);
			challengeIncomplete();
		}

		if (counter === total) {
			markChallengeCompleted(currentChallenge);
			updateData(currentChallenge);
		}
	}
}
