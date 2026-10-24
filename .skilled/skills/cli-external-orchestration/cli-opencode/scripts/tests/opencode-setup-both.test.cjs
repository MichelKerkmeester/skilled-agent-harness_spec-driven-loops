#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Setup Side-by-Side Layout Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The helper derives every path from HOME, so each test builds a throwaway HOME
// that already holds both pinned packages. The installs are then skipped and
// only the name wiring runs: opencode and opencode2 must answer with v2, and the
// opencode1 launcher must run v1 against its own database.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'opencode-setup.sh');
const SOURCE = fs.readFileSync(SCRIPT, 'utf8');
const V1_VERSION = SOURCE.match(/readonly V1_PKG="opencode-ai@([^"]+)"/)[1];
const V2_VERSION = SOURCE.match(/readonly V2_PKG="@opencode\/cli@([^"]+)"/)[1];
const V2_LINK_TARGET = '../opencode-v2/lib/node_modules/@opencode/cli/bin/opencode.exe';

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function writeExecutable(file, body) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, { mode: 0o755 });
}

// The fake v1 binary echoes OPENCODE_DB for any non-version call, so the launcher's database choice is observable
function buildEarlierLayout() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-setup-both-'));
  const local = path.join(home, '.local');
  const bin = path.join(local, 'bin');

  const v1Pkg = path.join(local, 'lib', 'node_modules', 'opencode-ai');
  fs.mkdirSync(v1Pkg, { recursive: true });
  fs.writeFileSync(path.join(v1Pkg, 'package.json'), JSON.stringify({ version: V1_VERSION }));
  writeExecutable(
    path.join(v1Pkg, 'bin', 'opencode.exe'),
    `#!/bin/sh\nif [ "$1" = "--version" ]; then echo ${V1_VERSION}; else echo "db=$OPENCODE_DB"; fi\n`,
  );

  const v2Pkg = path.join(local, 'opencode-v2', 'lib', 'node_modules', '@opencode', 'cli');
  fs.mkdirSync(v2Pkg, { recursive: true });
  fs.writeFileSync(path.join(v2Pkg, 'package.json'), JSON.stringify({ version: V2_VERSION }));
  writeExecutable(path.join(v2Pkg, 'bin', 'opencode.exe'), `#!/bin/sh\necho "opencode v${V2_VERSION}"\n`);
  fs.mkdirSync(path.join(local, 'opencode-v2', 'bin'), { recursive: true });
  fs.symlinkSync(
    '../lib/node_modules/@opencode/cli/bin/opencode.exe',
    path.join(local, 'opencode-v2', 'bin', 'opencode2'),
  );

  // The layout this mode replaces: opencode is v1 and opencode2 is a launcher file
  fs.mkdirSync(bin, { recursive: true });
  fs.symlinkSync('../lib/node_modules/opencode-ai/bin/opencode.exe', path.join(bin, 'opencode'));
  writeExecutable(path.join(bin, 'opencode2'), '#!/bin/sh\nexit 0\n');

  return { home, bin };
}

function runHelper(home, bin, mode) {
  return spawnSync('bash', [SCRIPT, mode], {
    encoding: 'utf8',
    env: { HOME: home, PATH: `${bin}:${process.env.PATH}`, TMPDIR: os.tmpdir() },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('both gives opencode and opencode2 to v2 and opencode1 to v1 on its own database', (t) => {
  const { home, bin } = buildEarlierLayout();
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));

  const result = runHelper(home, bin, 'both');
  assert.equal(result.status, 0, result.stderr);

  for (const name of ['opencode', 'opencode2']) {
    assert.equal(fs.readlinkSync(path.join(bin, name)), V2_LINK_TARGET, name);
  }
  assert.ok(fs.existsSync(path.join(bin, 'opencode2.pre-v2-default')), 'the earlier launcher is kept aside');

  const launched = spawnSync(path.join(bin, 'opencode1'), ['run'], { encoding: 'utf8', env: { HOME: home } });
  assert.equal(launched.stdout, 'db=opencode-v1.db\n');

  const rerun = runHelper(home, bin, 'both');
  assert.equal(rerun.status, 0, rerun.stderr);
  assert.match(rerun.stdout, /opencode2: left unchanged/);
  assert.match(rerun.stdout, /launcher: left unchanged/);
});

test('both refuses to move a file aside onto an earlier aside copy', (t) => {
  const { home, bin } = buildEarlierLayout();
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  fs.writeFileSync(path.join(bin, 'opencode2.pre-v2-default'), 'kept\n');

  const result = runHelper(home, bin, 'both');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /already exists/);
  assert.equal(fs.readFileSync(path.join(bin, 'opencode2'), 'utf8'), '#!/bin/sh\nexit 0\n');
  assert.equal(fs.readFileSync(path.join(bin, 'opencode2.pre-v2-default'), 'utf8'), 'kept\n');
});
