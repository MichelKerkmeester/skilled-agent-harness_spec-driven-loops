// ───────────────────────────────────────────────────────────────────
// MODULE: Config
// ───────────────────────────────────────────────────────────────────

import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveCanonicalDbDir } from '../lib/canonical-db-dir.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envDir = process.env.SPECKIT_CODE_GRAPH_DB_DIR;
const defaultDir = resolve(__dirname, '..', 'database');

function resolveWorkspaceRoot(): string {
  let current = __dirname;
  for (let i = 0; i < 12; i++) {
    if (existsSync(resolve(current, '.opencode'))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return process.cwd();
}

export const DATABASE_DIR = resolveCanonicalDbDir(envDir ?? defaultDir, resolveWorkspaceRoot());

if (!existsSync(DATABASE_DIR)) {
  mkdirSync(DATABASE_DIR, { recursive: true });
}
