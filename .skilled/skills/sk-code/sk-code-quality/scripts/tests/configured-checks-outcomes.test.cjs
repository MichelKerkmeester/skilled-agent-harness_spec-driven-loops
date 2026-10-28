// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Configured Check Outcome Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case commits a repository config that names one or more commands, seeds a change and
// runs the runner the way a user would. The commands are node one-liners started through this
// process's own node, so a case needs no tool beyond the one running it, and each one proves
// what it saw through its exit code alone.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { assertSnapshotUnchanged, trustRepoChecks } = require('./fixtures.cjs');
const { CHANGED_GO, CLEAN_GO, NODE, check, config, withRepo } = require('./quality-suite-helpers.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('F06 required tool absent: the check is SKIPPED_ABSENT with a repair line and the run is UNVERIFIED', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{ id: 'absent-tool', argv: ['sk-code-absent-tool', '{files}'], severity: 'P0' }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  const row = check(verdict, 'absent-tool');
  assert.deepEqual([row.origin, row.state, row.required, row.requires], ['configured', 'SKIPPED_ABSENT', true, 'sk-code-absent-tool']);
  assert.equal(row.repair, "install 'sk-code-absent-tool' or remove the check from .skilled/skills/sk-code/sk-code-quality/repository/quality.json");
  assert.deepEqual(verdict.summary.unverified, ['absent-tool']);
}));

test('F07 check fails: a required P0 check that exits 1 is RAN_FAIL and blocks, and a failing P1 check does not', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [
      { id: 'soft-fail', argv: [NODE, '-e', 'process.exit(1)'], severity: 'P1' },
      { id: 'hard-fail', argv: [NODE, '-e', 'process.exit(1)'], severity: 'P0' },
    ] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  trustRepoChecks(repo);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.deepEqual([check(verdict, 'hard-fail').state, check(verdict, 'hard-fail').exit], ['RAN_FAIL', 1]);
  assert.deepEqual([check(verdict, 'soft-fail').state, check(verdict, 'soft-fail').required], ['RAN_FAIL', false]);

  repo.write({ '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{ id: 'soft-fail', argv: [NODE, '-e', 'process.exit(1)'], severity: 'P1' }] }) });
  assert.equal(repo.run(['--config', '.skilled/skills/sk-code/sk-code-quality/repository/quality.json']).status, 0);
}));

test('F08 check mutates: a check that rewrites a tracked file ends the run with CHECK_MUTATED_WORKSPACE and keeps the change', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [
      { id: 'rewriter', argv: [NODE, '-e', 'require("fs").appendFileSync("app.go", "func C() {}\\n")'], severity: 'P1' },
      { id: 'after', argv: [NODE, '-e', 'process.exit(0)'], severity: 'P1' },
    ] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  trustRepoChecks(repo);
  const { status, verdict } = repo.run([]);
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  const mutation = verdict.errors.find((entry) => entry.code === 'CHECK_MUTATED_WORKSPACE');
  assert.deepEqual([mutation.check, mutation.paths], ['rewriter', ['app.go']]);
  assert.equal(fs.readFileSync(path.join(repo.root, 'app.go'), 'utf8'), `${CHANGED_GO}func C() {}\n`);
  assert.equal(check(verdict, 'after').state, 'ERROR');
  assert.match(check(verdict, 'after').repair, /not run, because the workspace changed while rewriter ran/);
}));

test('F09 discovered only: a package.json lint script is suggested with its config entry and never runs', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    'package.json': `${JSON.stringify({ name: 'fixture', scripts: {
      lint: 'node -e "require(\'fs\').writeFileSync(\'canary\', \'ran\')"',
      'format:check': 'prettier --write .',
      fix: 'eslint --fix .',
    } }, null, 2)}\n`,
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual(verdict.suggested_checks, [{
    id: 'lint',
    source: 'package.json',
    reason: 'package.json defines a lint script',
    entry: { id: 'lint', argv: ['npm', 'run', 'lint'], languages: ['javascript', 'typescript'], requires: 'npm', severity: 'P1', required: false },
  }]);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));
