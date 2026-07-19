// ───────────────────────────────────────────────────────────────
// MODULE: discovery-pipeline parity (TS recursive walk vs Python depth-1)
// ───────────────────────────────────────────────────────────────
// Two pipelines resolve "what is one skill identity": the TS recursive walk in
// skill-graph-db (with the one-identity ingestion guard) and the Python compiler's depth-1
// discover_graph_metadata. On the canonical tree they must agree. They deliberately diverge
// on a VIOLATION (a nested skill-shaped file): the TS guard rejects it loudly, the Python
// depth-1 walk is structurally blind to it — this test locks both behaviours so the two
// advisor surfaces can never silently disagree about an identity again.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { closeDb, getDb, indexSkillMetadata, initDb } from '../lib/skill-graph/skill-graph-db.js';
import { writeGraphMetadata } from './fixtures/skill-graph-db.js';

function repoRoot(): string {
  let dir = process.cwd();
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return dir;
    dir = dirname(dir);
  }
  throw new Error('repo root not found');
}
const R = repoRoot();
const SCRIPTS = join(R, '.opencode/skills/system-skill-advisor/mcp-server/scripts');

// The Python compiler's own depth-1 discovery, invoked read-only.
function pythonIdentities(skillsDir: string): string[] {
  const py = [
    'import sys, json',
    `sys.path.insert(0, ${JSON.stringify(SCRIPTS)})`,
    'from skill_graph_compiler import discover_graph_metadata',
    'ids = [rec[2].get("skill_id") for rec in discover_graph_metadata(sys.argv[1]) if rec[2].get("skill_id")]',
    'print(json.dumps(sorted(ids)))',
  ].join('\n');
  const out = execFileSync('python3', ['-c', py, skillsDir], { encoding: 'utf8' });
  return JSON.parse(out.trim());
}

function tsIdentities(): string[] {
  return (getDb().prepare('SELECT id FROM skill_nodes ORDER BY id').all() as Array<{ id: string }>).map((r) => r.id);
}

describe('discovery-pipeline parity (TS vs Python)', () => {
  afterEach(() => { closeDb(); vi.restoreAllMocks(); });

  it('both pipelines resolve the same identity set on a canonical depth-1 tree', () => {
    const root = mkdtempSync(join(tmpdir(), 'disc-parity-'));
    const skillRoot = join(root, 'skills');
    try {
      initDb(join(root, 'db'));
      writeGraphMetadata(skillRoot, 'alpha');
      writeGraphMetadata(skillRoot, 'beta');
      indexSkillMetadata(skillRoot);
      expect(tsIdentities()).toEqual(['alpha', 'beta']);
      expect(pythonIdentities(skillRoot)).toEqual(['alpha', 'beta']);
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('a nested skill-shaped file: TS guard rejects, Python depth-1 is blind (documented divergence)', () => {
    const root = mkdtempSync(join(tmpdir(), 'disc-parity-'));
    const skillRoot = join(root, 'skills');
    try {
      initDb(join(root, 'db'));
      writeGraphMetadata(skillRoot, 'sk-hub');
      writeGraphMetadata(join(skillRoot, 'sk-hub'), 'nested-packet'); // nested identity — a violation

      // TS: the one-identity ingestion guard (023 WU3) rejects the nested identity loudly.
      expect(() => indexSkillMetadata(skillRoot)).toThrow(/One-identity violation/);

      // Python: depth-1 walk sees only the top-level hub — it never even reaches the nested file.
      expect(pythonIdentities(skillRoot)).toEqual(['sk-hub']);
      // The invariant that matters: neither pipeline registers the nested packet as a second identity.
      expect(pythonIdentities(skillRoot)).not.toContain('nested-packet');
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
