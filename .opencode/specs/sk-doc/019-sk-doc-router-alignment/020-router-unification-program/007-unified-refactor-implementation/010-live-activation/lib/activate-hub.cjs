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
    else if (arg === '--json') out.json = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  if (!out.hub) throw new Error('missing --hub <hubId>');
  if (!out.child) throw new Error('missing --child <path to rollout child>');
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

function main() {
  const args = parseArgs(process.argv);
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
    fs.writeFileSync(paths.fenceDst, `${stableStringify({ fencingEpoch: fenceAfter, schemaVersion: 'V1' })}\n`);
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

try {
  main();
} catch (err) {
  process.stderr.write(`ACTIVATION FAILED: ${err.message}\n`);
  process.exit(1);
}
