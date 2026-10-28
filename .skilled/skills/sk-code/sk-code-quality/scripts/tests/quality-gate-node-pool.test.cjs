// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Tests — Parallel Node Check
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case hands the runner a change large enough to reach the pool, so the group covers
// the record-to-finding mapping, the shapes a helper result may take, and the deadlines a
// child is given.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const { withRepo, check } = require('./quality-gate-helpers.cjs');
const { assertSnapshotUnchanged } = require('./fixtures.cjs');
const { nodeCheckRecords, nodeCheckResult } = require('../quality-gate.cjs');
const { spawnArgv } = require('../lib/run-check.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CASES
// ─────────────────────────────────────────────────────────────────────────────

// Twelve files put the list past the pool bound on any machine, so the two faults are
// found by different children and have to come back at their own input index. Each
// expected reason is read from the same `node --check` the sequential loop started, so
// this case pins the record-to-finding mapping rather than a node version's wording.
const POOL_CHANGE = Object.freeze({
  'src/bad-end.js': 'function oops(\n',
  'src/bad-token.js': 'const a = ;\n',
  ...Object.fromEntries(Array.from({ length: 10 }, (_, index) => [`src/clean-${index + 1}.js`, `module.exports = ${index + 1};\n`])),
});

test('unit: node pool: twelve changed files keep both syntax errors and the reasons a sequential check produced', () => withRepo({
  change: POOL_CHANGE,
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  const expected = ['src/bad-end.js', 'src/bad-token.js'].map((rel) => {
    const direct = spawnArgv([process.execPath, '--check', path.join(repo.root, rel)], { cwd: repo.root });
    assert.equal(direct.state, 'RAN_FAIL', `${rel} did not fail node --check`);
    const where = /:(\d+)\s*$/.exec(direct.stderr.split('\n')[0]);
    return [rel, Number(where[1]), `node --check: ${/^(?:SyntaxError|Error): (.*)$/m.exec(direct.stderr)[1]}`];
  });
  assert.deepEqual(verdict.findings.map((entry) => [entry.file, entry.line, entry.reason]), expected);
  assert.deepEqual(verdict.findings.map((entry) => [entry.rule, entry.confidence, entry.blocking]),
    [['syntax.js', 'heuristic', false], ['syntax.js', 'heuristic', false]]);
  assert.deepEqual([check(verdict, 'syntax-node').state, check(verdict, 'syntax-node').files], ['RAN_FAIL', 12]);
}));

// A fault at the head of the list is claimed by the first child whatever the pool does, so
// this change puts its one fault in the middle of eleven files, where only a record that
// came back at its own index lands in the right place. The reference runs one `node
// --check` after another in the order the runner lists the files.
const MID_POOL_CHANGE = Object.freeze(Object.fromEntries(Array.from({ length: 11 }, (_, index) => {
  const name = `src/part-${String(index + 1).padStart(2, '0')}.js`;
  return [name, index === 5 ? 'const a = ;\n' : `module.exports = ${index + 1};\n`];
})));

test('unit: node pool: a syntax error in the middle of a long list matches a sequential check file by file', () => withRepo({
  change: MID_POOL_CHANGE,
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  const order = Object.keys(MID_POOL_CHANGE).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  assert.equal(order[5], 'src/part-06.js', 'the fault does not sort into the middle of the list');
  const expected = [];
  for (const rel of order) {
    const direct = spawnArgv([process.execPath, '--check', path.join(repo.root, rel)], { cwd: repo.root });
    if (direct.state !== 'RAN_FAIL') continue;
    const where = /:(\d+)\s*$/.exec(direct.stderr.split('\n')[0]);
    const message = /^(?:SyntaxError|Error): (.*)$/m.exec(direct.stderr);
    expected.push([rel, where ? Number(where[1]) : null, `node --check: ${message ? message[1] : direct.stderr.trim().split('\n').pop()}`,
      'syntax.js', 'heuristic']);
  }
  assert.deepEqual(expected.map((entry) => entry[0]), ['src/part-06.js'], 'the sequential reference found a different fault');
  const found = verdict.findings.filter((entry) => entry.check === 'syntax-node');
  assert.deepEqual(found.map((entry) => [entry.file, entry.line, entry.reason, entry.rule, entry.confidence]), expected);
  assert.deepEqual([check(verdict, 'syntax-node').state, check(verdict, 'syntax-node').files], ['RAN_FAIL', 11]);
}));

// A child killed by a signal leaves no exit status and no message, so its record has to read
// as a check that never returned, never as a clean file or a syntax error with no text. A
// helper that died part way prints a short list, which the parent must refuse whole.
test('unit: node pool: a killed child reads ERROR and a short record list is refused', () => {
  assert.deepEqual(nodeCheckResult({ file: 'a.js', status: null, stderr: '', timedOut: false, error: 'killed by SIGKILL' }),
    { state: 'ERROR', stderr: '' });
  assert.deepEqual(nodeCheckResult({ file: 'a.js', status: null, stderr: '', timedOut: true, error: null }),
    { state: 'TIMEOUT', stderr: '' });
  assert.equal(nodeCheckResult({ file: 'a.js', status: 1, stderr: 'x', timedOut: false, error: null }).state, 'RAN_FAIL');
  assert.equal(nodeCheckResult({ file: 'a.js', status: 0, stderr: '', timedOut: false, error: null }).state, 'RAN_CLEAN');

  const one = { file: 'a.js', status: 0, stderr: '', timedOut: false, error: null };
  assert.deepEqual(nodeCheckRecords(JSON.stringify([one, { ...one, file: 'b.js' }]), 2).map((record) => record.file), ['a.js', 'b.js']);
  assert.equal(nodeCheckRecords(JSON.stringify([one]), 2), null);
  assert.equal(nodeCheckRecords('[{"file":"a.js","status":0,"stderr":""', 1), null);
  assert.equal(nodeCheckRecords(JSON.stringify([{ file: 'a.js', status: 0 }]), 1), null);
});

// No file the check reads means no helper to start, so the row keeps the state it was
// built with and no time was spent on it.
test('unit: node pool: a change with no .js or .mjs file never starts the helper and reads NOT_APPLICABLE', () => withRepo({
  change: { 'data.json': '{"a": 1}\n', 'lib/run.cjs': 'module.exports = 1;\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  const row = check(verdict, 'syntax-node');
  assert.deepEqual([row.state, row.files, row.duration_ms], ['NOT_APPLICABLE', 0, 0]);
  assert.deepEqual(verdict.findings.filter((entry) => entry.check === 'syntax-node'), []);
}));

// The pool hands each child the check's own deadline, so a deadline this short stops every
// child before node can start. The result has to read the way the sequential loop reported a
// check that never returned: TIMEOUT, no finding, and a required check left without evidence.
test('unit: node pool: a deadline no child can meet reports TIMEOUT and leaves the run UNVERIFIED', () => withRepo({
  change: Object.fromEntries(Array.from({ length: 4 }, (_, index) => [`src/any-${index + 1}.js`, `module.exports = ${index + 1};\n`])),
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--timeout', '0.0004']));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  assert.equal(check(verdict, 'syntax-node').state, 'TIMEOUT');
  assert.deepEqual(verdict.findings.filter((entry) => entry.check === 'syntax-node'), []);
  assert.ok(verdict.summary.unverified.includes('syntax-node'));
}));
