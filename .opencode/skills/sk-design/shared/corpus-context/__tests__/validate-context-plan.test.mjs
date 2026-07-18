// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Corpus Context Plan Validator Tests                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AUTHORITY_ORDER,
  COMMON_PROOF_HANDOFF_FIELD_DEFINITIONS,
  COMMON_PROOF_HANDOFF_FIELDS,
  CORPUS_EVIDENCE_PROHIBITIONS,
} from '../corpus-context-plan.mjs';
import {
  validateCorpusContextFixture,
  validateCorpusContextPlan,
  validateProofHandoffRecord,
} from '../validate-context-plan.mjs';
import {
  GENERATION_MISMATCH_FIXTURE,
  NO_FIT_FIXTURE,
  POSITIVE_FIXTURE,
  SHARED_FIXTURES,
  UNAVAILABLE_FIXTURE,
  UNKNOWN_RIGHTS_FIXTURE,
} from './fixtures.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

for (const fixture of SHARED_FIXTURES) {
  test(`${fixture.name} fixture is valid evidence`, () => {
    assert.deepEqual(validateCorpusContextFixture(fixture), { valid: true, errors: [] });
  });
}

test('the five required shared fixtures are present', () => {
  assert.deepEqual(
    SHARED_FIXTURES.map((fixture) => fixture.name),
    ['positive', 'no-fit', 'unavailable', 'generation-mismatch', 'unknown-rights'],
  );
});

test('the envelope validates with zero hydrated styles', () => {
  assert.equal(POSITIVE_FIXTURE.plan.hydration.hydratedStyleCount, 0);
  assert.deepEqual(validateCorpusContextPlan(POSITIVE_FIXTURE.plan), {
    valid: true,
    errors: [],
  });
});

test('all records reuse the single seven-field definition', () => {
  assert.equal(COMMON_PROOF_HANDOFF_FIELDS.length, 7);
  assert.deepEqual(
    COMMON_PROOF_HANDOFF_FIELDS,
    Object.keys(COMMON_PROOF_HANDOFF_FIELD_DEFINITIONS),
  );
  for (const fixture of SHARED_FIXTURES) {
    assert.deepEqual(Object.keys(fixture.proofHandoff), COMMON_PROOF_HANDOFF_FIELDS);
    assert.deepEqual(validateProofHandoffRecord(fixture.proofHandoff), {
      valid: true,
      errors: [],
    });
  }
});

test('the fixed authority order and six corpus prohibitions are exact', () => {
  const expectedAuthorityOrder = [
    'user-brief-and-owned-system',
    'selected-mode-judgment',
    'target-evidence-and-deterministic-checks',
    'corpus-reference-evidence',
    'transport-output',
  ];
  const expectedProhibitions = [
    'select-mode',
    'prove-accessibility-or-performance',
    'assign-severity',
    'establish-copying',
    'authorize-exact-reuse',
    'accept-transport-output',
  ];

  assert.deepEqual(AUTHORITY_ORDER, expectedAuthorityOrder);
  assert.deepEqual(POSITIVE_FIXTURE.plan.authority.order, expectedAuthorityOrder);
  assert.deepEqual(CORPUS_EVIDENCE_PROHIBITIONS, expectedProhibitions);
  assert.deepEqual(
    POSITIVE_FIXTURE.plan.authority.corpusEvidenceProhibitions,
    expectedProhibitions,
  );
  assert.equal(POSITIVE_FIXTURE.plan.authority.corpusEvidenceScope, 'advisory-only');
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. BOUNDARY REJECTION
// ─────────────────────────────────────────────────────────────────────────────

test('mode selection and mode decisions are rejected from the neutral plan', () => {
  const plan = structuredClone(POSITIVE_FIXTURE.plan);
  plan.selectedMode = 'interface';
  plan.modeDecision = { selectedReferences: ['style-positive'] };
  const validation = validateCorpusContextPlan(plan);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('plan.selectedMode:unexpected'));
  assert.ok(validation.errors.includes('plan.modeDecision:unexpected'));
});

test('hydrated styles are rejected even when their count claims zero', () => {
  const plan = structuredClone(POSITIVE_FIXTURE.plan);
  plan.hydration.hydratedStyles = [];
  const validation = validateCorpusContextPlan(plan);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('plan.hydration.hydratedStyles:unexpected'));
});

test('a nonzero hydration count is rejected', () => {
  const plan = structuredClone(POSITIVE_FIXTURE.plan);
  plan.hydration.hydratedStyleCount = 1;
  const validation = validateCorpusContextPlan(plan);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('plan.hydration.hydratedStyleCount:must-be-zero'));
});

test('raw CSS cannot masquerade as a capability', () => {
  const plan = structuredClone(POSITIVE_FIXTURE.plan);
  plan.capabilityPlan.requested = ['body{color:#ff0000; margin:12px; rgb(1,2,3)}'];
  const validation = validateCorpusContextPlan(plan);

  assert.equal(validation.valid, false);
  assert.ok(
    validation.errors.includes('plan.capabilityPlan.requested:style-payload-forbidden'),
  );
  assert.ok(validation.errors.includes('plan.capabilityPlan.requested:invalid-capability'));
});

test('an unknown kebab-case capability is rejected by the closed vocabulary', () => {
  const plan = structuredClone(POSITIVE_FIXTURE.plan);
  plan.capabilityPlan.requested = ['invented-neutral-capability'];
  const validation = validateCorpusContextPlan(plan);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('plan.capabilityPlan.requested:invalid-capability'));
});

test('the corpus evidence scope cannot be promoted above advisory-only', () => {
  const plan = structuredClone(POSITIVE_FIXTURE.plan);
  plan.authority.corpusEvidenceScope = 'authoritative';
  const validation = validateCorpusContextPlan(plan);

  assert.equal(validation.valid, false);
  assert.ok(
    validation.errors.includes('plan.authority.corpusEvidenceScope:must-be-advisory-only'),
  );
});

test('an inherited neutrality field is rejected with its non-plain object', () => {
  const plan = structuredClone(POSITIVE_FIXTURE.plan);
  Object.setPrototypeOf(plan.hydration, { hydratedStyles: ['body{color:red}'] });
  const validation = validateCorpusContextPlan(plan);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('plan.hydration:required-object'));
});

test('a non-enumerable neutrality field is rejected', () => {
  const plan = structuredClone(POSITIVE_FIXTURE.plan);
  Object.defineProperty(plan, 'selectedMode', {
    configurable: true,
    enumerable: false,
    value: 'interface',
  });
  const validation = validateCorpusContextPlan(plan);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('plan.selectedMode:unexpected'));
});

test('a symbol neutrality field is rejected', () => {
  const plan = structuredClone(POSITIVE_FIXTURE.plan);
  plan[Symbol('selectedMode')] = 'interface';
  const validation = validateCorpusContextPlan(plan);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('plan.[Symbol(selectedMode)]:unexpected'));
});

test('a severity or priority rating is rejected from the neutral record', () => {
  const record = structuredClone(POSITIVE_FIXTURE.proofHandoff);
  record.semanticRole.PriorityRating = 'P0';
  record.semanticRole.role = 'P0';
  const validation = validateProofHandoffRecord(record);

  assert.equal(validation.valid, false);
  assert.ok(
    validation.errors.includes(
      'proofHandoff.semanticRole.PriorityRating:prohibited-authority-claim:severity-or-priority',
    ),
  );
  assert.ok(validation.errors.includes('proofHandoff.semanticRole.role:invalid'));
});

test('an accessibility or performance proof claim is rejected from the neutral record', () => {
  const record = structuredClone(POSITIVE_FIXTURE.proofHandoff);
  record.proofState.ACCESSIBILITY_PROOF = 'PASS';
  record.transformation.summary = 'Accessibility proof passed for this target.';
  const validation = validateProofHandoffRecord(record);

  assert.equal(validation.valid, false);
  assert.ok(
    validation.errors.includes(
      'proofHandoff.proofState.ACCESSIBILITY_PROOF:prohibited-authority-claim:accessibility-or-performance-proof',
    ),
  );
  assert.ok(
    validation.errors.includes(
      'proofHandoff.transformation.summary:prohibited-authority-claim:accessibility-or-performance-proof',
    ),
  );
});

test('a mode selection or decision is rejected from the neutral record', () => {
  const record = structuredClone(POSITIVE_FIXTURE.proofHandoff);
  record.semanticRole.modeSelection = 'interface';
  record.semanticRole.dimensions = ['mode selected: interface'];
  const validation = validateProofHandoffRecord(record);

  assert.equal(validation.valid, false);
  assert.ok(
    validation.errors.includes(
      'proofHandoff.semanticRole.modeSelection:prohibited-authority-claim:mode-selection',
    ),
  );
  assert.ok(
    validation.errors.includes(
      'proofHandoff.semanticRole.dimensions.0:prohibited-authority-claim:mode-selection',
    ),
  );
});

test('a copying or plagiarism determination is rejected from the neutral record', () => {
  const record = structuredClone(POSITIVE_FIXTURE.proofHandoff);
  record.transformation.PlagiarismDetermination = 'confirmed';
  record.transformation.summary = 'Plagiarism was confirmed by corpus evidence.';
  const validation = validateProofHandoffRecord(record);

  assert.equal(validation.valid, false);
  assert.ok(
    validation.errors.includes(
      'proofHandoff.transformation.PlagiarismDetermination:'
        + 'prohibited-authority-claim:copying-or-plagiarism-determination',
    ),
  );
  assert.ok(
    validation.errors.includes(
      'proofHandoff.transformation.summary:prohibited-authority-claim:copying-or-plagiarism-determination',
    ),
  );
});

test('an exact-reuse authorization is rejected from the neutral record', () => {
  const record = structuredClone(POSITIVE_FIXTURE.proofHandoff);
  record.transformation.exactReuseAuthorization = true;
  record.transformation.summary = 'Exact reuse is authorized for this target.';
  const validation = validateProofHandoffRecord(record);

  assert.equal(validation.valid, false);
  assert.ok(
    validation.errors.includes(
      'proofHandoff.transformation.exactReuseAuthorization:prohibited-authority-claim:exact-reuse-authorization',
    ),
  );
  assert.ok(
    validation.errors.includes(
      'proofHandoff.transformation.summary:prohibited-authority-claim:exact-reuse-authorization',
    ),
  );
});

test('a transport-output acceptance is rejected from the neutral record', () => {
  const record = structuredClone(POSITIVE_FIXTURE.proofHandoff);
  record.proofState.TransportOutputAcceptance = 'accepted';
  record.transformation.summary = 'Transport output was accepted for delivery.';
  const validation = validateProofHandoffRecord(record);

  assert.equal(validation.valid, false);
  assert.ok(
    validation.errors.includes(
      'proofHandoff.proofState.TransportOutputAcceptance:prohibited-authority-claim:transport-output-acceptance',
    ),
  );
  assert.ok(
    validation.errors.includes(
      'proofHandoff.transformation.summary:prohibited-authority-claim:transport-output-acceptance',
    ),
  );
});

test('authority changes and corpus-ready claims are rejected', () => {
  const plan = structuredClone(POSITIVE_FIXTURE.plan);
  plan.authority.order.reverse();
  plan.authority.corpusEvidenceProhibitions.pop();
  plan.proofPlan.targetChecks = 'complete';
  const validation = validateCorpusContextPlan(plan);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('plan.authority.order:fixed-order-required'));
  assert.ok(
    validation.errors.includes(
      'plan.authority.corpusEvidenceProhibitions:fixed-order-required',
    ),
  );
  assert.ok(validation.errors.includes('plan.proofPlan.targetChecks:must-remain-external'));
});

test('negative outcomes remain accepted evidence rather than validation errors', () => {
  for (const fixture of [
    NO_FIT_FIXTURE,
    UNAVAILABLE_FIXTURE,
    GENERATION_MISMATCH_FIXTURE,
    UNKNOWN_RIGHTS_FIXTURE,
  ]) {
    assert.equal(fixture.proofHandoff.proofState.status, 'accepted-evidence');
    assert.equal(validateCorpusContextFixture(fixture).valid, true);
  }
});

test('generation mismatch cannot retain a selected source', () => {
  const record = structuredClone(GENERATION_MISMATCH_FIXTURE.proofHandoff);
  record.sourceIdentity = structuredClone(POSITIVE_FIXTURE.proofHandoff.sourceIdentity);
  const validation = validateProofHandoffRecord(record);

  assert.equal(validation.valid, false);
  assert.ok(
    validation.errors.includes(
      'proofHandoff.sourceIdentity:must-be-null-for-negative-outcome',
    ),
  );
});

test('unknown rights cannot be relabeled as reusable evidence', () => {
  const record = structuredClone(UNKNOWN_RIGHTS_FIXTURE.proofHandoff);
  record.provenanceUseLabel.rightsKnown = true;
  record.provenanceUseLabel.useLabel = 'reference-only';
  const validation = validateProofHandoffRecord(record);

  assert.equal(validation.valid, false);
  assert.ok(
    validation.errors.includes('proofHandoff.provenanceUseLabel.rightsKnown:must-be-false'),
  );
  assert.ok(
    validation.errors.includes(
      'proofHandoff.provenanceUseLabel.useLabel:rights-unknown-required',
    ),
  );
});
