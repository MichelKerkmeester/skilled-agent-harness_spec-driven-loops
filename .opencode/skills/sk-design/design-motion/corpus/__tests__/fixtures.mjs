// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Motion Corpus Maintainer Fixtures                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import {
  AUTHORITY_ORDER,
  COMMON_PROOF_HANDOFF_FIELDS,
  CORPUS_CONTEXT_PLAN_VERSION,
  CORPUS_EVIDENCE_ALLOWED_USES,
  CORPUS_EVIDENCE_PROHIBITIONS,
  CORPUS_EVIDENCE_SCOPE,
  CORPUS_PROOF_HANDOFF_VERSION,
} from '../../../shared/corpus-context/corpus-context-plan.mjs';
import { STYLE_BETA } from '../../../styles/_engine/__tests__/fixtures.mjs';
import {
  MOTION_EVIDENCE_ELIGIBILITY_VERSION,
  MOTION_SOURCE_ATTESTATION_VERSION,
  MOTION_SOURCE_EVIDENCE_VERSION,
} from '../motion-evidence.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

export const MAINTAINER_FIXTURE_ATLAS = true;

function contextPlan(generationHash) {
  return {
    schemaVersion: CORPUS_CONTEXT_PLAN_VERSION,
    generationIdentity: {
      requestedGenerationHash: generationHash,
      observedGenerationHash: generationHash,
      state: 'current',
    },
    availability: 'ready',
    capabilityPlan: {
      requested: ['relationship-context', 'provenance-context'],
      available: ['relationship-context', 'provenance-context'],
      unavailable: [],
    },
    hydration: { owner: 'selected-mode', hydratedStyleCount: 0 },
    authority: {
      order: [...AUTHORITY_ORDER],
      corpusEvidenceScope: CORPUS_EVIDENCE_SCOPE,
      corpusEvidenceAllowedUses: [...CORPUS_EVIDENCE_ALLOWED_USES],
      corpusEvidenceProhibitions: [...CORPUS_EVIDENCE_PROHIBITIONS],
    },
    proofPlan: {
      outcome: 'positive',
      recordSchemaVersion: CORPUS_PROOF_HANDOFF_VERSION,
      requiredRecordFields: [...COMMON_PROOF_HANDOFF_FIELDS],
      targetChecks: 'required-outside-seam',
    },
  };
}

function authorityInputs() {
  const entries = [
    ['targetInteraction', 'target-interaction', 'a'],
    ['reducedMotion', 'reduced-motion', 'b'],
    ['performanceProof', 'performance-proof', 'c'],
    ['targetMechanism', 'target-mechanism', 'd'],
  ];
  return Object.fromEntries(entries.map(([key, authority, character]) => [key, {
    authority,
    lockId: `${character.repeat(8)}-${character.repeat(4)}-4${character.repeat(3)}-8${character.repeat(3)}-${character.repeat(12)}`,
    contentHash: `sha256:${character.repeat(64)}`,
    state: 'locked',
  }]));
}

export function motionSourceEvidence(overrides = {}) {
  return {
    schemaVersion: MOTION_SOURCE_EVIDENCE_VERSION,
    evidenceId: `sha256:${'9'.repeat(64)}`,
    polarity: 'positive',
    temporalEvidence: 'explicit-temporal',
    purpose: 'orientation',
    stateArchetype: 'absent-to-present',
    constraint: 'transformed-reference-only',
    evidenceLabel: 'declared',
    ...overrides,
  };
}

function candidate(generationHash, binding = {}, evidenceOverrides = {}) {
  const evidence = binding.evidence ?? motionSourceEvidence(evidenceOverrides);
  return {
    sourceId: STYLE_BETA.id,
    attestation: {
      schemaVersion: MOTION_SOURCE_ATTESTATION_VERSION,
      mode: 'motion',
      sourceId: STYLE_BETA.id,
      generationHash,
      contentHash: binding.contentHash ?? `sha256:${'7'.repeat(64)}`,
      artifactPath: binding.artifactPath ?? `${STYLE_BETA.slug}/DESIGN.md`,
      artifactHash: binding.artifactHash ?? `sha256:${'8'.repeat(64)}`,
      evidence,
    },
  };
}

function eligibleInput(generationHash, binding = {}) {
  return {
    contextPlan: contextPlan(generationHash),
    restraintAssessment: {
      frequency: 'occasional',
      input: 'pointer-primary',
      purpose: 'orientation',
      register: 'product',
      targetEvidence: {
        owner: 'target-interaction',
        verdict: 'motion-eligible',
        evidenceId: `sha256:${'e'.repeat(64)}`,
      },
    },
    eligibility: {
      schemaVersion: MOTION_EVIDENCE_ELIGIBILITY_VERSION,
      requestedPurpose: 'orientation',
      requestedArchetype: 'absent-to-present',
      temporalOwnerId: STYLE_BETA.id,
      candidates: [candidate(generationHash, binding)],
    },
    retrievalRequest: { text: 'motion transitions', useFts: false },
    authorityInputs: authorityInputs(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NAMED FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

export function eligibleMotionFixture(generationHash, binding = {}) {
  return { name: 'eligible-motion', input: eligibleInput(generationHash, binding) };
}

export function doNotMoveFixture(generationHash, binding = {}) {
  const input = eligibleInput(generationHash, binding);
  input.restraintAssessment.frequency = 'hundred-plus';
  input.restraintAssessment.input = 'keyboard-primary';
  return { name: 'do-not-move', input };
}

export function hardNegativeMotionFixture(generationHash, binding = {}) {
  const input = eligibleInput(generationHash, binding);
  input.eligibility.candidates = [candidate(generationHash, {}, {
    polarity: 'negative',
    constraint: 'prohibits-motion',
  })];
  return { name: 'hard-negative', input };
}

export function incidentalMotionFixture(generationHash, binding = {}) {
  const input = eligibleInput(generationHash, binding);
  input.eligibility.candidates = [candidate(
    generationHash,
    {},
    { temporalEvidence: 'incidental' },
  )];
  return { name: 'incidental-evidence', input };
}
