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
  __internals,
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
  // Isolate from the developer's global gitignore: a personal excludes file (e.g. a
  // global `/specs` rule) would otherwise hide the fixture's out-of-scope paths from
  // git status, making containment detection non-deterministic across machines.
  git(root, ['config', 'core.excludesFile', '/dev/null']);
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

  it('detects and restores truncation of a pre-existing dirty tracked file by content identity', () => {
    const { root, artifactDir } = baselineRepo();
    const outsidePath = join(root, 'tracked-outside.txt');

    writeFileSync(outsidePath, 'PRE_EXISTING_DIRTY\n');
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });
    const dirtyEntry = preDispatch.find((entry) => entry.path === 'tracked-outside.txt');
    expect(dirtyEntry?.hash).toBeTruthy();

    // The path is unchanged, but the leaf replaces the snapshotted content with an empty file.
    writeFileSync(outsidePath, '');

    const result = enforceWriteContainment({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });

    expect(result.violations.map((violation) => violation.path)).toEqual(['tracked-outside.txt']);
    expect(result.revertResult.reverted).toEqual([
      { path: 'tracked-outside.txt', action: 'restored_from_head', ok: true },
    ]);
    expect(readFileSync(outsidePath, 'utf8')).toBe('ORIGINAL_OUTSIDE\n');
  });
});

// Regression: on a dirty, multi-actor working tree, files created during the dispatch
// window by the parent orchestrator or a concurrent session are indistinguishable from
// the leaf's own untracked writes. The old guard `rmSync`-deleted them (irreversible data
// loss). A not-in-HEAD out-of-scope path is now ALWAYS preserved on disk, breach or not.
// Whether it also fails the iteration depends on where it lives: a write inside the
// packet's own directory tree (an ancestor of this leaf's artifact dir) stays a non-fatal
// advisory, since it may be a concurrent write to the packet's own docs; a write with no
// such relationship is a genuine out-of-scope breach and fails the iteration too.
describe('write-containment — concurrent-writer safety (never delete unattributable files)', () => {
  it('preserves a not-in-HEAD file with no relation to the packet on disk, but still fails the iteration', () => {
    const { root, artifactDir } = baselineRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    // A concurrent actor writes an untracked file with no relation to this leaf's packet.
    writeFileSync(join(root, 'concurrent.json'), '{"parallel":true}\n');

    const result = enforceWriteContainment({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
      label: 'sol',
    });

    // Fatal: it cannot be tied to this leaf's own packet, so the caller fails the iteration.
    expect(result.violations.map((v) => v.path)).toEqual(['concurrent.json']);
    expect(result.advisories).toEqual([]);
    // Still never deleted, fatal or not.
    expect(existsSync(join(root, 'concurrent.json'))).toBe(true);
    expect(readFileSync(join(root, 'concurrent.json'), 'utf8')).toBe('{"parallel":true}\n');
    // The event still logs it for visibility.
    expect(result.event).not.toBeNull();
    expect(result.event!.violations.map((v) => v.path)).toContain('concurrent.json');
  });

  it('keeps a real tracked-source breach fatal, and also fails on an unrelated concurrent untracked write — neither is deleted', () => {
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

    // Both are fatal now — the tracked breach and the unrelated untracked write.
    expect(result.violations.map((v) => v.path).sort()).toEqual(['concurrent.txt', 'tracked-outside.txt']);
    expect(result.advisories).toEqual([]);
    // The tracked breach is reverted from HEAD...
    expect(readFileSync(join(root, 'tracked-outside.txt'), 'utf8')).toBe('ORIGINAL_OUTSIDE\n');
    // ...while the untracked write is fatal but still never deleted.
    expect(existsSync(join(root, 'concurrent.txt'))).toBe(true);
    expect(readFileSync(join(root, 'concurrent.txt'), 'utf8')).toBe('parallel\n');
  });
});

// Regression: a not-in-HEAD out-of-scope write was ALWAYS a non-fatal advisory regardless
// of where it landed, so a genuinely out-of-scope write could never fail an iteration. A
// write inside the packet's own directory tree — e.g. a spec doc a concurrent process
// writes alongside this lineage — is legitimate and stays a non-fatal advisory; a write
// with no relation to the packet at all is now a fatal breach.
describe('write-containment — untracked breach fatality is scoped to the packet, not blanket-exempt', () => {
  function packetRepo(): { root: string; artifactDir: string; packetDir: string } {
    const root = makeRepo();
    writeFileSync(join(root, 'tracked-outside.txt'), 'ORIGINAL_OUTSIDE\n');
    const packetDir = join(root, 'specs', 'track', '012-packet');
    const artifactDir = join(packetDir, 'review', 'run', 'lineages', 'sol');
    mkdirSync(artifactDir, { recursive: true });
    writeFileSync(join(artifactDir, 'seed.md'), 'seed\n');
    commitAll(root, 'fix(containment): packet baseline');
    return { root, artifactDir, packetDir };
  }

  it('fails the iteration on a write unrelated to the packet, while a concurrent packet-doc write stays a preserved advisory', () => {
    const { root, artifactDir, packetDir } = packetRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    // A legitimate concurrent write to this run's OWN packet docs, alongside the lineage.
    const packetDoc = join(packetDir, 'implementation-summary.md');
    writeFileSync(packetDoc, '# summary\n');
    // A genuinely out-of-scope write with no relation to the packet at all.
    const strayFile = join(root, 'random-elsewhere.txt');
    writeFileSync(strayFile, 'stray\n');

    const result = enforceWriteContainment({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });

    expect(result.violations.map((v) => v.path)).toEqual(['random-elsewhere.txt']);
    expect(result.advisories.map((v) => v.path)).toEqual([
      'specs/track/012-packet/implementation-summary.md',
    ]);
    // Neither is ever deleted — fatal or advisory, both survive on disk.
    expect(existsSync(packetDoc)).toBe(true);
    expect(existsSync(strayFile)).toBe(true);
    expect(readFileSync(strayFile, 'utf8')).toBe('stray\n');
  });
});

// Regression: the regenerable-state exemption suffix-matched ANY description.json or
// descriptions.json in the whole repo, so a leaf writing into an unrelated packet's own
// index would be silently downgraded to a non-fatal advisory.
describe('write-containment — regenerable-state exemption is scoped to the packet tree', () => {
  function packetRepo(): { root: string; artifactDir: string; packetDir: string } {
    const root = makeRepo();
    writeFileSync(join(root, 'tracked-outside.txt'), 'ORIGINAL_OUTSIDE\n');
    const packetDir = join(root, 'specs', 'track', '012-packet');
    const artifactDir = join(packetDir, 'review', 'run', 'lineages', 'sol');
    mkdirSync(artifactDir, { recursive: true });
    writeFileSync(join(artifactDir, 'seed.md'), 'seed\n');
    commitAll(root, 'fix(containment): packet baseline');
    return { root, artifactDir, packetDir };
  }

  it("exempts the packet's own description.json but fails on an unrelated packet's description.json", () => {
    const { root, artifactDir, packetDir } = packetRepo();
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    // The runtime regenerates THIS packet's own index alongside the lineage — legitimate.
    writeFileSync(join(packetDir, 'description.json'), '{"packet":"012"}\n');
    // A leaf that reaches into an unrelated packet's index is a genuine breach.
    const otherPacketDir = join(root, 'specs', 'track', '999-other-packet');
    mkdirSync(otherPacketDir, { recursive: true });
    writeFileSync(join(otherPacketDir, 'description.json'), '{"packet":"999"}\n');

    const result = enforceWriteContainment({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });

    expect(result.advisories.map((v) => v.path)).toEqual([
      'specs/track/012-packet/description.json',
    ]);
    expect(result.violations.map((v) => v.path)).toEqual([
      'specs/track/999-other-packet/description.json',
    ]);
    // Neither is ever deleted, exempted or not.
    expect(existsSync(join(packetDir, 'description.json'))).toBe(true);
    expect(existsSync(join(otherPacketDir, 'description.json'))).toBe(true);
  });
});

// Regression: an untracked baseline entry was never hashed, so the post-dispatch
// comparison unconditionally skipped it regardless of content — a leaf that overwrote the
// SAME out-of-scope path in a later iteration went undetected forever behind
// the first iteration's now-stale advisory.
describe('write-containment — untracked baseline entries are compared by content, not skipped unconditionally', () => {
  it('re-detects a baseline-tracked untracked file whose content changed since the snapshot', () => {
    const { root, artifactDir } = baselineRepo();
    writeFileSync(join(root, 'concurrent.txt'), 'ORIGINAL_CONCURRENT\n');
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });
    const entry = preDispatch.find((e) => e.path === 'concurrent.txt');
    expect(entry?.hash).toBeTruthy();

    // The leaf overwrites the SAME untracked path with new content.
    writeFileSync(join(root, 'concurrent.txt'), 'TAMPERED\n');

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });
    expect(violations.map((v) => v.path)).toEqual(['concurrent.txt']);
  });

  it('does not re-report a baseline-tracked untracked file whose content is unchanged', () => {
    const { root, artifactDir } = baselineRepo();
    writeFileSync(join(root, 'concurrent.txt'), 'UNCHANGED\n');
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    const violations = detectNewOutOfScopeViolations({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });
    expect(violations).toEqual([]);
  });
});

describe('write-containment — regenerable runtime state', () => {
  it('exempts only runtime database files and exact memory-index metadata basenames', () => {
    expect(__internals.isRegenerableRuntimeState(
      '.opencode/skills/system-deep-loop/runtime/database/graph.sqlite',
    )).toBe(true);
    expect(__internals.isRegenerableRuntimeState('specs/descriptions.json')).toBe(true);
    expect(__internals.isRegenerableRuntimeState('specs/example/description.json')).toBe(true);
    expect(__internals.isRegenerableRuntimeState(
      '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worker.ts',
    )).toBe(false);
    expect(__internals.isRegenerableRuntimeState('specs/example/description.json.bak')).toBe(false);
    expect(__internals.isRegenerableRuntimeState('other/database/graph.sqlite')).toBe(false);
  });

  it('scopes description.json/descriptions.json exemption to the given artifact-dir tree when a scope is passed', () => {
    const artifactRelPosix = 'specs/track/012-packet/review/run/lineages/sol';
    // Same packet, at or above the lineage dir — exempt.
    expect(__internals.isRegenerableRuntimeState('specs/track/012-packet/description.json', artifactRelPosix)).toBe(true);
    expect(__internals.isRegenerableRuntimeState('specs/descriptions.json', artifactRelPosix)).toBe(true);
    // An unrelated packet sharing only the basename — not exempt once scoped.
    expect(__internals.isRegenerableRuntimeState('specs/track/999-other/description.json', artifactRelPosix)).toBe(false);
    // Runtime database exemption is unaffected by scoping (it's a fixed, global path).
    expect(__internals.isRegenerableRuntimeState(
      '.opencode/skills/system-deep-loop/runtime/database/graph.sqlite',
      artifactRelPosix,
    )).toBe(true);
  });

  it('preserves tracked runtime database state as a non-fatal advisory', () => {
    const { root, artifactDir } = baselineRepo();
    const databaseDir = join(root, '.opencode/skills/system-deep-loop/runtime/database');
    const databasePath = join(databaseDir, 'observability-events.jsonl');
    mkdirSync(databaseDir, { recursive: true });
    writeFileSync(databasePath, '{"event":"baseline"}\n');
    git(root, ['add', '-f', '.opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl']);
    git(root, ['commit', '-q', '-m', 'test(containment): add generated runtime state']);
    const preDispatch = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir });

    writeFileSync(databasePath, '{"event":"lineage"}\n');

    const result = enforceWriteContainment({
      repoRoot: root,
      artifactDir,
      preDispatchDirtyPaths: preDispatch,
    });

    expect(result.violations).toEqual([]);
    expect(result.advisories.map((violation) => violation.path)).toEqual([
      '.opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl',
    ]);
    expect(result.revertResult.reverted).toEqual([]);
    expect(readFileSync(databasePath, 'utf8')).toBe('{"event":"lineage"}\n');
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

  it('throws when the artifact dir resolves outside the git worktree', () => {
    const { root } = baselineRepo();
    const externalArtifact = mkdtempSync(join(tmpdir(), 'external-artifact-'));
    tempRoots.push(externalArtifact);

    expect(() => enforceWriteContainment({
      repoRoot: root,
      artifactDir: externalArtifact,
      preDispatchDirtyPaths: [],
    })).toThrow(/outside the git worktree/);
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
