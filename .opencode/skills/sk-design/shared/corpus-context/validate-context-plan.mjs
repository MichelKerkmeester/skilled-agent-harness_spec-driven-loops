// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Corpus Context Plan Validator                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import {
  AUTHORITY_ORDER,
  CAPABILITY_TOKENS,
  COMMON_PROOF_HANDOFF_FIELDS,
  CORPUS_CONTEXT_PLAN_SCHEMA,
  CORPUS_EVIDENCE_SCOPE,
  CORPUS_CONTEXT_PLAN_VERSION,
  CORPUS_EVIDENCE_ALLOWED_USES,
  CORPUS_EVIDENCE_PROHIBITIONS,
  CORPUS_PROOF_HANDOFF_VERSION,
  PROOF_OUTCOMES,
  SEMANTIC_DIMENSIONS,
  SEMANTIC_ROLES,
} from './corpus-context-plan.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const AVAILABILITY_STATES = Object.freeze(['ready', 'degraded', 'unavailable']);
const GENERATION_STATES = Object.freeze(['current', 'unavailable', 'mismatch']);
const PROVENANCE_STATES = Object.freeze(['known', 'partial', 'unknown', 'unavailable']);
const USE_LABELS = Object.freeze([
  'transformed-reference',
  'reference-only',
  'rights-unknown',
  'not-used',
  'unavailable',
]);
const TRANSFORMATION_STATES = Object.freeze(['transformed', 'planned', 'not-applicable']);
const FALLBACK_STATES = Object.freeze([
  'not-needed',
  'target-derived',
  'ordinary-workflow',
  'requery-required',
]);
const STYLE_PAYLOAD_PATTERN = /[{}:;]|#[a-f0-9]{3,8}\b|px|rgb/i;
const PROHIBITED_AUTHORITY_CLAIMS = Object.freeze([
  Object.freeze({
    name: 'severity-or-priority',
    keyPattern: /(?:severity|priority)(?:rating|level|decision)?/,
    valuePatterns: Object.freeze([
      /\b(?:severity|priority)(?:\s+(?:rating|level))?\s*[:=-]?\s*(?:p[0-4]|critical|high|medium|low)\b/i,
      /\bp[0-4]\b/i,
    ]),
  }),
  Object.freeze({
    name: 'accessibility-or-performance-proof',
    keyPattern: /(?:accessibility|performance)(?:proof|pass|passed|verified|verification|compliance)/,
    valuePatterns: Object.freeze([
      /\b(?:accessibility|performance)\b.{0,40}\b(?:proof|proven|pass|passed|verified|compliant)\b/i,
      /\b(?:proof|proven|pass|passed|verified|compliant)\b.{0,40}\b(?:accessibility|performance)\b/i,
    ]),
  }),
  Object.freeze({
    name: 'mode-selection',
    keyPattern: /(?:selectedmode|modeselection|modedecision|choosemode|chosenmode)/,
    valuePatterns: Object.freeze([
      /\bmode\b.{0,40}\b(?:selected|chosen|decided|selection|decision)\b/i,
      /\b(?:selected|chosen)\b.{0,40}\bmode\b/i,
    ]),
  }),
  Object.freeze({
    name: 'copying-or-plagiarism-determination',
    keyPattern: /(?:copying|plagiarism)(?:determination|decision|established|proof|status)/,
    valuePatterns: Object.freeze([
      /\b(?:copying|plagiarism)\b.{0,40}\b(?:established|determined|proven|confirmed)\b/i,
      /\b(?:established|determined|proven|confirmed)\b.{0,40}\b(?:copying|plagiarism)\b/i,
    ]),
  }),
  Object.freeze({
    name: 'exact-reuse-authorization',
    keyPattern: /exactreuse(?:authorization|authorisation|authorized|authorised|approval|permission)/,
    valuePatterns: Object.freeze([
      /\bexact reuse\b.{0,40}\b(?:authorized|authorised|approved|permitted|allowed)\b/i,
      /\b(?:authorized|authorised|approved|permitted|allowed)\b.{0,40}\bexact reuse\b/i,
    ]),
  }),
  Object.freeze({
    name: 'transport-output-acceptance',
    keyPattern: /transportoutput(?:acceptance|accepted|approval|approved|pass|passed)/,
    valuePatterns: Object.freeze([
      /\btransport output\b.{0,40}\b(?:accepted|approved|passed)\b/i,
      /\b(?:accepted|approved|passed)\b.{0,40}\btransport output\b/i,
    ]),
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function formatPropertyKey(key) {
  return typeof key === 'symbol' ? `[${String(key)}]` : key;
}

function validateExactKeys(errors, value, path, requiredKeys) {
  if (!isPlainObject(value)) {
    errors.push(`${path}:required-object`);
    return false;
  }
  const actualKeys = Reflect.ownKeys(value);
  for (const key of requiredKeys) {
    if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}:required`);
  }
  for (const key of actualKeys) {
    if (!requiredKeys.includes(key)) {
      errors.push(`${path}.${formatPropertyKey(key)}:unexpected`);
    }
  }
  return true;
}

function validateEnum(errors, value, path, allowedValues) {
  if (!allowedValues.includes(value)) errors.push(`${path}:invalid`);
}

function validateNonEmptyString(errors, value, path) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(`${path}:required-string`);
  }
}

function validateNullableHash(errors, value, path) {
  if (value !== null && !HASH_PATTERN.test(value ?? '')) errors.push(`${path}:invalid-hash`);
}

function validateStringList(errors, value, path) {
  if (!Array.isArray(value)) {
    errors.push(`${path}:required-array`);
    return;
  }
  if (value.some((item) => typeof item !== 'string' || item.trim().length === 0)) {
    errors.push(`${path}:invalid-item`);
  }
  if (new Set(value).size !== value.length) errors.push(`${path}:duplicate-item`);
}

function validateCapabilityList(errors, value, path) {
  validateStringList(errors, value, path);
  if (!Array.isArray(value)) return;
  for (const item of value) {
    if (typeof item !== 'string') continue;
    if (STYLE_PAYLOAD_PATTERN.test(item)) errors.push(`${path}:style-payload-forbidden`);
    if (!CAPABILITY_TOKENS.includes(item)) errors.push(`${path}:invalid-capability`);
  }
}

function normalizeAuthorityKey(key) {
  return typeof key === 'string' ? key.replace(/[^a-z0-9]/gi, '').toLowerCase() : '';
}

function validateNoAuthoritativeClaims(
  errors,
  value,
  path,
  { scanValues = true, seen = new Set() } = {},
) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);

  for (const key of Reflect.ownKeys(value)) {
    const childPath = `${path}.${formatPropertyKey(key)}`;
    const normalizedKey = normalizeAuthorityKey(key);
    for (const claim of PROHIBITED_AUTHORITY_CLAIMS) {
      if (normalizedKey && claim.keyPattern.test(normalizedKey)) {
        errors.push(`${childPath}:prohibited-authority-claim:${claim.name}`);
      }
    }

    const child = value[key];
    if (scanValues && typeof child === 'string') {
      for (const claim of PROHIBITED_AUTHORITY_CLAIMS) {
        if (claim.valuePatterns.some((pattern) => pattern.test(child))) {
          errors.push(`${childPath}:prohibited-authority-claim:${claim.name}`);
        }
      }
    } else if (child !== null && typeof child === 'object') {
      validateNoAuthoritativeClaims(errors, child, childPath, { scanValues, seen });
    }
  }
}

function validateExactList(errors, value, path, expected) {
  validateStringList(errors, value, path);
  if (!Array.isArray(value) || value.length !== expected.length) {
    errors.push(`${path}:fixed-order-required`);
    return;
  }
  if (value.some((item, index) => item !== expected[index])) {
    errors.push(`${path}:fixed-order-required`);
  }
}

function validateGenerationIdentity(errors, value, path) {
  const keys = ['requestedGenerationHash', 'observedGenerationHash', 'state'];
  if (!validateExactKeys(errors, value, path, keys)) return;
  validateNullableHash(errors, value.requestedGenerationHash, `${path}.requestedGenerationHash`);
  validateNullableHash(errors, value.observedGenerationHash, `${path}.observedGenerationHash`);
  validateEnum(errors, value.state, `${path}.state`, GENERATION_STATES);

  if (value.state === 'current') {
    if (value.requestedGenerationHash === null || value.observedGenerationHash === null) {
      errors.push(`${path}:current-hashes-required`);
    } else if (value.requestedGenerationHash !== value.observedGenerationHash) {
      errors.push(`${path}:current-hashes-must-match`);
    }
  }
  if (value.state === 'unavailable' && value.observedGenerationHash !== null) {
    errors.push(`${path}.observedGenerationHash:must-be-null`);
  }
  if (value.state === 'mismatch') {
    if (value.requestedGenerationHash === null || value.observedGenerationHash === null) {
      errors.push(`${path}:mismatch-hashes-required`);
    } else if (value.requestedGenerationHash === value.observedGenerationHash) {
      errors.push(`${path}:mismatch-hashes-must-differ`);
    }
  }
}

function validateSourceIdentity(errors, value, path) {
  if (value === null) return;
  const keys = ['sourceId', 'contentHash', 'sourceUrl'];
  if (!validateExactKeys(errors, value, path, keys)) return;
  validateNonEmptyString(errors, value.sourceId, `${path}.sourceId`);
  validateNullableHash(errors, value.contentHash, `${path}.contentHash`);
  if (value.contentHash === null) errors.push(`${path}.contentHash:required-hash`);
  validateNonEmptyString(errors, value.sourceUrl, `${path}.sourceUrl`);
}

function validateProvenanceUseLabel(errors, value, path) {
  const keys = ['status', 'sourceUrl', 'licenseStatus', 'rightsKnown', 'useLabel'];
  if (!validateExactKeys(errors, value, path, keys)) return;
  validateEnum(errors, value.status, `${path}.status`, PROVENANCE_STATES);
  if (value.sourceUrl !== null) validateNonEmptyString(errors, value.sourceUrl, `${path}.sourceUrl`);
  validateNonEmptyString(errors, value.licenseStatus, `${path}.licenseStatus`);
  if (typeof value.rightsKnown !== 'boolean') errors.push(`${path}.rightsKnown:required-boolean`);
  validateEnum(errors, value.useLabel, `${path}.useLabel`, USE_LABELS);
}

function validateSemanticRole(errors, value, path) {
  const keys = ['role', 'dimensions'];
  if (!validateExactKeys(errors, value, path, keys)) return;
  validateEnum(errors, value.role, `${path}.role`, SEMANTIC_ROLES);
  validateStringList(errors, value.dimensions, `${path}.dimensions`);
  if (Array.isArray(value.dimensions)) {
    for (const dimension of value.dimensions) {
      validateEnum(errors, dimension, `${path}.dimensions`, SEMANTIC_DIMENSIONS);
    }
  }
}

function validateTransformation(errors, value, path) {
  const keys = ['state', 'summary', 'copiedSourceSpecificMaterial'];
  if (!validateExactKeys(errors, value, path, keys)) return;
  validateEnum(errors, value.state, `${path}.state`, TRANSFORMATION_STATES);
  validateNonEmptyString(errors, value.summary, `${path}.summary`);
  if (value.copiedSourceSpecificMaterial !== false) {
    errors.push(`${path}.copiedSourceSpecificMaterial:must-be-false`);
  }
}

function validateFallback(errors, value, path) {
  const keys = ['state', 'reason'];
  if (!validateExactKeys(errors, value, path, keys)) return;
  validateEnum(errors, value.state, `${path}.state`, FALLBACK_STATES);
  validateNonEmptyString(errors, value.reason, `${path}.reason`);
}

function validateProofState(errors, value, path) {
  const keys = ['outcome', 'status', 'targetChecks'];
  if (!validateExactKeys(errors, value, path, keys)) return;
  validateEnum(errors, value.outcome, `${path}.outcome`, PROOF_OUTCOMES);
  if (value.status !== 'accepted-evidence') errors.push(`${path}.status:must-be-accepted-evidence`);
  if (value.targetChecks !== 'not-assessed') errors.push(`${path}.targetChecks:must-be-not-assessed`);
}

function validateOutcomeSemantics(errors, record) {
  const outcome = record.proofState?.outcome;
  const sourceIdentity = record.sourceIdentity;
  if (['no-fit', 'unavailable', 'generation-mismatch'].includes(outcome) && sourceIdentity !== null) {
    errors.push('proofHandoff.sourceIdentity:must-be-null-for-negative-outcome');
  }
  if (['positive', 'unknown-rights'].includes(outcome) && !isPlainObject(sourceIdentity)) {
    errors.push('proofHandoff.sourceIdentity:required-for-source-outcome');
  }
  if (outcome === 'generation-mismatch' && record.generationIdentity?.state !== 'mismatch') {
    errors.push('proofHandoff.generationIdentity.state:mismatch-required');
  }
  if (outcome === 'unavailable' && record.generationIdentity?.state !== 'unavailable') {
    errors.push('proofHandoff.generationIdentity.state:unavailable-required');
  }
  if (outcome === 'unknown-rights') {
    if (record.provenanceUseLabel?.rightsKnown !== false) {
      errors.push('proofHandoff.provenanceUseLabel.rightsKnown:must-be-false');
    }
    if (record.provenanceUseLabel?.useLabel !== 'rights-unknown') {
      errors.push('proofHandoff.provenanceUseLabel.useLabel:rights-unknown-required');
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PUBLIC VALIDATORS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate a neutral corpus-context plan without hydrating any style.
 *
 * @param {Object} plan - Hub-facing capability and proof plan.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateCorpusContextPlan(plan) {
  const errors = [];
  validateNoAuthoritativeClaims(errors, plan, 'plan', { scanValues: false });
  if (!validateExactKeys(errors, plan, 'plan', CORPUS_CONTEXT_PLAN_SCHEMA.required)) {
    return { valid: false, errors };
  }
  if (plan.schemaVersion !== CORPUS_CONTEXT_PLAN_VERSION) {
    errors.push('plan.schemaVersion:invalid');
  }
  validateGenerationIdentity(errors, plan.generationIdentity, 'plan.generationIdentity');
  validateEnum(errors, plan.availability, 'plan.availability', AVAILABILITY_STATES);

  const capabilityKeys = ['requested', 'available', 'unavailable'];
  if (validateExactKeys(errors, plan.capabilityPlan, 'plan.capabilityPlan', capabilityKeys)) {
    for (const key of capabilityKeys) {
      validateCapabilityList(errors, plan.capabilityPlan[key], `plan.capabilityPlan.${key}`);
    }
  }

  const hydrationKeys = ['owner', 'hydratedStyleCount'];
  if (validateExactKeys(errors, plan.hydration, 'plan.hydration', hydrationKeys)) {
    if (plan.hydration.owner !== 'selected-mode') errors.push('plan.hydration.owner:invalid');
    if (plan.hydration.hydratedStyleCount !== 0) {
      errors.push('plan.hydration.hydratedStyleCount:must-be-zero');
    }
  }

  const authorityKeys = [
    'order',
    'corpusEvidenceScope',
    'corpusEvidenceAllowedUses',
    'corpusEvidenceProhibitions',
  ];
  if (validateExactKeys(errors, plan.authority, 'plan.authority', authorityKeys)) {
    validateExactList(errors, plan.authority.order, 'plan.authority.order', AUTHORITY_ORDER);
    if (plan.authority.corpusEvidenceScope !== CORPUS_EVIDENCE_SCOPE) {
      errors.push('plan.authority.corpusEvidenceScope:must-be-advisory-only');
    }
    validateExactList(
      errors,
      plan.authority.corpusEvidenceAllowedUses,
      'plan.authority.corpusEvidenceAllowedUses',
      CORPUS_EVIDENCE_ALLOWED_USES,
    );
    validateExactList(
      errors,
      plan.authority.corpusEvidenceProhibitions,
      'plan.authority.corpusEvidenceProhibitions',
      CORPUS_EVIDENCE_PROHIBITIONS,
    );
  }

  const proofPlanKeys = [
    'outcome',
    'recordSchemaVersion',
    'requiredRecordFields',
    'targetChecks',
  ];
  if (validateExactKeys(errors, plan.proofPlan, 'plan.proofPlan', proofPlanKeys)) {
    validateEnum(errors, plan.proofPlan.outcome, 'plan.proofPlan.outcome', PROOF_OUTCOMES);
    if (plan.proofPlan.recordSchemaVersion !== CORPUS_PROOF_HANDOFF_VERSION) {
      errors.push('plan.proofPlan.recordSchemaVersion:invalid');
    }
    validateExactList(
      errors,
      plan.proofPlan.requiredRecordFields,
      'plan.proofPlan.requiredRecordFields',
      COMMON_PROOF_HANDOFF_FIELDS,
    );
    if (plan.proofPlan.targetChecks !== 'required-outside-seam') {
      errors.push('plan.proofPlan.targetChecks:must-remain-external');
    }
  }

  if (plan.generationIdentity?.state === 'unavailable' && plan.availability !== 'unavailable') {
    errors.push('plan.availability:unavailable-generation-requires-unavailable');
  }
  if (plan.generationIdentity?.state === 'mismatch' && plan.availability !== 'degraded') {
    errors.push('plan.availability:generation-mismatch-requires-degraded');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validate the common record every mode reuses for proof and handoff.
 *
 * @param {Object} record - Common proof/handoff record.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateProofHandoffRecord(record) {
  const errors = [];
  validateNoAuthoritativeClaims(errors, record, 'proofHandoff');
  if (!validateExactKeys(errors, record, 'proofHandoff', COMMON_PROOF_HANDOFF_FIELDS)) {
    return { valid: false, errors };
  }
  validateGenerationIdentity(errors, record.generationIdentity, 'proofHandoff.generationIdentity');
  validateSourceIdentity(errors, record.sourceIdentity, 'proofHandoff.sourceIdentity');
  validateProvenanceUseLabel(
    errors,
    record.provenanceUseLabel,
    'proofHandoff.provenanceUseLabel',
  );
  validateSemanticRole(errors, record.semanticRole, 'proofHandoff.semanticRole');
  validateTransformation(errors, record.transformation, 'proofHandoff.transformation');
  validateFallback(errors, record.fallback, 'proofHandoff.fallback');
  validateProofState(errors, record.proofState, 'proofHandoff.proofState');
  validateOutcomeSemantics(errors, record);
  return { valid: errors.length === 0, errors };
}

/**
 * Validate a shared fixture and the binding between its plan and proof record.
 *
 * @param {Object} fixture - Named plan and proof/handoff fixture.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateCorpusContextFixture(fixture) {
  const errors = [];
  const fixtureKeys = ['name', 'plan', 'proofHandoff'];
  if (!validateExactKeys(errors, fixture, 'fixture', fixtureKeys)) {
    return { valid: false, errors };
  }
  validateNonEmptyString(errors, fixture.name, 'fixture.name');
  const planValidation = validateCorpusContextPlan(fixture.plan);
  const recordValidation = validateProofHandoffRecord(fixture.proofHandoff);
  errors.push(...planValidation.errors, ...recordValidation.errors);

  if (fixture.plan?.proofPlan?.outcome !== fixture.proofHandoff?.proofState?.outcome) {
    errors.push('fixture:proof-outcome-mismatch');
  }
  if (
    JSON.stringify(fixture.plan?.generationIdentity)
    !== JSON.stringify(fixture.proofHandoff?.generationIdentity)
  ) {
    errors.push('fixture:generation-identity-mismatch');
  }
  return { valid: errors.length === 0, errors };
}
