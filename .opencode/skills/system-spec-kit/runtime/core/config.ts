// ───────────────────────────────────────────────────────────────────
// MODULE: Config
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import os from 'node:os';


// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/** Input validation limits configuration */
export interface InputLimitsConfig {
  query: number;
  title: number;
  specFolder: number;
  contextType: number;
  name: number;
  prompt: number;
  filePath: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. PATH CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const SERVER_DIR: string = path.join(import.meta.dirname, '..');
export const NODE_MODULES: string = path.join(SERVER_DIR, 'node_modules');
export const LIB_DIR: string = path.join(import.meta.dirname, '..', 'lib');
export const SHARED_DIR: string = path.join(SERVER_DIR, '..', 'shared');


// ───────────────────────────────────────────────────────────────────
// 3. RATE LIMITING CONFIGURATION
// ───────────────────────────────────────────────────────────────────

export const INDEX_SCAN_COOLDOWN: number = 30000;

// ───────────────────────────────────────────────────────────────────
// 4. QUERY VALIDATION LIMITS
// ───────────────────────────────────────────────────────────────────

export const MAX_QUERY_LENGTH: number = 10000;

export const INPUT_LIMITS: Readonly<InputLimitsConfig> = {
  query: 10000,
  title: 500,
  specFolder: 200,
  contextType: 100,
  name: 200,
  prompt: 10000,
  filePath: 500
} as const;

// ───────────────────────────────────────────────────────────────────
// 5. PATH VALIDATION
// ───────────────────────────────────────────────────────────────────

export const DEFAULT_BASE_PATH: string = process.env.MEMORY_BASE_PATH || process.cwd();

export const ALLOWED_BASE_PATHS: string[] = [
  path.join(os.homedir(), '.claude'),
  DEFAULT_BASE_PATH,
  process.cwd()
]
  .filter(Boolean)
  .map(base => path.resolve(base));
