// ───────────────────────────────────────────────────────────────────
// MODULE: Post-Edit Router Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Tests for how the shared post-edit router finds its checkers and reports a
// missing one.
//
// The router resolves the comment-hygiene checker beside its own real path
// before it looks in the project folder, so a project that reaches the hub
// through a link still gets checked. It reads the extensions it dispatches from
// the checker's family table and keeps a built-in set for when that table is
// unreadable. A missing checker must surface as one notice, never as a silent
// pass, and the router itself must never print. The hostile case copies the
// router into a tree with no hub checker and no table, which is the state a
// partial install leaves behind.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const ROUTER_PATH = path.join(__dirname, '..', 'lib', 'post-edit-router.cjs');
const router = require(ROUTER_PATH);

// The router sits three folders below its source root.
const SOURCE_ROOT = path.resolve(fs.realpathSync(__dirname), '..', '..', '..');
const HUB_CHECKER = path.join(SOURCE_ROOT, 'skills', 'sk-code', 'sk-code-quality', 'scripts', 'check-comment-hygiene.sh');

function temporaryDirectory(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function writeFile(filePath, content, mode) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  if (mode) fs.chmodSync(filePath, mode);
  return filePath;
}

// Copies the router alone into a fresh source root, so neither the hub checker
// nor the family table exists beside the copy.
function isolatedRouter(t) {
  const hubRoot = temporaryDirectory(t, 'post-edit-router-isolated-');
  const copy = path.join(hubRoot, '.skilled', 'hooks', 'post-edit-quality', 'lib', 'post-edit-router.cjs');
  writeFile(copy, fs.readFileSync(ROUTER_PATH));
  return require(copy);
}

async function captureWrites(callback) {
  const writes = [];
  const saved = {
    stdout: process.stdout.write,
    stderr: process.stderr.write,
    log: console.log,
    warn: console.warn,
    error: console.error,
  };
  process.stdout.write = (chunk) => { writes.push(`stdout:${chunk}`); return true; };
  process.stderr.write = (chunk) => { writes.push(`stderr:${chunk}`); return true; };
  console.log = (message) => writes.push(`log:${message}`);
  console.warn = (message) => writes.push(`warn:${message}`);
  console.error = (message) => writes.push(`error:${message}`);
  try {
    await callback();
  } finally {
    process.stdout.write = saved.stdout;
    process.stderr.write = saved.stderr;
    console.log = saved.log;
    console.warn = saved.warn;
    console.error = saved.error;
  }
  return writes;
}

test('resolves the checker from the router folder', (t) => {
  const projectDir = temporaryDirectory(t, 'post-edit-router-project-');
  const editedFile = writeFile(path.join(projectDir, 'src', 'app.ts'), 'export const a = 1;\n');

  const entries = router.resolveDispatch(editedFile, projectDir);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].label, 'comment-hygiene');
  assert.equal(entries[0].checkerPath, HUB_CHECKER, 'a project without its own checker must reach the hub copy');
  assert.ok(fs.existsSync(entries[0].checkerPath));

  // A project copy of the checker does not override the hub copy.
  writeFile(path.join(projectDir, router.CHECKER_RELATIVE_PATHS.commentHygiene), '#!/bin/sh\nexit 1\n', 0o755);
  assert.equal(router.resolveDispatch(editedFile, projectDir)[0].checkerPath, HUB_CHECKER);
});

test('dispatches the languages the family table adds', () => {
  for (const file of ['svc/main.go', 'lib/a.rs', 'ci/build.yml', 'web/site.css', 'db/schema.sql', 'pkg/a.mts']) {
    const entries = router.resolveDispatch(file, '/tmp/proj');
    assert.equal(entries.length, 1, `${file} must reach comment hygiene`);
    assert.equal(entries[0].label, 'comment-hygiene');
  }
  assert.deepEqual(router.resolveDispatch('notes/readme.txt', '/tmp/proj'), []);
});

test('falls back to the built-in extension set', (t) => {
  const dir = temporaryDirectory(t, 'post-edit-router-table-');
  const builtin = new Set(router.BUILTIN_SOURCE_EXTENSIONS);
  assert.deepEqual(router.loadSourceExtensions(path.join(dir, 'missing.json')), builtin);
  assert.deepEqual(router.loadSourceExtensions(writeFile(path.join(dir, 'broken.json'), '{ not json')), builtin);
  assert.deepEqual(router.loadSourceExtensions(writeFile(path.join(dir, 'empty.json'), '{"languages": {}}')), builtin);

  const isolated = isolatedRouter(t);
  assert.deepEqual(isolated.SOURCE_EXTENSIONS, builtin, 'a router with no table beside it uses the built-in set');
  assert.ok(router.SOURCE_EXTENSIONS.has('.go'), 'the shipped router reads the table, which covers Go');
});

test('falls back to the project checker when the hub copy is missing', (t) => {
  const isolated = isolatedRouter(t);
  const projectDir = temporaryDirectory(t, 'post-edit-router-fallback-');
  const editedFile = writeFile(path.join(projectDir, 'app.js'), 'module.exports = {};\n');
  const projectChecker = path.join(projectDir, isolated.CHECKER_RELATIVE_PATHS.commentHygiene);

  assert.equal(isolated.resolveDispatch(editedFile, projectDir)[0].checkerPath, projectChecker);
});

test('returns one quality-notice for a missing checker', (t) => {
  const isolated = isolatedRouter(t);
  const projectDir = temporaryDirectory(t, 'post-edit-router-missing-');
  const editedFile = writeFile(path.join(projectDir, 'app.js'), 'module.exports = {};\n');
  const entries = isolated.resolveDispatch(editedFile, projectDir);
  const missing = entries[0].checkerPath;
  assert.equal(fs.existsSync(missing), false);

  const findings = router.runChecks([entries[0], { ...entries[0] }], 5000);
  assert.equal(findings.length, 1, 'two entries naming the same missing checker give one notice');
  assert.equal(findings[0].label, 'quality-notice');
  assert.match(findings[0].stdout, /comment-hygiene checker not found/);
  assert.ok(findings[0].stdout.includes(missing));

  const tracker = router.createDedupeTracker();
  assert.equal(router.runChecks(entries, 5000, { dedupeTracker: tracker }).length, 1);
  assert.deepEqual(router.runChecks(entries, 5000, { dedupeTracker: tracker }), [], 'a session sees the notice once');
});

test('writes nothing to stdout or stderr', async (t) => {
  const projectDir = temporaryDirectory(t, 'post-edit-router-silent-');
  const editedFile = writeFile(path.join(projectDir, 'app.ts'), '// see ADR-12\nexport const a = 1;\n');

  let findings = [];
  const writes = await captureWrites(async () => {
    const entries = router.resolveDispatch(editedFile, projectDir);
    findings = router.runChecks(entries, 8000, { perChildTimeoutMs: 8000, minCheckerMs: 500 });
    findings = findings.concat(router.runChecks([{
      label: 'ghost', checkerPath: path.join(projectDir, 'absent.sh'), args: [], surfaceRule: 'exit1',
    }], 5000));
  });

  assert.deepEqual(writes, [], 'the router must stay silent and leave reporting to its adapters');
  assert.deepEqual(findings.map((finding) => finding.label), ['comment-hygiene', 'quality-notice']);
  assert.match(findings[0].stdout, /\[ADR reference\]/, 'the real hub checker ran and reported its reason');
});
