import fs from "node:fs";
import path from "node:path";

import { BrowserWindow, Menu, app, dialog, ipcMain } from "electron";
import {
	getLocale,
	getLocaleBuiltPath,
	// TODO: Add other functions, that you need
} from "../../../packages/i18n/src/getLocale.js";

import darwinTemplate from "./menus/darwin-menu.js";

const otherTemplate = require("./menus/other-menu.js");

const emptyData = require("./empty-data.json");
const emptySavedDir = require("./empty-saved-dir.json");

let mainWindow: BrowserWindow | null = null;
let menu: Electron.Menu | null = null;

const iconPath = path.join(__dirname, "/assets/git-it.png");

app.on("window-all-closed", function appQuit() {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("ready", function appReady() {
	mainWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		width: 980,
		height: 760,
		title: "Git-it",
		icon: iconPath,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	const appPath = app.getPath("userData");
	const userDataPath = path.join(appPath, "user-data.json");
	const userSavedDir = path.join(appPath, "saved-dir.json");
	const language = getLocale(app.getLocale());
	// tools for development to prefill challenge completion
	// usage: electron . --none
	//        electron . --some
	//        electron . --all
	if (process.argv[2] === "--none") {
		setAllChallengesUncomplete(userDataPath);
	}
	if (process.argv[2] === "--some") {
		setSomeChallengesComplete(userDataPath);
	}
	if (process.argv[2] === "--all") {
		setAllChallengesComplete(userDataPath);
	}

	if (!fs.existsSync(userDataPath)) {
		fs.writeFile(
			userDataPath,
			JSON.stringify(emptyData, null, " "),
			(err) => {
				if (err) return console.log(err);
			},
		);
	}

	if (!fs.existsSync(userSavedDir)) {
		fs.writeFile(
			userSavedDir,
			JSON.stringify(emptySavedDir, null, " "),
			(err) => {
				if (err) return console.log(err);
			},
		);
	}
	mainWindow.loadURL(`file://${getLocaleBuiltPath(language)}/pages/index.html`);

	ipcMain.on("getUserDataPath", (event) => {
		event.returnValue = userDataPath;
	});

	ipcMain.on("getUserSavedDir", (event) => {
		event.returnValue = userSavedDir;
	});

	ipcMain.on("open-file-dialog", async (event) => {
		if (!mainWindow) return;
		const result = await dialog.showOpenDialog(mainWindow, {
			properties: ["openFile", "openDirectory"],
		});
		if (!result.canceled && result.filePaths.length > 0) {
			event.sender.send("selected-directory", result.filePaths);
		}
	});

	ipcMain.on("confirm-clear", (event) => {
		const options = {
			type: "info" as const,
			buttons: ["Yes", "No"],
			title: "Confirm Clearing Statuses",
			message: "Are you sure you want to clear the status for every challenge?",
		};
		dialog.showMessageBox(mainWindow!, options).then((result) => {
			event.sender.send("confirm-clear-response", result.response);
		});
	});

	if (process.platform === "darwin") {
		menu = Menu.buildFromTemplate(darwinTemplate(app, mainWindow));
		Menu.setApplicationMenu(menu);
	} else {
		menu = Menu.buildFromTemplate(otherTemplate(app, mainWindow));
		mainWindow.setMenu(menu);
	}

	mainWindow.on("closed", function winClosed() {
		mainWindow = null;
	});
});

function setAllChallengesComplete(filePath: string) {
	const challenges = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	for (const key in challenges) {
		challenges[key].completed = true;
	}
	fs.writeFileSync(filePath, JSON.stringify(challenges, null, " "));
}

function setAllChallengesUncomplete(filePath: string) {
	const challenges = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	for (const key in challenges) {
		challenges[key].completed = false;
	}
	fs.writeFileSync(filePath, JSON.stringify(challenges, null, " "));
}

function setSomeChallengesComplete(filePath: string) {
	let counter = 0;
	const challenges = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	for (const key in challenges) {
		counter++;
		challenges[key].completed = counter < 6;
	}
	fs.writeFileSync(filePath, JSON.stringify(challenges, null, " "));
}
