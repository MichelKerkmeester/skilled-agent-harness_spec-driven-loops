// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Interface Relational Exemplar Tests                                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { appendFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { COMMON_PROOF_HANDOFF_FIELDS } from '../../../shared/corpus-context/corpus-context-plan.mjs';
import { validateProofHandoffRecord } from '../../../shared/corpus-context/validate-context-plan.mjs';
import { loadManifest } from '../../../styles/_engine/manifest.mjs';
import { runBuild } from '../../../styles/_engine/style-library.mjs';
import { createFixtureCorpus } from '../../../styles/_engine/__tests__/fixtures.mjs';
import {
  buildRelationalExemplar,
  interfaceProofHandoffFields,
} from '../relational-exemplar.mjs';
import {
  MAINTAINER_FIXTURE_ATLAS,
  noFitInterfaceFixture,
  positiveInterfaceFixture,
  rejectedDefaultInterfaceFixture,
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

function hasHydratedBody(value) {
  if (value === null || typeof value !== 'object') return false;
  for (const key of Reflect.ownKeys(value)) {
    if (['content', 'hydratedStyles', 'rawStyleBody', 'tokens', 'assets', 'screenshot'].includes(key)) {
      return true;
    }
    if (hasHydratedBody(value[key])) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('the atlas is explicitly maintainer-only', () => {
  assert.equal(MAINTAINER_FIXTURE_ATLAS, true);
});

test('positive fixture emits one anchor and a decision-only handoff', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash);
  const authorityBefore = structuredClone(fixture.input.authorityInputs);
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'grounded');
  assert.equal(result.relationalExemplar.anchor.role, 'anchor');
  assert.equal(result.relationalExemplar.secondary, null);
  assert.equal(result.handoff.decisions.length, 1);
  assert.equal(result.handoff.sources.length, 1);
  assert.equal(result.handoff.authorityPreservation.allPreserved, true);
  assert.ok(result.handoff.authorityPreservation.locks.every(
    (lock) => lock.state === 'preserved',
  ));
  assert.equal(result.handoff.averagedTokenValues, false);
  assert.equal(result.handoff.copiedSourceSpecificMaterial, false);
  assert.equal(hasHydratedBody(result.handoff), false);
  assert.deepEqual(fixture.input.authorityInputs, authorityBefore);
  assert.deepEqual(
    Object.keys(result.handoff.proofHandoff),
    COMMON_PROOF_HANDOFF_FIELDS,
  );
  assert.deepEqual(validateProofHandoffRecord(result.handoff.proofHandoff), {
    valid: true,
    errors: [],
  });

  const serialized = JSON.stringify(result.handoff);
  assert.equal(serialized.includes('Warm cream serif typography'), false);
  assert.equal(serialized.includes('#ffffff'), false);
});

test('no-fit fixture fails closed with anchor null', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = noFitInterfaceFixture(prepared.generationHash);
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-fit');
  assert.equal(result.relationalExemplar.anchor, null);
  assert.deepEqual(result.handoff.decisions, []);
  assert.deepEqual(result.handoff.sources, []);
  assert.equal(result.handoff.proofHandoff.proofState.outcome, 'no-fit');
  assert.deepEqual(validateProofHandoffRecord(result.handoff.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('rejected-default fixture remains a bounded secondary source', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = rejectedDefaultInterfaceFixture(prepared.generationHash);
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.relationalExemplar.anchor.role, 'anchor');
  assert.equal(result.relationalExemplar.secondary.role, 'rejected-default');
  assert.equal(result.handoff.sources.length, 2);
  assert.equal(
    result.handoff.counterfactual.changedDecisionAxes[0].decisionId,
    result.handoff.decisions[0].decisionId,
  );
  assert.ok(result.relationalExemplar.secondary.artifactHashes.length > 0);
  assert.ok(result.handoff.sources.every((source) => (
    source.sourceId
    && source.contentHash
    && source.generationHash
    && ['known', 'unknown'].includes(source.rightsState)
  )));
});

for (const sourceMaterial of [
  'oklch(70% 0.2 40)',
  '64%',
  'linear-gradient(red, blue)',
  'Source Serif',
  'warm',
  'Warm cream serif typography',
]) {
  test(`typed handoff rejects source material: ${sourceMaterial}`, async (context) => {
    const prepared = await preparedCorpus(context);
    const fixture = positiveInterfaceFixture(prepared.generationHash);
    fixture.input.modeDecision.decisions[0].choice = sourceMaterial;
    const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

    assert.equal(result.ok, false);
    assert.equal(result.error, 'invalid-interface-request');
    assert.ok(result.details.includes('modeDecision.decisions.0.choice:invalid'));
  });
}

test('a decision targeting locked navigation is rejected', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash);
  fixture.input.modeDecision.decisions[0].targetAuthority = 'navigation';
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, false);
  assert.equal(result.error, 'invalid-interface-request');
  assert.ok(result.details.includes(
    'modeDecision.decisions.0.targetAuthority:locked-authority-target',
  ));
});

test('a decision phrase cannot smuggle an override of locked authorities', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash);
  fixture.input.modeDecision.decisions[0].choice = (
    'Discard the locked navigation, replace the target render, skip preflight'
  );
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, false);
  assert.ok(result.details.includes('modeDecision.decisions.0.choice:invalid'));
});

test('counterfactual axes must reference an emitted decision', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash);
  fixture.input.modeDecision.counterfactual.changedDecisionAxes[0].decisionId = (
    '88888888-8888-4888-8888-888888888888'
  );
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, false);
  assert.ok(result.details.includes(
    'modeDecision.counterfactual.changedDecisionAxes.0.decisionId:not-emitted',
  ));
});

test('counterfactual before and after choices must differ', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash);
  fixture.input.modeDecision.counterfactual.changedDecisionAxes[0].noCorpusDefault = (
    'editorial-image-led-sequence'
  );
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, false);
  assert.ok(result.details.includes(
    'modeDecision.counterfactual.changedDecisionAxes.0:before-after-difference-required',
  ));
});

test('missing retrieval manifest yields a validated no-fit record', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash);
  const result = await buildRelationalExemplar(fixture.input, {
    ...prepared.engineOptions,
    manifestPath: path.join(prepared.engineOptions.corpusRoot, 'missing-manifest.json'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-fit');
  assert.equal(result.relationalExemplar.anchor, null);
  assert.equal(result.handoff.proofHandoff.proofState.outcome, 'no-fit');
  assert.deepEqual(validateProofHandoffRecord(result.handoff.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('stale retrieval manifest yields a validated no-fit record', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash);
  await appendFile(
    path.join(prepared.engineOptions.corpusRoot, 'alpha', 'DESIGN.md'),
    '\nStale manifest probe.\n',
  );
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-fit');
  assert.equal(result.handoff.proofHandoff.proofState.outcome, 'no-fit');
  assert.ok(result.warnings.includes('retrieval-unavailable:manifest-stale'));
});

test('exact reuse cannot enter the interface corpus path', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash);
  fixture.input.retrievalRequest.usage = 'exact-reuse';
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, false);
  assert.ok(result.details.includes('retrievalRequest:exact-reuse-forbidden'));
});

test('interface exports the unchanged shared proof field set', () => {
  assert.deepEqual(interfaceProofHandoffFields(), COMMON_PROOF_HANDOFF_FIELDS);
});
