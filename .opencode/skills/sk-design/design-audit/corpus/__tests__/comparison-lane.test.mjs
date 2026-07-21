// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Audit Corpus Comparison Lane Tests                                      ║
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
  auditProofHandoffFields,
  buildAuditComparisonLane,
  validateAuditComparisonRequest,
} from '../comparison-lane.mjs';
import {
  MAINTAINER_FIXTURE_ATLAS,
  auditComparisonAttestation,
  auditComparisonEvidence,
  comparisonUnavailableFixture,
  intendedAnchorDriftFixture,
} from './fixtures.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function preparedCorpus(context) {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const evidenceById = {
    [STYLE_ALPHA.id]: auditComparisonEvidence(),
    [STYLE_BETA.id]: auditComparisonEvidence({
      comparisonId: STYLE_BETA.id,
      purpose: 'contextual-relationship',
      relation: 'intentional-delta',
      axisObservations: [{
        axis: 'content-hierarchy',
        state: 'intentional-delta',
      }],
    }),
  };
  await Promise.all([STYLE_ALPHA, STYLE_BETA].map((style) => appendDesignText(
    fixture.root,
    style.slug,
    `\`\`\`audit-comparison-evidence\n${JSON.stringify(evidenceById[style.id])}\n\`\`\``,
  )));
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  const manifest = await loadManifest(manifestPath);
  return {
    generationHash: manifest.generationHash,
    contentHashes: Object.fromEntries(
      manifest.styles.map((style) => [style.id, style.contentHash]),
    ),
    sourceBindings: Object.fromEntries(manifest.styles.map((style) => {
      const artifact = style.artifacts.find((candidate) => (
        candidate.path === `${style.slug}/DESIGN.md`
      ));
      return [style.id, {
        contentHash: style.contentHash,
        artifactPath: artifact.path,
        artifactHash: artifact.sha256,
        evidence: evidenceById[style.id],
      }];
    })),
    engineOptions: { corpusRoot: fixture.root, manifestPath },
  };
}

function driftFixture(prepared) {
  return intendedAnchorDriftFixture(
    prepared.generationHash,
    prepared.contentHashes[STYLE_ALPHA.id],
    prepared.sourceBindings[STYLE_ALPHA.id],
  );
}

function outputHasVerdictField(value) {
  if (value === null || typeof value !== 'object') return false;
  for (const key of Reflect.ownKeys(value)) {
    if (
      /severity|priority|score|wcag|accessibilityProof|performanceProof|copying|fixOwner|exactReuse/i
        .test(String(key))
    ) {
      return true;
    }
    if (outputHasVerdictField(value[key])) return true;
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

test('intended-anchor drift remains labelled comparison context', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  const authorityBefore = structuredClone(fixture.input.authorityInputs);
  const result = await buildAuditComparisonLane(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'comparison-context');
  assert.equal(result.comparisons.length, 1);
  assert.equal(result.comparisons[0].relation, 'unexplained-drift');
  assert.equal(result.comparisons[0].evidenceLabel, 'non-authoritative-context');
  assert.equal(result.comparisons[0].targetEvidenceRequired, true);
  assert.equal(result.authority.corpusRole, 'non-authoritative-context');
  assert.equal(outputHasVerdictField(result), false);
  assert.deepEqual(fixture.input.authorityInputs, authorityBefore);
  assert.deepEqual(
    Object.keys(result.proofHandoffs[0]),
    COMMON_PROOF_HANDOFF_FIELDS,
  );
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoffs[0]), {
    valid: true,
    errors: [],
  });

  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes('Warm cream serif typography'), false);
  assert.equal(serialized.includes('#ffffff'), false);
});

test('comparison unavailable is accepted evidence and target audit continues', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = comparisonUnavailableFixture(prepared.generationHash);
  const result = await buildAuditComparisonLane(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'comparison-unavailable');
  assert.equal(result.comparisons[0].reference, null);
  assert.equal(result.comparisons[0].relation, 'comparison-unavailable');
  assert.equal(result.proofHandoffs[0].proofState.outcome, 'no-fit');
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoffs[0]), {
    valid: true,
    errors: [],
  });
});

test('two selected references remain bounded non-authoritative context', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  const secondComparison = structuredClone(fixture.input.comparisons[0]);
  secondComparison.id = STYLE_BETA.id;
  secondComparison.relation = 'intentional-delta';
  secondComparison.purpose = 'contextual-relationship';
  secondComparison.intendedAnchor = null;
  secondComparison.axisObservations[0].state = 'intentional-delta';
  secondComparison.attestation = auditComparisonAttestation(
    prepared.generationHash,
    STYLE_BETA.id,
    prepared.sourceBindings[STYLE_BETA.id],
  );
  fixture.input.comparisons.push(secondComparison);
  const result = await buildAuditComparisonLane(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.comparisons.length, 2);
  assert.equal(result.proofHandoffs.length, 2);
  assert.ok(result.comparisons.every(
    (comparison) => comparison.evidenceLabel === 'non-authoritative-context',
  ));
  assert.ok(result.comparisons.every(
    (comparison) => (
      comparison.reference.sourceId
      && comparison.reference.contentHash
      && ['known', 'unknown'].includes(comparison.reference.rightsState)
    ),
  ));
});

test('a forged comparison absent from hydrated evidence is rejected', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  const comparison = fixture.input.comparisons[0];
  comparison.purpose = 'contextual-relationship';
  comparison.relation = 'intentional-delta';
  comparison.axisObservations[0].state = 'intentional-delta';
  comparison.attestation.evidence.purpose = 'contextual-relationship';
  comparison.attestation.evidence.relation = 'intentional-delta';
  comparison.attestation.evidence.axisObservations[0].state = 'intentional-delta';
  const result = await buildAuditComparisonLane(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, false);
  assert.equal(result.error, 'comparison-attestation-rejected');
  assert.ok(result.details.includes('sourceEvidence:not-attested-by-artifact'));
});

test('a mismatch plan never hydrates the observed generation', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  const observedHash = `sha256:${'f'.repeat(64)}`;
  fixture.input.contextPlan.generationIdentity.observedGenerationHash = observedHash;
  fixture.input.contextPlan.generationIdentity.state = 'mismatch';
  fixture.input.contextPlan.availability = 'degraded';
  fixture.input.contextPlan.proofPlan.outcome = 'generation-mismatch';
  fixture.input.comparisons[0].attestation.generationHash = observedHash;
  const result = await buildAuditComparisonLane(fixture.input, {
    ...prepared.engineOptions,
    manifestPath: path.join(prepared.engineOptions.corpusRoot, 'missing.json'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'comparison-unavailable');
  assert.equal(result.proofHandoffs[0].proofState.outcome, 'generation-mismatch');
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoffs[0]), {
    valid: true,
    errors: [],
  });
});

test('a concurrently changing corpus becomes validated unavailable context', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  const result = await runDuringCorpusMutation(
    prepared.engineOptions.corpusRoot,
    () => buildAuditComparisonLane(fixture.input, prepared.engineOptions),
  );

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'comparison-unavailable');
  assert.ok(result.warnings.includes('retrieval-unavailable:corpus-changing'));
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoffs[0]), {
    valid: true,
    errors: [],
  });
});

test('a verdict and severity claim in an allowed value slot is rejected', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  fixture.input.comparisons[0].purpose = 'P1 blocker, WCAG fail, reuse exactly';
  const validation = validateAuditComparisonRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('comparisons.0.purpose:invalid'));
});

test('a free-text claim field is rejected by the closed comparison shape', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  fixture.input.comparisons[0].note = 'P1 blocker, WCAG fail, reuse exactly';
  const validation = validateAuditComparisonRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('comparisons.0.note:unexpected'));
});

for (const [name, value] of [
  ['select a mode', 'mode selected: foundations'],
  ['prove performance', 'performance passed'],
  ['determine copying', 'copying confirmed'],
  ['authorize exact reuse', 'reuse exactly'],
  ['own a fix', 'remediation owner: design-audit'],
]) {
  test(`a comparison value attempting to ${name} is rejected`, async (context) => {
    const prepared = await preparedCorpus(context);
    const fixture = driftFixture(prepared);
    fixture.input.comparisons[0].purpose = value;
    const validation = validateAuditComparisonRequest(fixture.input);

    assert.equal(validation.valid, false);
    assert.ok(validation.errors.includes('comparisons.0.purpose:invalid'));
  });
}

test('a self-asserted intended anchor without identity is rejected', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  fixture.input.comparisons[0].intendedAnchor = true;
  const validation = validateAuditComparisonRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('comparisons.0.intendedAnchor:required-object'));
  assert.ok(validation.errors.includes('comparisons.0:drift-requires-verified-intended-anchor'));
});

test('drift identity must exactly match the owned anchor and selected card', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  fixture.input.comparisons[0].intendedAnchor = {
    ...fixture.input.comparisons[0].intendedAnchor,
    contentHash: `sha256:${'f'.repeat(64)}`,
  };
  const validation = validateAuditComparisonRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('comparisons.0:intended-anchor-identity-mismatch'));
});

test('drift without target evidence is rejected', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  fixture.input.comparisons[0].targetEvidence = [];
  const validation = validateAuditComparisonRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('comparisons.0:drift-requires-target-evidence'));
});

test('more than two comparison references is rejected', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  fixture.input.comparisons.push(
    structuredClone(fixture.input.comparisons[0]),
    structuredClone(fixture.input.comparisons[0]),
  );
  const validation = validateAuditComparisonRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('comparisons:maximum-two'));
});

test('missing retrieval manifest yields comparison-unavailable instead of throwing', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  const result = await buildAuditComparisonLane(fixture.input, {
    ...prepared.engineOptions,
    manifestPath: path.join(prepared.engineOptions.corpusRoot, 'missing-manifest.json'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'comparison-unavailable');
  assert.equal(result.comparisons[0].reference, null);
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoffs[0]), {
    valid: true,
    errors: [],
  });
});

test('stale retrieval manifest yields comparison-unavailable instead of throwing', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = driftFixture(prepared);
  await appendFile(
    path.join(prepared.engineOptions.corpusRoot, 'alpha', 'DESIGN.md'),
    '\nStale manifest probe.\n',
  );
  const result = await buildAuditComparisonLane(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'comparison-unavailable');
  assert.ok(result.warnings.includes('retrieval-unavailable:manifest-stale'));
});

test('audit exports the unchanged shared proof field set', () => {
  assert.deepEqual(auditProofHandoffFields(), COMMON_PROOF_HANDOFF_FIELDS);
});
