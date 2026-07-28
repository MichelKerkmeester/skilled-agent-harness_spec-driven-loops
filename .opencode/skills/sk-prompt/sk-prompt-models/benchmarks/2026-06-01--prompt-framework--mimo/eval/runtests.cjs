// Run an extracted function against a fixture's hidden test suite in ISOLATED
// child processes — ONE child per test case. Per-case isolation matters: model
// code may throw, loop, or define globals, and a hang in one case must not mask
// which other cases passed. Each child gets its own hard timeout, so an
// infinite loop on a single input zeroes only that case, not the whole suite.

const { spawnSync } = require('child_process');
const path = require('path');

// runner-child.cjs evaluates the function and runs ONE test, printing a JSON
// result. We pass { source, fnName, test } per invocation.
const CHILD = path.join(__dirname, 'runner-child.cjs');

function runOne(source, fnName, test, timeoutMs) {
  const payload = JSON.stringify({ source, fnName, test });
  const res = spawnSync('node', [CHILD, payload], {
    encoding: 'utf8',
    timeout: timeoutMs,
    maxBuffer: 2 * 1024 * 1024,
  });
  if (res.error && res.error.code === 'ETIMEDOUT') {
    return { name: test.name, ok: false, error: 'timeout' };
  }
  if (res.status !== 0 || !res.stdout) {
    return { name: test.name, ok: false, error: 'child exit ' + res.status + ' ' + (res.stderr || '').slice(0, 120) };
  }
  try {
    return JSON.parse(res.stdout.trim());
  } catch (e) {
    return { name: test.name, ok: false, error: 'unparseable: ' + res.stdout.slice(0, 120) };
  }
}

// Returns { total, passed, pass_rate, per_test:[{name,ok,...}], define_error? }.
// `timeoutMs` is per-case.
function runSuite(source, fnName, tests, timeoutMs = 3000) {
  // Quick define-time probe: if the function will not even define, every case
  // fails for the same reason — surface it once instead of per case.
  const probe = runOne(source, fnName, { name: '__probe__', args: [], expect: undefined, probe_only: true }, timeoutMs);
  if (probe.define_error) {
    return {
      total: tests.length,
      passed: 0,
      pass_rate: 0,
      per_test: tests.map((t) => ({ name: t.name, ok: false, error: 'define: ' + probe.define_error })),
      define_error: probe.define_error,
    };
  }

  const per_test = [];
  let passed = 0;
  for (const t of tests) {
    const r = runOne(source, fnName, t, timeoutMs);
    const ok = !!r.ok;
    if (ok) passed++;
    per_test.push(r);
  }
  return {
    total: tests.length,
    passed,
    pass_rate: tests.length ? passed / tests.length : 0,
    per_test,
  };
}

module.exports = { runSuite };
