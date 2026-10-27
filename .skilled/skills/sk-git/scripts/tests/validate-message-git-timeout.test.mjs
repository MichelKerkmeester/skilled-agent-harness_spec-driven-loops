// ───────────────────────────────────────────────────────────────────
// MODULE: Validator Git Timeout Tests
// ───────────────────────────────────────────────────────────────────
//
// The validator runs inside the commit and push gates, so a git call that never returns would hold
// a gate open with no way out. This suite wedges one call and proves the validator gives up on its
// own: a stub `git` sleeps on `rev-list`, and the run must end in the block path instead of hanging.
//
// The stub replaces git on PATH for the spawned validator only, and it execs the real binary for
// every other subcommand, so repository discovery and contract resolution behave normally.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST SETUP
// ─────────────────────────────────────────────────────────────────────────────

const HERE = path.dirname(new URL(import.meta.url).pathname);
const CLI = path.resolve(HERE, '../validate-message.mjs');

// A parent process launched inside a worktree can export these, and git honours them over `-C`.
// Left set, the throwaway repository below would resolve to the real checkout instead.
const GIT_ENV_REDIRECTORS = [
  'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE',
  'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_CONFIG', 'GIT_CONFIG_GLOBAL', 'GIT_CONFIG_SYSTEM', 'GIT_NAMESPACE',
  'GIT_CEILING_DIRECTORIES',
];

const CLEAN_ENV = { ...process.env };
for (const key of GIT_ENV_REDIRECTORS) delete CLEAN_ENV[key];

const WORK = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-message-timeout-'));

after(() => {
  fs.rmSync(WORK, { recursive: true, force: true });
});

/** Real git, resolved before the stub directory takes its place at the front of PATH. */
const REAL_GIT = execFileSync('sh', ['-c', 'command -v git'], { encoding: 'utf8' }).trim();

function realGit(repo, ...args) {
  return execFileSync(REAL_GIT, ['-c', 'core.fsmonitor=false', '-C', repo, ...args], {
    env: CLEAN_ENV,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

/**
 * A throwaway repository holding one commit and a minimal commit contract: the range mode exits
 * before any git call when the repository declares no rules, so the contract is what makes the
 * rev-list call reachable at all.
 */
function makeRepo() {
  const repo = path.join(WORK, 'repo');
  fs.mkdirSync(repo);
  realGit(repo, 'init', '-q');
  realGit(repo, 'config', 'core.hooksPath', path.join(repo, '.no-hooks'));
  realGit(repo, 'config', 'commit.gpgsign', 'false');
  realGit(repo, 'config', 'user.name', 'Test');
  realGit(repo, 'config', 'user.email', 'test@example.invalid');
  fs.writeFileSync(path.join(repo, 'file.txt'), 'content\n');
  realGit(repo, 'add', 'file.txt');
  realGit(repo, 'commit', '-q', '-m', 'feat(test): seed the range');

  fs.mkdirSync(path.join(repo, '.sk-git'));
  fs.writeFileSync(
    path.join(repo, '.sk-git', 'commit-message-template.md'),
    '## Enforced rules\n\n```json\n{ "kind": "commit", "subject": { "types": ["feat"] } }\n```\n',
  );
  return repo;
}

/**
 * A `git` shim that records every invocation and blocks on `rev-list`. It execs `sleep` so the
 * sleeping process is the one the validator kills; a shell that merely waited on a child would
 * leave that child holding the pipes open past the timeout.
 */
function makeStub() {
  const bin = path.join(WORK, 'bin');
  fs.mkdirSync(bin);
  const script = [
    '#!/bin/sh',
    'printf \'%s\\n\' "$*" >> "$STUB_GIT_LOG"',
    'for arg in "$@"; do',
    '  if [ "$arg" = "rev-list" ]; then',
    '    exec sleep 60',
    '  fi',
    'done',
    'exec "$STUB_REAL_GIT" "$@"',
    '',
  ].join('\n');
  const file = path.join(bin, 'git');
  fs.writeFileSync(file, script, { mode: 0o755 });
  return bin;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. A WEDGED GIT MUST NOT HOLD THE GATE
// ─────────────────────────────────────────────────────────────────────────────

test('a git call that never returns ends the range run as a block', () => {
  const repo = makeRepo();
  const bin = makeStub();
  const log = path.join(WORK, 'git.log');

  const started = Date.now();
  const run = spawnSync(process.execPath, [CLI, '--repo', repo, '--rev-list', 'HEAD'], {
    encoding: 'utf8',
    timeout: 30_000,
    env: {
      ...CLEAN_ENV,
      PATH: `${bin}${path.delimiter}${CLEAN_ENV.PATH}`,
      STUB_GIT_LOG: log,
      STUB_REAL_GIT: REAL_GIT,
    },
  });
  const elapsed = Date.now() - started;

  assert.equal(run.signal, null, 'the validator outlived the test timeout instead of its own');
  assert.equal(run.status, 2, run.stderr);
  assert.match(run.stderr, /BLOCKED: the message validator failed/);
  assert.ok(elapsed < 25_000, `the validator took ${elapsed} ms`);

  const calls = fs.readFileSync(log, 'utf8');
  assert.match(calls, /rev-list/, 'the stub must be the git the validator ran');
});
