import { App, BrowserWindow, shell, MenuItemConstructorOptions } from "electron";
import * as path from "node:path";
import {
	getLocaleBuiltPath,
	getCurrentLocale,
	getLocaleMenu,
} from "../../../../packages/i18n/src/getLocale";

function isBrowserWindow(win: unknown): win is BrowserWindow {
	return !!win && typeof (win as BrowserWindow).loadURL === "function";
}

export default function darwinMenu(app: App, mainWindow: BrowserWindow | null): MenuItemConstructorOptions[] {
	return [
		{
			label: "Git-it",
			submenu: [
				{
					label: "About Git-it",
				},
				{
					type: "separator",
				},
				{
					label: "Services",
					submenu: [],
				},
				{
					type: "separator",
				},
				{
					label: "Hide Git-it",
					accelerator: "Command+H",
				},
				{
					label: "Hide Others",
					accelerator: "Command+Shift+H",
				},
				{
					label: "Show All",
				},
				{
					type: "separator",
				},
				{
					label: "Quit",
					accelerator: "Command+Q",
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
				},
				{
					type: "separator",
				},
				{
					label: "Bring All to Front",
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
								"index.html"
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
								"dictionary.html"
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
								"resources.html"
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
						shell.openExternal("https://github.com/jlord/git-it-electron/issues/new");
					},
				},
				{
					label: "About App",
					click: (_item, focusedWindow) => {
						if (isBrowserWindow(focusedWindow)) {
							const filePath = path.join(
								getLocaleBuiltPath(getCurrentLocale(focusedWindow)),
								"pages",
								"about.html"
							);
							focusedWindow.loadURL(`file://${filePath}`);
						}
					},
				},
			],
		},
	];
}
