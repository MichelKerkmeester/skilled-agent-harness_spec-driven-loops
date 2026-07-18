// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Open Design Offline Contract Fixtures                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

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

const POSITIVE_CONTEXT = Object.freeze({
  name: 'positive',
  generation: { requestedHash: GENERATION_A, observedHash: GENERATION_A, state: 'current' },
  availability: 'ready',
  proof: {
    outcome: 'positive',
    evidenceStatus: 'accepted-evidence',
    sourceId: 'style-positive',
    contentHash: CONTENT_A,
    provenanceStatus: 'known',
    licenseStatus: 'known',
    rightsKnown: true,
    useLabel: 'transformed-reference',
    semanticRole: 'reference',
    dimensions: ['relationship', 'rationale'],
    transformationState: 'transformed',
    copiedSourceSpecificMaterial: false,
    fallbackState: 'not-needed',
    targetChecks: 'not-assessed',
  },
});

const NO_FIT_CONTEXT = Object.freeze({
  name: 'no-fit',
  generation: { requestedHash: GENERATION_A, observedHash: GENERATION_A, state: 'current' },
  availability: 'ready',
  proof: {
    outcome: 'no-fit',
    evidenceStatus: 'accepted-evidence',
    sourceId: null,
    contentHash: null,
    provenanceStatus: 'unknown',
    licenseStatus: 'not-applicable',
    rightsKnown: false,
    useLabel: 'not-used',
    semanticRole: 'none',
    dimensions: [],
    transformationState: 'not-applicable',
    copiedSourceSpecificMaterial: false,
    fallbackState: 'target-derived',
    targetChecks: 'not-assessed',
  },
});

const GENERATION_MISMATCH_CONTEXT = Object.freeze({
  name: 'generation-mismatch',
  generation: { requestedHash: GENERATION_A, observedHash: GENERATION_B, state: 'mismatch' },
  availability: 'degraded',
  proof: {
    outcome: 'generation-mismatch',
    evidenceStatus: 'accepted-evidence',
    sourceId: null,
    contentHash: null,
    provenanceStatus: 'unknown',
    licenseStatus: 'not-applicable',
    rightsKnown: false,
    useLabel: 'not-used',
    semanticRole: 'none',
    dimensions: [],
    transformationState: 'not-applicable',
    copiedSourceSpecificMaterial: false,
    fallbackState: 'requery-required',
    targetChecks: 'not-assessed',
  },
});

function receipt(receiptId, corpusContext) {
  const modeProposal = proposal('apply');
  return {
    schemaVersion: OPEN_DESIGN_GROUNDING_RECEIPT_VERSION,
    receiptId,
    pairedMode: 'design-interface',
    skDesignGate: {
      status: 'verified',
      proofDigest: digestMetadata({ pairedMode: 'design-interface', target: 'project-alpha' }),
    },
    operation: { kind: 'generation-run', tool: 'start_run' },
    target: { projectId: 'project-alpha', resourceId: null },
    corpusContext: structuredClone(corpusContext),
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
  };
}

function proposal(disposition = 'apply') {
  return {
    schemaVersion: PAIRED_MODE_PROPOSAL_VERSION,
    proposalId: `proposal-${disposition}`,
    pairedMode: 'design-interface',
    targetProjectId: 'project-alpha',
    influences: [
      { influenceId: 'primary-layout-relationship', proposedDisposition: disposition },
    ],
  };
}

function toolSurfaceEvidence(requiredTools) {
  return {
    observedAt: CREATED_AT,
    toolsListHash: TOOLS_LIST_HASH,
    requiredTools,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RECEIPT FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

export const LIVE_BRIEF_FIXTURE = BRIEF;

export const POSITIVE_RECEIPT_FIXTURE = Object.freeze(
  receipt('receipt-positive', POSITIVE_CONTEXT),
);

export const NO_FIT_RECEIPT_FIXTURE = Object.freeze(
  receipt('receipt-no-fit', NO_FIT_CONTEXT),
);

export const STALE_RECEIPT_FIXTURE = Object.freeze(
  receipt('receipt-stale', GENERATION_MISMATCH_CONTEXT),
);

export const RECEIPT_FIXTURES = Object.freeze([
  POSITIVE_RECEIPT_FIXTURE,
  NO_FIT_RECEIPT_FIXTURE,
  STALE_RECEIPT_FIXTURE,
]);

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECONCILIATION FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const COMPLETED_RETURN = Object.freeze({
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

export const ALIGNED_RECONCILIATION_FIXTURE = Object.freeze({
  name: 'aligned',
  expectedOutcome: 'aligned',
  proposal: proposal('apply'),
  returnEvidence: COMPLETED_RETURN,
  modeEvidence: [
    {
      influenceId: 'primary-layout-relationship',
      classification: 'applied',
      artifactHash: ARTIFACT_HASH,
    },
  ],
});

export const DIVERGED_RECONCILIATION_FIXTURE = Object.freeze({
  name: 'diverged',
  expectedOutcome: 'diverged',
  proposal: proposal('apply'),
  returnEvidence: COMPLETED_RETURN,
  modeEvidence: [
    {
      influenceId: 'primary-layout-relationship',
      classification: 'rejected',
      artifactHash: ARTIFACT_HASH,
    },
  ],
});

export const AWAITING_INPUT_RECONCILIATION_FIXTURE = Object.freeze({
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
