// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: FLEET LEGACY-READ CLEANUP                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeRequestFactsHash,
} = require('../../000-contract-schemas/lib/canonical.cjs');
const {
  fenceStateBytes,
} = require('../../001-compiler-n1-shadow/activation/fenced-manifest.cjs');
const {
  evaluate,
} = require('../../002-decision-evaluator/lib/evaluator.cjs');
const {
  scoreRouteGoldReadOnly,
} = require('../../002-decision-evaluator/replay-driver.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND ERRORS
// ─────────────────────────────────────────────────────────────────────────────

const ACTIVATION_ORDER = Object.freeze([
  'mcp-code-mode',
  'sk-code',
  'system-deep-loop',
  'mcp-tooling',
]);
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const APPROVED_PREFLIGHTS = new WeakMap();
const HYPOTHETICAL_PREFLIGHTS = new WeakMap();
const CARD_MARKER = 'fleet-policy-card-v1';
const IMPLEMENTATION_ROOT = path.resolve(__dirname, '..', '..');
const COMMITTED_ACTIVATION_MANIFESTS = Object.freeze([
  {
    filePath: path.join(IMPLEMENTATION_ROOT, '001-compiler-n1-shadow', 'activation', 'manifest.json'),
    skillId: 'mcp-code-mode',
    sourceId: '001-compiler-n1-shadow/activation/manifest.json',
  },
  {
    filePath: path.join(
      IMPLEMENTATION_ROOT,
      '006-parent-hub-rollout',
      '001-sk-code',
      'activation',
      'manifest.json',
    ),
    skillId: 'sk-code',
    sourceId: '006-parent-hub-rollout/001-sk-code/activation/manifest.json',
  },
  {
    filePath: path.join(
      IMPLEMENTATION_ROOT,
      '006-parent-hub-rollout',
      '002-system-deep-loop',
      'activation',
      'manifest.json',
    ),
    skillId: 'system-deep-loop',
    sourceId: '006-parent-hub-rollout/002-system-deep-loop/activation/manifest.json',
  },
  {
    filePath: path.join(
      IMPLEMENTATION_ROOT,
      '006-parent-hub-rollout',
      '003-mcp-tooling',
      'activation',
      'manifest.json',
    ),
    skillId: 'mcp-tooling',
    sourceId: '006-parent-hub-rollout/003-mcp-tooling/activation/manifest.json',
  },
]);

class CleanupError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'CleanupError';
    this.code = code;
    this.details = details;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CANONICAL DATA
// ─────────────────────────────────────────────────────────────────────────────

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function canonicalBytes(value) {
  return Buffer.from(`${canonicalize(value)}\n`, 'utf8');
}

function clone(value) {
  return JSON.parse(canonicalize(value));
}

function assertDigest(value, label) {
  if (!DIGEST_PATTERN.test(value)) {
    throw new CleanupError('INVALID_DIGEST', `${label} must be a lowercase SHA-256 digest`);
  }
}

function assertExactKeys(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new CleanupError('INVALID_SHAPE', `${label} must be an object`);
  }
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (canonicalize(actual) !== canonicalize(expected)) {
    throw new CleanupError('INVALID_SHAPE', `${label} has missing or unsupported fields`);
  }
}

function policyPin(snapshot) {
  const pin = {
    activationGeneration: snapshot.policy.activationGeneration,
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    skillId: snapshot.skillId,
  };
  if (!Number.isSafeInteger(pin.activationGeneration) || pin.activationGeneration < 1) {
    throw new CleanupError('INVALID_POLICY_PIN', `${pin.skillId} has an invalid generation`);
  }
  assertDigest(pin.effectivePolicyHash, `${pin.skillId} effective policy hash`);
  return pin;
}

function validateManifest(value) {
  const manifest = clone(value);
  assertExactKeys(manifest, new Set([
    'bakeWindow',
    'dualReadSkillIds',
    'generation',
    'legacyInputs',
    'policyPins',
    'preflightDigest',
    'resolver',
    'retiredSkillIds',
    'schemaVersion',
    'selectedPolicyHash',
    'servingAuthority',
    'soleResolver',
  ]), 'fleet cleanup manifest');
  if (manifest.schemaVersion !== 'V1') {
    throw new CleanupError('INVALID_MANIFEST', 'fleet cleanup manifest must use schema V1');
  }
  if (!Number.isSafeInteger(manifest.generation) || manifest.generation < 1) {
    throw new CleanupError('INVALID_MANIFEST', 'fleet cleanup generation must be positive');
  }
  assertDigest(manifest.preflightDigest, 'preflight digest');
  assertDigest(manifest.selectedPolicyHash, 'selected policy hash');
  if (manifest.servingAuthority !== 'compiled') {
    throw new CleanupError('INVALID_MANIFEST', 'compiled policy must remain serving-authoritative');
  }
  if (!Array.isArray(manifest.policyPins) || manifest.policyPins.length !== ACTIVATION_ORDER.length) {
    throw new CleanupError('INVALID_MANIFEST', 'all compiled policy pins are required');
  }
  const pinIds = manifest.policyPins.map((pin) => pin.skillId);
  if (canonicalize(pinIds) !== canonicalize(ACTIVATION_ORDER)) {
    throw new CleanupError('INVALID_MANIFEST', 'policy pins are outside activation order');
  }
  if (!Array.isArray(manifest.dualReadSkillIds)
    || !Array.isArray(manifest.retiredSkillIds)
    || !Array.isArray(manifest.legacyInputs)) {
    throw new CleanupError('INVALID_MANIFEST', 'legacy cleanup collections must be arrays');
  }
  const expectedRemaining = ACTIVATION_ORDER.slice(manifest.retiredSkillIds.length);
  if (canonicalize(manifest.retiredSkillIds) !== canonicalize(
    ACTIVATION_ORDER.slice(0, manifest.retiredSkillIds.length),
  ) || canonicalize(manifest.dualReadSkillIds) !== canonicalize(expectedRemaining)) {
    throw new CleanupError('INVALID_MANIFEST', 'retirement order or remaining dual-read set is invalid');
  }
  if (canonicalize(manifest.legacyInputs.map((entry) => entry.skillId))
    !== canonicalize(expectedRemaining)) {
    throw new CleanupError('INVALID_MANIFEST', 'legacy inputs do not match the dual-read set');
  }
  for (const entry of manifest.legacyInputs) {
    assertExactKeys(entry, new Set([
      'aliases',
      'registryAdapterPresent',
      'resolverEntryPresent',
      'skillId',
    ]), `legacy input ${entry.skillId}`);
    if (!Array.isArray(entry.aliases)
      || entry.aliases.some((alias) => typeof alias !== 'string' || alias.length === 0)
      || entry.registryAdapterPresent !== true
      || entry.resolverEntryPresent !== true) {
      throw new CleanupError('INVALID_MANIFEST', `legacy input ${entry.skillId} is incomplete`);
    }
  }
  const finalState = expectedRemaining.length === 0;
  if (manifest.soleResolver !== finalState
    || manifest.resolver !== (finalState ? 'EffectivePolicy' : 'EffectivePolicy+legacy-dual-read')) {
    throw new CleanupError('INVALID_MANIFEST', 'resolver state disagrees with remaining legacy inputs');
  }
  if (!manifest.bakeWindow
    || manifest.bakeWindow.minimumSuccessfulDeletions !== ACTIVATION_ORDER.length
    || manifest.bakeWindow.discardAuthorized !== false) {
    throw new CleanupError('INVALID_MANIFEST', 'the retained-generation bake window is not active');
  }
  return manifest;
}

function manifestBytes(manifest) {
  return canonicalBytes(validateManifest(manifest));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXTERNAL PREFLIGHT
// ─────────────────────────────────────────────────────────────────────────────

function orderPolicySnapshots(policySnapshots) {
  if (!Array.isArray(policySnapshots) || policySnapshots.length !== ACTIVATION_ORDER.length) {
    throw new CleanupError('POLICY_SNAPSHOT_MISSING', 'every fleet policy snapshot is required');
  }
  return ACTIVATION_ORDER.map((skillId) => {
    const snapshot = policySnapshots.find((entry) => entry.skillId === skillId);
    if (!snapshot) throw new CleanupError('POLICY_SNAPSHOT_MISSING', `${skillId} snapshot is absent`);
    return clone(snapshot);
  });
}

function manifestEvidence(skillId, sourceId, bytes) {
  let manifest;
  try {
    manifest = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new CleanupError('PREFLIGHT_MANIFEST_INVALID', `${skillId} activation manifest is invalid JSON`, {
      causeMessage: error.message,
      skillId,
      sourceId,
    });
  }
  assertExactKeys(manifest, new Set([
    'schemaVersion',
    'selectedPolicy',
    'servingAuthority',
    'shadowOnly',
  ]), `committed activation manifest ${skillId}`);
  assertExactKeys(manifest.selectedPolicy, new Set([
    'effectivePolicyHash',
    'generation',
  ]), `committed activation policy ${skillId}`);
  if (manifest.schemaVersion !== 'V1') {
    throw new CleanupError('PREFLIGHT_MANIFEST_INVALID', `${skillId} activation manifest must use schema V1`);
  }
  return {
    manifest,
    manifestHash: sha256(bytes),
    skillId,
    sourceId,
  };
}

/**
 * Read the exact committed activation-manifest bytes that own serving authority.
 *
 * @returns {Array<Object>} Ordered committed manifest evidence and byte hashes
 */
function readCommittedActivationEvidence() {
  return COMMITTED_ACTIVATION_MANIFESTS.map((descriptor) => manifestEvidence(
    descriptor.skillId,
    descriptor.sourceId,
    fs.readFileSync(descriptor.filePath),
  ));
}

function hypotheticalEvidence(activationManifests) {
  if (!Array.isArray(activationManifests)
    || activationManifests.length !== ACTIVATION_ORDER.length) {
    throw new CleanupError('PREFLIGHT_INCOMPLETE', 'every fleet activation manifest is required');
  }
  const ids = activationManifests.map((manifest) => manifest.skillId);
  if (canonicalize(ids) !== canonicalize(ACTIVATION_ORDER)) {
    throw new CleanupError('PREFLIGHT_ORDER_INVALID', 'activation manifests are outside activation order');
  }
  return activationManifests.map((manifest) => {
    assertExactKeys(manifest, new Set([
      'canaryGreen',
      'effectivePolicyHash',
      'generation',
      'servingAuthority',
      'skillId',
    ]), `activation manifest ${manifest.skillId}`);
    const projected = {
      schemaVersion: 'V1',
      selectedPolicy: {
        effectivePolicyHash: manifest.effectivePolicyHash,
        generation: manifest.generation,
      },
      servingAuthority: manifest.servingAuthority,
      shadowOnly: manifest.servingAuthority !== 'compiled',
    };
    return {
      canaryGreen: manifest.canaryGreen,
      ...manifestEvidence(
        manifest.skillId,
        `hypothetical/${manifest.skillId}/activation/manifest.json`,
        canonicalBytes(projected),
      ),
    };
  });
}

function readinessFromEvidence(evidence, policySnapshots) {
  if (!Array.isArray(evidence) || evidence.length !== ACTIVATION_ORDER.length) {
    throw new CleanupError('PREFLIGHT_INCOMPLETE', 'every fleet activation manifest is required');
  }
  const snapshots = orderPolicySnapshots(policySnapshots);
  const policyPins = snapshots.map(policyPin);
  const ids = evidence.map((entry) => entry.skillId);
  if (canonicalize(ids) !== canonicalize(ACTIVATION_ORDER)) {
    throw new CleanupError('PREFLIGHT_ORDER_INVALID', 'activation manifests are outside activation order');
  }
  for (const [index, entry] of evidence.entries()) {
    const manifest = entry.manifest;
    const expectedPin = policyPins[index];
    if (manifest.servingAuthority !== 'compiled'
      || manifest.shadowOnly !== false
      || entry.canaryGreen === false
      || !Number.isSafeInteger(manifest.selectedPolicy.generation)
      || manifest.selectedPolicy.generation < 1
      || !DIGEST_PATTERN.test(manifest.selectedPolicy.effectivePolicyHash || '')) {
      throw new CleanupError('PREFLIGHT_BLOCKED', `${entry.skillId} is not fully rolled out`, {
        manifestHash: entry.manifestHash,
        reason: 'not-rolled-out',
        servingAuthority: manifest.servingAuthority,
        shadowOnly: manifest.shadowOnly,
        skillId: entry.skillId,
        sourceId: entry.sourceId,
      });
    }
    if (manifest.selectedPolicy.generation !== expectedPin.activationGeneration
      || manifest.selectedPolicy.effectivePolicyHash !== expectedPin.effectivePolicyHash) {
      throw new CleanupError('PREFLIGHT_POLICY_MISMATCH', `${entry.skillId} manifest is not bound to its compiled snapshot`);
    }
  }
  const snapshotDigest = sha256(canonicalBytes(snapshots));
  const evidenceHash = sha256(canonicalBytes(evidence.map((entry) => ({
    manifestHash: entry.manifestHash,
    skillId: entry.skillId,
  }))));
  return { evidenceHash, snapshotDigest };
}

/**
 * Mint a cleanup capability only from the exact committed rollout selectors.
 *
 * @param {Array<Object>} policySnapshots - Ordered compiled policy snapshots
 * @returns {Object} Opaque cleanup preflight capability
 */
function assertFleetReady(policySnapshots) {
  const committedEvidence = readCommittedActivationEvidence();
  const readiness = readinessFromEvidence(committedEvidence, policySnapshots);
  const token = Object.freeze({
    digest: sha256(canonicalBytes(readiness)),
    evidenceHash: readiness.evidenceHash,
    kind: 'committed',
  });
  APPROVED_PREFLIGHTS.set(token, readiness);
  return token;
}

/**
 * Model a fully rolled-out fleet inside an isolated temporary simulation root.
 *
 * @param {Array<Object>} activationManifests - Synthetic positive-control manifests
 * @param {Array<Object>} policySnapshots - Ordered compiled policy snapshots
 * @returns {Object} Hypothetical-only preflight that cannot authorize a real path
 */
function createHypotheticalPreflight(activationManifests, policySnapshots) {
  const readiness = readinessFromEvidence(
    hypotheticalEvidence(activationManifests),
    policySnapshots,
  );
  const simulationRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'fleet-cleanup-hypothetical-'));
  const token = Object.freeze({
    authorization: 'HYPOTHETICAL_ONLY',
    digest: sha256(canonicalBytes({
      activationManifests,
      snapshotDigest: readiness.snapshotDigest,
    })),
    evidenceHash: readiness.evidenceHash,
    kind: 'hypothetical',
    simulationRoot,
  });
  HYPOTHETICAL_PREFLIGHTS.set(token, readiness);
  return token;
}

function pathIsWithin(rootPath, candidatePath) {
  const relative = path.relative(
    fs.realpathSync(rootPath),
    fs.realpathSync(candidatePath),
  );
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function assertApprovedPreflight(preflight, policySnapshots, targetPath) {
  const approved = preflight && APPROVED_PREFLIGHTS.get(preflight);
  const hypothetical = preflight && HYPOTHETICAL_PREFLIGHTS.get(preflight);
  if (!approved && !hypothetical) {
    throw new CleanupError('PREFLIGHT_REQUIRED', 'deletion requires an approved committed preflight');
  }
  if (approved) {
    const currentEvidence = readCommittedActivationEvidence();
    const currentEvidenceHash = sha256(canonicalBytes(currentEvidence.map((entry) => ({
      manifestHash: entry.manifestHash,
      skillId: entry.skillId,
    }))));
    if (currentEvidenceHash !== approved.evidenceHash) {
      throw new CleanupError('PREFLIGHT_EVIDENCE_DRIFT', 'committed activation manifest bytes changed after preflight');
    }
  }
  if (hypothetical && targetPath && !pathIsWithin(preflight.simulationRoot, targetPath)) {
    throw new CleanupError(
      'PREFLIGHT_HYPOTHETICAL_ONLY',
      'hypothetical rollout evidence can operate only inside its isolated simulation root',
    );
  }
  if (policySnapshots) {
    const snapshotDigest = sha256(canonicalBytes(orderPolicySnapshots(policySnapshots)));
    if (snapshotDigest !== (approved || hypothetical).snapshotDigest) {
      throw new CleanupError('PREFLIGHT_POLICY_MISMATCH', 'preflight token is bound to different policy snapshots');
    }
  }
}

function createInitialManifest({ aliasesBySkill, bakeWindow, policySnapshots, preflight }) {
  assertApprovedPreflight(preflight, policySnapshots);
  const snapshots = orderPolicySnapshots(policySnapshots);
  const policyPins = snapshots.map(policyPin);
  const selectedPolicyHash = sha256(canonicalBytes(policyPins));
  const legacyInputs = ACTIVATION_ORDER.map((skillId) => ({
    aliases: [...(aliasesBySkill[skillId] || [])],
    registryAdapterPresent: true,
    resolverEntryPresent: true,
    skillId,
  }));
  return validateManifest({
    bakeWindow: {
      discardAuthorized: false,
      minimumSuccessfulDeletions: bakeWindow.minimumSuccessfulDeletions,
    },
    dualReadSkillIds: [...ACTIVATION_ORDER],
    generation: Math.max(...policyPins.map((pin) => pin.activationGeneration)),
    legacyInputs,
    policyPins,
    preflightDigest: preflight.digest,
    resolver: 'EffectivePolicy+legacy-dual-read',
    retiredSkillIds: [],
    schemaVersion: 'V1',
    selectedPolicyHash,
    servingAuthority: 'compiled',
    soleResolver: false,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FENCED FILE SWAPS
// ─────────────────────────────────────────────────────────────────────────────

function fsyncDirectory(directory) {
  const descriptor = fs.openSync(directory, 'r');
  try {
    fs.fsyncSync(descriptor);
  } finally {
    fs.closeSync(descriptor);
  }
}

function parseFence(filePath) {
  const value = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (value.schemaVersion !== 'V1'
    || !Number.isSafeInteger(value.fencingEpoch)
    || value.fencingEpoch < 0) {
    throw new CleanupError('FENCE_INVALID', 'fence state is invalid');
  }
  return value.fencingEpoch;
}

function assertToken(token) {
  if (typeof token !== 'string' || !/^[a-z0-9-]{1,64}$/.test(token)) {
    throw new CleanupError('TOKEN_INVALID', 'fencing token must be lowercase hyphen-case');
  }
}

function atomicFleetSwap({
  expectedFencingEpoch,
  expectedPriorBytes,
  fencePath,
  manifestPath,
  nextBytes,
  token,
}) {
  assertToken(token);
  validateManifest(JSON.parse(nextBytes.toString('utf8')));
  const directory = path.dirname(manifestPath);
  const lockPath = path.join(directory, '.cleanup.lock');
  const manifestTemp = path.join(directory, `.manifest-${token}.tmp`);
  const fenceTemp = path.join(directory, `.fence-${token}.tmp`);
  const observedBeforeLock = fs.readFileSync(manifestPath);
  if (!observedBeforeLock.equals(expectedPriorBytes)) {
    throw new CleanupError('PREIMAGE_DRIFT', 'manifest bytes changed before the fenced swap', {
      expectedHash: sha256(expectedPriorBytes),
      observedHash: sha256(observedBeforeLock),
    });
  }
  let lockDescriptor;
  let hasLock = false;
  try {
    lockDescriptor = fs.openSync(lockPath, 'wx', 0o600);
    hasLock = true;
    fs.writeFileSync(
      lockDescriptor,
      canonicalBytes({ expectedFencingEpoch, expectedPreimageHash: sha256(expectedPriorBytes), token }),
    );
    fs.fsyncSync(lockDescriptor);
    if (parseFence(fencePath) !== expectedFencingEpoch) {
      throw new CleanupError('STALE_FENCE', 'fencing epoch changed before the swap');
    }
    fs.writeFileSync(manifestTemp, nextBytes, { flag: 'wx', mode: 0o600 });
    const manifestDescriptor = fs.openSync(manifestTemp, 'r');
    try {
      fs.fsyncSync(manifestDescriptor);
    } finally {
      fs.closeSync(manifestDescriptor);
    }
    fs.writeFileSync(fenceTemp, fenceStateBytes(expectedFencingEpoch + 1), {
      flag: 'wx',
      mode: 0o600,
    });
    const fenceDescriptor = fs.openSync(fenceTemp, 'r');
    try {
      fs.fsyncSync(fenceDescriptor);
    } finally {
      fs.closeSync(fenceDescriptor);
    }
    const observedUnderLock = fs.readFileSync(manifestPath);
    if (!observedUnderLock.equals(expectedPriorBytes)) {
      throw new CleanupError('PREIMAGE_DRIFT', 'manifest bytes changed while the fence was held');
    }
    fs.renameSync(fenceTemp, fencePath);
    fsyncDirectory(directory);
    fs.renameSync(manifestTemp, manifestPath);
    fsyncDirectory(directory);
    return JSON.parse(nextBytes.toString('utf8'));
  } finally {
    if (lockDescriptor !== undefined) fs.closeSync(lockDescriptor);
    if (fs.existsSync(manifestTemp)) fs.unlinkSync(manifestTemp);
    if (fs.existsSync(fenceTemp)) fs.unlinkSync(fenceTemp);
    if (hasLock && fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
  }
}

function retainPrior(retainedDirectory, skillId, priorBytes) {
  fs.mkdirSync(retainedDirectory, { recursive: true });
  const retainedPath = path.join(retainedDirectory, `${skillId}-${sha256(priorBytes)}.json`);
  fs.writeFileSync(retainedPath, priorBytes, { flag: 'wx', mode: 0o600 });
  const descriptor = fs.openSync(retainedPath, 'r');
  try {
    fs.fsyncSync(descriptor);
  } finally {
    fs.closeSync(descriptor);
  }
  fsyncDirectory(retainedDirectory);
  return retainedPath;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PARAMETERIZED DELETION AND ROLLBACK
// ─────────────────────────────────────────────────────────────────────────────

function candidateAfterDeletion(manifest, skillId) {
  const current = validateManifest(manifest);
  if (current.dualReadSkillIds[0] !== skillId) {
    throw new CleanupError('DELETION_ORDER_VIOLATION', `${skillId} is outside blast-radius order`);
  }
  const dualReadSkillIds = current.dualReadSkillIds.slice(1);
  const finalState = dualReadSkillIds.length === 0;
  return validateManifest({
    ...current,
    dualReadSkillIds,
    generation: current.generation + 1,
    legacyInputs: current.legacyInputs.filter((entry) => entry.skillId !== skillId),
    resolver: finalState ? 'EffectivePolicy' : 'EffectivePolicy+legacy-dual-read',
    retiredSkillIds: [...current.retiredSkillIds, skillId],
    soleResolver: finalState,
  });
}

function rollbackToRetained({
  expectedFencingEpoch,
  expectedPriorBytes,
  fencePath,
  manifestPath,
  retainedPath,
  token,
}) {
  const retainedBytes = fs.readFileSync(retainedPath);
  atomicFleetSwap({
    expectedFencingEpoch,
    expectedPriorBytes,
    fencePath,
    manifestPath,
    nextBytes: retainedBytes,
    token,
  });
  const restored = fs.readFileSync(manifestPath);
  if (!restored.equals(retainedBytes)) {
    throw new CleanupError('ROLLBACK_NOT_BYTE_EXACT', 'retained manifest did not restore exactly');
  }
  return {
    byteExact: true,
    restoredHash: sha256(restored),
    retainedHash: sha256(retainedBytes),
  };
}

function scoreRouteGoldPlan(plan) {
  assertExactKeys(plan, new Set(['corruptionInput', 'inputs']), 'route-gold plan');
  if (!Array.isArray(plan.inputs) || plan.inputs.length === 0
    || !plan.corruptionInput || typeof plan.corruptionInput !== 'object') {
    throw new CleanupError('ROUTE_GOLD_INPUT_INVALID', 'route-gold plan requires scorer inputs and a corruption input');
  }
  const scored = scoreRouteGoldReadOnly(plan.inputs);
  const corruption = scoreRouteGoldReadOnly([plan.corruptionInput]);
  const rows = plan.inputs.map((input, index) => ({
    observed: input.observed,
    scenarioId: input.scenario?.scenarioId,
    verdict: scored.verdicts[index],
  }));
  return {
    corruptedObservationPass: corruption.verdicts[0]?.pass === true,
    digest: sha256(canonicalBytes(rows)),
    green: scored.verdicts.length === plan.inputs.length
      && scored.verdicts.every((verdict) => verdict.pass === true)
      && corruption.verdicts[0]?.pass === false
      && scored.writeBackAttempts.length === 0
      && corruption.writeBackAttempts.length === 0,
    realScorer: 'evaluateRouteGold',
    rows: rows.length,
    writeBackAttempts: scored.writeBackAttempts.length + corruption.writeBackAttempts.length,
  };
}

function deleteLegacySkill({
  expectedFencingEpoch,
  expectedPriorBytes,
  expectedRouteGoldDigest,
  fencePath,
  manifestPath,
  preflight,
  retainedDirectory,
  routeGoldGate,
  skillId,
}) {
  assertApprovedPreflight(preflight, undefined, manifestPath);
  if (typeof routeGoldGate !== 'function') {
    throw new CleanupError('ROUTE_GOLD_GATE_REQUIRED', 'a real route-gold gate is required');
  }
  const currentBytes = fs.readFileSync(manifestPath);
  if (!currentBytes.equals(expectedPriorBytes)) {
    throw new CleanupError('PREIMAGE_DRIFT', 'deletion preimage differs from frozen prior bytes', {
      expectedHash: sha256(expectedPriorBytes),
      observedHash: sha256(currentBytes),
    });
  }
  const current = validateManifest(JSON.parse(currentBytes.toString('utf8')));
  const candidate = candidateAfterDeletion(current, skillId);
  const candidateBytes = manifestBytes(candidate);
  const retainedPath = retainPrior(retainedDirectory, skillId, currentBytes);
  atomicFleetSwap({
    expectedFencingEpoch,
    expectedPriorBytes: currentBytes,
    fencePath,
    manifestPath,
    nextBytes: candidateBytes,
    token: `delete-${current.generation}-${current.retiredSkillIds.length}`,
  });
  let routeGold;
  try {
    assertDigest(expectedRouteGoldDigest, `${skillId} expected route-gold digest`);
    routeGold = scoreRouteGoldPlan(routeGoldGate(skillId, candidate));
    if (routeGold.green !== true || routeGold.digest !== expectedRouteGoldDigest) {
      throw new CleanupError('ROUTE_GOLD_VERDICT_RED', `${skillId} real route-gold verdict is red`, {
        routeGold,
      });
    }
  } catch (error) {
    const rollback = rollbackToRetained({
      expectedFencingEpoch: expectedFencingEpoch + 1,
      expectedPriorBytes: candidateBytes,
      fencePath,
      manifestPath,
      retainedPath,
      token: `rollback-${current.generation}-${current.retiredSkillIds.length}`,
    });
    throw new CleanupError('ROUTE_GOLD_RED', `${skillId} route-gold gate rejected deletion`, {
      causeCode: error.code || 'ROUTE_GOLD_EXCEPTION',
      causeMessage: error.message,
      rollback,
      routeGold,
    });
  }
  return {
    candidate,
    candidateBytes,
    candidateHash: sha256(candidateBytes),
    priorHash: sha256(currentBytes),
    retainedPath,
    routeGold,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. POST-CLEANUP POLICY CARD
// ─────────────────────────────────────────────────────────────────────────────

function retireAliasDetectors(policy) {
  const retired = clone(policy);
  const aliasDetectorIds = new Set(retired.detectors
    .filter((detector) => detector.kind === 'alias')
    .map((detector) => detector.id));
  retired.detectors = retired.detectors.filter((detector) => !aliasDetectorIds.has(detector.id));
  retired.selectors = retired.selectors.map((selector) => ({
    ...selector,
    detectorIds: selector.detectorIds.filter((id) => !aliasDetectorIds.has(id)),
  }));
  retired.basePolicyHash = computeBasePolicyHash(retired);
  retired.effectivePolicyHash = computeEffectivePolicyHash(retired);
  return retired;
}

function standalonePolicy(snapshot) {
  const policy = retireAliasDetectors(snapshot.policy);
  return {
    negativeReasons: policy.detectors
      .filter((detector) => detector.kind === 'negative')
      .map((detector) => detector.value),
    policy,
    precedence: policy.selectors.map((selector) => selector.id),
    skillId: snapshot.skillId,
  };
}

function generatePolicyCard(manifest, policySnapshots) {
  const state = validateManifest(manifest);
  const payload = {
    compiledPolicies: ACTIVATION_ORDER.map((skillId) => standalonePolicy(
      policySnapshots.find((snapshot) => snapshot.skillId === skillId),
    )),
    manifestHash: sha256(manifestBytes(state)),
    resolver: state.resolver,
    schemaVersion: 'V1',
    soleResolver: state.soleResolver,
    zeroSignal: { action: 'defer', reason: 'no-match', union: [] },
  };
  if (state.legacyInputs.length > 0) {
    payload.aliases = state.legacyInputs.flatMap((entry) => entry.aliases);
  }
  const markdown = [
    '---',
    'schemaVersion: V1',
    `manifestHash: ${payload.manifestHash}`,
    `resolver: ${payload.resolver}`,
    `soleResolver: ${payload.soleResolver}`,
    'terminal: DOCUMENT_ONLY_UNATTESTED',
    '---',
    '# Fleet Policy Card',
    '',
    'This generated card binds the four compiled policy identities to one terminal resolver.',
    'Zero signal defers with `no-match`; it never expands to a registry or destination union.',
    '',
    `\`\`\`${CARD_MARKER}`,
    canonicalize(payload),
    '\`\`\`',
    '',
  ].join('\n');
  return { markdown, payload };
}

function parsePolicyCard(markdown) {
  const pattern = new RegExp('```' + CARD_MARKER + '\\n([\\s\\S]+?)\\n```');
  const match = pattern.exec(markdown);
  if (!match) throw new CleanupError('POLICY_CARD_INVALID', 'compiled payload is absent');
  return JSON.parse(match[1]);
}

function assertPolicyCardPayload(card, expectedManifestHash) {
  assertExactKeys(card, new Set([
    'compiledPolicies',
    'manifestHash',
    'resolver',
    'schemaVersion',
    'soleResolver',
    'zeroSignal',
  ]), 'policy card payload');
  if (card.schemaVersion !== 'V1'
    || card.soleResolver !== true
    || card.resolver !== 'EffectivePolicy') {
    throw new CleanupError('POLICY_CARD_NOT_FINAL', 'card is not on the sole compiled resolver');
  }
  if (!DIGEST_PATTERN.test(card.manifestHash)
    || card.manifestHash === '0'.repeat(64)
    || (expectedManifestHash && card.manifestHash !== expectedManifestHash)) {
    throw new CleanupError('POLICY_CARD_DOCUMENT_PARITY', 'card is not bound to the final manifest');
  }
  if (!Array.isArray(card.compiledPolicies)
    || canonicalize(card.compiledPolicies.map((entry) => entry.skillId))
      !== canonicalize(ACTIVATION_ORDER)) {
    throw new CleanupError('POLICY_CARD_DOCUMENT_PARITY', 'card lacks the ordered compiled policies');
  }
  if (!card.zeroSignal || card.zeroSignal.action !== 'defer'
    || card.zeroSignal.reason !== 'no-match' || card.zeroSignal.union?.length !== 0) {
    throw new CleanupError('DEFAULT_UNION_FORBIDDEN', 'zero-signal card path contains a union');
  }
  for (const entry of card.compiledPolicies) {
    assertExactKeys(entry, new Set([
      'negativeReasons',
      'policy',
      'precedence',
      'skillId',
    ]), `standalone policy ${entry.skillId}`);
    const invalidProbe = evaluate(requestForPrompt(entry.policy, ''), entry.policy);
    if (invalidProbe.action === 'reject' && invalidProbe.reject?.reason === 'invalid') {
      throw new CleanupError('POLICY_CARD_DOCUMENT_PARITY', `${entry.skillId} compiled policy is invalid`);
    }
    if (canonicalize(entry.precedence)
      !== canonicalize(entry.policy.selectors.map((selector) => selector.id))
      || canonicalize(entry.negativeReasons) !== canonicalize(entry.policy.detectors
        .filter((detector) => detector.kind === 'negative')
        .map((detector) => detector.value))) {
      throw new CleanupError('POLICY_CARD_DOCUMENT_PARITY', `${entry.skillId} card summaries drifted`);
    }
  }
  return card;
}

function hasPropertyNamed(value, propertyName) {
  if (!value || typeof value !== 'object') return false;
  if (Object.prototype.hasOwnProperty.call(value, propertyName)) return true;
  return Object.values(value).some((entry) => hasPropertyNamed(entry, propertyName));
}

function observationsForPrompt(policy, prompt) {
  const text = String(prompt || '').trim().toLowerCase();
  if (text.length === 0) return [];
  const matchedIds = new Set(policy.detectors
    .filter((detector) => detector.value && (
      detector.kind === 'exact'
        ? text === detector.value.toLowerCase()
        : text.includes(detector.value.toLowerCase())
    ))
    .map((detector) => detector.id));
  const expandedIds = new Set(matchedIds);
  for (const selector of policy.selectors) {
    if (selector.detectorIds.some((id) => matchedIds.has(id))) {
      selector.detectorIds.forEach((id) => expandedIds.add(id));
    }
  }
  const observations = [
    { kind: 'intent', value: text },
    { kind: 'resource', value: text },
    ...policy.detectors
      .filter((detector) => expandedIds.has(detector.id) && detector.value)
      .map((detector) => ({
        kind: detector.kind === 'resource' ? 'resource' : 'intent',
        value: detector.value,
      })),
  ];
  const seen = new Set();
  return observations.filter((observation) => {
    const key = `${observation.kind}\u0000${observation.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function requestForPrompt(policy, prompt) {
  const text = String(prompt || '').trim();
  const request = {
    evidence: [{
      id: 'compatibility:policy-card',
      kind: 'compatibility',
      provenance: {
        capturedAtEpoch: policy.activationGeneration,
        source: 'policy-card',
      },
      trust: 'live',
      value: canonicalize({
        activationGeneration: policy.activationGeneration,
        effectivePolicyHash: policy.effectivePolicyHash,
      }),
    }],
    observations: observationsForPrompt(policy, text),
    pinnedActivationGeneration: policy.activationGeneration,
    schemaVersion: 'V1',
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return request;
}

function replayPolicyCard(markdown, input) {
  const card = assertPolicyCardPayload(parsePolicyCard(markdown));
  const entry = card.compiledPolicies.find((candidate) => candidate.skillId === input.skillId);
  if (!entry) throw new CleanupError('POLICY_SNAPSHOT_MISSING', `${input.skillId} card policy is absent`);
  return evaluate(requestForPrompt(entry.policy, input.prompt), entry.policy);
}

function assertPostCleanupCard(markdown, manifest, zeroSignalInput) {
  const payload = assertPolicyCardPayload(
    parsePolicyCard(markdown),
    sha256(manifestBytes(manifest)),
  );
  if (hasPropertyNamed(payload, 'aliases')) {
    throw new CleanupError('HOT_CARD_ALIASES_REMAIN', 'post-cleanup card retains compatibility vocabulary');
  }
  if (payload.fallbackDefaultUnion === true || payload.zeroSignal?.union?.length > 0) {
    throw new CleanupError('DEFAULT_UNION_FORBIDDEN', 'post-cleanup card opens a default union');
  }
  if (payload.compiledPolicies.some((entry) => (
    entry.policy.detectors.some((detector) => detector.kind === 'alias')
  ))) {
    throw new CleanupError('HOT_CARD_ALIASES_REMAIN', 'compiled policies retain alias detectors');
  }
  const decision = replayPolicyCard(markdown, zeroSignalInput);
  if (decision.action !== 'defer' || decision.defer?.reason !== 'no-match'
    || decision.defer?.recovery?.length !== 0) {
    throw new CleanupError('ZERO_SIGNAL_OVER_EMISSION', 'zero signal did not defer without targets');
  }
  return { aliasesAbsent: true, defaultUnionAbsent: true, zeroSignalDecision: decision };
}

function assertFrozenFinalState(actualBytes, frozenBytes) {
  if (!actualBytes.equals(frozenBytes)) {
    throw new CleanupError('FINAL_STATE_DRIFT', 'final manifest differs from frozen canonical bytes', {
      actualHash: sha256(actualBytes),
      expectedHash: sha256(frozenBytes),
    });
  }
  return { byteIdentical: true, hash: sha256(actualBytes) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ACTIVATION_ORDER,
  CleanupError,
  assertFleetReady,
  assertFrozenFinalState,
  assertPostCleanupCard,
  atomicFleetSwap,
  candidateAfterDeletion,
  canonicalBytes,
  createInitialManifest,
  createHypotheticalPreflight,
  deleteLegacySkill,
  generatePolicyCard,
  manifestBytes,
  parsePolicyCard,
  readCommittedActivationEvidence,
  replayPolicyCard,
  rollbackToRetained,
  scoreRouteGoldPlan,
  sha256,
  validateManifest,
};
