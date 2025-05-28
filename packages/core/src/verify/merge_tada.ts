import * as fs from "node:fs";
import { spawnGit } from "@git-it-nx/git";
import {
	addToList,
	challengeIncomplete,
	markChallengeCompleted,
} from "../helpers.js";
import { updateData } from "../user-data.js";

const currentChallenge = "merge_tada";
let counter = 0;
const total = 2;

/**
 * Verifies that a branch has been merged and the feature branch has been deleted.
 */
export function verifyMergeTadaChallenge(path: string): void {
	counter = 0;

	if (!fs.lstatSync(path).isDirectory()) {
		addToList("Path is not a directory.", false);
		return challengeIncomplete();
	}

	spawnGit("reflog -10", { cwd: path }, (err: Error | null, stdout: string) => {
		if (err) {
			addToList(`Error: ${err.message}`, false);
			return challengeIncomplete();
		}

		const ref = stdout.trim();

		if (ref.match("merge")) {
			counter++;
			addToList("Branch has been merged!", true);
		} else {
			addToList("No merge in the history.", false);
		}

		spawnGit("config user.username", (err: Error | null, stdout: string) => {
			if (err) {
				addToList("Could not find username.", false);
				return challengeIncomplete();
			}

			const user = stdout.trim();

			spawnGit("branch", { cwd: path }, (err: Error | null, stdout: string) => {
				if (err) {
					addToList(`Error: ${err.message}`, false);
					return challengeIncomplete();
				}

				const branches = stdout.trim();
				const branchName = `add-${user}`;

				if (branches.match(branchName)) {
					addToList("Uh oh, branch is still there.", false);
				} else {
					counter++;
					addToList("Branch deleted!", true);
					if (counter === total) {
						markChallengeCompleted(currentChallenge);
						updateData(currentChallenge);
					} else {
						challengeIncomplete();
					}
				}
			});
		});
	});
}
