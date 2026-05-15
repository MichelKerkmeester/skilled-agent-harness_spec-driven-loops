// ───────────────────────────────────────────────────────────────────
// MODULE: Config
// ───────────────────────────────────────────────────────────────────

import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envDir = process.env.SPECKIT_CODE_GRAPH_DB_DIR;
const defaultDir = resolve(__dirname, '..', 'database');

export const DATABASE_DIR = envDir ?? defaultDir;

if (!existsSync(DATABASE_DIR)) {
  mkdirSync(DATABASE_DIR, { recursive: true });
}
