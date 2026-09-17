// ───────────────────────────────────────────────────────────────
// MODULE: Executor Delegation Cache Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { buildExecutorAliasTable } from '../../lib/scorer/executor-delegation.js';
import type { AdvisorProjection } from '../../lib/scorer/types.js';

const FIXTURE_PROJECTION: AdvisorProjection = {
  skills: [],
  edges: [],
  generatedAt: '2026-01-01T00:00:00.000Z',
  source: 'fixture',
};

describe('executor-delegation filesystem alias cache', () => {
  it('reuses unchanged data and rebuilds after a source mtime changes', () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), 'executor-alias-cache-'));
    const archiveEntry = join(
      workspaceRoot,
      '.opencode',
      'skills',
      'z_archive',
      'cli-retired',
    );
    const metadataPath = join(archiveEntry, 'graph-metadata.json');
    mkdirSync(archiveEntry, { recursive: true });

    try {
      writeFileSync(metadataPath, JSON.stringify({
        family: 'cli',
        intent_signals: ['legacy-alpha'],
      }), 'utf8');

      const populated = buildExecutorAliasTable(FIXTURE_PROJECTION, workspaceRoot);
      const unchanged = buildExecutorAliasTable(FIXTURE_PROJECTION, workspaceRoot);

      expect(populated.suppressedAliases.has('legacy-alpha')).toBe(true);
      expect(unchanged.suppressedAliases).toBe(populated.suppressedAliases);

      writeFileSync(metadataPath, JSON.stringify({
        family: 'cli',
        intent_signals: ['legacy-beta'],
      }), 'utf8');
      const changedTime = new Date(Date.now() + 10_000);
      utimesSync(metadataPath, changedTime, changedTime);

      const refreshed = buildExecutorAliasTable(FIXTURE_PROJECTION, workspaceRoot);

      expect(refreshed.suppressedAliases).not.toBe(populated.suppressedAliases);
      expect(refreshed.suppressedAliases.has('legacy-alpha')).toBe(false);
      expect(refreshed.suppressedAliases.has('legacy-beta')).toBe(true);
    } finally {
      rmSync(workspaceRoot, { recursive: true, force: true });
    }
  });
});
