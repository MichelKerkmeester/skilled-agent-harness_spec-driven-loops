// ───────────────────────────────────────────────────────────────
// TEST: Runtime Shutdown Hooks
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import {
  clearShutdownHooksForTests,
  getShutdownHookCount,
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
});
