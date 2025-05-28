import * as path from "node:path";
import {
	type App,
	type BrowserWindow,
	type MenuItemConstructorOptions,
	shell,
} from "electron";
import {
	getCurrentLocale,
	getLocaleBuiltPath,
	getLocaleMenu, // TODO: Don't we need this at some point?
} from "../../../../packages/i18n/src/getLocale.js";

function isBrowserWindow(win: unknown): win is BrowserWindow {
	return !!win && typeof (win as BrowserWindow).loadURL === "function";
}

export default function otherMenu(
	app: App,
	mainWindow: BrowserWindow | null,
): MenuItemConstructorOptions[] {
	return [
		{
			label: "&File",
			submenu: [
				// {
				//     label: '&Open',
				//     accelerator: 'Ctrl+O'
				// },
				{
					label: "&Quit",
					accelerator: "Ctrl+Q",
					click: () => {
						app.quit();
					},
				},
			],
		},
		{
			label: "View",
			submenu: [
				{
					label: "Reload",
					accelerator: "Command+R",
					click: (_item, focusedWindow) => {
						if (isBrowserWindow(focusedWindow)) {
							focusedWindow.reload();
						}
					},
				},
				{
					label: "Full Screen",
					accelerator: "Ctrl+Command+F",
					click: (_item, focusedWindow) => {
						if (isBrowserWindow(focusedWindow)) {
							focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
						}
					},
				},
				{
					label: "Minimize",
					accelerator: "Command+M",
					// selector: "performMiniaturize:",
				},
				{
					type: "separator",
				},
				{
					label: "Bring All to Front",
					// selector: "arrangeInFront:",
				},
				{
					type: "separator",
				},
				{
					label: "Toggle Developer Tools",
					accelerator: "Alt+Command+I",
					click: (_item, focusedWindow) => {
						if (isBrowserWindow(focusedWindow)) {
							focusedWindow.webContents.toggleDevTools();
						}
					},
				},
			],
		},
		{
			label: "Window",
			submenu: [
				{
					label: "Home",
					click: (_item, focusedWindow) => {
						if (isBrowserWindow(focusedWindow)) {
							const filePath = path.join(
								getLocaleBuiltPath(getCurrentLocale(focusedWindow)),
								"pages",
								"index.html",
							);
							focusedWindow.loadURL(`file://${filePath}`);
						}
					},
				},
				{
					label: "Dictionary",
					click: (_item, focusedWindow) => {
						if (isBrowserWindow(focusedWindow)) {
							const filePath = path.join(
								getLocaleBuiltPath(getCurrentLocale(focusedWindow)),
								"pages",
								"dictionary.html",
							);
							focusedWindow.loadURL(`file://${filePath}`);
						}
					},
				},
				{
					label: "Resources",
					click: (_item, focusedWindow) => {
						if (isBrowserWindow(focusedWindow)) {
							const filePath = path.join(
								getLocaleBuiltPath(getCurrentLocale(focusedWindow)),
								"pages",
								"resources.html",
							);
							focusedWindow.loadURL(`file://${filePath}`);
						}
					},
				},
			],
		},
		{
			label: "Help",
			submenu: [
				{
					label: "Repository",
					click: () => {
						shell.openExternal("http://github.com/jlord/git-it-electron");
					},
				},
				{
					label: "Open Issue",
					click: () => {
						shell.openExternal(
							"https://github.com/jlord/git-it-electron/issues/new",
						);
					},
				},
				{
					label: "About App",
					click: (_item, focusedWindow) => {
						if (isBrowserWindow(focusedWindow)) {
							const filePath = path.join(
								getLocaleBuiltPath(getCurrentLocale(focusedWindow)),
								"pages",
								"about.html",
							);
							focusedWindow.loadURL(`file://${filePath}`);
						}
					},
				},
			],
		},
	];
}
