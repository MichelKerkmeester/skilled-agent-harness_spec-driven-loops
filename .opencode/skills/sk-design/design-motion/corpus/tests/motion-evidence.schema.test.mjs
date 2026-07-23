// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Motion Evidence Schema Tests                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MOTION_NEGATIVE_BASELINE_VERSION,
  validateMotionEvidenceRequest,
  validateMotionNegativeBaseline,
} from '../motion-evidence.mjs';
import {
  MAINTAINER_FIXTURE_ATLAS,
  eligibleMotionFixture,
} from './fixtures.mjs';

const GENERATION_HASH = `sha256:${'2'.repeat(64)}`;

function negativeBaseline() {
  return {
    schemaVersion: MOTION_NEGATIVE_BASELINE_VERSION,
    kind: 'target-no-motion',
    queryIssued: false,
    targetEvidenceId: `sha256:${'3'.repeat(64)}`,
    affectedStates: ['absent-to-present'],
    preservedFeedback: 'target-feedback-preserved',
    instantEquivalent: 'instant-state-change',
    reducedMotionPath: 'same-instant-equivalent',
    evidenceState: 'accepted-evidence',
  };
}

test('the fixture atlas is maintainer-only', () => {
  assert.equal(MAINTAINER_FIXTURE_ATLAS, true);
});

test('a closed source attestation is a valid request', () => {
  const fixture = eligibleMotionFixture(GENERATION_HASH);

  assert.deepEqual(validateMotionEvidenceRequest(fixture.input), {
    valid: true,
    errors: [],
  });
});

test('candidate claims outside the selected-mode attestation are rejected', () => {
  const fixture = eligibleMotionFixture(GENERATION_HASH);
  fixture.input.eligibility.candidates[0].polarity = 'positive';
  fixture.input.eligibility.candidates[0].temporalEvidence = 'explicit-temporal';
  fixture.input.eligibility.candidates[0].purpose = 'orientation';
  const validation = validateMotionEvidenceRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('eligibility.candidates.0.polarity:unexpected'));
  assert.ok(validation.errors.includes(
    'eligibility.candidates.0.temporalEvidence:unexpected',
  ));
  assert.ok(validation.errors.includes('eligibility.candidates.0.purpose:unexpected'));
});

test('an attestation must bind to the context generation', () => {
  const fixture = eligibleMotionFixture(GENERATION_HASH);
  fixture.input.eligibility.candidates[0].attestation.generationHash =
    `sha256:${'4'.repeat(64)}`;
  const validation = validateMotionEvidenceRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'eligibility.candidates.0.attestation.generationHash:context-mismatch',
  ));
});

test('a corpus candidate attempting authority is structurally rejected', () => {
  const fixture = eligibleMotionFixture(GENERATION_HASH);
  fixture.input.eligibility.candidates[0].severity = 'blocker';
  const validation = validateMotionEvidenceRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('eligibility.candidates.0.severity:unexpected'));
});

test('source timing and choreography literals have no input channel', () => {
  const fixture = eligibleMotionFixture(GENERATION_HASH);
  fixture.input.eligibility.candidates[0].attestation.evidence.duration = '300ms';
  fixture.input.eligibility.candidates[0].attestation.evidence.easing = 'spring(1, 2, 3)';
  const validation = validateMotionEvidenceRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'eligibility.candidates.0.attestation.evidence.duration:unexpected',
  ));
  assert.ok(validation.errors.includes(
    'eligibility.candidates.0.attestation.evidence.easing:unexpected',
  ));
});

test('reduced-motion, performance, and mechanism locks cannot be claimed by evidence', () => {
  const fixture = eligibleMotionFixture(GENERATION_HASH);
  fixture.input.eligibility.performanceProof = 'passed';
  const validation = validateMotionEvidenceRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('eligibility.performanceProof:unexpected'));
});

test('a complete negative baseline validates', () => {
  assert.deepEqual(validateMotionNegativeBaseline(negativeBaseline()), {
    valid: true,
    errors: [],
  });
});

for (const field of [
  'targetEvidenceId',
  'affectedStates',
  'preservedFeedback',
  'instantEquivalent',
  'reducedMotionPath',
]) {
  test(`a negative baseline missing ${field} is rejected`, () => {
    const baseline = negativeBaseline();
    delete baseline[field];
    const validation = validateMotionNegativeBaseline(baseline);

    assert.equal(validation.valid, false);
    assert.ok(validation.errors.includes(`negativeBaseline.${field}:required`));
  });
}
