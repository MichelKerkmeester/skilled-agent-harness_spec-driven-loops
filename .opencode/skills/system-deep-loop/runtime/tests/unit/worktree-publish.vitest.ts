import { afterEach, describe, expect, it } from 'vitest';

import { createHash } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { acquireLoopLock, processAlive } from '../../lib/deep-loop/loop-lock.js';
import { publishLineageDirectory, sweepStagingResidue } from '../../lib/deep-loop/worktree-publish.js';
import type {
  PublishLineageDirectoryInput,
  PublishLineageDirectoryResult,
} from '../../lib/deep-loop/worktree-publish.js';

/** Millisecond budgets small enough to expire inside a test, and long enough to stay live. */
const TINY_TTL_MS = 1;
const LONG_TTL_MS = 300_000;

/** The on-disk names these cases assert against: the module's own layout, stated once here. */
const MANIFEST_FILE = 'publish-manifest.json';
const STAGING_PREFIX = '.staging-';
const CLAIM_SUFFIX = '.publish.lock';
const ATTIC_DIR = '.publish-attic';

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop() as string, { recursive: true, force: true });
  }
});

function makeRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'worktree-publish-'));
  tempDirs.push(dir);
  return dir;
}

function writeTree(root: string, files: Record<string, string>): void {
  for (const [relativePath, content] of Object.entries(files)) {
    const absolutePath = join(root, relativePath);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, content, 'utf8');
  }
}

function sha256File(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/** Every entry under `root`, as sorted POSIX-relative paths. */
function listFiles(root: string): string[] {
  const found: string[] = [];
  const walk = (absolutePath: string, relativePath: string): void => {
    for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
      const nextRelative = relativePath === '' ? entry.name : `${relativePath}/${entry.name}`;
      if (entry.isDirectory()) {
        walk(join(absolutePath, entry.name), nextRelative);
      } else {
        found.push(nextRelative);
      }
    }
  };
  walk(root, '');
  return found.sort();
}

function stagingNames(targetParent: string): string[] {
  return readdirSync(targetParent).filter((name) => name.startsWith(STAGING_PREFIX));
}

function knownDeadPid(): number {
  for (let pid = 999_999; pid > 900_000; pid -= 1) {
    if (!processAlive(pid)) return pid;
  }
  throw new Error('Could not find a known-dead pid for worktree-publish test');
}

function publishInput(
  repo: string,
  overrides: Partial<PublishLineageDirectoryInput> = {},
): PublishLineageDirectoryInput {
  return {
    repoRoot: repo,
    sourceDir: join(repo, 'worktree', 'lineages', 'wave-1'),
    targetParent: join(repo, 'lineages'),
    label: 'wave-1',
    runId: 'run-a',
    attempt: 1,
    ownerPid: process.pid,
    ttlMs: LONG_TTL_MS,
    ...overrides,
  };
}

/** Materialize a finished lineage directory in its own worktree, and name the publish target. */
function makeLineage(
  repo: string,
  files: Record<string, string>,
): { sourceDir: string; targetParent: string } {
  const sourceDir = join(repo, 'worktree', 'lineages', 'wave-1');
  writeTree(sourceDir, files);
  return { sourceDir, targetParent: join(repo, 'lineages') };
}

function publishedPathOf(result: PublishLineageDirectoryResult): string {
  expect(result.ok).toBe(true);
  expect(result.publishedPath).not.toBeNull();
  return result.publishedPath as string;
}

/**
 * Write a claim whose owner cannot answer for it: a pid that does not exist, and a heartbeat
 * older than twice the ttl. Nothing holds it, so the lock's own staleness rule makes it
 * reclaimable.
 */
function writeStaleClaim(claimPath: string, runId: string): void {
  const deadAt = new Date(Date.now() - 3_600_000).toISOString();
  mkdirSync(dirname(claimPath), { recursive: true });
  writeFileSync(
    claimPath,
    `${JSON.stringify(
      {
        owner_pid: knownDeadPid(),
        started_at_iso: deadAt,
        ttl_ms: TINY_TTL_MS,
        last_heartbeat_iso: deadAt,
        packet_id: runId,
        runtime_kind: 'main',
        phase: 'publishing',
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
}

/**
 * Take a claim that stays live for the duration of a test: its owner pid is this process, which
 * answers a zero-signal probe, so no sweep or acquire path may reclaim it.
 */
function acquireLiveClaim(claimPath: string, runId: string): void {
  const acquired = acquireLoopLock(claimPath, {
    ownerPid: process.pid,
    startedAtIso: new Date().toISOString(),
    ttlMs: LONG_TTL_MS,
    lastHeartbeatIso: new Date().toISOString(),
    packetId: runId,
    runtimeKind: 'main',
    phase: 'publishing',
  });
  expect(acquired.acquired).toBe(true);
}

describe('worktree-publish / publish', () => {
  it('publishes the lineage directory with a manifest that hashes every file', () => {
    const repo = makeRepo();
    const { sourceDir } = makeLineage(repo, {
      'research.md': '# wave one\n',
      'iterations/iteration-001.md': 'first pass\n',
    });

    const result = publishLineageDirectory(publishInput(repo));
    const publishedPath = publishedPathOf(result);

    expect(result.reason).toBe('published');
    expect(result.movedAsidePath).toBeNull();
    expect(publishedPath).toBe(join(repo, 'lineages', 'run-a-wave-1'));
    expect(listFiles(publishedPath)).toEqual([
      'iterations/iteration-001.md',
      MANIFEST_FILE,
      'research.md',
    ]);

    const manifest = JSON.parse(readFileSync(join(publishedPath, MANIFEST_FILE), 'utf8')) as {
      run_id: string;
      label: string;
      attempt: number;
      entries: Array<{ path: string; kind: string; sha256?: string }>;
    };
    expect(manifest.run_id).toBe('run-a');
    expect(manifest.label).toBe('wave-1');
    expect(manifest.attempt).toBe(1);
    expect(manifest.entries.map((entry) => entry.path)).toEqual([
      'iterations/iteration-001.md',
      'research.md',
    ]);
    for (const entry of manifest.entries) {
      expect(entry.kind).toBe('file');
      expect(entry.sha256).toBe(sha256File(join(sourceDir, entry.path)));
    }

    // The claim is released and no staging residue is left, so the next publisher of this target
    // finds a free, unclaimed path.
    expect(existsSync(`${publishedPath}${CLAIM_SUFFIX}`)).toBe(false);
    expect(stagingNames(join(repo, 'lineages'))).toEqual([]);
  });

  it('keeps two runs that share a lineage label on different targets and publishes both', () => {
    const repo = makeRepo();
    const firstSource = join(repo, 'worktree-a', 'lineages', 'wave-1');
    const secondSource = join(repo, 'worktree-b', 'lineages', 'wave-1');
    writeTree(firstSource, { 'research.md': 'run a\n' });
    writeTree(secondSource, { 'research.md': 'run b\n' });

    const first = publishLineageDirectory(publishInput(repo, { sourceDir: firstSource, runId: 'run-a' }));
    const second = publishLineageDirectory(publishInput(repo, { sourceDir: secondSource, runId: 'run-b' }));

    expect(publishedPathOf(first)).not.toBe(publishedPathOf(second));
    // Neither publish displaced the other: the second run found a target of its own.
    expect(first.movedAsidePath).toBeNull();
    expect(second.movedAsidePath).toBeNull();
    expect(readFileSync(join(publishedPathOf(first), 'research.md'), 'utf8')).toBe('run a\n');
    expect(readFileSync(join(publishedPathOf(second), 'research.md'), 'utf8')).toBe('run b\n');
  });

  it('moves an existing published directory into the attic instead of deleting it', () => {
    const repo = makeRepo();
    const { sourceDir, targetParent } = makeLineage(repo, { 'research.md': 'from the worktree\n' });
    const target = join(targetParent, 'run-a-wave-1');
    writeTree(target, { 'research.md': 'hand edit\n', 'hand-note.md': 'written by a person\n' });

    const result = publishLineageDirectory(publishInput(repo, { sourceDir }));
    const publishedPath = publishedPathOf(result);

    expect(result.reason).toBe('published-after-moving-target-aside');
    expect(result.movedAsidePath).not.toBeNull();
    const movedAsidePath = result.movedAsidePath as string;
    expect(dirname(movedAsidePath)).toBe(join(targetParent, ATTIC_DIR));
    // The displaced bytes survive: nothing in a publish deletes what it found.
    expect(readFileSync(join(movedAsidePath, 'hand-note.md'), 'utf8')).toBe('written by a person\n');
    expect(readFileSync(join(movedAsidePath, 'research.md'), 'utf8')).toBe('hand edit\n');
    expect(readFileSync(join(publishedPath, 'research.md'), 'utf8')).toBe('from the worktree\n');
  });

  it('refuses rather than overwrites while a live claim holds the target', () => {
    const repo = makeRepo();
    const { sourceDir, targetParent } = makeLineage(repo, { 'research.md': 'from the worktree\n' });
    const target = join(targetParent, 'run-a-wave-1');
    writeTree(target, { 'research.md': 'someone else is publishing here\n' });
    // A different run holds the claim, and its process is alive, so it is not reclaimable.
    acquireLiveClaim(`${target}${CLAIM_SUFFIX}`, 'run-b');

    const result = publishLineageDirectory(publishInput(repo, { sourceDir }));

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('target-claim-held');
    expect(result.publishedPath).toBeNull();
    expect(result.movedAsidePath).toBeNull();
    expect(readFileSync(join(target, 'research.md'), 'utf8')).toBe('someone else is publishing here\n');
    // A refusal leaves no copy behind: the caller still holds the worktree, which is the copy
    // that matters.
    expect(stagingNames(targetParent)).toEqual([]);
  });

  it('reclaims a stale claim and publishes', () => {
    const repo = makeRepo();
    const { sourceDir, targetParent } = makeLineage(repo, { 'research.md': 'finished after all\n' });
    writeStaleClaim(join(targetParent, `run-a-wave-1${CLAIM_SUFFIX}`), 'run-a');

    const result = publishLineageDirectory(publishInput(repo, { sourceDir }));

    // Publication proceeded, which is the proof that the stale claim was reclaimed rather than
    // refused: a live claim on the same path would have returned target-claim-held.
    expect(result.reason).toBe('published');
    expect(readFileSync(join(publishedPathOf(result), 'research.md'), 'utf8')).toBe('finished after all\n');
  });

  it('publishes bytes that hash-equal the source', () => {
    const repo = makeRepo();
    const { sourceDir } = makeLineage(repo, {
      'research.md': '# wave\n\nbody\n',
      'iterations/iteration-001.md': 'first\n',
      'iterations/iteration-002.md': 'second\n',
      'logs/state.jsonl': '{"step":"one"}\n',
    });
    symlinkSync('research.md', join(sourceDir, 'latest.md'));

    const sourceHashes = listFiles(sourceDir).map(
      (relativePath) => [relativePath, sha256File(join(sourceDir, relativePath))] as const,
    );
    const result = publishLineageDirectory(publishInput(repo));
    const publishedPath = publishedPathOf(result);

    for (const [relativePath, hash] of sourceHashes) {
      expect(sha256File(join(publishedPath, relativePath))).toBe(hash);
    }

    // A symlink is recreated as a link rather than followed into a copy of its target.
    expect(lstatSync(join(publishedPath, 'latest.md')).isSymbolicLink()).toBe(true);

    const manifest = JSON.parse(readFileSync(join(publishedPath, MANIFEST_FILE), 'utf8')) as {
      entries: Array<{ path: string; kind: string; sha256?: string }>;
    };
    for (const entry of manifest.entries.filter((candidate) => candidate.kind === 'file')) {
      expect(entry.sha256).toBe(sha256File(join(publishedPath, entry.path)));
    }
  });

  it('resolves a relative source and target against the repository root', () => {
    const repo = makeRepo();
    writeTree(join(repo, 'worktree', 'lineages', 'wave-1'), { 'research.md': 'relative\n' });

    const result = publishLineageDirectory({
      repoRoot: repo,
      sourceDir: join('worktree', 'lineages', 'wave-1'),
      targetParent: 'lineages',
      label: 'wave-1',
      runId: 'run-a',
      attempt: 1,
      ownerPid: process.pid,
      ttlMs: LONG_TTL_MS,
    });

    expect(publishedPathOf(result)).toBe(join(repo, 'lineages', 'run-a-wave-1'));
    expect(readFileSync(join(publishedPathOf(result), 'research.md'), 'utf8')).toBe('relative\n');
  });

  it('reports a missing source instead of publishing nothing', () => {
    const repo = makeRepo();

    const result = publishLineageDirectory(
      publishInput(repo, { sourceDir: join(repo, 'worktree', 'gone') }),
    );

    expect(result).toEqual({
      ok: false,
      publishedPath: null,
      movedAsidePath: null,
      reason: 'source-missing',
    });
  });

  it('rejects a call that cannot describe a publishable run', () => {
    const repo = makeRepo();
    const { sourceDir } = makeLineage(repo, { 'research.md': 'x\n' });

    expect(() => publishLineageDirectory(publishInput(repo, { sourceDir, label: '../escape' }))).toThrow(TypeError);
    expect(() => publishLineageDirectory(publishInput(repo, { sourceDir, runId: '' }))).toThrow(TypeError);
    expect(() => publishLineageDirectory(publishInput(repo, { sourceDir, attempt: -1 }))).toThrow(TypeError);
    expect(() => publishLineageDirectory(publishInput(repo, { sourceDir, ownerPid: 0 }))).toThrow(TypeError);
    expect(() => publishLineageDirectory(publishInput(repo, { sourceDir, ttlMs: Number.NaN }))).toThrow(TypeError);
    expect(() => sweepStagingResidue({ targetParent: '', runId: 'run-a' })).toThrow(TypeError);
    expect(() => sweepStagingResidue({ targetParent: repo, runId: 'a/b' })).toThrow(TypeError);
  });
});

describe('worktree-publish / sweep', () => {
  it('sweeps the unmarked staging directory an interrupted publish leaves behind', () => {
    const repo = makeRepo();
    const { sourceDir, targetParent } = makeLineage(repo, { 'research.md': 'published copy\n' });
    const published = publishLineageDirectory(publishInput(repo, { sourceDir }));

    // What a publisher leaves when it dies mid-copy: a partial staged copy with no manifest, so
    // nothing can mistake it for a finished one.
    const residue = join(targetParent, `${STAGING_PREFIX}run-a-wave-1-2`);
    writeTree(residue, { 'research.md': 'half a copy' });
    // A staging directory of a different run, which this sweep has no business touching.
    const foreignResidue = join(targetParent, `${STAGING_PREFIX}run-b-wave-1-2`);
    writeTree(foreignResidue, { 'research.md': 'other run\n' });

    const sweep = sweepStagingResidue({ targetParent, runId: 'run-a' });

    expect(sweep.ok).toBe(true);
    expect(sweep.removed).toEqual([residue]);
    expect(existsSync(residue)).toBe(false);
    expect(existsSync(foreignResidue)).toBe(true);
    // Published content is not residue.
    expect(existsSync(publishedPathOf(published))).toBe(true);
  });

  it('leaves a staging directory alone while a live claim guards its target', () => {
    const repo = makeRepo();
    const targetParent = join(repo, 'lineages');
    const target = join(targetParent, 'run-a-wave-1');
    const inFlight = join(targetParent, `${STAGING_PREFIX}run-a-wave-1-3`);
    writeTree(inFlight, { 'research.md': 'still being copied\n' });
    acquireLiveClaim(`${target}${CLAIM_SUFFIX}`, 'run-a');

    const sweep = sweepStagingResidue({ targetParent, runId: 'run-a' });

    expect(sweep.removed).toEqual([]);
    expect(sweep.inUse).toEqual([inFlight]);
    expect(existsSync(inFlight)).toBe(true);
  });

  it('sweeps this run stale claims and leaves a live and a foreign claim in place', () => {
    const repo = makeRepo();
    const targetParent = join(repo, 'lineages');
    mkdirSync(targetParent, { recursive: true });
    const staleClaim = join(targetParent, `run-a-stale${CLAIM_SUFFIX}`);
    writeStaleClaim(staleClaim, 'run-a');
    const liveClaim = join(targetParent, `run-a-live${CLAIM_SUFFIX}`);
    acquireLiveClaim(liveClaim, 'run-a');
    // Another run's stale claim is not this sweep's to reclaim.
    const foreignClaim = join(targetParent, `run-b-stale${CLAIM_SUFFIX}`);
    writeStaleClaim(foreignClaim, 'run-b');

    const sweep = sweepStagingResidue({ targetParent, runId: 'run-a' });

    expect(sweep.ok).toBe(true);
    expect(sweep.removed).toEqual([staleClaim]);
    expect(existsSync(staleClaim)).toBe(false);
    expect(existsSync(liveClaim)).toBe(true);
    expect(existsSync(foreignClaim)).toBe(true);
  });

  it('sweeps a target parent that does not exist without failing', () => {
    const repo = makeRepo();

    const sweep = sweepStagingResidue({ targetParent: join(repo, 'lineages'), runId: 'run-a' });

    expect(sweep).toEqual({ ok: true, removed: [], inUse: [], errors: [] });
  });
});
