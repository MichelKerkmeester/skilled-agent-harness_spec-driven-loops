// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Open Design Return Reconciliation                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { PAIRED_MODES } from './grounding-receipt.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTRACT CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const PAIRED_MODE_PROPOSAL_VERSION = 'PAIRED_MODE_PROPOSAL v1';
export const OPEN_DESIGN_RETURN_EVIDENCE_VERSION = 'OPEN_DESIGN_RETURN_EVIDENCE v2';
export const OPEN_DESIGN_RETURN_RECONCILIATION_VERSION = 'OPEN_DESIGN_RETURN_RECONCILIATION v2';

export const RECONCILIATION_AUTHORITY = Object.freeze({
  decisionOwner: 'paired-mode',
  transportAuthoritative: false,
  acceptanceState: 'pending-mode-decision',
  mutationApproval: 'external-required',
});

const RECONCILIATION_KEYS = Object.freeze([
  'schemaVersion',
  'proposal',
  'returnEvidence',
  'modeEvidence',
  'outcome',
  'divergences',
  'authority',
]);

export const OPEN_DESIGN_RETURN_RECONCILIATION_SCHEMA = Object.freeze({
  schemaVersion: OPEN_DESIGN_RETURN_RECONCILIATION_VERSION,
  required: RECONCILIATION_KEYS,
  additionalProperties: false,
  authority: RECONCILIATION_AUTHORITY,
  invariants: Object.freeze([
    'proposal-and-return-remain-distinct',
    'semantics-recomputed-on-validation',
    'influence-evidence-unique-and-artifact-bound',
    'paired-mode-decides',
    'transport-cannot-accept-or-approve-mutation',
  ]),
});

const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const IDENTIFIER_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,255}$/;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const PROPOSAL_DISPOSITIONS = Object.freeze(['apply', 'modify', 'reject']);
const RETURN_CLASSIFICATIONS = Object.freeze(['applied', 'target-modified', 'rejected']);
const RETURN_STATUSES = Object.freeze([
  'awaiting_input',
  'read_complete',
  'completed',
  'failed',
  'cancelled',
]);
const RECONCILIATION_OUTCOMES = Object.freeze([
  'aligned',
  'diverged',
  'awaiting-input',
  'terminal-incomplete',
]);
const DIVERGENCE_KINDS = Object.freeze([
  'classification-mismatch',
  'missing-return-evidence',
  'unexpected-return-evidence',
  'return-incomplete-awaiting-input',
  'return-incomplete-terminal',
]);
const EXPECTED_CLASSIFICATION = Object.freeze({
  apply: 'applied',
  modify: 'target-modified',
  reject: 'rejected',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function formatKey(key) {
  return typeof key === 'symbol' ? `[${String(key)}]` : key;
}

function validateExactKeys(errors, value, path, requiredKeys) {
  if (!isPlainObject(value)) {
    errors.push(`${path}:required-object`);
    return false;
  }
  for (const key of requiredKeys) {
    if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}:required`);
  }
  for (const key of Reflect.ownKeys(value)) {
    if (!requiredKeys.includes(key)) errors.push(`${path}.${formatKey(key)}:unexpected`);
  }
  return true;
}

function validateIdentifier(errors, value, path, { nullable = false } = {}) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !IDENTIFIER_PATTERN.test(value)) {
    errors.push(`${path}:invalid-metadata-identifier`);
  }
}

function validateHash(errors, value, path, { nullable = false } = {}) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) errors.push(`${path}:invalid-hash`);
}

function validateTimestamp(errors, value, path) {
  if (typeof value !== 'string'
    || !ISO_TIMESTAMP_PATTERN.test(value)
    || !Number.isFinite(Date.parse(value))) {
    errors.push(`${path}:invalid-timestamp`);
  }
}

function validatePreviewUrl(errors, value, path, { nullable = false } = {}) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || value.length > 512) {
    errors.push(`${path}:invalid-url`);
    return;
  }
  try {
    const parsed = new URL(value);
    const localHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    if (!['http:', 'https:'].includes(parsed.protocol)
      || !localHost
      || parsed.username
      || parsed.password
      || parsed.search
      || parsed.hash
      || !/^\/[a-zA-Z0-9._/-]*$/.test(parsed.pathname)) {
      throw new TypeError('unsupported');
    }
  } catch {
    errors.push(`${path}:invalid-url`);
  }
}

function validateInfluenceProposal(errors, value, path) {
  if (!validateExactKeys(errors, value, path, ['influenceId', 'proposedDisposition'])) return;
  validateIdentifier(errors, value.influenceId, `${path}.influenceId`);
  if (!PROPOSAL_DISPOSITIONS.includes(value.proposedDisposition)) {
    errors.push(`${path}.proposedDisposition:invalid`);
  }
}

function validateModeEvidenceItem(errors, value, path) {
  if (!validateExactKeys(errors, value, path, ['influenceId', 'classification', 'artifactHash'])) return;
  validateIdentifier(errors, value.influenceId, `${path}.influenceId`);
  if (!RETURN_CLASSIFICATIONS.includes(value.classification)) {
    errors.push(`${path}.classification:invalid`);
  }
  validateHash(errors, value.artifactHash, `${path}.artifactHash`, { nullable: true });
}

function validateArtifactMetadata(errors, value, path) {
  if (!validateExactKeys(errors, value, path, ['path', 'hash'])) return;
  validateIdentifier(errors, value.path, `${path}.path`);
  validateHash(errors, value.hash, `${path}.hash`);
}

function validateDivergence(errors, value, path) {
  if (!validateExactKeys(
    errors,
    value,
    path,
    ['kind', 'influenceId', 'proposed', 'returned'],
  )) return;
  if (!DIVERGENCE_KINDS.includes(value.kind)) errors.push(`${path}.kind:invalid`);
  validateIdentifier(errors, value.influenceId, `${path}.influenceId`, { nullable: true });
  if (value.proposed !== null && !PROPOSAL_DISPOSITIONS.includes(value.proposed)) {
    errors.push(`${path}.proposed:invalid`);
  }
  if (value.returned !== null && !RETURN_CLASSIFICATIONS.includes(value.returned)) {
    errors.push(`${path}.returned:invalid`);
  }
}

function validateModeEvidenceSet(errors, modeEvidence, returnEvidence, path) {
  if (!Array.isArray(modeEvidence)) {
    errors.push(`${path}:required-array`);
    return;
  }
  modeEvidence.forEach((item, index) => {
    validateModeEvidenceItem(errors, item, `${path}.${index}`);
  });
  const influenceIds = modeEvidence.map((item) => item?.influenceId);
  if (new Set(influenceIds).size !== influenceIds.length) {
    errors.push(`${path}:duplicate-influence`);
  }

  const artifactHashes = new Set(
    Array.isArray(returnEvidence?.artifacts)
      ? returnEvidence.artifacts.map((artifact) => artifact?.hash)
      : [],
  );
  if (returnEvidence?.status === 'awaiting_input' && modeEvidence.length > 0) {
    errors.push(`${path}:must-be-empty-while-awaiting-input`);
  }
  for (const item of modeEvidence) {
    if (returnEvidence?.status !== 'awaiting_input' && item?.artifactHash === null) {
      errors.push(`${path}.${item?.influenceId ?? 'unknown'}.artifactHash:required-for-terminal-or-read`);
    } else if (item?.artifactHash !== null && !artifactHashes.has(item?.artifactHash)) {
      errors.push(`${path}.${item?.influenceId ?? 'unknown'}.artifactHash:not-bound-to-return-artifact`);
    }
  }
}

function deepFreeze(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

function semanticsEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PUBLIC VALIDATORS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate the paired mode's proposal independently from transport output.
 *
 * @param {unknown} proposal - Candidate mode proposal.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateModeProposal(proposal) {
  const errors = [];
  const keys = ['schemaVersion', 'proposalId', 'pairedMode', 'targetProjectId', 'influences'];
  if (!validateExactKeys(errors, proposal, 'proposal', keys)) return { valid: false, errors };
  if (proposal.schemaVersion !== PAIRED_MODE_PROPOSAL_VERSION) {
    errors.push('proposal.schemaVersion:invalid');
  }
  validateIdentifier(errors, proposal.proposalId, 'proposal.proposalId');
  if (!PAIRED_MODES.includes(proposal.pairedMode)) errors.push('proposal.pairedMode:invalid');
  validateIdentifier(errors, proposal.targetProjectId, 'proposal.targetProjectId');
  if (!Array.isArray(proposal.influences)) {
    errors.push('proposal.influences:required-array');
  } else {
    proposal.influences.forEach((item, index) => {
      validateInfluenceProposal(errors, item, `proposal.influences.${index}`);
    });
    const identifiers = proposal.influences.map((item) => item?.influenceId);
    if (new Set(identifiers).size !== identifiers.length) {
      errors.push('proposal.influences:duplicate-influence');
    }
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validate mode-owned classifications before any live asynchronous boundary.
 *
 * @param {unknown} modeEvidence - Candidate classifications.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateModeEvidence(modeEvidence) {
  const errors = [];
  if (!Array.isArray(modeEvidence)) {
    return { valid: false, errors: ['modeEvidence:required-array'] };
  }
  modeEvidence.forEach((item, index) => {
    validateModeEvidenceItem(errors, item, `modeEvidence.${index}`);
  });
  const influenceIds = modeEvidence.map((item) => item?.influenceId);
  if (new Set(influenceIds).size !== influenceIds.length) {
    errors.push('modeEvidence:duplicate-influence');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validate metadata captured from a live return without retaining its payload.
 *
 * @param {unknown} evidence - Candidate return evidence.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateReturnEvidence(evidence) {
  const errors = [];
  const keys = [
    'schemaVersion',
    'status',
    'projectId',
    'conversationId',
    'runId',
    'entryFile',
    'previewUrl',
    'artifacts',
    'observedAt',
    'toolSurfaceEvidence',
  ];
  if (!validateExactKeys(errors, evidence, 'returnEvidence', keys)) {
    return { valid: false, errors };
  }
  if (evidence.schemaVersion !== OPEN_DESIGN_RETURN_EVIDENCE_VERSION) {
    errors.push('returnEvidence.schemaVersion:invalid');
  }
  if (!RETURN_STATUSES.includes(evidence.status)) errors.push('returnEvidence.status:invalid');
  validateIdentifier(errors, evidence.projectId, 'returnEvidence.projectId');
  validateIdentifier(errors, evidence.conversationId, 'returnEvidence.conversationId', { nullable: true });
  validateIdentifier(errors, evidence.runId, 'returnEvidence.runId', { nullable: true });
  validateIdentifier(errors, evidence.entryFile, 'returnEvidence.entryFile', { nullable: true });
  validatePreviewUrl(errors, evidence.previewUrl, 'returnEvidence.previewUrl', { nullable: true });
  if (!Array.isArray(evidence.artifacts)) {
    errors.push('returnEvidence.artifacts:required-array');
  } else {
    evidence.artifacts.forEach((item, index) => {
      validateArtifactMetadata(errors, item, `returnEvidence.artifacts.${index}`);
    });
    const paths = evidence.artifacts.map((item) => item?.path);
    if (new Set(paths).size !== paths.length) errors.push('returnEvidence.artifacts:duplicate-path');
  }
  validateTimestamp(errors, evidence.observedAt, 'returnEvidence.observedAt');
  if (validateExactKeys(
    errors,
    evidence.toolSurfaceEvidence,
    'returnEvidence.toolSurfaceEvidence',
    ['observedAt', 'toolsListHash', 'requiredTools'],
  )) {
    validateTimestamp(errors, evidence.toolSurfaceEvidence.observedAt, 'returnEvidence.toolSurfaceEvidence.observedAt');
    validateHash(errors, evidence.toolSurfaceEvidence.toolsListHash, 'returnEvidence.toolSurfaceEvidence.toolsListHash');
    if (!Array.isArray(evidence.toolSurfaceEvidence.requiredTools)) {
      errors.push('returnEvidence.toolSurfaceEvidence.requiredTools:invalid');
    } else {
      evidence.toolSurfaceEvidence.requiredTools.forEach((tool, index) => {
        validateIdentifier(errors, tool, `returnEvidence.toolSurfaceEvidence.requiredTools.${index}`);
      });
      if (new Set(evidence.toolSurfaceEvidence.requiredTools).size
        !== evidence.toolSurfaceEvidence.requiredTools.length) {
        errors.push('returnEvidence.toolSurfaceEvidence.requiredTools:duplicate-item');
      }
    }
  }

  if (evidence.status === 'awaiting_input') {
    if (evidence.runId === null) errors.push('returnEvidence.runId:required-while-awaiting-input');
    if (evidence.artifacts?.length !== 0) errors.push('returnEvidence.artifacts:must-be-empty-while-awaiting-input');
    if (evidence.entryFile !== null) errors.push('returnEvidence.entryFile:must-be-null-while-awaiting-input');
    if (evidence.previewUrl !== null) errors.push('returnEvidence.previewUrl:must-be-null-while-awaiting-input');
  }
  if (evidence.status === 'completed') {
    if (evidence.runId === null) errors.push('returnEvidence.runId:required-when-completed');
    if (!evidence.artifacts?.length) errors.push('returnEvidence.artifacts:required-when-completed');
    if (evidence.entryFile === null) errors.push('returnEvidence.entryFile:required-when-completed');
    if (evidence.previewUrl === null) errors.push('returnEvidence.previewUrl:required-when-completed');
  }
  if (evidence.status === 'read_complete' && !evidence.artifacts?.length) {
    errors.push('returnEvidence.artifacts:required-when-read-complete');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Recompute the only valid outcome and divergence list from immutable evidence.
 *
 * @param {Object} input - Valid proposal, return evidence, and mode evidence.
 * @returns {{outcome:string,divergences:Object[]}} Canonical reconciliation semantics.
 */
export function computeReconciliationSemantics({ proposal, returnEvidence, modeEvidence }) {
  const divergences = [];
  const evidenceByInfluence = new Map(modeEvidence.map((item) => [item.influenceId, item]));
  const proposalIdentifiers = new Set(proposal.influences.map((item) => item.influenceId));

  for (const influence of proposal.influences) {
    const returned = evidenceByInfluence.get(influence.influenceId);
    if (!returned) {
      divergences.push({
        kind: 'missing-return-evidence',
        influenceId: influence.influenceId,
        proposed: influence.proposedDisposition,
        returned: null,
      });
    } else if (EXPECTED_CLASSIFICATION[influence.proposedDisposition] !== returned.classification) {
      divergences.push({
        kind: 'classification-mismatch',
        influenceId: influence.influenceId,
        proposed: influence.proposedDisposition,
        returned: returned.classification,
      });
    }
  }
  for (const returned of modeEvidence) {
    if (!proposalIdentifiers.has(returned.influenceId)) {
      divergences.push({
        kind: 'unexpected-return-evidence',
        influenceId: returned.influenceId,
        proposed: null,
        returned: returned.classification,
      });
    }
  }

  let outcome = divergences.length ? 'diverged' : 'aligned';
  if (returnEvidence.status === 'awaiting_input') {
    divergences.unshift({
      kind: 'return-incomplete-awaiting-input',
      influenceId: null,
      proposed: null,
      returned: null,
    });
    outcome = 'awaiting-input';
  } else if (!['completed', 'read_complete'].includes(returnEvidence.status)) {
    divergences.unshift({
      kind: 'return-incomplete-terminal',
      influenceId: null,
      proposed: null,
      returned: null,
    });
    outcome = 'terminal-incomplete';
  }
  return { outcome, divergences };
}

/**
 * Validate a reconciliation and independently recompute its declared semantics.
 *
 * @param {unknown} record - Candidate reconciliation record.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateReconciliationRecord(record) {
  const errors = [];
  if (!validateExactKeys(errors, record, 'reconciliation', RECONCILIATION_KEYS)) {
    return { valid: false, errors };
  }
  if (record.schemaVersion !== OPEN_DESIGN_RETURN_RECONCILIATION_VERSION) {
    errors.push('reconciliation.schemaVersion:invalid');
  }
  const proposalValidation = validateModeProposal(record.proposal);
  const returnValidation = validateReturnEvidence(record.returnEvidence);
  errors.push(...proposalValidation.errors, ...returnValidation.errors);
  const evidenceErrors = [];
  validateModeEvidenceSet(evidenceErrors, record.modeEvidence, record.returnEvidence, 'reconciliation.modeEvidence');
  errors.push(...evidenceErrors);
  if (!RECONCILIATION_OUTCOMES.includes(record.outcome)) {
    errors.push('reconciliation.outcome:invalid');
  }
  if (!Array.isArray(record.divergences)) {
    errors.push('reconciliation.divergences:required-array');
  } else {
    record.divergences.forEach((item, index) => {
      validateDivergence(errors, item, `reconciliation.divergences.${index}`);
    });
  }
  if (validateExactKeys(
    errors,
    record.authority,
    'reconciliation.authority',
    Object.keys(RECONCILIATION_AUTHORITY),
  )) {
    for (const [key, expected] of Object.entries(RECONCILIATION_AUTHORITY)) {
      if (record.authority[key] !== expected) {
        errors.push(`reconciliation.authority.${key}:fixed-value-required`);
      }
    }
  }

  if (proposalValidation.valid
    && returnValidation.valid
    && evidenceErrors.length === 0
    && Array.isArray(record.divergences)) {
    const computed = computeReconciliationSemantics(record);
    if (record.outcome !== computed.outcome) {
      errors.push('reconciliation.outcome:semantic-mismatch');
    }
    if (!semanticsEqual(record.divergences, computed.divergences)) {
      errors.push('reconciliation.divergences:semantic-mismatch');
    }
  }
  return { valid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. RECONCILIATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compare a mode proposal with artifact-bound evidence from the return.
 *
 * @param {Object} input - Reconciliation inputs.
 * @returns {Readonly<Object>} Frozen reconciliation record.
 */
export function reconcileTransportReturn({ proposal, returnEvidence, modeEvidence }) {
  const proposalValidation = validateModeProposal(proposal);
  const returnValidation = validateReturnEvidence(returnEvidence);
  const evidenceErrors = [];
  validateModeEvidenceSet(evidenceErrors, modeEvidence, returnEvidence, 'modeEvidence');
  const errors = [...proposalValidation.errors, ...returnValidation.errors, ...evidenceErrors];
  if (errors.length) {
    throw new TypeError(`Cannot reconcile invalid transport metadata: ${errors.join(', ')}`);
  }

  const semantics = computeReconciliationSemantics({ proposal, returnEvidence, modeEvidence });
  const record = {
    schemaVersion: OPEN_DESIGN_RETURN_RECONCILIATION_VERSION,
    proposal: structuredClone(proposal),
    returnEvidence: structuredClone(returnEvidence),
    modeEvidence: structuredClone(modeEvidence),
    outcome: semantics.outcome,
    divergences: semantics.divergences,
    authority: { ...RECONCILIATION_AUTHORITY },
  };
  const validation = validateReconciliationRecord(record);
  if (!validation.valid) {
    throw new TypeError(`Generated reconciliation is invalid: ${validation.errors.join(', ')}`);
  }
  return deepFreeze(record);
}
