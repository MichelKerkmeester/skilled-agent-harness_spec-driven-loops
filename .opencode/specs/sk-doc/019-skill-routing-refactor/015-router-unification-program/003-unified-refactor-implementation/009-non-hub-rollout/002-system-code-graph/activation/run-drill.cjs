'use strict';

const assert = require('node:assert/strict');

const {
  ActivationManifestError,
  fencedSwapInMemory,
  manifestBytes,
  pinManifest,
  validateActivationManifest,
} = require('../../../001-compiler-n1-shadow/activation/fenced-manifest.cjs');
const { sha256Bytes } = require('../harness/support.cjs');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function captureError(callback) {
  try {
    callback();
    return null;
  } catch (error) {
    return error;
  }
}

function runActivationDrill(input) {
  const priorManifest = validateActivationManifest(input.priorManifest, 'prior manifest');
  const candidateManifest = validateActivationManifest(input.candidateManifest, 'candidate manifest');
  const priorBytes = manifestBytes(priorManifest);
  const priorHash = sha256Bytes(priorBytes);
  const priorPin = pinManifest(priorManifest);
  const initialState = { fencingEpoch: 0, manifest: clone(priorManifest) };

  const staleError = captureError(() => fencedSwapInMemory({
    expectedCurrent: clone(priorManifest.selectedPolicy),
    expectedFencingEpoch: 9,
    nextManifest: candidateManifest,
    state: initialState,
    token: 'stale-attempt',
  }));
  assert.ok(staleError instanceof ActivationManifestError);
  assert.equal(staleError.code, 'STALE_FENCING_EPOCH');

  const authorityError = captureError(() => fencedSwapInMemory({
    expectedCurrent: clone(priorManifest.selectedPolicy),
    expectedFencingEpoch: 0,
    nextManifest: { ...candidateManifest, servingAuthority: 'compiled', shadowOnly: false },
    state: initialState,
    token: 'authority-attempt',
  }));
  assert.ok(authorityError instanceof ActivationManifestError);
  assert.equal(authorityError.code, 'AUTHORITY_BEARING_MANIFEST');

  const activeState = fencedSwapInMemory({
    expectedCurrent: clone(priorManifest.selectedPolicy),
    expectedFencingEpoch: 0,
    nextManifest: candidateManifest,
    state: initialState,
    token: 'activate-generation',
  });
  const activePin = pinManifest(activeState.manifest);
  assert.equal(activePin.generation, input.policy.activationGeneration);
  assert.equal(activePin.effectivePolicyHash, input.policy.effectivePolicyHash);
  assert.equal(priorPin.generation, 0);

  const restoredState = fencedSwapInMemory({
    expectedCurrent: clone(candidateManifest.selectedPolicy),
    expectedFencingEpoch: 1,
    nextManifest: priorManifest,
    state: activeState,
    token: 'rollback-generation',
  });
  const restoredBytes = manifestBytes(restoredState.manifest);
  const restoredHash = sha256Bytes(restoredBytes);
  assert.ok(restoredBytes.equals(priorBytes));
  assert.equal(restoredHash, priorHash);
  assert.equal(restoredState.fencingEpoch, 2);

  const replayError = captureError(() => fencedSwapInMemory({
    expectedCurrent: clone(priorManifest.selectedPolicy),
    expectedFencingEpoch: 0,
    nextManifest: candidateManifest,
    state: restoredState,
    token: 'replayed-epoch',
  }));
  assert.ok(replayError instanceof ActivationManifestError);
  assert.equal(replayError.code, 'STALE_FENCING_EPOCH');

  return {
    activePin,
    authorityRejected: true,
    fencingEpoch: restoredState.fencingEpoch,
    priorHash,
    priorPin,
    restoredHash,
    staleRejected: true,
  };
}

module.exports = {
  runActivationDrill,
};
