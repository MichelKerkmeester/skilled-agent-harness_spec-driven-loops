// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Audit Corpus Comparison Lane                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { isDeepStrictEqual } from 'node:util';

import {
  AUTHORITY_ORDER,
  COMMON_PROOF_HANDOFF_FIELDS,
} from '../../shared/corpus-context/corpus-context-plan.mjs';
import {
  validateCorpusContextPlan,
  validateProofHandoffRecord,
} from '../../shared/corpus-context/validate-context-plan.mjs';
import {
  blockingPlanOutcome,
  immutableSnapshot,
  isRetrievalUnavailableError,
} from '../../shared/corpus-context/corpus-runtime.mjs';
import {
  validateHydratedSourceAttestation,
  validateSourceAttestation,
} from '../../shared/corpus-context/source-attestation.mjs';
import { runHydrate, runQuery } from '../../styles/_engine/style-library.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const AUDIT_CORPUS_COMPARISON_VERSION = 'AUDIT_CORPUS_COMPARISON v2';
export const AUDIT_COMPARISON_EVIDENCE_VERSION = 'AUDIT_COMPARISON_EVIDENCE v1';
export const AUDIT_SOURCE_ATTESTATION_VERSION = 'AUDIT_SOURCE_ATTESTATION v1';

const AUTHORITY_INPUT_KEYS = Object.freeze([
  'brief',
  'ownedSystem',
  'selectedModeJudgment',
  'targetEvidence',
  'deterministicChecks',
]);
const COMPARISON_KEYS = Object.freeze([
  'id',
  'purpose',
  'relation',
  'intendedAnchor',
  'axisObservations',
  'targetEvidence',
  'attestation',
]);
const INTENDED_ANCHOR_KEYS = Object.freeze(['sourceId', 'contentHash']);
const AXIS_OBSERVATION_KEYS = Object.freeze(['axis', 'state']);
const TARGET_EVIDENCE_KEYS = Object.freeze(['label', 'kind', 'evidenceId']);
const COMPARISON_EVIDENCE_KEYS = Object.freeze([
  'schemaVersion',
  'comparisonId',
  'purpose',
  'relation',
  'axisObservations',
]);
const COMPARISON_EVIDENCE_FENCE = 'audit-comparison-evidence';
const COMPARISON_PURPOSES = Object.freeze([
  'owned-anchor-conformance',
  'contextual-relationship',
  'counterexample-check',
]);
const RELATIONS = Object.freeze([
  'aligned',
  'intentional-delta',
  'unexplained-drift',
]);
const COMPARISON_AXES = Object.freeze([
  'content-hierarchy',
  'layout-rhythm',
  'navigation-emphasis',
  'typography-role',
  'color-role',
  'motion-role',
  'density',
  'imagery-role',
]);
const OBSERVATION_STATES = Object.freeze([
  'aligned',
  'intentional-delta',
  'unexplained-drift',
  'not-observed',
]);
const EVIDENCE_LABELS = Object.freeze(['confirmed', 'inferred', 'not-assessed']);
const EVIDENCE_KINDS = Object.freeze([
  'render-capture',
  'dom-inspection',
  'interaction-probe',
  'deterministic-check',
  'not-assessed',
]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const MAX_COMPARISON_REFERENCES = 2;
const MAX_QUERY_CARDS = 5;
const COMPARISON_HYDRATION_BYTES = 4 * 1_024;
const HYDRATION_UNAVAILABLE_CODES = Object.freeze(new Set([
  'manifest-missing',
  'manifest-invalid',
  'generation-mismatch',
  'unavailable',
]));
const PROVENANCE_STATES = Object.freeze(['known', 'partial', 'unknown']);
const LICENSE_STATES = Object.freeze([
  'allowed',
  'licensed',
  'public-domain',
  'restricted',
  'unknown',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function validateExactKeys(errors, value, path, keys) {
  if (!isPlainObject(value)) {
    errors.push(`${path}:required-object`);
    return false;
  }
  const actualKeys = Reflect.ownKeys(value);
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}:required`);
  }
  for (const key of actualKeys) {
    if (!keys.includes(key)) errors.push(`${path}.${String(key)}:unexpected`);
  }
  return true;
}

function validateEnum(errors, value, path, allowedValues) {
  if (!allowedValues.includes(value)) errors.push(`${path}:invalid`);
}

function validateUuid(errors, value, path) {
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
    errors.push(`${path}:invalid-source-id`);
  }
}

function validateHash(errors, value, path) {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) {
    errors.push(`${path}:invalid-content-hash`);
  }
}

function validateIntendedAnchor(errors, intendedAnchor, path) {
  if (intendedAnchor === null) return;
  if (!validateExactKeys(errors, intendedAnchor, path, INTENDED_ANCHOR_KEYS)) return;
  validateUuid(errors, intendedAnchor.sourceId, `${path}.sourceId`);
  validateHash(errors, intendedAnchor.contentHash, `${path}.contentHash`);
}

function validateComparisonEvidence(errors, evidence, path) {
  if (!validateExactKeys(errors, evidence, path, COMPARISON_EVIDENCE_KEYS)) return;
  if (evidence.schemaVersion !== AUDIT_COMPARISON_EVIDENCE_VERSION) {
    errors.push(`${path}.schemaVersion:invalid`);
  }
  validateUuid(errors, evidence.comparisonId, `${path}.comparisonId`);
  validateEnum(errors, evidence.purpose, `${path}.purpose`, COMPARISON_PURPOSES);
  validateEnum(errors, evidence.relation, `${path}.relation`, RELATIONS);
  if (!Array.isArray(evidence.axisObservations)) {
    errors.push(`${path}.axisObservations:required-array`);
    return;
  }
  for (const [index, observation] of evidence.axisObservations.entries()) {
    const observationPath = `${path}.axisObservations.${index}`;
    if (!validateExactKeys(errors, observation, observationPath, AXIS_OBSERVATION_KEYS)) continue;
    validateEnum(errors, observation.axis, `${observationPath}.axis`, COMPARISON_AXES);
    validateEnum(errors, observation.state, `${observationPath}.state`, OBSERVATION_STATES);
  }
}

function validateComparison(errors, comparison, index, authorityInputs, generationHash) {
  const path = `comparisons.${index}`;
  if (!validateExactKeys(errors, comparison, path, COMPARISON_KEYS)) return;
  validateUuid(errors, comparison.id, `${path}.id`);
  validateEnum(errors, comparison.purpose, `${path}.purpose`, COMPARISON_PURPOSES);
  validateEnum(errors, comparison.relation, `${path}.relation`, RELATIONS);
  validateIntendedAnchor(errors, comparison.intendedAnchor, `${path}.intendedAnchor`);

  if (!Array.isArray(comparison.axisObservations)) {
    errors.push(`${path}.axisObservations:required-array`);
  } else {
    for (const [axisIndex, observation] of comparison.axisObservations.entries()) {
      const axisPath = `${path}.axisObservations.${axisIndex}`;
      if (!validateExactKeys(errors, observation, axisPath, AXIS_OBSERVATION_KEYS)) continue;
      validateEnum(errors, observation.axis, `${axisPath}.axis`, COMPARISON_AXES);
      validateEnum(errors, observation.state, `${axisPath}.state`, OBSERVATION_STATES);
    }
  }

  if (!Array.isArray(comparison.targetEvidence)) {
    errors.push(`${path}.targetEvidence:required-array`);
  } else {
    for (const [evidenceIndex, evidence] of comparison.targetEvidence.entries()) {
      const evidencePath = `${path}.targetEvidence.${evidenceIndex}`;
      if (!validateExactKeys(errors, evidence, evidencePath, TARGET_EVIDENCE_KEYS)) continue;
      validateEnum(errors, evidence.label, `${evidencePath}.label`, EVIDENCE_LABELS);
      validateEnum(errors, evidence.kind, `${evidencePath}.kind`, EVIDENCE_KINDS);
      validateHash(errors, evidence.evidenceId, `${evidencePath}.evidenceId`);
    }
  }

  validateSourceAttestation(errors, comparison.attestation, `${path}.attestation`, {
    schemaVersion: AUDIT_SOURCE_ATTESTATION_VERSION,
    mode: 'audit',
    sourceId: comparison.id,
    generationHash,
    validateEvidence: validateComparisonEvidence,
  });
  const attested = comparison.attestation?.evidence;
  if (attested) {
    if (attested.comparisonId !== comparison.id) {
      errors.push(`${path}.attestation.evidence.comparisonId:comparison-mismatch`);
    }
    for (const key of ['purpose', 'relation', 'axisObservations']) {
      if (!isDeepStrictEqual(attested[key], comparison[key])) {
        errors.push(`${path}.attestation.evidence.${key}:comparison-mismatch`);
      }
    }
  }

  if (comparison.relation !== 'unexplained-drift') return;
  if (!isPlainObject(comparison.intendedAnchor)) {
    errors.push(`${path}:drift-requires-verified-intended-anchor`);
    return;
  }
  const ownedAnchor = authorityInputs?.ownedSystem?.ownedAnchor;
  if (
    !isPlainObject(ownedAnchor)
    || !isDeepStrictEqual(comparison.intendedAnchor, ownedAnchor)
    || comparison.id !== comparison.intendedAnchor.sourceId
  ) {
    errors.push(`${path}:intended-anchor-identity-mismatch`);
  }
  if (!comparison.targetEvidence.some((evidence) => (
    isPlainObject(evidence) && evidence.label !== 'not-assessed'
  ))) {
    errors.push(`${path}:drift-requires-target-evidence`);
  }
}

function isKnownRetrievalUnavailable(error) {
  return isRetrievalUnavailableError(error);
}

/**
 * Validate a closed comparison envelope before corpus data can enter the audit lane.
 *
 * @param {Object} input - Neutral plan, typed comparison selections, and authority inputs.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateAuditComparisonRequest(input) {
  const errors = [];
  const planValidation = validateCorpusContextPlan(input?.contextPlan);
  errors.push(...planValidation.errors);
  const hasAuthorityInputs = validateExactKeys(
    errors,
    input?.authorityInputs,
    'authorityInputs',
    AUTHORITY_INPUT_KEYS,
  );
  if (!Array.isArray(input?.comparisons)) {
    errors.push('comparisons:required-array');
  } else if (input.comparisons.length > MAX_COMPARISON_REFERENCES) {
    errors.push('comparisons:maximum-two');
  } else {
    input.comparisons.forEach((comparison, index) => {
      validateComparison(
        errors,
        comparison,
        index,
        hasAuthorityInputs ? input.authorityInputs : null,
        input.contextPlan?.generationIdentity?.observedGenerationHash,
      );
    });
  }
  if (input?.retrievalRequest?.usage === 'exact-reuse' || input?.retrievalRequest?.exactReuse) {
    errors.push('retrievalRequest:exact-reuse-forbidden');
  }
  return { valid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROOF AND ROW BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

function provenanceFromCard(card) {
  const provenance = card.provenance ?? {};
  const status = PROVENANCE_STATES.includes(provenance.status)
    ? provenance.status
    : 'unknown';
  const licenseStatus = LICENSE_STATES.includes(provenance.licenseStatus)
    ? provenance.licenseStatus
    : 'unknown';
  return {
    status,
    sourceUrl: provenance.sourceUrl ?? null,
    licenseStatus,
    rightsKnown: provenance.rightsKnown === true,
    useLabel: provenance.rightsKnown === true ? 'reference-only' : 'rights-unknown',
  };
}

function comparisonReference(reference) {
  return {
    sourceId: reference.sourceId,
    generationHash: reference.generationHash,
    contentHash: reference.contentHash,
    role: 'comparison-reference',
    rightsState: reference.provenanceUseLabel.rightsKnown ? 'known' : 'unknown',
  };
}

function referenceDescriptor(card, hydration) {
  const provenanceUseLabel = provenanceFromCard(card);
  return {
    sourceId: card.id,
    generationHash: card.generationHash,
    contentHash: card.contentHash,
    sourceUrl: provenanceUseLabel.sourceUrl,
    role: 'comparison-reference',
    provenanceUseLabel,
    artifactHashes: hydration.artifacts.map((artifact) => ({
      path: artifact.path,
      sha256: artifact.sha256,
      truncated: artifact.truncated,
    })),
  };
}

function comparisonProofHandoff(generationIdentity, reference) {
  const isRightsKnown = reference.provenanceUseLabel.rightsKnown;
  return {
    generationIdentity,
    sourceIdentity: {
      sourceId: reference.sourceId,
      contentHash: reference.contentHash,
      sourceUrl: reference.sourceUrl,
    },
    provenanceUseLabel: reference.provenanceUseLabel,
    semanticRole: { role: 'reference', dimensions: ['relationship', 'rationale'] },
    transformation: {
      state: isRightsKnown ? 'transformed' : 'planned',
      summary: isRightsKnown ? 'transformed-reference' : 'planned-reference',
      copiedSourceSpecificMaterial: false,
    },
    fallback: {
      state: isRightsKnown ? 'not-needed' : 'target-derived',
      reason: isRightsKnown ? 'bounded-reference-fit' : 'target-derived-unknown-rights',
    },
    proofState: {
      outcome: isRightsKnown ? 'positive' : 'unknown-rights',
      status: 'accepted-evidence',
      targetChecks: 'not-assessed',
    },
  };
}

function unavailableProofHandoff(contextPlan, outcome) {
  const isUnavailable = outcome === 'unavailable';
  const isMismatch = outcome === 'generation-mismatch';
  return {
    generationIdentity: contextPlan.generationIdentity,
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
    fallback: {
      state: isUnavailable
        ? 'ordinary-workflow'
        : isMismatch
          ? 'requery-required'
          : 'target-derived',
      reason: isUnavailable
        ? 'ordinary-workflow-unavailable'
        : isMismatch
          ? 'requery-generation-mismatch'
          : 'target-derived-no-fit',
    },
    proofState: {
      outcome,
      status: 'accepted-evidence',
      targetChecks: 'not-assessed',
    },
  };
}

function validateBuiltProof(proofHandoff) {
  const validation = validateProofHandoffRecord(proofHandoff);
  if (!validation.valid) {
    return { ok: false, error: 'invalid-proof-handoff', details: validation.errors };
  }
  return null;
}

function unavailableResult(contextPlan, outcome = 'no-fit', warnings = []) {
  const proofHandoff = unavailableProofHandoff(contextPlan, outcome);
  const proofError = validateBuiltProof(proofHandoff);
  if (proofError) return proofError;
  return {
    ok: true,
    outcome: 'comparison-unavailable',
    schemaVersion: AUDIT_CORPUS_COMPARISON_VERSION,
    authority: {
      order: [...AUTHORITY_ORDER],
      corpusRole: 'non-authoritative-context',
    },
    comparisons: [{
      reference: null,
      purpose: 'comparison-unavailable',
      relation: 'comparison-unavailable',
      axisObservations: [],
      targetEvidence: [],
      evidenceLabel: 'non-authoritative-context',
      limitation: 'target-evidence-only',
      targetEvidenceRequired: true,
    }],
    proofHandoffs: [proofHandoff],
    warnings,
  };
}

async function hydrateComparison(card, engineOptions) {
  try {
    return await runHydrate({
      id: card.id,
      generationHash: card.generationHash,
      mode: 'audit',
      usage: 'reference',
      includes: ['DESIGN.md', 'design-tokens.json', 'source.md'],
      maxBytes: COMPARISON_HYDRATION_BYTES,
    }, engineOptions);
  } catch (error) {
    if (!isKnownRetrievalUnavailable(error)) throw error;
    return { ok: false, error: error.code ?? 'manifest-invalid' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build zero to two non-authoritative audit comparison rows.
 *
 * @param {Object} input - Neutral plan, typed comparison selections, and target evidence.
 * @param {Object} engineOptions - Retrieval-engine corpus and manifest paths.
 * @returns {Promise<Object>} Comparison context, unavailable evidence, or refusal.
 */
export async function buildAuditComparisonLane(input, engineOptions = {}) {
  const validation = validateAuditComparisonRequest(input);
  if (!validation.valid) {
    return { ok: false, error: 'invalid-audit-comparison-request', details: validation.errors };
  }
  const request = immutableSnapshot(input);
  const authoritySnapshot = request.authorityInputs;
  const blockedOutcome = blockingPlanOutcome(request.contextPlan);
  if (blockedOutcome) {
    return unavailableResult(request.contextPlan, blockedOutcome);
  }

  let query;
  try {
    query = await runQuery({
      ...(request.retrievalRequest ?? {}),
      usage: 'reference',
      exactReuse: false,
      limit: MAX_QUERY_CARDS,
    }, engineOptions);
  } catch (error) {
    if (!isKnownRetrievalUnavailable(error)) throw error;
    return unavailableResult(
      request.contextPlan,
      'no-fit',
      [`retrieval-unavailable:${error.code ?? 'invalid-manifest'}`],
    );
  }
  if (query.generationHash !== request.contextPlan.generationIdentity.observedGenerationHash) {
    return unavailableResult(
      request.contextPlan,
      'no-fit',
      ['retrieval-unavailable:generation-mismatch'],
    );
  }

  const rows = [];
  const proofHandoffs = [];
  const warnings = [];
  for (const comparison of request.comparisons) {
    const card = query.cards.find((candidate) => candidate.id === comparison.id);
    if (!card) {
      warnings.push(`comparison-unavailable:${comparison.id}`);
      continue;
    }
    if (
      comparison.relation === 'unexplained-drift'
      && (
        card.id !== comparison.intendedAnchor.sourceId
        || card.contentHash !== comparison.intendedAnchor.contentHash
      )
    ) {
      return {
        ok: false,
        error: 'intended-anchor-identity-mismatch',
        details: [comparison.id],
      };
    }
    const hydration = await hydrateComparison(card, engineOptions);
    if (!hydration.ok) {
      if (!HYDRATION_UNAVAILABLE_CODES.has(hydration.error)) {
        return { ok: false, error: `comparison-${hydration.error}` };
      }
      warnings.push(`comparison-unavailable:${comparison.id}:${hydration.error}`);
      continue;
    }
    const attestationValidation = validateHydratedSourceAttestation(
      comparison.attestation,
      card,
      hydration,
      { fence: COMPARISON_EVIDENCE_FENCE, validateEvidence: validateComparisonEvidence },
    );
    if (!attestationValidation.valid) {
      return {
        ok: false,
        error: 'comparison-attestation-rejected',
        details: attestationValidation.errors,
      };
    }
    const reference = referenceDescriptor(card, hydration);
    const proofHandoff = comparisonProofHandoff(
      request.contextPlan.generationIdentity,
      reference,
    );
    const proofError = validateBuiltProof(proofHandoff);
    if (proofError) return proofError;
    proofHandoffs.push(proofHandoff);
    rows.push({
      reference: comparisonReference(reference),
      purpose: comparison.purpose,
      relation: comparison.relation,
      intendedAnchor: structuredClone(comparison.intendedAnchor),
      axisObservations: structuredClone(comparison.axisObservations),
      targetEvidence: structuredClone(comparison.targetEvidence),
      evidenceLabel: 'non-authoritative-context',
      limitation: 'target-evidence-owns-verdict',
      targetEvidenceRequired: true,
    });
  }

  if (rows.length === 0) return unavailableResult(request.contextPlan, 'no-fit', warnings);
  if (!isDeepStrictEqual(authoritySnapshot, input.authorityInputs)) {
    return { ok: false, error: 'authority-input-mutated' };
  }
  return {
    ok: true,
    outcome: 'comparison-context',
    schemaVersion: AUDIT_CORPUS_COMPARISON_VERSION,
    authority: {
      order: [...AUTHORITY_ORDER],
      corpusRole: 'non-authoritative-context',
    },
    comparisons: rows,
    proofHandoffs,
    warnings,
  };
}

/**
 * Return the shared field names used by every audit comparison proof record.
 *
 * @returns {string[]} Stable common proof/handoff fields.
 */
export function auditProofHandoffFields() {
  return [...COMMON_PROOF_HANDOFF_FIELDS];
}
