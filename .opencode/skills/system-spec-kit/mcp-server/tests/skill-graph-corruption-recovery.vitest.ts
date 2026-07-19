// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Corruption Recovery Tests
// ───────────────────────────────────────────────────────────────
//
// SKIP-AT-LOAD: The skill-graph DB module migrated to system-skill-advisor/. The
// `../lib/skill-graph/skill-graph-db.js` path under this package no longer resolves,
// so the original static import would fail before any test could declare a skip.
// Replaced with a stub describe.skip; equivalent coverage exists in
// system-skill-advisor/mcp-server/tests/skill-graph-db.vitest.ts.

import { describe, it } from 'vitest';

describe.skip('skill graph live DB corruption recovery (migrated to system-skill-advisor)', () => {
  it.skip('moved to system-skill-advisor/mcp-server/tests/skill-graph-db.vitest.ts', () => {});
});

// Original suite kept below for reference but excluded from execution via the
// `if (false)` gate so the unresolved import on the legacy code path never loads.
if (false) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // @ts-expect-error legacy import path retained for context only
  const { closeDb, DB_FILENAME, getDb, initDb } = require('../lib/skill-graph/skill-graph-db.js');
  // The rest of the original tests followed here; not loaded.
}

/* Legacy block (unreachable):
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { closeDb, DB_FILENAME, getDb, initDb } from '../lib/skill-graph/skill-graph-db.js';

describe('skill graph live DB corruption recovery', () => {
  afterEach(() => {
    closeDb();
  });

  it('recovers a malformed SQLite file during initDb quick_check', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-corruption-'));
    const dbDir = join(root, 'db');

    try {
      mkdirSync(dbDir, { recursive: true });
      writeFileSync(join(dbDir, DB_FILENAME), 'not sqlite', 'utf8');

      expect(() => initDb(dbDir)).not.toThrow();
      expect(getDb().prepare('SELECT COUNT(*) AS count FROM skill_nodes').get()).toEqual({ count: 0 });
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
*/
