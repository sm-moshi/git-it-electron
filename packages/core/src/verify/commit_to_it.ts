import * as fs from "node:fs";
import { spawnGit } from "@git-it-nx/git";
import {
	addToList,
	challengeIncomplete,
	markChallengeCompleted,
} from "../helpers.js";
import { updateData } from "../user-data.js";

const currentChallenge = "commit_to_it";

/**
 * Verifies that changes have been committed to the Git repository.
 */
export function verifyCommitToItChallenge(path: string): void {
	if (!fs.lstatSync(path).isDirectory()) {
		addToList("Path is not a directory.", false);
		return challengeIncomplete();
	}

	spawnGit("status", { cwd: path }, (err: Error | null, stdout: string) => {
		if (err) {
			addToList(`Error: ${err.message}`, false);
			return challengeIncomplete();
		}

		const show = stdout.trim();

		if (/Initial commit/.exec(show)) {
			addToList("Can't find committed changes.", false);
			challengeIncomplete();
		} else if (/nothing to commit/.exec(show)) {
			addToList("Changes have been committed!", true);
			markChallengeCompleted(currentChallenge);
			updateData(currentChallenge);
		} else {
			addToList("Seems there are changes to commit still.", false);
			challengeIncomplete();
		}
	});
}
