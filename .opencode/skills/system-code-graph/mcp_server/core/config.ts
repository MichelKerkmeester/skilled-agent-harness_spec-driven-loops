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
// Default DB dir = the documented canonical location `.opencode/.spec-kit/code-graph/database`
// (opencode.json `_NOTE_1_DB`, readiness-marker.ts, mcp_server/README.md), resolved against the
// workspace root so it is stable regardless of CWD. `SPECKIT_CODE_GRAPH_DB_DIR` overrides it; the
// launcher normally sets that var and auto-migrates the legacy `mcp_server/database/` location on
// first start. (resolveWorkspaceRoot is a hoisted function declaration, safe to call here.)
const defaultDir = resolve(resolveWorkspaceRoot(), '.opencode/.spec-kit/code-graph/database');

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
