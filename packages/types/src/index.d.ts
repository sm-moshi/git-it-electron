/**
 * Shared type definitions for git-it-nx
 */

// Global Window extensions
declare global {
	interface Window {
		currentChallenge: string;
		api: {
			// IPC API that will be exposed by preload script
			getUserDataPath: () => Promise<string>;
			getUserSavedDir: () => Promise<string>;
			openFileDialog: () => Promise<string[]>;
			confirmClear: () => Promise<number>; // Returns button index (0=Yes, 1=No)
			openExternal: (url: string) => Promise<void>;
			removeAllListeners: (channel: string) => void;
			getPlatform: () => string;
		};
	}
}

// User Data Types
export interface UserData {
	path: string;
	contents: Record<string, ChallengeData>;
}

export interface SavedDir {
	path: string;
	contents: { savedDir: string | null };
}

export interface SavedDirData {
	savedDir: string | null;
}

export interface ChallengeData {
	completed: boolean;
	current_challenge: boolean;
	next_challenge: string;
	previous_challenge: string;
}

// Git-related types
export interface GitExecOptions {
	cwd?: string;
	env?: NodeJS.ProcessEnv;
	encoding?: BufferEncoding;
	timeout?: number;
	maxBuffer?: number;
}

export type GitCallback = (
	error: Error | null,
	stdout: string,
	stderr: string,
) => void;

// Verification function type
export type VerificationFunction = (path?: string) => void;

// Challenge types
export interface Challenge {
	id: string;
	name: string;
	completed: boolean;
	verification: VerificationFunction;
}

// Locale/i18n types
export interface LocaleData {
	[key: string]: string | LocaleData;
}

export interface SupportedLocale {
	code: string;
	name: string;
	nativeName: string;
}

// Menu types (for Electron menus)
export interface MenuTemplate extends Electron.MenuItemConstructorOptions {
	submenu?: MenuTemplate[] | Electron.Menu;
}

// Main types index file
import type {
	App,
	BrowserWindow,
	IpcMainEvent,
	Menu,
	MenuItemConstructorOptions,
	WebPreferences,
} from "electron";

// Re-export all types from sub-modules
export * from "./build-types.js";
export * from "./api-types.js";
export * from "./i18n-types.js";
export * from "./challenge-types.js";
export * from "./git-types.js";
export * from "./main-process-types.js";
export * from "./ui-types.js";
