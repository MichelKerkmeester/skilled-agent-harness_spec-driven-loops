// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Interface Relational Exemplar                                           ║
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

export const INTERFACE_RELATIONAL_EXEMPLAR_VERSION = 'INTERFACE_RELATIONAL_EXEMPLAR v2';
export const INTERFACE_DECISION_HANDOFF_VERSION = 'INTERFACE_DECISION_HANDOFF v2';
export const INTERFACE_DECISION_EVIDENCE_VERSION = 'INTERFACE_DECISION_EVIDENCE v1';
export const INTERFACE_SOURCE_ATTESTATION_VERSION = 'INTERFACE_SOURCE_ATTESTATION v1';

const AUTHORITY_INPUT_KEYS = Object.freeze([
  'brief',
  'ownedSystem',
  'targetRender',
  'navigation',
  'preflight',
]);
const AUTHORITY_LOCK_KEYS = Object.freeze([
  'authority',
  'lockId',
  'contentHash',
  'state',
]);
const AUTHORITY_NAMES = Object.freeze([
  'brief',
  'owned-system',
  'target-render',
  'navigation',
  'preflight',
]);
const AUTHORITY_KEY_TO_NAME = Object.freeze({
  brief: 'brief',
  ownedSystem: 'owned-system',
  targetRender: 'target-render',
  navigation: 'navigation',
  preflight: 'preflight',
});
const DECISION_KEYS = Object.freeze([
  'decisionId',
  'axis',
  'operation',
  'choice',
  'reasonCode',
  'targetAuthority',
  'sourceRoles',
]);
const MODE_DECISION_KEYS = Object.freeze(['decisions', 'counterfactual', 'attestations']);
const DECISION_EVIDENCE_KEYS = Object.freeze([
  'schemaVersion',
  'decisionId',
  'axis',
  'operation',
  'choice',
  'reasonCode',
  'sourceRole',
]);
const DECISION_EVIDENCE_FENCE = 'interface-decision-evidence';
const COUNTERFACTUAL_KEYS = Object.freeze(['changedDecisionAxes']);
const COUNTERFACTUAL_CHANGE_KEYS = Object.freeze([
  'decisionId',
  'axis',
  'noCorpusDefault',
  'finalDecision',
]);
const DECISION_OPERATIONS = Object.freeze([
  'preserve',
  'transform-for-target',
  'reject',
]);
const DECISION_AXES = Object.freeze([
  'content-hierarchy',
  'layout-rhythm',
  'navigation-emphasis',
  'typography-role',
  'color-role',
  'motion-role',
  'density',
  'imagery-role',
]);
const DECISION_CHOICES = Object.freeze([
  'editorial-image-led-sequence',
  'uniform-card-grid',
  'asymmetric-story-stack',
  'restrained-utility-layer',
  'owned-system-default',
  'target-derived-alternative',
]);
const DECISION_REASON_CODES = Object.freeze([
  'brief-job-priority',
  'owned-system-continuity',
  'target-evidence',
  'counterexample-falsification',
]);
const DECISION_TARGET_AUTHORITIES = Object.freeze(['mode-output', ...AUTHORITY_NAMES]);
const SOURCE_ROLES = Object.freeze(['anchor', 'contrast', 'rejected-default']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const MAX_QUERY_CARDS = 5;
const ANCHOR_HYDRATION_BYTES = 8 * 1_024;
const SECONDARY_HYDRATION_BYTES = 2 * 1_024;
const HYDRATION_UNAVAILABLE_CODES = Object.freeze(new Set([
  'manifest-missing',
  'manifest-invalid',
  'generation-mismatch',
  'unavailable',
]));

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
    errors.push(`${path}:invalid-id`);
  }
}

function validateHash(errors, value, path) {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) {
    errors.push(`${path}:invalid-hash`);
  }
}

function validateAuthorityInputs(authorityInputs) {
  const errors = [];
  if (!validateExactKeys(errors, authorityInputs, 'authorityInputs', AUTHORITY_INPUT_KEYS)) {
    return errors;
  }
  for (const key of AUTHORITY_INPUT_KEYS) {
    const path = `authorityInputs.${key}`;
    const lock = authorityInputs[key];
    if (!validateExactKeys(errors, lock, path, AUTHORITY_LOCK_KEYS)) continue;
    validateEnum(errors, lock.authority, `${path}.authority`, [AUTHORITY_KEY_TO_NAME[key]]);
    validateUuid(errors, lock.lockId, `${path}.lockId`);
    validateHash(errors, lock.contentHash, `${path}.contentHash`);
    validateEnum(errors, lock.state, `${path}.state`, ['locked']);
  }
  return errors;
}

function validateSelection(selection) {
  const errors = [];
  const keys = ['anchorId', 'secondary'];
  if (!validateExactKeys(errors, selection, 'selection', keys)) return errors;
  validateUuid(errors, selection.anchorId, 'selection.anchorId');
  if (selection.secondary !== null) {
    const secondaryKeys = ['id', 'role'];
    if (validateExactKeys(errors, selection.secondary, 'selection.secondary', secondaryKeys)) {
      validateUuid(errors, selection.secondary.id, 'selection.secondary.id');
      validateEnum(
        errors,
        selection.secondary.role,
        'selection.secondary.role',
        ['contrast', 'rejected-default'],
      );
      if (selection.secondary.id === selection.anchorId) {
        errors.push('selection.secondary.id:must-differ-from-anchor');
      }
    }
  }
  return errors;
}

function validateDecisionEvidence(errors, evidence, path) {
  if (!validateExactKeys(errors, evidence, path, DECISION_EVIDENCE_KEYS)) return;
  if (evidence.schemaVersion !== INTERFACE_DECISION_EVIDENCE_VERSION) {
    errors.push(`${path}.schemaVersion:invalid`);
  }
  validateUuid(errors, evidence.decisionId, `${path}.decisionId`);
  validateEnum(errors, evidence.axis, `${path}.axis`, DECISION_AXES);
  validateEnum(errors, evidence.operation, `${path}.operation`, DECISION_OPERATIONS);
  validateEnum(errors, evidence.choice, `${path}.choice`, DECISION_CHOICES);
  validateEnum(errors, evidence.reasonCode, `${path}.reasonCode`, DECISION_REASON_CODES);
  validateEnum(errors, evidence.sourceRole, `${path}.sourceRole`, SOURCE_ROLES);
}

function validateModeDecision(modeDecision, authorityInputs, selection, generationHash) {
  const errors = [];
  if (!validateExactKeys(
    errors,
    modeDecision,
    'modeDecision',
    MODE_DECISION_KEYS,
  )) {
    return errors;
  }
  const decisionsById = new Map();
  if (!Array.isArray(modeDecision.decisions) || modeDecision.decisions.length === 0) {
    errors.push('modeDecision.decisions:non-empty-array-required');
  } else {
    for (const [index, decision] of modeDecision.decisions.entries()) {
      const path = `modeDecision.decisions.${index}`;
      if (!validateExactKeys(errors, decision, path, DECISION_KEYS)) continue;
      validateUuid(errors, decision.decisionId, `${path}.decisionId`);
      validateEnum(errors, decision.axis, `${path}.axis`, DECISION_AXES);
      validateEnum(errors, decision.operation, `${path}.operation`, DECISION_OPERATIONS);
      validateEnum(errors, decision.choice, `${path}.choice`, DECISION_CHOICES);
      validateEnum(errors, decision.reasonCode, `${path}.reasonCode`, DECISION_REASON_CODES);
      validateEnum(
        errors,
        decision.targetAuthority,
        `${path}.targetAuthority`,
        DECISION_TARGET_AUTHORITIES,
      );
      if (
        decision.targetAuthority !== 'mode-output'
        && authorityInputs
        && Object.values(authorityInputs).some((lock) => (
          lock.authority === decision.targetAuthority && lock.state === 'locked'
        ))
      ) {
        errors.push(`${path}.targetAuthority:locked-authority-target`);
      }
      if (
        !Array.isArray(decision.sourceRoles)
        || decision.sourceRoles.length === 0
        || decision.sourceRoles.some((role) => !SOURCE_ROLES.includes(role))
        || new Set(decision.sourceRoles).size !== decision.sourceRoles.length
      ) {
        errors.push(`${path}.sourceRoles:invalid`);
      }
      if (decisionsById.has(decision.decisionId)) {
        errors.push(`${path}.decisionId:duplicate`);
      } else {
        decisionsById.set(decision.decisionId, decision);
      }
    }
  }

  if (!validateExactKeys(
    errors,
    modeDecision.counterfactual,
    'modeDecision.counterfactual',
    COUNTERFACTUAL_KEYS,
  )) {
    return errors;
  }
  const changes = modeDecision.counterfactual.changedDecisionAxes;
  if (!Array.isArray(changes) || changes.length === 0) {
    errors.push('modeDecision.counterfactual.changedDecisionAxes:non-empty-array-required');
    return errors;
  }
  const changedDecisionIds = new Set();
  for (const [index, change] of changes.entries()) {
    const path = `modeDecision.counterfactual.changedDecisionAxes.${index}`;
    if (!validateExactKeys(errors, change, path, COUNTERFACTUAL_CHANGE_KEYS)) continue;
    validateUuid(errors, change.decisionId, `${path}.decisionId`);
    validateEnum(errors, change.axis, `${path}.axis`, DECISION_AXES);
    validateEnum(
      errors,
      change.noCorpusDefault,
      `${path}.noCorpusDefault`,
      DECISION_CHOICES,
    );
    validateEnum(errors, change.finalDecision, `${path}.finalDecision`, DECISION_CHOICES);
    const emittedDecision = decisionsById.get(change.decisionId);
    if (!emittedDecision) {
      errors.push(`${path}.decisionId:not-emitted`);
    } else {
      if (change.axis !== emittedDecision.axis) errors.push(`${path}.axis:decision-axis-mismatch`);
      if (change.finalDecision !== emittedDecision.choice) {
        errors.push(`${path}.finalDecision:decision-choice-mismatch`);
      }
    }
    if (change.noCorpusDefault === change.finalDecision) {
      errors.push(`${path}:before-after-difference-required`);
    }
    if (changedDecisionIds.has(change.decisionId)) {
      errors.push(`${path}.decisionId:duplicate`);
    }
    changedDecisionIds.add(change.decisionId);
  }

  if (!Array.isArray(modeDecision.attestations)) {
    errors.push('modeDecision.attestations:required-array');
    return errors;
  }
  const expectedClaims = new Map();
  for (const decision of decisionsById.values()) {
    for (const sourceRole of decision.sourceRoles) {
      expectedClaims.set(`${decision.decisionId}:${sourceRole}`, { decision, sourceRole });
    }
  }
  const attestedClaims = new Set();
  for (const [index, attestation] of modeDecision.attestations.entries()) {
    const path = `modeDecision.attestations.${index}`;
    const evidence = attestation?.evidence;
    const claim = expectedClaims.get(`${evidence?.decisionId}:${evidence?.sourceRole}`);
    const expectedSourceId = evidence?.sourceRole === 'anchor'
      ? selection?.anchorId
      : selection?.secondary?.role === evidence?.sourceRole
        ? selection.secondary.id
        : null;
    validateSourceAttestation(errors, attestation, path, {
      schemaVersion: INTERFACE_SOURCE_ATTESTATION_VERSION,
      mode: 'interface',
      sourceId: expectedSourceId,
      generationHash,
      validateEvidence: validateDecisionEvidence,
    });
    if (!claim) {
      errors.push(`${path}.evidence:claim-not-emitted`);
      continue;
    }
    for (const key of ['decisionId', 'axis', 'operation', 'choice', 'reasonCode']) {
      if (evidence[key] !== claim.decision[key]) {
        errors.push(`${path}.evidence.${key}:decision-mismatch`);
      }
    }
    const claimKey = `${claim.decision.decisionId}:${claim.sourceRole}`;
    if (attestedClaims.has(claimKey)) errors.push(`${path}:duplicate-claim`);
    attestedClaims.add(claimKey);
  }
  for (const claimKey of expectedClaims.keys()) {
    if (!attestedClaims.has(claimKey)) {
      errors.push(`modeDecision.attestations:missing-claim:${claimKey}`);
    }
  }
  return errors;
}

function validateInterfaceRequest(input) {
  const errors = [];
  const planValidation = validateCorpusContextPlan(input?.contextPlan);
  errors.push(...planValidation.errors);
  errors.push(...validateSelection(input?.selection));
  errors.push(...validateAuthorityInputs(input?.authorityInputs));
  if (input?.retrievalRequest?.usage === 'exact-reuse' || input?.retrievalRequest?.exactReuse) {
    errors.push('retrievalRequest:exact-reuse-forbidden');
  }
  if (input?.modeDecision !== undefined) {
    errors.push(...validateModeDecision(
      input.modeDecision,
      input.authorityInputs,
      input.selection,
      input.contextPlan?.generationIdentity?.observedGenerationHash,
    ));
  }
  return errors;
}

function isKnownRetrievalUnavailable(error) {
  return isRetrievalUnavailableError(error);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROOF AND SOURCE BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

function provenanceFromCard(card) {
  const provenance = card.provenance ?? {};
  return {
    status: provenance.status ?? 'unknown',
    sourceUrl: provenance.sourceUrl ?? null,
    licenseStatus: provenance.licenseStatus ?? 'unknown',
    rightsKnown: provenance.rightsKnown === true,
    useLabel: provenance.rightsKnown === true
      ? 'transformed-reference'
      : 'rights-unknown',
  };
}

function sourceDescriptor(card, hydration, role) {
  const provenanceUseLabel = provenanceFromCard(card);
  return {
    sourceId: card.id,
    generationHash: card.generationHash,
    contentHash: card.contentHash,
    sourceUrl: provenanceUseLabel.sourceUrl,
    role,
    provenanceUseLabel,
    artifactHashes: hydration.artifacts.map((artifact) => ({
      path: artifact.path,
      sha256: artifact.sha256,
      truncated: artifact.truncated,
    })),
  };
}

function handoffSourceReference(source) {
  return {
    sourceId: source.sourceId,
    generationHash: source.generationHash,
    contentHash: source.contentHash,
    role: source.role,
    rightsState: source.provenanceUseLabel.rightsKnown ? 'known' : 'unknown',
  };
}

function positiveProofHandoff(generationIdentity, source) {
  const isRightsKnown = source.provenanceUseLabel.rightsKnown;
  return {
    generationIdentity,
    sourceIdentity: {
      sourceId: source.sourceId,
      contentHash: source.contentHash,
      sourceUrl: source.sourceUrl,
    },
    provenanceUseLabel: source.provenanceUseLabel,
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

function negativeProofHandoff(contextPlan, outcome) {
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

function authorityPreservation(authorityInputs, decisions, authoritySnapshot) {
  const snapshotUnchanged = isDeepStrictEqual(authoritySnapshot, authorityInputs);
  const locks = AUTHORITY_INPUT_KEYS.map((key) => {
    const lock = authorityInputs[key];
    const isPreserved = snapshotUnchanged
      && lock.state === 'locked'
      && !decisions.some((decision) => decision.targetAuthority === lock.authority);
    return {
      authority: lock.authority,
      lockId: lock.lockId,
      state: isPreserved ? 'preserved' : 'violated',
    };
  });
  return {
    order: [...AUTHORITY_ORDER],
    locks,
    allPreserved: locks.every((lock) => lock.state === 'preserved'),
  };
}

function validateBuiltProof(proofHandoff) {
  const validation = validateProofHandoffRecord(proofHandoff);
  if (!validation.valid) {
    return { ok: false, error: 'invalid-proof-handoff', details: validation.errors };
  }
  return null;
}

function fallbackResult(contextPlan, outcome, authorityInputs, warnings = []) {
  const proofHandoff = negativeProofHandoff(contextPlan, outcome);
  const proofError = validateBuiltProof(proofHandoff);
  if (proofError) return proofError;
  const authoritySnapshot = structuredClone(authorityInputs);
  return {
    ok: true,
    outcome,
    relationalExemplar: {
      schemaVersion: INTERFACE_RELATIONAL_EXEMPLAR_VERSION,
      anchor: null,
      secondary: null,
      relations: [],
    },
    handoff: {
      schemaVersion: INTERFACE_DECISION_HANDOFF_VERSION,
      decisions: [],
      sources: [],
      counterfactual: null,
      authorityPreservation: authorityPreservation(authorityInputs, [], authoritySnapshot),
      averagedTokenValues: false,
      copiedSourceSpecificMaterial: false,
      proofHandoff,
    },
    warnings,
  };
}

async function hydrateCard(card, mode, maximumBytes, engineOptions) {
  try {
    return await runHydrate({
      id: card.id,
      generationHash: card.generationHash,
      mode,
      usage: 'reference',
      includes: ['DESIGN.md', 'source.md'],
      maxBytes: maximumBytes,
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
 * Build one relational exemplar while keeping all source bodies out of the handoff.
 *
 * @param {Object} input - Neutral plan, typed mode decisions, and immutable authority locks.
 * @param {Object} engineOptions - Retrieval-engine corpus and manifest paths.
 * @returns {Promise<Object>} Grounded exemplar, valid negative outcome, or refusal.
 */
export async function buildRelationalExemplar(input, engineOptions = {}) {
  const requestErrors = validateInterfaceRequest(input);
  if (requestErrors.length > 0) {
    return { ok: false, error: 'invalid-interface-request', details: requestErrors };
  }
  const request = immutableSnapshot(input);
  const authoritySnapshot = request.authorityInputs;
  const blockedOutcome = blockingPlanOutcome(request.contextPlan);
  if (blockedOutcome) {
    return fallbackResult(request.contextPlan, blockedOutcome, request.authorityInputs);
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
    return fallbackResult(
      request.contextPlan,
      'no-fit',
      request.authorityInputs,
      [`retrieval-unavailable:${error.code ?? 'invalid-manifest'}`],
    );
  }
  if (query.generationHash !== request.contextPlan.generationIdentity.observedGenerationHash) {
    return fallbackResult(
      request.contextPlan,
      'no-fit',
      request.authorityInputs,
      ['retrieval-unavailable:generation-mismatch'],
    );
  }
  const anchorCard = query.cards.find((card) => card.id === request.selection.anchorId);
  if (!anchorCard) {
    return fallbackResult(request.contextPlan, 'no-fit', request.authorityInputs);
  }
  if (!request.modeDecision) {
    return {
      ok: false,
      error: 'invalid-mode-decision',
      details: ['modeDecision:required-for-grounded-result'],
    };
  }

  const anchorHydration = await hydrateCard(
    anchorCard,
    'interface',
    ANCHOR_HYDRATION_BYTES,
    engineOptions,
  );
  if (!anchorHydration.ok) {
    if (!HYDRATION_UNAVAILABLE_CODES.has(anchorHydration.error)) {
      return { ok: false, error: `anchor-${anchorHydration.error}` };
    }
    return fallbackResult(
      request.contextPlan,
      'no-fit',
      request.authorityInputs,
      [`anchor-unavailable:${anchorHydration.error}`],
    );
  }
  const anchor = sourceDescriptor(anchorCard, anchorHydration, 'anchor');

  let secondary = null;
  let secondaryBinding = null;
  const warnings = [];
  if (request.selection.secondary) {
    const secondaryCard = query.cards.find(
      (card) => card.id === request.selection.secondary.id,
    );
    if (!secondaryCard) {
      warnings.push('secondary-unavailable');
    } else {
      const secondaryHydration = await hydrateCard(
        secondaryCard,
        'interface',
        SECONDARY_HYDRATION_BYTES,
        engineOptions,
      );
      if (secondaryHydration.ok) {
        secondaryBinding = { card: secondaryCard, hydration: secondaryHydration };
        secondary = sourceDescriptor(
          secondaryCard,
          secondaryHydration,
          request.selection.secondary.role,
        );
      } else if (HYDRATION_UNAVAILABLE_CODES.has(secondaryHydration.error)) {
        warnings.push(`secondary-${secondaryHydration.error}`);
      } else {
        return { ok: false, error: `secondary-${secondaryHydration.error}` };
      }
    }
  }

  const availableRoles = new Set(['anchor', ...(secondary ? [secondary.role] : [])]);
  const unavailableRole = request.modeDecision.decisions
    .flatMap((decision) => decision.sourceRoles)
    .find((role) => !availableRoles.has(role));
  if (unavailableRole) {
    return { ok: false, error: 'decision-source-unavailable', details: [unavailableRole] };
  }
  const hydratedSourcesByRole = new Map([
    ['anchor', { card: anchorCard, hydration: anchorHydration }],
    ...(secondary ? [[secondary.role, secondaryBinding]] : []),
  ]);
  const attestationErrors = [];
  for (const attestation of request.modeDecision.attestations) {
    const hydratedSource = hydratedSourcesByRole.get(attestation.evidence.sourceRole);
    if (!hydratedSource?.hydration?.ok) {
      attestationErrors.push(`${attestation.evidence.sourceRole}:source-not-hydrated`);
      continue;
    }
    const result = validateHydratedSourceAttestation(
      attestation,
      hydratedSource.card,
      hydratedSource.hydration,
      { fence: DECISION_EVIDENCE_FENCE, validateEvidence: validateDecisionEvidence },
    );
    attestationErrors.push(...result.errors.map((error) => (
      `${attestation.evidence.decisionId}:${attestation.evidence.sourceRole}:${error}`
    )));
  }
  if (attestationErrors.length > 0) {
    return { ok: false, error: 'decision-attestation-rejected', details: attestationErrors };
  }
  if (!isDeepStrictEqual(authoritySnapshot, input.authorityInputs)) {
    return { ok: false, error: 'authority-input-mutated' };
  }

  const proofHandoff = positiveProofHandoff(
    request.contextPlan.generationIdentity,
    anchor,
  );
  const proofError = validateBuiltProof(proofHandoff);
  if (proofError) return proofError;
  const sources = [anchor, ...(secondary ? [secondary] : [])];
  const decisions = structuredClone(request.modeDecision.decisions);
  const preservation = authorityPreservation(
    request.authorityInputs,
    decisions,
    authoritySnapshot,
  );
  if (!preservation.allPreserved) {
    return { ok: false, error: 'locked-authority-not-preserved' };
  }

  return {
    ok: true,
    outcome: 'grounded',
    relationalExemplar: {
      schemaVersion: INTERFACE_RELATIONAL_EXEMPLAR_VERSION,
      anchor,
      secondary,
      relations: decisions,
    },
    handoff: {
      schemaVersion: INTERFACE_DECISION_HANDOFF_VERSION,
      decisions,
      sources: sources.map(handoffSourceReference),
      counterfactual: structuredClone(request.modeDecision.counterfactual),
      authorityPreservation: preservation,
      averagedTokenValues: false,
      copiedSourceSpecificMaterial: false,
      proofHandoff,
    },
    warnings,
  };
}

/**
 * Return the shared field names used by the interface proof record.
 *
 * @returns {string[]} Stable common proof/handoff fields.
 */
export function interfaceProofHandoffFields() {
  return [...COMMON_PROOF_HANDOFF_FIELDS];
}
