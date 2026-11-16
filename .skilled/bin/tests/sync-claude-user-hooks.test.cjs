#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ sync-claude-user-hooks.test — The user-level copy follows the project     ║
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
const { test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const SCRIPT = path.resolve(__dirname, '..', 'sync-claude-user-hooks.mjs');
const ENABLE = 'SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED';

// Git reads GIT_DIR and its siblings before any path argument, so a run started from a
// git hook would aim the fixture's git calls at the enclosing repository.
const BASE_ENV = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_') && !name.startsWith('SYSTEM_')),
);

function guarded(script) {
  return `bash -c 'cd "\${CLAUDE_PROJECT_DIR:-$PWD}" && { [ -e .skilled/hooks ] || exit 0; } && node ${script}'`;
}

const PROJECT_HOOKS = {
  PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: guarded('.skilled/hooks/a/claude/guard.mjs'), timeout: 5 }] }],
  SessionStart: [{ hooks: [{ type: 'command', command: guarded('.skilled/bin/start.mjs'), timeout: 5 }] }],
};
const THIRD_PARTY = { type: 'command', command: 'node /opt/orca/notify.js', timeout: 3 };

function makeTemp(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function git(cwd, ...args) {
  execFileSync('git', ['-C', cwd, ...args], { env: BASE_ENV, stdio: 'pipe' });
}

// A primary checkout holding a project settings file, committed so a worktree can be added.
function makeRepo(t, hooks = PROJECT_HOOKS) {
  const repo = makeTemp(t, 'claude-user-hooks-repo-');
  fs.mkdirSync(path.join(repo, '.claude'));
  fs.writeFileSync(path.join(repo, '.claude', 'settings.json'), JSON.stringify({ model: 'project-only', hooks }, null, 2));
  git(repo, 'init', '-q');
  git(repo, '-c', 'user.email=t@example.invalid', '-c', 'user.name=t', 'add', '.');
  git(repo, '-c', 'user.email=t@example.invalid', '-c', 'user.name=t', 'commit', '-qm', 'fixture');
  return repo;
}

function writeTarget(t, settings) {
  const target = path.join(makeTemp(t, 'claude-user-hooks-home-'), 'settings.json');
  if (settings !== undefined) fs.writeFileSync(target, typeof settings === 'string' ? settings : JSON.stringify(settings, null, 2));
  return target;
}

function run(repo, target, args = [], extraEnv = {}) {
  return spawnSync(process.execPath, [SCRIPT, '--repo', repo, '--target', target, ...args], {
    encoding: 'utf8',
    env: { ...BASE_ENV, HOOK_FLAGS_CONFIG: path.join(os.tmpdir(), 'no-such-hook-flags.env'), ...extraEnv },
  });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('a session start with the switch unset writes nothing and prints nothing', (t) => {
  const repo = makeRepo(t);
  const target = writeTarget(t, { theme: 'dark' });
  const before = fs.readFileSync(target, 'utf8');
  const result = run(repo, target, ['--session-start']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(fs.readFileSync(target, 'utf8'), before);
});

test('a session start with the switch on replaces owned hooks and keeps everything else', (t) => {
  const repo = makeRepo(t);
  const stale = { type: 'command', command: guarded('.skilled/hooks/old-name/claude/guard.mjs'), timeout: 5 };
  const target = writeTarget(t, {
    theme: 'dark',
    hooks: {
      PreToolUse: [
        { matcher: 'Bash', hooks: [stale, THIRD_PARTY] },
        { matcher: '*', hooks: [THIRD_PARTY] },
      ],
    },
  });

  const result = run(repo, target, ['--session-start'], { [ENABLE]: '1' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');

  const synced = readJson(target);
  assert.equal(synced.theme, 'dark');
  assert.equal(synced.model, undefined, 'only the hooks block is copied');
  assert.deepEqual(synced.hooks.PreToolUse, [
    { matcher: 'Bash', hooks: [THIRD_PARTY] },
    { matcher: '*', hooks: [THIRD_PARTY] },
    ...PROJECT_HOOKS.PreToolUse,
  ]);
  assert.deepEqual(synced.hooks.SessionStart, PROJECT_HOOKS.SessionStart);
  assert.ok(fs.existsSync(`${target}.pre-skilled-hook-sync`), 'the first write keeps a backup');
});

test('a second run changes nothing and writes no new backup', (t) => {
  const repo = makeRepo(t);
  const target = writeTarget(t, { theme: 'dark' });
  assert.equal(run(repo, target, ['--session-start'], { [ENABLE]: '1' }).status, 0);
  fs.rmSync(`${target}.pre-skilled-hook-sync`);
  const synced = fs.readFileSync(target, 'utf8');

  assert.equal(run(repo, target, ['--session-start'], { [ENABLE]: '1' }).status, 0);
  assert.equal(fs.readFileSync(target, 'utf8'), synced);
  assert.equal(fs.existsSync(`${target}.pre-skilled-hook-sync`), false);
  assert.equal(run(repo, target, ['--check']).status, 0);
});

test('a later sync keeps the backup of the hand-made file', (t) => {
  const repo = makeRepo(t);
  const target = writeTarget(t, { theme: 'hand-made' });
  const handMade = fs.readFileSync(target, 'utf8');
  assert.equal(run(repo, target, ['--session-start'], { [ENABLE]: '1' }).status, 0);

  const projectFile = path.join(repo, '.claude', 'settings.json');
  fs.writeFileSync(projectFile, JSON.stringify({ hooks: { SessionStart: PROJECT_HOOKS.SessionStart } }, null, 2));
  assert.equal(run(repo, target, ['--session-start'], { [ENABLE]: '1' }).status, 0);

  assert.equal(readJson(target).hooks.PreToolUse, undefined, 'the dropped hook left the copy');
  assert.equal(fs.readFileSync(`${target}.pre-skilled-hook-sync`, 'utf8'), handMade);
});

test('a missing user file is created with the copied hooks', (t) => {
  const repo = makeRepo(t);
  const target = writeTarget(t);
  assert.equal(run(repo, target, ['--session-start'], { [ENABLE]: '1' }).status, 0);
  assert.deepEqual(readJson(target), { hooks: PROJECT_HOOKS });
});

test('a linked worktree syncs nothing at session start and refuses a hand run', (t) => {
  const repo = makeRepo(t);
  const worktree = path.join(makeTemp(t, 'claude-user-hooks-wt-'), 'wt');
  git(repo, 'worktree', 'add', '-q', '--detach', worktree);
  const target = writeTarget(t, { theme: 'dark' });
  const before = fs.readFileSync(target, 'utf8');

  const session = run(worktree, target, ['--session-start'], { [ENABLE]: '1' });
  assert.equal(session.status, 0, session.stderr);
  assert.equal(fs.readFileSync(target, 'utf8'), before);

  const manual = run(worktree, target);
  assert.equal(manual.status, 1);
  assert.match(manual.stderr, /Refusing to anchor hooks at linked worktree/);
  assert.equal(fs.readFileSync(target, 'utf8'), before);
});

test('--check reports drift with exit 1 and writes nothing', (t) => {
  const repo = makeRepo(t);
  const target = writeTarget(t, { theme: 'dark' });
  const before = fs.readFileSync(target, 'utf8');
  const result = run(repo, target, ['--check']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /DRIFT/);
  assert.equal(fs.readFileSync(target, 'utf8'), before);
});

test('a user file that is not a JSON object is left unchanged', (t) => {
  const repo = makeRepo(t);
  const target = writeTarget(t, '[1, 2');
  const result = run(repo, target, ['--session-start'], { [ENABLE]: '1' });
  assert.equal(result.status, 1);
  assert.equal(fs.readFileSync(target, 'utf8'), '[1, 2');
});
