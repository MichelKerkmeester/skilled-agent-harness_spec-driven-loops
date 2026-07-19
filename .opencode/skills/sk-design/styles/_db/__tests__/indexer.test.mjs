// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Incremental Style Indexer Tests                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import {
  appendDesignText,
  createFixtureCorpus,
} from '../../_engine/__tests__/fixtures.mjs';
import {
  buildStyleDatabase,
  indexStyleCorpus,
  indexerInternals,
  rollbackStyleDatabase,
} from '../indexer.mjs';
import { openStyleDatabase, resolvePublishedDatabasePath } from '../schema.mjs';
import { createIndexedFixture } from './fixtures.mjs';

function legacyGenerationHash(crawlManifestHash, styles) {
  const hash = createHash('sha256');
  for (const value of ['style-corpus-generation-v1', crawlManifestHash]) {
    const buffer = Buffer.from(value, 'utf8');
    const length = Buffer.allocUnsafe(8);
    length.writeBigUInt64BE(BigInt(buffer.byteLength));
    hash.update(length);
    hash.update(buffer);
  }
  for (const style of styles) {
    for (const value of [style.id, style.aggregateHash]) {
      const buffer = Buffer.from(value, 'utf8');
      const length = Buffer.allocUnsafe(8);
      length.writeBigUInt64BE(BigInt(buffer.byteLength));
      hash.update(length);
      hash.update(buffer);
    }
  }
  return `sha256:${hash.digest('hex')}`;
}

test('current generation identity cannot collide with version one', () => {
  const crawlHash = `sha256:${'1'.repeat(64)}`;
  const styles = [{
    id: '11111111-1111-4111-8111-111111111111',
    aggregateHash: `sha256:${'2'.repeat(64)}`,
  }];
  assert.notEqual(
    indexerInternals.computeGenerationHash(crawlHash, styles),
    legacyGenerationHash(crawlHash, styles),
  );
});

test('full rebuild validates staging and preserves a rollback generation', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const databasePath = path.join(fixture.base, 'style-database.sqlite');
  const first = await buildStyleDatabase({ corpusRoot: fixture.root, databasePath });
  assert.equal(resolvePublishedDatabasePath(databasePath), first.generationDatabasePath);
  const firstDatabase = openStyleDatabase(first.generationDatabasePath);
  firstDatabase.prepare(`
    INSERT INTO style_db_metadata(key, value) VALUES ('old-only-marker', 'old')
  `).run();
  firstDatabase.exec('BEGIN');
  assert.equal(firstDatabase.prepare(`
    SELECT value FROM style_db_metadata WHERE key = 'old-only-marker'
  `).get().value, 'old');
  await appendDesignText(fixture.root, 'alpha', 'A staged generation change.');
  const second = await buildStyleDatabase({ corpusRoot: fixture.root, databasePath });
  assert.notEqual(second.generationHash, first.generationHash);
  assert.notEqual(second.generationDatabasePath, first.generationDatabasePath);
  assert.equal(resolvePublishedDatabasePath(databasePath), second.generationDatabasePath);
  const secondDatabase = openStyleDatabase(second.generationDatabasePath);
  try {
    assert.equal(secondDatabase.prepare(`
      SELECT value FROM style_db_metadata WHERE key = 'old-only-marker'
    `).get(), undefined);
    assert.equal(firstDatabase.prepare(`
      SELECT value FROM style_db_metadata WHERE key = 'old-only-marker'
    `).get().value, 'old');
  } finally {
    secondDatabase.close();
    firstDatabase.exec('ROLLBACK');
    firstDatabase.close();
  }
  const rolledBack = await rollbackStyleDatabase({
    databasePath,
    generationDatabasePath: first.generationDatabasePath,
  });
  assert.equal(rolledBack.generationHash, first.generationHash);
  assert.equal(resolvePublishedDatabasePath(databasePath), first.generationDatabasePath);
  const files = await readdir(fixture.base);
  assert.ok(files.includes(path.basename(first.generationDatabasePath)));
  assert.ok(files.includes(path.basename(second.generationDatabasePath)));
  assert.equal(files.some((name) => name.includes('.building-') || name.endsWith('.staging')), false);
});

test('post-pointer failure preserves the generation selected by the pointer', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const databasePath = path.join(fixture.base, 'fault-style-database.sqlite');
  await assert.rejects(buildStyleDatabase({
    corpusRoot: fixture.root,
    databasePath,
    failureInjector: ({ phase }) => {
      if (phase === 'POINTER_RENAMED') throw new Error('simulated-pointer-fsync-failure');
    },
  }), /simulated-pointer-fsync-failure/);
  const publishedPath = resolvePublishedDatabasePath(databasePath);
  const published = openStyleDatabase(publishedPath);
  try {
    assert.ok(published.prepare(`
      SELECT generation_hash FROM current_corpus_generation WHERE singleton = 1
    `).get().generation_hash);
  } finally {
    published.close();
  }
});

test('indexer follows the lifecycle and skips unchanged artifact hashes', async (context) => {
  const { database, fixture, indexed } = await createIndexedFixture(context);
  const stages = [];
  const stageDetails = new Map();
  const unchanged = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
    onStage: (stage, details) => {
      stages.push(stage);
      stageDetails.set(stage, details);
    },
  });
  assert.equal(unchanged.published, false);
  assert.equal(unchanged.unchanged, 2);
  assert.deepEqual(stages, ['DISCOVER', 'VERIFY', 'PARSE_VALIDATE']);
  assert.equal(stageDetails.get('VERIFY').candidates, 0);
  assert.equal(indexed.indexed, 2);
});

test('crawl-manifest-only provenance changes are indexed', async (context) => {
  const { database, fixture } = await createIndexedFixture(context);
  const canonicalPath = path.join(fixture.root, 'alpha', 'alpha-canonical.json');
  const canonical = JSON.parse(await readFile(canonicalPath, 'utf8'));
  delete canonical.capturedAt;
  await writeFile(canonicalPath, `${JSON.stringify(canonical, null, 2)}\n`);
  const fallbackBaseline = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
  });
  const manifestPath = path.join(fixture.root, '_manifest.json');
  const crawl = JSON.parse(await readFile(manifestPath, 'utf8'));
  crawl[0].capturedAt = '2026-02-02T00:00:00.000Z';
  await writeFile(manifestPath, `${JSON.stringify(crawl, null, 2)}\n`);
  const result = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
  });
  assert.equal(result.indexed, 1);
  assert.notEqual(result.generationHash, fallbackBaseline.generationHash);
  assert.equal(database.prepare(`
    SELECT p.captured_at FROM style_provenance p
    JOIN styles s USING(style_rowid) WHERE s.slug = 'alpha'
  `).get().captured_at, '2026-02-02T00:00:00.000Z');
});

test('an unchanged corpus can queue a new vector profile without republishing', async (context) => {
  const { database, fixture, indexed } = await createIndexedFixture(context);
  const result = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
    embeddingProfile: {
      id: 'alternate-profile',
      provider: 'external',
      model: 'alternate',
      dimensions: 2,
      configHash: 'alternate-v1',
    },
  });
  assert.equal(result.published, false);
  assert.equal(result.generationHash, indexed.generationHash);
  assert.equal(result.queued, 2);
  assert.equal(database.prepare(`
    SELECT COUNT(*) AS count FROM style_vector_jobs WHERE profile_id = 'alternate-profile'
  `).get().count, 2);
});

test('a simulated mid-commit crash leaves no partial generation or success marker', async (context) => {
  const { database, fixture, indexed } = await createIndexedFixture(context);
  const priorGenerationCount = database.prepare(
    'SELECT COUNT(*) AS count FROM corpus_generations',
  ).get().count;
  const priorHash = database.prepare(
    "SELECT aggregate_hash FROM styles WHERE slug = 'alpha'",
  ).get().aggregate_hash;
  await appendDesignText(fixture.root, 'alpha', 'A crash-safe lexical addition.');
  await assert.rejects(indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
    failureInjector: ({ phase, index }) => {
      if (phase === 'COMMIT' && index === 0) throw new Error('simulated-mid-commit');
    },
  }), /simulated-mid-commit/);
  assert.equal(database.prepare(`
    SELECT generation_hash FROM current_corpus_generation WHERE singleton = 1
  `).get().generation_hash, indexed.generationHash);
  assert.equal(database.prepare(
    'SELECT COUNT(*) AS count FROM corpus_generations',
  ).get().count, priorGenerationCount);
  assert.equal(database.prepare(
    "SELECT aggregate_hash FROM styles WHERE slug = 'alpha'",
  ).get().aggregate_hash, priorHash);
  const recovered = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
  });
  assert.equal(recovered.indexed, 1);
  assert.notEqual(recovered.generationHash, indexed.generationHash);
});

test('disappeared styles quarantine before an independently confirmed tombstone', async (context) => {
  const { database, fixture } = await createIndexedFixture(context);
  await rm(path.join(fixture.root, 'beta'), { recursive: true });
  const first = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
  });
  assert.equal(first.quarantined, 1);
  assert.equal(database.prepare("SELECT lifecycle_state FROM styles WHERE slug = 'beta'").get()
    .lifecycle_state, 'quarantined');
  const second = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
  });
  assert.equal(second.tombstoned, 1);
  assert.notEqual(second.generationHash, first.generationHash);
  assert.equal(database.prepare("SELECT lifecycle_state FROM styles WHERE slug = 'beta'").get()
    .lifecycle_state, 'tombstoned');
  const third = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
  });
  assert.equal(third.published, false);
});
