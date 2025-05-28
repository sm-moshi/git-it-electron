import { type GitCallback, spawnGit } from "../../../git/src/git.js";
import {
	addToList,
	challengeIncomplete,
	markChallengeCompleted,
} from "../helpers.js";
import { updateData } from "../user-data.js";

const currentChallenge = "get_git";
const total = 3;
let counter = 0;

/**
 * Verifies that Git is installed and configured with user email and name.
 */
export function verifyGetGitChallenge(): void {
	counter = 0;

	spawnGit("config user.email", (err: Error | null, stdout: string) => {
		if (err) {
			addToList(`Error: ${err.message}`, false);
			return challengeIncomplete();
		}

		const email = stdout.trim();
		if (email === "") {
			addToList("No email found.", false);
			challengeIncomplete();
		} else {
			counter++;
			addToList("Email Added!", true);

			spawnGit("config user.name", (err: Error | null, stdout: string) => {
				if (err) {
					addToList(`Error: ${err.message}`, false);
					return challengeIncomplete();
				}

				const name = stdout.trim();
				if (name === "") {
					addToList("No name found.", false);
					challengeIncomplete();
				} else {
					counter++;
					addToList("Name Added!", true);

					spawnGit("--version", (err: Error | null, stdout: string) => {
						if (err) {
							addToList(`Error: ${err.message}`, false);
							return challengeIncomplete();
						}

						const gitOutput = stdout.trim();
						if (/git version/.exec(gitOutput)) {
							counter++;
							addToList("Found Git installed!", true);
						} else {
							addToList("Did not find Git installed.", false);
							challengeIncomplete();
						}

						if (counter === total) {
							markChallengeCompleted(currentChallenge);
							updateData(currentChallenge);
						}
					});
				}
			});
		}
	});
}
