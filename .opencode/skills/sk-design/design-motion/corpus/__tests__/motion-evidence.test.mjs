// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Motion Corpus Evidence Tests                                            ║
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
import {
  STYLE_BETA,
  appendDesignText,
  createFixtureCorpus,
} from '../../../styles/_engine/__tests__/fixtures.mjs';
import {
  buildMotionEvidencePlan,
  motionProofHandoffFields,
} from '../motion-evidence.mjs';
import {
  doNotMoveFixture,
  eligibleMotionFixture,
  hardNegativeMotionFixture,
  incidentalMotionFixture,
  motionSourceEvidence,
} from './fixtures.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function preparedCorpus(context, sourceEvidence = motionSourceEvidence()) {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  await appendDesignText(
    fixture.root,
    STYLE_BETA.slug,
    `\`\`\`motion-evidence\n${JSON.stringify(sourceEvidence)}\n\`\`\``,
  );
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  const manifest = await loadManifest(manifestPath);
  const style = manifest.styles.find((candidate) => candidate.id === STYLE_BETA.id);
  const artifact = style.artifacts.find((candidate) => (
    candidate.path === `${STYLE_BETA.slug}/DESIGN.md`
  ));
  return {
    generationHash: manifest.generationHash,
    engineOptions: { corpusRoot: fixture.root, manifestPath },
    sourceBinding: {
      contentHash: style.contentHash,
      artifactPath: artifact.path,
      artifactHash: artifact.sha256,
      evidence: sourceEvidence,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('the restraint gate answers do not move before retrieval', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = doNotMoveFixture(prepared.generationHash, prepared.sourceBinding);
  const result = await buildMotionEvidencePlan(fixture.input, {
    ...prepared.engineOptions,
    manifestPath: path.join(prepared.engineOptions.corpusRoot, 'missing.json'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'do-not-move');
  assert.equal(result.restraintGate.verdict, 'do-not-move');
  assert.equal(result.restraintGate.queryIssued, false);
  assert.equal(result.negativeBaseline.kind, 'target-no-motion');
  assert.equal(result.negativeBaseline.instantEquivalent, 'instant-state-change');
  assert.equal(
    result.negativeBaseline.targetEvidenceId,
    fixture.input.restraintAssessment.targetEvidence.evidenceId,
  );
  assert.deepEqual(result.negativeBaseline.affectedStates, ['absent-to-present']);
  assert.equal(result.negativeBaseline.preservedFeedback, 'target-feedback-preserved');
  assert.equal(result.negativeBaseline.reducedMotionPath, 'same-instant-equivalent');
  assert.equal(result.proofHandoff.proofState.status, 'accepted-evidence');
});

test('eligible purpose and state select one temporal owner with provenance', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = eligibleMotionFixture(prepared.generationHash, prepared.sourceBinding);
  const authorityBefore = structuredClone(fixture.input.authorityInputs);
  const result = await buildMotionEvidencePlan(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'temporal-reference');
  assert.equal(result.restraintGate.queryIssued, true);
  assert.equal(result.temporalOwner.role, 'temporal-owner');
  assert.equal(result.temporalOwner.purpose, 'orientation');
  assert.equal(result.temporalOwner.stateArchetype, 'absent-to-present');
  assert.ok(result.temporalOwner.contentHash);
  assert.ok(result.temporalOwner.provenanceUseLabel);
  assert.equal(typeof result.temporalOwner.provenanceUseLabel.rightsKnown, 'boolean');
  assert.equal(result.averagedTimingValues, false);
  assert.equal(result.copiedSourceSpecificMaterial, false);
  assert.equal(result.authorityPreservation.allPreserved, true);
  assert.deepEqual(fixture.input.authorityInputs, authorityBefore);
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('a hard negative is valid negative evidence and never retrieves', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = hardNegativeMotionFixture(prepared.generationHash);
  const result = await buildMotionEvidencePlan(fixture.input, {
    ...prepared.engineOptions,
    manifestPath: path.join(prepared.engineOptions.corpusRoot, 'missing.json'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-temporal-authority');
  assert.equal(result.negativeBaseline.kind, 'hard-negative-rejection');
  assert.equal(result.negativeBaseline.queryIssued, false);
  assert.equal(result.temporalOwner, null);
  assert.equal(result.rejectedCandidateCount, 1);
  assert.equal(result.hardNegativeCount, 1);
});

test('incidental vocabulary cannot become temporal authority', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = incidentalMotionFixture(prepared.generationHash);
  const result = await buildMotionEvidencePlan(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-temporal-authority');
  assert.equal(result.negativeBaseline.kind, 'no-corpus-temporal-authority');
  assert.equal(result.negativeBaseline.queryIssued, false);
});

test('a relabeled incidental source is rejected after hydration', async (context) => {
  const incidentalEvidence = motionSourceEvidence({ temporalEvidence: 'incidental' });
  const prepared = await preparedCorpus(context, incidentalEvidence);
  const relabeledEvidence = motionSourceEvidence({ temporalEvidence: 'explicit-temporal' });
  const fixture = eligibleMotionFixture(prepared.generationHash, {
    ...prepared.sourceBinding,
    evidence: relabeledEvidence,
  });
  const result = await buildMotionEvidencePlan(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-temporal-authority');
  assert.equal(result.negativeBaseline.kind, 'unattested-source-rejection');
  assert.equal(result.restraintGate.queryIssued, true);
  assert.ok(result.warnings.includes(
    'source-attestation-rejected:sourceEvidence:not-attested-by-artifact',
  ));
});

test('a candidate with an unbound content hash is rejected after hydration', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = eligibleMotionFixture(prepared.generationHash, prepared.sourceBinding);
  fixture.input.eligibility.candidates[0].attestation.contentHash =
    `sha256:${'6'.repeat(64)}`;
  const result = await buildMotionEvidencePlan(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-temporal-authority');
  assert.equal(result.negativeBaseline.kind, 'unattested-source-rejection');
  assert.ok(result.warnings.includes(
    'source-attestation-rejected:contentHash:card-mismatch',
  ));
});

test('missing corpus data yields a validated negative outcome instead of throwing', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = eligibleMotionFixture(prepared.generationHash, prepared.sourceBinding);
  const result = await buildMotionEvidencePlan(fixture.input, {
    ...prepared.engineOptions,
    manifestPath: path.join(prepared.engineOptions.corpusRoot, 'missing.json'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-temporal-authority');
  assert.equal(result.negativeBaseline.kind, 'corpus-unavailable');
  assert.equal(result.negativeBaseline.queryIssued, true);
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('motion exports the unchanged shared proof field set', () => {
  assert.deepEqual(motionProofHandoffFields(), COMMON_PROOF_HANDOFF_FIELDS);
});
