import * as fs from "node:fs";
import { spawnGit } from "@git-it-nx/git";
import {
	addToList,
	challengeIncomplete,
	markChallengeCompleted,
} from "../helpers.js";
import { updateData } from "../user-data.js";

const currentChallenge = "forks_and_clones";
let username = "";

/**
 * Verifies that the user has forked and cloned the repository by checking
 * that they've added the correct remote repositories.
 */
export function verifyForksAndClonesChallenge(path: string): void {
	if (!fs.lstatSync(path).isDirectory()) {
		addToList("Path is not a directory.", false);
		return challengeIncomplete();
	}

	spawnGit("config user.username", (err: Error | null, stdout: string) => {
		if (err) {
			addToList(`Error: ${err.message}`, false);
			return challengeIncomplete();
		}
		username = stdout.trim();

		spawnGit(
			"remote -v",
			{ cwd: path },
			(err: Error | null, stdout: string) => {
				if (err) {
					addToList(`Error: ${err.message}`, false);
					return challengeIncomplete();
				}

				const remotes = stdout.trim().split("\n");
				if (remotes.length !== 4) {
					addToList("Did not find 2 remotes set up.", false);
					challengeIncomplete();
					updateData(currentChallenge);
					return;
				}

				// Remove duplicate entries (fetch/push for same remote)
				const uniqueRemotes = remotes.filter((_, index) => index % 2 === 0);
				let incomplete = 0;

				uniqueRemotes.forEach((remote) => {
					if (remote.match("origin")) {
						if (remote.match(`github.com[:/]${username}/`)) {
							addToList("Origin points to your fork!", true);
						} else {
							incomplete++;
							addToList(
								`Origin remote not pointing to ${username}/patchwork.`,
								false,
							);
						}
					}
					if (remote.match("upstream")) {
						if (remote.match("github.com[:/]jlord/")) {
							addToList("Upstream remote set up!", true);
						} else {
							incomplete++;
							addToList(
								"Upstream remote not pointing to jlord/patchwork.",
								false,
							);
						}
					}
				});

				if (incomplete === 0) {
					updateData(currentChallenge);
					markChallengeCompleted(currentChallenge);
				} else {
					challengeIncomplete();
				}
			},
		);
	});
}
