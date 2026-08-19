// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Relevance Judgment Seed Tests                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import {
  JUDGMENT_LABEL_SOURCES,
  buildJudgmentDatabase,
  buildJudgmentSeed,
  deriveAuthoredSimilarJudgments,
  deriveSilverHeuristicJudgments,
  loadJudgmentSeed,
  validateJudgmentRow,
} from '../oracle/relevance-judgments.mjs';

const SEED_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'oracle',
  'relevance-judgments.seed.json',
);

test('the seed flags that human labeling is still required and validates every row', async () => {
  const seed = await loadJudgmentSeed(SEED_PATH);
  assert.equal(seed.humanLabelingRequired, true);
  assert.ok(seed.judgments.length > 0);
  for (const row of seed.judgments) {
    assert.deepEqual(validateJudgmentRow(row), []);
    assert.ok(JUDGMENT_LABEL_SOURCES.includes(row.label_source));
  }
});

test('no judgment row is presented as human gold', async () => {
  const seed = await loadJudgmentSeed(SEED_PATH);
  const sources = new Set(seed.judgments.map((row) => row.label_source));
  assert.equal([...sources].every((source) => JUDGMENT_LABEL_SOURCES.includes(source)), true);
  assert.equal(sources.has('human'), false);
  assert.equal(sources.has('gold'), false);
});

test('loading rejects a seed that omits the human-labeling flag', async () => {
  const seed = JSON.parse(await readFile(SEED_PATH, 'utf8'));
  await assert.rejects(
    loadJudgmentSeed({ ...seed, humanLabelingRequired: false }),
    /human labeling is still required/,
  );
});

test('a row without provenance is rejected', () => {
  const problems = validateJudgmentRow({
    query: { text: 'x' },
    relevant: ['id'],
    label_source: 'silver-heuristic',
    confidence: 0.4,
    provenance: {},
  });
  assert.ok(problems.some((problem) => problem.includes('provenance')));
});

test('authored-similar rows trace to real resolved relationships', async (context) => {
  const judgment = await buildJudgmentDatabase();
  context.after(judgment.cleanup);
  const authored = deriveAuthoredSimilarJudgments(judgment.database);
  assert.ok(authored.length > 0);
  for (const row of authored) {
    assert.equal(row.label_source, 'authored-similar');
    assert.equal(row.confidence, 1);
    assert.equal(row.provenance.resolutionState, 'resolved');
    const match = judgment.database.prepare(`
      SELECT COUNT(*) AS count
      FROM style_relationships relationship
      JOIN styles source ON source.style_rowid = relationship.source_style_rowid
      JOIN styles target ON target.style_rowid = relationship.target_style_rowid
      WHERE relationship.resolution_state = 'resolved'
        AND source.style_id = ? AND target.style_id = ?
    `).get(row.query.styleId, row.relevant[0]).count;
    assert.equal(Number(match), 1);
  }
});

test('silver-heuristic rows require independent cross-lane agreement', async (context) => {
  const judgment = await buildJudgmentDatabase();
  context.after(judgment.cleanup);
  const silver = deriveSilverHeuristicJudgments(judgment.database);
  assert.ok(silver.length > 0);
  for (const row of silver) {
    assert.equal(row.label_source, 'silver-heuristic');
    assert.equal(row.provenance.method, 'cross-lane-agreement');
    assert.ok(row.provenance.agreeingChannels.length >= 2);
  }
});

test('the seed regenerates deterministically from the judgment fixture', async (context) => {
  const judgment = await buildJudgmentDatabase();
  context.after(judgment.cleanup);
  const regenerated = buildJudgmentSeed(judgment.database);
  const committed = JSON.parse(await readFile(SEED_PATH, 'utf8'));
  assert.deepEqual(regenerated, committed);
});
