// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Replay Fixture Determinism Tests                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { DEFAULT_GOLDEN_DIR, captureOracle } from '../oracle/differential-oracle.mjs';
import { ORACLE_QUERY_SET } from '../oracle/query-set.mjs';
import {
  REPLAY_SCALES,
  buildScaledOracleDatabase,
  captureScaleOracle,
  generateScaledStyles,
  materializeReplayCorpus,
  replayCorpusContentHash,
} from '../oracle/replay-fixtures.mjs';

async function loadScaleGolden() {
  return JSON.parse(await readFile(path.join(DEFAULT_GOLDEN_DIR, 'scales.json'), 'utf8'));
}

test('scaled style generation is a pure, reproducible function of its size', () => {
  assert.deepEqual(generateScaledStyles(37), generateScaledStyles(37));
  const styles = generateScaledStyles(4);
  assert.equal(new Set(styles.map((style) => style.id)).size, 4);
  assert.equal(new Set(styles.map((style) => style.slug)).size, 4);
});

test('a materialized corpus regenerates byte-identical on disk', async (context) => {
  const first = await materializeReplayCorpus(REPLAY_SCALES['1x']);
  context.after(first.cleanup);
  const second = await materializeReplayCorpus(REPLAY_SCALES['1x']);
  context.after(second.cleanup);
  assert.equal(await replayCorpusContentHash(first.root), await replayCorpusContentHash(second.root));
});

test('every replay scale reproduces its frozen corpus and oracle bytes', async (context) => {
  const golden = await loadScaleGolden();
  for (const [label, count] of Object.entries(REPLAY_SCALES)) {
    const fixture = await materializeReplayCorpus(count);
    context.after(fixture.cleanup);
    assert.equal(fixture.styles.length, count);
    assert.equal(
      await replayCorpusContentHash(fixture.root),
      golden.scales[label].corpusContentHash,
      `corpus content hash drifted for ${label}`,
    );
    assert.equal(
      await captureScaleOracle(fixture.root),
      golden.scales[label].oracleHash,
      `full-matrix oracle replay drifted for ${label}`,
    );
  }
});

test('the scaled full matrix pins every oracle lane, not a reduced probe set', async (context) => {
  const fixture = await materializeReplayCorpus(REPLAY_SCALES['10x']);
  context.after(fixture.cleanup);
  const database = await buildScaledOracleDatabase(fixture.root);
  context.after(() => database.close());
  const captured = captureOracle(database, ORACLE_QUERY_SET).map((capture) => capture.name);
  assert.deepEqual(captured, ORACLE_QUERY_SET.map((scenario) => scenario.name));
  for (const lane of ['vector-only', 'hybrid', 'paged', 'exact-reuse']) {
    assert.ok(captured.includes(lane), `scaled matrix must pin the ${lane} lane`);
  }
});

test('the golden scale set covers all three replay scales', async () => {
  const golden = await loadScaleGolden();
  assert.deepEqual(Object.keys(golden.scales).sort(), ['100x', '10x', '1x']);
});
