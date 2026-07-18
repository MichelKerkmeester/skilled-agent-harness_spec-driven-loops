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

export const PAIRED_MODE_PROPOSAL_VERSION = 'PAIRED_MODE_PROPOSAL v2';
export const OPEN_DESIGN_RETURN_EVIDENCE_VERSION = 'OPEN_DESIGN_RETURN_EVIDENCE v3';
export const OPEN_DESIGN_RETURN_RECONCILIATION_VERSION = 'OPEN_DESIGN_RETURN_RECONCILIATION v3';
export const MAX_RETURN_ARTIFACTS = 16;
export const MAX_ARTIFACT_METADATA_BYTES = 4096;

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
  'unavailable',
]);
const RECONCILIATION_OUTCOMES = Object.freeze([
  'aligned',
  'diverged',
  'awaiting-input',
  'terminal-incomplete',
  'unavailable',
]);
const DIVERGENCE_KINDS = Object.freeze([
  'classification-mismatch',
  'artifact-mismatch',
  'missing-return-evidence',
  'unexpected-return-evidence',
  'return-incomplete-awaiting-input',
  'return-incomplete-terminal',
  'transport-unavailable',
]);
export const TOOL_SURFACE_REASON_CODES = Object.freeze([
  'client-list-tools-missing',
  'required-tools-missing',
  'daemon-unavailable',
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
  if (!validateExactKeys(
    errors,
    value,
    path,
    ['influenceId', 'proposedDisposition', 'expectedArtifact'],
  )) return;
  validateIdentifier(errors, value.influenceId, `${path}.influenceId`);
  if (!PROPOSAL_DISPOSITIONS.includes(value.proposedDisposition)) {
    errors.push(`${path}.proposedDisposition:invalid`);
  }
  if (value.expectedArtifact !== null) {
    validateArtifactMetadata(errors, value.expectedArtifact, `${path}.expectedArtifact`);
  }
  if (value.proposedDisposition === 'reject' && value.expectedArtifact !== null) {
    errors.push(`${path}.expectedArtifact:must-be-null-when-rejected`);
  }
  if (['apply', 'modify'].includes(value.proposedDisposition)
    && !isPlainObject(value.expectedArtifact)) {
    errors.push(`${path}.expectedArtifact:required-for-material-disposition`);
  }
}

function validateModeEvidenceItem(errors, value, path) {
  if (!validateExactKeys(
    errors,
    value,
    path,
    ['influenceId', 'classification', 'artifactPath', 'artifactHash'],
  )) return;
  validateIdentifier(errors, value.influenceId, `${path}.influenceId`);
  if (!RETURN_CLASSIFICATIONS.includes(value.classification)) {
    errors.push(`${path}.classification:invalid`);
  }
  validateIdentifier(errors, value.artifactPath, `${path}.artifactPath`, { nullable: true });
  validateHash(errors, value.artifactHash, `${path}.artifactHash`, { nullable: true });
  const hasArtifact = value.artifactPath !== null && value.artifactHash !== null;
  if ((value.artifactPath === null) !== (value.artifactHash === null)) {
    errors.push(`${path}:artifact-path-and-hash-must-pair`);
  }
  if (value.classification === 'rejected' && hasArtifact) {
    errors.push(`${path}:rejected-evidence-must-not-bind-artifact`);
  }
  if (['applied', 'target-modified'].includes(value.classification) && !hasArtifact) {
    errors.push(`${path}:material-evidence-requires-artifact`);
  }
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

function validateModeEvidenceSet(errors, modeEvidence, returnEvidence, proposal, path) {
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

  const artifactBindings = new Set(
    Array.isArray(returnEvidence?.artifacts)
      ? returnEvidence.artifacts.map((artifact) => `${artifact?.path}\0${artifact?.hash}`)
      : [],
  );
  if (returnEvidence?.status === 'awaiting_input' && modeEvidence.length > 0) {
    errors.push(`${path}:must-be-empty-while-awaiting-input`);
  }
  for (const item of modeEvidence) {
    const binding = `${item?.artifactPath}\0${item?.artifactHash}`;
    if (item?.artifactHash !== null && !artifactBindings.has(binding)) {
      errors.push(`${path}.${item?.influenceId ?? 'unknown'}:not-bound-to-return-artifact`);
    }
  }
  const proposalIds = new Set(
    Array.isArray(proposal?.influences)
      ? proposal.influences.map((item) => item?.influenceId)
      : [],
  );
  for (const item of modeEvidence) {
    if (!proposalIds.has(item?.influenceId)) continue;
    const influence = proposal.influences.find((entry) => entry.influenceId === item.influenceId);
    if (influence?.expectedArtifact === null && item.classification !== 'rejected') {
      errors.push(`${path}.${item.influenceId}:classification-conflicts-with-proposal-binding`);
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
    if (proposal.influences.length > MAX_RETURN_ARTIFACTS) {
      errors.push('proposal.influences:count-limit-exceeded');
    }
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
    if (evidence.artifacts.length > MAX_RETURN_ARTIFACTS) {
      errors.push('returnEvidence.artifacts:count-limit-exceeded');
    }
    evidence.artifacts.forEach((item, index) => {
      validateArtifactMetadata(errors, item, `returnEvidence.artifacts.${index}`);
    });
    const aggregateSize = evidence.artifacts.reduce(
      (size, item) => size + String(item?.path ?? '').length + String(item?.hash ?? '').length,
      0,
    );
    if (aggregateSize > MAX_ARTIFACT_METADATA_BYTES) {
      errors.push('returnEvidence.artifacts:aggregate-metadata-limit-exceeded');
    }
    const paths = evidence.artifacts.map((item) => item?.path);
    if (new Set(paths).size !== paths.length) errors.push('returnEvidence.artifacts:duplicate-path');
  }
  validateTimestamp(errors, evidence.observedAt, 'returnEvidence.observedAt');
  if (validateExactKeys(
    errors,
    evidence.toolSurfaceEvidence,
    'returnEvidence.toolSurfaceEvidence',
    ['available', 'reasonCode', 'missingTools', 'observedAt', 'toolsListHash', 'requiredTools'],
  )) {
    if (typeof evidence.toolSurfaceEvidence.available !== 'boolean') {
      errors.push('returnEvidence.toolSurfaceEvidence.available:required-boolean');
    }
    if (evidence.toolSurfaceEvidence.reasonCode !== null
      && !TOOL_SURFACE_REASON_CODES.includes(evidence.toolSurfaceEvidence.reasonCode)) {
      errors.push('returnEvidence.toolSurfaceEvidence.reasonCode:invalid');
    }
    if (!Array.isArray(evidence.toolSurfaceEvidence.missingTools)) {
      errors.push('returnEvidence.toolSurfaceEvidence.missingTools:invalid');
    } else {
      evidence.toolSurfaceEvidence.missingTools.forEach((tool, index) => {
        validateIdentifier(errors, tool, `returnEvidence.toolSurfaceEvidence.missingTools.${index}`);
      });
    }
    validateTimestamp(errors, evidence.toolSurfaceEvidence.observedAt, 'returnEvidence.toolSurfaceEvidence.observedAt');
    validateHash(
      errors,
      evidence.toolSurfaceEvidence.toolsListHash,
      'returnEvidence.toolSurfaceEvidence.toolsListHash',
      { nullable: true },
    );
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
    if (evidence.toolSurfaceEvidence.available) {
      if (evidence.toolSurfaceEvidence.reasonCode !== null) {
        errors.push('returnEvidence.toolSurfaceEvidence.reasonCode:must-be-null-when-available');
      }
      if (evidence.toolSurfaceEvidence.missingTools?.length !== 0) {
        errors.push('returnEvidence.toolSurfaceEvidence.missingTools:must-be-empty-when-available');
      }
      if (evidence.toolSurfaceEvidence.toolsListHash === null) {
        errors.push('returnEvidence.toolSurfaceEvidence.toolsListHash:required-when-available');
      }
    } else if (evidence.toolSurfaceEvidence.reasonCode === null) {
      errors.push('returnEvidence.toolSurfaceEvidence.reasonCode:required-when-unavailable');
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
  if (evidence.status === 'unavailable') {
    if (evidence.conversationId !== null || evidence.runId !== null) {
      errors.push('returnEvidence:unavailable-identifiers-must-be-null');
    }
    if (evidence.entryFile !== null || evidence.previewUrl !== null) {
      errors.push('returnEvidence:unavailable-output-must-be-null');
    }
    if (evidence.artifacts?.length !== 0) {
      errors.push('returnEvidence.artifacts:must-be-empty-when-unavailable');
    }
    if (evidence.toolSurfaceEvidence?.available !== false) {
      errors.push('returnEvidence.toolSurfaceEvidence.available:must-be-false-when-unavailable');
    }
  } else if (evidence.toolSurfaceEvidence?.available !== true) {
    errors.push('returnEvidence.toolSurfaceEvidence.available:must-be-true-for-live-return');
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
  const returnedArtifactBindings = new Set(
    returnEvidence.artifacts.map((artifact) => `${artifact.path}\0${artifact.hash}`),
  );

  for (const influence of proposal.influences) {
    const returned = evidenceByInfluence.get(influence.influenceId);
    const expectedArtifact = influence.expectedArtifact;
    const expectedBinding = expectedArtifact === null
      ? null
      : `${expectedArtifact.path}\0${expectedArtifact.hash}`;
    const entryFileMatches = returnEvidence.status !== 'completed'
      || expectedArtifact === null
      || returnEvidence.entryFile === expectedArtifact.path;
    const artifactMatches = expectedBinding === null
      ? returnEvidence.artifacts.length === 0
      : returnedArtifactBindings.has(expectedBinding) && entryFileMatches;

    if (['completed', 'read_complete'].includes(returnEvidence.status) && !artifactMatches) {
      divergences.push({
        kind: 'artifact-mismatch',
        influenceId: influence.influenceId,
        proposed: influence.proposedDisposition,
        returned: returned?.classification ?? null,
      });
    } else if (!returned) {
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
  } else if (returnEvidence.status === 'unavailable') {
    divergences.unshift({
      kind: 'transport-unavailable',
      influenceId: null,
      proposed: null,
      returned: null,
    });
    outcome = 'unavailable';
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
  validateModeEvidenceSet(
    evidenceErrors,
    record.modeEvidence,
    record.returnEvidence,
    record.proposal,
    'reconciliation.modeEvidence',
  );
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
  validateModeEvidenceSet(evidenceErrors, modeEvidence, returnEvidence, proposal, 'modeEvidence');
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

/**
 * Derive paired-mode evidence only from exact proposal-to-artifact bindings.
 *
 * @param {Object} proposal - Frozen proposal carrying expected artifact bindings.
 * @param {Object} returnEvidence - Validated live return evidence.
 * @returns {ReadonlyArray<Object>} Frozen post-return classifications.
 */
export function deriveModeEvidence(proposal, returnEvidence) {
  const proposalValidation = validateModeProposal(proposal);
  const returnValidation = validateReturnEvidence(returnEvidence);
  const errors = [...proposalValidation.errors, ...returnValidation.errors];
  if (errors.length) {
    throw new TypeError(`Cannot derive evidence from invalid metadata: ${errors.join(', ')}`);
  }
  if (!['completed', 'read_complete'].includes(returnEvidence.status)) return Object.freeze([]);

  const returnedBindings = new Map(
    returnEvidence.artifacts.map((artifact) => [`${artifact.path}\0${artifact.hash}`, artifact]),
  );
  const evidence = [];
  for (const influence of proposal.influences) {
    if (influence.expectedArtifact === null) {
      if (returnEvidence.artifacts.length === 0) {
        evidence.push({
          influenceId: influence.influenceId,
          classification: 'rejected',
          artifactPath: null,
          artifactHash: null,
        });
      }
      continue;
    }
    const binding = `${influence.expectedArtifact.path}\0${influence.expectedArtifact.hash}`;
    const artifact = returnedBindings.get(binding);
    const entryFileMatches = returnEvidence.status !== 'completed'
      || returnEvidence.entryFile === influence.expectedArtifact.path;
    if (!artifact || !entryFileMatches) continue;
    evidence.push({
      influenceId: influence.influenceId,
      classification: EXPECTED_CLASSIFICATION[influence.proposedDisposition],
      artifactPath: artifact.path,
      artifactHash: artifact.hash,
    });
  }
  return deepFreeze(evidence);
}
