// ───────────────────────────────────────────────────────────────────
// MODULE: Write-Containment Guard Unit Tests
// ───────────────────────────────────────────────────────────────────
// Regression coverage for the post-dispatch guard that confines a codex
// leaf's writes to its artifact directory. Exercises snapshot / detect /
// revert / enforce over a real temp git repo so the diff + restore logic
// is verified against actual `git status` porcelain, not a mock.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

import {
  snapshotOutOfScopeDirtyPaths,
  detectNewOutOfScopeViolations,
  revertOutOfScopeViolations,
  enforceWriteContainment,
  buildContainmentViolationEvent,
  classifyViolation,
} from '../../lib/deep-loop/write-containment.js';
import type { DirtyPathEntry } from '../../lib/deep-loop/write-containment';

const tempRoots: string[] = [];

// git resolves its target repo/config from these env vars IN PREFERENCE to cwd/-C. Left in place,
// a poisoned parent env (routine inside a git worktree, which shares one .git/config) redirects a
// fixture's init/config/commit onto the real repository. Strip them so -C is authoritative.
const GIT_ENV_REDIRECTORS = [
  'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE',
  'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_CONFIG', 'GIT_CONFIG_GLOBAL', 'GIT_CONFIG_SYSTEM', 'GIT_CONFIG_COUNT',
  'GIT_NAMESPACE', 'GIT_CEILING_DIRECTORIES',
];
function cleanGitEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  for (const key of GIT_ENV_REDIRECTORS) delete env[key];
  return env;
}

// git commits inside the test must bypass the host's global commit-msg hook.
function git(repoRoot: string, args: string[]): string {
  const result = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-C', repoRoot, ...args], {
    encoding: 'utf8',
    env: cleanGitEnv(),
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed in ${repoRoot}: ${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function makeRepo(): string {
  const root = mkdtempSync(join(tmpdir(), 'write-containment-'));
  tempRoots.push(root);
  git(root, ['init', '-q']);
  git(root, ['config', 'user.email', 'test@local']);
  git(root, ['config', 'user.name', 'test']);
  return root;
}

function commitAll(root: string, message: string): void {
  git(root, ['add', '-A']);
  git(root, ['commit', '-q', '-m', message]);
}

function baselineRepo(): { root: string; artifactDir: string } {
  const root = makeRepo();
  // Tracked files OUTSIDE the artifact dir (the leaf must never touch these).
  writeFileSync(join(root, 'tracked-outside.txt'), 'ORIGINAL_OUTSIDE\n');
  mkdirSync(join(root, 'deep'), { recursive: true });
  writeFileSync(join(root, 'deep/file.txt'), 'ORIGINAL_DEEP\n');
  // Tracked file INSIDE the artifact dir (legitimate leaf write surface).
  const artifactDir = join(root, 'artifact');
  mkdirSync(artifactDir, { recursive: true });
  writeFileSync(join(artifactDir, 'seed.md'), 'seed\n');
  commitAll(root, 'fix(containment): baseline');
  return { root, artifactDir };
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop()!;
    try {
      rmSync(root, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
  }
});

describe('write-containment — snapshotOutOfScopeDirtyPaths', () => {
  it('returns dirty tracked + untracked paths outside the artifact dir', () => {
    const { root, artifactDir } = baselineRepo();
    writeFileSync(join(artifactDir, 'iter.md'), 'iteration\n'); // inside — excluded
    writeFileSync(join(root, 'tracked-outside.txt'), 'CHANGED\n'); // outside — included
    writeFileSync(join(root, 'new-outside.txt'), 'new\n'); // outside untracked — included

    const dirty = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });
    expect(dirtySorted(dirty)).toEqual(['new-outside.txt', 'tracked-outside.txt']);
  });

  it('fails open (returns []) when the artifact dir is outside the git worktree', () => {
    const { root } = baselineRepo();
    const externalArtifact = mkdtempSync(join(tmpdir(), 'external-artifact-'));
    tempRoots.push(externalArtifact);
    writeFileSync(join(root, 'tracked-outside.txt'), 'CHANGED\n');

    const dirty = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir: externalArtifact });
    expect(dirty).toEqual([]);
  });

  it('fails open (returns []) when repoRoot is not a git worktree', () => {
    const notARepo = mkdtempSync(join(tmpdir(), 'not-a-repo-'));
    tempRoots.push(notARepo);
    const dirty = snapshotOutOfScopeDirtyPaths({ repoRoot: notARepo, artifactDir: notARepo });
    expect(dirty).toEqual([]);
  });
});

describe('write-containment — regression case (a): in-artifact write passes', () => {
  it('detects zero violations when the leaf writes only inside the artifact dir', () => {
    const { root, artifactDir } = baselineRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    // Simulate a well-behaved leaf: writes its artifacts strictly inside artifactDir.
    mkdirSync(join(artifactDir, 'iterations'), { recursive: true });
    mkdirSync(join(artifactDir, 'deltas'), { recursive: true });
    writeFileSync(join(artifactDir, 'iterations/iteration-1.md'), 'narrative\n');
    writeFileSync(join(artifactDir, 'deltas/iter-1.jsonl'), '{}\n');
    writeFileSync(join(artifactDir, 'deep-review-state.jsonl'), '{}\n');

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });
    expect(violations).toEqual([]);
  });
});

describe('write-containment — regression case (b): out-of-artifact write is detected, reverted, and fails', () => {
  it('detects a tracked modification outside artifactDir, restores it from HEAD', () => {
    const { root, artifactDir } = baselineRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    // Simulate a misbehaving leaf: edits a tracked file OUTSIDE its artifact dir.
    writeFileSync(join(root, 'tracked-outside.txt'), 'EVIL_OVERWRITE\n');

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });
    expect(violations).toHaveLength(1);
    expect(violations[0].path).toBe('tracked-outside.txt');
    expect(violations[0].kind).toBe('modified');

    const revert = revertOutOfScopeViolations({ repoRoot: root, violations });
    expect(revert.reverted).toHaveLength(1);
    expect(revert.reverted[0].action).toBe('restored_from_head');
    expect(revert.reverted[0].ok).toBe(true);
    // The file is restored to its committed HEAD content.
    expect(readFileSync(join(root, 'tracked-outside.txt'), 'utf8')).toBe('ORIGINAL_OUTSIDE\n');
  });

  it('detects a tracked deletion outside artifactDir and resurrects the file', () => {
    const { root, artifactDir } = baselineRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    // Leaf deletes a tracked file outside its artifact dir.
    unlinkSync(join(root, 'deep/file.txt'));

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });
    expect(violations).toHaveLength(1);
    expect(violations[0].path).toBe('deep/file.txt');
    expect(violations[0].kind).toBe('deleted');

    const revert = revertOutOfScopeViolations({ repoRoot: root, violations });
    expect(revert.reverted[0].ok).toBe(true);
    expect(existsSync(join(root, 'deep/file.txt'))).toBe(true);
    expect(readFileSync(join(root, 'deep/file.txt'), 'utf8')).toBe('ORIGINAL_DEEP\n');
  });

  it('preserves (never deletes) an untracked file outside artifactDir — unattributable to the leaf', () => {
    const { root, artifactDir } = baselineRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    writeFileSync(join(root, 'concurrent-new-file.txt'), 'CONCURRENT\n');

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });
    expect(violations).toHaveLength(1);
    expect(violations[0].path).toBe('concurrent-new-file.txt');
    expect(violations[0].kind).toBe('untracked');

    const revert = revertOutOfScopeViolations({ repoRoot: root, violations });
    expect(revert.reverted[0].action).toBe('preserved_untracked');
    expect(revert.reverted[0].ok).toBe(true);
    // A not-in-HEAD path cannot be proven the leaf's (a concurrent writer looks identical),
    // and deletion is irreversible — so it is preserved on disk, never removed.
    expect(existsSync(join(root, 'concurrent-new-file.txt'))).toBe(true);
    expect(readFileSync(join(root, 'concurrent-new-file.txt'), 'utf8')).toBe('CONCURRENT\n');
  });
});

describe('write-containment — regression case (c): pre-existing dirty file is NOT touched', () => {
  it('subtracts pre-existing out-of-scope dirty paths and never reverts them', () => {
    const { root, artifactDir } = baselineRepo();

    // Pre-existing dirty work unrelated to the leaf (present BEFORE dispatch).
    writeFileSync(join(root, 'tracked-outside.txt'), 'PRE_EXISTING_DIRTY\n');
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });
    expect(dirtyPathIncluded(preDispatch, 'tracked-outside.txt')).toBe(true);

    // The leaf then makes its OWN new out-of-scope violation (different file).
    writeFileSync(join(root, 'evil-new-file.txt'), 'EVIL\n');

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });
    // Only the leaf's new file is a violation; the pre-existing dirty file is excluded.
    expect(violations.map((v) => v.path)).toEqual(['evil-new-file.txt']);

    const revert = revertOutOfScopeViolations({ repoRoot: root, violations });
    expect(revert.reverted).toHaveLength(1);
    expect(revert.reverted[0].path).toBe('evil-new-file.txt');
    expect(revert.reverted[0].action).toBe('preserved_untracked');

    // The pre-existing dirty file is PRESERVED exactly as the developer left it.
    expect(readFileSync(join(root, 'tracked-outside.txt'), 'utf8')).toBe('PRE_EXISTING_DIRTY\n');
    // And the leaf's new untracked file is ALSO preserved — never irreversibly deleted.
    expect(existsSync(join(root, 'evil-new-file.txt'))).toBe(true);
  });
});

// Regression: on a dirty, multi-actor working tree, files created during the dispatch
// window by the parent orchestrator or a concurrent session are indistinguishable from
// the leaf's own untracked writes. The old guard `rmSync`-deleted them (irreversible data
// loss). A not-in-HEAD out-of-scope path is now preserved and reported as a non-fatal
// advisory; only in-HEAD (recoverable) modifications remain fatal.
describe('write-containment — concurrent-writer safety (never delete unattributable files)', () => {
  it('preserves a not-in-HEAD out-of-scope file as a non-fatal advisory, never deleting it', () => {
    const { root, artifactDir } = baselineRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    // A concurrent actor writes an untracked file outside the leaf's artifact dir.
    writeFileSync(join(root, 'concurrent.json'), '{"parallel":true}\n');

    const result = enforceWriteContainment({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
      label: 'sol',
    });

    // Non-fatal: no fatal violations, so the caller does not fail the iteration.
    expect(result.violations).toEqual([]);
    // Recorded as an advisory, and the file survives on disk untouched.
    expect(result.advisories.map((v) => v.path)).toEqual(['concurrent.json']);
    expect(existsSync(join(root, 'concurrent.json'))).toBe(true);
    expect(readFileSync(join(root, 'concurrent.json'), 'utf8')).toBe('{"parallel":true}\n');
    // The event still logs it for visibility.
    expect(result.event).not.toBeNull();
    expect(result.event!.violations.map((v) => v.path)).toContain('concurrent.json');
  });

  it('keeps a real tracked-source breach fatal while preserving a concurrent untracked file', () => {
    const { root, artifactDir } = baselineRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    // Genuine breach (in HEAD → recoverable → fatal) + concurrent untracked write.
    writeFileSync(join(root, 'tracked-outside.txt'), 'CLOBBERED\n');
    writeFileSync(join(root, 'concurrent.txt'), 'parallel\n');

    const result = enforceWriteContainment({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
      label: 'sol',
    });

    // The tracked breach is fatal and reverted from HEAD...
    expect(result.violations.map((v) => v.path)).toEqual(['tracked-outside.txt']);
    expect(readFileSync(join(root, 'tracked-outside.txt'), 'utf8')).toBe('ORIGINAL_OUTSIDE\n');
    // ...while the concurrent untracked file is a preserved advisory, not deleted.
    expect(result.advisories.map((v) => v.path)).toEqual(['concurrent.txt']);
    expect(existsSync(join(root, 'concurrent.txt'))).toBe(true);
  });
});

describe('write-containment — enforceWriteContainment high-level', () => {
  it('reverts violations, appends a containment_violation event to the state log, and reports them', () => {
    const { root, artifactDir } = baselineRepo();
    const stateLog = join(artifactDir, 'state.jsonl');
    writeFileSync(stateLog, ''); // log exists, empty
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    writeFileSync(join(root, 'tracked-outside.txt'), 'EVIL\n');

    const result = enforceWriteContainment({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
      stateLogPath: stateLog,
      iteration: 3,
      label: 'review-i3-g1',
    });

    expect(result.violations).toHaveLength(1);
    expect(result.event).not.toBeNull();
    expect(result.event!.event).toBe('containment_violation');
    expect(result.event!.severity).toBe('error');
    expect(result.event!.iteration).toBe(3);
    expect(result.event!.label).toBe('review-i3-g1');
    expect(result.event!.violations[0].path).toBe('tracked-outside.txt');

    // Revert happened.
    expect(readFileSync(join(root, 'tracked-outside.txt'), 'utf8')).toBe('ORIGINAL_OUTSIDE\n');
    // Event appended to the JSONL state log.
    const logLine = readFileSync(stateLog, 'utf8').trim();
    const parsed = JSON.parse(logLine);
    expect(parsed.event).toBe('containment_violation');
    expect(parsed.reverted[0].action).toBe('restored_from_head');
  });

  it('returns no violations, no revert, and a null event when the leaf stayed in scope', () => {
    const { root, artifactDir } = baselineRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });
    writeFileSync(join(artifactDir, 'iter.md'), 'ok\n'); // inside only

    const result = enforceWriteContainment({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });
    expect(result.violations).toEqual([]);
    expect(result.revertResult.reverted).toEqual([]);
    expect(result.event).toBeNull();
  });
});

describe('write-containment — classify + event builder', () => {
  it('classifies status codes into violation kinds', () => {
    expect(classifyViolation('??')).toBe('untracked');
    expect(classifyViolation(' M')).toBe('modified');
    expect(classifyViolation(' D')).toBe('deleted');
    expect(classifyViolation('A ')).toBe('added');
  });

  it('builds an event payload with violations and revert actions', () => {
    const event = buildContainmentViolationEvent({
      iteration: 1,
      label: 'lbl',
      violations: [{ path: 'a.txt', absolutePath: '/x/a.txt', kind: 'modified', status: ' M' }],
      revertResult: { reverted: [{ path: 'a.txt', action: 'restored_from_head', ok: true }] },
    });
    expect(event.type).toBe('event');
    expect(event.event).toBe('containment_violation');
    expect(event.violations[0]).toEqual({ path: 'a.txt', kind: 'modified', status: ' M' });
    expect(event.reverted[0].action).toBe('restored_from_head');
  });
});

// Regression: a concurrent fan-out gave every lineage its own artifact dir, so a
// sibling's artifacts read as out-of-scope writes by whichever leaf tripped the
// guard — and were reverted. One leaf's stray write erased a sibling's completed
// run. Sibling dirs are now excluded from attribution, not reverted as damage.
describe('write-containment — concurrent sibling lineages', () => {
  function fanoutRepo(): { root: string; solDir: string; grokDir: string } {
    const root = makeRepo();
    writeFileSync(join(root, 'tracked-outside.txt'), 'ORIGINAL_OUTSIDE\n');
    const solDir = join(root, 'lineages/sol');
    const grokDir = join(root, 'lineages/grok');
    mkdirSync(solDir, { recursive: true });
    mkdirSync(grokDir, { recursive: true });
    writeFileSync(join(solDir, 'seed.md'), 'seed\n');
    writeFileSync(join(grokDir, 'seed.md'), 'seed\n');
    commitAll(root, 'fix(containment): fan-out baseline');
    return { root, solDir, grokDir };
  }

  it('does not report a sibling lineage write as this leaf violation', () => {
    const { root, solDir, grokDir } = fanoutRepo();
    const pre = snapshotOutOfScopeDirtyPaths({
      repoRoot: root,
      artifactDir: solDir,
      unattributableDirs: [grokDir],
    });

    // The sibling finishes its own run while this leaf is dispatched.
    writeFileSync(join(grokDir, 'research.md'), 'grok findings\n');
    writeFileSync(join(grokDir, 'deep-research-state.jsonl'), '{"type":"iteration"}\n');

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir: solDir,
      unattributableDirs: [grokDir],
      preDispatchDirtyPaths: pre,
    });
    expect(violations).toEqual([]);
  });

  it('leaves a completed sibling run on disk when this leaf trips containment', () => {
    const { root, solDir, grokDir } = fanoutRepo();
    const pre = snapshotOutOfScopeDirtyPaths({
      repoRoot: root,
      artifactDir: solDir,
      unattributableDirs: [grokDir],
    });

    const siblingArtifact = join(grokDir, 'research.md');
    writeFileSync(siblingArtifact, 'grok findings\n');
    // This leaf's genuine violation: a write to the wider repo.
    writeFileSync(join(root, 'tracked-outside.txt'), 'CLOBBERED_BY_SOL\n');

    const result = enforceWriteContainment({
      repoRoot: root,
      artifactDir: solDir,
      unattributableDirs: [grokDir],
      preDispatchDirtyPaths: pre,
      label: 'sol',
    });

    // The real violation is still caught and reverted...
    expect(result.violations.map((v) => v.path)).toEqual(['tracked-outside.txt']);
    expect(readFileSync(join(root, 'tracked-outside.txt'), 'utf8')).toBe('ORIGINAL_OUTSIDE\n');
    // ...while the sibling's completed work survives untouched.
    expect(existsSync(siblingArtifact)).toBe(true);
    expect(readFileSync(siblingArtifact, 'utf8')).toBe('grok findings\n');
  });

  it('still guards paths outside both this leaf dir and its siblings', () => {
    const { root, solDir, grokDir } = fanoutRepo();
    const pre = snapshotOutOfScopeDirtyPaths({
      repoRoot: root,
      artifactDir: solDir,
      unattributableDirs: [grokDir],
    });
    writeFileSync(join(root, 'stray.txt'), 'leaf wrote outside\n');

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir: solDir,
      unattributableDirs: [grokDir],
      preDispatchDirtyPaths: pre,
    });
    expect(violations.map((v) => v.path)).toEqual(['stray.txt']);
  });

  it('ignores an unattributable dir that is not a repo-relative subpath', () => {
    const { root, solDir } = fanoutRepo();
    const pre = snapshotOutOfScopeDirtyPaths({
      repoRoot: root,
      artifactDir: solDir,
      unattributableDirs: [join(tmpdir(), 'not-in-this-repo')],
    });
    writeFileSync(join(root, 'stray.txt'), 'leaf wrote outside\n');

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir: solDir,
      unattributableDirs: [join(tmpdir(), 'not-in-this-repo')],
      preDispatchDirtyPaths: pre,
    });
    expect(violations.map((v) => v.path)).toEqual(['stray.txt']);
  });
});

function dirtySorted(arr: DirtyPathEntry[]): string[] {
  return arr.map((e) => e.path).sort();
}

function dirtyPathIncluded(arr: DirtyPathEntry[], targetPath: string): boolean {
  return arr.some((e) => e.path === targetPath);
}
