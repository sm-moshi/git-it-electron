/**
 * Git-specific type definitions
 */

// Git command options
export interface GitOptions {
	cwd?: string;
	env?: Record<string, string>;
	encoding?: BufferEncoding;
	timeout?: number;
	maxBuffer?: number;
}

// Git command result
export interface GitResult {
	stdout: string;
	stderr: string;
	exitCode: number;
}

// Git status information
export interface GitStatus {
	branch: string;
	ahead: number;
	behind: number;
	staged: string[];
	unstaged: string[];
	untracked: string[];
	isClean: boolean;
}

// Git configuration
export interface GitConfig {
	"user.name"?: string;
	"user.email"?: string;
	"core.editor"?: string;
	[key: string]: string | undefined;
}

// Git remote information
export interface GitRemote {
	name: string;
	url: string;
	pushUrl?: string;
}

// Git branch information
export interface GitBranch {
	name: string;
	current: boolean;
	remote?: string;
	upstream?: string;
}

// Git commit information
export interface GitCommit {
	hash: string;
	shortHash: string;
	author: string;
	email: string;
	date: Date;
	message: string;
}

// Common Git commands type safety
export const GIT_COMMANDS = {
	STATUS: "status",
	ADD: "add",
	COMMIT: "commit",
	PUSH: "push",
	PULL: "pull",
	CLONE: "clone",
	INIT: "init",
	BRANCH: "branch",
	CHECKOUT: "checkout",
	MERGE: "merge",
	REMOTE: "remote",
	LOG: "log",
	DIFF: "diff",
	CONFIG: "config",
	VERSION: "--version",
} as const;

export type GitCommand = (typeof GIT_COMMANDS)[keyof typeof GIT_COMMANDS];
