// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Persistent Style Schema Pressure Tests                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { mkdir, symlink, writeFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import test from 'node:test';

import { createFixtureCorpus } from '../../_engine/__tests__/fixtures.mjs';
import { buildStyleDatabase } from '../indexer.mjs';
import { queryPersistentStyles } from '../retrieval.mjs';
import {
  STYLE_DATABASE_POINTER_SUFFIX,
  STYLE_DB_SCHEMA_VERSION,
  createSchema,
  resolvePublishedDatabasePath,
} from '../schema.mjs';
import { createIndexedFixture } from './fixtures.mjs';

test('version one index state migrates to the current schema', () => {
  const database = new DatabaseSync(':memory:');
  try {
    database.exec(`
      PRAGMA user_version = 1;
      CREATE TABLE style_index_state (
        style_rowid INTEGER PRIMARY KEY,
        artifact_hint_hash TEXT NOT NULL,
        aggregate_hash TEXT NOT NULL,
        last_success_generation TEXT NOT NULL,
        last_success_at TEXT NOT NULL,
        missing_observations INTEGER NOT NULL DEFAULT 0
      ) STRICT;
    `);
    createSchema(database);
    const columns = database.prepare('PRAGMA table_info(style_index_state)')
      .all().map((column) => column.name);
    assert.ok(columns.includes('crawl_record_hash'));
    assert.equal(database.prepare('PRAGMA user_version').get().user_version,
      STYLE_DB_SCHEMA_VERSION);
    assert.equal(database.prepare(`
      SELECT COUNT(*) AS count FROM sqlite_master
      WHERE type = 'table' AND name = 'vector_projection_revisions'
    `).get().count, 1);
  } finally {
    database.close();
  }
});

test('schema rejects duplicate slugs and inconsistent tombstones', async (context) => {
  const { database } = await createIndexedFixture(context);
  const alpha = database.prepare('SELECT * FROM styles ORDER BY style_id LIMIT 1').get();
  assert.throws(() => database.prepare(`
    INSERT INTO styles(
      style_id, slug, lifecycle_state, crawl_status, title, thesis, theme, industry,
      aggregate_hash, retrieval_hash, created_at, updated_at
    ) VALUES (?, ?, 'active', 'captured', 'Duplicate', '', NULL, NULL, ?, ?, ?, ?)
  `).run(
    '99999999-9999-4999-8999-999999999999',
    alpha.slug,
    alpha.aggregate_hash,
    alpha.retrieval_hash,
    alpha.created_at,
    alpha.updated_at,
  ), /UNIQUE constraint failed/);
  assert.throws(() => database.prepare(`
    UPDATE styles SET lifecycle_state = 'tombstoned' WHERE style_rowid = ?
  `).run(alpha.style_rowid), /CHECK constraint failed/);
});

test('normalized children cascade and FTS triggers stay synchronized', async (context) => {
  const { database } = await createIndexedFixture(context);
  const alpha = database.prepare("SELECT style_rowid FROM styles WHERE slug = 'alpha'").get();
  assert.equal(database.prepare(`
    SELECT COUNT(*) AS count FROM style_fts WHERE style_fts MATCH 'editorial'
  `).get().count, 1);
  database.prepare(`
    UPDATE retrieval_documents SET body = 'renamed lexical needle' WHERE style_rowid = ?
  `).run(alpha.style_rowid);
  assert.equal(database.prepare(`
    SELECT COUNT(*) AS count FROM style_fts WHERE style_fts MATCH 'needle'
  `).get().count, 1);
  database.prepare('DELETE FROM styles WHERE style_rowid = ?').run(alpha.style_rowid);
  assert.equal(database.prepare(`
    SELECT COUNT(*) AS count FROM style_artifacts WHERE style_rowid = ?
  `).get(alpha.style_rowid).count, 0);
  assert.equal(database.prepare(`
    SELECT COUNT(*) AS count FROM style_fts WHERE style_fts MATCH 'needle'
  `).get().count, 0);
});

test('active theme queries select the partial index', async (context) => {
  const { database } = await createIndexedFixture(context);
  const plan = database.prepare(`
    EXPLAIN QUERY PLAN
    SELECT style_id FROM styles WHERE lifecycle_state = 'active' AND theme = 'light'
  `).all().map((row) => row.detail).join('\n');
  assert.match(plan, /idx_styles_active_theme/);
});

test('published database pointers cannot escape through a symlink', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const outsideDirectory = path.join(fixture.base, 'outside');
  const generationDirectory = path.join(fixture.base, 'generations');
  await mkdir(outsideDirectory);
  await mkdir(generationDirectory);
  const built = await buildStyleDatabase({
    corpusRoot: fixture.root,
    databasePath: path.join(outsideDirectory, 'source.sqlite'),
  });
  const databasePath = path.join(generationDirectory, 'style.sqlite');
  const escapedName = 'escaped.sqlite';
  await symlink(built.generationDatabasePath, path.join(generationDirectory, escapedName));
  await writeFile(`${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`, `${JSON.stringify({
    schemaVersion: 1,
    generationHash: built.generationHash,
    databaseFile: escapedName,
  })}\n`);
  assert.throws(() => resolvePublishedDatabasePath(databasePath), (error) => (
    error.code === 'generation-pointer-escape'
  ));
});

test('published database opens bind the pointer to the database generation', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const databasePath = path.join(fixture.base, 'bound-style.sqlite');
  const built = await buildStyleDatabase({ corpusRoot: fixture.root, databasePath });
  await writeFile(`${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`, `${JSON.stringify({
    schemaVersion: 1,
    generationHash: `sha256:${'0'.repeat(64)}`,
    databaseFile: path.basename(built.generationDatabasePath),
  })}\n`);
  assert.throws(() => queryPersistentStyles({}, { databasePath }), (error) => (
    error.code === 'generation-pointer-mismatch'
  ));
});
