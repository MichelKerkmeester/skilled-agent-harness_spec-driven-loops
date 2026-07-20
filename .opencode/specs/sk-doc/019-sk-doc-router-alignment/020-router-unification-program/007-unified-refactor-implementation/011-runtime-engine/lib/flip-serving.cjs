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
// The swap runs under the shared exclusive per-hub lock (the SAME lock the
// activation driver takes), re-reads and compares the fence epoch immediately
// before writing (compare), then replaces each file atomically (swap) — so no two
// writers consume one epoch or interleave a partial write. A flip interrupted
// between the manifest and fence/record writes is reconciled on the next run
// before the idempotent no-op returns. Reversible: `--rollback` restores the
// byte-identical pre-flip manifest under the same fenced discipline.
//
// This never edits a live SKILL.md, hub-router.json, or the frozen scorer; the
// runtime only honors the flip when SPECKIT_COMPILED_ROUTING=1 (see resolve.cjs).

const fs = require('fs');
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

// Reconcile a compiled hub's tuple. The manifest is the authority; the fence and
// serving-flip record are derived bookkeeping written AFTER it. A crash between
// those writes leaves the manifest compiled while the record is missing/stale or
// the fence does not match — a state the idempotent no-op would otherwise accept.
// This rebuilds the record from the authoritative manifest and ensures the fence
// file exists, so `manifest compiled <=> record matches <=> fence present` holds.
// Returns the names of the members it repaired (empty when the tuple was whole).
// Callers MUST hold the hub lock.
function reconcileTuple(hubDir, manifest, fence) {
  const repaired = [];
  const recordPath = path.join(hubDir, 'serving-flip-record.json');
  const fencePath = path.join(hubDir, 'fence-state.json');

  let record = null;
  try { record = readJson(recordPath); } catch { record = null; }
  const recordMatches = record
    && record.servingAuthority === 'compiled'
    && stableStringify(record.selectedPolicy) === stableStringify(manifest.selectedPolicy);
  const fenceMatches = recordMatches
    && record.fenceEpoch && record.fenceEpoch.after === fence;
  if (recordMatches && fenceMatches) return repaired; // tuple is whole

  const rebuilt = {
    hubId: path.basename(hubDir),
    servingAuthority: 'compiled',
    shadowOnly: false,
    selectedPolicy: manifest.selectedPolicy,
    fenceEpoch: { before: Math.max(0, fence - 1), after: fence },
    gate: (record && record.gate) || { reconciled: true },
    rollbackTo: 'manifest.serving-prior.json',
    reconciled: true,
  };
  atomicWrite(recordPath, `${stableStringify(rebuilt)}\n`);
  repaired.push('serving-flip-record');
  if (!fs.existsSync(fencePath)) {
    atomicWrite(fencePath, `${stableStringify({ fencingEpoch: fence, schemaVersion: 'V1' })}\n`);
    repaired.push('fence-state');
  }
  return repaired;
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

function main() {
  const args = process.argv.slice(2);
  const hubId = args[args.indexOf('--hub') + 1];
  const rollback = args.includes('--rollback');
  const asJson = args.includes('--json');
  if (!hubId || !HUB_CHILD[hubId]) throw new Error('usage: flip-serving.cjs --hub <hubId> [--rollback] [--json]');

  const hubDir = path.join(ACTIVATION_ROOT, hubId);
  const manifestPath = path.join(hubDir, 'manifest.json');
  const servingPriorPath = path.join(hubDir, 'manifest.serving-prior.json');
  const fencePath = path.join(hubDir, 'fence-state.json');
  if (!fs.existsSync(manifestPath)) throw new Error(`hub not P4a-activated (no manifest): ${hubId}`);

  const manifest = readJson(manifestPath);
  const fence = readJson(fencePath).fencingEpoch;

  if (rollback) {
    if (!fs.existsSync(servingPriorPath)) throw new Error(`no serving-prior to roll back to for ${hubId}`);
    const priorBytes = fs.readFileSync(servingPriorPath);
    const out = withHubLock(hubDir, 'serving-rollback', () => {
      // Compare: the fence must not have advanced since we read it (no racing
      // writer) before we restore; then swap manifest and fence atomically.
      const fenceNow = readJson(fencePath).fencingEpoch;
      if (fenceNow !== fence) throw new Error(`fence advanced ${fence}->${fenceNow} during rollback (concurrent writer); aborting`);
      atomicWrite(manifestPath, priorBytes);
      const nextFence = fence + 1;
      atomicWrite(fencePath, `${stableStringify({ fencingEpoch: nextFence, schemaVersion: 'V1' })}\n`);
      const restored = readJson(manifestPath);
      return { hubId, rolledBack: true, servingAuthority: restored.servingAuthority, shadowOnly: restored.shadowOnly, fenceEpoch: { before: fence, after: nextFence } };
    });
    process.stdout.write(asJson ? `${JSON.stringify(out, null, 2)}\n`
      : `ROLLBACK hub=${hubId} serving=${out.servingAuthority} shadowOnly=${out.shadowOnly} fence=${out.fenceEpoch.before}->${out.fenceEpoch.after}\n`);
    return;
  }

  // Idempotent: already compiled-serving. Reconcile any half-committed tuple left
  // by a crash between the manifest and the fence/record writes BEFORE the no-op
  // returns, so an interrupted flip is completed rather than accepted as done.
  if (manifest.servingAuthority === 'compiled') {
    const repaired = withHubLock(hubDir, 'serving-reconcile', () => reconcileTuple(hubDir, manifest, fence));
    process.stdout.write(repaired.length
      ? `ALREADY-COMPILED hub=${hubId} (reconciled: ${repaired.join(', ')})\n`
      : `ALREADY-COMPILED hub=${hubId} (no-op)\n`);
    return;
  }
  // Preconditions.
  if (manifest.selectedPolicy.effectivePolicyHash == null) throw new Error(`${hubId} is not P4a-bound (selectedPolicy is legacy)`);
  assertScorerFrozen(findRepoRoot(IMPL_ROOT), 'the serving flip');
  assertCanaryGreen(hubId);
  const routeProof = assertEngineRoutes(hubId);

  // Identity binding: the snapshot we are about to make authoritative MUST be the
  // exact generation P4a selected. If a rollout artifact drifted after binding, its
  // hash/generation diverge from the manifest's selectedPolicy — refuse to certify
  // a different contract than the one that was bound.
  if (routeProof.effectivePolicyHash !== manifest.selectedPolicy.effectivePolicyHash) {
    throw new Error(`${hubId}: loaded snapshot hash ${routeProof.effectivePolicyHash} != selectedPolicy ${manifest.selectedPolicy.effectivePolicyHash}`);
  }
  if (routeProof.generation !== manifest.selectedPolicy.generation) {
    throw new Error(`${hubId}: loaded snapshot generation ${routeProof.generation} != selectedPolicy ${manifest.selectedPolicy.generation}`);
  }

  const out = withHubLock(hubDir, 'serving-flip', () => {
    // Compare: re-read the fence after the long gates and abort if a concurrent
    // writer advanced it. Then swap — write order is serving-prior (rollback
    // safety) -> manifest (the authority) -> fence (bookkeeping) -> record, each an
    // atomic replace, so a crash leaves the manifest authority self-consistent and
    // the next run's reconcile completes the tuple.
    const fenceNow = readJson(fencePath).fencingEpoch;
    if (fenceNow !== fence) throw new Error(`fence advanced ${fence}->${fenceNow} during flip (concurrent writer); aborting`);
    if (!fs.existsSync(servingPriorPath)) atomicWrite(servingPriorPath, fs.readFileSync(manifestPath));
    const flipped = { ...manifest, servingAuthority: 'compiled', shadowOnly: false };
    atomicWrite(manifestPath, `${stableStringify(flipped)}\n`);
    const nextFence = fence + 1;
    atomicWrite(fencePath, `${stableStringify({ fencingEpoch: nextFence, schemaVersion: 'V1' })}\n`);
    const record = {
      hubId, servingAuthority: 'compiled', shadowOnly: false,
      selectedPolicy: flipped.selectedPolicy, fenceEpoch: { before: fence, after: nextFence },
      gate: { canaryGreen: true, scorerFrozen: true, ...routeProof },
      rollbackTo: 'manifest.serving-prior.json',
    };
    atomicWrite(path.join(hubDir, 'serving-flip-record.json'), `${stableStringify(record)}\n`);
    return record;
  });
  process.stdout.write(asJson ? `${JSON.stringify(out, null, 2)}\n`
    : `FLIPPED hub=${hubId} serving=compiled shadowOnly=false gen=${out.selectedPolicy.generation} fence=${out.fenceEpoch.before}->${out.fenceEpoch.after} routed=${routeProof.routedScenarios}/${routeProof.totalScenarios} canaryGreen=true scorerFrozen=true\n`);
}

try { main(); } catch (e) { process.stderr.write(`FLIP FAILED: ${e.message}\n`); process.exit(1); }
