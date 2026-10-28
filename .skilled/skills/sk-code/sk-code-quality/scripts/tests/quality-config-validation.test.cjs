// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Repository Config Validation Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The schema refuses a config before any check starts, and the merge rule decides what the
// repository layer may add to the shipped defaults. Each case seeds one config, runs the
// runner the way a user would and reads the fields the run names.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { assertSnapshotUnchanged } = require('./fixtures.cjs');
const { CLEAN_GO, DEFAULTS, REPO_IDENTITY, TARGET, fields, json, withRepo } = require('./quality-suite-helpers.cjs');
const { mergeConfig, validateConfig } = require('../lib/quality-config.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const MINIMAL = '{"schemaVersion": 1}\n';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONFIG VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

test('CONFIG_INVALID: a repository field that names no owner and name is a config error, and a valid one is not', () => withRepo({
  base: { 'app.go': CLEAN_GO },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n`, [TARGET]: json({ schemaVersion: 1, repository: 'widget' }) },
}, (repo) => {
  assert.deepEqual(validateConfig({ schemaVersion: 1, repository: 'widget' }).map((entry) => entry.field), ['repository']);
  assert.deepEqual(validateConfig({ schemaVersion: 1, repository: REPO_IDENTITY }), []);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.deepEqual(fields(verdict), ['repository']);
  assert.deepEqual(verdict.checks, []);
}));

test('CONFIG_INVALID: every bad field is listed in config.errors and no check starts', () => withRepo({
  base: { 'app.go': CLEAN_GO },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const canary = path.join(repo.parent, 'canary');
  repo.write({
    [TARGET]: json({
      schemaVersion: 2,
      bogus: true,
      checks: [
        { id: 'canary', argv: ['node', '-e', `require("fs").writeFileSync(${JSON.stringify(canary)}, "ran")`], severity: 'P0' },
        { id: 'Bad Id', argv: 'npm run lint', severity: 'P4', timeoutSec: 0 },
      ],
    }),
  });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.equal(verdict.errors[0].code, 'CONFIG_INVALID');
  assert.deepEqual(fields(verdict).sort(),
    ['bogus', 'checks[1].argv', 'checks[1].id', 'checks[1].severity', 'checks[1].timeoutSec', 'schemaVersion']);
  assert.ok(verdict.config.errors.every((entry) => entry.code === 'CONFIG_INVALID' && entry.repair));
  assert.deepEqual(verdict.checks, []);
  assert.ok(!fs.existsSync(canary));
}));

test('CONFIG_INVALID: an empty config file is a parse error', () => withRepo({
  base: { 'app.go': CLEAN_GO },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n`, [TARGET]: '' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.errors[0].code, 'CONFIG_INVALID');
  assert.match(verdict.config.errors[0].message, /does not parse as JSON/);
  assert.equal(verdict.config.bytes, 0);
}));

test('CONFIG_INVALID: a symlinked config folder that leads out of the repository is refused, and one inside it is read', () => withRepo({
  base: { 'app.go': CLEAN_GO, 'config/sk/quality.json': MINIMAL },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const link = path.join(repo.root, path.dirname(TARGET));
  fs.mkdirSync(path.dirname(link), { recursive: true });
  const outside = path.join(repo.parent, 'elsewhere');
  fs.mkdirSync(outside);
  fs.writeFileSync(path.join(outside, 'quality.json'), MINIMAL);
  fs.symlinkSync(outside, link);
  const refused = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(refused.status, 3);
  assert.equal(refused.verdict.errors[0].code, 'CONFIG_INVALID');
  assert.match(refused.verdict.config.errors[0].message, /outside the repository/);

  fs.unlinkSync(link);
  fs.symlinkSync(path.join(repo.root, 'config', 'sk'), link);
  const inside = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(inside.status, 0);
  assert.equal(inside.verdict.config.source, 'repo');

  // An operator who names the outside file on purpose gets it, recorded as the cli source.
  const named = assertSnapshotUnchanged(repo, () => repo.run(['--config', path.join(outside, 'quality.json')]));
  assert.equal(named.status, 0);
  assert.equal(named.verdict.config.source, 'cli');
}));

// ─────────────────────────────────────────────────────────────────────────────
// 4. MERGE
// ─────────────────────────────────────────────────────────────────────────────

test('merge: only the repository layer adds checks, lists append and a reused id is an error', () => {
  const repo = {
    schemaVersion: 1,
    exclude: ['vendor/**'],
    checks: [{ id: 'lint', argv: ['npm', 'run', 'lint'], severity: 'P1' }, { id: 'typecheck', argv: ['tsc'], severity: 'P0' }],
    checklists: [{ file: '.skilled/skills/sk-code/sk-code-quality/repository/checklists/web.md', paths: ['src/**'] }],
    sensors: { secrets: { exclude: ['test/fixtures/**'] } },
  };
  assert.deepEqual(validateConfig(repo, { builtinIds: ['secrets'] }), []);
  const merged = mergeConfig(DEFAULTS, repo);
  assert.deepEqual(merged.checks.map((entry) => [entry.id, entry.required, entry.requires]),
    [['lint', false, 'npm'], ['typecheck', true, 'tsc']]);
  assert.deepEqual(merged.exclude, [...DEFAULTS.exclude, 'vendor/**']);
  assert.equal(merged.checklists.length, DEFAULTS.checklists.length + 1);
  assert.equal(merged.checklists.at(-1).layer, 'repo');
  assert.deepEqual(merged.sensors.secrets.exclude, [...(DEFAULTS.sensors.secrets.exclude || []), 'test/fixtures/**']);
  assert.deepEqual(mergeConfig(DEFAULTS, null).checks, []);

  const reused = validateConfig({ ...repo, checks: [...repo.checks, { id: 'lint', argv: ['eslint'], severity: 'P1' }] }, { builtinIds: [] });
  assert.deepEqual(reused.map((entry) => entry.field), ['checks[2].id']);
  const builtin = validateConfig({ schemaVersion: 1, checks: [{ id: 'secrets', argv: ['x'], severity: 'P1' }] }, { builtinIds: ['secrets'] });
  assert.match(builtin[0].message, /built-in check id/);
});

test('merge: an exact sensor cannot be switched off, and a heuristic one can', () => {
  const exact = validateConfig({ schemaVersion: 1, sensors: { secrets: { enabled: false } } });
  assert.deepEqual(exact.map((entry) => entry.field), ['sensors.secrets.enabled']);
  const unknown = validateConfig({ schemaVersion: 1, sensors: { conflictMarkers: { severity: 'P2' }, lint: {} } });
  assert.deepEqual(unknown.map((entry) => entry.field).sort(), ['sensors.conflictMarkers.severity', 'sensors.lint']);
  const heuristic = { schemaVersion: 1, sensors: { debugLeftovers: { enabled: false } } };
  assert.deepEqual(validateConfig(heuristic), []);
  const merged = mergeConfig(DEFAULTS, heuristic);
  assert.equal(merged.sensors.debugLeftovers.enabled, false);
  assert.equal(merged.sensors.secrets.enabled, undefined);
});
