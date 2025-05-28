/**
 * Challenge-specific type definitions
 */

// Challenge names enum for type safety
export const CHALLENGES = {
	GET_GIT: "get_git",
	REPOSITORY: "repository",
	COMMIT_TO_IT: "commit_to_it",
	GITHUBBIN: "githubbin",
	REMOTE_CONTROL: "remote_control",
	FORKS_AND_CLONES: "forks_and_clones",
	BRANCHES_ARENT_JUST_FOR_BIRDS: "branches_arent_just_for_birds",
	ITS_A_SMALL_WORLD: "its_a_small_world",
	PULL_NEVER_OUT_OF_DATE: "pull_never_out_of_date",
	REQUESTING_YOU_PULL_PLEASE: "requesting_you_pull_please",
	MERGE_TADA: "merge_tada",
} as const;

export type ChallengeName = (typeof CHALLENGES)[keyof typeof CHALLENGES];

// Challenge status
export interface ChallengeProgress {
	[challengeName: string]: {
		completed: boolean;
		next_challenge?: string;
		completedAt?: Date;
		attempts?: number;
	};
}

// Verification result
export interface VerificationResult {
	success: boolean;
	message: string;
	details?: string[];
}

// Challenge metadata
export interface ChallengeMetadata {
	id: ChallengeName;
	title: string;
	description: string;
	instructions: string[];
	requiresDirectory: boolean;
	order: number;
	nextChallenge?: ChallengeName;
	dependencies?: ChallengeName[];
}

// DOM element IDs used in challenges
export const DOM_IDS = {
	VERIFY_BUTTON: "verify-challenge",
	VERIFY_LIST: "verify-list",
	SELECT_DIRECTORY: "select-directory",
	DIRECTORY_PATH: "directory-path",
	PATH_WARNING: "path-required-warning",
	CLEAR_BUTTON: "clear-completed-challenge",
	VERIFY_SPINNER: "verify-spinner",
} as const;
