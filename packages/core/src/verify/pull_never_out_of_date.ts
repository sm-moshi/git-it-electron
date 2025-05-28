import { spawnGit } from "@git-it-nx/git";
import {
	addToList,
	challengeIncomplete,
	markChallengeCompleted,
} from "../helpers.js";
import { updateData } from "../user-data.js";

const currentChallenge = "pull_never_out_of_date";

/**
 * Verifies that the repository is up to date with the remote by checking
 * if there are any changes to pull.
 */
export function verifyPullChallenge(path: string): void {
	spawnGit(
		"fetch --dry-run",
		{ cwd: path },
		(err: Error | null, stdout: string) => {
			if (err) {
				addToList(`Error: ${err.message}`, false);
				return challengeIncomplete();
			}

			const status = stdout.trim();
			if (!err && status === "") {
				addToList("Up to date!", true);
				markChallengeCompleted(currentChallenge);
				updateData(currentChallenge);
			} else {
				addToList("There are changes to pull in.", false);
				challengeIncomplete();
			}
		},
	);
}
