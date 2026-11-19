// ───────────────────────────────────────────────────────────────
// MODULE: refreshSkillEmbeddings round-trip test
// ───────────────────────────────────────────────────────────────
//
// Verifies that refreshSkillEmbeddings dispatches correctly on
// hasActiveEmbedderPointer:
//   - pointer SET  → uses EmbedderAdapter layer + writes vec_<dim>
//   - pointer UNSET → skips refresh and returns no skill embeddings
//
// Closes the writer cross-wire gap surfaced by deep-review.
//
// SCOPE: refresh + loadSkillEmbeddings round-trip; not a full
// rebuild integration test.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the adapter that getAdapter() returns so the test stays offline
const { adapterEmbed } = vi.hoisted(() => {
  const counter = { n: 0 };
  const adapterEmbed = vi.fn(async (texts: ReadonlyArray<string>) => {
    counter.n += 1;
    return texts.map((text) => {
      const v = new Float32Array(1024);
      // Deterministic seed from text length + call counter so different texts
      // produce different vectors (sanity check for "wrote what we read back")
      for (let i = 0; i < v.length; i++) {
        v[i] = ((text.length + i + counter.n) % 1000) / 1000;
      }
      return v;
    });
  });
  return { adapterEmbed };
});

vi.mock('../../lib/embedders/registry.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/embedders/registry.js')>();
  return {
    ...actual,
    getAdapter: vi.fn((name: string) => {
      if (name === 'mock-1024') {
        return {
          name: 'mock-1024',
          dim: 1024,
          backend: 'ollama' as const,
          embed: adapterEmbed,
          ready: async () => true,
        };
      }
      return actual.getAdapter(name);
    }),
  };
});

import {
  closeDb,
  getDb,
  indexSkillMetadata,
  initDb,
  loadSkillEmbeddings,
  refreshSkillEmbeddings,
} from '../../lib/skill-graph/skill-graph-db.js';
import { setActiveEmbedder } from '../../lib/embedders/schema.js';

function seedSkillTree(rootDir: string, skillName: string, description: string): string {
  const skillDir = join(rootDir, '.skilled', 'skills', skillName);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(
    join(skillDir, 'SKILL.md'),
    `---
title: "${skillName}"
description: "${description}"
---

# ${skillName}
`,
  );
  // graph-metadata.json: minimal valid record per parseSkillMetadata invariants
  writeFileSync(
    join(skillDir, 'graph-metadata.json'),
    JSON.stringify({
      schema_version: 1,
      skill_id: skillName,
      family: 'system',
      category: 'test-fixture',
      domains: ['test'],
      intent_signals: ['fixture'],
      derived: {},
      edges: {},
    }, null, 2),
  );
  return skillDir;
}

describe('010/004 refreshSkillEmbeddings round-trip', () => {
  let tmpRoot: string;
  let dbDir: string;

  beforeEach(() => {
    tmpRoot = mkdtempSync(join(tmpdir(), '010-004-refresh-'));
    dbDir = join(tmpRoot, '.skill-graph');
    mkdirSync(dbDir, { recursive: true });
    initDb(dbDir);
    adapterEmbed.mockClear();
  });

  afterEach(() => {
    closeDb();
    rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('adapter path: when active pointer set, writes to vec_<dim> via getAdapter', async () => {
    seedSkillTree(tmpRoot, 'sk-alpha', 'alpha skill for round-trip test');
    seedSkillTree(tmpRoot, 'sk-beta', 'beta skill for round-trip test');
    indexSkillMetadata(join(tmpRoot, '.skilled', 'skills'));

    setActiveEmbedder(getDb(), 'mock-1024', 1024);

    const result = await refreshSkillEmbeddings();

    expect(result.failed).toBe(0);
    expect(result.embedded).toBeGreaterThanOrEqual(1);
    expect(adapterEmbed).toHaveBeenCalled();

    const loaded = loadSkillEmbeddings();
    expect(loaded.length).toBeGreaterThanOrEqual(1);

    // Every loaded embedding should match the active dim
    for (const row of loaded) {
      expect(row.embedding.length).toBe(1024);
      expect(row.modelId).toBe('mock-1024');
    }
  });

  it('adapter path: re-running with no source changes skips (idempotent)', async () => {
    seedSkillTree(tmpRoot, 'sk-only', 'only skill for idempotency');
    indexSkillMetadata(join(tmpRoot, '.skilled', 'skills'));
    setActiveEmbedder(getDb(), 'mock-1024', 1024);

    const first = await refreshSkillEmbeddings();
    expect(first.embedded).toBeGreaterThan(0);

    const second = await refreshSkillEmbeddings();
    expect(second.embedded).toBe(0);
    expect(second.skipped).toBeGreaterThan(0);
  });

  it('adapter path: returns ADAPTER-UNAVAILABLE warning when manifest is unknown', async () => {
    seedSkillTree(tmpRoot, 'sk-unknown', 'unknown skill');
    indexSkillMetadata(join(tmpRoot, '.skilled', 'skills'));
    // Set pointer to a name that's neither in real MANIFESTS nor our mock
    setActiveEmbedder(getDb(), 'definitely-not-a-real-embedder', 1024);

    const result = await refreshSkillEmbeddings();

    expect(result.embedded).toBe(0);
    // F review P2-1: failed = total row count so refresh-watchers see outage
    expect(result.failed).toBeGreaterThan(0);
    expect(result.warnings.length).toBe(1);
    expect(result.warnings[0]).toContain('ADAPTER-UNAVAILABLE');
    expect(result.warnings[0]).toContain('definitely-not-a-real-embedder');
  });

  it('adapter path: fails fast on adapter-vs-pointer dim mismatch (P1-1)', async () => {
    seedSkillTree(tmpRoot, 'sk-mismatch', 'dim mismatch test');
    indexSkillMetadata(join(tmpRoot, '.skilled', 'skills'));
    // Pointer says dim=768 but the mock adapter reports dim=1024
    setActiveEmbedder(getDb(), 'mock-1024', 768);

    const result = await refreshSkillEmbeddings();

    expect(result.embedded).toBe(0);
    expect(result.failed).toBeGreaterThan(0);
    expect(result.warnings.length).toBe(1);
    expect(result.warnings[0]).toContain('ADAPTER-DIM-MISMATCH');
    expect(result.warnings[0]).toContain('mock-1024');
    // Verify mock adapter was NOT called (fail-fast before any embed)
    expect(adapterEmbed).not.toHaveBeenCalled();
  });

  it('without an active pointer, skips refresh and loads no skill embeddings', async () => {
    seedSkillTree(tmpRoot, 'sk-no-pointer', 'skill without an active pointer');
    indexSkillMetadata(join(tmpRoot, '.skilled', 'skills'));

    const result = await refreshSkillEmbeddings();

    expect(result).toEqual({
      embedded: 0,
      skipped: 0,
      failed: 0,
      warnings: ['no active embedder pointer; skill embeddings not refreshed'],
    });
    expect(adapterEmbed).not.toHaveBeenCalled();
    expect(loadSkillEmbeddings()).toEqual([]);
  });
});
