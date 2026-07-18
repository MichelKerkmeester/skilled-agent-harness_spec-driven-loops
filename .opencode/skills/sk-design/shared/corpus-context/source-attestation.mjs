// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Hydrated Source Attestation                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { isDeepStrictEqual } from 'node:util';

export const SOURCE_ATTESTATION_KEYS = Object.freeze([
  'schemaVersion',
  'mode',
  'sourceId',
  'generationHash',
  'contentHash',
  'artifactPath',
  'artifactHash',
  'evidence',
]);

const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const ARTIFACT_PATH_PATTERN = /^[^/\\]+\/(?:DESIGN\.md|source\.md|design-tokens\.json)$/;

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function typedEvidenceRecords(content, fence) {
  const records = [];
  const pattern = new RegExp(
    '```' + escapePattern(fence) + '\\s*\\n([\\s\\S]*?)\\n```',
    'g',
  );
  for (const match of content.matchAll(pattern)) {
    try {
      records.push(JSON.parse(match[1]));
    } catch {
      records.push(null);
    }
  }
  return records;
}

/**
 * Validate the common closed attestation envelope before retrieval.
 *
 * @param {string[]} errors - Mutable validation error collection.
 * @param {Object} attestation - Caller-supplied source attestation.
 * @param {string} path - Stable validation path.
 * @param {Object} expected - Mode, version, generation, source, and evidence validator.
 * @returns {void}
 */
export function validateSourceAttestation(errors, attestation, path, expected) {
  if (!isPlainObject(attestation)) {
    errors.push(`${path}:required-object`);
    return;
  }
  for (const key of SOURCE_ATTESTATION_KEYS) {
    if (!Object.hasOwn(attestation, key)) errors.push(`${path}.${key}:required`);
  }
  for (const key of Reflect.ownKeys(attestation)) {
    if (!SOURCE_ATTESTATION_KEYS.includes(key)) errors.push(`${path}.${String(key)}:unexpected`);
  }
  if (attestation.schemaVersion !== expected.schemaVersion) {
    errors.push(`${path}.schemaVersion:invalid`);
  }
  if (attestation.mode !== expected.mode) errors.push(`${path}.mode:invalid`);
  if (attestation.sourceId !== expected.sourceId) errors.push(`${path}.sourceId:claim-mismatch`);
  if (attestation.generationHash !== expected.generationHash) {
    errors.push(`${path}.generationHash:context-mismatch`);
  }
  if (!HASH_PATTERN.test(attestation.contentHash ?? '')) {
    errors.push(`${path}.contentHash:invalid-hash`);
  }
  if (!HASH_PATTERN.test(attestation.artifactHash ?? '')) {
    errors.push(`${path}.artifactHash:invalid-hash`);
  }
  if (!ARTIFACT_PATH_PATTERN.test(attestation.artifactPath ?? '')) {
    errors.push(`${path}.artifactPath:invalid`);
  }
  expected.validateEvidence(errors, attestation.evidence, `${path}.evidence`);
}

/**
 * Bind a validated claim to the exact hydrated artifact and typed evidence record.
 *
 * @param {Object} attestation - Closed source attestation.
 * @param {Object} card - Selected retrieval card.
 * @param {Object} hydration - Generation-guarded hydrated artifacts.
 * @param {Object} expected - Typed fence and evidence validator.
 * @returns {{valid:boolean,errors:string[]}} Stable binding result.
 */
export function validateHydratedSourceAttestation(attestation, card, hydration, expected) {
  const errors = [];
  if (attestation.sourceId !== card.id) errors.push('sourceId:card-mismatch');
  if (attestation.generationHash !== card.generationHash) {
    errors.push('generationHash:card-mismatch');
  }
  if (attestation.generationHash !== hydration.generationHash) {
    errors.push('generationHash:hydration-mismatch');
  }
  if (attestation.contentHash !== card.contentHash) errors.push('contentHash:card-mismatch');
  const artifact = hydration.artifacts.find((entry) => entry.path === attestation.artifactPath);
  if (!artifact) {
    errors.push('artifactPath:not-hydrated');
    return { valid: false, errors };
  }
  if (artifact.sha256 !== attestation.artifactHash) errors.push('artifactHash:mismatch');
  if (artifact.truncated) errors.push('artifact:truncated');
  const hasMatchingEvidence = typedEvidenceRecords(artifact.content, expected.fence).some((record) => {
    const recordErrors = [];
    expected.validateEvidence(recordErrors, record, 'sourceEvidence');
    return recordErrors.length === 0 && isDeepStrictEqual(record, attestation.evidence);
  });
  if (!hasMatchingEvidence) errors.push('sourceEvidence:not-attested-by-artifact');
  return { valid: errors.length === 0, errors };
}
