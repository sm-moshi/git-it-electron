/**
 * Type definitions for build scripts and static site generation
 */

export interface ChallengeContent {
	header: string;
	sidebar: string;
	footer: string;
	body: string;
	shortname: string;
}

export interface PreviousData {
	prename: string;
	preurl: string;
	nextname: string;
	nexturl: string;
	lang?: string;
}
