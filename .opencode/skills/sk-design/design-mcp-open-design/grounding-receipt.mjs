// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Open Design Grounding Receipt                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTRACT CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const OPEN_DESIGN_GROUNDING_RECEIPT_VERSION = 'OPEN_DESIGN_GROUNDING_RECEIPT v2';

export const PAIRED_MODES = Object.freeze([
  'design-interface',
  'design-foundations',
  'design-motion',
  'design-audit',
]);

export const ALLOWED_INFLUENCE_AXES = Object.freeze([
  'relationships',
  'rationale',
  'color',
  'typography',
  'spacing',
  'layout',
  'components',
  'motion',
]);

export const REQUIRED_PROHIBITED_REUSE = Object.freeze([
  'raw-corpus-payload',
  'raw-open-design-payload',
  'source-specific-material',
  'exact-source-reuse',
]);

export const RECEIPT_AUTHORITY = Object.freeze({
  role: 'grounding-evidence-only',
  decisionOwner: 'paired-mode',
  transportAuthoritative: false,
  acceptance: 'external-required',
  mutationApproval: 'external-required',
});

export const NO_CACHE_POLICY = Object.freeze({
  noCache: true,
  persistedFields: 'metadata-only',
  rawCorpusPayloadStored: false,
  rawOpenDesignPayloadStored: false,
});

const RECEIPT_KEYS = Object.freeze([
  'schemaVersion',
  'receiptId',
  'pairedMode',
  'skDesignGate',
  'operation',
  'target',
  'corpusContext',
  'influence',
  'cachePolicy',
  'authority',
  'createdAt',
]);

const CORPUS_CONTEXT_KEYS = Object.freeze([
  'name',
  'generation',
  'availability',
  'proof',
]);

const CORPUS_PROOF_KEYS = Object.freeze([
  'outcome',
  'evidenceStatus',
  'sourceId',
  'contentHash',
  'provenanceStatus',
  'licenseStatus',
  'rightsKnown',
  'useLabel',
  'semanticRole',
  'dimensions',
  'transformationState',
  'copiedSourceSpecificMaterial',
  'fallbackState',
  'targetChecks',
]);

export const OPEN_DESIGN_GROUNDING_RECEIPT_SCHEMA = Object.freeze({
  schemaVersion: OPEN_DESIGN_GROUNDING_RECEIPT_VERSION,
  required: RECEIPT_KEYS,
  additionalProperties: false,
  stringValues: 'closed-enum-identifier-digest-or-timestamp',
  invariants: Object.freeze([
    'metadata-only',
    'closed-recursive-schema',
    'proposal-digest-bound',
    'grounding-evidence-never-authority',
    'generation-current-before-live-call',
  ]),
});

const OPERATION_TOOLS = Object.freeze({
  'design-bearing-read': Object.freeze([
    'get_active_context',
    'get_project',
    'get_file',
    'search_files',
    'get_artifact',
    'get_run',
  ]),
  'generation-run': Object.freeze(['start_run']),
});

const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const IDENTIFIER_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,255}$/;
const PURPOSE_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const CORPUS_NAMES = Object.freeze(['positive', 'no-fit', 'generation-mismatch']);
const GENERATION_STATES = Object.freeze(['current', 'mismatch', 'unavailable']);
const AVAILABILITY_STATES = Object.freeze(['ready', 'degraded', 'unavailable']);
const PROOF_OUTCOMES = Object.freeze(['positive', 'no-fit', 'generation-mismatch', 'unavailable']);
const EVIDENCE_STATUSES = Object.freeze(['accepted-evidence']);
const PROVENANCE_STATUSES = Object.freeze(['known', 'partial', 'unknown', 'unavailable']);
const LICENSE_STATUSES = Object.freeze(['known', 'unknown', 'not-applicable']);
const USE_LABELS = Object.freeze(['transformed-reference', 'rights-unknown', 'not-used', 'unavailable']);
const SEMANTIC_ROLES = Object.freeze(['reference', 'none']);
const SEMANTIC_DIMENSIONS = Object.freeze(['relationship', 'rationale']);
const TRANSFORMATION_STATES = Object.freeze(['transformed', 'planned', 'not-applicable']);
const FALLBACK_STATES = Object.freeze([
  'not-needed',
  'target-derived',
  'ordinary-workflow',
  'requery-required',
]);
const TARGET_CHECKS = Object.freeze(['not-assessed']);

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

function validateExactObject(errors, value, path, expected) {
  if (!validateExactKeys(errors, value, path, Object.keys(expected))) return;
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (value[key] !== expectedValue) errors.push(`${path}.${key}:fixed-value-required`);
  }
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

function validateEnum(errors, value, path, allowedValues) {
  if (!allowedValues.includes(value)) errors.push(`${path}:invalid-enum`);
}

function validateTimestamp(errors, value, path) {
  if (typeof value !== 'string'
    || !ISO_TIMESTAMP_PATTERN.test(value)
    || !Number.isFinite(Date.parse(value))) {
    errors.push(`${path}:invalid-timestamp`);
  }
}

function validateClosedStringList(errors, value, path, allowedValues) {
  if (!Array.isArray(value)) {
    errors.push(`${path}:required-array`);
    return;
  }
  if (new Set(value).size !== value.length) errors.push(`${path}:duplicate-item`);
  value.forEach((item, index) => validateEnum(errors, item, `${path}.${index}`, allowedValues));
}

function canonicalizeMetadata(value, seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'object') {
    throw new TypeError('Metadata digest input contains an unsupported value.');
  }
  if (seen.has(value)) throw new TypeError('Metadata digest input must not contain cycles.');
  seen.add(value);
  if (Array.isArray(value)) {
    const items = value.map((item) => canonicalizeMetadata(item, seen));
    seen.delete(value);
    return items;
  }
  if (!isPlainObject(value)) throw new TypeError('Metadata digest input must use plain objects.');
  if (Reflect.ownKeys(value).some((key) => typeof key === 'symbol')) {
    throw new TypeError('Metadata digest input must use string keys.');
  }
  const output = {};
  for (const key of Object.keys(value).sort()) {
    output[key] = canonicalizeMetadata(value[key], seen);
  }
  seen.delete(value);
  return output;
}

function validateCorpusContext(errors, context) {
  if (!validateExactKeys(errors, context, 'receipt.corpusContext', CORPUS_CONTEXT_KEYS)) return;
  validateEnum(errors, context.name, 'receipt.corpusContext.name', CORPUS_NAMES);
  validateEnum(errors, context.availability, 'receipt.corpusContext.availability', AVAILABILITY_STATES);

  if (validateExactKeys(
    errors,
    context.generation,
    'receipt.corpusContext.generation',
    ['requestedHash', 'observedHash', 'state'],
  )) {
    validateHash(errors, context.generation.requestedHash, 'receipt.corpusContext.generation.requestedHash');
    validateHash(
      errors,
      context.generation.observedHash,
      'receipt.corpusContext.generation.observedHash',
      { nullable: true },
    );
    validateEnum(errors, context.generation.state, 'receipt.corpusContext.generation.state', GENERATION_STATES);
    if (context.generation.state === 'current'
      && context.generation.requestedHash !== context.generation.observedHash) {
      errors.push('receipt.corpusContext.generation:current-hashes-must-match');
    }
    if (context.generation.state === 'mismatch'
      && context.generation.requestedHash === context.generation.observedHash) {
      errors.push('receipt.corpusContext.generation:mismatch-hashes-must-differ');
    }
  }

  if (!validateExactKeys(errors, context.proof, 'receipt.corpusContext.proof', CORPUS_PROOF_KEYS)) return;
  validateEnum(errors, context.proof.outcome, 'receipt.corpusContext.proof.outcome', PROOF_OUTCOMES);
  validateEnum(errors, context.proof.evidenceStatus, 'receipt.corpusContext.proof.evidenceStatus', EVIDENCE_STATUSES);
  validateIdentifier(errors, context.proof.sourceId, 'receipt.corpusContext.proof.sourceId', { nullable: true });
  validateHash(errors, context.proof.contentHash, 'receipt.corpusContext.proof.contentHash', { nullable: true });
  validateEnum(errors, context.proof.provenanceStatus, 'receipt.corpusContext.proof.provenanceStatus', PROVENANCE_STATUSES);
  validateEnum(errors, context.proof.licenseStatus, 'receipt.corpusContext.proof.licenseStatus', LICENSE_STATUSES);
  if (typeof context.proof.rightsKnown !== 'boolean') {
    errors.push('receipt.corpusContext.proof.rightsKnown:required-boolean');
  }
  validateEnum(errors, context.proof.useLabel, 'receipt.corpusContext.proof.useLabel', USE_LABELS);
  validateEnum(errors, context.proof.semanticRole, 'receipt.corpusContext.proof.semanticRole', SEMANTIC_ROLES);
  validateClosedStringList(
    errors,
    context.proof.dimensions,
    'receipt.corpusContext.proof.dimensions',
    SEMANTIC_DIMENSIONS,
  );
  validateEnum(
    errors,
    context.proof.transformationState,
    'receipt.corpusContext.proof.transformationState',
    TRANSFORMATION_STATES,
  );
  if (context.proof.copiedSourceSpecificMaterial !== false) {
    errors.push('receipt.corpusContext.proof.copiedSourceSpecificMaterial:fixed-false-required');
  }
  validateEnum(errors, context.proof.fallbackState, 'receipt.corpusContext.proof.fallbackState', FALLBACK_STATES);
  validateEnum(errors, context.proof.targetChecks, 'receipt.corpusContext.proof.targetChecks', TARGET_CHECKS);

  if (context.proof.outcome !== context.name) {
    errors.push('receipt.corpusContext.proof.outcome:must-match-context-name');
  }
  const sourceRequired = context.proof.outcome === 'positive';
  if (sourceRequired !== (context.proof.sourceId !== null && context.proof.contentHash !== null)) {
    errors.push('receipt.corpusContext.proof:source-identity-consistency');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PUBLIC CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hash closed metadata without depending on object insertion order.
 *
 * @param {unknown} value - Metadata value to hash.
 * @returns {string} A prefixed SHA-256 digest.
 */
export function digestMetadata(value) {
  const canonical = JSON.stringify(canonicalizeMetadata(value));
  return `sha256:${createHash('sha256').update(canonical).digest('hex')}`;
}

/**
 * Validate the closed, metadata-only pre-call grounding receipt.
 *
 * @param {unknown} receipt - Candidate grounding receipt.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateGroundingReceipt(receipt) {
  const errors = [];
  if (!validateExactKeys(errors, receipt, 'receipt', RECEIPT_KEYS)) {
    return { valid: false, errors };
  }

  if (receipt.schemaVersion !== OPEN_DESIGN_GROUNDING_RECEIPT_VERSION) {
    errors.push('receipt.schemaVersion:invalid');
  }
  validateIdentifier(errors, receipt.receiptId, 'receipt.receiptId');
  validateEnum(errors, receipt.pairedMode, 'receipt.pairedMode', PAIRED_MODES);

  if (validateExactKeys(errors, receipt.skDesignGate, 'receipt.skDesignGate', ['status', 'proofDigest'])) {
    if (receipt.skDesignGate.status !== 'verified') errors.push('receipt.skDesignGate.status:must-be-verified');
    validateHash(errors, receipt.skDesignGate.proofDigest, 'receipt.skDesignGate.proofDigest');
  }

  if (validateExactKeys(errors, receipt.operation, 'receipt.operation', ['kind', 'tool'])) {
    const allowedTools = OPERATION_TOOLS[receipt.operation.kind];
    if (!allowedTools) {
      errors.push('receipt.operation.kind:invalid-enum');
    } else if (!allowedTools.includes(receipt.operation.tool)) {
      errors.push('receipt.operation.tool:not-allowed-for-kind');
    }
  }

  if (validateExactKeys(errors, receipt.target, 'receipt.target', ['projectId', 'resourceId'])) {
    validateIdentifier(errors, receipt.target.projectId, 'receipt.target.projectId');
    validateIdentifier(errors, receipt.target.resourceId, 'receipt.target.resourceId', { nullable: true });
  }

  validateCorpusContext(errors, receipt.corpusContext);

  if (validateExactKeys(
    errors,
    receipt.influence,
    'receipt.influence',
    ['purposeCode', 'allowedAxes', 'prohibitedReuse', 'briefDigest', 'proposalDigest'],
  )) {
    if (typeof receipt.influence.purposeCode !== 'string'
      || !PURPOSE_PATTERN.test(receipt.influence.purposeCode)) {
      errors.push('receipt.influence.purposeCode:invalid');
    }
    validateClosedStringList(
      errors,
      receipt.influence.allowedAxes,
      'receipt.influence.allowedAxes',
      ALLOWED_INFLUENCE_AXES,
    );
    if (JSON.stringify(receipt.influence.prohibitedReuse)
      !== JSON.stringify(REQUIRED_PROHIBITED_REUSE)) {
      errors.push('receipt.influence.prohibitedReuse:fixed-list-required');
    }
    validateHash(errors, receipt.influence.briefDigest, 'receipt.influence.briefDigest');
    validateHash(errors, receipt.influence.proposalDigest, 'receipt.influence.proposalDigest');
  }

  validateExactObject(errors, receipt.cachePolicy, 'receipt.cachePolicy', NO_CACHE_POLICY);
  validateExactObject(errors, receipt.authority, 'receipt.authority', RECEIPT_AUTHORITY);
  validateTimestamp(errors, receipt.createdAt, 'receipt.createdAt');

  return { valid: errors.length === 0, errors };
}

/**
 * Apply freshness rules required before a live call.
 *
 * @param {unknown} receipt - Candidate grounding receipt.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateReceiptForLive(receipt) {
  const validation = validateGroundingReceipt(receipt);
  const errors = [...validation.errors];
  if (receipt?.corpusContext?.generation?.state !== 'current') {
    errors.push('receipt.corpusContext.generation.state:current-required-for-live');
  }
  if (['unavailable', 'generation-mismatch'].includes(receipt?.corpusContext?.proof?.outcome)) {
    errors.push('receipt.corpusContext.proof.outcome:not-live-eligible');
  }
  return { valid: errors.length === 0, errors };
}
