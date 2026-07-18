// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Lexical Fallback Fixtures                                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import test from 'node:test';

import { applyEligibility } from '../eligibility.mjs';
import { buildManifest } from '../manifest.mjs';
import { rankEligibleStyles } from '../rank-fts.mjs';
import { STYLE_ALPHA, createFixtureCorpus } from './fixtures.mjs';

test('absent and stale accelerators use the bounded degraded source scan', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifest = await buildManifest(fixture.root);
  const request = { text: 'warm cream editorial' };
  const { eligible } = applyEligibility(manifest.styles, request);

  const absent = await rankEligibleStyles(eligible, request, {
    corpusRoot: fixture.root,
    generationHash: manifest.generationHash,
    useFts: false,
  });
  assert.equal(absent.degraded, true);
  assert.equal(absent.rankingMode, 'source-scan');
  assert.equal(absent.ranked[0].style.id, STYLE_ALPHA.id);

  const stale = await rankEligibleStyles(eligible, request, {
    corpusRoot: fixture.root,
    generationHash: manifest.generationHash,
    acceleratorGenerationHash: 'sha256:stale',
  });
  assert.equal(stale.degraded, true);
  assert.equal(stale.rankingMode, 'source-scan');
});

test('same-generation FTS is disposable and returns a non-degraded rank', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifest = await buildManifest(fixture.root);
  const request = { text: 'warm cream editorial' };
  const { eligible } = applyEligibility(manifest.styles, request);
  const result = await rankEligibleStyles(eligible, request, {
    corpusRoot: fixture.root,
    generationHash: manifest.generationHash,
  });
  assert.equal(result.degraded, false);
  assert.equal(result.rankingMode, 'fts5-bm25');
  assert.equal(result.ranked[0].style.id, STYLE_ALPHA.id);
});
