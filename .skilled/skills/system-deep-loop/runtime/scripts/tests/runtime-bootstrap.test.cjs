'use strict';

// Guards the process-boot helpers that keep the deep-loop tsx re-exec working
// when the loader sits behind a spaced path, and the containment repo-root
// override. A regression here reintroduces the ERR_MODULE_NOT_FOUND on
// loop-lock.js that stalls every executor at iteration 1.

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const os = require('node:os');

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

// Auto-detection: when the artifact tree symlinks into a different worktree,
// containment must scope against the worktree that physically holds the writes.
// A fake gitToplevel maps a realpath'd dir to whichever fixture root contains it.
function withSymlinkFixture(run) {
  const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'bootstrap-scope-')));
  const cwd = path.join(base, 'cwd-worktree');
  const realRepo = path.join(base, 'real-worktree');
  const realLineage = path.join(realRepo, 'specs', 'foo', 'lineage');
  fs.mkdirSync(cwd, { recursive: true });
  fs.mkdirSync(realLineage, { recursive: true });
  // cwd/link-lineage -> realRepo/specs/foo/lineage (the symlinked spec tree).
  const linkLineage = path.join(cwd, 'link-lineage');
  fs.symlinkSync(realLineage, linkLineage);
  const gitToplevel = (dir) => {
    const real = fs.realpathSync(dir);
    if (real === realRepo || real.startsWith(realRepo + path.sep)) return realRepo;
    if (real === cwd || real.startsWith(cwd + path.sep)) return cwd;
    return '';
  };
  try {
    run({ cwd, realRepo, realLineage, linkLineage, gitToplevel });
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
}

test('resolveContainmentRepoRoot redirects to the worktree that physically holds a symlinked artifact', () => {
  withSymlinkFixture(({ cwd, realRepo, linkLineage, gitToplevel }) => {
    const root = resolveContainmentRepoRoot({}, cwd, { artifactDir: linkLineage, gitToplevel });
    assert.equal(root, realRepo, 'must scope against the artifact\'s real worktree, not cwd');
  });
});

test('resolveContainmentRepoRoot stays at cwd when the artifact is inside cwd\'s worktree', () => {
  withSymlinkFixture(({ cwd, gitToplevel }) => {
    const localArtifact = path.join(cwd, 'local-lineage');
    fs.mkdirSync(localArtifact, { recursive: true });
    const root = resolveContainmentRepoRoot({}, cwd, { artifactDir: localArtifact, gitToplevel });
    assert.equal(root, cwd, 'the normal in-worktree case must be unchanged');
  });
});

test('resolveContainmentRepoRoot stays at cwd when the symlinked artifact is in no worktree', () => {
  withSymlinkFixture(({ cwd }) => {
    // A gitToplevel that never finds a worktree for the artifact side.
    const gitToplevel = (dir) => (fs.realpathSync(dir) === cwd ? cwd : '');
    const orphan = path.join(cwd, 'link-lineage');
    const root = resolveContainmentRepoRoot({}, cwd, { artifactDir: orphan, gitToplevel });
    assert.equal(root, cwd, 'never widen scope to a non-worktree location');
  });
});

test('the explicit override wins over auto-detection', () => {
  withSymlinkFixture(({ cwd, linkLineage, gitToplevel }) => {
    const root = resolveContainmentRepoRoot(
      { DEEP_LOOP_REPO_ROOT: '/pinned/root' },
      cwd,
      { artifactDir: linkLineage, gitToplevel },
    );
    assert.equal(root, path.resolve('/pinned/root'));
  });
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
