#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Quality Config Doctor Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the config doctor as a process against throwaway git repositories, so each
// verdict is read through its exit code and STATUS line, the two things the /doctor
// route reads. The repositories come from the quality gate's own fixture builder, so
// both suites isolate git the same way.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const QUALITY_ROOT = path.resolve(__dirname, '../../../../skills/sk-code/sk-code-quality');
const { assertSnapshotUnchanged, buildRepo } = require(path.join(QUALITY_ROOT, 'scripts', 'tests', 'fixtures.cjs'));
const { validateConfig } = require(path.join(QUALITY_ROOT, 'scripts', 'lib', 'quality-config.cjs'));

const SCRIPT = path.resolve(__dirname, '..', 'sk-code-quality-config.cjs');
const TARGET = '.skilled/skills/sk-code/sk-code-quality/repository/quality.json';
const PACKAGE = `${JSON.stringify({ name: 'fixture', scripts: { lint: 'eslint .', test: 'node --test' } }, null, 2)}\n`;

function withRepo(options, body) {
  const repo = buildRepo({ hub: 'real', ...options });
  try {
    return body(repo);
  } finally {
    repo.cleanup();
  }
}

function doctor(repo, args, { cwd = repo.root, env = {} } = {}) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { cwd, env: { ...repo.env, ...env }, encoding: 'utf8' });
  const lines = result.stdout.trimEnd().split('\n');
  let payload = null;
  if (args.includes('--json')) {
    try {
      payload = JSON.parse(lines.slice(0, -1).join('\n'));
    } catch {
      payload = null;
    }
  }
  return { status: result.status, stdout: result.stdout, stderr: result.stderr, last: lines[lines.length - 1], payload };
}

function porcelain(repo) {
  return repo.git(['status', '--porcelain']);
}

function config(value) {
  return `${JSON.stringify({ schemaVersion: 1, ...value }, null, 2)}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. INIT
// ─────────────────────────────────────────────────────────────────────────────

test('init dry run: prints the plan, writes nothing and leaves git status empty', () => withRepo({
  base: { 'package.json': PACKAGE },
}, (repo) => {
  const result = assertSnapshotUnchanged(repo, () => doctor(repo, ['init', '--json']));
  assert.equal(result.status, 0);
  assert.equal(result.last, 'STATUS=OK MODE=DRY_RUN');
  assert.deepEqual(result.payload.checks.map((item) => [item.id, item.required]), [['lint', false]]);
  assert.equal(porcelain(repo), '');
  assert.ok(!fs.existsSync(path.join(repo.root, TARGET)));
}));

test('init: without a specs/ folder it suggests the spec-kit hygiene rules, never writes them, and with one it suggests nothing', () => withRepo({
  base: { 'package.json': PACKAGE },
}, (repo) => {
  const dry = assertSnapshotUnchanged(repo, () => doctor(repo, ['init', '--json']));
  assert.equal(dry.status, 0);
  const suggested = dry.payload.suggested_hygiene;
  assert.equal(suggested.field, 'commentHygiene.disableRules');
  assert.equal(suggested.applied, false);
  assert.equal(suggested.rules.length, 15);
  assert.ok(suggested.rules.includes('spec-path') && suggested.rules.includes('council-seat'));
  for (const tracker of ['adr', 'req', 'rc', 'chk', 'task', 'issue']) assert.ok(!suggested.rules.includes(tracker), tracker);
  assert.deepEqual(dry.payload.config.commentHygiene.disableRules, []);
  assert.deepEqual(validateConfig({ schemaVersion: 1, commentHygiene: { disableRules: suggested.rules } }), []);
  assert.match(doctor(repo, ['init']).stdout, /Suggested, not written: commentHygiene\.disableRules/);

  const applied = doctor(repo, ['init', '--apply']);
  assert.equal(applied.status, 0);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(repo.root, TARGET), 'utf8')).commentHygiene.disableRules, []);
  fs.rmSync(path.join(repo.root, '.skilled'), { recursive: true });

  fs.mkdirSync(path.join(repo.root, 'specs'));
  const withSpecs = doctor(repo, ['init', '--json']);
  assert.equal(withSpecs.status, 0);
  assert.equal(withSpecs.payload.suggested_hygiene, null);
  assert.doesNotMatch(doctor(repo, ['init']).stdout, /Suggested, not written/);
}));

test('status: names the hygiene rules the config disables, and says every core rule applies without the key', () => withRepo({
  base: { [TARGET]: config({ commentHygiene: { disableRules: ['issue', 'hygiene.task'] } }) },
}, (repo) => {
  const result = doctor(repo, ['status', '--json']);
  assert.equal(result.status, 0);
  assert.deepEqual(result.payload.hygiene, { disabled: ['hygiene.issue', 'hygiene.task'] });
  assert.match(doctor(repo, ['status']).stdout, /^Hygiene: disabled hygiene\.issue, hygiene\.task$/m);
  repo.write({ [TARGET]: config({}) });
  assert.match(doctor(repo, ['status']).stdout, /^Hygiene: every core rule applies$/m);
}));

test('init apply: creates the file once, and a second apply refuses with CONFIG_EXISTS and keeps it byte-identical', () => withRepo({
  base: { 'package.json': PACKAGE },
}, (repo) => {
  const first = doctor(repo, ['init', '--apply']);
  assert.equal(first.status, 0);
  assert.equal(first.last, 'STATUS=OK MODE=APPLIED');
  const target = path.join(repo.root, TARGET);
  const written = fs.readFileSync(target);
  const parsed = JSON.parse(written.toString('utf8'));
  assert.deepEqual(validateConfig(parsed), []);
  assert.deepEqual(parsed.checks.map((entry) => [entry.id, entry.required]), [['lint', false]]);
  assert.deepEqual(fs.readdirSync(path.dirname(target)), ['quality.json']);

  const second = assertSnapshotUnchanged(repo, () => doctor(repo, ['init', '--apply']));
  assert.equal(second.status, 1);
  assert.equal(second.last, 'STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS');
  assert.ok(fs.readFileSync(target).equals(written));
  const dry = doctor(repo, ['init']);
  assert.equal(dry.status, 1);
  assert.equal(dry.last, 'STATUS=FAIL MODE=DRY_RUN ERROR=CONFIG_EXISTS');
}));

test('init apply: a config folder that resolves outside the repository is refused, and nothing is written there', () => withRepo({}, (repo) => {
  const outside = path.join(repo.parent, 'elsewhere');
  fs.mkdirSync(outside);
  fs.mkdirSync(path.dirname(path.join(repo.root, path.dirname(TARGET))), { recursive: true });
  fs.symlinkSync(outside, path.join(repo.root, path.dirname(TARGET)));
  const result = doctor(repo, ['init', '--apply']);
  assert.equal(result.status, 1);
  assert.match(result.last, /^STATUS=FAIL MODE=REFUSED ERROR=OUTSIDE_REPOSITORY /);
  assert.deepEqual(fs.readdirSync(outside), []);
}));

// ─────────────────────────────────────────────────────────────────────────────
// 3. STATUS AND CHECK
// ─────────────────────────────────────────────────────────────────────────────

test('no command starts: status, check and init never run a configured check', () => withRepo({
  base: {
    'package.json': PACKAGE,
    [TARGET]: config({ checks: [{ id: 'canary', argv: [process.execPath, '-e', 'require("fs").writeFileSync("canary", "ran")'], severity: 'P0' }] }),
  },
}, (repo) => {
  // The config is trusted, so a gate run would start the canary. The doctor still must not.
  repo.git(['config', '--local', 'skilled.trustRepoChecks', 'true']);
  const results = assertSnapshotUnchanged(repo, () => [['status'], ['status', '--json'], ['check'], ['init']].map((args) => doctor(repo, args)));
  assert.match(results[0].last, / TRUST=trusted/);
  assert.match(results[2].last, / TRUST=trusted /);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
  // Besides git, the script starts only the quality runner with --explain, which starts no
  // check and writes no file: one runner process per batch of sampled files, one after
  // another. A reviewer can check that by reading one file, because every other way to
  // start a process is absent.
  const { RUNNER } = require(SCRIPT);
  assert.ok(RUNNER.endsWith(path.join('sk-code-quality', 'scripts', 'quality-gate.cjs')), RUNNER);
  assert.ok(fs.statSync(RUNNER).isFile());
  const source = fs.readFileSync(SCRIPT, 'utf8');
  assert.doesNotMatch(source, /child_process|execFile|exec(Sync)?\(|spawnSync|spawnGroup/);
  assert.equal([...source.matchAll(/spawnArgv\(/g)].length, 1);
  assert.match(source, /const argv = \[process\.execPath, RUNNER\];/);
  assert.match(source, /argv\.push\('--explain', /);
}));

test('status: PASS for a found tool, DEGRADED with a repair line for an absent one, and SKIP for a suggestion only', () => withRepo({
  base: {
    'package.json': PACKAGE,
    [TARGET]: config({ checks: [
      { id: 'found', argv: [process.execPath, '-e', '0'], severity: 'P1' },
      { id: 'absent', argv: ['sk-code-absent-tool'], severity: 'P0' },
    ] }),
  },
}, (repo) => {
  const result = assertSnapshotUnchanged(repo, () => doctor(repo, ['status', '--json']));
  assert.equal(result.status, 0);
  assert.equal(result.last, 'STATUS=DEGRADED SOURCE="repo" TRUST=untrusted');
  const states = Object.fromEntries(result.payload.tools.map((row) => [row.tool, row.state]));
  assert.deepEqual(states, { [process.execPath]: 'PASS', 'sk-code-absent-tool': 'DEGRADED', npm: 'SKIP' });
  const absent = result.payload.tools.find((row) => row.tool === 'sk-code-absent-tool');
  assert.equal(absent.repair, `install 'sk-code-absent-tool' or remove absent from ${TARGET}`);
  assert.deepEqual(Object.keys(result.payload.layers).sort(), ['ci_hygiene', 'post_edit', 'pre_commit_hygiene']);
}));

test('status: a committed config with no trust rule reports untrusted and the repair line', () => withRepo({
  base: {
    [TARGET]: config({ checks: [{ id: 'canary', argv: [process.execPath, '-e', 'process.exit(0)'], severity: 'P1' }] }),
  },
}, (repo) => {
  const result = assertSnapshotUnchanged(repo, () => doctor(repo, ['status', '--json']));
  assert.equal(result.status, 0);
  assert.deepEqual([result.payload.config.trust.checks, result.payload.config.trust.reason],
    ['untrusted', 'the config names commands and no trust rule applies']);
  assert.equal(result.payload.config.trust.repair, 'git config --local skilled.trustRepoChecks true');
  const checked = assertSnapshotUnchanged(repo, () => doctor(repo, ['check', '--json']));
  assert.deepEqual([checked.payload.config.trust.checks, checked.payload.config.trust.repair],
    ['untrusted', 'git config --local skilled.trustRepoChecks true']);
  const text = assertSnapshotUnchanged(repo, () => doctor(repo, ['status']));
  assert.match(text.stdout, /^Trust: untrusted .*git config --local skilled\.trustRepoChecks true/m);
}));

test('status and check: a local trust key reports trusted with no repair, and an invalid config reports none', () => withRepo({
  base: { [TARGET]: config({ checks: [{ id: 'trusted-run', argv: [process.execPath, '-e', 'process.exit(0)'], severity: 'P1' }] }) },
}, (repo) => {
  repo.git(['config', '--local', 'skilled.trustRepoChecks', 'true']);
  const trusted = assertSnapshotUnchanged(repo, () => doctor(repo, ['status', '--json']));
  assert.deepEqual([trusted.payload.config.trust.checks, trusted.payload.config.trust.repair], ['trusted', null]);
  assert.equal(trusted.last, 'STATUS=OK SOURCE="repo" TRUST=trusted');
  const checked = assertSnapshotUnchanged(repo, () => doctor(repo, ['check', '--json']));
  assert.deepEqual([checked.payload.config.trust.checks, checked.payload.config.trust.repair], ['trusted', null]);
  assert.equal(checked.last, 'STATUS=OK SOURCE="repo" TRUST=trusted ERRORS=0');
  // A config that did not validate names no check for this run, so no rule decides anything.
  repo.write({ [TARGET]: config({ bogus: true }) });
  const invalid = doctor(repo, ['status', '--json']);
  assert.deepEqual([invalid.payload.config.trust.checks, invalid.payload.config.trust.repair], ['none', null]);
  assert.match(invalid.last, /^STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_INVALID$/);
}));

test('status: a config left at the old root path fails CONFIG_LEGACY_LOCATION and names the move', () => withRepo({
  base: { '.sk-code/quality.json': config({}) },
}, (repo) => {
  const status = doctor(repo, ['status']);
  assert.equal(status.status, 1);
  assert.equal(status.last, 'STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_LEGACY_LOCATION');
  assert.match(status.stdout, /move it to \.skilled\/skills\/sk-code\/sk-code-quality\/repository\/quality\.json/);
}));

test('status: a config inside .sk-code/ named with --config or the git config value is refused as CONFIG_LEGACY_LOCATION', () => withRepo({
  base: { '.sk-code/quality.json': config({}) },
}, (repo) => {
  const named = doctor(repo, ['status', '--config', '.sk-code/quality.json']);
  assert.equal(named.status, 1);
  assert.equal(named.last, 'STATUS=FAIL SOURCE="cli" TRUST=none ERROR=CONFIG_LEGACY_LOCATION');
  assert.match(named.stdout, /move it to \.skilled\/skills\/sk-code\/sk-code-quality\/repository\/quality\.json/);

  repo.git(['config', 'skcode.qualityConfig', '.sk-code/quality.json']);
  const viaGit = doctor(repo, ['status']);
  assert.equal(viaGit.status, 1);
  assert.equal(viaGit.last, 'STATUS=FAIL SOURCE="git-config" TRUST=none ERROR=CONFIG_LEGACY_LOCATION');
}));

test('status: a config written for another repository prints the ignored line instead of reading as unconfigured', () => withRepo({
  base: { [TARGET]: config({ repository: 'acme/widget' }) },
}, (repo) => {
  const result = assertSnapshotUnchanged(repo, () => doctor(repo, ['status'], { env: { GITHUB_REPOSITORY: 'other/thing' } }));
  assert.equal(result.status, 0);
  assert.equal(result.last, 'STATUS=OK SOURCE="none" TRUST=none');
  const expected = `Config: none; ignored ${TARGET}, written for acme/widget, this repository is other/thing`;
  assert.ok(result.stdout.split('\n').includes(expected), result.stdout);
}));

test('status and check: an invalid config is CONFIG_INVALID with exit 1, and a missing --config path is CONFIG_PATH_MISSING', () => withRepo({
  base: { [TARGET]: config({ bogus: true, checks: [{ id: 'x', argv: 'npm run lint', severity: 'P1' }] }) },
}, (repo) => {
  const status = doctor(repo, ['status']);
  assert.equal(status.status, 1);
  assert.equal(status.last, 'STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_INVALID');
  const checked = doctor(repo, ['check', '--json']);
  assert.equal(checked.status, 1);
  assert.equal(checked.last, 'STATUS=FAIL SOURCE="repo" TRUST=none ERRORS=2 ERROR=CONFIG_INVALID');
  assert.deepEqual(checked.payload.config.errors.map((entry) => entry.field).sort(), ['bogus', 'checks[0].argv']);
  const missing = doctor(repo, ['check', '--config', 'missing.json']);
  assert.equal(missing.status, 1);
  assert.equal(missing.last, 'STATUS=FAIL SOURCE="cli" TRUST=none ERRORS=1 ERROR=CONFIG_PATH_MISSING');
  const valid = path.join(repo.parent, 'valid.json');
  fs.writeFileSync(valid, config({}));
  assert.equal(doctor(repo, ['check', '--config', valid]).last, 'STATUS=OK SOURCE="cli" TRUST=none ERRORS=0');
}));

// ─────────────────────────────────────────────────────────────────────────────
// 4. WHAT THE GATE WOULD APPLY
// ─────────────────────────────────────────────────────────────────────────────

const OVERRIDE_HEAD = '## Rule overrides\n\n| Rule | Action | Reason |\n| --- | --- | --- |\n';
const HOUSE = `# House rules\n\n${OVERRIDE_HEAD}| \`floor.documentation\` | none | Public functions carry no doc comments here |\n`
  + '| `review.function-length` | replace: A function stays under 80 lines | The team limit |\n';
const STRICT = `# Strict rules\n\n${OVERRIDE_HEAD}| \`floor.input-validation\` | none | Callers are trusted |\n`;
const DEEP = {
  'src/a/b/aaa.js': 'module.exports = 1;\n',
  'src/a/b/deep/x.js': 'module.exports = 2;\n',
  [TARGET]: config({ checklists: [{ file: '.skilled/skills/sk-code/sk-code-quality/repository/checklists/deep.md', paths: ['src/a/b/deep/**'] }] }),
};
const APPLIED = {
  'src/app.js': 'const answer = 42;\nmodule.exports = { answer };\n',
  '.skilled/skills/sk-code/sk-code-quality/repository/checklists/house.md': HOUSE,
  '.skilled/skills/sk-code/sk-code-quality/repository/checklists/strict.md': STRICT,
  [TARGET]: config({
    checklists: [
      { file: '.skilled/skills/sk-code/sk-code-quality/repository/checklists/house.md', paths: ['src/**'] },
      { file: '.skilled/skills/sk-code/sk-code-quality/repository/checklists/strict.md', paths: ['src/**'] },
    ],
    commentHygiene: { disableRules: ['task'] },
  }),
};

test('status: shows each checklist the gate would apply with its seat, a valid override row and a floor row refused with its reason', () => withRepo({
  base: APPLIED,
}, (repo) => {
  const result = assertSnapshotUnchanged(repo, () => doctor(repo, ['status', '--json']));
  // A gate run refuses the strict file's section with CONFIG_INVALID, exit 3, so the status
  // fails on it too.
  assert.equal(result.status, 1, result.stdout);
  assert.equal(result.last, 'STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_INVALID');
  const { applies } = result.payload;
  assert.equal(applies.resolved, true);
  assert.ok(applies.sample.files >= 1 && applies.sample.files <= applies.sample.listed);
  const byFile = Object.fromEntries(applies.checklists.map((item) => [item.file, item]));
  assert.deepEqual(byFile['hub:sk-code/shared/references/universal/code-quality-standards.md'].seats, ['default']);

  const house = byFile['.skilled/skills/sk-code/sk-code-quality/repository/checklists/house.md'];
  assert.deepEqual(house.seats, ['repo-config']);
  assert.equal(house.overrides.refused, false);
  assert.deepEqual(house.overrides.rows.map((row) => [row.id, row.action, row.text]),
    [['floor.documentation', 'none', null], ['review.function-length', 'replace', 'A function stays under 80 lines']]);

  const strict = byFile['.skilled/skills/sk-code/sk-code-quality/repository/checklists/strict.md'];
  assert.deepEqual(strict.seats, ['repo-config']);
  assert.equal(strict.overrides.refused, true);
  assert.deepEqual(strict.overrides.rows, []);
  assert.equal(strict.overrides.errors.length, 1);
  assert.match(strict.overrides.errors[0].message, /floor\.input-validation.*hard floor.*cannot be overridden/);
  assert.deepEqual(applies.errors.map((row) => row.code), ['CONFIG_INVALID']);
  assert.match(applies.errors[0].message, /^\.skilled\/skills\/sk-code\/sk-code-quality\/repository\/checklists\/strict\.md has a refused ## Rule overrides section, so none of its rows apply: line 7: /);
  assert.ok(applies.checklists.every((item) => item.reached), 'every declared row was sampled');

  const text = doctor(repo, ['status']).stdout;
  assert.match(text, /^Checklists: \d+, resolved by quality-gate\.cjs --explain over \d+ of \d+ listed files/m);
  assert.match(text, /^ {2}repo-config +\.skilled\/skills\/sk-code\/sk-code-quality\/repository\/checklists\/house\.md /m);
  assert.match(text, /^ {4}override floor\.documentation none \(Public functions carry no doc comments here\)$/m);
  assert.match(text, /^ {4}override review\.function-length replace: A function stays under 80 lines \(The team limit\)$/m);
  assert.match(text, /^ {4}overrides REFUSED, none of its rows apply:\n {6}line 7: .*floor\.input-validation/m);
}));

test('status: lists the hygiene rules that apply and shows a disabled one as disabled, never as active', () => withRepo({
  base: { ...APPLIED, [TARGET]: config({ checklists: [{ file: '.skilled/skills/sk-code/sk-code-quality/repository/checklists/house.md', paths: ['src/**'] }], commentHygiene: { disableRules: ['task'] } }) },
}, (repo) => {
  const result = doctor(repo, ['status', '--json']);
  assert.equal(result.status, 0, result.stdout);
  const { hygiene } = result.payload.applies;
  assert.deepEqual(hygiene.disabled, ['hygiene.task']);
  assert.ok(!hygiene.active.includes('hygiene.task'));
  assert.ok(hygiene.active.includes('hygiene.adr') && hygiene.active.includes('hygiene.issue'));
  assert.match(doctor(repo, ['status']).stdout, /^Hygiene rules: \d+ apply \(.*hygiene\.adr.*\), disabled hygiene\.task$/m);
}));

test('status: a checklist the config names that is missing fails the status with the runner\'s CHECKLIST_MISSING, and an invalid config resolves nothing', () => withRepo({
  base: {
    'src/app.js': 'const answer = 42;\n',
    [TARGET]: config({ checklists: [{ file: '.skilled/skills/sk-code/sk-code-quality/repository/checklists/gone.md', paths: ['src/**'] }] }),
  },
}, (repo) => {
  const result = assertSnapshotUnchanged(repo, () => doctor(repo, ['status', '--json']));
  assert.equal(result.status, 1);
  assert.equal(result.last, 'STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CHECKLIST_MISSING');
  assert.deepEqual(result.payload.applies.errors.map((row) => row.code), ['CHECKLIST_MISSING']);
  const gone = result.payload.applies.checklists.find((item) => item.file === '.skilled/skills/sk-code/sk-code-quality/repository/checklists/gone.md');
  assert.equal(gone.overrides, null);

  repo.write({ [TARGET]: config({ bogus: true }) });
  const invalid = doctor(repo, ['status', '--json']);
  assert.equal(invalid.last, 'STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_INVALID');
  assert.deepEqual([invalid.payload.applies.resolved, invalid.payload.applies.hygiene], [false, null]);
}));

test('status: a section with a row that names no known rule fails the status CONFIG_INVALID, as the gate refuses it', () => withRepo({
  base: {
    'src/app.js': 'const answer = 42;\n',
    '.skilled/skills/sk-code/sk-code-quality/repository/checklists/typo.md': `# Typo\n\n${OVERRIDE_HEAD}| \`review.function-lenght\` | none | Misspelled on purpose |\n`,
    [TARGET]: config({ checklists: [{ file: '.skilled/skills/sk-code/sk-code-quality/repository/checklists/typo.md', paths: ['src/**'] }] }),
  },
}, (repo) => {
  const result = assertSnapshotUnchanged(repo, () => doctor(repo, ['status', '--json']));
  assert.equal(result.status, 1, result.stdout);
  assert.equal(result.last, 'STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_INVALID');
  const typo = result.payload.applies.checklists.find((item) => item.file === '.skilled/skills/sk-code/sk-code-quality/repository/checklists/typo.md');
  assert.deepEqual([typo.reached, typo.overrides.refused, typo.unknown.map((row) => row.line)], [true, false, [7]]);
  assert.match(doctor(repo, ['status']).stdout, /^ {4}overrides REFUSED, none of its rows apply:\n {6}line 7: `review\.function-lenght` names no rule/m);
}));

test('status: two repository checklists that disagree on one rule print an override-conflict for the sampled file and keep the status OK', () => withRepo({
  base: {
    'src/app.js': 'const answer = 42;\n',
    '.skilled/skills/sk-code/sk-code-quality/repository/checklists/house.md': HOUSE,
    '.skilled/skills/sk-code/sk-code-quality/repository/checklists/other.md': `# Other team\n\n${OVERRIDE_HEAD}| \`review.function-length\` | none | No limit here |\n`,
    [TARGET]: config({ checklists: [
      { file: '.skilled/skills/sk-code/sk-code-quality/repository/checklists/house.md', paths: ['src/**'] },
      { file: '.skilled/skills/sk-code/sk-code-quality/repository/checklists/other.md', paths: ['src/**'] },
    ] }),
  },
}, (repo) => {
  const result = assertSnapshotUnchanged(repo, () => doctor(repo, ['status', '--json']));
  // A conflict leaves the gate UNVERIFIED, exit 4, rather than stopping it with exit 3, so
  // it does not fail the status the way a refused section does.
  assert.equal(result.status, 0, result.stdout);
  assert.equal(result.last, 'STATUS=OK SOURCE="repo" TRUST=none');
  assert.deepEqual(result.payload.applies.conflicts,
    [{ id: 'review.function-length', files: ['.skilled/skills/sk-code/sk-code-quality/repository/checklists/house.md', '.skilled/skills/sk-code/sk-code-quality/repository/checklists/other.md'], sampled: ['src/app.js'] }]);
  assert.match(doctor(repo, ['status']).stdout,
    /^ {2}override-conflict review\.function-length \.skilled\/skills\/sk-code\/sk-code-quality\/repository\/checklists\/house\.md \.skilled\/skills\/sk-code\/sk-code-quality\/repository\/checklists\/other\.md \(neither row applies, so the gate reads UNVERIFIED for src\/app\.js\)$/m);
}));

test('status: a repository row the sample cannot reach is still listed and checked, valid, missing or refused', () => withRepo({
  base: { ...DEEP, '.skilled/skills/sk-code/sk-code-quality/repository/checklists/deep.md': HOUSE },
}, (repo) => {
  const valid = assertSnapshotUnchanged(repo, () => doctor(repo, ['status', '--json']));
  assert.equal(valid.status, 0, valid.stdout);
  assert.equal(valid.last, 'STATUS=OK SOURCE="repo" TRUST=none');
  const deep = valid.payload.applies.checklists.find((item) => item.file === '.skilled/skills/sk-code/sk-code-quality/repository/checklists/deep.md');
  assert.deepEqual([deep.reached, deep.seats, deep.files], [false, ['repo-config'], 0]);
  assert.deepEqual(deep.overrides.rows.map((row) => row.id), ['floor.documentation', 'review.function-length']);
  assert.match(doctor(repo, ['status']).stdout,
    /^ {2}repo-config +\.skilled\/skills\/sk-code\/sk-code-quality\/repository\/checklists\/deep\.md \(.*declared, not reached by the sample: run quality-gate\.cjs --explain <path> on a file it selects\)$/m);

  repo.write({ '.skilled/skills/sk-code/sk-code-quality/repository/checklists/deep.md': STRICT });
  const refused = doctor(repo, ['status', '--json']);
  assert.equal(refused.status, 1);
  assert.equal(refused.last, 'STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_INVALID');
  assert.match(refused.payload.applies.errors[0].message, /deep\.md has a refused ## Rule overrides section.*floor\.input-validation/);

  fs.rmSync(path.join(repo.root, '.skilled', 'skills', 'sk-code', 'sk-code-quality', 'repository', 'checklists', 'deep.md'));
  const missing = doctor(repo, ['status', '--json']);
  assert.equal(missing.status, 1);
  assert.equal(missing.last, 'STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CHECKLIST_MISSING');
  const gone = missing.payload.applies.checklists.find((item) => item.file === '.skilled/skills/sk-code/sk-code-quality/repository/checklists/deep.md');
  assert.deepEqual([gone.reached, gone.overrides], [false, null]);
}));

// ─────────────────────────────────────────────────────────────────────────────
// 5. HELP AND USAGE
// ─────────────────────────────────────────────────────────────────────────────

test('help: -h and --help print the usage and exit 0, and a usage error or a folder outside git exits 2', () => withRepo({}, (repo) => {
  for (const flag of ['-h', '--help']) {
    const result = doctor(repo, ['init', '--apply', flag]);
    assert.equal(result.status, 0, flag);
    assert.match(result.stdout, /^Usage: /);
    assert.ok(!fs.existsSync(path.join(repo.root, TARGET)));
  }
  const usage = doctor(repo, ['-h']).stdout;
  const source = fs.readFileSync(SCRIPT, 'utf8');
  const parsed = [...source.matchAll(/arg === '(--[a-z-]+)'/g)].map((match) => match[1]);
  assert.ok(parsed.length >= 4);
  for (const flag of [...parsed, 'status', 'check', 'init', 'skcode.qualityConfig', TARGET]) assert.ok(usage.includes(flag), flag);
  for (const code of ['0  ', '1  ', '2  ']) assert.ok(usage.includes(`  ${code}`), code);

  const unknown = doctor(repo, ['repair']);
  assert.equal(unknown.status, 2);
  assert.match(unknown.last, /^STATUS=FAIL ERROR=USAGE /);
  const plain = path.join(repo.parent, 'plain');
  fs.mkdirSync(plain);
  const outside = doctor(repo, ['status'], { cwd: plain });
  assert.equal(outside.status, 2);
  assert.match(outside.last, /^STATUS=FAIL ERROR=NO_GIT_REPOSITORY /);
}));
