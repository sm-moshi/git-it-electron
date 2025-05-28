import * as fs from "node:fs";
import * as path from "node:path";
import { spawnGit } from "@git-it-nx/git";
import {
	addToList,
	challengeIncomplete,
	markChallengeCompleted,
} from "../helpers.js";
import { updateData } from "../user-data.js";

const currentChallenge = "branches_arent_just_for_birds";
const total = 3;
let counter = 0;
let username = "";
let repopath = "";

/**
 * Verifies that the user has:
 * 1. Created a branch matching their username
 * 2. Pushed the branch to origin
 * 3. Added their file to the contributors directory
 */
export function verifyBranchesChallenge(repopathArg: string): void {
	counter = 0;
	repopath = repopathArg;

	if (!fs.lstatSync(repopath).isDirectory()) {
		return addToList("Path is not a directory.", false);
	}

	spawnGit(
		"config user.username",
		{ cwd: repopath },
		(err: Error | null, stdout: string) => {
			if (err) {
				challengeIncomplete();
				return addToList(`Error: ${err.message}`, false);
			}
			username = stdout.trim();

			spawnGit(
				"rev-parse --abbrev-ref HEAD",
				{ cwd: repopath },
				(err: Error | null, stdout: string) => {
					if (err) {
						addToList(`Error: ${err.message}`, false);
						return challengeIncomplete();
					}

					const actualBranch = stdout.trim();
					const expectedBranch = `add-${username}`;

					if (new RegExp(expectedBranch).exec(actualBranch)) {
						counter++;
						addToList("Found branch as expected!", true);
						checkPush(actualBranch);
					} else {
						addToList(`Branch name expected: ${expectedBranch}`, false);
						challengeIncomplete();
						checkPush(actualBranch);
					}
				},
			);
		},
	);

	function checkPush(branchname: string): void {
		spawnGit(
			`reflog show origin/${branchname}`,
			{ cwd: repopath },
			(err: Error | null, stdout: string) => {
				if (err) {
					addToList(`Error: ${err.message}`, false);
					return challengeIncomplete();
				}

				if (/update by push/.exec(stdout)) {
					counter++;
					addToList("Changes have been pushed!", true);
				} else {
					addToList("Changes not pushed.", false);
					challengeIncomplete();
				}
				findFile();
			},
		);
	}

	function findFile(): void {
		// see if user is already within /contributors
		if (/contributors/.exec(repopath)) {
			check(repopath);
		} else {
			check(path.join(repopath, "/contributors/"));
		}

		function check(userspath: string): void {
			fs.readdir(
				userspath,
				(err: NodeJS.ErrnoException | null, files: string[]) => {
					if (err) {
						addToList(`Error: ${err.message}`, false);
						return challengeIncomplete();
					}

					const allFiles = files.join();
					if (new RegExp(username).exec(allFiles)) {
						counter++;
						addToList("File in contributors folder!", true);
						if (counter === total) {
							markChallengeCompleted(currentChallenge);
							updateData(currentChallenge);
						}
					} else {
						addToList("File not in contributors folder.", false);
						challengeIncomplete();
					}
				},
			);
		}
	}
}
