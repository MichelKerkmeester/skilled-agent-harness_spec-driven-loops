import { EventEmitter } from 'node:events';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createLauncherIdleMonitor,
  parseLauncherIdleTimeoutMs,
} from '../lib/ipc/launcher-idle-timeout.js';

describe('launcher idle timeout monitor', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('parses default, fractional, disabled, and invalid values', () => {
    expect(parseLauncherIdleTimeoutMs(undefined)).toBe(30 * 60_000);
    expect(parseLauncherIdleTimeoutMs('0.1')).toBe(6_000);
    expect(parseLauncherIdleTimeoutMs('0')).toBeNull();
    expect(parseLauncherIdleTimeoutMs('-1')).toBe(30 * 60_000);
    expect(parseLauncherIdleTimeoutMs('not-a-number')).toBe(30 * 60_000);
  });

  it('runs graceful shutdown once after a no-client timeout', async () => {
    vi.useFakeTimers();
    const onIdle = vi.fn();
    const monitor = createLauncherIdleMonitor({
      serviceName: 'test-service',
      timeoutMinutesRaw: '0.001',
      stdin: null,
      getActiveClientCount: () => 0,
      onIdle,
      log: () => undefined,
    });

    await vi.advanceTimersByTimeAsync(1_000);

    expect(onIdle).toHaveBeenCalledTimes(1);
    monitor.stop();
  });

  it('DR-008-04: re-arms the watchdog when idle shutdown throws', async () => {
    vi.useFakeTimers();
    const onIdle = vi.fn<[], Promise<void>>()
      .mockRejectedValueOnce(new Error('shutdown boom'))
      .mockResolvedValue(undefined);
    const monitor = createLauncherIdleMonitor({
      serviceName: 'test-service',
      timeoutMinutesRaw: '0.001',
      stdin: null,
      getActiveClientCount: () => 0,
      onIdle,
      log: () => undefined,
    });

    await vi.advanceTimersByTimeAsync(1_000); // first idle → onIdle throws → re-arm
    expect(onIdle).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1_000); // re-armed watchdog retries (pre-fix: stuck at 1)
    expect(onIdle).toHaveBeenCalledTimes(2);
    monitor.stop();
  });

  it('keeps an active IPC client alive past the idle timeout', async () => {
    vi.useFakeTimers();
    const onIdle = vi.fn();
    let activeClients = 1;
    const monitor = createLauncherIdleMonitor({
      serviceName: 'test-service',
      timeoutMinutesRaw: '0.001',
      stdin: null,
      getActiveClientCount: () => activeClients,
      onIdle,
      log: () => undefined,
    });

    await vi.advanceTimersByTimeAsync(5_000);

    expect(onIdle).not.toHaveBeenCalled();
    activeClients = 0;
    monitor.stop();
  });

  it('honors zero as disabled', async () => {
    vi.useFakeTimers();
    const onIdle = vi.fn();
    const monitor = createLauncherIdleMonitor({
      serviceName: 'test-service',
      timeoutMinutesRaw: '0',
      stdin: null,
      onIdle,
      log: () => undefined,
    });

    await vi.advanceTimersByTimeAsync(10_000);

    expect(monitor.timeoutMs).toBeNull();
    expect(onIdle).not.toHaveBeenCalled();
  });

  it('tracks primary stdio activity', async () => {
    vi.useFakeTimers();
    const stdin = new EventEmitter() as unknown as NodeJS.ReadableStream;
    const onIdle = vi.fn();
    const monitor = createLauncherIdleMonitor({
      serviceName: 'test-service',
      timeoutMinutesRaw: '0.05',
      stdin,
      getActiveClientCount: () => 0,
      onIdle,
      log: () => undefined,
    });

    await vi.advanceTimersByTimeAsync(1_200);
    stdin.emit('data', Buffer.from('ping'));
    await vi.advanceTimersByTimeAsync(1_900);
    expect(onIdle).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1_500);
    expect(onIdle).toHaveBeenCalledTimes(1);
    monitor.stop();
  });
});
