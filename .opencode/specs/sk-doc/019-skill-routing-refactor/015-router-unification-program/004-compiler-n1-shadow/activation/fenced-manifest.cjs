// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: FENCED ACTIVATION MANIFEST                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { canonicalize } = require('../../000-contract-schemas/lib/canonical.cjs');

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;

class ActivationManifestError extends Error {
  constructor(code, element, message, cause) {
    super(message, cause ? { cause } : undefined);
    this.name = 'ActivationManifestError';
    this.code = code;
    this.element = element;
    Object.setPrototypeOf(this, ActivationManifestError.prototype);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function manifestBytes(manifest) {
  return Buffer.from(`${canonicalize(validateActivationManifest(manifest))}\n`, 'utf8');
}

/**
 * Encode the monotonic fence independently from rollback-restorable manifest bytes.
 *
 * @param {number} fencingEpoch - Last consumed activation epoch.
 * @returns {Buffer} Canonical fence-state bytes.
 */
function fenceStateBytes(fencingEpoch) {
  if (!Number.isSafeInteger(fencingEpoch) || fencingEpoch < 0) {
    throw new TypeError('fencing epoch must be a non-negative integer');
  }
  return Buffer.from(`${canonicalize({ fencingEpoch, schemaVersion: 'V1' })}\n`, 'utf8');
}

function assertToken(token) {
  if (typeof token !== 'string' || !/^[a-z0-9-]{1,64}$/.test(token)) {
    throw new TypeError('fencing token must contain only lowercase letters, digits, or hyphens');
  }
}

function assertExactKeys(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ActivationManifestError(
      'INVALID_ACTIVATION_MANIFEST',
      label,
      `${label} must be an object`,
    );
  }
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (canonicalize(actual) !== canonicalize(expected)) {
    throw new ActivationManifestError(
      'INVALID_ACTIVATION_MANIFEST',
      label,
      `${label} has missing or unsupported fields`,
    );
  }
}

function validateActivationManifest(value, label = 'activation manifest') {
  let manifest;
  try {
    manifest = JSON.parse(canonicalize(value));
  } catch (error) {
    throw new ActivationManifestError(
      'INVALID_ACTIVATION_MANIFEST',
      label,
      `${label} must contain canonical JSON values`,
      error,
    );
  }
  assertExactKeys(
    manifest,
    new Set(['schemaVersion', 'selectedPolicy', 'servingAuthority', 'shadowOnly']),
    label,
  );
  if (manifest.schemaVersion !== 'V1') {
    throw new ActivationManifestError(
      'INVALID_ACTIVATION_MANIFEST',
      `${label}.schemaVersion`,
      `${label} must use schema version V1`,
    );
  }
  assertExactKeys(
    manifest.selectedPolicy,
    new Set(['effectivePolicyHash', 'generation']),
    `${label}.selectedPolicy`,
  );
  const { effectivePolicyHash, generation } = manifest.selectedPolicy;
  if (!Number.isSafeInteger(generation) || generation < 0) {
    throw new ActivationManifestError(
      'INVALID_ACTIVATION_MANIFEST',
      `${label}.selectedPolicy.generation`,
      'selected policy generation must be a non-negative integer',
    );
  }
  if (effectivePolicyHash !== null && !DIGEST_PATTERN.test(effectivePolicyHash)) {
    throw new ActivationManifestError(
      'INVALID_ACTIVATION_MANIFEST',
      `${label}.selectedPolicy.effectivePolicyHash`,
      'selected policy hash must be null or a lowercase SHA-256 digest',
    );
  }
  if ((generation === 0) !== (effectivePolicyHash === null)) {
    throw new ActivationManifestError(
      'INVALID_ACTIVATION_MANIFEST',
      `${label}.selectedPolicy`,
      'generation zero and a null policy hash must appear together',
    );
  }
  if (manifest.servingAuthority !== 'legacy' || manifest.shadowOnly !== true) {
    throw new ActivationManifestError(
      'AUTHORITY_BEARING_MANIFEST',
      label,
      `${label} must retain legacy serving authority and shadow-only execution`,
    );
  }
  return manifest;
}

function parseManifest(bytes, label) {
  let manifest;
  try {
    manifest = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new ActivationManifestError(
      'INVALID_ACTIVATION_MANIFEST',
      label,
      `${label} is not valid JSON`,
      error,
    );
  }
  return validateActivationManifest(manifest, label);
}

function parseFenceState(bytes, label) {
  let state;
  try {
    state = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new Error(`${label} is not valid JSON`, { cause: error });
  }
  if (
    !state
    || state.schemaVersion !== 'V1'
    || !Number.isSafeInteger(state.fencingEpoch)
    || state.fencingEpoch < 0
  ) {
    throw new Error(`${label} has an invalid fencing epoch`);
  }
  return state;
}

function fsyncDirectory(directory) {
  const descriptor = fs.openSync(directory, 'r');
  try {
    fs.fsyncSync(descriptor);
  } finally {
    fs.closeSync(descriptor);
  }
}

function assertExpectedCurrent(manifest, expectedCurrent) {
  assertExactKeys(
    expectedCurrent,
    new Set(['effectivePolicyHash', 'generation']),
    'expectedCurrent',
  );
  if (canonicalize(manifest.selectedPolicy) !== canonicalize(expectedCurrent)) {
    throw new ActivationManifestError(
      'MANIFEST_CAS_MISMATCH',
      'selectedPolicy',
      'activation manifest generation/hash changed before rename',
    );
  }
}

function pinManifest(manifest) {
  const validated = validateActivationManifest(manifest);
  return Object.freeze({
    effectivePolicyHash: validated.selectedPolicy.effectivePolicyHash,
    generation: validated.selectedPolicy.generation,
    servingAuthority: validated.servingAuthority,
    shadowOnly: validated.shadowOnly,
  });
}

function fencedSwapInMemory(input) {
  assertToken(input.token);
  if (!Number.isSafeInteger(input.expectedFencingEpoch) || input.expectedFencingEpoch < 0) {
    throw new TypeError('expected fencing epoch must be a non-negative integer');
  }
  if (!Number.isSafeInteger(input.state?.fencingEpoch) || input.state.fencingEpoch < 0) {
    throw new TypeError('state fencing epoch must be a non-negative integer');
  }
  const currentManifest = validateActivationManifest(input.state.manifest);
  const nextManifest = validateActivationManifest(input.nextManifest, 'replacement manifest');
  if (input.state.fencingEpoch !== input.expectedFencingEpoch) {
    throw new ActivationManifestError(
      'STALE_FENCING_EPOCH',
      'fencingEpoch',
      `stale fencing epoch: expected ${input.expectedFencingEpoch}, `
        + `found ${input.state.fencingEpoch}`,
    );
  }
  assertExpectedCurrent(currentManifest, input.expectedCurrent);
  return Object.freeze({
    fencingEpoch: input.expectedFencingEpoch + 1,
    manifest: Object.freeze(nextManifest),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FENCED SWAP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Atomically replace a manifest after an exclusive token and final epoch check.
 *
 * @param {Object} input - Fenced swap parameters.
 * @param {string} [input.fencePath] - Monotonic fence-state path.
 * @param {string} input.manifestPath - Existing manifest path.
 * @param {Buffer} input.nextBytes - Complete replacement bytes.
 * @param {number} input.expectedFencingEpoch - Current epoch required by the CAS.
 * @param {Object} input.expectedCurrent - Selected generation/hash required by the CAS.
 * @param {string} input.token - Exclusive operation token.
 * @returns {Object} Parsed installed manifest.
 */
function atomicFencedSwap(input) {
  const {
    fencePath = path.join(path.dirname(input.manifestPath), 'fence-state.json'),
    manifestPath,
    nextBytes,
    expectedFencingEpoch,
    expectedCurrent,
    token,
  } = input;
  assertToken(token);
  if (!Buffer.isBuffer(nextBytes)) throw new TypeError('nextBytes must be a Buffer');
  if (!Number.isSafeInteger(expectedFencingEpoch) || expectedFencingEpoch < 0) {
    throw new TypeError('expected fencing epoch must be a non-negative integer');
  }

  const directory = path.dirname(manifestPath);
  const lockPath = path.join(directory, '.activation.lock');
  const temporaryPath = path.join(directory, `.manifest-${token}.tmp`);
  const temporaryFencePath = path.join(directory, `.fence-${token}.tmp`);
  const nextManifest = parseManifest(nextBytes, 'replacement manifest');
  const initialManifest = parseManifest(
    fs.readFileSync(manifestPath),
    'current activation manifest',
  );
  assertExpectedCurrent(initialManifest, expectedCurrent);
  let lockDescriptor;
  let hasLock = false;
  try {
    lockDescriptor = fs.openSync(lockPath, 'wx', 0o600);
    hasLock = true;
    const lockBytes = Buffer.from(`${canonicalize({ expectedFencingEpoch, token })}\n`, 'utf8');
    fs.writeFileSync(lockDescriptor, lockBytes);
    fs.fsyncSync(lockDescriptor);

    const currentFence = parseFenceState(fs.readFileSync(fencePath), 'fence state');
    if (currentFence.fencingEpoch !== expectedFencingEpoch) {
      throw new Error(
        `stale fencing epoch: expected ${expectedFencingEpoch}, found ${currentFence.fencingEpoch}`,
      );
    }
    fs.writeFileSync(temporaryPath, nextBytes, { flag: 'wx', mode: 0o600 });
    const temporaryDescriptor = fs.openSync(temporaryPath, 'r');
    try {
      fs.fsyncSync(temporaryDescriptor);
    } finally {
      fs.closeSync(temporaryDescriptor);
    }

    const nextFenceBytes = fenceStateBytes(expectedFencingEpoch + 1);
    fs.writeFileSync(temporaryFencePath, nextFenceBytes, { flag: 'wx', mode: 0o600 });
    const fenceDescriptor = fs.openSync(temporaryFencePath, 'r');
    try {
      fs.fsyncSync(fenceDescriptor);
    } finally {
      fs.closeSync(fenceDescriptor);
    }
    fs.renameSync(temporaryFencePath, fencePath);
    fsyncDirectory(directory);

    // A consumed epoch is never rolled back, so restored manifest bytes cannot reopen an ABA window.
    const heldLock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    const advancedFence = parseFenceState(fs.readFileSync(fencePath), 'advanced fence state');
    if (heldLock.token !== token || heldLock.expectedFencingEpoch !== expectedFencingEpoch) {
      throw new Error('fencing token changed before rename');
    }
    if (advancedFence.fencingEpoch !== expectedFencingEpoch + 1) {
      throw new Error(
        `fencing epoch did not advance: expected ${expectedFencingEpoch + 1}, `
          + `found ${advancedFence.fencingEpoch}`,
      );
    }
    const currentManifest = parseManifest(
      fs.readFileSync(manifestPath),
      'current activation manifest',
    );
    assertExpectedCurrent(currentManifest, expectedCurrent);
    fs.renameSync(temporaryPath, manifestPath);
    fsyncDirectory(directory);
    return nextManifest;
  } finally {
    if (lockDescriptor !== undefined) fs.closeSync(lockDescriptor);
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
    if (fs.existsSync(temporaryFencePath)) fs.unlinkSync(temporaryFencePath);
    if (hasLock && fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
  }
}

/**
 * Pin one immutable manifest generation for the lifetime of a request.
 *
 * @param {string} manifestPath - Activation manifest path.
 * @returns {Readonly<Object>} Frozen request pin.
 */
function pinRequest(manifestPath) {
  const manifest = parseManifest(fs.readFileSync(manifestPath), 'activation manifest');
  return pinManifest(manifest);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ActivationManifestError,
  atomicFencedSwap,
  fenceStateBytes,
  fencedSwapInMemory,
  manifestBytes,
  pinManifest,
  pinRequest,
  validateActivationManifest,
};
