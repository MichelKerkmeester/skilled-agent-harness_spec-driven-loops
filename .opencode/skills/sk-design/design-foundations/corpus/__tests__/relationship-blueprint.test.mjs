// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Foundations Corpus Relationship Tests                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import { COMMON_PROOF_HANDOFF_FIELDS } from '../../../shared/corpus-context/corpus-context-plan.mjs';
import { validateProofHandoffRecord } from '../../../shared/corpus-context/validate-context-plan.mjs';
import { loadManifest } from '../../../styles/_engine/manifest.mjs';
import { runBuild } from '../../../styles/_engine/style-library.mjs';
import { createFixtureCorpus } from '../../../styles/_engine/__tests__/fixtures.mjs';
import {
  buildFoundationsRelationshipPlan,
  foundationsProofHandoffFields,
} from '../relationship-blueprint.mjs';
import {
  foundationsNoFitFixture,
  foundationsRelationshipFixture,
} from './fixtures.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function preparedCorpus(context) {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  const manifest = await loadManifest(manifestPath);
  return {
    generationHash: manifest.generationHash,
    engineOptions: { corpusRoot: fixture.root, manifestPath },
  };
}

function hasSourceLiteralPayload(value) {
  if (value === null || typeof value !== 'object') return false;
  for (const key of Reflect.ownKeys(value)) {
    if (['content', 'tokens', 'rawValue', 'sourceLiteral', 'hydratedStyles'].includes(key)) {
      return true;
    }
    if (hasSourceLiteralPayload(value[key])) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('typed compatibility and not-assessed evidence produce a bounded result', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = foundationsRelationshipFixture(prepared.generationHash);
  const authorityBefore = structuredClone(fixture.input.authorityInputs);
  const result = await buildFoundationsRelationshipPlan(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'relationship-context');
  assert.equal(result.sources.length, 2);
  assert.equal(result.sources[0].role, 'coherent-anchor');
  assert.equal(result.sources[1].role, 'axis-owner');
  assert.ok(result.sources.every((source) => source.provenanceUseLabel));
  assert.equal(result.compatibilityGraph.edges[0].relation, 'not-assessed');
  assert.ok(Object.values(result.downstreamChecks).every((state) => state === 'not-assessed'));
  assert.equal(result.authorityPreservation.allPreserved, true);
  assert.equal(result.averagedTokenValues, false);
  assert.equal(result.copiedSourceSpecificMaterial, false);
  assert.equal(hasSourceLiteralPayload(result), false);
  assert.deepEqual(fixture.input.authorityInputs, authorityBefore);
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('no-fit keeps the relationship blueprint and returns accepted evidence', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = foundationsNoFitFixture(prepared.generationHash);
  const result = await buildFoundationsRelationshipPlan(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-fit');
  assert.deepEqual(result.relationshipBlueprint, fixture.input.blueprint);
  assert.deepEqual(result.compatibilityGraph.edges, []);
  assert.deepEqual(result.sources, []);
  assert.equal(result.proofHandoff.proofState.outcome, 'no-fit');
});

test('missing retrieval data yields a validated no-fit result instead of throwing', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = foundationsRelationshipFixture(prepared.generationHash);
  const result = await buildFoundationsRelationshipPlan(fixture.input, {
    ...prepared.engineOptions,
    manifestPath: path.join(prepared.engineOptions.corpusRoot, 'missing.json'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-fit');
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('foundations exports the unchanged shared proof field set', () => {
  assert.deepEqual(foundationsProofHandoffFields(), COMMON_PROOF_HANDOFF_FIELDS);
});
