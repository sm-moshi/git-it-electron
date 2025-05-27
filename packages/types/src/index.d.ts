/**
 * Shared type definitions for git-it-nx
 */

// Global Window extensions
declare global {
  interface Window {
    currentChallenge: string;
    api?: {
      // IPC API that will be exposed by preload script
      openFileDialog: () => Promise<string[]>;
      getUserDataPath: () => Promise<string>;
      getUserSavedDir: () => Promise<string>;
      confirmClear: () => Promise<number>; // Returns button index (0=Yes, 1=No)
      // TODO: Add more IPC methods as needed
    };
  }
}

// User Data Types
export interface UserData {
  path: string;
  contents: Record<string, ChallengeData>;
}

export interface SavedDir {
  path: string;
  contents: { savedDir: string | null };
}

export interface SavedDirData {
  savedDir: string | null;
}

export interface ChallengeData {
  completed: boolean;
  current_challenge: boolean;
  next_challenge: string;
  previous_challenge: string;
}

// Git-related types
export interface GitExecOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  encoding?: BufferEncoding;
  timeout?: number;
  maxBuffer?: number;
}

export type GitCallback = (error: Error | null, stdout: string, stderr: string) => void;

// Verification function type
export type VerificationFunction = (path?: string) => void;

// Challenge types
export interface Challenge {
  id: string;
  name: string;
  completed: boolean;
  verification: VerificationFunction;
}

// Locale/i18n types
export interface LocaleData {
  [key: string]: string | LocaleData;
}

export interface SupportedLocale {
  code: string;
  name: string;
  nativeName: string;
}

// Menu types (for Electron menus)
export interface MenuTemplate extends Electron.MenuItemConstructorOptions {
  submenu?: MenuTemplate[] | Electron.Menu;
}

// Export everything for module consumers
export * from './challenge-types.js';
export * from './git-types.js';
export * from './ui-types.js';
export * from './main-process-types.js';
