// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Tests — Declared Generated Paths and the Dist Adapter
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case seeds a declared build and reads the row the dist adapter produces, so the
// group covers the freshness verdicts, the banner a checker that cannot answer prints, and
// the read-only mode the gate runs it in.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { QUALITY_ROOT, HUB_ROOT, DECLARED_PATH, DECLARED_PACKAGE, withRepo, check, declaredPackage, ageDeclaredPackage, withUnassessableDist } = require('./quality-gate-helpers.cjs');
const { assertSnapshotUnchanged } = require('./fixtures.cjs');
const { runDistAdapter } = require('../quality-gate.cjs');
// The freshness library the dist checker calls, read here so a case can ask for the
// read-only verdict without a shell in between.
const { checkFileFreshness, checkPackageFreshness } = require(path.join(HUB_ROOT, '..', 'system-spec-kit', 'runtime', 'cli', 'lib', 'dist-freshness.cjs'));

// ─────────────────────────────────────────────────────────────────────────────
// 2. CASES
// ─────────────────────────────────────────────────────────────────────────────

// The base layer excludes every dist folder, and it also declares the built files this
// repository holds. A declared path reaches the dist adapter alone, and the fixture
// package is fresh, so an empty banner is a real verdict rather than a silent skip.
test('F20 declared generated path: the dist adapter reads it and no other check does', () => withRepo({
  change: declaredPackage(),
}, (repo) => {
  fs.mkdirSync(path.join(repo.root, DECLARED_PACKAGE, 'node_modules'), { recursive: true });
  ageDeclaredPackage(repo, true);
  const { status, verdict, fresh } = assertSnapshotUnchanged(repo, () => {
    // The direct verdict proves which package and entry the lookup chose, and the
    // snapshot proves the read-only call wrote no cache record beside the build.
    const direct = checkFileFreshness(path.join(repo.root, DECLARED_PATH), { workspaceRoot: repo.root, readOnly: true });
    return { fresh: direct, ...repo.run(['--files', DECLARED_PATH]) };
  });
  assert.deepEqual([fresh.packageId, fresh.entry, fresh.status], ['system-spec-kit/runtime/cli', 'is-phase-parent', 'fresh']);
  const dist = check(verdict, 'dist-staleness');
  assert.deepEqual([dist.state, dist.files, dist.repair], ['RAN_CLEAN', 1, null]);
  assert.deepEqual(verdict.findings, []);
  assert.deepEqual(verdict.coverage.unchecked, []);
  assert.equal(verdict.coverage.files_checked, 1);
  assert.deepEqual(verdict.surfaces, []);
  for (const entry of verdict.checks.filter((row) => row.id !== 'dist-staleness')) {
    assert.equal(entry.state, 'NOT_APPLICABLE', `${entry.id} read the built file`);
  }
  assert.equal(status, 0);
}));

// The counter case: the same declared path with a source newer than its build must
// report stale and name the file, which only a real check against the package can do.
test('F20b declared generated path: a newer source reports stale and names the file', () => withRepo({
  change: declaredPackage(),
}, (repo) => {
  fs.mkdirSync(path.join(repo.root, DECLARED_PACKAGE, 'node_modules'), { recursive: true });
  ageDeclaredPackage(repo, false);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', DECLARED_PATH]));
  const dist = check(verdict, 'dist-staleness');
  assert.deepEqual([dist.state, dist.files], ['RAN_FAIL', 1]);
  assert.deepEqual(verdict.findings.map((entry) => [entry.file, entry.rule, entry.blocking]),
    [[DECLARED_PATH, 'dist.stale', false]]);
  assert.equal(status, 0);
}));

// A dist check that holds no verdict is not a clean build. Each shape below is a checker
// that cannot answer, so the row has to read as an error and the banner has to name the
// file and the reason rather than leaving the file looking verified.
test('F30 a throwing checker: the dist check errors', () => withUnassessableDist(
  'throw new Error("fixture checker exploded");', ({ adapter, direct }) => {
    assert.equal(adapter.check.state, 'ERROR');
    assert.deepEqual(adapter.findings, []);
    assert.equal(direct.exit, 0);
    assert.match(direct.stdout, /^DIST FRESHNESS CHECK ERROR: .*dist\/thing\.js -- the checker exited 1/);
  }));

test('F31 a checker that exits 64: the dist check errors', () => withUnassessableDist(
  'process.stderr.write("fixture checker refused\\n");\nprocess.exit(64);', ({ adapter, direct }) => {
    assert.equal(adapter.check.state, 'ERROR');
    assert.deepEqual(adapter.findings, []);
    assert.equal(direct.exit, 0);
    assert.match(direct.stdout, /^DIST FRESHNESS CHECK ERROR: .*dist\/thing\.js -- the checker exited 64 without printing a verdict: fixture checker refused/);
  }));

test('F32 an unprovisioned checker: the dist check errors', () => withUnassessableDist(
  'process.stdout.write(JSON.stringify({ status: "unprovisioned" }) + "\\n");', ({ adapter, direct }) => {
    assert.equal(adapter.check.state, 'ERROR');
    assert.deepEqual(adapter.findings, []);
    assert.equal(direct.exit, 0);
    assert.match(direct.stdout, /^DIST FRESHNESS CHECK ERROR: .*dist\/thing\.js -- the package is not provisioned/);
  }));

test('F33 a silent checker: the dist check errors', () => withUnassessableDist('', ({ adapter, direct }) => {
  assert.equal(adapter.check.state, 'ERROR');
  assert.deepEqual(adapter.findings, []);
  assert.equal(direct.exit, 0);
  assert.match(direct.stdout, /^DIST FRESHNESS CHECK ERROR: .*dist\/thing\.js -- the checker printed no verdict/);
}));

// A declared generated path is output, so only the dist adapter reads it. A configured
// command that would match it by path stays NOT_APPLICABLE, and a repository exclude can
// still take a declared path out of the run.
test('unit: configured skips generated', () => withRepo({
  change: declaredPackage(),
}, (repo) => {
  fs.mkdirSync(path.join(repo.root, DECLARED_PACKAGE, 'node_modules'), { recursive: true });
  ageDeclaredPackage(repo, true);
  const config = (extra) => `${JSON.stringify({
    schemaVersion: 1,
    checks: [{ id: 'js-lint', argv: [process.execPath, '-e', 'process.exit(9)', '{files}'], paths: ['**/*.js'], severity: 'P1' }],
    ...extra,
  })}\n`;
  repo.write({ '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({}) });
  const declared = assertSnapshotUnchanged(repo, () => repo.run(['--files', DECLARED_PATH]));
  assert.equal(declared.status, 0);
  assert.deepEqual([check(declared.verdict, 'js-lint').state, check(declared.verdict, 'js-lint').files], ['NOT_APPLICABLE', 0]);
  assert.deepEqual([check(declared.verdict, 'dist-staleness').state, check(declared.verdict, 'dist-staleness').files], ['RAN_CLEAN', 1]);

  repo.write({ '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ exclude: [DECLARED_PATH] }) });
  const excluded = assertSnapshotUnchanged(repo, () => repo.run(['--files', DECLARED_PATH]));
  assert.equal(excluded.status, 2);
  assert.deepEqual([check(excluded.verdict, 'dist-staleness').state, check(excluded.verdict, 'dist-staleness').files], ['NOT_APPLICABLE', 0]);
  assert.deepEqual(excluded.verdict.coverage.unchecked, [{ file: DECLARED_PATH, reason: 'excluded' }]);
}));

test('unit: dist adapter', () => {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-dist-')));
  try {
    const script = path.join(temp, 'fake-dist.py');
    fs.writeFileSync(script, [
      'import os, sys',
      'name = os.path.basename(sys.argv[1])',
      'if os.environ.get("SPECKIT_DIST_AUTO_REBUILD") != "0":',
      '    print("rebuild was left on")',
      'elif name.startswith("stale"):',
      '    print("STALE DIST WARNING: fixture-package -- run: npm run build")',
      'elif name.startswith("broken"):',
      '    print("DIST FRESHNESS CHECK ERROR: fixture-package -- could not verify")',
      'elif name.startswith("noisy"):',
      '    print("something else entirely")',
      'elif name.startswith("unmatched"):',
      '    print("DIST FRESHNESS CHECK UNMATCHED: /tmp/unmatched.js -- no package owns this path")',
      '',
    ].join('\n'));
    const file = (name) => ({ rel: `dist/${name}`, abs: path.join(temp, name) });
    const env = { PATH: process.env.PATH, SPECKIT_DIST_AUTO_REBUILD: '1' };
    const options = { env, script, cwd: temp, timeoutMs: 20000 };

    const stale = runDistAdapter([file('stale.js')], options);
    assert.equal(stale.check.state, 'RAN_FAIL');
    assert.deepEqual(stale.check.argv, ['python3', '-B', script, '{file}']);
    assert.deepEqual(stale.findings.map((entry) => [entry.rule, entry.severity, entry.blocking]), [['dist.stale', 'P1', false]]);
    assert.equal(runDistAdapter([file('fresh.js')], options).check.state, 'RAN_CLEAN');
    assert.equal(runDistAdapter([file('broken.js')], options).check.state, 'ERROR');
    const unmapped = runDistAdapter([file('unmatched.js')], options).check;
    assert.equal(unmapped.state, 'ERROR');
    assert.match(unmapped.repair, /dist\/unmatched\.js/);
    // The same verdict through the real checker, so the line the adapter parses is
    // the one the shipped script prints rather than only the stand-in's.
    const realChecker = path.join(QUALITY_ROOT, 'scripts', 'check-dist-staleness.sh');
    fs.writeFileSync(path.join(temp, 'undeclared.js'), 'module.exports = 1;\n');
    const realUnmapped = runDistAdapter([{ rel: 'dist/undeclared.js', abs: path.join(temp, 'undeclared.js') }],
      { env: { PATH: process.env.PATH }, cwd: temp, timeoutMs: 20000, script: realChecker }).check;
    assert.equal(realUnmapped.state, 'ERROR');
    assert.match(realUnmapped.repair, /dist\/undeclared\.js/);
    assert.equal(runDistAdapter([file('noisy.js')], options).check.state, 'ERROR');
    assert.equal(runDistAdapter([file('stale.js')], { ...options, noRun: true }).check.state, 'LISTED');
    assert.equal(runDistAdapter([file('stale.js')], { ...options, env: { ...env, SYSTEM_DIST_FRESHNESS_DISABLED: '1' } }).check.state, 'SKIPPED_BY_FLAG');
    const flags = path.join(temp, 'hook-flags.env');
    fs.writeFileSync(flags, 'SYSTEM_DIST_FRESHNESS_DISABLED="true"  # off for this case\n');
    assert.equal(runDistAdapter([file('stale.js')], { ...options, env: { ...env, HOOK_FLAGS_CONFIG: flags } }).check.state, 'SKIPPED_BY_FLAG');
    assert.equal(runDistAdapter([file('stale.js')], { ...options, env: { PATH: temp } }).check.state, 'SKIPPED_ABSENT');
    assert.equal(runDistAdapter([], options).check.state, 'NOT_APPLICABLE');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

// A freshness check writes its cache record beside the dist entry it read, and a gate
// run promises to write nothing. The read-only mode has to return the same verdict and
// leave no record, while the writable default still records the build it checked.
test('unit: dist read-only', () => {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-fresh-')));
  try {
    const packageRoot = path.join(temp, '.skilled', 'skills', 'system-spec-kit', 'shared');
    const distDir = path.join(packageRoot, 'dist');
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(path.join(packageRoot, 'tsconfig.json'), '{"compilerOptions": {}}\n');
    fs.writeFileSync(path.join(packageRoot, 'index.ts'), 'export const value = 1;\n');
    fs.writeFileSync(path.join(distDir, 'tsconfig.tsbuildinfo'), '{"build": "current"}\n');
    const past = (Date.now() - 60000) / 1000;
    for (const name of ['tsconfig.json', 'index.ts']) fs.utimesSync(path.join(packageRoot, name), past, past);
    const records = () => fs.readdirSync(distDir).filter((name) => name.startsWith('.dist-freshness-'));

    const readOnly = checkPackageFreshness('system-spec-kit/shared', { workspaceRoot: temp, readOnly: true });
    assert.equal(readOnly.status, 'fresh');
    assert.deepEqual([readOnly.stale, readOnly.origin], [false, 'checker']);
    assert.deepEqual(records(), []);

    const writable = checkPackageFreshness('system-spec-kit/shared', { workspaceRoot: temp });
    assert.deepEqual([writable.status, writable.stale, writable.sourceHash, writable.distHash],
      [readOnly.status, readOnly.stale, readOnly.sourceHash, readOnly.distHash]);
    assert.equal(records().length, 1);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
