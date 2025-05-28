import * as fs from "node:fs";
import { spawnGit } from "@git-it-nx/git";
import {
	addToList,
	challengeIncomplete,
	markChallengeCompleted,
} from "../helpers.js";
import { updateData } from "../user-data.js";

const currentChallenge = "remote_control";

/**
 * Verifies that changes have been pushed to the remote repository.
 */
export function verifyRemoteControlChallenge(path: string): void {
	if (!fs.lstatSync(path).isDirectory()) {
		addToList("Path is not a directory.", false);
		return challengeIncomplete();
	}

	spawnGit(
		"reflog show origin/master",
		{ cwd: path },
		(err: Error | null, stdout: string) => {
			if (err) {
				addToList(`Error: ${err.message}`, false);
				return challengeIncomplete();
			}

			const ref = stdout.trim();

			if (ref.match("update by push")) {
				addToList("You pushed changes!", true);
				markChallengeCompleted(currentChallenge);
				updateData(currentChallenge);
			} else {
				addToList("No evidence of push.", false);
				challengeIncomplete();
			}
		},
	);
}
