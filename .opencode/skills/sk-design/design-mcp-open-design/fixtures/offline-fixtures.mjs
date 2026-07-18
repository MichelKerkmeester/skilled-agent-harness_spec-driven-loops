// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Open Design Offline Contract Fixtures                                    ║
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
} from '../../shared/corpus-context/corpus-context-plan.mjs';
import {
  digestMetadata,
  NO_CACHE_POLICY,
  OPEN_DESIGN_GROUNDING_RECEIPT_VERSION,
  RECEIPT_AUTHORITY,
  REQUIRED_PROHIBITED_REUSE,
} from '../grounding-receipt.mjs';
import {
  OPEN_DESIGN_RETURN_EVIDENCE_VERSION,
  PAIRED_MODE_PROPOSAL_VERSION,
} from '../return-reconciliation.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

const CREATED_AT = '2026-07-18T12:00:00.000Z';
const ARTIFACT_HASH = `sha256:${'d'.repeat(64)}`;
const TOOLS_LIST_HASH = `sha256:${'e'.repeat(64)}`;
const GENERATION_A = `sha256:${'a'.repeat(64)}`;
const GENERATION_B = `sha256:${'b'.repeat(64)}`;
const CONTENT_A = `sha256:${'c'.repeat(64)}`;
const BRIEF = Object.freeze({
  purposeCode: 'ground-product-dashboard',
  transformedConstraints: Object.freeze(['preserve-hierarchy', 'target-owned-spacing']),
});

function deepFreeze(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

function generationIdentity(state, requestedGenerationHash, observedGenerationHash) {
  return { requestedGenerationHash, observedGenerationHash, state };
}

function plan(outcome, generation, availability) {
  return {
    schemaVersion: CORPUS_CONTEXT_PLAN_VERSION,
    generationIdentity: structuredClone(generation),
    availability,
    capabilityPlan: {
      requested: ['coherent-reference'],
      available: availability === 'unavailable' ? [] : ['coherent-reference'],
      unavailable: availability === 'unavailable' ? ['coherent-reference'] : [],
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

function negativeProof(generation, outcome, fallbackState, reason) {
  const isUnavailable = outcome === 'unavailable';
  return {
    generationIdentity: structuredClone(generation),
    sourceIdentity: null,
    provenanceUseLabel: {
      status: isUnavailable ? 'unavailable' : 'unknown',
      sourceUrl: null,
      licenseStatus: 'not-applicable',
      rightsKnown: false,
      useLabel: isUnavailable ? 'unavailable' : 'not-used',
    },
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

function corpusContext(name, generation, availability, proofHandoff) {
  return deepFreeze({
    name,
    plan: plan(name, generation, availability),
    proofHandoff: structuredClone(proofHandoff),
  });
}

function proposal(disposition = 'apply') {
  return {
    schemaVersion: PAIRED_MODE_PROPOSAL_VERSION,
    proposalId: `proposal-${disposition}`,
    pairedMode: 'design-interface',
    targetProjectId: 'project-alpha',
    influences: [
      {
        influenceId: 'primary-layout-relationship',
        proposedDisposition: disposition,
        expectedArtifact: disposition === 'reject'
          ? null
          : { path: 'index.html', hash: ARTIFACT_HASH },
      },
    ],
  };
}

function receipt(receiptId, context) {
  const modeProposal = proposal('apply');
  return deepFreeze({
    schemaVersion: OPEN_DESIGN_GROUNDING_RECEIPT_VERSION,
    receiptId,
    pairedMode: 'design-interface',
    skDesignGate: {
      status: 'verified',
      proofDigest: digestMetadata(context.proofHandoff),
    },
    operation: { kind: 'generation-run', tool: 'start_run' },
    target: { projectId: 'project-alpha', resourceId: null },
    corpusContext: structuredClone(context),
    influence: {
      purposeCode: BRIEF.purposeCode,
      allowedAxes: ['relationships', 'rationale', 'layout'],
      prohibitedReuse: [...REQUIRED_PROHIBITED_REUSE],
      briefDigest: digestMetadata(BRIEF),
      proposalDigest: digestMetadata(modeProposal),
    },
    cachePolicy: { ...NO_CACHE_POLICY },
    authority: { ...RECEIPT_AUTHORITY },
    createdAt: CREATED_AT,
  });
}

function toolSurfaceEvidence(requiredTools) {
  return {
    available: true,
    reasonCode: null,
    missingTools: [],
    observedAt: CREATED_AT,
    toolsListHash: TOOLS_LIST_HASH,
    requiredTools,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RECEIPT FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const CURRENT_GENERATION = generationIdentity('current', GENERATION_A, GENERATION_A);
const UNAVAILABLE_GENERATION = generationIdentity('unavailable', GENERATION_A, null);
const MISMATCHED_GENERATION = generationIdentity('mismatch', GENERATION_A, GENERATION_B);

const POSITIVE_PROOF = deepFreeze({
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
});

const NO_FIT_PROOF = deepFreeze(negativeProof(
  CURRENT_GENERATION,
  'no-fit',
  'target-derived',
  'target-derived-no-fit',
));
const UNAVAILABLE_PROOF = deepFreeze(negativeProof(
  UNAVAILABLE_GENERATION,
  'unavailable',
  'ordinary-workflow',
  'ordinary-workflow-unavailable',
));
const GENERATION_MISMATCH_PROOF = deepFreeze(negativeProof(
  MISMATCHED_GENERATION,
  'generation-mismatch',
  'requery-required',
  'requery-generation-mismatch',
));
const UNKNOWN_RIGHTS_PROOF = deepFreeze({
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
  proofState: { outcome: 'unknown-rights', status: 'accepted-evidence', targetChecks: 'not-assessed' },
});

export const LIVE_BRIEF_FIXTURE = BRIEF;

export const POSITIVE_RECEIPT_FIXTURE = receipt(
  'receipt-positive',
  corpusContext('positive', CURRENT_GENERATION, 'ready', POSITIVE_PROOF),
);
export const NO_FIT_RECEIPT_FIXTURE = receipt(
  'receipt-no-fit',
  corpusContext('no-fit', CURRENT_GENERATION, 'ready', NO_FIT_PROOF),
);
export const UNAVAILABLE_RECEIPT_FIXTURE = receipt(
  'receipt-unavailable',
  corpusContext('unavailable', UNAVAILABLE_GENERATION, 'unavailable', UNAVAILABLE_PROOF),
);
export const STALE_RECEIPT_FIXTURE = receipt(
  'receipt-stale',
  corpusContext(
    'generation-mismatch',
    MISMATCHED_GENERATION,
    'degraded',
    GENERATION_MISMATCH_PROOF,
  ),
);
export const UNKNOWN_RIGHTS_RECEIPT_FIXTURE = receipt(
  'receipt-unknown-rights',
  corpusContext('unknown-rights', CURRENT_GENERATION, 'degraded', UNKNOWN_RIGHTS_PROOF),
);

export const RECEIPT_FIXTURES = Object.freeze([
  POSITIVE_RECEIPT_FIXTURE,
  NO_FIT_RECEIPT_FIXTURE,
  UNAVAILABLE_RECEIPT_FIXTURE,
  STALE_RECEIPT_FIXTURE,
  UNKNOWN_RIGHTS_RECEIPT_FIXTURE,
]);

export const RECEIPT_HYDRATED_PROOFS = deepFreeze({
  'receipt-positive': POSITIVE_PROOF,
  'receipt-no-fit': NO_FIT_PROOF,
  'receipt-unavailable': UNAVAILABLE_PROOF,
  'receipt-stale': GENERATION_MISMATCH_PROOF,
  'receipt-unknown-rights': UNKNOWN_RIGHTS_PROOF,
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECONCILIATION FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const COMPLETED_RETURN = deepFreeze({
  schemaVersion: OPEN_DESIGN_RETURN_EVIDENCE_VERSION,
  status: 'completed',
  projectId: 'project-alpha',
  conversationId: 'conversation-alpha',
  runId: 'run-alpha',
  entryFile: 'index.html',
  previewUrl: 'http://127.0.0.1:7456/preview/project-alpha',
  artifacts: [{ path: 'index.html', hash: ARTIFACT_HASH }],
  observedAt: CREATED_AT,
  toolSurfaceEvidence: toolSurfaceEvidence(['start_run', 'get_run', 'get_artifact']),
});

export const ALIGNED_RECONCILIATION_FIXTURE = deepFreeze({
  name: 'aligned',
  expectedOutcome: 'aligned',
  proposal: proposal('apply'),
  returnEvidence: COMPLETED_RETURN,
  modeEvidence: [{
    influenceId: 'primary-layout-relationship',
    classification: 'applied',
    artifactPath: 'index.html',
    artifactHash: ARTIFACT_HASH,
  }],
});

export const DIVERGED_RECONCILIATION_FIXTURE = deepFreeze({
  name: 'diverged',
  expectedOutcome: 'diverged',
  proposal: proposal('apply'),
  returnEvidence: COMPLETED_RETURN,
  modeEvidence: [{
    influenceId: 'primary-layout-relationship',
    classification: 'rejected',
    artifactPath: null,
    artifactHash: null,
  }],
});

export const AWAITING_INPUT_RECONCILIATION_FIXTURE = deepFreeze({
  name: 'awaiting-input-zero-files',
  expectedOutcome: 'awaiting-input',
  proposal: proposal('apply'),
  returnEvidence: {
    schemaVersion: OPEN_DESIGN_RETURN_EVIDENCE_VERSION,
    status: 'awaiting_input',
    projectId: 'project-alpha',
    conversationId: 'conversation-alpha',
    runId: 'run-awaiting',
    entryFile: null,
    previewUrl: null,
    artifacts: [],
    observedAt: CREATED_AT,
    toolSurfaceEvidence: toolSurfaceEvidence(['start_run', 'get_run', 'get_artifact']),
  },
  modeEvidence: [],
});

export const RECONCILIATION_FIXTURES = Object.freeze([
  ALIGNED_RECONCILIATION_FIXTURE,
  DIVERGED_RECONCILIATION_FIXTURE,
  AWAITING_INPUT_RECONCILIATION_FIXTURE,
]);
