import { afterEach, describe, expect, it, vi } from 'vitest';

import { abortableSleep, composeAbortSignals, SLEEP_CHUNK_MS } from '../../lib/deep-loop/sleep.js';

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('sleep', () => {
  it('resolves after the requested delay', async () => {
    vi.useFakeTimers();
    const settled = vi.fn();

    const sleepPromise = abortableSleep(SLEEP_CHUNK_MS + 25).then(settled);

    await vi.advanceTimersByTimeAsync(SLEEP_CHUNK_MS);
    expect(settled).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(25);
    await expect(sleepPromise).resolves.toBeUndefined();
    expect(settled).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects immediately when the signal is already aborted', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const reason = new Error('already aborted');

    controller.abort(reason);

    await expect(abortableSleep(1_000, controller.signal)).rejects.toBe(reason);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects with the abort reason during an active wait', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const removeListener = vi.spyOn(controller.signal, 'removeEventListener');
    const reason = new Error('cancelled');

    const sleepPromise = abortableSleep(1_000, controller.signal);

    await vi.advanceTimersByTimeAsync(50);
    controller.abort(reason);

    await expect(sleepPromise).rejects.toBe(reason);
    expect(removeListener).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('removes listeners on each completed chunk without leaving timers behind', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const addListener = vi.spyOn(controller.signal, 'addEventListener');
    const removeListener = vi.spyOn(controller.signal, 'removeEventListener');

    const sleepPromise = abortableSleep(SLEEP_CHUNK_MS * 2 + 1, controller.signal);

    await vi.advanceTimersByTimeAsync(SLEEP_CHUNK_MS);
    expect(addListener).toHaveBeenCalledTimes(2);
    expect(removeListener).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(SLEEP_CHUNK_MS);
    expect(addListener).toHaveBeenCalledTimes(3);
    expect(removeListener).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(1);
    await expect(sleepPromise).resolves.toBeUndefined();
    expect(addListener).toHaveBeenCalledTimes(3);
    expect(removeListener).toHaveBeenCalledTimes(3);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('composes multiple signals through AbortSignal.any', async () => {
    vi.useFakeTimers();
    const first = new AbortController();
    const second = new AbortController();
    const reason = new Error('global shutdown');
    const anySpy = vi.spyOn(AbortSignal, 'any');

    const signal = composeAbortSignals([first.signal, second.signal]);
    const sleepPromise = abortableSleep(1_000, signal);

    second.abort(reason);

    await expect(sleepPromise).rejects.toBe(reason);
    expect(anySpy).toHaveBeenCalledWith([first.signal, second.signal]);
    expect(vi.getTimerCount()).toBe(0);
  });
});
