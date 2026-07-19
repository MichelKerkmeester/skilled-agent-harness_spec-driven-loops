import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import { __testables as healthTestables } from '../handlers/memory-crud-health';
import { ftsSearch, init } from '../lib/search/hybrid-search';
import {
  deriveToolOwnershipMap,
  lintToolOwnershipMapDrift,
  serializeToolOwnershipMap,
  type ToolDefinition,
} from '../tool-schemas';

let db: Database.Database | null = null;

function createMemoryDb(): Database.Database {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      trigger_phrases TEXT,
      file_path TEXT,
      content TEXT,
      importance_tier TEXT,
      parent_id INTEGER,
      expires_at TEXT,
      spec_folder TEXT,
      importance_weight REAL,
      created_at TEXT
    );
    CREATE VIRTUAL TABLE memory_fts USING fts5(
      title,
      trigger_phrases,
      file_path,
      content,
      content='memory_index',
      content_rowid='id'
    );
  `);
  return database;
}

function insertMemory(database: Database.Database, row: {
  id: number;
  title: string;
  tier: string;
  content: string;
}): void {
  database.prepare(`
    INSERT INTO memory_index (
      id,
      title,
      trigger_phrases,
      file_path,
      content,
      importance_tier,
      parent_id,
      expires_at,
      spec_folder,
      importance_weight,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?, 0.5, '2026-06-10T00:00:00.000Z')
  `).run(
    row.id,
    row.title,
    JSON.stringify(['needle phrase']),
    `/tmp/${row.id}.md`,
    row.content,
    row.tier,
    'test/spec',
  );
  database.prepare(`
    INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content)
    VALUES (?, ?, ?, ?, ?)
  `).run(row.id, row.title, 'needle phrase', `/tmp/${row.id}.md`, row.content);
}

function resultIds(): number[] {
  return ftsSearch('needle', { limit: 10 }).map((row) => Number(row.id));
}

function tool(name: string, description: string): ToolDefinition {
  return { name, description, inputSchema: {} };
}

afterEach(() => {
  if (db) {
    db.close();
    db = null;
  }
  init(null as unknown as Database.Database);
});

describe('stale/status hard-exclusion audit', () => {
  it('flags deprecated relevant rows while recall output stays byte-identical', () => {
    db = createMemoryDb();
    insertMemory(db, { id: 1, title: 'active needle', tier: 'normal', content: 'needle active content' });
    insertMemory(db, { id: 2, title: 'deprecated needle', tier: 'deprecated', content: 'needle deprecated content' });
    init(db);

    const before = JSON.stringify(resultIds());
    const report = healthTestables.auditHardExclusions(db);
    const after = JSON.stringify(resultIds());

    expect(before).toBe(after);
    expect(JSON.parse(before)).toEqual([1]);
    expect(report.status).toBe('risk');
    expect(report.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'hard-exclusion-risk', source: 'deprecated-tier' }),
      ]),
    );
  });

  it('classifies archived default exclusion as intended and does not flag it', () => {
    db = createMemoryDb();
    insertMemory(db, { id: 3, title: 'archived needle', tier: 'archived', content: 'needle archived content' });
    init(db);

    const report = healthTestables.auditHardExclusions(db);
    const archivedEntries = report.entries.filter((entry) => entry.source === 'archived-tier');

    expect(archivedEntries.length).toBeGreaterThan(0);
    expect(archivedEntries.every((entry) => entry.classification === 'intended')).toBe(true);
    expect(report.diagnostics.some((diagnostic) => diagnostic.source === 'archived-tier')).toBe(false);
  });

  it('emits exclusion unclassified diagnostics for malformed policy without changing recall', () => {
    db = createMemoryDb();
    insertMemory(db, { id: 4, title: 'active needle', tier: 'normal', content: 'needle active content' });
    init(db);

    const before = JSON.stringify(resultIds());
    const report = healthTestables.auditHardExclusions(db, { malformed: true });
    const after = JSON.stringify(resultIds());

    expect(before).toBe(after);
    expect(report.status).toBe('unclassified');
    expect(report.diagnostics[0]?.message).toContain('exclusion unclassified');
  });
});

describe('derived tool ownership lint', () => {
  const definitions = [
    tool('alpha_tool', '[L2:Core] Alpha tool.'),
    tool('beta_tool', '[L7:Maintenance] Beta tool.'),
  ];

  it('catches definitions missing from the committed map and extra committed entries', () => {
    const committed = {
      schemaVersion: 1,
      generatedFrom: 'TOOL_DEFINITIONS',
      tools: [
        deriveToolOwnershipMap([definitions[0]!]).tools[0],
        { name: 'removed_tool', owner: 'memory-core', stability: 'stable', level: 'L2', category: 'Core' },
      ],
    };

    const report = lintToolOwnershipMapDrift(committed, definitions);

    expect(report.ok).toBe(false);
    expect(report.missingFromCommitted).toEqual(['beta_tool']);
    expect(report.extraInCommitted).toEqual(['removed_tool']);
  });

  it('serializes byte-identically for unchanged definitions', () => {
    const map = deriveToolOwnershipMap(definitions);
    const first = serializeToolOwnershipMap(map);
    const second = serializeToolOwnershipMap(deriveToolOwnershipMap(definitions));
    const report = lintToolOwnershipMapDrift(first, definitions);

    expect(first).toBe(second);
    expect(report.ok).toBe(true);
  });

  it('source runner is clean for the committed fixture and fails closed on unreadable definitions', () => {
    const clean = spawnSync(process.execPath, ['tests/tool-ownership-lint-runner.mjs'], {
      cwd: join(import.meta.dirname, '..'),
      encoding: 'utf8',
    });
    expect(clean.status).toBe(0);
    expect(clean.stdout).toContain('tool-ownership map clean');

    const dir = mkdtempSync(join(tmpdir(), 'tool-ownership-'));
    const mapPath = join(dir, 'map.json');
    writeFileSync(mapPath, serializeToolOwnershipMap(deriveToolOwnershipMap(definitions)), 'utf8');

    const failed = spawnSync(process.execPath, ['tests/tool-ownership-lint-runner.mjs'], {
      cwd: join(import.meta.dirname, '..'),
      env: {
        ...process.env,
        SPECKIT_TOOL_SCHEMAS_PATH: join(dir, 'missing-tool-schemas.ts'),
        SPECKIT_TOOL_OWNERSHIP_MAP_PATH: mapPath,
      },
      encoding: 'utf8',
    });

    expect(failed.status).toBe(1);
    expect(failed.stderr).toContain('failed closed');
    expect(failed.stderr).toContain('unreadable');
  });
});
