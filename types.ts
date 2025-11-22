export interface HistoricalScene {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  thumbnail: string;
  era: string;
}

export interface GeneratedImage {
  originalUrl: string; // The user's uploaded/captured photo
  currentUrl: string;  // The current state of the image (generated or edited)
  history: string[];   // History of transformations for undo functionality (optional implementation)
  promptUsed: string;
}

export enum AppState {
  IDLE,
  CAPTURING,
  PROCESSING,
  RESULT,
  ERROR
}

export type ToolMode = 'TIME_TRAVEL' | 'ANALYZE' | 'EDIT';