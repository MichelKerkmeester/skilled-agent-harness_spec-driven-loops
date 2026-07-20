#!/usr/bin/env node
'use strict';

// Phase-local regression suite for the compiled-routing runtime engine.
//
// Isolation: the suite runs ENTIRELY against a throwaway copy of the activation
// tree, never the live committed state. It copies `activation/` into a temp
// sandbox, points SPECKIT_ACTIVATION_ROOT_OVERRIDE at the copy BEFORE loading the
// engine modules (they read the override at load), passes the same override to
// every flip-serving child process, and deletes the sandbox on exit. So the suite
// mutates freely, is safe to run repeatedly and concurrently, and can never revert
// a real activation.
//
// Coverage: the closed decision algebra (both a route AND a negative decision),
// flag-off inertness, serve-time identity binding (match serves + mismatch fails
// safe), the fenced serving CAS (byte-exact rollback + byte-identical reflip), the
// shared lock (a live holder is refused, a stale holder is reclaimed), and
// flip-time identity binding (a tampered selectedPolicy is refused).

const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const crypto = require('crypto');

const HARNESS = __dirname;
const LIB = path.resolve(HARNESS, '..', 'lib');
const IMPL = path.resolve(HARNESS, '..', '..'); // the implementation root
const LIVE_ACTIVATION = path.join(IMPL, '010-live-activation', 'activation');
const FLIP = path.join(LIB, 'flip-serving.cjs');

// --- sandbox isolation (must happen before requiring the engine modules) ---
const SANDBOX = fs.mkdtempSync(path.join(os.tmpdir(), 'rt-engine-verify-'));
const ACT = path.join(SANDBOX, 'activation');
fs.cpSync(LIVE_ACTIVATION, ACT, { recursive: true });
process.env.SPECKIT_ACTIVATION_ROOT_OVERRIDE = ACT;

const { compiledRoute } = require(path.join(LIB, 'compiled-route.cjs'));
const { resolveRoute, servingAuthority } = require(path.join(LIB, 'resolve.cjs'));

const childEnv = { ...process.env, SPECKIT_ACTIVATION_ROOT_OVERRIDE: ACT };
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const readAuth = (p) => JSON.parse(fs.readFileSync(p, 'utf8')).servingAuthority;
const runFlip = (args) => {
  try { return cp.execFileSync('node', [FLIP, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: childEnv }); }
  catch (e) { return `ERR:${e.stderr || e.message || ''}`; }
};

let pass = 0;
let fail = 0;
const check = (name, ok, detail = '') => {
  if (ok) pass += 1; else fail += 1;
  process.stdout.write(`${(ok ? 'PASS' : 'FAIL').padEnd(5)} ${name}${detail ? ` ${detail}` : ''}\n`);
};

function main() {
  const hubs = fs.readdirSync(ACT).filter((h) => fs.existsSync(path.join(ACT, h, 'manifest.json')));
  if (hubs.length === 0) throw new Error('no activated hubs in the sandbox');

  // 1. Discriminated union: route-only fields present iff action === 'route', AND
  //    the fixture exercises BOTH a route and a negative decision.
  {
    const child = path.join(IMPL, '006-parent-hub-rollout', '001-sk-code');
    const { loadSnapshot } = require(path.join(child, 'harness', 'build-artifacts.cjs'));
    const prompts = (loadSnapshot().fixture.cases || [])
      .slice(0, 6)
      .map((c) => c.prompt || c.taskText || c.input || '')
      .filter(Boolean);
    prompts.push('zzzz unrelated gibberish nonsense qwerty'); // force a negative
    const actions = [];
    let shapeOk = true;
    for (const p of prompts) {
      const d = compiledRoute('sk-code', p);
      actions.push(d.action);
      const isRoute = d.action === 'route';
      const hasRoute = Object.prototype.hasOwnProperty.call(d, 'targets') && Object.prototype.hasOwnProperty.call(d, 'selectionKind');
      const hasNeither = !Object.prototype.hasOwnProperty.call(d, 'targets') && !Object.prototype.hasOwnProperty.call(d, 'selectionKind');
      if (isRoute ? !hasRoute : !hasNeither) shapeOk = false;
    }
    check('discriminated-union: route-only fields iff action=route', shapeOk);
    const hasRouteDecision = actions.includes('route');
    const hasNegativeDecision = actions.some((a) => a !== 'route');
    check('both-decision coverage: a route AND a negative are exercised', hasRouteDecision && hasNegativeDecision, `(${actions.join(',')})`);
  }

  // 2. Flag-off inertness.
  {
    delete process.env.SPECKIT_COMPILED_ROUTING;
    const r = resolveRoute('sk-code', 'run the quality gate before done');
    check('flag-off inertness: resolver returns legacy sentinel', r === null);
  }

  // 3. Serve-time identity binding — MATCH: every compiled-serving hub serves.
  {
    process.env.SPECKIT_COMPILED_ROUTING = '1';
    let served = 0;
    for (const h of hubs) {
      if (servingAuthority(h) === 'compiled' && resolveRoute(h, 'do the requested thing') !== null) served += 1;
    }
    check('serve-time identity (match): all compiled hubs serve', served === hubs.length, `(${served}/${hubs.length})`);
  }

  // 4. Serve-time identity binding — MISMATCH: a tampered manifest fails safe.
  {
    process.env.SPECKIT_COMPILED_ROUTING = '1';
    const hub = hubs.find((h) => h !== 'sk-code') || hubs[0];
    const M = path.join(ACT, hub, 'manifest.json');
    const good = fs.readFileSync(M);
    const tampered = JSON.parse(good.toString());
    tampered.selectedPolicy.effectivePolicyHash = 'deadbeef'.repeat(8);
    fs.writeFileSync(M, JSON.stringify(tampered));
    const r = resolveRoute(hub, 'do the requested thing');
    fs.writeFileSync(M, good); // restore the sandbox hub for any later read
    check('serve-time identity (mismatch): tampered manifest fails safe to legacy', r === null);
    delete process.env.SPECKIT_COMPILED_ROUTING;
  }

  // 5. Fenced CAS: reset -> reflip is byte-exact rollback + byte-identical reflip.
  {
    const hub = 'sk-code';
    const M = path.join(ACT, hub, 'manifest.json');
    const SP = path.join(ACT, hub, 'manifest.serving-prior.json');
    const origSha = sha(M);
    runFlip(['--hub', hub, '--rollback']);
    const rolledBackToLegacy = readAuth(M) === 'legacy';
    const byteExact = sha(M) === sha(SP);
    const reOut = runFlip(['--hub', hub]);
    const reCompiled = /serving=compiled/.test(reOut);
    const identical = sha(M) === origSha;
    check('fenced CAS: byte-exact rollback + byte-identical reflip', rolledBackToLegacy && byteExact && reCompiled && identical);
  }

  // 6. Shared lock (mkdir dir) — a LIVE holder is refused.
  {
    const hub = hubs[0];
    const lockDir = path.join(ACT, hub, '.flip.lock');
    fs.mkdirSync(lockDir);
    const liveHolder = { pid: process.pid, nonce: 'liveholder', phase: 'test', acquiredAt: Date.now(), leaseUntil: Date.now() + 3600_000 };
    fs.writeFileSync(path.join(lockDir, 'owner.json'), `${JSON.stringify(liveHolder)}\n`);
    const blocked = runFlip(['--hub', hub]);
    const ownerP = path.join(lockDir, 'owner.json');
    const stillHeld = fs.existsSync(ownerP) && JSON.parse(fs.readFileSync(ownerP, 'utf8')).nonce === 'liveholder';
    try { fs.rmSync(lockDir, { recursive: true, force: true }); } catch { /* cleanup */ }
    check('shared lock: a live holder is refused (and left intact)', /held by a live owner/.test(blocked) && stillHeld);
  }

  // 7. Shared lock (mkdir dir) — a STALE holder is reclaimed (crash recovery).
  {
    const hub = 'sk-code';
    const lockDir = path.join(ACT, hub, '.flip.lock');
    fs.mkdirSync(lockDir);
    const staleHolder = { pid: 2147483646, nonce: 'staleholder', phase: 'crashed', acquiredAt: Date.now() - 7200_000, leaseUntil: Date.now() - 3600_000 };
    fs.writeFileSync(path.join(lockDir, 'owner.json'), `${JSON.stringify(staleHolder)}\n`);
    // sk-code is compiled -> the idempotent path runs under the lock; a stale lock
    // must be reclaimed so the run succeeds rather than dead-locking.
    const out = runFlip(['--hub', hub]);
    const reclaimed = /ALREADY-COMPILED/.test(out) && !out.startsWith('ERR');
    const lockReleased = !fs.existsSync(lockDir);
    check('shared lock: a stale holder is reclaimed, not dead-locked', reclaimed && lockReleased, reclaimed ? '' : `(got: ${out.slice(0, 80)})`);
  }

  // 8. Flip-time identity: a tampered selectedPolicy hash is refused.
  {
    const hub = 'sk-code';
    const M = path.join(ACT, hub, 'manifest.json');
    runFlip(['--hub', hub, '--rollback']); // -> legacy
    const legacyBytes = fs.readFileSync(M);
    const tampered = JSON.parse(legacyBytes.toString());
    tampered.selectedPolicy.effectivePolicyHash = 'deadbeef'.repeat(8);
    fs.writeFileSync(M, JSON.stringify(tampered));
    const refused = runFlip(['--hub', hub]);
    const stayedLegacy = readAuth(M) !== 'compiled';
    fs.writeFileSync(M, legacyBytes);
    runFlip(['--hub', hub]);
    check('flip-time identity: tampered selectedPolicy hash refused', /!= selectedPolicy/.test(refused) && stayedLegacy);
  }

  // 9. Write-ahead journal: an interrupted flip is recovered to the INTENDED fence.
  {
    const hub = 'sk-code';
    const M = path.join(ACT, hub, 'manifest.json');
    const F = path.join(ACT, hub, 'fence-state.json');
    const J = path.join(ACT, hub, '.flip-journal.json');
    runFlip(['--hub', hub, '--rollback']); // -> legacy, a clean pre-flip state
    const legacyManifest = JSON.parse(fs.readFileSync(M, 'utf8'));
    const curFence = JSON.parse(fs.readFileSync(F, 'utf8')).fencingEpoch;
    const targetFence = curFence + 1;
    // Plant a journal as if a flip crashed after writing it but before the tuple.
    fs.writeFileSync(J, `${JSON.stringify({ intent: 'flip', hubId: hub, selectedPolicy: legacyManifest.selectedPolicy, before: curFence, after: targetFence })}\n`);
    runFlip(['--hub', hub]); // recovery runs first, completes the flip to targetFence
    const m2 = JSON.parse(fs.readFileSync(M, 'utf8'));
    const f2 = JSON.parse(fs.readFileSync(F, 'utf8')).fencingEpoch;
    const journalGone = !fs.existsSync(J);
    check('write-ahead journal: interrupted flip recovered to the intended advanced fence',
      m2.servingAuthority === 'compiled' && f2 === targetFence && journalGone,
      `(serving=${m2.servingAuthority} fence=${f2} want ${targetFence} journalGone=${journalGone})`);
  }

  process.stdout.write(`\n${pass}/${pass + fail} checks passed\n`);
  if (fail > 0) throw new Error(`${fail} regression check(s) failed`);
}

try {
  main();
} catch (e) {
  process.stderr.write(`VERIFY FAILED: ${e.message}\n`);
  process.exitCode = 1;
} finally {
  // The live activation tree was never touched; drop the sandbox.
  try { fs.rmSync(SANDBOX, { recursive: true, force: true }); } catch { /* best effort */ }
}
