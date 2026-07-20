#!/usr/bin/env node
'use strict';

// Phase-local regression suite for the compiled-routing runtime engine.
//
// Exercises the security-sensitive shared-runtime branches directly:
//   1. the closed decision algebra — route-only fields appear only on a route
//      decision (a negative decision bearing a target is unrepresentable),
//   2. flag-off inertness — the resolver returns the legacy sentinel unless the
//      runtime flag is set,
//   3. serve-time identity binding — a compiled-serving hub only serves when its
//      loaded snapshot identity matches the manifest's selectedPolicy,
//   4. the fenced serving CAS — an exclusive lock, an epoch re-check, and an
//      atomic replace, with a byte-exact rollback,
//   5. flip-time identity binding — a snapshot whose hash diverges from the
//      selected policy is refused rather than served.
//
// Non-destructive: the activation state is snapshotted to a temp dir up front and
// restored in a finally, so the suite is safe to run repeatedly and leaves no
// committed-state drift even if an assertion throws mid-run.

const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const crypto = require('crypto');

const HARNESS = __dirname;
const LIB = path.resolve(HARNESS, '..', 'lib');
const IMPL = path.resolve(HARNESS, '..', '..'); // the implementation root
const ACT = path.join(IMPL, '010-live-activation', 'activation');
const FLIP = path.join(LIB, 'flip-serving.cjs');
const { compiledRoute } = require(path.join(LIB, 'compiled-route.cjs'));
const { resolveRoute, servingAuthority } = require(path.join(LIB, 'resolve.cjs'));

const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const readAuth = (p) => JSON.parse(fs.readFileSync(p, 'utf8')).servingAuthority;
const runFlip = (args) => {
  try { return cp.execFileSync('node', [FLIP, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { return `ERR:${e.stderr || e.message || ''}`; }
};

let pass = 0;
let fail = 0;
const check = (name, ok, detail = '') => {
  if (ok) pass += 1; else fail += 1;
  process.stdout.write(`${(ok ? 'PASS' : 'FAIL').padEnd(5)} ${name}${detail ? ` ${detail}` : ''}\n`);
};

function snapshotActivation() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rt-engine-verify-'));
  fs.cpSync(ACT, path.join(tmp, 'activation'), { recursive: true });
  return tmp;
}
function restoreActivation(tmp) {
  fs.rmSync(ACT, { recursive: true, force: true });
  fs.cpSync(path.join(tmp, 'activation'), ACT, { recursive: true });
  fs.rmSync(tmp, { recursive: true, force: true });
}

function main() {
  const hubs = fs.readdirSync(ACT).filter((h) => fs.existsSync(path.join(ACT, h, 'manifest.json')));
  if (hubs.length === 0) throw new Error('no activated hubs found');

  // --- read-only checks first (they observe the pristine snapshot state) ---

  // 1. Discriminated union: route-only fields present iff action === 'route'.
  {
    const child = path.join(IMPL, '006-parent-hub-rollout', '001-sk-code');
    const { loadSnapshot } = require(path.join(child, 'harness', 'build-artifacts.cjs'));
    const prompts = (loadSnapshot().fixture.cases || [])
      .slice(0, 6)
      .map((c) => c.prompt || c.taskText || c.input || '')
      .filter(Boolean);
    prompts.push('zzzz unrelated gibberish nonsense qwerty'); // force a negative
    let ok = true;
    for (const p of prompts) {
      const d = compiledRoute('sk-code', p);
      const isRoute = d.action === 'route';
      const hasRouteFields = Object.prototype.hasOwnProperty.call(d, 'targets')
        && Object.prototype.hasOwnProperty.call(d, 'selectionKind');
      const hasNeither = !Object.prototype.hasOwnProperty.call(d, 'targets')
        && !Object.prototype.hasOwnProperty.call(d, 'selectionKind');
      if (isRoute ? !hasRouteFields : !hasNeither) ok = false;
    }
    check('discriminated-union: route-only fields iff action=route', ok);
  }

  // 2. Flag-off inertness.
  {
    delete process.env.SPECKIT_COMPILED_ROUTING;
    const r = resolveRoute('sk-code', 'run the quality gate before done');
    check('flag-off inertness: resolver returns legacy sentinel', r === null);
  }

  // 3. Serve-time identity binding: every compiled-serving hub serves (identity matched).
  {
    process.env.SPECKIT_COMPILED_ROUTING = '1';
    let served = 0;
    for (const h of hubs) {
      // A non-null decision (route OR a negative decision) proves the served
      // snapshot identity matched the manifest's selectedPolicy.
      if (servingAuthority(h) === 'compiled' && resolveRoute(h, 'do the requested thing') !== null) served += 1;
    }
    delete process.env.SPECKIT_COMPILED_ROUTING;
    check('serve-time identity: all compiled hubs serve', served === hubs.length, `(${served}/${hubs.length})`);
  }

  // --- mutating checks (restored by the outer finally) ---

  // 4. Fenced CAS: reset -> reflip is byte-exact rollback + byte-identical reflip.
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
    check('fenced CAS: byte-exact rollback + byte-identical reflip',
      rolledBackToLegacy && byteExact && reCompiled && identical);
  }

  // 5. Fenced CAS: a pre-held lock refuses a concurrent flip.
  {
    const hub = hubs[0];
    const lock = path.join(ACT, hub, '.flip.lock');
    fs.writeFileSync(lock, 'held-by-test\n', { flag: 'wx' });
    const blocked = runFlip(['--hub', hub, '--rollback']);
    const noMutation = readAuth(path.join(ACT, hub, 'manifest.json')) === 'compiled';
    fs.unlinkSync(lock);
    check('fenced CAS: pre-held lock refuses concurrent flip', /already in progress/.test(blocked) && noMutation);
  }

  // 6. Flip-time identity: a tampered selectedPolicy hash is refused.
  {
    const hub = 'sk-code';
    const M = path.join(ACT, hub, 'manifest.json');
    runFlip(['--hub', hub, '--rollback']); // -> legacy, byte-exact serving-prior
    const legacyBytes = fs.readFileSync(M);
    const tampered = JSON.parse(legacyBytes.toString());
    tampered.selectedPolicy.effectivePolicyHash = 'deadbeef'.repeat(8);
    fs.writeFileSync(M, JSON.stringify(tampered));
    const refused = runFlip(['--hub', hub]);
    const stayedLegacy = readAuth(M) !== 'compiled';
    fs.writeFileSync(M, legacyBytes); // restore, then reflip clean
    runFlip(['--hub', hub]);
    check('flip-time identity: tampered selectedPolicy hash refused',
      /!= selectedPolicy/.test(refused) && stayedLegacy);
  }

  process.stdout.write(`\n${pass}/${pass + fail} checks passed\n`);
  if (fail > 0) throw new Error(`${fail} regression check(s) failed`);
}

const snap = snapshotActivation();
try {
  main();
} catch (e) {
  process.stderr.write(`VERIFY FAILED: ${e.message}\n`);
  process.exitCode = 1;
} finally {
  restoreActivation(snap);
}
