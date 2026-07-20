// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Stage Telemetry Tests                                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { createFixtureCorpus } from '../../_engine/__tests__/fixtures.mjs';
import { stableJson } from '../canonical.mjs';
import { indexStyleCorpus } from '../indexer.mjs';
import { queryPersistentStyles } from '../retrieval.mjs';
import { openStyleDatabase } from '../schema.mjs';
import { RESIDENCY, createStageRecorder } from '../stage-telemetry.mjs';
import {
  DEFAULT_GOLDEN_DIR,
  buildOracleDatabase,
} from '../oracle/differential-oracle.mjs';
import { ORACLE_QUERY_SET } from '../oracle/query-set.mjs';
import { createIndexedFixture } from './fixtures.mjs';

const RESIDENCY_VALUES = new Set(Object.values(RESIDENCY));

function deterministicRecorder() {
  let clock = 0;
  let rss = 1_000;
  return createStageRecorder({
    now: () => { const value = clock; clock += 5; return value; },
    memory: () => { const value = rss; rss += 32; return value; },
  });
}

function assertResidencyHonest(recorder) {
  const records = recorder.records();
  assert.ok(records.length > 0, 'expected at least one stage record');
  for (const record of records) {
    assert.ok(RESIDENCY_VALUES.has(record.residency), `unattributed residency: ${record.residency}`);
    assert.equal(typeof record.latencyMs, 'number');
    assert.equal(typeof record.rssDeltaBytes, 'number');
    assert.ok(record.throughputPerSecond === null || typeof record.throughputPerSecond === 'number');
  }
  const summary = recorder.summary();
  assert.equal(summary.native + summary.jsResident, summary.total);
  assert.ok(summary.unattributedMs >= 0, 'unattributed cost must never be negative');
  assert.ok(summary.elapsedMs + 1e-9 >= summary.total, 'elapsed must cover attributed span cost');
  assert.equal(summary.unattributedMs, Math.max(0, summary.elapsedMs - summary.total));
  assert.equal(summary.stageCount, records.length);
  return { records, summary };
}

test('the recorder attributes every span to one residency bucket', () => {
  const recorder = deterministicRecorder();
  recorder.span('a', RESIDENCY.NATIVE).end(10);
  recorder.span('b', RESIDENCY.JS_RESIDENT).end(20);
  const [first, second] = recorder.records();
  assert.equal(first.latencyMs, 5);
  assert.equal(first.throughputPerSecond, (10 / 5) * 1_000);
  assert.equal(first.rssDeltaBytes, 32);
  assert.equal(second.residency, RESIDENCY.JS_RESIDENT);
  const summary = recorder.summary();
  assert.equal(summary.native, 5);
  assert.equal(summary.jsResident, 5);
  assert.equal(summary.total, 10);
  // The two spans start five ticks apart, so the wall window is 15 while only
  // 10 was bracketed: the recorder must surface the 5-tick gap, not hide it.
  assert.equal(summary.elapsedMs, 15);
  assert.equal(summary.unattributedMs, 5);
});

test('summary measures wall time an explicit overall timer leaves outside every span', () => {
  let clock = 0;
  const recorder = createStageRecorder({ now: () => clock, memory: () => 0 });
  const overall = recorder.overall();
  clock = 100; // 100 ticks of work run before any span opens
  const span = recorder.span('native-read', RESIDENCY.NATIVE);
  clock = 130; // the span itself accounts for 30 ticks
  span.end(1);
  clock = 150; // 20 more ticks run after the span closes
  overall.end();
  const summary = recorder.summary();
  assert.equal(summary.total, 30);
  assert.equal(summary.native, 30);
  assert.equal(summary.elapsedMs, 150);
  assert.equal(summary.unattributedMs, 120);
});

test('summary attributes inter-span gaps to the unattributed bucket', () => {
  let clock = 0;
  const recorder = createStageRecorder({ now: () => clock, memory: () => 0 });
  const first = recorder.span('a', RESIDENCY.NATIVE);
  clock = 10;
  first.end(1);
  clock = 40; // a 30-tick gap runs outside any span
  const second = recorder.span('b', RESIDENCY.JS_RESIDENT);
  clock = 55;
  second.end(1);
  const summary = recorder.summary();
  assert.equal(summary.total, 25);
  assert.equal(summary.elapsedMs, 55);
  assert.equal(summary.unattributedMs, 30);
});

test('an unknown residency cannot be recorded', () => {
  const recorder = createStageRecorder();
  assert.throws(() => recorder.span('x', 'blended'), /Unknown telemetry residency/);
});

test('query telemetry brackets each native SQL and JS-resident step in its true bucket', async (context) => {
  const { database } = await createIndexedFixture(context);
  const recorder = createStageRecorder();
  const withTelemetry = queryPersistentStyles({ text: 'editorial serif' }, { database, telemetry: recorder });
  const { records, summary } = assertResidencyHonest(recorder);
  const residencyByStage = new Map(records.map((record) => [record.stage, record.residency]));

  // Steps the faked instrumentation ran outside every span (fingerprint digest,
  // BEGIN/COMMIT, opaque encoding) are now bracketed with their real residency.
  assert.equal(residencyByStage.get('request.fingerprint'), RESIDENCY.JS_RESIDENT);
  assert.equal(residencyByStage.get('transaction.begin'), RESIDENCY.NATIVE);
  assert.equal(residencyByStage.get('transaction.commit'), RESIDENCY.NATIVE);
  assert.equal(residencyByStage.get('cards.attribution.encode'), RESIDENCY.JS_RESIDENT);
  // Steps that used to bracket both SQL and JS under one label are split honestly.
  assert.equal(residencyByStage.get('generation.read'), RESIDENCY.NATIVE);
  assert.equal(residencyByStage.get('generation.verify'), RESIDENCY.JS_RESIDENT);
  assert.equal(residencyByStage.get('eligibility.load'), RESIDENCY.NATIVE);
  assert.equal(residencyByStage.get('eligibility.facets.load'), RESIDENCY.NATIVE);
  assert.equal(residencyByStage.get('eligibility.facets.assemble'), RESIDENCY.JS_RESIDENT);
  assert.ok(records.map((record) => record.stage).includes('lane.fts'));
  assert.ok(summary.native >= 0 && summary.jsResident >= 0);

  // Telemetry is a pure side-channel: the returned DTO must be byte-identical.
  const withoutTelemetry = queryPersistentStyles({ text: 'editorial serif' }, { database });
  assert.deepEqual(withTelemetry, withoutTelemetry);
  assert.equal(stableJson(withTelemetry), stableJson(withoutTelemetry));
});

test('the vector lane splits its native fetch from JS-resident cosine work', async (context) => {
  const { database } = await createIndexedFixture(context);
  const { drainVectorQueue } = await import('../vectors.mjs');
  await drainVectorQueue(database, {
    profileId: 'style-default-v1',
    embedder: async (text) => (text.includes('Alpha Editorial') ? [1, 0] : [0, 1]),
  });
  const recorder = createStageRecorder();
  queryPersistentStyles({
    queryVector: [1, 0],
    vectorProfile: 'style-default-v1',
    disableFts: true,
  }, { database, telemetry: recorder });
  const stages = recorder.records().map((record) => record.stage);
  assert.ok(stages.includes('lane.vector.fetch'));
  assert.ok(stages.includes('lane.vector.cosine'));
  const fetch = recorder.records().find((record) => record.stage === 'lane.vector.fetch');
  const cosine = recorder.records().find((record) => record.stage === 'lane.vector.cosine');
  assert.equal(fetch.residency, RESIDENCY.NATIVE);
  assert.equal(cosine.residency, RESIDENCY.JS_RESIDENT);
});

test('telemetry-off leaves the retrieval DTO byte-identical to the oracle golden', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const database = await buildOracleDatabase({ corpusRoot: fixture.root });
  context.after(() => database.close());
  const scenario = ORACLE_QUERY_SET.find((entry) => entry.name === 'fts-text');
  const golden = (await readFile(path.join(DEFAULT_GOLDEN_DIR, 'fts-text.canonical.json'), 'utf8'))
    .replace(/\n$/, '');

  const withoutTelemetry = queryPersistentStyles(scenario.request, { database });
  assert.equal(
    stableJson({ name: scenario.name, request: scenario.request, result: withoutTelemetry }),
    golden,
  );

  const recorder = createStageRecorder();
  const withTelemetry = queryPersistentStyles(scenario.request, { database, telemetry: recorder });
  assert.equal(
    stableJson({ name: scenario.name, request: scenario.request, result: withTelemetry }),
    golden,
  );
  assert.ok(recorder.records().length > 0);
});

test('indexer telemetry brackets each stage over the work it names', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const database = openStyleDatabase();
  context.after(() => database.close());
  const recorder = createStageRecorder();
  const result = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
    telemetry: recorder,
  });
  assert.equal(result.published, true);
  const { records, summary } = assertResidencyHonest(recorder);
  const stages = records.map((record) => record.stage);
  assert.deepEqual(stages, [
    'discover', 'snapshot.load', 'verify.parse', 'plan.hash', 'plan.load',
    'commit.write', 'publish.missing', 'publish.write',
  ]);
  const residencyByStage = new Map(records.map((record) => [record.stage, record.residency]));
  // Discovery, artifact verification/parse, and hashing run on the JS heap.
  assert.equal(residencyByStage.get('discover'), RESIDENCY.JS_RESIDENT);
  assert.equal(residencyByStage.get('verify.parse'), RESIDENCY.JS_RESIDENT);
  assert.equal(residencyByStage.get('plan.hash'), RESIDENCY.JS_RESIDENT);
  // The SQL snapshot, planning reads, and transaction writes stay native.
  assert.equal(residencyByStage.get('snapshot.load'), RESIDENCY.NATIVE);
  assert.equal(residencyByStage.get('plan.load'), RESIDENCY.NATIVE);
  assert.equal(residencyByStage.get('commit.write'), RESIDENCY.NATIVE);
  assert.equal(residencyByStage.get('publish.write'), RESIDENCY.NATIVE);
  assert.equal(summary.native + summary.jsResident, summary.total);
});

test('indexer telemetry books the JS-heavy embedder drain as js-resident', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const database = openStyleDatabase();
  context.after(() => database.close());
  const recorder = createStageRecorder();
  const result = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
    telemetry: recorder,
    embedder: async (text) => (text.includes('Alpha Editorial') ? [1, 0] : [0, 1]),
  });
  assert.equal(result.published, true);
  const drain = recorder.records().find((record) => record.stage === 'vector.drain');
  assert.ok(drain, 'expected a vector.drain span for the embedder drain');
  assert.equal(drain.residency, RESIDENCY.JS_RESIDENT);
  const publishWrite = recorder.records().find((record) => record.stage === 'publish.write');
  assert.equal(publishWrite.residency, RESIDENCY.NATIVE);
});
