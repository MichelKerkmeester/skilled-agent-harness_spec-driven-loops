// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Differential Oracle Tests                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createFixtureCorpus } from '../../_engine/__tests__/fixtures.mjs';
import { stableJson } from '../canonical.mjs';
import {
  DEFAULT_GOLDEN_DIR,
  buildOracleDatabase,
  canonicalizeSnapshot,
  captureOracle,
  freezeOracle,
  listGoldenScenarios,
  replayOracle,
  snapshotScenario,
} from '../oracle/differential-oracle.mjs';
import { ORACLE_QUERY_SET } from '../oracle/query-set.mjs';
import {
  REPLAY_SCALES,
  buildScaledOracleDatabase,
  captureScaleOracle,
  materializeReplayCorpus,
} from '../oracle/replay-fixtures.mjs';
import { queryPersistentStyles } from '../retrieval.mjs';

async function goldenScratch() {
  return mkdtemp(path.join(os.tmpdir(), 'style-oracle-golden-'));
}

async function loadScaleGolden() {
  return JSON.parse(await readFile(path.join(DEFAULT_GOLDEN_DIR, 'scales.json'), 'utf8'));
}

function scenarioRequest(name) {
  return ORACLE_QUERY_SET.find((scenario) => scenario.name === name).request;
}

test('replay reproduces the committed golden bytes for every scenario', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const database = await buildOracleDatabase({ corpusRoot: fixture.root });
  context.after(() => database.close());
  const outcome = await replayOracle({ database });
  assert.equal(outcome.ok, true, JSON.stringify(outcome.mismatches));
  assert.equal(outcome.captures.length, ORACLE_QUERY_SET.length);
});

test('freeze then replay round-trips in an isolated golden directory', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const database = await buildOracleDatabase({ corpusRoot: fixture.root });
  context.after(() => database.close());
  const goldenDir = await goldenScratch();
  context.after(() => rm(goldenDir, { recursive: true, force: true }));

  const frozen = await freezeOracle({ database, goldenDir });
  assert.equal(frozen.length, ORACLE_QUERY_SET.length);
  assert.deepEqual(await listGoldenScenarios(goldenDir), ORACLE_QUERY_SET.map((s) => s.name).sort());

  const replay = await replayOracle({ database, goldenDir });
  assert.equal(replay.ok, true, JSON.stringify(replay.mismatches));
});

test('a byte perturbation in a golden file fails the oracle', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const database = await buildOracleDatabase({ corpusRoot: fixture.root });
  context.after(() => database.close());
  const goldenDir = await goldenScratch();
  context.after(() => rm(goldenDir, { recursive: true, force: true }));

  await freezeOracle({ database, goldenDir });
  const targetPath = path.join(goldenDir, 'fts-text.canonical.json');
  const original = await readFile(targetPath, 'utf8');
  await writeFile(targetPath, original.replace('"ok":true', '"ok":false'));

  const replay = await replayOracle({ database, goldenDir });
  assert.equal(replay.ok, false);
  assert.deepEqual(replay.mismatches, [{ name: 'fts-text', reason: 'byte-mismatch', sha256: replay.captures.find((c) => c.name === 'fts-text').sha256 }]);
});

test('a missing golden file is reported rather than silently passing', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const database = await buildOracleDatabase({ corpusRoot: fixture.root });
  context.after(() => database.close());
  const goldenDir = await goldenScratch();
  context.after(() => rm(goldenDir, { recursive: true, force: true }));

  const replay = await replayOracle({ database, goldenDir });
  assert.equal(replay.ok, false);
  assert.equal(replay.mismatches.length, ORACLE_QUERY_SET.length);
  assert.ok(replay.mismatches.every((mismatch) => mismatch.reason === 'missing-golden'));
});

test('an ordering or tie-break change alters the canonical bytes', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const database = await buildOracleDatabase({ corpusRoot: fixture.root });
  context.after(() => database.close());
  const scenario = ORACLE_QUERY_SET.find((entry) => entry.name === 'structured-only');
  const snapshot = snapshotScenario(database, scenario);
  const canonical = canonicalizeSnapshot(snapshot);
  const perturbed = {
    ...snapshot,
    result: { ...snapshot.result, cards: [...snapshot.result.cards].reverse() },
  };
  assert.notEqual(stableJson(perturbed), canonical.canonical);
  assert.ok(snapshot.result.cards.length >= 2, 'perturbation requires at least two cards');
});

test('every capture reuses the shared canonicalizer for a stable digest', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const database = await buildOracleDatabase({ corpusRoot: fixture.root });
  context.after(() => database.close());
  const first = captureOracle(database);
  const second = captureOracle(database);
  assert.deepEqual(first.map((c) => c.sha256), second.map((c) => c.sha256));
  for (const capture of first) {
    assert.ok(capture.sha256.startsWith('sha256:'));
  }
});

test('the full oracle matrix replays with drained vectors at every replay scale', async (context) => {
  const golden = await loadScaleGolden();
  for (const [label, count] of Object.entries(REPLAY_SCALES)) {
    const fixture = await materializeReplayCorpus(count);
    context.after(fixture.cleanup);
    assert.equal(
      await captureScaleOracle(fixture.root),
      golden.scales[label].oracleHash,
      `full-matrix oracle drifted for ${label}`,
    );
  }
});

test('the scaled vector and hybrid lanes are genuinely exercised', async (context) => {
  const fixture = await materializeReplayCorpus(REPLAY_SCALES['10x']);
  context.after(fixture.cleanup);
  const database = await buildScaledOracleDatabase(fixture.root);
  context.after(() => database.close());

  const vectorOnly = queryPersistentStyles(scenarioRequest('vector-only'), { database });
  assert.equal(vectorOnly.channelHealth.vector.state, 'healthy');
  assert.ok(vectorOnly.cards.length > 0, 'vector-only must rank cards from drained vectors at scale');

  const hybrid = queryPersistentStyles(scenarioRequest('hybrid'), { database });
  assert.equal(hybrid.rankingMode, 'hybrid');
  assert.equal(hybrid.degraded, false);
});
