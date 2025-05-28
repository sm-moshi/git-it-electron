/**
 * This module is a wrapper to the exec call used in each of the verify scripts.
 * It first checks what operating system is being used and if Windows it uses
 * the Portable Git rather than the system Git.
 */

import { type ChildProcess, exec } from "node:child_process";
import * as os from "node:os";
import * as path from "node:path";
import type { GitCallback, GitExecOptions } from "../../types/src/index.js";

// Re-export types for backward compatibility
export type { GitExecOptions, GitCallback };

const winGit = path.join(__dirname, "../../../assets/PortableGit/bin/git.exe");

export function spawnGit(command: string, callback: GitCallback): void;
export function spawnGit(
	command: string,
	options: GitExecOptions,
	callback: GitCallback,
): void;
export function spawnGit(
	command: string,
	optionsOrCallback: GitExecOptions | GitCallback,
	callback?: GitCallback,
): void {
	let options: GitExecOptions = {};
	let cb: GitCallback;

	if (typeof optionsOrCallback === "function") {
		cb = optionsOrCallback;
	} else {
		options = optionsOrCallback;
		cb = callback!;
	}

	const gitCommand =
		os.platform() === "win32" ? `"${winGit}" ${command}` : `git ${command}`;

	exec(gitCommand, options, cb);
}
