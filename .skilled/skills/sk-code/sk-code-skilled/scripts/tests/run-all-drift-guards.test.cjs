// ───────────────────────────────────────────────────────────────────
// MODULE: Drift guard orchestrator tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Runs run-all-drift-guards.sh against stub guards in a throwaway tree, so the pass, warn and
// fail aggregation can be driven without the live guards. The orchestrator resolves every guard
// from its own location, so a copy placed at the same depth runs the stubs instead.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/run-all-drift-guards.test.cjs

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ORCHESTRATOR = path.resolve(__dirname, '..', 'run-all-drift-guards.sh');

// Each stub prints a [WARN] line when its key is in WARN_GUARDS and exits 1 when it is in
// FAIL_GUARDS, so one environment variable picks the outcome of each guard.
const PY_STUB = (key) => [
  'import os, sys',
  `key = ${JSON.stringify(key)}`,
  "if key in os.environ.get('WARN_GUARDS', '').split(','):",
  "    print('[WARN] stub warning')",
  "sys.exit(1 if key in os.environ.get('FAIL_GUARDS', '').split(',') else 0)",
  '',
].join('\n');

const JS_STUB = (key) => [
  `const key = ${JSON.stringify(key)};`,
  "if ((process.env.WARN_GUARDS || '').split(',').includes(key)) console.log('[WARN] stub warning');",
  "process.exit((process.env.FAIL_GUARDS || '').split(',').includes(key) ? 1 : 0);",
  '',
].join('\n');

function buildTree(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-guards-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const packet = path.join(root, '.skilled', 'skills', 'sk-code', 'sk-code-skilled');
  const scripts = path.join(packet, 'scripts');
  const assets = path.join(packet, 'assets', 'scripts');
  fs.mkdirSync(scripts, { recursive: true });
  fs.mkdirSync(assets, { recursive: true });
  fs.copyFileSync(ORCHESTRATOR, path.join(scripts, 'run-all-drift-guards.sh'));
  fs.writeFileSync(path.join(assets, 'verify_alignment_drift.py'), PY_STUB('alignment'));
  fs.writeFileSync(path.join(assets, 'verify_stack_folders.py'), PY_STUB('stack'));
  fs.writeFileSync(path.join(assets, 'verify-router-sync.cjs'), JS_STUB('router'));
  fs.writeFileSync(path.join(assets, 'verify-doc-claims.cjs'), JS_STUB('doc'));
  return path.join(scripts, 'run-all-drift-guards.sh');
}

function run(script, env = {}) {
  const result = spawnSync('bash', [script], {
    encoding: 'utf8',
    env: { ...process.env, WARN_GUARDS: '', FAIL_GUARDS: '', ...env },
  });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

test('every guard passing exits 0 with a PASS line per guard', (t) => {
  const { status, out } = run(buildTree(t));
  assert.equal(status, 0, out);
  for (const name of ['alignment-drift', 'stack-folders', 'router-sync', 'doc-claims']) {
    assert.match(out, new RegExp(`^PASS: ${name}`, 'm'), out);
  }
  assert.match(out, /run-all-drift-guards: all 4 guards PASSED$/m);
  assert.doesNotMatch(out, /FAIL:/);
});

test('warnings never fail the gate but are counted in the summary', (t) => {
  const { status, out } = run(buildTree(t), { WARN_GUARDS: 'router,doc' });
  assert.equal(status, 0, out);
  assert.match(out, /^PASS: router-sync .*\(1 warnings\)$/m);
  assert.match(out, /^PASS: doc-claims .*\(1 warnings\)$/m);
  assert.match(out, /all 4 guards PASSED, 2 non-blocking warning\(s\)/);
});

test('one failing guard exits 1 and the guards after it still run', (t) => {
  const { status, out } = run(buildTree(t), { FAIL_GUARDS: 'stack' });
  assert.equal(status, 1, out);
  assert.match(out, /^FAIL: stack-folders/m);
  assert.match(out, /^PASS: router-sync/m);
  assert.match(out, /^PASS: doc-claims/m);
  assert.match(out, /run-all-drift-guards: 1 guard\(s\) FAILED/);
  assert.doesNotMatch(out, /guards PASSED/);
});

test('every failure is counted, the first and the last guard included', (t) => {
  const { status, out } = run(buildTree(t), { FAIL_GUARDS: 'alignment,doc' });
  assert.equal(status, 1, out);
  assert.match(out, /^FAIL: alignment-drift/m);
  assert.match(out, /^FAIL: doc-claims/m);
  assert.match(out, /run-all-drift-guards: 2 guard\(s\) FAILED/);
});
