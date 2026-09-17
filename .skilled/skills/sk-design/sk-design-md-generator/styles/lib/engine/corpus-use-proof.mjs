// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Corpus Use Proof Gate                                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const CORPUS_USE_PROOF_SCHEMA = 'CORPUS_USE_PROOF v1';

const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function requireString(errors, value, field) {
  if (!isNonEmptyString(value)) errors.push(`${field}:required`);
}

function resolveBinding(binding, selectedStyleId) {
  const manifest = binding?.manifest
    ?? (Array.isArray(binding?.styles) ? binding : null);
  if (manifest) {
    return {
      generationHash: manifest.generationHash,
      record: manifest.styles.find((style) => style.id === selectedStyleId) ?? null,
    };
  }
  const selectedCandidate = binding?.selectedCandidate
    ?? binding?.candidate
    ?? (binding?.id ? binding : null);
  if (!selectedCandidate || selectedCandidate.id !== selectedStyleId) {
    return null;
  }
  return {
    generationHash: selectedCandidate.generationHash,
    record: selectedCandidate,
  };
}

function validateBinding(errors, proof, binding) {
  const rationale = proof.selectionRationale ?? {};
  const fingerprint = proof.coherentFingerprint ?? {};
  const provenance = proof.provenanceAntiCopy ?? {};
  const resolved = resolveBinding(binding, rationale.selectedStyleId);
  if (!resolved) {
    errors.push('binding:selected-style-not-found');
    return;
  }
  if (!resolved.record) {
    errors.push('binding:selected-style-not-found');
    return;
  }
  if (fingerprint.generationHash !== resolved.generationHash) {
    errors.push('coherentFingerprint.generationHash:mismatch');
  }
  if (fingerprint.contentHash !== resolved.record.contentHash) {
    errors.push('coherentFingerprint.contentHash:mismatch');
  }
  if (provenance.sourceUrl !== resolved.record.provenance?.sourceUrl) {
    errors.push('provenanceAntiCopy.sourceUrl:mismatch');
  }
  if (provenance.licenseStatus !== resolved.record.provenance?.licenseStatus) {
    errors.push('provenanceAntiCopy.licenseStatus:mismatch');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate the evidence required for any corpus-influenced ready claim.
 *
 * @param {Object} proof - Corpus use proof card.
 * @param {Object} binding - Current manifest or selected candidate binding.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateCorpusUseProof(proof, binding) {
  const errors = [];
  if (!proof || typeof proof !== 'object' || Array.isArray(proof)) {
    return { valid: false, errors: ['proof:required'] };
  }
  if (proof.schemaVersion !== CORPUS_USE_PROOF_SCHEMA) {
    errors.push('schemaVersion:invalid');
  }

  const authority = proof.authority ?? {};
  if (authority.eligibilityFirst !== true) errors.push('authority.eligibilityFirst:required');
  if (authority.scoresOnlyOrder !== true) errors.push('authority.scoresOnlyOrder:required');
  if (authority.oneCoherentAnchor !== true) errors.push('authority.oneCoherentAnchor:required');

  const rationale = proof.selectionRationale ?? {};
  requireString(errors, rationale.selectedStyleId, 'selectionRationale.selectedStyleId');
  requireString(errors, rationale.reason, 'selectionRationale.reason');

  const fingerprint = proof.coherentFingerprint ?? {};
  if (!HASH_PATTERN.test(fingerprint.generationHash ?? '')) {
    errors.push('coherentFingerprint.generationHash:invalid');
  }
  if (!HASH_PATTERN.test(fingerprint.contentHash ?? '')) {
    errors.push('coherentFingerprint.contentHash:invalid');
  }
  if (fingerprint.styleId !== rationale.selectedStyleId) {
    errors.push('coherentFingerprint.styleId:mismatch');
  }

  const delta = proof.transformationDelta ?? {};
  requireString(errors, delta.summary, 'transformationDelta.summary');
  if (delta.averagedTokenValues !== false) {
    errors.push('transformationDelta.averagedTokenValues:must-be-false');
  }
  if (delta.copiedSourceSpecificMaterial !== false) {
    errors.push('transformationDelta.copiedSourceSpecificMaterial:must-be-false');
  }

  const provenance = proof.provenanceAntiCopy ?? {};
  requireString(errors, provenance.sourceUrl, 'provenanceAntiCopy.sourceUrl');
  requireString(errors, provenance.licenseStatus, 'provenanceAntiCopy.licenseStatus');
  if (provenance.antiCopyConfirmed !== true) {
    errors.push('provenanceAntiCopy.antiCopyConfirmed:required');
  }

  const application = proof.applicationProof ?? {};
  requireString(errors, application.target, 'applicationProof.target');
  requireString(errors, application.summary, 'applicationProof.summary');
  if (application.verified !== true) errors.push('applicationProof.verified:required');

  validateBinding(errors, proof, binding);

  return { valid: errors.length === 0, errors };
}

/**
 * Block a ready claim whenever corpus influence lacks valid evidence.
 *
 * @param {Object} input - Influence flag and proof card.
 * @param {boolean} input.corpusInfluenced - Whether corpus material influenced output.
 * @param {Object} [input.proof] - Corpus use proof card.
 * @param {Object} [input.manifest] - Current manifest binding.
 * @param {Object} [input.selectedCandidate] - Selected candidate-card binding.
 * @returns {{ready:boolean,error?:string,errors?:string[]}} Ready-gate decision.
 */
export function gateCorpusInfluencedReadyClaim(input) {
  if (input?.corpusInfluenced !== true) return { ready: true };
  const validation = validateCorpusUseProof(input.proof, {
    manifest: input.manifest,
    selectedCandidate: input.selectedCandidate,
  });
  if (!validation.valid) {
    return {
      ready: false,
      error: 'corpus-use-proof-required',
      errors: validation.errors,
    };
  }
  return { ready: true };
}
