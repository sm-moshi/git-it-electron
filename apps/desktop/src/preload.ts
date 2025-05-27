import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  // TODO: Add IPC bridge methods here later
});
