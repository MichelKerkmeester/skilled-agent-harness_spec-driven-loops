// ───────────────────────────────────────────────────────────────
// TEST: Runtime Shutdown Hooks
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import {
  clearShutdownHooksForTests,
  getShutdownHookCount,
  handleShutdownSignalForTests,
  registerShutdownHook,
  runShutdownHooks,
} from '../../../lib/runtime/shutdown-hooks.js';

describe('shutdown-hooks', () => {
  afterEach(() => {
    clearShutdownHooksForTests();
  });

  it('runs registered hooks in registration order and clears them', async () => {
    const order: string[] = [];
    registerShutdownHook(() => order.push('a'));
    registerShutdownHook(() => order.push('b'));

    const results = await runShutdownHooks();

    expect(order).toEqual(['a', 'b']);
    expect(results.every((result) => result.ok)).toBe(true);
    expect(getShutdownHookCount()).toBe(0);
  });

  it('captures per-hook timeouts without throwing upward', async () => {
    registerShutdownHook(() => new Promise(() => undefined), { timeoutMs: 5 });

    const results = await runShutdownHooks();

    expect(results).toHaveLength(1);
    expect(results[0].ok).toBe(false);
    expect(results[0].timedOut).toBe(true);
  });

  it('exits with the conventional signal code after clean signal-triggered shutdown', async () => {
    const order: string[] = [];
    registerShutdownHook(() => order.push('clean'));
    const exitCodes: number[] = [];
    const exitProcess = (code?: number): never => {
      exitCodes.push(code ?? 0);
      throw new Error('exit');
    };

    await expect(handleShutdownSignalForTests('SIGTERM', exitProcess)).rejects.toThrow('exit');

    expect(order).toEqual(['clean']);
    expect(exitCodes).toEqual([143]);
  });

  it('exits with failure when any signal-triggered hook fails', async () => {
    registerShutdownHook(() => {
      throw new Error('boom');
    });
    const exitCodes: number[] = [];
    const exitProcess = (code?: number): never => {
      exitCodes.push(code ?? 0);
      throw new Error('exit');
    };

    await expect(handleShutdownSignalForTests('SIGINT', exitProcess)).rejects.toThrow('exit');

    expect(exitCodes).toEqual([1]);
  });
});
