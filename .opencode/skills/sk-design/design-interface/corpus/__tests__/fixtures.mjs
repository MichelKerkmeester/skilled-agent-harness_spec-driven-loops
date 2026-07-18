// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Interface Corpus Maintainer Fixtures                                    ║
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
import {
  STYLE_ALPHA,
  STYLE_BETA,
} from '../../../styles/_engine/__tests__/fixtures.mjs';

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
      requested: ['coherent-reference', 'counterexample-context'],
      available: ['coherent-reference', 'counterexample-context'],
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

function authorityInputs() {
  return {
    brief: {
      authority: 'brief',
      lockId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      contentHash: `sha256:${'a'.repeat(64)}`,
      state: 'locked',
    },
    ownedSystem: {
      authority: 'owned-system',
      lockId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      contentHash: `sha256:${'b'.repeat(64)}`,
      state: 'locked',
    },
    targetRender: {
      authority: 'target-render',
      lockId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
      contentHash: `sha256:${'c'.repeat(64)}`,
      state: 'locked',
    },
    navigation: {
      authority: 'navigation',
      lockId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
      contentHash: `sha256:${'d'.repeat(64)}`,
      state: 'locked',
    },
    preflight: {
      authority: 'preflight',
      lockId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
      contentHash: `sha256:${'e'.repeat(64)}`,
      state: 'locked',
    },
  };
}

function modeDecision(sourceRoles = ['anchor']) {
  return {
    decisions: [{
      decisionId: '99999999-9999-4999-8999-999999999999',
      axis: 'layout-rhythm',
      operation: 'transform-for-target',
      choice: 'editorial-image-led-sequence',
      reasonCode: 'brief-job-priority',
      targetAuthority: 'mode-output',
      sourceRoles,
    }],
    counterfactual: {
      changedDecisionAxes: [{
        decisionId: '99999999-9999-4999-8999-999999999999',
        axis: 'layout-rhythm',
        noCorpusDefault: 'uniform-card-grid',
        finalDecision: 'editorial-image-led-sequence',
      }],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NAMED ATLAS CASES
// ─────────────────────────────────────────────────────────────────────────────

export function positiveInterfaceFixture(generationHash) {
  return {
    name: 'positive',
    input: {
      contextPlan: contextPlan(generationHash),
      retrievalRequest: { text: 'warm editorial story rhythm', useFts: false },
      selection: { anchorId: STYLE_ALPHA.id, secondary: null },
      modeDecision: modeDecision(),
      authorityInputs: authorityInputs(),
    },
  };
}

export function noFitInterfaceFixture(generationHash) {
  return {
    name: 'no-fit',
    input: {
      contextPlan: contextPlan(generationHash, 'no-fit'),
      retrievalRequest: {
        text: 'editorial',
        requiredFacets: ['facet-that-does-not-exist'],
        useFts: false,
      },
      selection: { anchorId: STYLE_ALPHA.id, secondary: null },
      authorityInputs: authorityInputs(),
    },
  };
}

export function rejectedDefaultInterfaceFixture(generationHash) {
  return {
    name: 'rejected-default',
    input: {
      contextPlan: contextPlan(generationHash),
      retrievalRequest: { text: 'editorial product interface', useFts: false },
      selection: {
        anchorId: STYLE_ALPHA.id,
        secondary: { id: STYLE_BETA.id, role: 'rejected-default' },
      },
      modeDecision: modeDecision(['anchor', 'rejected-default']),
      authorityInputs: authorityInputs(),
    },
  };
}
