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
// NOTE (015-install-scripts-doctor-realignment): this in-tree fallback (mcp_server/database)
// is a defensive default. The DOCUMENTED canonical default is `.opencode/.spec-kit/code-graph/database`
// (see opencode.json `_NOTE_1_DB`, readiness-marker.ts, mcp_server/README.md), normally supplied via
// SPECKIT_CODE_GRAPH_DB_DIR by the launcher (which also auto-migrates the legacy location on first start).
// Latent mismatch flagged for a system-code-graph follow-up to reconcile this fallback with the docs.
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
