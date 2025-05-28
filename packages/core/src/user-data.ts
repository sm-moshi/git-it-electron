import * as fs from "node:fs";
import type {
	ChallengeData,
	SavedDir,
	UserData,
} from "../../types/src/index.js";

// Re-export types for backward compatibility
export type { UserData, SavedDir, ChallengeData };

/**
 * Fetches the user data (progress, etc.) from the main process and reads the file.
 */
export async function getData(): Promise<UserData> {
	const userDataPath = await window.api.getUserDataPath();
	const data: UserData = {
		path: userDataPath,
		contents: {},
	};
	data.contents = JSON.parse(fs.readFileSync(data.path, "utf-8"));
	return data;
}

/**
 * Fetches the saved directory info from the main process and reads the file.
 */
export async function getSavedDir(): Promise<SavedDir> {
	const savedDirPath = await window.api.getUserSavedDir();
	const savedDir: SavedDir = {
		path: savedDirPath,
		contents: { savedDir: null },
	};
	savedDir.contents = JSON.parse(fs.readFileSync(savedDir.path, "utf-8"));
	return savedDir;
}

/**
 * Writes the given user data object to disk.
 */
export function writeData(data: UserData | SavedDir): void {
	fs.writeFile(data.path, JSON.stringify(data.contents, null, " "), (err) => {
		if (err) console.log(err);
	});
}

/**
 * Marks a challenge as completed and writes the update to disk.
 */
export async function updateData(challenge: string): Promise<void> {
	const data = await getData();
	data.contents[challenge].completed = true;
	writeData(data);
}

/**
 * Updates the saved directory path and writes the update to disk.
 */
export async function updateCurrentDirectory(pathValue: string | null): Promise<void> {
	const data = await getSavedDir();
	data.contents.savedDir = pathValue;
	writeData(data);
}
