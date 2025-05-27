/**
 * This file is loaded by every challenge's HTML, it listens to events on the
 * verify button and provides the file-chooser dialog when the challenge needs.
 */

import { ipcRenderer } from "electron";
import { getData, getSavedDir, updateCurrentDirectory } from "./user-data.js";

// Extend the Window interface to include currentChallenge
declare global {
	interface Window {
		currentChallenge: string;
	}
}

const selectDirBtn = document.getElementById("select-directory") as HTMLButtonElement | null;
const currentChallenge = window.currentChallenge;

function selectDirectory(path: string): void {
	const pathWarning = document.getElementById("path-required-warning");
	const directoryPath = document.getElementById("directory-path");

	pathWarning?.classList.remove("show");
	if (directoryPath) directoryPath.innerText = path;
}

if (selectDirBtn) {
	selectDirBtn.addEventListener("click", function clickedDir() {
		ipcRenderer.send("open-file-dialog");
	});

	ipcRenderer.on("selected-directory", (event: Electron.IpcRendererEvent, path: string[]) => {
		selectDirectory(path[0]);
		updateCurrentDirectory(path[0]);
	});
}

const currentDirectory = getSavedDir().contents.savedDir;
const challengeCompleted = getData().contents;

if (currentChallenge === "forks_and_clones") {
	// On this challenge clear out the saved dir because it should change
	updateCurrentDirectory(null);
} else if (
	selectDirBtn &&
	currentDirectory &&
	!challengeCompleted[currentChallenge]?.completed
) {
	selectDirectory(currentDirectory);
	selectDirBtn.innerHTML = "CHANGE DIRECTORY";
}

// Handle verify challenge click
const verifyButton = document.getElementById("verify-challenge");
verifyButton?.addEventListener("click", async function clicked() {
	try {
		// Dynamic import of the verification module
		const verifyModule = await import(`./verify/${currentChallenge}.js`);
		const verifyChallenge = verifyModule[`verify${currentChallenge.charAt(0).toUpperCase() + currentChallenge.slice(1).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())}Challenge`];

		// If a directory is needed
		if (selectDirBtn) {
			const directoryPath = document.getElementById("directory-path");
			const path = directoryPath?.innerText || "";

			if (path === "") {
				const pathWarning = document.getElementById("path-required-warning");
				pathWarning?.classList.add("show");
			} else {
				const verifyList = document.getElementById("verify-list");
				if (verifyList) verifyList.innerHTML = "";
				verifyChallenge(path);
			}
		} else {
			const verifyList = document.getElementById("verify-list");
			if (verifyList) verifyList.innerHTML = "";
			verifyChallenge();
		}
	} catch (error) {
		console.error(`Failed to load verification module for ${currentChallenge}:`, error);
	}
});
