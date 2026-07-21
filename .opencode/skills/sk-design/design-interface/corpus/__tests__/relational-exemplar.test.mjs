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
import { loadManifest } from '../../../styles/lib/engine/manifest.mjs';
import { runBuild } from '../../../styles/lib/engine/style-library.mjs';
import {
  STYLE_ALPHA,
  STYLE_BETA,
  appendDesignText,
  createFixtureCorpus,
} from '../../../styles/tests/engine/fixtures.mjs';
import {
  buildRelationalExemplar,
  interfaceProofHandoffFields,
} from '../relational-exemplar.mjs';
import {
  MAINTAINER_FIXTURE_ATLAS,
  interfaceDecisionEvidence,
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
  const evidenceByRole = {
    anchor: interfaceDecisionEvidence('anchor'),
    'rejected-default': interfaceDecisionEvidence('rejected-default'),
  };
  await Promise.all([
    appendDesignText(
      fixture.root,
      STYLE_ALPHA.slug,
      `\`\`\`interface-decision-evidence\n${JSON.stringify(evidenceByRole.anchor)}\n\`\`\``,
    ),
    appendDesignText(
      fixture.root,
      STYLE_BETA.slug,
      `\`\`\`interface-decision-evidence\n${JSON.stringify(evidenceByRole['rejected-default'])}\n\`\`\``,
    ),
  ]);
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  const manifest = await loadManifest(manifestPath);
  return {
    generationHash: manifest.generationHash,
    sourceBindings: Object.fromEntries([
      ['anchor', STYLE_ALPHA],
      ['rejected-default', STYLE_BETA],
    ].map(([role, styleDefinition]) => {
      const style = manifest.styles.find((candidate) => candidate.id === styleDefinition.id);
      const artifact = style.artifacts.find((candidate) => (
        candidate.path === `${styleDefinition.slug}/DESIGN.md`
      ));
      return [role, {
        contentHash: style.contentHash,
        artifactPath: artifact.path,
        artifactHash: artifact.sha256,
        evidence: evidenceByRole[role],
      }];
    })),
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

async function runDuringCorpusMutation(corpusRoot, operation) {
  let active = true;
  const crawlManifestPath = path.join(corpusRoot, '_manifest.json');
  const mutationLoop = (async () => {
    while (active) {
      await appendFile(crawlManifestPath, ' ');
      await new Promise((resolve) => setImmediate(resolve));
    }
  })();
  try {
    return await operation();
  } finally {
    active = false;
    await mutationLoop;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('the atlas is explicitly maintainer-only', () => {
  assert.equal(MAINTAINER_FIXTURE_ATLAS, true);
});

test('positive fixture emits one anchor and a decision-only handoff', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
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
  const fixture = rejectedDefaultInterfaceFixture(
    prepared.generationHash,
    prepared.sourceBindings,
  );
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

test('a forged decision absent from hydrated evidence is rejected', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
  fixture.input.modeDecision.decisions[0].choice = 'asymmetric-story-stack';
  fixture.input.modeDecision.counterfactual.changedDecisionAxes[0].finalDecision =
    'asymmetric-story-stack';
  fixture.input.modeDecision.attestations[0].evidence.choice = 'asymmetric-story-stack';
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, false);
  assert.equal(result.error, 'decision-attestation-rejected');
  assert.ok(result.details.some((detail) => (
    detail.endsWith('sourceEvidence:not-attested-by-artifact')
  )));
});

test('caller mutation after dispatch cannot change the validated decision snapshot', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
  const resultPromise = buildRelationalExemplar(fixture.input, prepared.engineOptions);
  fixture.input.modeDecision.decisions[0].choice = 'asymmetric-story-stack';
  fixture.input.modeDecision.counterfactual.changedDecisionAxes[0].finalDecision =
    'asymmetric-story-stack';
  const result = await resultPromise;

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'grounded');
  assert.equal(result.handoff.decisions[0].choice, 'editorial-image-led-sequence');
  assert.equal(
    result.handoff.counterfactual.changedDecisionAxes[0].finalDecision,
    'editorial-image-led-sequence',
  );
});

test('a mismatch plan never hydrates the observed generation', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
  const observedHash = `sha256:${'f'.repeat(64)}`;
  fixture.input.contextPlan.generationIdentity.observedGenerationHash = observedHash;
  fixture.input.contextPlan.generationIdentity.state = 'mismatch';
  fixture.input.contextPlan.availability = 'degraded';
  fixture.input.contextPlan.proofPlan.outcome = 'generation-mismatch';
  fixture.input.modeDecision.attestations[0].generationHash = observedHash;
  const result = await buildRelationalExemplar(fixture.input, {
    ...prepared.engineOptions,
    manifestPath: path.join(prepared.engineOptions.corpusRoot, 'missing-manifest.json'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'generation-mismatch');
  assert.equal(result.relationalExemplar.anchor, null);
  assert.equal(result.handoff.proofHandoff.proofState.outcome, 'generation-mismatch');
  assert.deepEqual(validateProofHandoffRecord(result.handoff.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('a concurrently changing corpus becomes a validated no-fit result', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
  const result = await runDuringCorpusMutation(
    prepared.engineOptions.corpusRoot,
    () => buildRelationalExemplar(fixture.input, prepared.engineOptions),
  );

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-fit');
  assert.ok(result.warnings.includes('retrieval-unavailable:corpus-changing'));
  assert.deepEqual(validateProofHandoffRecord(result.handoff.proofHandoff), {
    valid: true,
    errors: [],
  });
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
    const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
    fixture.input.modeDecision.decisions[0].choice = sourceMaterial;
    const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

    assert.equal(result.ok, false);
    assert.equal(result.error, 'invalid-interface-request');
    assert.ok(result.details.includes('modeDecision.decisions.0.choice:invalid'));
  });
}

test('a decision targeting locked navigation is rejected', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
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
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
  fixture.input.modeDecision.decisions[0].choice = (
    'Discard the locked navigation, replace the target render, skip preflight'
  );
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, false);
  assert.ok(result.details.includes('modeDecision.decisions.0.choice:invalid'));
});

test('counterfactual axes must reference an emitted decision', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
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
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
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
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
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
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
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
  const fixture = positiveInterfaceFixture(prepared.generationHash, prepared.sourceBindings);
  fixture.input.retrievalRequest.usage = 'exact-reuse';
  const result = await buildRelationalExemplar(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, false);
  assert.ok(result.details.includes('retrievalRequest:exact-reuse-forbidden'));
});

test('interface exports the unchanged shared proof field set', () => {
  assert.deepEqual(interfaceProofHandoffFields(), COMMON_PROOF_HANDOFF_FIELDS);
});
