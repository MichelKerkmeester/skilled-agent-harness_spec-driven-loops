// ───────────────────────────────────────────────────────────────
// MODULE: Daemon Watcher New-Root Ingestion Tests
// ───────────────────────────────────────────────────────────────
//
// A brand-new top-level skill directory must announce itself to a warm
// daemon: the skills root is watched (shallow) alongside the explicit file
// targets, a top-level addDir routes the newborn skill through the normal
// debounce into reindex, and the reindex tail's refresh promotes the root's
// files into durable watch targets. Deleting a root retires its targets.
// Without this, discovery only ever saw roots that existed at startup and a
// by-the-book new skill stayed invisible until a restart.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('chokidar', () => ({
  default: {
    watch: vi.fn(() => {
      throw new Error('chokidar should be injected by watcher fixtures');
    }),
  },
}));

// Every case injects its own reindexSkill, so the sqlite-backed default
// reindex is never exercised; mocking it keeps this suite runnable in
// checkouts where the advisor's native dependencies are not installed.
vi.mock('../lib/skill-graph/skill-graph-db.js', () => ({
  indexSkillMetadata: vi.fn(async () => ({ indexedFiles: 0 })),
}));

import {
  createSkillGraphWatcher,
  type SkillGraphFsWatcher,
} from '../lib/daemon/watcher.js';

interface CapturingHarness {
  readonly emit: (event: string, path: string) => void;
  readonly added: string[];
  readonly watchedPaths: string[];
  readonly watchOptions: Record<string, unknown>;
  readonly watchFactory: (paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher;
}

const workspaces: string[] = [];

function workspace(name: string): string {
  const root = join(tmpdir(), `${name}-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  workspaces.push(root);
  return root;
}

function write(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
}

function skillDir(root: string, slug: string): string {
  return join(root, '.opencode', 'skills', slug);
}

function writeSkill(root: string, slug: string): void {
  const dir = skillDir(root, slug);
  write(join(dir, 'SKILL.md'), [
    '---',
    `name: ${slug}`,
    'description: Test skill',
    'allowed-tools: []',
    '---',
    `# ${slug}`,
    '',
  ].join('\n'));
  write(join(dir, 'graph-metadata.json'), JSON.stringify({
    schema_version: 1,
    skill_id: slug,
    family: 'system',
    category: 'test',
    domains: ['test'],
    intent_signals: ['test'],
    edges: {},
  }, null, 2));
}

function createCapturingHarness(): CapturingHarness {
  const listeners = new Map<string, Array<(...args: unknown[]) => void>>();
  const added: string[] = [];
  const watchedPaths: string[] = [];
  const watchOptions: Record<string, unknown> = {};
  const watcher: SkillGraphFsWatcher = {
    on(event, listener) {
      const existing = listeners.get(event) ?? [];
      existing.push(listener);
      listeners.set(event, existing);
      return watcher;
    },
    add(paths) {
      added.push(...(Array.isArray(paths) ? paths : [paths]));
      return watcher;
    },
    unwatch() {
      return watcher;
    },
    close: async () => undefined,
  };
  return {
    emit(event, path) {
      for (const listener of listeners.get(event) ?? []) {
        listener(path);
      }
    },
    added,
    watchedPaths,
    watchOptions,
    watchFactory: (paths, options) => {
      watchedPaths.push(...paths);
      Object.assign(watchOptions, options);
      return watcher;
    },
  };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  for (const root of workspaces.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('new-root ingestion: the skills root announces newborn skills', () => {
  it('watches the skills root shallowly alongside the file targets', async () => {
    const root = workspace('skill-graph-root-watch');
    writeSkill(root, 'alpha');
    const harness = createCapturingHarness();

    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill: vi.fn(async () => ({ indexedFiles: 1 })),
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });

    const skillsRoot = join(root, '.opencode', 'skills');
    expect(harness.watchedPaths).toContain(skillsRoot);
    expect(harness.watchOptions.depth).toBe(0);

    await watcher.close();
  });

  it('ingests a skill created after startup and promotes its files to targets', async () => {
    const root = workspace('skill-graph-new-root');
    writeSkill(root, 'alpha');
    const harness = createCapturingHarness();
    const reindexSkill = vi.fn(async () => ({ indexedFiles: 1 }));

    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill,
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });
    const before = watcher.status().watchedPaths;

    // The skill is born after the watcher started.
    writeSkill(root, 'newborn');
    const newbornDir = skillDir(root, 'newborn');
    harness.emit('addDir', newbornDir);

    // The new directory itself is watched immediately so its SKILL.md write
    // fires a normal add even before discovery runs.
    expect(harness.added).toContain(newbornDir);

    await vi.advanceTimersByTimeAsync(50);
    await watcher.flush();

    expect(reindexSkill).toHaveBeenCalledWith(expect.objectContaining({ skillSlug: 'newborn' }));
    expect(watcher.status().watchedPaths).toBeGreaterThan(before);
    expect(watcher.targets.some((target) => target.skillSlug === 'newborn')).toBe(true);

    await watcher.close();
  });

  it('ignores directory events that are not top-level skill roots', async () => {
    const root = workspace('skill-graph-nested-dir');
    writeSkill(root, 'alpha');
    const harness = createCapturingHarness();
    const reindexSkill = vi.fn(async () => ({ indexedFiles: 1 }));

    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill,
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });

    harness.emit('addDir', join(skillDir(root, 'alpha'), 'references'));
    harness.emit('addDir', join(root, '.opencode', 'skills', '.hidden'));
    await vi.advanceTimersByTimeAsync(50);
    await watcher.flush();

    expect(reindexSkill).not.toHaveBeenCalled();

    await watcher.close();
  });

  it('discovers a newborn skill through real chokidar without a restart', async () => {
    // The end-to-end proof of the seam closure: a real fs watcher, a skill
    // created after startup, and no synthetic events — only the filesystem.
    vi.useRealTimers();
    const root = workspace('skill-graph-real-chokidar');
    writeSkill(root, 'alpha');
    // Resolve chokidar from wherever it is actually installed rather than a
    // hardcoded sibling path: the advisor's own node_modules first, then the
    // spec-kit server's (the shared install), matching the production
    // loadSkillGraphWatchFactory candidate order.
    const chokidarCandidates = [
      join(process.cwd(), 'node_modules', 'chokidar', 'index.js'),
      join(process.cwd(), '..', '..', 'system-spec-kit', 'mcp-server', 'node_modules', 'chokidar', 'index.js'),
    ];
    const { existsSync } = await import('node:fs');
    const chokidarPath = chokidarCandidates.find((candidate) => existsSync(candidate));
    if (!chokidarPath) throw new Error(`real chokidar unavailable; checked ${chokidarCandidates.join(', ')}`);
    const { pathToFileURL } = await import('node:url');
    const chokidarModule = await import(pathToFileURL(chokidarPath).href) as {
      default?: { watch: (paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher };
      watch?: (paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher;
    };
    const realWatch = chokidarModule.default?.watch ?? chokidarModule.watch;
    if (!realWatch) throw new Error('real chokidar unavailable for the integration case');

    const reindexed: string[] = [];
    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: (paths, watchOptions) => realWatch(paths, watchOptions),
      reindexSkill: async (request) => {
        reindexed.push(request.skillSlug);
        return { indexedFiles: 1 };
      },
      backpressure: { debounceMs: 30, stableWriteMs: 10 },
    });

    // Give chokidar a beat to arm, then create the skill for real.
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 150));
    writeSkill(root, 'newborn');

    const deadline = Date.now() + 5000;
    while (!reindexed.includes('newborn') && Date.now() < deadline) {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 50));
      await watcher.flush();
    }

    expect(reindexed).toContain('newborn');
    expect(watcher.targets.some((target) => target.skillSlug === 'newborn')).toBe(true);

    // The hostile cycle: delete the root (whose file targets get unwatched —
    // chokidar persists those as ignored paths) and recreate it. Without the
    // explicit re-add of the identity files, the recreated root's SKILL.md
    // stayed permanently ignored and the skill never announced itself again.
    rmSync(skillDir(root, 'newborn'), { recursive: true, force: true });
    const unlinkDeadline = Date.now() + 5000;
    while (watcher.targets.some((target) => target.skillSlug === 'newborn') && Date.now() < unlinkDeadline) {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 50));
    }
    expect(watcher.targets.some((target) => target.skillSlug === 'newborn')).toBe(false);

    reindexed.length = 0;
    writeSkill(root, 'newborn');
    const rebirthDeadline = Date.now() + 5000;
    while (!reindexed.includes('newborn') && Date.now() < rebirthDeadline) {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 50));
      await watcher.flush();
    }
    expect(reindexed).toContain('newborn');
    expect(watcher.targets.some((target) => target.skillSlug === 'newborn')).toBe(true);

    await watcher.close();
  }, 30000);

  it('retires a deleted root from the watch targets', async () => {
    const root = workspace('skill-graph-root-delete');
    writeSkill(root, 'alpha');
    writeSkill(root, 'doomed');
    const harness = createCapturingHarness();

    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill: vi.fn(async () => ({ indexedFiles: 1 })),
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });
    const before = watcher.status().watchedPaths;

    rmSync(skillDir(root, 'doomed'), { recursive: true, force: true });
    harness.emit('unlinkDir', skillDir(root, 'doomed'));

    expect(watcher.status().watchedPaths).toBeLessThan(before);
    expect(watcher.targets.some((target) => target.skillSlug === 'doomed')).toBe(false);

    await watcher.close();
  });
});
