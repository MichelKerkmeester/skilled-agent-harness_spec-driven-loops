// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Audit Corpus Maintainer Fixtures                                        ║
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
import { STYLE_ALPHA } from '../../../styles/tests/engine/fixtures.mjs';
import {
  AUDIT_COMPARISON_EVIDENCE_VERSION,
  AUDIT_SOURCE_ATTESTATION_VERSION,
} from '../comparison-lane.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

export const MAINTAINER_FIXTURE_ATLAS = true;

function contextPlan(generationHash, outcome = 'positive') {
  return {
    schemaVersion: CORPUS_CONTEXT_PLAN_VERSION,
    generationIdentity: {
      requestedGenerationHash: generationHash,
      observedGenerationHash: generationHash,
      state: 'current',
    },
    availability: 'ready',
    capabilityPlan: {
      requested: ['critique-context', 'provenance-context'],
      available: ['critique-context', 'provenance-context'],
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
      outcome,
      recordSchemaVersion: CORPUS_PROOF_HANDOFF_VERSION,
      requiredRecordFields: [...COMMON_PROOF_HANDOFF_FIELDS],
      targetChecks: 'required-outside-seam',
    },
  };
}

function authorityInputs(ownedAnchor = null) {
  return {
    brief: { intendedRegister: 'editorial' },
    ownedSystem: { navigation: 'locked', ownedAnchor },
    selectedModeJudgment: { auditLane: 'comparison' },
    targetEvidence: { render: 'captured' },
    deterministicChecks: { state: 'external' },
  };
}

export function auditComparisonEvidence(overrides = {}) {
  return {
    schemaVersion: AUDIT_COMPARISON_EVIDENCE_VERSION,
    comparisonId: STYLE_ALPHA.id,
    purpose: 'owned-anchor-conformance',
    relation: 'unexplained-drift',
    axisObservations: [{
      axis: 'content-hierarchy',
      state: 'unexplained-drift',
    }],
    ...overrides,
  };
}

export function auditComparisonAttestation(generationHash, sourceId, binding = {}) {
  return {
    schemaVersion: AUDIT_SOURCE_ATTESTATION_VERSION,
    mode: 'audit',
    sourceId,
    generationHash,
    contentHash: binding.contentHash ?? `sha256:${'7'.repeat(64)}`,
    artifactPath: binding.artifactPath ?? 'alpha/DESIGN.md',
    artifactHash: binding.artifactHash ?? `sha256:${'8'.repeat(64)}`,
    evidence: binding.evidence ?? auditComparisonEvidence({ comparisonId: sourceId }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NAMED ATLAS CASES
// ─────────────────────────────────────────────────────────────────────────────

export function intendedAnchorDriftFixture(generationHash, contentHash, binding = {}) {
  const intendedAnchor = { sourceId: STYLE_ALPHA.id, contentHash };
  return {
    name: 'intended-anchor-drift',
    input: {
      contextPlan: contextPlan(generationHash),
      retrievalRequest: { text: 'warm editorial rhythm', useFts: false },
      comparisons: [{
        id: STYLE_ALPHA.id,
        purpose: 'owned-anchor-conformance',
        relation: 'unexplained-drift',
        intendedAnchor,
        axisObservations: [{
          axis: 'content-hierarchy',
          state: 'unexplained-drift',
        }],
        targetEvidence: [{
          label: 'confirmed',
          kind: 'render-capture',
          evidenceId: `sha256:${'e'.repeat(64)}`,
        }],
        attestation: auditComparisonAttestation(
          generationHash,
          STYLE_ALPHA.id,
          binding,
        ),
      }],
      authorityInputs: authorityInputs(intendedAnchor),
    },
  };
}

export function comparisonUnavailableFixture(generationHash) {
  return {
    name: 'comparison-unavailable',
    input: {
      contextPlan: contextPlan(generationHash, 'no-fit'),
      retrievalRequest: {
        text: 'editorial',
        requiredFacets: ['facet-that-does-not-exist'],
        useFts: false,
      },
      comparisons: [],
      authorityInputs: authorityInputs(),
    },
  };
}
