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

const tempRoots: string[] = [];

// git commits inside the test must bypass the host's global commit-msg hook.
function git(repoRoot: string, args: string[]): string {
  const result = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-C', repoRoot, ...args], {
    encoding: 'utf8',
    env: process.env,
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

  it('detects and removes an untracked file the leaf created outside artifactDir', () => {
    const { root, artifactDir } = baselineRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    writeFileSync(join(root, 'evil-new-file.txt'), 'EVIL\n');

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });
    expect(violations).toHaveLength(1);
    expect(violations[0].path).toBe('evil-new-file.txt');
    expect(violations[0].kind).toBe('untracked');

    const revert = revertOutOfScopeViolations({ repoRoot: root, violations });
    expect(revert.reverted[0].action).toBe('removed_untracked');
    expect(revert.reverted[0].ok).toBe(true);
    expect(existsSync(join(root, 'evil-new-file.txt'))).toBe(false);
  });
});

describe('write-containment — regression case (c): pre-existing dirty file is NOT touched', () => {
  it('subtracts pre-existing out-of-scope dirty paths and never reverts them', () => {
    const { root, artifactDir } = baselineRepo();

    // Pre-existing dirty work unrelated to the leaf (present BEFORE dispatch).
    writeFileSync(join(root, 'tracked-outside.txt'), 'PRE_EXISTING_DIRTY\n');
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });
    expect(preDispatch).toContain('tracked-outside.txt');

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

    // The pre-existing dirty file is PRESERVED exactly as the developer left it.
    expect(readFileSync(join(root, 'tracked-outside.txt'), 'utf8')).toBe('PRE_EXISTING_DIRTY\n');
    // And the leaf's new file is gone.
    expect(existsSync(join(root, 'evil-new-file.txt'))).toBe(false);
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

function dirtySorted(arr: string[]): string[] {
  return [...arr].sort();
}
