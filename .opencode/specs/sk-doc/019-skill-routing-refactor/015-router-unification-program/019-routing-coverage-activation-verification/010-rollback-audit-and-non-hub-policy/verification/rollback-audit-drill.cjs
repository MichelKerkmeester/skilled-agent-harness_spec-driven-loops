#!/usr/bin/env node
'use strict';

// Rollback + audit-integrity drill for the activation/serving-flip drivers.
//
// Exercises the REAL exported functions of activate-hub.cjs and flip-serving.cjs
// against isolated fixtures in the OS temp dir — never the seven live hub
// directories — proving:
//   - activate-hub.cjs --rollback restores the byte-identical prior manifest
//     (restoredHash === priorManifestHash) as a committed state change;
//   - the binding rollback refuses to change serving authority (fail-closed);
//   - a second rollback is an idempotent no-op that still appends to history;
//   - flip-serving.cjs re-saves serving-prior UNCONDITIONALLY before a flip
//     (rollback-then-reflip retains the immediately-prior state, not the first);
//   - fence-state.json carries a `direction` distinguishing cutover from
//     recovery;
//   - flip-history.jsonl is append-only (no event is ever erased).
//
// Fixtures are seeded byte-for-byte from a real hub's committed P4a state, so
// the assertions run against production-shaped manifests.

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const IMPL_ROOT = path.resolve(__dirname, '..', '..', '..');
const activateHub = require(path.join(IMPL_ROOT, '010-live-activation', 'lib', 'activate-hub.cjs'));
const flipServing = require(path.join(IMPL_ROOT, '011-runtime-engine', 'lib', 'flip-serving.cjs'));
const REAL_HUB_DIR = path.join(IMPL_ROOT, '010-live-activation', 'activation', 'cli-external-orchestration');

function sha256File(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}
function stableStringify(value) {
  const sort = (v) => Array.isArray(v) ? v.map(sort)
    : (v && typeof v === 'object') ? Object.keys(v).sort().reduce((a, k) => (a[k] = sort(v[k]), a), {}) : v;
  return JSON.stringify(sort(value));
}
function lineCount(p) {
  if (!fs.existsSync(p)) return 0;
  return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).length;
}

let pass = 0;
let fail = 0;
function check(label, cond, detail) {
  if (cond) { pass += 1; process.stdout.write(`  PASS  ${label}${detail ? ` — ${detail}` : ''}\n`); }
  else { fail += 1; process.stdout.write(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}\n`); }
}

// Seed a fixture hub dir in an isolated temp location, byte-for-byte from the
// real hub's retained prior + candidate, with manifest.json at the P4a-activated
// (pre-serving-flip) state so a binding rollback keeps serving authority legacy.
function seedP4aFixture(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.copyFileSync(path.join(REAL_HUB_DIR, 'manifest.prior.json'), path.join(dir, 'manifest.prior.json'));
  fs.copyFileSync(path.join(REAL_HUB_DIR, 'manifest.candidate.json'), path.join(dir, 'manifest.candidate.json'));
  // P4a-activated, pre-flip: serving manifest == candidate (serving legacy).
  fs.copyFileSync(path.join(dir, 'manifest.candidate.json'), path.join(dir, 'manifest.json'));
  fs.writeFileSync(path.join(dir, 'fence-state.json'),
    `${stableStringify({ fencingEpoch: 1, direction: 'forward', schemaVersion: 'V1' })}\n`);
  const priorHash = sha256File(path.join(dir, 'manifest.prior.json'));
  fs.writeFileSync(path.join(dir, 'activation-record.json'),
    `${stableStringify({ hubId: name, schemaVersion: 'V1', priorManifestHash: priorHash, activated: true })}\n`);
  return { dir, priorHash };
}

function main() {
  const temps = [];
  try {
    // ---- activate-hub.cjs binding rollback (committed, byte-exact) ----
    process.stdout.write('\n[REQ-001] activate-hub.cjs --rollback (committed byte-exact restore)\n');
    const fx = seedP4aFixture('drill-binding');
    temps.push(fx.dir);
    const beforeManifestHash = sha256File(path.join(fx.dir, 'manifest.json'));
    const r1 = activateHub.rollbackHub(fx.dir);
    const restoredHash = sha256File(path.join(fx.dir, 'manifest.json'));
    check('rollback reports byteExact', r1.byteExact === true, `byteExact=${r1.byteExact}`);
    check('restoredHash === priorManifestHash',
      r1.restoredHash === fx.priorHash && restoredHash === fx.priorHash,
      `restored=${restoredHash.slice(0, 12)} prior=${fx.priorHash.slice(0, 12)}`);
    check('manifest.json bytes now equal manifest.prior.json',
      restoredHash === sha256File(path.join(fx.dir, 'manifest.prior.json')));
    check('rollback actually changed state (was not already prior)', beforeManifestHash !== restoredHash);
    const restored = JSON.parse(fs.readFileSync(path.join(fx.dir, 'manifest.json'), 'utf8'));
    check('serving authority unchanged by rollback (legacy)', restored.servingAuthority === 'legacy',
      `servingAuthority=${restored.servingAuthority}`);
    check('selectedPolicy reverted to prior generation', restored.selectedPolicy.generation === 0,
      `generation=${restored.selectedPolicy.generation}`);

    // ---- fence direction distinguishes recovery from cutover ----
    process.stdout.write('\n[REQ-003] fence-state.json direction (cutover vs recovery)\n');
    const fence1 = JSON.parse(fs.readFileSync(path.join(fx.dir, 'fence-state.json'), 'utf8'));
    check('fence records direction=rollback after recovery', fence1.direction === 'rollback',
      `direction=${fence1.direction}`);
    check('fence advanced monotonically (1 -> 2)', fence1.fencingEpoch === 2, `epoch=${fence1.fencingEpoch}`);

    // ---- append-only history + idempotent no-op ----
    process.stdout.write('\n[REQ-004] flip-history.jsonl append-only + idempotent no-op\n');
    const histPath = path.join(fx.dir, 'flip-history.jsonl');
    check('flip-history.jsonl has 1 entry after first rollback', lineCount(histPath) === 1,
      `lines=${lineCount(histPath)}`);
    const r2 = activateHub.rollbackHub(fx.dir); // second run = idempotent no-op
    check('second rollback is a no-op', r2.noop === true, `noop=${r2.noop}`);
    check('no-op still appended a history entry (append-only)', lineCount(histPath) === 2,
      `lines=${lineCount(histPath)}`);
    check('manifest bytes unchanged by no-op rollback',
      sha256File(path.join(fx.dir, 'manifest.json')) === restoredHash);
    const evs = fs.readFileSync(histPath, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
    check('history events carry driver + direction fields',
      evs.every((e) => e.driver === 'activate-hub' && e.direction === 'rollback' && e.schemaVersion === 'flip-history/V1'));

    // ---- rollback refuses to flip serving authority ----
    process.stdout.write('\n[REQ-001 guard] binding rollback refuses to change serving authority\n');
    const fxG = seedP4aFixture('drill-guard');
    temps.push(fxG.dir);
    // Simulate a hub whose serving was already flipped to compiled.
    const flippedManifest = { ...JSON.parse(fs.readFileSync(path.join(fxG.dir, 'manifest.json'), 'utf8')),
      servingAuthority: 'compiled', shadowOnly: false };
    fs.writeFileSync(path.join(fxG.dir, 'manifest.json'), `${stableStringify(flippedManifest)}\n`);
    let threw = false;
    let msg = '';
    try { activateHub.rollbackHub(fxG.dir); } catch (e) { threw = true; msg = e.message; }
    check('rollback throws when it would change serving authority', threw, msg.slice(0, 70));
    check('manifest left serving=compiled (fail-closed, no partial write)',
      JSON.parse(fs.readFileSync(path.join(fxG.dir, 'manifest.json'), 'utf8')).servingAuthority === 'compiled');

    // ---- flip-serving unconditional serving-prior resave ----
    process.stdout.write('\n[REQ-002] flip-serving.cjs unconditional serving-prior resave\n');
    const flipDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drill-flip-'));
    temps.push(flipDir);
    const manifestA = { schemaVersion: 'V1', selectedPolicy: { effectivePolicyHash: 'aaa', generation: 5 }, servingAuthority: 'legacy', shadowOnly: true };
    const manifestB = { schemaVersion: 'V1', selectedPolicy: { effectivePolicyHash: 'bbb', generation: 6 }, servingAuthority: 'legacy', shadowOnly: true };
    fs.writeFileSync(path.join(flipDir, 'manifest.json'), `${stableStringify(manifestA)}\n`);
    flipServing.resaveServingPrior(flipDir); // first flip: creates serving-prior = A
    check('serving-prior captured first manifest (A)',
      sha256File(path.join(flipDir, 'manifest.serving-prior.json')) === sha256File(path.join(flipDir, 'manifest.json')));
    const priorAfterA = sha256File(path.join(flipDir, 'manifest.serving-prior.json'));
    // Manifest changes to B (e.g. a re-bind after a rollback), then re-flip.
    fs.writeFileSync(path.join(flipDir, 'manifest.json'), `${stableStringify(manifestB)}\n`);
    flipServing.resaveServingPrior(flipDir); // re-flip: MUST overwrite serving-prior = B
    const priorAfterB = sha256File(path.join(flipDir, 'manifest.serving-prior.json'));
    check('serving-prior REFRESHED to current manifest (B) on re-flip — not stale (A)',
      priorAfterB === sha256File(path.join(flipDir, 'manifest.json')) && priorAfterB !== priorAfterA,
      'unconditional resave confirmed');

    // ---- flip-serving rollback path (direction + history) ----
    process.stdout.write('\n[REQ-002/003/004] flip-serving.cjs serving rollback (direction + audit)\n');
    const fxR = fs.mkdtempSync(path.join(os.tmpdir(), 'drill-flip-rb-'));
    temps.push(fxR);
    // Pre-flip serving-prior (legacy) retained; current manifest flipped to compiled.
    fs.writeFileSync(path.join(fxR, 'manifest.serving-prior.json'), `${stableStringify(manifestA)}\n`);
    const compiledManifest = { ...manifestA, servingAuthority: 'compiled', shadowOnly: false };
    fs.writeFileSync(path.join(fxR, 'manifest.json'), `${stableStringify(compiledManifest)}\n`);
    fs.writeFileSync(path.join(fxR, 'fence-state.json'),
      `${stableStringify({ fencingEpoch: 3, direction: 'forward', schemaVersion: 'V1' })}\n`);
    const rb = flipServing.performServingRollback(fxR, 'drill-flip-rb');
    const rbManifest = JSON.parse(fs.readFileSync(path.join(fxR, 'manifest.json'), 'utf8'));
    check('serving rollback restored serving=legacy', rbManifest.servingAuthority === 'legacy',
      `servingAuthority=${rbManifest.servingAuthority}`);
    check('serving rollback restored byte-identical serving-prior',
      sha256File(path.join(fxR, 'manifest.json')) === sha256File(path.join(fxR, 'manifest.serving-prior.json')));
    const rbFence = JSON.parse(fs.readFileSync(path.join(fxR, 'fence-state.json'), 'utf8'));
    check('serving rollback fence direction=rollback', rbFence.direction === 'rollback', `direction=${rbFence.direction}`);
    check('serving rollback fence advanced 3 -> 4', rbFence.fencingEpoch === 4 && rb.fenceEpoch.after === 4);
    check('serving rollback appended a flip-history entry',
      lineCount(path.join(fxR, 'flip-history.jsonl')) === 1);
    const rbEv = JSON.parse(fs.readFileSync(path.join(fxR, 'flip-history.jsonl'), 'utf8').trim());
    check('flip-serving history entry shares the schema (driver+direction+event)',
      rbEv.driver === 'flip-serving' && rbEv.direction === 'rollback' && rbEv.event === 'serving-rollback'
        && rbEv.schemaVersion === 'flip-history/V1');

    process.stdout.write(`\nDRILL RESULT: ${pass} passed, ${fail} failed\n`);
  } finally {
    for (const d of temps) {
      try { if (typeof d === 'string') fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
    }
  }
  process.exit(fail === 0 ? 0 : 1);
}

main();
