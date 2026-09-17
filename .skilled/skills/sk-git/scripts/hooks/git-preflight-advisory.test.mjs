// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Git Preflight Advisory Hook Payload Tests                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify the shared hook advises across every runtime payload.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// The rule engine is covered by git-rule-checks.test.mjs. This suite covers the layer above it:
// the payload dispatch inside the hook itself, which decides whether a runtime's tool event even
// reaches the rule engine. A runtime whose tool label or project-directory field the hook does not
// recognise is silently approved — an advisory that never fires reads exactly like a clean command,
// so the gap is invisible without an end-to-end spawn. Cursor delivers its shell surface as tool_name
// "Shell" and its project root in workspace_roots[0], a shape neither Claude ("Bash"/cwd) nor Codex
// ("exec"/cwd) use; before this coverage that shape was dropped at the gate for every Cursor command.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST SETUP
// ─────────────────────────────────────────────────────────────────────────────

const HERE = path.dirname(new URL(import.meta.url).pathname);
const HOOK = path.join(HERE, 'git-preflight-advisory.mjs');
const REAL_SKILL_MD = path.resolve(HERE, '../../SKILL.md');

// git resolves its repository and config from these variables IN PREFERENCE to the working
// directory. Left set by a parent launched inside a worktree, a bare temp `cwd` would no longer
// isolate a throwaway repo. Strip the redirectors so isolation rests only on the temp path we own.
const GIT_ENV_REDIRECTORS = [
  'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE',
  'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_CONFIG', 'GIT_CONFIG_GLOBAL', 'GIT_CONFIG_SYSTEM', 'GIT_CONFIG_COUNT',
  'GIT_NAMESPACE', 'GIT_CEILING_DIRECTORIES',
];

// The hook falls back to these when a payload carries no project directory. A stray value in the
// parent environment would let a "no project dir" payload silently resolve to the real repo, so
// they are cleared for every spawn and the test supplies the directory explicitly.
const PROJECT_DIR_ENV = ['CLAUDE_PROJECT_DIR', 'CODEX_PROJECT_DIR'];

function cleanEnv() {
  const env = { ...process.env };
  for (const key of [...GIT_ENV_REDIRECTORS, ...PROJECT_DIR_ENV]) delete env[key];
  return env;
}

function git(repo, ...args) {
  return execFileSync('git', args, {
    cwd: repo,
    env: cleanEnv(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

/**
 * A throwaway repository whose `src/` scope holds a modified tracked file next to an untracked one.
 * `git commit --only src -m x` there is the canonical silent-drop case, so the advisory must fire.
 * The real sk-git SKILL.md is copied under the repo so the hook loads the same hard_rules it ships.
 */
function makeViolatingRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-advisory-hook-'));
  git(dir, 'init', '-q');
  git(dir, 'config', 'core.hooksPath', path.join(dir, '.no-hooks'));
  git(dir, 'config', 'user.email', 'test@example.invalid');
  git(dir, 'config', 'user.name', 'Test');
  git(dir, 'config', 'commit.gpgsign', 'false');
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src', 'tracked.txt'), 'a\n');
  git(dir, 'add', 'src/tracked.txt');
  git(dir, 'commit', '-q', '-m', 'seed');
  fs.writeFileSync(path.join(dir, 'src', 'tracked.txt'), 'b\n');
  fs.writeFileSync(path.join(dir, 'src', 'untracked.txt'), 'never committed\n');

  const skillDir = path.join(dir, '.opencode', 'skills', 'sk-git');
  fs.mkdirSync(skillDir, { recursive: true });
  fs.copyFileSync(REAL_SKILL_MD, path.join(skillDir, 'SKILL.md'));
  return dir;
}

const cleanup = [];
const violatingRepo = () => { const d = makeViolatingRepo(); cleanup.push(d); return d; };
process.on('exit', () => cleanup.forEach((d) => fs.rmSync(d, { recursive: true, force: true })));

/** Spawn the hook exactly as a runtime does: JSON payload on stdin, advisory (if any) on stdout. */
function runHook(payload) {
  return execFileSync('node', [HOOK], {
    input: JSON.stringify(payload),
    env: cleanEnv(),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
}

const SCOPED_DROP = 'git commit --only src -m x';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CURSOR SHELL PAYLOAD — THE GAP THIS SUITE EXISTS FOR
// ─────────────────────────────────────────────────────────────────────────────

test('a Cursor Shell payload with workspace_roots reaches the advisory', () => {
  const dir = violatingRepo();
  // No `cwd` on this payload: the project root travels only in workspace_roots[0], the shape
  // that was dropped before the hook learned Cursor. If the fix regressed, stdout would be empty.
  const out = runHook({
    tool_name: 'Shell',
    tool_input: { command: SCOPED_DROP },
    workspace_roots: [dir],
  });
  assert.match(out, /sk-git advisory/, 'Cursor Shell command must be advised');
  assert.match(out, /commit-scope-drops-untracked/, 'the scoped-drop rule must be the one shown');
});

test('a whitespace-only Cursor workspace root falls through instead of resolving a bogus dir', () => {
  const dir = violatingRepo();
  // A blank root must be treated as absent; cwd then carries the real project directory. This
  // guards the trim() branch so a pathological payload cannot resolve rules from "   ".
  const out = runHook({
    tool_name: 'Shell',
    tool_input: { command: SCOPED_DROP },
    workspace_roots: ['   '],
    cwd: dir,
  });
  assert.match(out, /sk-git advisory/, 'a blank workspace root must fall back to cwd, not silence the hook');
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXISTING RUNTIMES STILL ADVISE — NO REGRESSION
// ─────────────────────────────────────────────────────────────────────────────

test('a Claude Bash payload still reaches the advisory', () => {
  const dir = violatingRepo();
  const out = runHook({ tool_name: 'Bash', tool_input: { command: SCOPED_DROP }, cwd: dir });
  assert.match(out, /sk-git advisory/, 'Bash parity must be preserved');
});

test('a Codex exec payload still reaches the advisory', () => {
  const dir = violatingRepo();
  const out = runHook({ tool_name: 'exec', tool_input: { command: SCOPED_DROP }, cwd: dir });
  assert.match(out, /sk-git advisory/, 'exec parity must be preserved');
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. SILENCE WHERE IT BELONGS — NO NEW FALSE POSITIVES
// ─────────────────────────────────────────────────────────────────────────────

test('a Cursor Shell non-git command stays silent', () => {
  const dir = violatingRepo();
  const out = runHook({
    tool_name: 'Shell',
    tool_input: { command: 'ls -la src' },
    workspace_roots: [dir],
  });
  assert.equal(out, '', 'a non-git command must never advise');
});

test('an unrecognised tool_name stays silent', () => {
  const dir = violatingRepo();
  const out = runHook({
    tool_name: 'Read',
    tool_input: { command: SCOPED_DROP },
    workspace_roots: [dir],
  });
  assert.equal(out, '', 'a non-shell tool surface must never advise');
});

test('a Cursor Shell git command outside a repository stays silent', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-advisory-norepo-'));
  cleanup.push(dir);
  // workspace_roots points at a real directory that is not a git repo. Resolving the project dir
  // from workspace_roots and finding no repo must fail open, proving the resolution ran.
  const out = runHook({
    tool_name: 'Shell',
    tool_input: { command: SCOPED_DROP },
    workspace_roots: [dir],
  });
  assert.equal(out, '', 'no repository at the resolved root must fail open');
});
