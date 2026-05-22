// ───────────────────────────────────────────────────────────────
// TEST: Runtime Timer Registry
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  clearAllTimers,
  clearRegisteredTimer,
  getRegisteredTimerCount,
  registerInterval,
  registerTimeout,
} from '../../../lib/runtime/timer-registry.js';

describe('timer-registry', () => {
  afterEach(() => {
    clearAllTimers();
    vi.useRealTimers();
  });

  it('tracks and clears registered timeouts', () => {
    vi.useFakeTimers();
    const fn = vi.fn();

    registerTimeout(fn, 100);
    expect(getRegisteredTimerCount()).toBe(1);
    clearAllTimers();
    vi.advanceTimersByTime(100);

    expect(fn).not.toHaveBeenCalled();
    expect(getRegisteredTimerCount()).toBe(0);
  });

  it('clears individual interval handles without leaking registry state', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const handle = registerInterval(fn, 25);

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(2);
    clearRegisteredTimer(handle);
    vi.advanceTimersByTime(50);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(getRegisteredTimerCount()).toBe(0);
  });
});
