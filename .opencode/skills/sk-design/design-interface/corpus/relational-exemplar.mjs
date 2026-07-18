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
import { runHydrate, runQuery } from '../../styles/_engine/style-library.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const INTERFACE_RELATIONAL_EXEMPLAR_VERSION = 'INTERFACE_RELATIONAL_EXEMPLAR v2';
export const INTERFACE_DECISION_HANDOFF_VERSION = 'INTERFACE_DECISION_HANDOFF v2';

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
const RETRIEVAL_UNAVAILABLE_CODES = Object.freeze(new Set([
  'manifest-missing',
  'manifest-stale',
  'ENOENT',
]));
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

function validateModeDecision(modeDecision, authorityInputs) {
  const errors = [];
  if (!validateExactKeys(
    errors,
    modeDecision,
    'modeDecision',
    ['decisions', 'counterfactual'],
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
    errors.push(...validateModeDecision(input.modeDecision, input.authorityInputs));
  }
  return errors;
}

function isKnownRetrievalUnavailable(error) {
  return error instanceof SyntaxError || RETRIEVAL_UNAVAILABLE_CODES.has(error?.code);
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

function positiveProofHandoff(generationIdentity, source, decisionCount) {
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
      state: 'transformed',
      summary: `${decisionCount} target-owned relational decisions recorded without source literals.`,
      copiedSourceSpecificMaterial: false,
    },
    fallback: {
      state: isRightsKnown ? 'not-needed' : 'target-derived',
      reason: isRightsKnown
        ? 'A bounded transformed reference informed target-owned decisions.'
        : 'Unknown rights keep all source-specific material out of the target.',
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
      summary: 'No corpus source influenced target decisions.',
      copiedSourceSpecificMaterial: false,
    },
    fallback: {
      state: isUnavailable ? 'ordinary-workflow' : 'target-derived',
      reason: isUnavailable
        ? 'Corpus evidence is unavailable; the ordinary interface workflow remains active.'
        : 'No coherent reference fit; direction remains target-derived.',
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
  const authoritySnapshot = structuredClone(input.authorityInputs);
  if (input.contextPlan.availability === 'unavailable') {
    return fallbackResult(input.contextPlan, 'unavailable', input.authorityInputs);
  }

  let query;
  try {
    query = await runQuery({
      ...(input.retrievalRequest ?? {}),
      usage: 'reference',
      exactReuse: false,
      limit: MAX_QUERY_CARDS,
    }, engineOptions);
  } catch (error) {
    if (!isKnownRetrievalUnavailable(error)) throw error;
    return fallbackResult(
      input.contextPlan,
      'no-fit',
      input.authorityInputs,
      [`retrieval-unavailable:${error.code ?? 'invalid-manifest'}`],
    );
  }
  if (query.generationHash !== input.contextPlan.generationIdentity.observedGenerationHash) {
    return fallbackResult(
      input.contextPlan,
      'no-fit',
      input.authorityInputs,
      ['retrieval-unavailable:generation-mismatch'],
    );
  }
  const anchorCard = query.cards.find((card) => card.id === input.selection.anchorId);
  if (!anchorCard) {
    return fallbackResult(input.contextPlan, 'no-fit', input.authorityInputs);
  }
  if (!input.modeDecision) {
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
      input.contextPlan,
      'no-fit',
      input.authorityInputs,
      [`anchor-unavailable:${anchorHydration.error}`],
    );
  }
  const anchor = sourceDescriptor(anchorCard, anchorHydration, 'anchor');

  let secondary = null;
  const warnings = [];
  if (input.selection.secondary) {
    const secondaryCard = query.cards.find(
      (card) => card.id === input.selection.secondary.id,
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
        secondary = sourceDescriptor(
          secondaryCard,
          secondaryHydration,
          input.selection.secondary.role,
        );
      } else if (HYDRATION_UNAVAILABLE_CODES.has(secondaryHydration.error)) {
        warnings.push(`secondary-${secondaryHydration.error}`);
      } else {
        return { ok: false, error: `secondary-${secondaryHydration.error}` };
      }
    }
  }

  const availableRoles = new Set(['anchor', ...(secondary ? [secondary.role] : [])]);
  const unavailableRole = input.modeDecision.decisions
    .flatMap((decision) => decision.sourceRoles)
    .find((role) => !availableRoles.has(role));
  if (unavailableRole) {
    return { ok: false, error: 'decision-source-unavailable', details: [unavailableRole] };
  }
  if (!isDeepStrictEqual(authoritySnapshot, input.authorityInputs)) {
    return { ok: false, error: 'authority-input-mutated' };
  }

  const proofHandoff = positiveProofHandoff(
    input.contextPlan.generationIdentity,
    anchor,
    input.modeDecision.decisions.length,
  );
  const proofError = validateBuiltProof(proofHandoff);
  if (proofError) return proofError;
  const sources = [anchor, ...(secondary ? [secondary] : [])];
  const decisions = structuredClone(input.modeDecision.decisions);
  const preservation = authorityPreservation(
    input.authorityInputs,
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
      counterfactual: structuredClone(input.modeDecision.counterfactual),
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
