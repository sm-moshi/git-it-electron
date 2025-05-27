import * as fs from "node:fs";
import { ipcRenderer } from "electron";
import type { UserData, SavedDir } from "@git-it-nx/types";

/**
 * Fetches the user data (progress, etc.) from the main process and reads the file.
 */
export function getData(): UserData {
  const data: UserData = {
    path: ipcRenderer.sendSync("getUserDataPath", null),
    contents: {},
  };
  data.contents = JSON.parse(fs.readFileSync(data.path, "utf-8"));
  return data;
}

/**
 * Fetches the saved directory info from the main process and reads the file.
 */
export function getSavedDir(): SavedDir {
  const savedDir: SavedDir = {
    path: ipcRenderer.sendSync("getUserSavedDir", null),
    contents: { savedDir: null },
  };
  savedDir.contents = JSON.parse(fs.readFileSync(savedDir.path, "utf-8"));
  return savedDir;
}

/**
 * Writes the given user data object to disk.
 */
export function writeData(data: UserData | SavedDir): void {
  fs.writeFile(
    data.path,
    JSON.stringify(data.contents, null, " "),
    (err) => {
      if (err) console.log(err);
    }
  );
}

/**
 * Marks a challenge as completed and writes the update to disk.
 */
export function updateData(challenge: string): void {
  const data = getData();
  data.contents[challenge].completed = true;
  writeData(data);
}

/**
 * Updates the saved directory path and writes the update to disk.
 */
export function updateCurrentDirectory(pathValue: string | null): void {
  const data = getSavedDir();
  data.contents.savedDir = pathValue;
  writeData(data);
}