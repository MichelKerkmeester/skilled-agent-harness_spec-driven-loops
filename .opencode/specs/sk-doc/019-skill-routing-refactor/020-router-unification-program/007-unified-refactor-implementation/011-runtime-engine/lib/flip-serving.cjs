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
//   - the compiled engine actually routes at least one designed scenario,
//   - the loaded snapshot identity equals the manifest's selectedPolicy.
// The whole operation runs under the shared exclusive per-hub lock (the SAME lock
// the activation driver takes), and is crash-safe via a write-ahead journal: the
// intended end state (selectedPolicy + the advanced fence epoch) is recorded BEFORE
// the tuple is mutated and cleared only AFTER every tuple member is written. A run
// that finds a journal completes the interrupted flip deterministically — to the
// intended fence, not a stale one — before doing anything else. Reversible:
// `--rollback` restores the byte-identical pre-flip manifest under the same lock.
//
// This never edits a live SKILL.md, hub-router.json, or the frozen scorer; the
// runtime only honors the flip when SPECKIT_COMPILED_ROUTING=1 (see resolve.cjs).

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { execFileSync } = require('child_process');
const { compiledRoute, loadHubEngine, HUB_CHILD } = require('./compiled-route.cjs');
const { assertScorerFrozen } = require('../../shared/frozen-scorer-contract.cjs');
const { withHubLock } = require('../../shared/hub-lock.cjs');

const IMPL_ROOT = path.resolve(__dirname, '..', '..');
// Activation state root. Tests point SPECKIT_ACTIVATION_ROOT_OVERRIDE at a temp
// copy so the harness never mutates live committed state (see verify-runtime-engine).
const ACTIVATION_ROOT = process.env.SPECKIT_ACTIVATION_ROOT_OVERRIDE
  || path.join(IMPL_ROOT, '010-live-activation', 'activation');

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
function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function fileHash(p) { return sha256(fs.readFileSync(p)); }
function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function stableStringify(v) {
  const s = (x) => Array.isArray(x) ? x.map(s)
    : (x && typeof x === 'object') ? Object.keys(x).sort().reduce((a, k) => (a[k] = s(x[k]), a), {}) : x;
  return JSON.stringify(s(v));
}

// Atomic single-file replace: write a sibling temp then rename over the target,
// so a crash mid-write never leaves a truncated authority file.
function atomicWrite(targetPath, bytes) {
  const tmp = `${targetPath}.tmp.${process.pid}`;
  fs.writeFileSync(tmp, bytes);
  fs.renameSync(tmp, targetPath);
}

function tuplePaths(hubDir) {
  return {
    manifestPath: path.join(hubDir, 'manifest.json'),
    servingPriorPath: path.join(hubDir, 'manifest.serving-prior.json'),
    fencePath: path.join(hubDir, 'fence-state.json'),
    recordPath: path.join(hubDir, 'serving-flip-record.json'),
    journalPath: path.join(hubDir, '.flip-journal.json'),
  };
}

// Crash recovery. A journal is present ONLY between the start and end of a tuple
// mutation, so its presence means the last flip was interrupted. Re-apply the
// journal's intended end state deterministically — manifest compiled at the
// journal's selectedPolicy, fence advanced to the journal's target epoch, record
// rebuilt — then clear the journal. Idempotent (safe to re-run). Caller holds the
// lock. Returns the journal if one was recovered, else null.
function recoverFromJournal(hubDir) {
  const { manifestPath, fencePath, recordPath, journalPath } = tuplePaths(hubDir);
  if (!fs.existsSync(journalPath)) return null;
  const j = readJson(journalPath);
  const manifest = readJson(manifestPath);
  const flipped = { ...manifest, selectedPolicy: j.selectedPolicy, servingAuthority: 'compiled', shadowOnly: false };
  atomicWrite(manifestPath, `${stableStringify(flipped)}\n`);
  atomicWrite(fencePath, `${stableStringify({ fencingEpoch: j.after, schemaVersion: 'V1' })}\n`);
  atomicWrite(recordPath, `${stableStringify({
    hubId: j.hubId, servingAuthority: 'compiled', shadowOnly: false,
    selectedPolicy: j.selectedPolicy, fenceEpoch: { before: j.before, after: j.after },
    gate: { recovered: true }, rollbackTo: 'manifest.serving-prior.json',
  })}\n`);
  fs.rmSync(journalPath, { force: true });
  return j;
}

function assertCanaryGreen(hubId) {
  const child = path.join(IMPL_ROOT, HUB_CHILD[hubId]);
  execFileSync('node', [path.join(child, 'harness', 'validate-canary.cjs')], { stdio: ['ignore', 'ignore', 'pipe'] });
}

// The engine must route at least one designed scenario (proves the compiled
// contract is live-routable for this hub before we make it authoritative), and
// returns the loaded snapshot's identity so the caller can bind it to the
// manifest's selectedPolicy before flipping.
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
  return {
    routedScenarios: routed,
    totalScenarios: cases.length,
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    generation: snapshot.policy.activationGeneration,
  };
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
  const { manifestPath, servingPriorPath, fencePath, recordPath, journalPath } = tuplePaths(hubDir);
  if (!fs.existsSync(manifestPath)) throw new Error(`hub not P4a-activated (no manifest): ${hubId}`);

  const out = withHubLock(hubDir, rollback ? 'serving-rollback' : 'serving-flip', () => {
    // Complete any interrupted flip FIRST, so every branch sees a consistent tuple.
    const recovered = recoverFromJournal(hubDir);
    const manifest = readJson(manifestPath);
    const fence = readJson(fencePath).fencingEpoch;

    if (rollback) {
      if (!fs.existsSync(servingPriorPath)) throw new Error(`no serving-prior to roll back to for ${hubId}`);
      atomicWrite(manifestPath, fs.readFileSync(servingPriorPath));
      const nextFence = fence + 1;
      atomicWrite(fencePath, `${stableStringify({ fencingEpoch: nextFence, schemaVersion: 'V1' })}\n`);
      const restored = readJson(manifestPath);
      return { kind: 'rollback', hubId, servingAuthority: restored.servingAuthority, shadowOnly: restored.shadowOnly, fenceEpoch: { before: fence, after: nextFence } };
    }

    // Idempotent: already compiled-serving (recovery above already completed any
    // interrupted flip, so a compiled manifest here means a whole tuple). Self-heal a
    // serving-flip record removed after a clean flip: it is a non-serving audit
    // artifact (the manifest stays the authority), so rebuild it from the live
    // manifest + fence rather than leave an audit gap. The exact original fence
    // transition is unrecoverable once the record is gone, so mark the rebuild and
    // bind only the current epoch.
    if (manifest.servingAuthority === 'compiled') {
      let recordRebuilt = false;
      if (!fs.existsSync(recordPath)) {
        atomicWrite(recordPath, `${stableStringify({
          hubId, servingAuthority: 'compiled', shadowOnly: false,
          selectedPolicy: manifest.selectedPolicy, fenceEpoch: { before: null, after: fence },
          gate: { reconstructed: true }, rollbackTo: 'manifest.serving-prior.json',
        })}\n`);
        recordRebuilt = true;
      }
      return { kind: 'idempotent', hubId, recovered: recovered ? recovered.after : null, recordRebuilt };
    }

    // Preconditions.
    if (manifest.selectedPolicy.effectivePolicyHash == null) throw new Error(`${hubId} is not P4a-bound (selectedPolicy is legacy)`);
    assertScorerFrozen(findRepoRoot(IMPL_ROOT), 'the serving flip');
    assertCanaryGreen(hubId);
    const routeProof = assertEngineRoutes(hubId);

    // Identity binding: the snapshot we are about to make authoritative MUST be the
    // exact generation P4a selected — else refuse to certify a drifted contract.
    if (routeProof.effectivePolicyHash !== manifest.selectedPolicy.effectivePolicyHash) {
      throw new Error(`${hubId}: loaded snapshot hash ${routeProof.effectivePolicyHash} != selectedPolicy ${manifest.selectedPolicy.effectivePolicyHash}`);
    }
    if (routeProof.generation !== manifest.selectedPolicy.generation) {
      throw new Error(`${hubId}: loaded snapshot generation ${routeProof.generation} != selectedPolicy ${manifest.selectedPolicy.generation}`);
    }

    // Compare: re-read the fence after the long gates; abort if it moved (it can't,
    // under the lock, but this keeps the CAS invariant explicit).
    if (readJson(fencePath).fencingEpoch !== fence) throw new Error(`fence advanced during flip; aborting`);
    const nextFence = fence + 1;
    // Write-ahead journal: record the intended end state BEFORE mutating the tuple.
    atomicWrite(journalPath, `${stableStringify({ intent: 'flip', hubId, selectedPolicy: manifest.selectedPolicy, before: fence, after: nextFence })}\n`);
    if (!fs.existsSync(servingPriorPath)) atomicWrite(servingPriorPath, fs.readFileSync(manifestPath));
    const flipped = { ...manifest, servingAuthority: 'compiled', shadowOnly: false };
    atomicWrite(manifestPath, `${stableStringify(flipped)}\n`);
    atomicWrite(fencePath, `${stableStringify({ fencingEpoch: nextFence, schemaVersion: 'V1' })}\n`);
    const record = {
      hubId, servingAuthority: 'compiled', shadowOnly: false,
      selectedPolicy: flipped.selectedPolicy, fenceEpoch: { before: fence, after: nextFence },
      gate: { canaryGreen: true, scorerFrozen: true, ...routeProof },
      rollbackTo: 'manifest.serving-prior.json',
    };
    atomicWrite(recordPath, `${stableStringify(record)}\n`);
    fs.rmSync(journalPath, { force: true }); // clear the journal LAST -> a lingering journal means "interrupted"
    return { kind: 'flip', ...record, routeProof };
  });

  if (asJson) { process.stdout.write(`${JSON.stringify(out, null, 2)}\n`); return; }
  if (out.kind === 'rollback') {
    process.stdout.write(`ROLLBACK hub=${hubId} serving=${out.servingAuthority} shadowOnly=${out.shadowOnly} fence=${out.fenceEpoch.before}->${out.fenceEpoch.after}\n`);
  } else if (out.kind === 'idempotent') {
    const note = out.recovered != null ? `recovered interrupted flip to fence ${out.recovered}`
      : out.recordRebuilt ? 'rebuilt a missing serving-flip audit record'
      : 'no-op';
    process.stdout.write(`ALREADY-COMPILED hub=${hubId} (${note})\n`);
  } else {
    process.stdout.write(`FLIPPED hub=${hubId} serving=compiled shadowOnly=false gen=${out.selectedPolicy.generation} fence=${out.fenceEpoch.before}->${out.fenceEpoch.after} routed=${out.routeProof.routedScenarios}/${out.routeProof.totalScenarios} canaryGreen=true scorerFrozen=true\n`);
  }
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
