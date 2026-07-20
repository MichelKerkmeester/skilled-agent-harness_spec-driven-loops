#!/usr/bin/env node
'use strict';

// Fenced-CAS live-activation driver for the unified-router program.
//
// Design-faithful activation binds a hub's compiled policy generation as the
// SELECTED policy on a dedicated activation manifest, advancing a monotonic
// fence epoch, while serving authority stays legacy — no runtime consumer is
// touched here. The compiled contract becomes the accepted/bound generation;
// legacy keeps serving until a later serving-authority flip. Rollback restores
// the byte-identical prior manifest.
//
// The activation manifests live under this phase (activation/<hub>/), seeded
// byte-for-byte from the hub's shadow rollout child, so the completed canary
// children stay pristine and green.

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const PHASE_ROOT = path.resolve(__dirname, '..'); // .../010-live-activation
const ACTIVATION_ROOT = path.join(PHASE_ROOT, 'activation');

function findRepoRoot(start) {
  let dir = start;
  for (let i = 0; i < 40; i += 1) {
    if (fs.existsSync(path.join(dir, '.opencode'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('could not locate repo root (no .opencode ancestor)');
}
const REPO_ROOT = findRepoRoot(PHASE_ROOT);

// The shared benchmark scorer is FROZEN. Activation refuses to proceed if any
// of these files drift from their pinned digests — a changed scorer would
// invalidate every route-gold green this program relies on.
const SCORER_DIR = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark',
);
const PINNED_SCORER_DIGESTS = {
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
  'load-playbook-scenarios.cjs': '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
};

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}
function fileHash(p) {
  return sha256(fs.readFileSync(p));
}
function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function stableStringify(value) {
  const sort = (v) => {
    if (Array.isArray(v)) return v.map(sort);
    if (v && typeof v === 'object') {
      return Object.keys(v)
        .sort()
        .reduce((acc, k) => {
          acc[k] = sort(v[k]);
          return acc;
        }, {});
    }
    return v;
  };
  return JSON.stringify(sort(value));
}
function sameSelectedPolicy(a, b) {
  return stableStringify(a) === stableStringify(b);
}

function parseArgs(argv) {
  const out = { mode: 'activate' };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--hub') out.hub = argv[(i += 1)];
    else if (arg === '--child') out.child = argv[(i += 1)];
    else if (arg === '--verify') out.mode = 'verify';
    else if (arg === '--rollback') out.mode = 'rollback';
    else if (arg === '--json') out.json = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  if (!out.hub) throw new Error('missing --hub <hubId>');
  // Binding or verifying a compiled generation needs the rollout child; a
  // rollback recovers an already-committed hub from its retained prior manifest
  // and needs no child.
  if (out.mode !== 'rollback' && !out.child) throw new Error('missing --child <path to rollout child>');
  return out;
}

function assertScorerFrozen() {
  const observed = {};
  for (const [name, pinned] of Object.entries(PINNED_SCORER_DIGESTS)) {
    const actual = fileHash(path.join(SCORER_DIR, name));
    observed[name] = actual;
    if (actual !== pinned) {
      throw new Error(
        `FROZEN SCORER DRIFT: ${name}\n  pinned:   ${pinned}\n  observed: ${actual}\n` +
          'The shared benchmark scorer must never change during activation.',
      );
    }
  }
  return observed;
}

function assertCanaryGreen(childRoot) {
  const canary = path.join(childRoot, 'harness', 'validate-canary.cjs');
  if (!fs.existsSync(canary)) throw new Error(`canary harness missing: ${canary}`);
  // Non-zero exit throws — the canary asserts route-gold GREEN, rollback pass,
  // serving-authority legacy, and protected-digest stability internally.
  execFileSync('node', [canary], { stdio: ['ignore', 'ignore', 'pipe'] });
  return { canaryGreen: true };
}

function scopedTempDir(prefix) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const resolved = path.resolve(base);
  if (!resolved.startsWith(path.resolve(os.tmpdir()))) {
    throw new Error('temporary rollback directory failed scope validation');
  }
  return resolved;
}

function seedActivation(hub, childRoot, acceptance) {
  const hubDir = path.join(ACTIVATION_ROOT, hub);
  fs.mkdirSync(hubDir, { recursive: true });
  const childAct = path.join(childRoot, 'activation');

  const priorSrc = path.join(childAct, 'manifest.prior.json');
  const candidateSrc = path.join(childAct, 'manifest.candidate.json');
  const priorDst = path.join(hubDir, 'manifest.prior.json');
  const candidateDst = path.join(hubDir, 'manifest.candidate.json');
  const servingDst = path.join(hubDir, 'manifest.json');
  const fenceDst = path.join(hubDir, 'fence-state.json');

  // Byte-for-byte copies keep the seeded prior hash identical to the accepted
  // priorManifestHash — never re-serialize a manifest.
  fs.writeFileSync(priorDst, fs.readFileSync(priorSrc));
  fs.writeFileSync(candidateDst, fs.readFileSync(candidateSrc));
  if (!fs.existsSync(servingDst)) fs.writeFileSync(servingDst, fs.readFileSync(priorSrc));
  if (!fs.existsSync(fenceDst)) {
    fs.writeFileSync(fenceDst, `${stableStringify({ fencingEpoch: 0, schemaVersion: 'V1' })}\n`);
  }

  const seededPriorHash = fileHash(priorDst);
  if (seededPriorHash !== acceptance.priorManifestHash) {
    throw new Error(
      `seed integrity failure: prior hash ${seededPriorHash} != accepted ${acceptance.priorManifestHash}`,
    );
  }
  const candidate = readJson(candidateDst);
  if (!sameSelectedPolicy(candidate.selectedPolicy, acceptance.candidatePolicy)) {
    throw new Error('seed integrity failure: candidate selectedPolicy != accepted candidatePolicy');
  }
  return { hubDir, priorDst, candidateDst, servingDst, fenceDst };
}

function proveRollback(paths, acceptance) {
  const tmp = scopedTempDir('router-activation-rollback-');
  try {
    for (const name of ['manifest.json', 'manifest.prior.json', 'manifest.candidate.json', 'fence-state.json']) {
      fs.copyFileSync(path.join(paths.hubDir, name), path.join(tmp, name));
    }
    // Rollback = restore the byte-identical prior manifest.
    fs.writeFileSync(path.join(tmp, 'manifest.json'), fs.readFileSync(path.join(tmp, 'manifest.prior.json')));
    const restoredHash = fileHash(path.join(tmp, 'manifest.json'));
    const restored = readJson(path.join(tmp, 'manifest.json'));
    const byteExact = restoredHash === acceptance.priorManifestHash;
    const selectedReverted = sameSelectedPolicy(restored.selectedPolicy, acceptance.expectedCurrent);
    if (!byteExact) throw new Error(`rollback not byte-exact: ${restoredHash} != ${acceptance.priorManifestHash}`);
    if (!selectedReverted) throw new Error('rollback did not revert selectedPolicy to prior generation');
    if (restored.servingAuthority !== 'legacy') throw new Error('rollback serving-authority is not legacy');
    return { byteExact, selectedReverted, restoredHash };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// Append-only per-hub audit ledger. Every bind/rollback event is one JSON line;
// entries are never rewritten, so re-mint history survives every re-run. The
// canonical field set is documented once alongside this driver's rollback
// packet (references/flip-history-schema.md); flip-serving.cjs emits the same
// shape into the same file.
function appendFlipEvent(hubDir, event) {
  const line = JSON.stringify({ ts: new Date().toISOString(), schemaVersion: 'flip-history/V1', ...event });
  fs.appendFileSync(path.join(hubDir, 'flip-history.jsonl'), `${line}\n`);
}

// Committed binding-layer rollback: restore the byte-identical prior manifest
// for an already-activated hub, reusing proveRollback()'s hash validation as a
// pre-commit proof. The binding layer never owns serving authority, so a
// rollback that would flip serving 'compiled'->'legacy' is refused — the P4b
// serving flip must be rolled back first.
function rollbackHub(hubDir) {
  const manifestPath = path.join(hubDir, 'manifest.json');
  const priorPath = path.join(hubDir, 'manifest.prior.json');
  const candidatePath = path.join(hubDir, 'manifest.candidate.json');
  const fencePath = path.join(hubDir, 'fence-state.json');
  const recordPath = path.join(hubDir, 'activation-record.json');
  for (const p of [manifestPath, priorPath, candidatePath, fencePath, recordPath]) {
    if (!fs.existsSync(p)) {
      throw new Error(`no retained prior manifest to roll back (missing ${path.basename(p)} in ${hubDir})`);
    }
  }
  const record = readJson(recordPath);
  const before = readJson(manifestPath);
  const prior = readJson(priorPath);

  // The retained prior must still hash to the accepted priorManifestHash, or the
  // recovery target is not the generation we bound against.
  const retainedPriorHash = fileHash(priorPath);
  if (retainedPriorHash !== record.priorManifestHash) {
    throw new Error(`retained prior manifest drifted: ${retainedPriorHash} != accepted ${record.priorManifestHash}`);
  }

  // P4a binding rollback must not change serving authority (that is the P4b
  // flip's domain). Fail closed if it would.
  const sameServing = prior.servingAuthority === before.servingAuthority
    && (prior.shadowOnly === true) === (before.shadowOnly === true);
  if (!sameServing) {
    throw new Error(
      `binding rollback would change serving authority (${before.servingAuthority}/shadowOnly=${before.shadowOnly}`
      + ` -> ${prior.servingAuthority}/shadowOnly=${prior.shadowOnly}); roll back the serving flip first`,
    );
  }

  const fenceBefore = readJson(fencePath).fencingEpoch;

  // Idempotent no-op: already at the prior generation. Record the no-op in
  // history without advancing the fence or rewriting the manifest.
  if (fileHash(manifestPath) === record.priorManifestHash) {
    const h = fileHash(manifestPath);
    appendFlipEvent(hubDir, {
      hubId: record.hubId, driver: 'activate-hub', event: 'binding-rollback-noop', direction: 'rollback',
      servingAuthority: before.servingAuthority, shadowOnly: before.shadowOnly === true,
      selectedGeneration: before.selectedPolicy.generation,
      fenceEpoch: { before: fenceBefore, after: fenceBefore }, manifestHash: h, restoredHash: h,
    });
    return { hubId: record.hubId, rolledBack: false, noop: true, byteExact: true, restoredHash: h,
      priorManifestHash: record.priorManifestHash, fenceEpoch: { before: fenceBefore, after: fenceBefore } };
  }

  // Reuse the existing byte-exact hash validation as a pre-commit proof.
  const acceptance = { priorManifestHash: record.priorManifestHash, expectedCurrent: prior.selectedPolicy };
  const proof = proveRollback({ hubDir }, acceptance);

  // Commit the real state change: restore the byte-identical prior manifest.
  fs.writeFileSync(manifestPath, fs.readFileSync(priorPath));
  const restoredHash = fileHash(manifestPath);
  if (restoredHash !== record.priorManifestHash) {
    throw new Error(`committed rollback not byte-exact: ${restoredHash} != ${record.priorManifestHash}`);
  }
  const restored = readJson(manifestPath);
  if (restored.servingAuthority !== before.servingAuthority) {
    throw new Error('rollback changed serving authority — invariant violated');
  }

  // Advance the fence monotonically, tagging the transition as a recovery so
  // cutover-vs-rollback is reconstructable from the persisted state alone.
  const fenceAfter = fenceBefore + 1;
  fs.writeFileSync(fencePath, `${stableStringify({ fencingEpoch: fenceAfter, direction: 'rollback', schemaVersion: 'V1' })}\n`);

  appendFlipEvent(hubDir, {
    hubId: record.hubId, driver: 'activate-hub', event: 'binding-rollback', direction: 'rollback',
    servingAuthority: restored.servingAuthority, shadowOnly: restored.shadowOnly === true,
    selectedGeneration: restored.selectedPolicy.generation,
    fenceEpoch: { before: fenceBefore, after: fenceAfter }, manifestHash: restoredHash, restoredHash,
  });

  return {
    hubId: record.hubId, rolledBack: true, noop: false,
    byteExact: proof.byteExact && restoredHash === record.priorManifestHash,
    selectedReverted: proof.selectedReverted, restoredHash, priorManifestHash: record.priorManifestHash,
    fenceEpoch: { before: fenceBefore, after: fenceAfter },
  };
}

function main() {
  const args = parseArgs(process.argv);

  if (args.mode === 'rollback') {
    const hubDir = path.join(ACTIVATION_ROOT, args.hub);
    if (!fs.existsSync(path.join(hubDir, 'manifest.json'))) {
      throw new Error(`hub not activated (no manifest): ${args.hub}`);
    }
    const result = rollbackHub(hubDir);
    if (args.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      process.stdout.write(
        `ROLLBACK ${result.noop ? 'NOOP' : 'DONE'} hub=${args.hub} byteExact=${result.byteExact} `
          + `restoredHash=${result.restoredHash.slice(0, 12)} `
          + `fence=${result.fenceEpoch.before}->${result.fenceEpoch.after} direction=rollback\n`,
      );
    }
    return;
  }

  const childRoot = path.isAbsolute(args.child) ? args.child : path.join(REPO_ROOT, args.child);
  if (!fs.existsSync(childRoot)) throw new Error(`rollout child not found: ${childRoot}`);

  const scorerDigests = assertScorerFrozen();
  const canary = assertCanaryGreen(childRoot);
  const acceptance = readJson(path.join(childRoot, 'activation', 'acceptance.json'));
  // Some rollout children omit hubId from their compiled acceptance record; when
  // present it must match --hub, otherwise --hub is authoritative for naming.
  if (acceptance.hubId && acceptance.hubId !== args.hub) {
    throw new Error(`hub mismatch: acceptance.hubId=${acceptance.hubId} != --hub ${args.hub}`);
  }

  const paths = seedActivation(args.hub, childRoot, acceptance);
  const fenceBefore = readJson(paths.fenceDst).fencingEpoch;
  const serving = readJson(paths.servingDst);
  const alreadyShipped = sameSelectedPolicy(serving.selectedPolicy, acceptance.candidatePolicy);

  let fenceAfter = fenceBefore;
  let shipped = false;
  if (args.mode === 'activate' && !alreadyShipped) {
    // Fenced CAS ship. Precondition: serving == prior generation at the
    // expected fence epoch.
    if (!sameSelectedPolicy(serving.selectedPolicy, acceptance.expectedCurrent)) {
      throw new Error('CAS precondition failed: serving selectedPolicy is not the expected prior generation');
    }
    if (fenceBefore !== acceptance.expectedFencingEpoch) {
      throw new Error(
        `CAS precondition failed: fence epoch ${fenceBefore} != expected ${acceptance.expectedFencingEpoch}`,
      );
    }
    fs.writeFileSync(paths.servingDst, fs.readFileSync(paths.candidateDst)); // swap
    fenceAfter = fenceBefore + 1;
    fs.writeFileSync(paths.fenceDst, `${stableStringify({ fencingEpoch: fenceAfter, direction: 'forward', schemaVersion: 'V1' })}\n`);
    shipped = true;
  }

  const rollback = proveRollback(paths, acceptance);
  const servingNow = readJson(paths.servingDst);
  const activated = sameSelectedPolicy(servingNow.selectedPolicy, acceptance.candidatePolicy);

  const record = {
    hubId: args.hub,
    schemaVersion: 'V1',
    activated,
    shippedThisRun: shipped,
    servingAuthority: servingNow.servingAuthority,
    shadowOnly: servingNow.shadowOnly === true,
    selectedPolicy: servingNow.selectedPolicy,
    candidatePolicy: acceptance.candidatePolicy,
    priorManifestHash: acceptance.priorManifestHash,
    fenceEpoch: { before: fenceBefore, after: fenceAfter },
    sourceHashes: acceptance.sourceHashes,
    eligibility: {
      canaryGreen: canary.canaryGreen,
      scorerDigestsPinned: true,
      scorerDigests,
    },
    rollbackProof: { byteExact: rollback.byteExact, restoredHash: rollback.restoredHash },
    realModelVerification: readExistingRealModel(args.hub),
  };
  fs.writeFileSync(
    path.join(paths.hubDir, 'activation-record.json'),
    `${stableStringify(record)}\n`,
  );
  appendFlipEvent(paths.hubDir, {
    hubId: args.hub, driver: 'activate-hub', event: shipped ? 'activate' : 'activate-noop', direction: 'forward',
    servingAuthority: servingNow.servingAuthority, shadowOnly: servingNow.shadowOnly === true,
    selectedGeneration: servingNow.selectedPolicy.generation,
    fenceEpoch: { before: fenceBefore, after: fenceAfter }, manifestHash: fileHash(paths.servingDst), restoredHash: null,
  });

  if (args.json) {
    process.stdout.write(`${JSON.stringify(record, null, 2)}\n`);
  } else {
    process.stdout.write(
      `ACTIVATION ${activated ? 'BOUND' : 'NOT-BOUND'} hub=${args.hub} ` +
        `serving=${servingNow.servingAuthority} shadowOnly=${servingNow.shadowOnly} ` +
        `gen=${servingNow.selectedPolicy.generation} fence=${fenceBefore}->${fenceAfter} ` +
        `rollback.byteExact=${rollback.byteExact} scorerFrozen=true canaryGreen=true\n`,
    );
  }
}

// A prior real-model verification record (if the verifier already ran) is
// preserved across re-runs; otherwise the field stays 'pending'.
function readExistingRealModel(hub) {
  const rmPath = path.join(PHASE_ROOT, 'real-model', hub, 'verdict.json');
  if (fs.existsSync(rmPath)) {
    try {
      return readJson(rmPath);
    } catch {
      return 'pending';
    }
  }
  return 'pending';
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    process.stderr.write(`ACTIVATION FAILED: ${err.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  parseArgs,
  seedActivation,
  proveRollback,
  rollbackHub,
  appendFlipEvent,
  assertScorerFrozen,
  fileHash,
  readJson,
  stableStringify,
};
