// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Cache Optimizer Copy Claim Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, test } from 'node:test';

import { createPiCacheOptimizerExtension } from '#extension';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

// ───────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ───────────────────────────────────────────────────────────────────

type Handler = (data: unknown) => void;

interface FakeBus {
  emit(channel: string, data: unknown): void;
  on(channel: string, handler: Handler): void;
}

interface FakePi {
  pi: ExtensionAPI;
  tools: string[];
  commands: string[];
  hooks: number;
}

function createFakeBus(): FakeBus {
  const listeners = new Map<string, Handler[]>();
  return {
    emit(channel, data) {
      for (const handler of listeners.get(channel) ?? []) handler(data);
    },
    on(channel, handler) {
      const list = listeners.get(channel) ?? [];
      list.push(handler);
      listeners.set(channel, list);
    },
  };
}

// One fake per copy, sharing the bus the way Pi shares one bus across a load.
function createFakePi(bus: FakeBus): FakePi {
  const fake: FakePi = { pi: undefined as unknown as ExtensionAPI, tools: [], commands: [], hooks: 0 };
  fake.pi = {
    events: bus,
    on() {
      fake.hooks += 1;
    },
    registerCommand(name: string) {
      fake.commands.push(name);
    },
    registerTool(tool: { name: string }) {
      fake.tools.push(tool.name);
    },
  } as unknown as ExtensionAPI;
  return fake;
}

async function withTempDir(run: (root: string) => Promise<void>): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), 'pi-cache-copy-claim-'));
  try {
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('copy claim', () => {
  test('a copy at another real path stands down', async () => {
    await withTempDir(async (root) => {
      const worktreeCopy = join(root, 'worktree', 'pi-cache-optimizer');
      const mainCopy = join(root, 'main', 'pi-cache-optimizer');
      await mkdir(worktreeCopy, { recursive: true });
      await mkdir(mainCopy, { recursive: true });
      const bus = createFakeBus();
      const first = createFakePi(bus);
      const second = createFakePi(bus);

      createPiCacheOptimizerExtension(worktreeCopy)(first.pi);
      createPiCacheOptimizerExtension(mainCopy)(second.pi);

      assert.deepEqual(first.tools, ['edit_lines']);
      assert.ok(first.commands.includes('cache-optimizer'));
      assert.ok(first.hooks > 0);
      assert.deepEqual(second.tools, []);
      assert.deepEqual(second.commands, []);
      assert.equal(second.hooks, 0);
    });
  });

  test('two copies at one real path both register', async () => {
    await withTempDir(async (root) => {
      const realCopy = join(root, 'checkout', 'pi-cache-optimizer');
      const linkedCopy = join(root, 'agent', 'pi-cache-optimizer');
      await mkdir(realCopy, { recursive: true });
      await mkdir(join(root, 'agent'), { recursive: true });
      await symlink(realCopy, linkedCopy, 'dir');
      const bus = createFakeBus();
      const first = createFakePi(bus);
      const second = createFakePi(bus);

      createPiCacheOptimizerExtension(linkedCopy)(first.pi);
      createPiCacheOptimizerExtension(realCopy)(second.pi);

      assert.deepEqual(first.tools, ['edit_lines']);
      assert.deepEqual(second.tools, ['edit_lines']);
    });
  });
});
