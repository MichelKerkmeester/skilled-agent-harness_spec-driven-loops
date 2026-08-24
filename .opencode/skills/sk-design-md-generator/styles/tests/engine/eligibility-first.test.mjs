// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Eligibility-First Ordering Fixture                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import { applyEligibility } from '../../lib/engine/eligibility.mjs';
import { buildManifest } from '../../lib/engine/manifest.mjs';
import { rankEligibleStyles } from '../../lib/engine/rank-fts.mjs';
import { runBuild, runQuery } from '../../lib/engine/style-library.mjs';
import { STYLE_ALPHA, STYLE_BETA, createFixtureCorpus } from './fixtures.mjs';

test('lexical score cannot reintroduce an ineligible style', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifest = await buildManifest(fixture.root);
  const request = {
    text: 'motion animation transition kinetic',
    requiredFacets: ['warm-surface'],
  };
  const eligibility = applyEligibility(manifest.styles, request);
  assert.deepEqual(eligibility.eligible.map((style) => style.id), [STYLE_ALPHA.id]);
  assert.deepEqual(eligibility.rejected.map((style) => style.id), [STYLE_BETA.id]);
  const ranking = await rankEligibleStyles(eligibility.eligible, request, {
    corpusRoot: fixture.root,
    generationHash: manifest.generationHash,
    useFts: false,
  });
  assert.deepEqual(ranking.ranked.map((entry) => entry.style.id), [STYLE_ALPHA.id]);
});

test('runQuery orders cards through the real lexical ranker', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  const result = await runQuery({
    text: 'dark product kinetic motion compact controls animation transitions',
    useFts: false,
    limit: 2,
  }, { corpusRoot: fixture.root, manifestPath });
  assert.equal(result.rankingMode, 'source-scan');
  assert.deepEqual(result.cards.map((card) => card.id), [STYLE_BETA.id, STYLE_ALPHA.id]);
});

test('runQuery never assembles a card for an ineligible style', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  const result = await runQuery({
    text: 'dark product kinetic motion compact controls animation transitions',
    requiredFacets: ['warm-surface'],
    useFts: false,
  }, { corpusRoot: fixture.root, manifestPath });
  assert.deepEqual(result.cards.map((card) => card.id), [STYLE_ALPHA.id]);
  assert.equal(result.cards.some((card) => card.id === STYLE_BETA.id), false);
});
