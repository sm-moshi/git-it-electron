var fs = require("fs");
var path = require("path");

var electron = require("electron");
var locale = require("./lib/locale.js");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var ipcMain = electron.ipcMain;
var dialog = electron.dialog;

var darwinTemplate = require("./menus/darwin-menu.js");
var otherTemplate = require("./menus/other-menu.js");

var emptyData = require("./empty-data.json");
var emptySavedDir = require("./empty-saved-dir.json");

var mainWindow = null;
var menu = null;

var iconPath = path.join(__dirname, "/assets/git-it.png");

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
	});

	var appPath = app.getPath("userData");
	var userDataPath = path.join(appPath, "user-data.json");
	var userSavedDir = path.join(appPath, "saved-dir.json");
	var language = locale.getLocale(app.getLocale());
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

	fs.exists(userDataPath, (exists) => {
		if (!exists) {
			fs.writeFile(
				userDataPath,
				JSON.stringify(emptyData, null, " "),
				(err) => {
					if (err) return console.log(err);
				},
			);
		}
	});

	fs.exists(userSavedDir, (exists) => {
		if (!exists) {
			fs.writeFile(
				userSavedDir,
				JSON.stringify(emptySavedDir, null, " "),
				(err) => {
					if (err) return console.log(err);
				},
			);
		}
	});
	mainWindow.loadURL(
		"file://" + locale.getLocaleBuiltPath(language) + "/pages/index.html",
	);

	ipcMain.on("getUserDataPath", (event) => {
		event.returnValue = userDataPath;
	});

	ipcMain.on("getUserSavedDir", (event) => {
		event.returnValue = userSavedDir;
	});

	ipcMain.on("open-file-dialog", (event) => {
		var files = dialog.showOpenDialog(mainWindow, {
			properties: ["openFile", "openDirectory"],
		});
		if (files) {
			event.sender.send("selected-directory", files);
		}
	});

	ipcMain.on("confirm-clear", (event) => {
		var options = {
			type: "info",
			buttons: ["Yes", "No"],
			title: "Confirm Clearing Statuses",
			message: "Are you sure you want to clear the status for every challenge?",
		};
		dialog.showMessageBox(options, function cb(response) {
			event.sender.send("confirm-clear-response", response);
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

function setAllChallengesComplete(path) {
	var challenges = JSON.parse(fs.readFileSync(path));
	for (var key in challenges) {
		challenges[key].completed = true;
	}
	fs.writeFileSync(path, JSON.stringify(challenges), "", null);
}

function setAllChallengesUncomplete(path) {
	var challenges = JSON.parse(fs.readFileSync(path));
	for (var key in challenges) {
		challenges[key].completed = false;
	}
	fs.writeFileSync(path, JSON.stringify(challenges), "", null);
}

function setSomeChallengesComplete(path) {
	var counter = 0;
	var challenges = JSON.parse(fs.readFileSync(path));
	for (var key in challenges) {
		counter++;
		challenges[key].completed = counter < 6;
	}
	fs.writeFileSync(path, JSON.stringify(challenges), "", null);
}
