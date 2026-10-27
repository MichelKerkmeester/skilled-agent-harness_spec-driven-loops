#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: generate-leaf-manifest-git-timeout.test
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Covers bounded git calls on the leaf walk: each call carries a timeout,
 * check-ignore disables fsmonitor, the first failed call latches the walk onto
 * its name fallback, and a timed-out write refuses to touch the manifest.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const GENERATOR_PATH = path.join(__dirname, '..', 'generate-leaf-manifest.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

let tmpRoot = null;

function makeTmpDir(label) {
  if (!tmpRoot) tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-git-timeout-'));
  return fs.mkdtempSync(path.join(tmpRoot, `${label}-`));
}

function writeFile(root, relativePath, content) {
  const full = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function writeStandaloneSkill(skillDir) {
  writeFile(skillDir, 'leaf-manifest.config.json', `${JSON.stringify({
    workflowMode: 'git-timeout-probe',
    packet: '.',
    leafRoots: ['references', 'assets'],
  }, null, 2)}\n`);
}

// The generator destructures spawnSync when it loads, so the patched module has
// to be in place before the cached copy is dropped and re-read.
function loadGenerator(spawnImpl) {
  delete require.cache[GENERATOR_PATH];
  const original = childProcess.spawnSync;
  childProcess.spawnSync = spawnImpl;
  try {
    return require(GENERATOR_PATH);
  } finally {
    childProcess.spawnSync = original;
  }
}

function revParseTop(root) {
  return { status: 0, stdout: `${root}\n`, stderr: '' };
}

function timedOut() {
  return {
    error: Object.assign(new Error('spawnSync git ETIMEDOUT'), { code: 'ETIMEDOUT' }),
    status: null,
    stdout: '',
    stderr: '',
  };
}

function leavesOf(generator, skillDir) {
  const manifest = JSON.parse(generator.buildManifestBytes(skillDir).toString('utf8'));
  return manifest.modes[0].leaves.slice().sort();
}

test.after(() => {
  if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('check-ignore disables fsmonitor and carries the git timeout', () => {
  const repoRoot = makeTmpDir('check-ignore-argv');
  const skillDir = path.join(repoRoot, 'skill');
  writeStandaloneSkill(skillDir);
  writeFile(skillDir, 'references/keep.md', '# keep\n');

  const calls = [];
  const generator = loadGenerator((command, args, options) => {
    calls.push({ command, args, options });
    if (args[0] === 'rev-parse') return revParseTop(repoRoot);
    return { status: 1, stdout: '', stderr: '' };
  });
  leavesOf(generator, skillDir);

  const checkIgnore = calls.find((call) => call.args.includes('check-ignore'));
  assert.ok(checkIgnore, 'check-ignore must run');
  assert.deepEqual(checkIgnore.args.slice(0, 3), ['-c', 'core.fsmonitor=false', 'check-ignore']);
  assert.equal(checkIgnore.options.timeout, 20000);
});

test('a check-ignore timeout falls back to the name rules', () => {
  const repoRoot = makeTmpDir('check-ignore-timeout');
  const skillDir = path.join(repoRoot, 'skill');
  writeStandaloneSkill(skillDir);
  writeFile(skillDir, 'references/keep.md', '# keep\n');
  writeFile(skillDir, 'references/node_modules/x/index.js', 'module.exports = {};\n');

  let timedOutSeen = false;
  const generator = loadGenerator((command, args) => {
    if (args[0] === 'rev-parse') return revParseTop(repoRoot);
    timedOutSeen = true;
    return timedOut();
  });

  assert.deepEqual(leavesOf(generator, skillDir), ['references/keep.md']);
  assert.ok(timedOutSeen, 'check-ignore must have been attempted once');
});

test('after one timeout a second root spawns no further git call', () => {
  const repoRoot = makeTmpDir('latched');
  const first = path.join(repoRoot, 'first');
  const second = path.join(repoRoot, 'second');
  for (const skillDir of [first, second]) {
    writeStandaloneSkill(skillDir);
    writeFile(skillDir, 'references/keep.md', '# keep\n');
    writeFile(skillDir, 'references/node_modules/x/index.js', 'module.exports = {};\n');
  }

  const calls = [];
  const generator = loadGenerator((command, args) => {
    calls.push(args.join(' '));
    if (args[0] === 'rev-parse') return revParseTop(repoRoot);
    return timedOut();
  });

  generator.buildManifestBytes(first);
  assert.deepEqual(calls, [
    'rev-parse --show-toplevel',
    '-c core.fsmonitor=false check-ignore -z --stdin',
  ]);

  generator.buildManifestBytes(second);
  assert.equal(calls.length, 2, 'a latched timeout must not spawn git again');
});

test('a timed-out write stays off disk and leaves the committed bytes alone', () => {
  const repoRoot = makeTmpDir('write-refused');
  const skillDir = path.join(repoRoot, 'skill');
  writeStandaloneSkill(skillDir);
  writeFile(skillDir, 'references/keep.md', '# keep\n');
  writeFile(skillDir, 'references/node_modules/x/index.js', 'module.exports = {};\n');
  const manifestPath = path.join(skillDir, 'leaf-manifest.json');
  const committed = Buffer.from('{"modes":[]}\n');
  fs.writeFileSync(manifestPath, committed);

  const generator = loadGenerator((command, args) => {
    if (args[0] === 'rev-parse') return revParseTop(repoRoot);
    return timedOut();
  });
  // Prime the latch exactly as a real walk would: one timed-out ignore query.
  generator.buildManifestBytes(skillDir);

  let stderr = '';
  const originalWrite = process.stderr.write;
  process.stderr.write = (chunk) => { stderr += chunk; return true; };
  let code = null;
  try {
    code = generator.runWrite(skillDir);
  } finally {
    process.stderr.write = originalWrite;
  }

  assert.equal(code, 1, stderr);
  assert.match(stderr, /git call timed out/);
  assert.match(stderr, /check-ignore/);
  assert.deepEqual(fs.readFileSync(manifestPath), committed);
});
