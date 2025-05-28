import { contextBridge, ipcRenderer, shell } from "electron";

// Create the API object that will be exposed to the renderer
const api = {
	// File system operations
	getUserDataPath: (): Promise<string> => {
		return Promise.resolve(ipcRenderer.sendSync("getUserDataPath"));
	},

	getUserSavedDir: (): Promise<string> => {
		return Promise.resolve(ipcRenderer.sendSync("getUserSavedDir"));
	},

	// File dialogs
	openFileDialog: (): Promise<string[]> => {
		return new Promise((resolve) => {
			ipcRenderer.send("open-file-dialog");
			ipcRenderer.once("selected-directory", (_event, paths: string[]) => {
				resolve(paths || []);
			});
		});
	},

	// User confirmation dialogs
	confirmClear: (): Promise<number> => {
		return new Promise((resolve) => {
			ipcRenderer.send("confirm-clear");
			ipcRenderer.once("confirm-clear-response", (_event, response: number) => {
				resolve(response);
			});
		});
	},

	// External link handling
	openExternal: (url: string): Promise<void> => {
		return shell.openExternal(url);
	},

	// Event listener management for cleanup
	removeAllListeners: (channel: string): void => {
		ipcRenderer.removeAllListeners(channel);
	},

	// Get platform information
	getPlatform: (): string => {
		return process.platform;
	},
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld("api", api);

// Export the API type for TypeScript
export type ApiType = typeof api;
