// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Review Regression Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import * as fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';

import { atomicWriteFile } from '../extensions/deeppi/hashlines.js';
import {
  createStormBreakerState,
  registerStormBreaker,
} from '../extensions/deeppi/stormbreaker.js';
import { createStabilityState, freezeSessionTimestamps } from '../extensions/deeppi/stability.js';
import { annotateLine, isAnnotated, lineHash } from '../extensions/deeppi/utils.js';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import type { TimestampState } from '../extensions/deeppi/stability.js';

// ───────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ───────────────────────────────────────────────────────────────────

// These mocks insert external changes at exact filesystem boundaries.
// The atomic-write tests can therefore reproduce races deterministically.
const testState = vi.hoisted(() => ({
  realRename: null as unknown as (from: string, to: string) => Promise<void>,
  realOpen: null as unknown as typeof fs.open,
  realChmod: null as unknown as typeof fs.chmod,
}));
const renameMock = vi.hoisted(() => vi.fn());
const openMock = vi.hoisted(() => vi.fn());
const chmodMock = vi.hoisted(() => vi.fn());
vi.mock('node:fs/promises', async (importOriginal) => {
  const real = await importOriginal<typeof import('node:fs/promises')>();
  testState.realRename = real.rename;
  testState.realOpen = real.open;
  testState.realChmod = real.chmod;
  renameMock.mockImplementation(real.rename);
  openMock.mockImplementation(real.open);
  chmodMock.mockImplementation(real.chmod);
  return { ...real, rename: renameMock, open: openMock, chmod: chmodMock };
});

const created: string[] = [];
afterEach(async () => {
  for (const path of created.splice(0)) await rm(path, { recursive: true });
  renameMock.mockReset();
  renameMock.mockImplementation(testState.realRename);
  openMock.mockReset();
  openMock.mockImplementation(testState.realOpen);
  chmodMock.mockReset();
  chmodMock.mockImplementation(testState.realChmod);
});

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

// The first group verifies cooperative locking and post-replace protection.
// Competing writers make both guarantees observable.
it('serializes cooperating writers so a second writer cannot slip a write through', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'deeppi-review2-'));
  created.push(dir);
  const path = join(dir, 'sample.ts');
  await writeFile(path, 'snapshot\n');

  // Promise constructors assign both resolvers before either gate is awaited.
  let releaseFirstOpen!: () => void;
  const firstOpenGate = new Promise<void>((resolve) => {
    releaseFirstOpen = resolve;
  });
  let enteredFirstOpen!: () => void;
  const firstOpenEntered = new Promise<void>((resolve) => {
    enteredFirstOpen = resolve;
  });
  openMock.mockImplementationOnce(async (path, flags, mode) => {
    enteredFirstOpen();
    await firstOpenGate;
    return testState.realOpen(path, flags, mode);
  });

  const first = atomicWriteFile(path, 'first writer\n', 'snapshot\n');
  await firstOpenEntered;

  const second = atomicWriteFile(path, 'second writer\n', 'snapshot\n');
  let queueAssertion: unknown;
  try {
    expect(openMock).toHaveBeenCalledTimes(1);
  } catch (error: unknown) {
    queueAssertion = error;
  } finally {
    releaseFirstOpen();
  }
  if (queueAssertion) {
    await Promise.allSettled([first, second]);
    throw queueAssertion;
  }

  await first;
  await expect(second).rejects.toThrow(/changed/i);
  expect(await readFile(path, 'utf8')).toBe('first writer\n');
  // No sidecar lock artifact is created.
  await expect(readFile(`${path}.lock`, 'utf8')).rejects.toThrow();
});
it('does not touch an existing sidecar lock path', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'deeppi-review2-'));
  created.push(dir);
  const path = join(dir, 'sample.ts');
  const lockPath = `${path}.lock`;
  await writeFile(path, 'snapshot\n');
  await writeFile(lockPath, 'sentinel\n');

  await atomicWriteFile(path, 'replacement\n', 'snapshot\n');

  expect(await readFile(path, 'utf8')).toBe('replacement\n');
  expect(await readFile(lockPath, 'utf8')).toBe('sentinel\n');
});

it('detects when the target is replaced while the write is in flight', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'deeppi-review2-'));
  created.push(dir);
  const path = join(dir, 'sample.ts');
  await writeFile(path, 'snapshot\n');

  // A non-cooperating writer replaces the target immediately after our rename lands.
  // Post-replace verification must notice and refuse to report success.
  // The external content must remain intact.
  renameMock.mockImplementationOnce(async (from, to) => {
    await testState.realRename(from, to);
    await writeFile(to, 'external overwrite\n');
  });

  await expect(atomicWriteFile(path, 'agent content\n', 'snapshot\n'))
    .rejects.toThrow(/changed/i);
  expect(await readFile(path, 'utf8')).toBe('external overwrite\n');
});

it('rejects an external change made after its snapshot check', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'deeppi-review2-'));
  created.push(dir);
  const path = join(dir, 'sample.ts');
  await writeFile(path, 'snapshot\n');

  chmodMock.mockImplementationOnce(async (temporary, mode) => {
    await writeFile(path, 'external overwrite\n');
    await testState.realChmod(temporary, mode);
  });

  await expect(atomicWriteFile(path, 'agent content\n', 'snapshot\n'))
    .rejects.toThrow(/changed/i);
  expect(await readFile(path, 'utf8')).toBe('external overwrite\n');
});

// These known inputs protect the hash width and annotation contract.
it('does not collide previously colliding distinct lines at 32 bits', () => {
  expect(lineHash('critical setting = false'))
    .not.toBe(lineHash('critical setting = true # 41223'));
  expect(lineHash('critical setting = false'))
    .not.toBe(lineHash('critical setting = true # 7571'));
  expect(lineHash('line value 517')).not.toBe(lineHash('line value 1910'));
  // Deterministic for identical content.
  expect(lineHash('critical setting = true # 41223'))
    .toBe(lineHash('critical setting = true # 41223'));
});

it('emits and recognizes 8-hex-char annotations only', () => {
  expect(annotateLine(1, 'alpha')).toMatch(/^\s*1:[0-9a-f]{8}\u2192alpha$/);
  expect(isAnnotated('    1:a1b2c3d4\u2192x')).toBe(true);
  expect(isAnnotated('    1:a1b2\u2192x')).toBe(false);
  expect(isAnnotated('    1:a1b2c3d4e5f60718\u2192x')).toBe(false);
});

// Non-assistant message_end events must not reset blocked-turn tracking.
it('ignores tool-result and user message_end events so the blocked streak accumulates', async () => {
  type Hook = (event: any, ctx: any) => Promise<any> | any;
  const hooks = new Map<string, Hook>();
  const pi = {
    on(type: string, hook: Hook) {
      hooks.set(type, hook);
    },
  } as unknown as ExtensionAPI;
  const state = createStormBreakerState();
  registerStormBreaker(pi, state, () => true);
  const ctx = {
    model: { provider: 'deepseek', id: 'deepseek-v4-pro' },
    abort() {},
    ui: { notify() {} },
  };

  const assistantWithCall = {
    role: 'assistant',
    content: [{ type: 'toolCall', id: 'a', name: 'read', arguments: {} }],
  };
  const toolResultMsg = { role: 'toolResult', toolCallId: 'a', toolName: 'read', content: [] };
  const userMsg = { role: 'user', content: [{ type: 'text', text: 'continue' }] };

  // Pi's real event order per turn (`agent-loop.ts` `emitToolResultMessage`) is:
  // `message_end(assistant with toolCall)` → `tool_result` → `message_end(toolResult)`.
  // User turns occur between batches.
  // Non-assistant message_end events must not reset the blocked-turn streak.
  // The registerStormBreaker call installs the handlers synchronously before this sequence.
  for (let attempt = 0; attempt < 3; attempt++) {
    await hooks.get('message_end')!({ message: assistantWithCall }, ctx);
    await hooks.get('tool_result')!({
      toolCallId: 'a',
      toolName: 'read',
      isError: true,
      content: [{ type: 'text', text: 'missing' }],
    }, ctx);
    await hooks.get('message_end')!({ message: toolResultMsg }, ctx);
    await hooks.get('message_end')!({ message: userMsg }, ctx);
  }
  expect(state.guardsInjected).toBe(1);

  // A tool-free ASSISTANT turn still ends the streak...
  await hooks.get('message_end')!({
    message: { role: 'assistant', content: [{ type: 'text', text: 'new task' }] },
  }, ctx);
  await hooks.get('message_end')!({ message: assistantWithCall }, ctx);
  const result = await hooks.get('tool_result')!({
    toolCallId: 'a',
    toolName: 'read',
    isError: true,
    content: [{ type: 'text', text: 'missing' }],
  }, ctx);
  expect(JSON.stringify(result)).not.toContain('[loop guard]');
  expect(state.guardsInjected).toBe(1);
});

// User-authored date labels must remain distinct from generated timestamps.
it('preserves lowercase user-authored date labels instead of freezing them', () => {
  const state = createStabilityState();
  freezeSessionTimestamps('date: release-candidate-1', state);
  expect(freezeSessionTimestamps('date: release-candidate-2', state))
    .toBe('date: release-candidate-2');
  expect(state.frozenLines.size).toBe(0);
});

it('still freezes genuine lowercase generated timestamps', () => {
  const state: TimestampState = { frozenLines: new Map() };
  const first = freezeSessionTimestamps('date: 2026-08-04', state);
  expect(freezeSessionTimestamps('date: 2026-08-05', state)).toBe(first);
  expect(freezeSessionTimestamps('time: 09:05 later', state))
    .toBe(freezeSessionTimestamps('time: 09:00 start', state));
});
