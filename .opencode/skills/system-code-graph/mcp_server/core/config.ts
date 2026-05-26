// ───────────────────────────────────────────────────────────────────
// MODULE: Config
// ───────────────────────────────────────────────────────────────────

import { existsSync, mkdirSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
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
  // The server module always lives under `<workspace-root>/.opencode/...`, so
  // the workspace root is the parent of the `.opencode` segment on THIS file's
  // own ancestry path. Walk up looking for the directory literally named
  // `.opencode` and return its parent.
  //
  // The previous implementation returned the first ancestor that *contained* a
  // `.opencode/` child. That falsely matched stray nested `.opencode/` dirs
  // sitting as siblings of an ancestor (e.g. an accidental
  // `skills/system-code-graph/.opencode/` advisor-state artifact), resolving the
  // root to the skill dir and throwing OUTSIDE_WORKSPACE because the canonical DB
  // dir (`.opencode/.spec-kit/code-graph/database`) sits outside that skill dir.
  // Anchoring on the on-path `.opencode` segment is immune to those strays.
  let current = __dirname;
  for (let i = 0; i < 12; i++) {
    if (basename(current) === '.opencode') {
      return dirname(current);
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
