// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Corpus Context Shared Fixtures                                           ║
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
} from '../corpus-context-plan.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

const GENERATION_A = `sha256:${'a'.repeat(64)}`;
const GENERATION_B = `sha256:${'b'.repeat(64)}`;
const CONTENT_A = `sha256:${'c'.repeat(64)}`;

function generationIdentity(state, requestedGenerationHash, observedGenerationHash) {
  return { requestedGenerationHash, observedGenerationHash, state };
}

function plan(outcome, generation, availability, availableCapabilities = []) {
  return {
    schemaVersion: CORPUS_CONTEXT_PLAN_VERSION,
    generationIdentity: generation,
    availability,
    capabilityPlan: {
      requested: ['coherent-reference'],
      available: availableCapabilities,
      unavailable: availability === 'unavailable' ? ['coherent-reference'] : [],
    },
    hydration: {
      owner: 'selected-mode',
      hydratedStyleCount: 0,
    },
    authority: {
      order: [...AUTHORITY_ORDER],
      corpusEvidenceScope: CORPUS_EVIDENCE_SCOPE,
      corpusEvidenceAllowedUses: [...CORPUS_EVIDENCE_ALLOWED_USES],
      corpusEvidenceProhibitions: [...CORPUS_EVIDENCE_PROHIBITIONS],
    },
    proofPlan: {
      outcome,
      recordSchemaVersion: CORPUS_PROOF_HANDOFF_VERSION,
      requiredRecordFields: [...COMMON_PROOF_HANDOFF_FIELDS],
      targetChecks: 'required-outside-seam',
    },
  };
}

function unusedProvenance(status = 'unknown', useLabel = 'not-used') {
  return {
    status,
    sourceUrl: null,
    licenseStatus: 'not-applicable',
    rightsKnown: false,
    useLabel,
  };
}

function negativeRecord(generation, outcome, fallbackState, reason) {
  return {
    generationIdentity: generation,
    sourceIdentity: null,
    provenanceUseLabel: unusedProvenance(
      outcome === 'unavailable' ? 'unavailable' : 'unknown',
      outcome === 'unavailable' ? 'unavailable' : 'not-used',
    ),
    semanticRole: { role: 'none', dimensions: [] },
    transformation: {
      state: 'not-applicable',
      summary: 'no-source-influence',
      copiedSourceSpecificMaterial: false,
    },
    fallback: { state: fallbackState, reason },
    proofState: { outcome, status: 'accepted-evidence', targetChecks: 'not-assessed' },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SHARED FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const CURRENT_GENERATION = generationIdentity('current', GENERATION_A, GENERATION_A);

export const POSITIVE_FIXTURE = Object.freeze({
  name: 'positive',
  plan: plan('positive', CURRENT_GENERATION, 'ready', ['coherent-reference']),
  proofHandoff: {
    generationIdentity: CURRENT_GENERATION,
    sourceIdentity: {
      sourceId: 'style-positive',
      contentHash: CONTENT_A,
      sourceUrl: 'https://styles.example.test/style-positive',
    },
    provenanceUseLabel: {
      status: 'known',
      sourceUrl: 'https://styles.example.test/style-positive',
      licenseStatus: 'known',
      rightsKnown: true,
      useLabel: 'transformed-reference',
    },
    semanticRole: { role: 'reference', dimensions: ['relationship', 'rationale'] },
    transformation: {
      state: 'transformed',
      summary: 'transformed-reference',
      copiedSourceSpecificMaterial: false,
    },
    fallback: { state: 'not-needed', reason: 'bounded-reference-fit' },
    proofState: { outcome: 'positive', status: 'accepted-evidence', targetChecks: 'not-assessed' },
  },
});

export const NO_FIT_FIXTURE = Object.freeze({
  name: 'no-fit',
  plan: plan('no-fit', CURRENT_GENERATION, 'ready', ['coherent-reference']),
  proofHandoff: negativeRecord(
    CURRENT_GENERATION,
    'no-fit',
    'target-derived',
    'target-derived-no-fit',
  ),
});

const UNAVAILABLE_GENERATION = generationIdentity('unavailable', GENERATION_A, null);

export const UNAVAILABLE_FIXTURE = Object.freeze({
  name: 'unavailable',
  plan: plan('unavailable', UNAVAILABLE_GENERATION, 'unavailable'),
  proofHandoff: negativeRecord(
    UNAVAILABLE_GENERATION,
    'unavailable',
    'ordinary-workflow',
    'ordinary-workflow-unavailable',
  ),
});

const MISMATCHED_GENERATION = generationIdentity('mismatch', GENERATION_A, GENERATION_B);

export const GENERATION_MISMATCH_FIXTURE = Object.freeze({
  name: 'generation-mismatch',
  plan: plan('generation-mismatch', MISMATCHED_GENERATION, 'degraded'),
  proofHandoff: negativeRecord(
    MISMATCHED_GENERATION,
    'generation-mismatch',
    'requery-required',
    'requery-generation-mismatch',
  ),
});

export const UNKNOWN_RIGHTS_FIXTURE = Object.freeze({
  name: 'unknown-rights',
  plan: plan('unknown-rights', CURRENT_GENERATION, 'degraded', ['coherent-reference']),
  proofHandoff: {
    generationIdentity: CURRENT_GENERATION,
    sourceIdentity: {
      sourceId: 'style-unknown-rights',
      contentHash: CONTENT_A,
      sourceUrl: 'https://styles.example.test/style-unknown-rights',
    },
    provenanceUseLabel: {
      status: 'partial',
      sourceUrl: 'https://styles.example.test/style-unknown-rights',
      licenseStatus: 'unknown',
      rightsKnown: false,
      useLabel: 'rights-unknown',
    },
    semanticRole: { role: 'reference', dimensions: ['relationship'] },
    transformation: {
      state: 'planned',
      summary: 'planned-reference',
      copiedSourceSpecificMaterial: false,
    },
    fallback: {
      state: 'target-derived',
      reason: 'target-derived-unknown-rights',
    },
    proofState: {
      outcome: 'unknown-rights',
      status: 'accepted-evidence',
      targetChecks: 'not-assessed',
    },
  },
});

export const SHARED_FIXTURES = Object.freeze([
  POSITIVE_FIXTURE,
  NO_FIT_FIXTURE,
  UNAVAILABLE_FIXTURE,
  GENERATION_MISMATCH_FIXTURE,
  UNKNOWN_RIGHTS_FIXTURE,
]);
