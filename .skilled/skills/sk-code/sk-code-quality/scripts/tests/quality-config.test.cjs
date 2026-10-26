// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Repository Config Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case seeds a throwaway repository with one config source, runs the runner the
// way a user would and checks which source it chose, what it refused and what reached
// the checker. Every label the checker must catch is joined at run time, so this file
// never carries one in its own text. No case changes this process's environment.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { assertSnapshotUnchanged, buildRepo } = require('./fixtures.cjs');
const { USAGE_TEXT } = require('../quality-gate.cjs');
const { TEMPLATE_PATH, mergeConfig, validateConfig } = require('../lib/quality-config.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const QUALITY_ROOT = path.resolve(__dirname, '..', '..');
const RUNNER = path.join(QUALITY_ROOT, 'scripts', 'quality-gate.cjs');
const DEFAULTS = JSON.parse(fs.readFileSync(path.join(QUALITY_ROOT, 'assets', 'quality-defaults.json'), 'utf8'));
const ADR_LABEL = ['ADR', '12'].join('-');
const TICKET_LABEL = ['ACME', '12'].join('-');
const WIDGET_LABEL = ['widget', '42'].join('-');
const CLEAN_GO = 'package a\n\nfunc A() {}\n';
const MINIMAL = '{"schemaVersion": 1}\n';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function withRepo(options, body) {
  const repo = buildRepo(options);
  try {
    return body(repo);
  } finally {
    repo.cleanup();
  }
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function fields(verdict) {
  return verdict.config.errors.map((entry) => entry.field);
}

function hygieneFindings(verdict) {
  return verdict.findings.filter((entry) => entry.check === 'comment-hygiene');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────

test('discovery: --config wins over the other sources and is read relative to the working directory', () => withRepo({
  base: { 'sub/app.go': CLEAN_GO, '.sk-code/quality.json': MINIMAL, 'conf/q.json': MINIMAL, 'sub/cli.json': MINIMAL },
  change: { 'sub/app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  repo.git(['config', 'skcode.qualityConfig', 'conf/q.json']);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--config', 'cli.json'], { cwd: path.join(repo.root, 'sub') }));
  assert.equal(status, 0);
  assert.deepEqual([verdict.config.source, verdict.config.path], ['cli', 'sub/cli.json']);
}));

test('discovery: a file-scoped git config value beats the repository file and is read relative to the root', () => withRepo({
  base: { 'sub/app.go': CLEAN_GO, '.sk-code/quality.json': MINIMAL, 'conf/q.json': MINIMAL },
  change: { 'sub/app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  repo.git(['config', 'skcode.qualityConfig', 'conf/q.json']);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([], { cwd: path.join(repo.root, 'sub') }));
  assert.equal(status, 0);
  assert.deepEqual([verdict.config.source, verdict.config.path], ['git-config', 'conf/q.json']);
}));

test('discovery: .sk-code/quality.json at the root is the repository source, with its size', () => withRepo({
  base: { 'app.go': CLEAN_GO, '.sk-code/quality.json': MINIMAL },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual([verdict.config.source, verdict.config.path, verdict.config.bytes], ['repo', '.sk-code/quality.json', MINIMAL.length]);
}));

test('discovery: with no source the run uses the base layer alone and fills suggested_checks', () => withRepo({
  base: { 'app.go': CLEAN_GO, 'package.json': json({ name: 'fixture', scripts: { lint: 'eslint .', test: 'node --test' } }) },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual([verdict.config.source, verdict.config.path], ['none', null]);
  assert.deepEqual(verdict.suggested_checks.map((item) => item.id), ['lint']);
  assert.deepEqual(verdict.suggested_checks[0].entry.argv, ['npm', 'run', 'lint']);
}));

test('CONFIG_PATH_MISSING: a missing path named with --config exits 3, names the path and never falls back', () => withRepo({
  base: { 'app.go': CLEAN_GO, '.sk-code/quality.json': MINIMAL },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const missing = path.join(repo.root, 'missing.json');
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--config', 'missing.json']));
  assert.equal(status, 3);
  assert.equal(verdict.errors[0].code, 'CONFIG_PATH_MISSING');
  assert.ok(verdict.errors[0].message.includes(missing));
  assert.deepEqual([verdict.config.source, verdict.config.path], ['cli', missing]);
  assert.deepEqual(verdict.checks, []);
}));

test('F11 config scope: a file-scoped value to a missing path is CONFIG_PATH_MISSING, and a git -c value is ignored', () => withRepo({
  base: { 'app.go': CLEAN_GO },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  repo.git(['config', 'skcode.qualityConfig', 'missing.json']);
  const stored = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(stored.status, 3);
  assert.equal(stored.verdict.errors[0].code, 'CONFIG_PATH_MISSING');
  assert.equal(stored.verdict.config.source, 'git-config');
  repo.git(['config', '--unset', 'skcode.qualityConfig']);

  // A git -c flag reaches a child git as GIT_CONFIG_PARAMETERS, and GIT_CONFIG_COUNT is
  // the other command-scope channel. Both report scope command.
  const flagged = assertSnapshotUnchanged(repo, () => repo.run([], { env: { GIT_CONFIG_PARAMETERS: "'skcode.qualityConfig'='missing.json'" } }));
  assert.equal(flagged.status, 0);
  assert.equal(flagged.verdict.config.source, 'none');
  const counted = assertSnapshotUnchanged(repo, () => repo.run([], {
    env: { GIT_CONFIG_COUNT: '2', GIT_CONFIG_KEY_1: 'skcode.qualityConfig', GIT_CONFIG_VALUE_1: 'missing.json' },
  }));
  assert.equal(counted.status, 0);
  assert.equal(counted.verdict.config.source, 'none');
}));

// ─────────────────────────────────────────────────────────────────────────────
// 5. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

test('CONFIG_INVALID: every bad field is listed in config.errors and no check starts', () => withRepo({
  base: { 'app.go': CLEAN_GO },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const canary = path.join(repo.parent, 'canary');
  repo.write({
    '.sk-code/quality.json': json({
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
  change: { 'app.go': `${CLEAN_GO}func B() {}\n`, '.sk-code/quality.json': '' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.errors[0].code, 'CONFIG_INVALID');
  assert.match(verdict.config.errors[0].message, /does not parse as JSON/);
  assert.equal(verdict.config.bytes, 0);
}));

test('CONFIG_INVALID: a symlinked .sk-code folder that leads out of the repository is refused, and one inside it is read', () => withRepo({
  base: { 'app.go': CLEAN_GO, 'config/sk/quality.json': MINIMAL },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const outside = path.join(repo.parent, 'elsewhere');
  fs.mkdirSync(outside);
  fs.writeFileSync(path.join(outside, 'quality.json'), MINIMAL);
  fs.symlinkSync(outside, path.join(repo.root, '.sk-code'));
  const refused = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(refused.status, 3);
  assert.equal(refused.verdict.errors[0].code, 'CONFIG_INVALID');
  assert.match(refused.verdict.config.errors[0].message, /outside the repository/);

  fs.unlinkSync(path.join(repo.root, '.sk-code'));
  fs.symlinkSync(path.join('config', 'sk'), path.join(repo.root, '.sk-code'));
  const inside = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(inside.status, 0);
  assert.equal(inside.verdict.config.source, 'repo');

  // An operator who names the outside file on purpose gets it, recorded as the cli source.
  const named = assertSnapshotUnchanged(repo, () => repo.run(['--config', path.join(outside, 'quality.json')]));
  assert.equal(named.status, 0);
  assert.equal(named.verdict.config.source, 'cli');
}));

test('merge: only the repository layer adds checks, lists append and a reused id is an error', () => {
  const repo = {
    schemaVersion: 1,
    exclude: ['vendor/**'],
    checks: [{ id: 'lint', argv: ['npm', 'run', 'lint'], severity: 'P1' }, { id: 'typecheck', argv: ['tsc'], severity: 'P0' }],
    checklists: [{ file: '.sk-code/checklists/web.md', paths: ['src/**'] }],
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

test('ticket: a prefix with a symbol is a config error, and a valid prefix reaches the checker', () => {
  const refused = validateConfig({ schemaVersion: 1, commentHygiene: { ticketPrefixes: ['JI-RA', 'OK1', '9AB'] } });
  assert.deepEqual(refused.map((entry) => entry.field), ['commentHygiene.ticketPrefixes[0]', 'commentHygiene.ticketPrefixes[2]']);
  withRepo({
    base: { 'app.go': CLEAN_GO, '.sk-code/quality.json': json({ schemaVersion: 1, commentHygiene: { ticketPrefixes: ['ACME'] } }) },
    change: { 'app.go': `${CLEAN_GO}// see ${TICKET_LABEL}\nfunc B() {}\n` },
  }, (repo) => {
    const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(status, 1);
    assert.deepEqual(hygieneFindings(verdict).map((entry) => [entry.rule, entry.line]), [['hygiene.ticket-prefix', 4]]);
    const hygiene = verdict.checks.find((entry) => entry.id === 'comment-hygiene');
    assert.deepEqual(hygiene.argv.slice(hygiene.argv.indexOf('--json') + 1, -2), ['--ticket-prefix', 'ACME']);
  });
});

test('extraPatterns: a pattern over 200 characters or one that does not compile is a config error, and a valid one reaches the checker', () => {
  const refused = validateConfig({ schemaVersion: 1, commentHygiene: { extraPatterns: ['a'.repeat(201), '(', 'b'.repeat(200)] } });
  assert.deepEqual(refused.map((entry) => entry.field), ['commentHygiene.extraPatterns[0]', 'commentHygiene.extraPatterns[1]']);
  withRepo({
    base: { 'app.go': CLEAN_GO, '.sk-code/quality.json': json({ schemaVersion: 1, commentHygiene: { extraPatterns: ['\\bwidget-[0-9]+\\b'] } }) },
    change: { 'app.go': `${CLEAN_GO}// see ${WIDGET_LABEL}\nfunc B() {}\n` },
  }, (repo) => {
    const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(status, 1);
    assert.deepEqual(hygieneFindings(verdict).map((entry) => entry.rule), ['hygiene.extra-pattern']);

    // A variable-width lookbehind is JavaScript's and not Python's, and the validator
    // cannot see that, so the run names the field the refused value came from.
    repo.write({ '.sk-code/quality.json': json({ schemaVersion: 1, commentHygiene: { extraPatterns: ['(?<=a+)b'] } }) });
    const refused = repo.run([]);
    assert.equal(refused.status, 3);
    assert.deepEqual(refused.verdict.config.errors.map((entry) => entry.field), ['commentHygiene.extraPatterns']);
    assert.match(refused.verdict.config.errors[0].message, /the checker refused the value: --extra-pattern is not a valid regular expression/);
  });
});

test('extraPatterns: a construct Python re rejects is a config error, and the lookbehind it accepts is not', () => {
  const refused = validateConfig({
    schemaVersion: 1,
    commentHygiene: { extraPatterns: ['\\p{L}', '(?<year>\\d+)', '\\k<year>'] },
  });
  assert.deepEqual(refused.map((entry) => entry.field), [
    'commentHygiene.extraPatterns[0]',
    'commentHygiene.extraPatterns[1]',
    'commentHygiene.extraPatterns[2]',
  ]);
  assert.match(refused[0].message, /property escape/);
  assert.match(refused[1].message, /named group/);
  assert.match(refused[2].message, /backreference/);
  assert.ok(refused.every((entry) => entry.message.includes('Python re')));
  // A lookbehind and a plain label pattern reach Python's re as they are.
  assert.deepEqual(validateConfig({ schemaVersion: 1, commentHygiene: { extraPatterns: ['(?<=x)y', '\\bwidget-[0-9]+\\b'] } }), []);
});

test('extraPatterns: a character class makes a construct literal, and \\p inside one is still a fault', () => {
  // Python reads the contents of a class literally, so a pattern whose only construct sits
  // inside one compiles there as it does here.
  assert.deepEqual(validateConfig({ schemaVersion: 1, commentHygiene: { extraPatterns: ['[(?<a]'] } }), []);
  const refused = validateConfig({
    schemaVersion: 1,
    commentHygiene: { extraPatterns: ['[\\]](?<y>x)', '(?<year>x)', '[\\p{L}]'] },
  });
  assert.deepEqual(refused.map((entry) => entry.field), [
    'commentHygiene.extraPatterns[0]',
    'commentHygiene.extraPatterns[1]',
    'commentHygiene.extraPatterns[2]',
  ]);
  // The class closes before the group, and the property escape is refused inside one.
  assert.match(refused[0].message, /named group/);
  assert.match(refused[1].message, /named group/);
  assert.match(refused[2].message, /property escape/);
});

test('extensions: a mapped extension gives a file a family the checker reads, and an unknown family is a config error', () => {
  const refused = validateConfig({ schemaVersion: 1, commentHygiene: { extensions: { '.zig': 'klingon', zig: 'c' } } });
  assert.deepEqual(refused.map((entry) => entry.field), ['commentHygiene.extensions..zig', 'commentHygiene.extensions.zig']);
  withRepo({
    base: { 'README.txt': 'fixture\n', '.sk-code/quality.json': json({ schemaVersion: 1, commentHygiene: { extensions: { '.zig': 'c' }, exclude: ['skip/**'] } }) },
    change: { 'a.zig': `const a = 1; // see ${ADR_LABEL}\n`, 'skip/b.zig': `const b = 1; // see ${ADR_LABEL}\n` },
  }, (repo) => {
    const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(status, 1);
    assert.deepEqual(hygieneFindings(verdict).map((entry) => entry.file), ['a.zig']);
    assert.deepEqual(verdict.coverage.unchecked, []);
  });
});

test('extensions: a repository adds an extension the shipped table lacks, and a remap is a config error', () => {
  const remapped = validateConfig({ schemaVersion: 1, commentHygiene: { extensions: { '.js': 'hash' } } });
  assert.deepEqual(remapped.map((entry) => entry.field), ['commentHygiene.extensions..js']);
  assert.match(remapped[0].message, /already owned by the shipped table/);
  assert.deepEqual(validateConfig({ schemaVersion: 1, commentHygiene: { extensions: { '.foo': 'hash' } } }), []);
  // A remap would read this file as a hash comment, so the run refuses the config before
  // any check starts and the label in the file stays reachable.
  withRepo({
    base: { 'a.js': `const a = 1; // see ${ADR_LABEL}\n` },
    change: { '.sk-code/quality.json': json({ schemaVersion: 1, commentHygiene: { extensions: { '.js': 'hash' } } }) },
  }, (repo) => {
    const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(status, 3);
    assert.deepEqual(fields(verdict), ['commentHygiene.extensions..js']);
  });
});

test('template: the shipped template parses and passes the schema', () => {
  const template = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
  assert.equal(template.schemaVersion, 1);
  assert.deepEqual(validateConfig(template), []);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. HELP
// ─────────────────────────────────────────────────────────────────────────────

test('help: --help and -h print the usage and exit 0, even beside a broken config', () => withRepo({
  base: { 'app.go': CLEAN_GO },
  change: { '.sk-code/quality.json': '{"bogus": true}\n' },
}, (repo) => {
  for (const flag of ['--help', '-h']) {
    const { status, stdout, stderr } = assertSnapshotUnchanged(repo, () => repo.run(['--worktree', flag]));
    assert.equal(status, 0, flag);
    assert.equal(stderr, '', flag);
    assert.equal(stdout, `${USAGE_TEXT}\n`, flag);
  }
  assert.match(USAGE_TEXT, /^Usage: /);
  // Every flag the parser accepts is in the usage, so the text cannot fall behind it.
  const source = fs.readFileSync(RUNNER, 'utf8');
  const parsed = [...source.matchAll(/arg === '(--[a-z-]+)'/g)].map((match) => match[1]).filter((flag) => flag !== '--');
  assert.ok(parsed.length >= 11);
  for (const flag of parsed) assert.ok(USAGE_TEXT.includes(flag), flag);
  for (const word of ['skcode.qualityConfig', '.sk-code/quality.json', 'NO_BLOCKER_FOUND', 'BLOCKED', 'NOTHING_CHECKED', 'ERROR', 'UNVERIFIED']) {
    assert.ok(USAGE_TEXT.includes(word), word);
  }
  // After the separator, -h is a file name like any other, so the run goes on and meets
  // the broken config.
  const named = repo.run(['--', '-h']);
  assert.equal(named.status, 3);
  assert.equal(named.verdict.errors[0].code, 'CONFIG_INVALID');
}));
