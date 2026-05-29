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
// Default DB dir = the SKILL-LOCAL location `.opencode/skills/system-code-graph/mcp_server/database`
// (operator directive 2026-05-29: keep code-graph state inside the skill folder, which every runtime
// already shares via the `.opencode/skills` symlink, so a skill-local DB is a single shared instance).
// Resolved against the workspace root so it is stable regardless of CWD. `SPECKIT_CODE_GRAPH_DB_DIR`
// overrides it. This supersedes the former shared `.opencode/.spec-kit/code-graph/database` location
// (reverses ADR-002/004/005). (resolveWorkspaceRoot is a hoisted function declaration, safe here.)
const defaultDir = resolve(resolveWorkspaceRoot(), '.opencode/skills/system-code-graph/mcp_server/database');

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
  // root to a stray nested skill dir instead of the true workspace root. (The DB dir is
  // now skill-local, but resolving the real workspace root still matters for env overrides.)
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
