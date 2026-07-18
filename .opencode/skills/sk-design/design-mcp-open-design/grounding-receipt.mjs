// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Open Design Grounding Receipt                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import {
  CORPUS_CONTEXT_PLAN_VERSION,
  PROOF_OUTCOMES,
} from '../shared/corpus-context/corpus-context-plan.mjs';
import {
  validateCorpusContextFixture,
  validateProofHandoffRecord,
} from '../shared/corpus-context/validate-context-plan.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTRACT CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const OPEN_DESIGN_GROUNDING_RECEIPT_VERSION = 'OPEN_DESIGN_GROUNDING_RECEIPT v3';

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

export const OPEN_DESIGN_GROUNDING_RECEIPT_SCHEMA = Object.freeze({
  schemaVersion: OPEN_DESIGN_GROUNDING_RECEIPT_VERSION,
  required: RECEIPT_KEYS,
  additionalProperties: false,
  corpusContextSchemaVersion: CORPUS_CONTEXT_PLAN_VERSION,
  outcomes: PROOF_OUTCOMES,
  stringValues: 'closed-enum-identifier-digest-timestamp-or-bounded-canonical-metadata',
  invariants: Object.freeze([
    'metadata-only',
    'closed-recursive-schema',
    'canonical-corpus-proof-bound',
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
const AVAILABILITY_BY_OUTCOME = Object.freeze({
  positive: 'ready',
  'no-fit': 'ready',
  unavailable: 'unavailable',
  'generation-mismatch': 'degraded',
  'unknown-rights': 'degraded',
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

function validateHash(errors, value, path) {
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

function appendCanonicalErrors(errors, validation, prefix) {
  for (const error of validation.errors) errors.push(`${prefix}:${error}`);
}

function requireField(errors, condition, path, suffix = 'outcome-inconsistent') {
  if (!condition) errors.push(`${path}:${suffix}`);
}

function validateOutcomeConsistency(errors, context) {
  const proof = context?.proofHandoff;
  const plan = context?.plan;
  if (!isPlainObject(proof) || !isPlainObject(plan)) return;
  const outcome = proof.proofState?.outcome;
  const generation = proof.generationIdentity;
  const provenance = proof.provenanceUseLabel;
  const semanticRole = proof.semanticRole;
  const transformation = proof.transformation;
  const fallback = proof.fallback;
  const source = proof.sourceIdentity;

  requireField(
    errors,
    plan.availability === AVAILABILITY_BY_OUTCOME[outcome],
    'receipt.corpusContext.plan.availability',
  );

  if (outcome === 'positive') {
    requireField(errors, generation?.state === 'current', 'receipt.corpusContext.proofHandoff.generationIdentity.state');
    requireField(errors, isPlainObject(source), 'receipt.corpusContext.proofHandoff.sourceIdentity');
    requireField(errors, ['known', 'partial'].includes(provenance?.status), 'receipt.corpusContext.proofHandoff.provenanceUseLabel.status');
    requireField(errors, provenance?.rightsKnown === true, 'receipt.corpusContext.proofHandoff.provenanceUseLabel.rightsKnown');
    requireField(errors, provenance?.licenseStatus === 'known', 'receipt.corpusContext.proofHandoff.provenanceUseLabel.licenseStatus');
    requireField(errors, ['transformed-reference', 'reference-only'].includes(provenance?.useLabel), 'receipt.corpusContext.proofHandoff.provenanceUseLabel.useLabel');
    requireField(errors, semanticRole?.role === 'reference', 'receipt.corpusContext.proofHandoff.semanticRole.role');
    requireField(errors, semanticRole?.dimensions?.length > 0, 'receipt.corpusContext.proofHandoff.semanticRole.dimensions');
    requireField(errors, transformation?.state === 'transformed', 'receipt.corpusContext.proofHandoff.transformation.state');
    requireField(errors, fallback?.state === 'not-needed', 'receipt.corpusContext.proofHandoff.fallback.state');
    requireField(errors, source?.sourceUrl === provenance?.sourceUrl, 'receipt.corpusContext.proofHandoff.provenanceUseLabel.sourceUrl');
  }

  if (outcome === 'no-fit') {
    requireField(errors, generation?.state === 'current', 'receipt.corpusContext.proofHandoff.generationIdentity.state');
    requireField(errors, source === null, 'receipt.corpusContext.proofHandoff.sourceIdentity');
    requireField(errors, provenance?.status === 'unknown', 'receipt.corpusContext.proofHandoff.provenanceUseLabel.status');
    requireField(errors, provenance?.rightsKnown === false, 'receipt.corpusContext.proofHandoff.provenanceUseLabel.rightsKnown');
    requireField(errors, provenance?.useLabel === 'not-used', 'receipt.corpusContext.proofHandoff.provenanceUseLabel.useLabel');
    requireField(errors, semanticRole?.role === 'none' && semanticRole?.dimensions?.length === 0, 'receipt.corpusContext.proofHandoff.semanticRole');
    requireField(errors, transformation?.state === 'not-applicable', 'receipt.corpusContext.proofHandoff.transformation.state');
    requireField(errors, fallback?.state === 'target-derived', 'receipt.corpusContext.proofHandoff.fallback.state');
  }

  if (outcome === 'unavailable') {
    requireField(errors, generation?.state === 'unavailable', 'receipt.corpusContext.proofHandoff.generationIdentity.state');
    requireField(errors, source === null, 'receipt.corpusContext.proofHandoff.sourceIdentity');
    requireField(errors, provenance?.status === 'unavailable', 'receipt.corpusContext.proofHandoff.provenanceUseLabel.status');
    requireField(errors, provenance?.rightsKnown === false, 'receipt.corpusContext.proofHandoff.provenanceUseLabel.rightsKnown');
    requireField(errors, provenance?.useLabel === 'unavailable', 'receipt.corpusContext.proofHandoff.provenanceUseLabel.useLabel');
    requireField(errors, semanticRole?.role === 'none' && semanticRole?.dimensions?.length === 0, 'receipt.corpusContext.proofHandoff.semanticRole');
    requireField(errors, transformation?.state === 'not-applicable', 'receipt.corpusContext.proofHandoff.transformation.state');
    requireField(errors, fallback?.state === 'ordinary-workflow', 'receipt.corpusContext.proofHandoff.fallback.state');
  }

  if (outcome === 'generation-mismatch') {
    requireField(errors, generation?.state === 'mismatch', 'receipt.corpusContext.proofHandoff.generationIdentity.state');
    requireField(errors, source === null, 'receipt.corpusContext.proofHandoff.sourceIdentity');
    requireField(errors, provenance?.rightsKnown === false && provenance?.useLabel === 'not-used', 'receipt.corpusContext.proofHandoff.provenanceUseLabel');
    requireField(errors, semanticRole?.role === 'none' && semanticRole?.dimensions?.length === 0, 'receipt.corpusContext.proofHandoff.semanticRole');
    requireField(errors, transformation?.state === 'not-applicable', 'receipt.corpusContext.proofHandoff.transformation.state');
    requireField(errors, fallback?.state === 'requery-required', 'receipt.corpusContext.proofHandoff.fallback.state');
  }

  if (outcome === 'unknown-rights') {
    requireField(errors, generation?.state === 'current', 'receipt.corpusContext.proofHandoff.generationIdentity.state');
    requireField(errors, isPlainObject(source), 'receipt.corpusContext.proofHandoff.sourceIdentity');
    requireField(errors, ['known', 'partial', 'unknown'].includes(provenance?.status), 'receipt.corpusContext.proofHandoff.provenanceUseLabel.status');
    requireField(errors, provenance?.rightsKnown === false, 'receipt.corpusContext.proofHandoff.provenanceUseLabel.rightsKnown');
    requireField(errors, provenance?.licenseStatus === 'unknown', 'receipt.corpusContext.proofHandoff.provenanceUseLabel.licenseStatus');
    requireField(errors, provenance?.useLabel === 'rights-unknown', 'receipt.corpusContext.proofHandoff.provenanceUseLabel.useLabel');
    requireField(errors, semanticRole?.role === 'reference' && semanticRole?.dimensions?.length > 0, 'receipt.corpusContext.proofHandoff.semanticRole');
    requireField(errors, transformation?.state === 'planned', 'receipt.corpusContext.proofHandoff.transformation.state');
    requireField(errors, fallback?.state === 'target-derived', 'receipt.corpusContext.proofHandoff.fallback.state');
    requireField(errors, source?.sourceUrl === provenance?.sourceUrl, 'receipt.corpusContext.proofHandoff.provenanceUseLabel.sourceUrl');
  }
}

function validateCorpusBinding(errors, context, hydratedProof) {
  const fixtureValidation = validateCorpusContextFixture(context);
  appendCanonicalErrors(errors, fixtureValidation, 'receipt.corpusContext');
  validateOutcomeConsistency(errors, context);

  const boundValidation = validateProofHandoffRecord(hydratedProof);
  appendCanonicalErrors(errors, boundValidation, 'hydratedProof');
  if (!fixtureValidation.valid || !boundValidation.valid) return;

  let receiptProofDigest;
  let hydratedProofDigest;
  try {
    receiptProofDigest = digestMetadata(context.proofHandoff);
    hydratedProofDigest = digestMetadata(hydratedProof);
  } catch (error) {
    errors.push(`receipt.corpusContext.proofHandoff:invalid-digest-input:${error.message}`);
    return;
  }
  if (receiptProofDigest !== hydratedProofDigest) {
    errors.push('receipt.corpusContext.proofHandoff:not-bound-to-hydrated-proof');
  }
  return hydratedProofDigest;
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
 * Validate a receipt against the separately hydrated canonical proof record.
 *
 * @param {unknown} receipt - Candidate grounding receipt.
 * @param {unknown} hydratedProof - Mode-hydrated canonical proof record.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateGroundingReceipt(receipt, hydratedProof) {
  const errors = [];
  if (!validateExactKeys(errors, receipt, 'receipt', RECEIPT_KEYS)) {
    return { valid: false, errors };
  }

  if (receipt.schemaVersion !== OPEN_DESIGN_GROUNDING_RECEIPT_VERSION) {
    errors.push('receipt.schemaVersion:invalid');
  }
  validateIdentifier(errors, receipt.receiptId, 'receipt.receiptId');
  validateEnum(errors, receipt.pairedMode, 'receipt.pairedMode', PAIRED_MODES);

  let declaredProofDigest;
  if (validateExactKeys(errors, receipt.skDesignGate, 'receipt.skDesignGate', ['status', 'proofDigest'])) {
    if (receipt.skDesignGate.status !== 'verified') errors.push('receipt.skDesignGate.status:must-be-verified');
    validateHash(errors, receipt.skDesignGate.proofDigest, 'receipt.skDesignGate.proofDigest');
    declaredProofDigest = receipt.skDesignGate.proofDigest;
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

  const hydratedProofDigest = validateCorpusBinding(errors, receipt.corpusContext, hydratedProof);
  if (hydratedProofDigest && declaredProofDigest !== hydratedProofDigest) {
    errors.push('receipt.skDesignGate.proofDigest:not-bound-to-hydrated-proof');
  }

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
 * @param {unknown} hydratedProof - Mode-hydrated canonical proof record.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateReceiptForLive(receipt, hydratedProof) {
  const validation = validateGroundingReceipt(receipt, hydratedProof);
  const errors = [...validation.errors];
  if (hydratedProof?.generationIdentity?.state !== 'current') {
    errors.push('hydratedProof.generationIdentity.state:current-required-for-live');
  }
  if (['unavailable', 'generation-mismatch'].includes(hydratedProof?.proofState?.outcome)) {
    errors.push('hydratedProof.proofState.outcome:not-live-eligible');
  }
  return { valid: errors.length === 0, errors };
}
