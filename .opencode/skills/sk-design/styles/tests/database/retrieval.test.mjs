// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Persistent Retrieval and Vector Tests                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import test from 'node:test';

import { indexStyleCorpus } from '../../lib/database/indexer.mjs';
import { queryPersistentStyles, weightedRrf } from '../../lib/database/retrieval.mjs';
import { openStyleDatabase } from '../../lib/database/schema.mjs';
import {
  drainVectorQueue,
  rebuildVectorProjection,
  registerEmbeddingProfile,
} from '../../lib/database/vectors.mjs';
import { STYLE_ALPHA, STYLE_BETA, createIndexedFixture } from './fixtures.mjs';

test('weighted RRF is rank-only, attributed, and UUID deterministic', () => {
  const first = weightedRrf({
    structured: [{ id: STYLE_BETA.id, rawScore: 10 }, { id: STYLE_ALPHA.id, rawScore: 1 }],
    fts: [{ id: STYLE_ALPHA.id, rawScore: -1000 }, { id: STYLE_BETA.id, rawScore: 1000 }],
  });
  const second = weightedRrf({
    structured: [{ id: STYLE_BETA.id, rawScore: -999999 }, { id: STYLE_ALPHA.id, rawScore: 999999 }],
    fts: [{ id: STYLE_ALPHA.id, rawScore: 999999 }, { id: STYLE_BETA.id, rawScore: -999999 }],
  });
  assert.deepEqual(first.map(({ id, fusedScore }) => ({ id, fusedScore })),
    second.map(({ id, fusedScore }) => ({ id, fusedScore })));
  assert.equal(first[0].id, STYLE_ALPHA.id);
  assert.deepEqual(Object.keys(first[0].channelContributions).sort(), ['fts', 'structured']);
});

test('eligibility precedes every lane and cursors remain deterministic', async (context) => {
  const { database } = await createIndexedFixture(context);
  const filtered = queryPersistentStyles({
    text: 'motion animation transition kinetic',
    requiredFacets: ['warm-surface'],
  }, { database });
  assert.deepEqual(filtered.cards.map((card) => card.id), [STYLE_ALPHA.id]);
  assert.equal(filtered.eligibility.rejectedCount, 1);

  const request = { text: 'style reference', limit: 1 };
  const first = queryPersistentStyles(request, { database });
  assert.ok(first.nextCursor);
  const second = queryPersistentStyles({ ...request, cursor: first.nextCursor }, { database });
  assert.equal(second.cards.length, 1);
  assert.notEqual(second.cards[0].id, first.cards[0].id);
  const repeated = queryPersistentStyles(request, { database });
  assert.deepEqual(repeated.cards, first.cards);
});

test('retrieval fails closed without a valid published generation', () => {
  const database = openStyleDatabase();
  try {
    assert.throws(() => queryPersistentStyles({}, { database }), (error) => (
      error.code === 'generation-unavailable'
    ));
  } finally {
    database.close();
  }
});

test('a requested generation is enforced instead of silently serving current', async (context) => {
  const { database, indexed } = await createIndexedFixture(context);
  const pinned = queryPersistentStyles({ generationHash: indexed.generationHash }, { database });
  assert.equal(pinned.generationHash, indexed.generationHash);
  assert.throws(() => queryPersistentStyles({
    generationHash: `sha256:${'0'.repeat(64)}`,
  }, { database }), (error) => error.code === 'generation-mismatch');
});

test('query vectors are bounded before fingerprinting or database access', () => {
  assert.throws(() => queryPersistentStyles({
    queryVector: Array.from({ length: 16_385 }, () => 0),
  }), (error) => error.code === 'invalid-query-vector');
  assert.throws(() => queryPersistentStyles({
    queryVector: Array.from({ length: 16_384 }, () => Number.MAX_VALUE),
  }), (error) => error.code === 'invalid-query-vector');
  assert.throws(() => queryPersistentStyles({
    queryVector: ['1'],
  }), (error) => error.code === 'invalid-query-vector');
});

test('degradation is channel-local and failed vectors do not block FTS', async (context) => {
  const { database } = await createIndexedFixture(context);
  const failed = await drainVectorQueue(database, {
    profileId: 'style-default-v1',
    embedder: async () => { throw new Error('provider-offline'); },
  });
  assert.equal(failed.failed, 2);
  const lexical = queryPersistentStyles({ text: 'editorial serif' }, { database });
  assert.equal(lexical.rankingMode, 'structured+fts');
  assert.equal(lexical.cards[0].id, STYLE_ALPHA.id);
  const structured = queryPersistentStyles({ text: 'editorial serif', disableFts: true }, { database });
  assert.equal(structured.rankingMode, 'structured-only');
});

test('a cursor is rejected after its vector projection changes', async (context) => {
  const { database } = await createIndexedFixture(context);
  const request = {
    text: 'style reference',
    queryVector: [1, 0],
    vectorProfile: 'style-default-v1',
    limit: 1,
  };
  const first = queryPersistentStyles(request, { database });
  assert.ok(first.nextCursor);
  await drainVectorQueue(database, {
    profileId: 'style-default-v1',
    embedder: async (text) => text.includes('Alpha Editorial') ? [1, 0] : [0, 1],
  });
  assert.throws(() => queryPersistentStyles({
    ...request,
    cursor: first.nextCursor,
  }, { database }), (error) => error.code === 'invalid-cursor');
});

test('one profile rejects mixed dimensions within the same drain', async (context) => {
  const { database } = await createIndexedFixture(context);
  const result = await drainVectorQueue(database, {
    profileId: 'style-default-v1',
    embedder: async (text) => text.includes('Alpha Editorial') ? [1, 0] : [0, 1, 2],
  });
  assert.equal(result.completed, 1);
  assert.equal(result.failed, 1);
  assert.deepEqual(database.prepare(`
    SELECT DISTINCT dimensions FROM style_vectors ORDER BY dimensions
  `).all().map((row) => Number(row.dimensions)), [2]);
});

test('a later drain recovers a stale running vector claim', async (context) => {
  const { database } = await createIndexedFixture(context);
  const claimed = database.prepare(`
    SELECT job_id FROM style_vector_jobs ORDER BY job_id ASC LIMIT 1
  `).get();
  database.prepare(`
    UPDATE style_vector_jobs
    SET status = 'running', attempts = 1, updated_at = '2000-01-01T00:00:00.000Z'
    WHERE job_id = ?
  `).run(claimed.job_id);
  const result = await drainVectorQueue(database, {
    profileId: 'style-default-v1',
    runningTimeoutMs: 0,
    embedder: async (text) => text.includes('Alpha Editorial') ? [1, 0] : [0, 1],
  });
  assert.equal(result.recovered, 1);
  assert.equal(database.prepare(`
    SELECT status FROM style_vector_jobs WHERE job_id = ?
  `).get(claimed.job_id).status, 'completed');
});

test('vector cache publishes current-profile vectors and supersedes stale jobs', async (context) => {
  const { database, fixture } = await createIndexedFixture(context);
  const designPath = new URL(`file://${fixture.root}/alpha/DESIGN.md`);
  const { appendFile } = await import('node:fs/promises');
  await appendFile(designPath, '\nA semantic mutation.\n');
  await indexStyleCorpus({ corpusRoot: fixture.root, database, corpusWalkMode: 'migration' });
  assert.equal(database.prepare(`
    SELECT COUNT(*) AS count FROM style_vector_jobs WHERE status = 'superseded'
  `).get().count, 1);
  const drained = await drainVectorQueue(database, {
    profileId: 'style-default-v1',
    embedder: async (text) => text.includes('Alpha Editorial') ? [1, 0] : [0, 1],
  });
  assert.equal(drained.completed, 2);
  const rebuild = rebuildVectorProjection(database, 'style-default-v1');
  assert.equal(rebuild.queued, 2);
  const cached = await drainVectorQueue(database, {
    profileId: 'style-default-v1',
    embedder: async () => { throw new Error('cache-miss'); },
  });
  assert.equal(cached.cached, 2);
  assert.equal(cached.completed, 2);
  const vector = queryPersistentStyles({
    queryVector: [1, 0],
    vectorProfile: 'style-default-v1',
    disableFts: true,
  }, { database });
  assert.equal(vector.rankingMode, 'structured+vector');
  assert.equal(vector.cards[0].id, STYLE_ALPHA.id);
  assert.equal(database.prepare(`
    SELECT COUNT(*) AS count FROM style_vectors v JOIN styles s USING(style_rowid)
    WHERE v.retrieval_hash != s.retrieval_hash
  `).get().count, 0);
});

test('embedding profile identifiers cannot be rebound to another configuration', async (context) => {
  const { database } = await createIndexedFixture(context);
  assert.throws(() => registerEmbeddingProfile(database, {
    id: 'style-default-v1',
    provider: 'different-provider',
    model: 'different-model',
    dimensions: 3,
    configHash: 'different-config',
  }), (error) => error.code === 'embedding-profile-conflict');
});

test('incremental indexing requeues a completed job whose vector is missing', async (context) => {
  const { database, fixture } = await createIndexedFixture(context);
  await drainVectorQueue(database, {
    profileId: 'style-default-v1',
    embedder: async (text) => text.includes('Alpha Editorial') ? [1, 0] : [0, 1],
  });
  const missing = database.prepare(`
    SELECT style_rowid FROM styles WHERE slug = 'alpha'
  `).get();
  database.prepare(`
    DELETE FROM style_vectors WHERE style_rowid = ? AND profile_id = 'style-default-v1'
  `).run(missing.style_rowid);
  const indexed = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
  });
  assert.equal(indexed.published, false);
  assert.equal(indexed.queued, 1);
  assert.equal(database.prepare(`
    SELECT status FROM style_vector_jobs
    WHERE style_rowid = ? AND profile_id = 'style-default-v1'
    ORDER BY job_id DESC LIMIT 1
  `).get(missing.style_rowid).status, 'pending');
});
