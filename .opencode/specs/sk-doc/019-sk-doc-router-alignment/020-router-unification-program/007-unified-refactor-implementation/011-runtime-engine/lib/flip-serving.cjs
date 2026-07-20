#!/usr/bin/env node
'use strict';

// Per-hub serving-authority flip — the P4b cutover step.
//
// A fenced compare-and-swap on the activation manifest that moves serving
// authority from 'legacy' to 'compiled' (and shadowOnly true->false), so the
// resolver treats the compiled contract as authoritative for this hub. Gated on:
//   - the hub is already P4a-bound (selectedPolicy is the compiled generation),
//   - the shadow canary is green,
//   - the three frozen scorer digests are unchanged,
//   - the compiled engine actually routes at least one designed scenario.
// Reversible: `--rollback` restores the byte-identical pre-flip manifest.
//
// This never edits a live SKILL.md, hub-router.json, or the frozen scorer; the
// runtime only honors the flip when SPECKIT_COMPILED_ROUTING=1 (see resolve.cjs).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { compiledRoute, loadHubEngine, HUB_CHILD } = require('./compiled-route.cjs');

const IMPL_ROOT = path.resolve(__dirname, '..', '..');
const ACTIVATION_ROOT = path.join(IMPL_ROOT, '010-live-activation', 'activation');

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
const SCORER_DIR = path.join(
  findRepoRoot(IMPL_ROOT),
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark',
);
const PINNED_SCORER_DIGESTS = {
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
  'load-playbook-scenarios.cjs': '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
};

function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function fileHash(p) { return sha256(fs.readFileSync(p)); }
function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function stableStringify(v) {
  const s = (x) => Array.isArray(x) ? x.map(s)
    : (x && typeof x === 'object') ? Object.keys(x).sort().reduce((a, k) => (a[k] = s(x[k]), a), {}) : x;
  return JSON.stringify(s(v));
}

function assertScorerFrozen() {
  for (const [name, pinned] of Object.entries(PINNED_SCORER_DIGESTS)) {
    const actual = fileHash(path.join(SCORER_DIR, name));
    if (actual !== pinned) throw new Error(`FROZEN SCORER DRIFT: ${name} (${actual} != ${pinned})`);
  }
}

function assertCanaryGreen(hubId) {
  const child = path.join(IMPL_ROOT, HUB_CHILD[hubId]);
  execFileSync('node', [path.join(child, 'harness', 'validate-canary.cjs')], { stdio: ['ignore', 'ignore', 'pipe'] });
}

// The engine must route at least one designed scenario (proves the compiled
// contract is live-routable for this hub before we make it authoritative).
function assertEngineRoutes(hubId) {
  const { snapshot } = loadHubEngine(hubId);
  const child = path.join(IMPL_ROOT, HUB_CHILD[hubId]);
  const { loadSnapshot } = require(path.join(child, 'harness', 'build-artifacts.cjs'));
  const { fixture } = loadSnapshot();
  const cases = fixture.cases || [];
  let routed = 0;
  for (const c of cases) {
    const prompt = c.prompt || c.taskText || c.input || '';
    if (prompt && compiledRoute(hubId, prompt).action === 'route') routed += 1;
  }
  if (routed < 1) throw new Error(`engine routed 0 scenarios for ${hubId}; refusing to make it authoritative`);
  return { routedScenarios: routed, totalScenarios: cases.length, effectivePolicyHash: snapshot.policy.effectivePolicyHash };
}

// Append-only per-hub audit ledger. Same file and same shape emitted by
// activate-hub.cjs; the canonical schema is documented once in the rollback
// packet's references/flip-history-schema.md.
function appendFlipEvent(hubDir, event) {
  const line = JSON.stringify({ ts: new Date().toISOString(), schemaVersion: 'flip-history/V1', ...event });
  fs.appendFileSync(path.join(hubDir, 'flip-history.jsonl'), `${line}\n`);
}

// Persist the fence epoch with a transition direction so a cutover advance and a
// recovery advance are distinguishable from the persisted state alone.
function writeFence(hubDir, fencingEpoch, direction) {
  fs.writeFileSync(
    path.join(hubDir, 'fence-state.json'),
    `${stableStringify({ fencingEpoch, direction, schemaVersion: 'V1' })}\n`,
  );
}

// Retain the byte-identical CURRENT manifest as the serving-prior. Unconditional
// on purpose: a re-flip after a rollback must capture the state immediately
// before THIS flip, not the first-ever prior (the original guard saved only on
// the very first flip, silently going stale on every re-flip).
function resaveServingPrior(hubDir) {
  fs.writeFileSync(
    path.join(hubDir, 'manifest.serving-prior.json'),
    fs.readFileSync(path.join(hubDir, 'manifest.json')),
  );
}

// Serving-authority rollback: restore the byte-identical pre-flip manifest, tag
// the fence advance as a recovery, and append the event to the audit ledger.
function performServingRollback(hubDir, hubId) {
  const manifestPath = path.join(hubDir, 'manifest.json');
  const servingPriorPath = path.join(hubDir, 'manifest.serving-prior.json');
  const fence = readJson(path.join(hubDir, 'fence-state.json')).fencingEpoch;
  if (!fs.existsSync(servingPriorPath)) throw new Error(`no serving-prior to roll back to for ${hubId}`);
  fs.writeFileSync(manifestPath, fs.readFileSync(servingPriorPath));
  const nextFence = fence + 1;
  writeFence(hubDir, nextFence, 'rollback');
  const restored = readJson(manifestPath);
  const restoredHash = fileHash(manifestPath);
  appendFlipEvent(hubDir, {
    hubId, driver: 'flip-serving', event: 'serving-rollback', direction: 'rollback',
    servingAuthority: restored.servingAuthority, shadowOnly: restored.shadowOnly === true,
    selectedGeneration: restored.selectedPolicy ? restored.selectedPolicy.generation : null,
    fenceEpoch: { before: fence, after: nextFence }, manifestHash: restoredHash, restoredHash,
  });
  return {
    hubId, rolledBack: true, servingAuthority: restored.servingAuthority,
    shadowOnly: restored.shadowOnly, fenceEpoch: { before: fence, after: nextFence },
  };
}

function main() {
  const args = process.argv.slice(2);
  const hubId = args[args.indexOf('--hub') + 1];
  const rollback = args.includes('--rollback');
  const asJson = args.includes('--json');
  if (!hubId || !HUB_CHILD[hubId]) throw new Error('usage: flip-serving.cjs --hub <hubId> [--rollback] [--json]');

  const hubDir = path.join(ACTIVATION_ROOT, hubId);
  const manifestPath = path.join(hubDir, 'manifest.json');
  const fencePath = path.join(hubDir, 'fence-state.json');
  if (!fs.existsSync(manifestPath)) throw new Error(`hub not P4a-activated (no manifest): ${hubId}`);

  const manifest = readJson(manifestPath);
  const fence = readJson(fencePath).fencingEpoch;

  if (rollback) {
    const out = performServingRollback(hubDir, hubId);
    process.stdout.write(asJson ? `${JSON.stringify(out, null, 2)}\n`
      : `ROLLBACK hub=${hubId} serving=${out.servingAuthority} shadowOnly=${out.shadowOnly} `
        + `fence=${out.fenceEpoch.before}->${out.fenceEpoch.after} direction=rollback\n`);
    return;
  }

  // Idempotent: already compiled-serving.
  if (manifest.servingAuthority === 'compiled') {
    process.stdout.write(`ALREADY-COMPILED hub=${hubId} (no-op)\n`);
    return;
  }
  // Preconditions.
  if (manifest.selectedPolicy.effectivePolicyHash == null) throw new Error(`${hubId} is not P4a-bound (selectedPolicy is legacy)`);
  assertScorerFrozen();
  assertCanaryGreen(hubId);
  const routeProof = assertEngineRoutes(hubId);

  // Retain the byte-identical pre-flip manifest (unconditional), then flip.
  resaveServingPrior(hubDir);
  const flipped = { ...manifest, servingAuthority: 'compiled', shadowOnly: false };
  fs.writeFileSync(manifestPath, `${stableStringify(flipped)}\n`);
  const nextFence = fence + 1;
  writeFence(hubDir, nextFence, 'forward');

  const out = {
    hubId, servingAuthority: 'compiled', shadowOnly: false,
    selectedPolicy: flipped.selectedPolicy, fenceEpoch: { before: fence, after: nextFence },
    gate: { canaryGreen: true, scorerFrozen: true, ...routeProof },
    rollbackTo: 'manifest.serving-prior.json',
  };
  fs.writeFileSync(path.join(hubDir, 'serving-flip-record.json'), `${stableStringify(out)}\n`);
  appendFlipEvent(hubDir, {
    hubId, driver: 'flip-serving', event: 'serving-flip', direction: 'forward',
    servingAuthority: 'compiled', shadowOnly: false, selectedGeneration: flipped.selectedPolicy.generation,
    fenceEpoch: { before: fence, after: nextFence }, manifestHash: fileHash(manifestPath), restoredHash: null,
  });
  process.stdout.write(asJson ? `${JSON.stringify(out, null, 2)}\n`
    : `FLIPPED hub=${hubId} serving=compiled shadowOnly=false gen=${flipped.selectedPolicy.generation} fence=${fence}->${nextFence} routed=${routeProof.routedScenarios}/${routeProof.totalScenarios} canaryGreen=true scorerFrozen=true\n`);
}

if (require.main === module) {
  try { main(); } catch (e) { process.stderr.write(`FLIP FAILED: ${e.message}\n`); process.exit(1); }
}

module.exports = {
  appendFlipEvent,
  writeFence,
  resaveServingPrior,
  performServingRollback,
  assertScorerFrozen,
  fileHash,
  readJson,
  stableStringify,
};
