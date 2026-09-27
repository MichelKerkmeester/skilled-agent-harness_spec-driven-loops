#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ install-codex-hooks-source-root.test — One owned hook under either root  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { describe, test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const INSTALLER_PATH = path.resolve(__dirname, '..', 'install-codex-hooks.mjs');
const PROJECT_ANCHOR = '${CODEX_PROJECT_DIR:-$PWD}';
const THIRD_PARTY_COMMAND = 'node /opt/third-party/hooks/notify.js';
const SOURCE_ROOT_NAMES = ['.opencode', '.skilled'];

// Git reads GIT_DIR and its siblings before any path argument, so a run started from a git
// hook would aim git init and the installer's checkout probe at the enclosing repository.
const GIT_FREE_ENV = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_')));

// A checkout holds the tree under .opencode, under .skilled, or under .skilled with
// .opencode linked to it. The orphan rows read the adapter from disk, so each layout
// changes which spellings exist.
const LAYOUTS = [
  { name: 'today', realRoot: '.opencode', linked: false },
  { name: 'skilled-only', realRoot: '.skilled', linked: false },
  { name: 'whole-link', realRoot: '.skilled', linked: true },
];

function hookCommand(sourceRootName, adapter = 'probe-hook.js') {
  return 'bash -c \'cd "' + PROJECT_ANCHOR + '" && node ' + sourceRootName + '/hooks/' + adapter + '\'';
}

function writeHooks(filePath, groups) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify({ hooks: { SessionStart: groups } }, null, 2)}\n`);
}

// Every path sits in a temp directory and HOME points there too, so no run can reach
// the machine's own Codex hook file.
function buildFixture(layout, installedName, sourceName) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'codex-hooks-source-root-')));
  const repo = path.join(root, 'repo');
  const adapterDirectory = path.join(repo, layout.realRoot, 'hooks');
  fs.mkdirSync(adapterDirectory, { recursive: true });
  fs.writeFileSync(path.join(adapterDirectory, 'probe-hook.js'), '');
  if (layout.linked) fs.symlinkSync('.skilled', path.join(repo, '.opencode'));
  execFileSync('git', ['init', '-q', repo], { stdio: 'ignore', env: GIT_FREE_ENV });

  const sourcePath = path.join(repo, '.codex', 'hooks.json');
  const targetPath = path.join(root, 'home', '.codex', 'hooks.json');
  writeHooks(sourcePath, [{ hooks: [{ type: 'command', command: hookCommand(sourceName), timeout: 3 }] }]);
  writeHooks(targetPath, [
    { hooks: [{ type: 'command', command: hookCommand(installedName).replaceAll(PROJECT_ANCHOR, repo), timeout: 3 }] },
    { hooks: [{ type: 'command', command: THIRD_PARTY_COMMAND, timeout: 3 }] },
  ]);
  return { root, repo, sourcePath, targetPath };
}

function runInstaller(fixture, extraArguments) {
  return spawnSync(
    process.execPath,
    [INSTALLER_PATH, '--repo', fixture.repo, '--source', fixture.sourcePath, '--target', fixture.targetPath, ...extraArguments],
    { encoding: 'utf8', env: { ...GIT_FREE_ENV, HOME: path.join(fixture.root, 'home') } },
  );
}

function installedCommands(targetPath) {
  const document = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  return (document.hooks.SessionStart || []).flatMap((group) => (group.hooks || []).map((hook) => hook.command));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RECONCILIATION ACROSS SPELLINGS AND LAYOUTS
// ─────────────────────────────────────────────────────────────────────────────

// An installed entry is the project's own hook under either spelling. Rows that spell
// both sides alike are controls; the mixed rows are the ones an exact-path ownership
// check misses, leaving the second registration in place.
describe('install-codex-hooks removes an owned hook spelled under either source-root name', () => {
  for (const layout of LAYOUTS) {
    for (const installedName of SOURCE_ROOT_NAMES) {
      for (const sourceName of SOURCE_ROOT_NAMES) {
        test(`${layout.name}: installed under ${installedName}, source under ${sourceName}`, () => {
          const fixture = buildFixture(layout, installedName, sourceName);
          try {
            const before = runInstaller(fixture, ['--check']);
            assert.equal(before.status, 1, before.stdout);
            assert.match(before.stderr, /install-codex-hooks: DRIFT .*\(duplicate=1\)/);

            const install = runInstaller(fixture, []);
            assert.equal(install.status, 0, install.stderr);
            assert.deepEqual(JSON.parse(install.stdout).removed, [`SessionStart:${installedName}/hooks/probe-hook.js`]);
            assert.deepEqual(installedCommands(fixture.targetPath), [THIRD_PARTY_COMMAND]);

            const check = runInstaller(fixture, ['--check']);
            assert.equal(check.status, 0, check.stderr);
            assert.match(check.stdout, /install-codex-hooks: OK/);
          } finally {
            fs.rmSync(fixture.root, { recursive: true, force: true });
          }
        });
      }
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. ORPHANS UNDER EITHER NAME
// ─────────────────────────────────────────────────────────────────────────────

// An installed entry under either name whose adapter is gone from disk and absent from the
// source is ours, so an install removes it. Its label keeps the spelling it was installed with.
describe('install-codex-hooks removes an orphaned hook spelled under either source-root name', () => {
  for (const layout of LAYOUTS) {
    for (const orphanName of SOURCE_ROOT_NAMES) {
      test(`${layout.name}: orphan installed under ${orphanName}`, () => {
        const fixture = buildFixture(layout, layout.realRoot, layout.realRoot);
        try {
          const target = JSON.parse(fs.readFileSync(fixture.targetPath, 'utf8'));
          const orphanCommand = hookCommand(orphanName, 'retired-hook.js').replaceAll(PROJECT_ANCHOR, fixture.repo);
          target.hooks.SessionStart.push({ hooks: [{ type: 'command', command: orphanCommand, timeout: 3 }] });
          fs.writeFileSync(fixture.targetPath, `${JSON.stringify(target, null, 2)}\n`);

          const install = runInstaller(fixture, []);
          assert.equal(install.status, 0, install.stderr);
          assert.deepEqual(JSON.parse(install.stdout).orphaned, [`SessionStart:${orphanName}/hooks/retired-hook.js`]);

          const commands = installedCommands(fixture.targetPath);
          assert.equal(commands.includes(orphanCommand), false);
          assert.equal(commands.filter((command) => command === THIRD_PARTY_COMMAND).length, 1);
        } finally {
          fs.rmSync(fixture.root, { recursive: true, force: true });
        }
      });
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. A USER-GLOBAL FILE WITHOUT REPO-OWNED ENTRIES
// ─────────────────────────────────────────────────────────────────────────────

// The project file is the registration Codex runs, so a user-global file holding only
// other tools' hooks is in sync and must never be rewritten or backed up.
describe('install-codex-hooks leaves a user-global file without repo-owned entries alone', () => {
  test('third-party entries only: the check passes and an install writes nothing', () => {
    const fixture = buildFixture(LAYOUTS[1], '.skilled', '.skilled');
    try {
      writeHooks(fixture.targetPath, [{ hooks: [{ type: 'command', command: THIRD_PARTY_COMMAND, timeout: 3 }] }]);
      const before = fs.readFileSync(fixture.targetPath, 'utf8');

      const check = runInstaller(fixture, ['--check']);
      assert.equal(check.status, 0, check.stderr);
      assert.match(check.stdout, /install-codex-hooks: OK/);

      const install = runInstaller(fixture, []);
      assert.equal(install.status, 0, install.stderr);
      assert.equal(JSON.parse(install.stdout).changed, false);
      assert.equal(fs.readFileSync(fixture.targetPath, 'utf8'), before);
      assert.deepEqual(
        fs.readdirSync(path.dirname(fixture.targetPath)).filter((name) => name.includes('.bak-')),
        [],
      );
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  });
});
