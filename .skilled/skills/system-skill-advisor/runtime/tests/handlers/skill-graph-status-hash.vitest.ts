// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Status Hash Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import Database from 'better-sqlite3';

import { afterEach, describe, expect, it } from 'vitest';

import { handleSkillGraphStatus } from '../../handlers/skill-graph/status.js';
import {
  closeDb,
  computeSkillMetadataContentHash,
  DB_FILENAME,
} from '../../lib/skill-graph/skill-graph-db.js';

function parseData(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  const parsed = JSON.parse(response.content[0].text) as { data?: Record<string, unknown> };
  return parsed.data ?? (parsed as Record<string, unknown>);
}

describe('skill_graph_status source hashes', () => {
  const priorDbDir = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;

  afterEach(() => {
    closeDb();
    if (priorDbDir === undefined) delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
    else process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = priorDbDir;
  });

  it('reports an indexed metadata file as fresh', async () => {
    const skillRoot = mkdtempSync(join(tmpdir(), 'skill-graph-status-hash-'));
    const metadataPath = join(skillRoot, 'graph-metadata.json');
    const content = '{"skill_id":"alpha"}\n';
    writeFileSync(metadataPath, content, 'utf8');

    const dbDir = mkdtempSync(join(tmpdir(), 'skill-graph-status-db-'));
    const database = new Database(join(dbDir, DB_FILENAME));
    try {
      database.exec(`
        CREATE TABLE skill_nodes (
          id TEXT PRIMARY KEY,
          family TEXT NOT NULL,
          category TEXT NOT NULL,
          schema_version INTEGER NOT NULL,
          domains TEXT,
          intent_signals TEXT,
          derived TEXT,
          source_path TEXT NOT NULL,
          content_hash TEXT NOT NULL,
          indexed_at TEXT
        );
        CREATE TABLE skill_edges (
          source_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          edge_type TEXT NOT NULL,
          weight REAL NOT NULL
        );
      `);
      database.prepare(`
        INSERT INTO skill_nodes (
          id, family, category, schema_version, domains, intent_signals,
          derived, source_path, content_hash, indexed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'alpha',
        'backend',
        'test',
        1,
        '[]',
        '[]',
        null,
        metadataPath,
        computeSkillMetadataContentHash(content),
        '2026-10-03T00:00:00.000Z',
      );
    } finally {
      database.close();
    }

    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = dbDir;
    closeDb();

    const data = parseData(await handleSkillGraphStatus());

    expect(data.staleness).toEqual({
      trackedSkills: 1,
      freshSourceFiles: 1,
      changedSourceFiles: 0,
      missingSourceFiles: 0,
      staleSkillIds: [],
    });
  });
});
