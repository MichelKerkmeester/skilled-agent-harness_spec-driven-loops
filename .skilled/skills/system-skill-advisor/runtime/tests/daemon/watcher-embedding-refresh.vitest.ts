// ───────────────────────────────────────────────────────────────
// MODULE: Watcher Embedding Refresh Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { SkillGraphFsWatcher } from '../../lib/daemon/watcher.js';

const mocks = vi.hoisted(() => ({
  indexSkillMetadata: vi.fn(),
  refreshEmbeddingsInBackground: vi.fn(),
}));

vi.mock('../../lib/skill-graph/skill-graph-db.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/skill-graph/skill-graph-db.js')>();
  return {
    ...actual,
    indexSkillMetadata: mocks.indexSkillMetadata,
    refreshEmbeddingsInBackground: mocks.refreshEmbeddingsInBackground,
  };
});

const { createSkillGraphWatcher } = await import('../../lib/daemon/watcher.js');

let workspaceRoot = '';

function writeSkill(slug: string, description: string): string {
  const skillDir = join(workspaceRoot, '.skilled', 'skills', slug);
  mkdirSync(skillDir, { recursive: true });
  const skillPath = join(skillDir, 'SKILL.md');
  writeFileSync(skillPath, ['---', `name: ${slug}`, `description: ${description}`, '---', ''].join('\n'));
  writeFileSync(join(skillDir, 'graph-metadata.json'), JSON.stringify({
    schema_version: 1,
    skill_id: slug,
    family: 'system',
    category: 'test',
    domains: ['watcher'],
    intent_signals: [slug],
    derived: {},
    edges: {},
  }));
  return skillPath;
}

function createWatchHarness() {
  const listeners = new Map<string, Array<(...args: unknown[]) => void>>();
  const watcher: SkillGraphFsWatcher = {
    on(event, listener) {
      listeners.set(event, [...(listeners.get(event) ?? []), listener]);
      return watcher;
    },
    add() {
      return watcher;
    },
    close: async () => undefined,
  };
  return {
    emit(event: string, path: string) {
      for (const listener of listeners.get(event) ?? []) listener(path);
    },
    watchFactory: () => watcher,
  };
}

async function advance(ms: number): Promise<void> {
  await vi.advanceTimersByTimeAsync(ms);
  await Promise.resolve();
}

describe('watcher embedding refresh', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    workspaceRoot = mkdtempSync(join(tmpdir(), 'watcher-embedding-refresh-'));
    mocks.indexSkillMetadata.mockReset();
    mocks.indexSkillMetadata.mockReturnValue({ indexedFiles: 1 });
    mocks.refreshEmbeddingsInBackground.mockReset();
    mocks.refreshEmbeddingsInBackground.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.useRealTimers();
    rmSync(workspaceRoot, { recursive: true, force: true });
  });

  it('requests one vector refresh after each reindex the default path runs', async () => {
    const skillPath = writeSkill('alpha', 'first description');
    const harness = createWatchHarness();
    const watcher = createSkillGraphWatcher({
      workspaceRoot,
      watchFactory: harness.watchFactory,
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });
    const skillsRoot = join(workspaceRoot, '.skilled', 'skills');

    writeSkill('alpha', 'second description');
    harness.emit('change', skillPath);
    await advance(25);

    expect(mocks.indexSkillMetadata).toHaveBeenCalledTimes(1);
    expect(mocks.refreshEmbeddingsInBackground).toHaveBeenCalledTimes(1);
    expect(mocks.refreshEmbeddingsInBackground).toHaveBeenCalledWith(skillsRoot);

    writeSkill('alpha', 'third description');
    harness.emit('change', skillPath);
    await advance(25);

    expect(mocks.indexSkillMetadata).toHaveBeenCalledTimes(2);
    expect(mocks.refreshEmbeddingsInBackground).toHaveBeenCalledTimes(2);
    await watcher.close();
  });

  it('keeps reindexing when a refresh request fails', async () => {
    mocks.refreshEmbeddingsInBackground.mockRejectedValue(new Error('refresh exploded'));
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const skillPath = writeSkill('alpha', 'first description');
    const harness = createWatchHarness();
    const watcher = createSkillGraphWatcher({
      workspaceRoot,
      watchFactory: harness.watchFactory,
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });

    writeSkill('alpha', 'second description');
    harness.emit('change', skillPath);
    await advance(25);
    writeSkill('alpha', 'third description');
    harness.emit('change', skillPath);
    await advance(25);

    expect(mocks.indexSkillMetadata).toHaveBeenCalledTimes(2);
    expect(errors.mock.calls.some((call) => String(call[0]).includes('refresh failed'))).toBe(true);
    errors.mockRestore();
    await watcher.close();
  });
});
