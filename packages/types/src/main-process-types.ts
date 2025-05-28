/**
 * Main process specific type definitions for git-it-nx
 */

import type {
	App,
	BrowserWindow,
	IpcMainEvent,
	Menu,
	MenuItemConstructorOptions,
	WebPreferences,
} from "electron";

// IPC event names and payloads
export const IPC_EVENTS = {
	// Main process events (from renderer)
	GET_USER_DATA_PATH: "getUserDataPath",
	GET_USER_SAVED_DIR: "getUserSavedDir",
	OPEN_FILE_DIALOG: "open-file-dialog",
	CONFIRM_CLEAR: "confirm-clear",

	// Renderer events (from main)
	SELECTED_DIRECTORY: "selected-directory",
	CONFIRM_CLEAR_RESPONSE: "confirm-clear-response",
} as const;

export type IpcEventName = (typeof IPC_EVENTS)[keyof typeof IPC_EVENTS];

// Command line argument types for development
export const CLI_ARGS = {
	NONE: "--none", // Set all challenges uncomplete
	SOME: "--some", // Set some challenges complete (first 5)
	ALL: "--all", // Set all challenges complete
} as const;

export type CliArg = (typeof CLI_ARGS)[keyof typeof CLI_ARGS];

// BrowserWindow configuration
export interface AppWindowConfig {
	minWidth: number;
	minHeight: number;
	width: number;
	height: number;
	title: string;
	icon: string;
	webPreferences?: WebPreferences;
}

// File dialog configuration for directory selection
export interface DirectoryDialogConfig {
	properties: Array<
		"openFile" | "openDirectory" | "multiSelections" | "createDirectory"
	>;
	title?: string;
	defaultPath?: string;
}

// Confirmation dialog configuration
export interface ConfirmationDialogConfig {
	type: "info" | "warning" | "error" | "question";
	buttons: string[];
	title: string;
	message: string;
	defaultId?: number;
	cancelId?: number;
}

// App paths structure
export interface AppPaths {
	userData: string;
	userDataFile: string;
	savedDirFile: string;
	iconPath: string;
	locale: string;
}

// Challenge data structure for bulk operations
export interface ChallengeDataBulk {
	[challengeId: string]: {
		completed: boolean;
		next_challenge?: string;
		// Add other properties as needed
	};
}

// Main process state
export interface MainProcessState {
	mainWindow: BrowserWindow | null;
	menu: Menu | null;
	paths: AppPaths;
	language: string;
}

// Menu factory function types
export type MenuTemplateFactory = (
	app: App,
	mainWindow: BrowserWindow,
) => MenuItemConstructorOptions[];

// IPC handler function types
export type IpcSyncHandler = (event: IpcMainEvent) => any;
export type IpcAsyncHandler = (event: IpcMainEvent, ...args: any[]) => void;

// Platform specific types
export type SupportedPlatform = "darwin" | "win32" | "linux";

// File operation result
export interface FileOperationResult {
	success: boolean;
	error?: string;
	path?: string;
}
