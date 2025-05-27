/**
 * UI-specific type definitions for git-it-nx
 */

// Theme types
export type Theme = 'light' | 'dark' | 'auto';

// Language/locale types
export type SupportedLanguage = 'en-US' | 'es-ES' | 'es-CO' | 'fr-FR' | 'ja-JP' | 'ko-KR' | 'pt-BR' | 'uk-UA' | 'zh-TW';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl?: boolean;
}

// App state types
export interface AppState {
  currentChallenge: string;
  language: SupportedLanguage;
  theme: Theme;
  userDataPath: string;
  challengeProgress: Record<string, boolean>;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  completed: boolean;
  current: boolean;
}

// Verification UI states
export type VerificationState = 'idle' | 'verifying' | 'success' | 'error';

export interface VerificationUIState {
  state: VerificationState;
  message?: string;
  details?: string[];
  progress?: number;
}

// Modal/Dialog types
export interface DialogOptions {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'question';
  buttons?: string[];
  defaultButton?: number;
}

// File selection types
export interface FileDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{
    name: string;
    extensions: string[];
  }>;
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'createDirectory'>;
}

// Progress indicator
export interface ProgressInfo {
  current: number;
  total: number;
  label?: string;
}

// Toast/notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}