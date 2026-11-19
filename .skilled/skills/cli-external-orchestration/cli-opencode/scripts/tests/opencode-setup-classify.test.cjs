#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Setup Classifier Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The setup helper's classifier is a shell function inside a larger script, so
// the test extracts it and runs it against the shared corpus. The remove-v1
// refusal runs the whole helper against a throwaway HOME with a fake npm first
// on PATH, so nothing installs and the real HOME is never touched.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'opencode-setup.sh');
const CORPUS = path.resolve(
  __dirname, '..', '..', '..', '..', '..',
  'hooks', 'cli-dispatch', 'lib', 'opencode-version-corpus.json',
);
const CORPUS_ENTRIES = JSON.parse(fs.readFileSync(CORPUS, 'utf8'));
const CLASSIFY_VERSION = execFileSync(
  'sed', ['-n', '/^classify_version()/,/^}/p', SCRIPT], { encoding: 'utf8' },
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function shellQuote(value) {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('the setup helper defines classify_version', () => {
  assert.match(CLASSIFY_VERSION, /^classify_version\(\) \{/m);
});

test('classify_version reads every shared corpus entry', () => {
  assert.ok(CORPUS_ENTRIES.length >= 12);
  for (const { output, family } of CORPUS_ENTRIES) {
    const script = `${CLASSIFY_VERSION}\nset -euo pipefail\nprintf '%s' ${shellQuote(output)} | classify_version`;
    const result = spawnSync('bash', ['-c', script], { encoding: 'utf8' });
    assert.equal(result.status, 0, `${JSON.stringify(output)}: ${result.stderr}`);
    assert.equal(result.stdout, `${family}\n`, JSON.stringify(output));
  }
});

test('remove-v1 refuses a launcher that is not the file the helper wrote and runs nothing', (t) => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-setup-remove-v1-'));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  const bin = path.join(home, '.local', 'bin');
  const fakeBin = path.join(home, 'fake-bin');
  const marker = path.join(home, 'npm-ran');
  fs.mkdirSync(bin, { recursive: true });
  fs.mkdirSync(fakeBin, { recursive: true });
  fs.writeFileSync(path.join(fakeBin, 'npm'), `#!/bin/sh\ntouch ${shellQuote(marker)}\n`, { mode: 0o755 });

  const pkg = path.join(home, '.local', 'lib', 'node_modules', 'opencode-ai');
  fs.mkdirSync(pkg, { recursive: true });
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({ version: '1.19.4' }));

  const foreign = path.join(home, 'elsewhere', 'opencode1');
  fs.mkdirSync(path.dirname(foreign), { recursive: true });
  fs.writeFileSync(foreign, '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  const launcher = path.join(bin, 'opencode1');

  const run = () => spawnSync('bash', [SCRIPT, 'remove-v1'], {
    encoding: 'utf8',
    env: { HOME: home, PATH: `${fakeBin}:${process.env.PATH}`, TMPDIR: os.tmpdir() },
  });

  // A link at the launcher path points at someone else's file.
  fs.symlinkSync(foreign, launcher);
  const linked = run();
  assert.equal(linked.status, 1, linked.stdout + linked.stderr);
  assert.match(linked.stderr, /is a symlink/);
  assert.equal(fs.lstatSync(launcher).isSymbolicLink(), true);
  assert.equal(fs.existsSync(foreign), true);

  // A regular file there that does not run the OpenCode 1 package is not the helper's launcher.
  fs.rmSync(launcher);
  fs.writeFileSync(launcher, '#!/bin/sh\nexec /usr/local/bin/something-else "$@"\n', { mode: 0o755 });
  const foreignFile = run();
  assert.equal(foreignFile.status, 1, foreignFile.stdout + foreignFile.stderr);
  assert.match(foreignFile.stderr, /is not the OpenCode 1 launcher/);
  assert.equal(fs.existsSync(launcher), true);

  assert.equal(fs.existsSync(marker), false, 'npm ran before the refusal');
  assert.equal(fs.existsSync(path.join(pkg, 'package.json')), true);
});

// Builds the old side-by-side layout: opencode-ai and its launcher in the default
// prefix, plus a fake npm that deletes $BIN/opencode by bin name on uninstall the
// way npm's arborist does, without checking where the link points.
function oldLayout(t) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-setup-preserve-'));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  const bin = path.join(home, '.local', 'bin');
  const fakeBin = path.join(home, 'fake-bin');
  const pkg = path.join(home, '.local', 'lib', 'node_modules', 'opencode-ai');
  fs.mkdirSync(bin, { recursive: true });
  fs.mkdirSync(fakeBin, { recursive: true });
  fs.mkdirSync(path.join(pkg, 'bin'), { recursive: true });
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({ version: '1.19.4' }));
  fs.writeFileSync(path.join(pkg, 'bin', 'opencode'), '#!/bin/sh\necho 1.19.4\n', { mode: 0o755 });
  fs.writeFileSync(
    path.join(fakeBin, 'npm'),
    '#!/bin/sh\nif [ "$1" = uninstall ]; then rm -rf "$HOME/.local/bin/opencode" "$HOME/.local/lib/node_modules/opencode-ai"; fi\n',
    { mode: 0o755 },
  );
  const launcher = path.join(bin, 'opencode1');
  fs.writeFileSync(
    launcher,
    '#!/bin/sh\nexec "$HOME/.local/lib/node_modules/opencode-ai/bin/opencode" "$@"\n',
    { mode: 0o755 },
  );
  const run = () => spawnSync('bash', [SCRIPT, 'remove-v1'], {
    encoding: 'utf8',
    env: { HOME: home, PATH: `${fakeBin}:${process.env.PATH}`, TMPDIR: os.tmpdir() },
  });
  return { home, bin, pkg, launcher, run };
}

test('remove-v1 keeps an opencode link that points into a separate v2 prefix', (t) => {
  const { home, bin, pkg, launcher, run } = oldLayout(t);
  const v2Bin = path.join(home, '.local', 'opencode-v2', 'lib', 'node_modules', '@opencode', 'cli', 'bin');
  fs.mkdirSync(v2Bin, { recursive: true });
  fs.writeFileSync(path.join(v2Bin, 'opencode.exe'), '#!/bin/sh\necho 2.3.2\n', { mode: 0o755 });
  const link = path.join(bin, 'opencode');
  const target = '../opencode-v2/lib/node_modules/@opencode/cli/bin/opencode.exe';
  fs.symlinkSync(target, link);
  const before = fs.realpathSync(link);

  const result = run();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(fs.lstatSync(link).isSymbolicLink(), true, 'the v2 link is gone');
  assert.equal(fs.readlinkSync(link), target);
  assert.equal(fs.realpathSync(link), before);
  assert.equal(fs.existsSync(launcher), false);
  assert.equal(fs.existsSync(pkg), false);
  assert.deepEqual(fs.readdirSync(bin), ['opencode']);
  assert.match(result.stdout, /\[step\] preserve /);
  assert.match(result.stdout, /opencode: restored /);
  // The uninstall's rollback must hand opencode back to OpenCode 2, never leave it on the old package.
  assert.match(result.stdout, /opencode-ai@1\.19\.4", then restore the OpenCode 2 link: ln -sfn '\.\.\/opencode-v2\//);
});

test('remove-v1 lets an opencode link into opencode-ai go with the package', (t) => {
  const { bin, pkg, launcher, run } = oldLayout(t);
  const link = path.join(bin, 'opencode');
  fs.symlinkSync('../lib/node_modules/opencode-ai/bin/opencode', link);

  const result = run();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.deepEqual(fs.readdirSync(bin), []);
  assert.equal(fs.existsSync(launcher), false);
  assert.equal(fs.existsSync(pkg), false);
  assert.match(result.stdout, /no OpenCode 2 there/);
});
