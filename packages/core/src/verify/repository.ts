import * as fs from "node:fs";
import { spawnGit } from "@git-it-nx/git";
import { addToList, markChallengeCompleted, challengeIncomplete } from "../helpers.js";
import { updateData } from "../user-data.js";

const currentChallenge = "repository";

/**
 * Verifies that the given path is a Git repository.
 */
export function verifyRepositoryChallenge(path: string): void {
  // Path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToList("Path is not a directory.", false);
    return challengeIncomplete();
  }

  spawnGit("status", { cwd: path }, (err: Error | null, stdout: string) => {
    if (err) {
      addToList("This folder is not being tracked by Git.", false);
      return challengeIncomplete();
    }

    // Can't return on error since git's 'fatal' not a repo is an error
    // Potentially read file, look for '.git' directory
    const status = stdout.trim();
    if (status.match("On branch")) {
      addToList("This is a Git repository!", true);
      markChallengeCompleted(currentChallenge);
      updateData(currentChallenge);
    } else {
      addToList("This folder isn't being tracked by Git.", false);
      challengeIncomplete();
    }
  });
}