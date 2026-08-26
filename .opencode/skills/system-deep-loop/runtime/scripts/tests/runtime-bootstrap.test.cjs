'use strict';

// Guards the process-boot helpers that keep the deep-loop tsx re-exec working
// when the loader sits behind a spaced path, and the containment repo-root
// override. A regression here reintroduces the ERR_MODULE_NOT_FOUND on
// loop-lock.js that stalls every executor at iteration 1.

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const { tsxChildEnv, resolveContainmentRepoRoot } = require('../runtime-bootstrap.cjs');

const SCRIPTS_DIR = path.join(__dirname, '..');

// The entrypoints that re-exec their TypeScript implementation under tsx. Every
// one must build its child env through tsxChildEnv so the flag is stripped.
const TSX_REEXEC_SCRIPTS = [
  'append-mode-event.cjs',
  'check-direct-append.cjs',
  'convergence.cjs',
  'fanout-merge.cjs',
  'fanout-run.cjs',
  'loop-lock.cjs',
  'query.cjs',
  'status.cjs',
  'upsert.cjs',
  'verify-authority.cjs',
];

test('tsxChildEnv strips NODE_PRESERVE_SYMLINKS even when the parent sets it', () => {
  const previous = process.env.NODE_PRESERVE_SYMLINKS;
  process.env.NODE_PRESERVE_SYMLINKS = '1';
  try {
    const env = tsxChildEnv({ DEEP_LOOP_TSX_LOADED: '1' });
    assert.equal('NODE_PRESERVE_SYMLINKS' in env, false, 'flag must not reach the tsx child');
    assert.equal(env.DEEP_LOOP_TSX_LOADED, '1', 'extra keys must be applied');
    // The parent environment must be left untouched (we copy, not mutate).
    assert.equal(process.env.NODE_PRESERVE_SYMLINKS, '1');
  } finally {
    if (previous === undefined) delete process.env.NODE_PRESERVE_SYMLINKS;
    else process.env.NODE_PRESERVE_SYMLINKS = previous;
  }
});

test('tsxChildEnv preserves unrelated env and tolerates no extra', () => {
  const previous = process.env.DEEP_LOOP_BOOTSTRAP_PROBE;
  process.env.DEEP_LOOP_BOOTSTRAP_PROBE = 'keep-me';
  try {
    const env = tsxChildEnv();
    assert.equal(env.DEEP_LOOP_BOOTSTRAP_PROBE, 'keep-me');
  } finally {
    if (previous === undefined) delete process.env.DEEP_LOOP_BOOTSTRAP_PROBE;
    else process.env.DEEP_LOOP_BOOTSTRAP_PROBE = previous;
  }
});

test('resolveContainmentRepoRoot defaults to cwd and honors a pinned override', () => {
  assert.equal(resolveContainmentRepoRoot({}, '/work/dir'), '/work/dir');
  assert.equal(resolveContainmentRepoRoot({ DEEP_LOOP_REPO_ROOT: '/abs/root' }, '/work/dir'), '/abs/root');
  // A relative override is resolved against the process cwd, not left relative.
  assert.equal(
    resolveContainmentRepoRoot({ DEEP_LOOP_REPO_ROOT: 'rel/root' }, '/work/dir'),
    path.resolve('rel/root'),
  );
});

test('resolveContainmentRepoRoot ignores a blank or whitespace override', () => {
  assert.equal(resolveContainmentRepoRoot({ DEEP_LOOP_REPO_ROOT: '' }, '/work/dir'), '/work/dir');
  assert.equal(resolveContainmentRepoRoot({ DEEP_LOOP_REPO_ROOT: '   ' }, '/work/dir'), '/work/dir');
  assert.equal(resolveContainmentRepoRoot(undefined, '/work/dir'), '/work/dir');
});

test('every tsx re-exec entrypoint routes its child env through tsxChildEnv', () => {
  for (const name of TSX_REEXEC_SCRIPTS) {
    const source = fs.readFileSync(path.join(SCRIPTS_DIR, name), 'utf8');
    assert.match(
      source,
      /tsxChildEnv\(\{ DEEP_LOOP_TSX_LOADED: '1' \}\)/,
      `${name} must build its tsx child env via tsxChildEnv`,
    );
    // No raw inheritance of process.env for the tsx re-exec -- that is the leak.
    assert.equal(
      /env:\s*\{\s*\.\.\.process\.env,\s*DEEP_LOOP_TSX_LOADED: '1'\s*\}/.test(source),
      false,
      `${name} must not inherit the raw parent env for the tsx child`,
    );
  }
});
