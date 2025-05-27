/**
 * This module is a wrapper to the exec call used in each of the verify scripts.
 * It first checks what operating system is being used and if Windows it uses
 * the Portable Git rather than the system Git.
 */

import { exec } from "node:child_process";
import * as path from "node:path";
import * as os from "node:os";

const winGit = path.join(__dirname, "../../../assets/PortableGit/bin/git.exe");

import type { GitExecOptions, GitCallback } from "@git-it-nx/types";

export type { GitExecOptions, GitCallback };

export function spawnGit(command: string, callback: GitCallback): void;
export function spawnGit(command: string, options: GitExecOptions, callback: GitCallback): void;
export function spawnGit(
	command: string,
	optionsOrCallback: GitExecOptions | GitCallback,
	callback?: GitCallback
): void {
	let options: GitExecOptions = {};
	let cb: GitCallback;

	if (typeof optionsOrCallback === "function") {
		cb = optionsOrCallback;
	} else {
		options = optionsOrCallback;
		cb = callback!;
	}

	const gitCommand = os.platform() === "win32"
		? `"${winGit}" ${command}`
		: `git ${command}`;

	exec(gitCommand, options, cb);
}
