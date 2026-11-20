// ───────────────────────────────────────────────────────────────────
// MODULE: Advisor Daemon Liveness
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  HEARTBEAT_FILE_NAME,
  HEARTBEAT_INTERVAL_MS,
  PARENT_CHECK_INTERVAL_MS,
  startHeartbeat,
  resolveLauncherPid,
  startParentWatch,
} from '../../lib/daemon/liveness.js';

type IntervalHandle = ReturnType<typeof setInterval>;

interface IntervalRecord {
  readonly callback: () => void;
  readonly intervalMs: number;
  unrefCalls: number;
}

function createTimerHarness() {
  const intervals: IntervalRecord[] = [];
  const setIntervalFn = (callback: () => void, intervalMs: number): IntervalHandle => {
    const interval = { callback, intervalMs, unrefCalls: 0 };
    intervals.push(interval);
    return {
      unref: () => {
        interval.unrefCalls += 1;
      },
    } as unknown as IntervalHandle;
  };
  const clearIntervalFn = vi.fn((_timer: IntervalHandle) => undefined);

  return {
    intervals,
    setIntervalFn,
    clearIntervalFn,
    tick(index = 0): void {
      const interval = intervals[index];
      if (!interval) throw new Error(`No interval registered at index ${index}`);
      interval.callback();
    },
  };
}

let temporaryDirectory: string | null = null;

afterEach(() => {
  if (temporaryDirectory) {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
    temporaryDirectory = null;
  }
  vi.restoreAllMocks();
});

describe('daemon liveness', () => {
  it('does not report an unchanged parent as orphaned', () => {
    const timers = createTimerHarness();
    const onOrphaned = vi.fn();
    const watch = startParentWatch({
      onOrphaned,
      getParentPid: () => 4242,
      setIntervalFn: timers.setIntervalFn,
      clearIntervalFn: timers.clearIntervalFn,
    });

    expect(timers.intervals[0]?.intervalMs).toBe(PARENT_CHECK_INTERVAL_MS);
    expect(timers.intervals[0]?.unrefCalls).toBe(1);
    timers.tick();
    timers.tick();

    expect(onOrphaned).not.toHaveBeenCalled();
    watch.stop();
    expect(timers.clearIntervalFn).toHaveBeenCalledTimes(1);
  });

  it('reports a changed parent once and stops watching', () => {
    const timers = createTimerHarness();
    const onOrphaned = vi.fn();
    let parentPid = 4242;
    const watch = startParentWatch({
      onOrphaned,
      getParentPid: () => parentPid,
      setIntervalFn: timers.setIntervalFn,
      clearIntervalFn: timers.clearIntervalFn,
    });

    timers.tick();
    expect(onOrphaned).not.toHaveBeenCalled();
    parentPid = 100;
    timers.tick();
    timers.tick();

    expect(onOrphaned).toHaveBeenCalledTimes(1);
    expect(timers.clearIntervalFn).toHaveBeenCalledTimes(1);
    watch.stop();
    expect(timers.clearIntervalFn).toHaveBeenCalledTimes(1);
  });

  it('compares against the launcher pid captured before startup work', () => {
    const timers = createTimerHarness();
    const onOrphaned = vi.fn();
    // The launcher died during startup, so the server was already adopted by the
    // time the watch was armed.
    const watch = startParentWatch({
      onOrphaned,
      parentPid: 4242,
      getParentPid: () => 1,
      setIntervalFn: timers.setIntervalFn,
      clearIntervalFn: timers.clearIntervalFn,
    });

    timers.tick();

    expect(onOrphaned).toHaveBeenCalledTimes(1);
    watch.stop();
  });

  it('takes the launcher pid from the spawn environment before the parent pid', () => {
    // A launcher that dies while the server still loads its modules has already
    // left the server adopted, so only the pid the launcher passed is reliable.
    expect(resolveLauncherPid({ SYSTEM_SKILL_ADVISOR_LAUNCHER_PID: '4242' }, 1)).toBe(4242);
    expect(resolveLauncherPid({}, 4242)).toBe(4242);
    expect(resolveLauncherPid({ SYSTEM_SKILL_ADVISOR_LAUNCHER_PID: 'not-a-pid' }, 4242)).toBe(4242);
    expect(resolveLauncherPid({ SYSTEM_SKILL_ADVISOR_LAUNCHER_PID: '0' }, 4242)).toBe(4242);
  });

  it('writes on start and ticks, retries after a write error, and removes the file on stop', () => {
    temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'advisor-daemon-liveness-'));
    const filePath = path.join(temporaryDirectory, HEARTBEAT_FILE_NAME);
    const timers = createTimerHarness();
    const firstTimestamp = Date.parse('2026-11-19T12:00:00.000Z');
    let timestampOffset = 0;
    let writeCount = 0;
    const writeFile = vi.fn((targetPath: string, contents: string) => {
      writeCount += 1;
      if (writeCount === 2) throw new Error('temporary write failure');
      fs.writeFileSync(targetPath, contents, 'utf8');
    });
    const heartbeat = startHeartbeat({
      filePath,
      writeFile,
      now: () => new Date(firstTimestamp + timestampOffset++ * 1_000),
      setIntervalFn: timers.setIntervalFn,
      clearIntervalFn: timers.clearIntervalFn,
    });

    expect(timers.intervals[0]?.intervalMs).toBe(HEARTBEAT_INTERVAL_MS);
    expect(timers.intervals[0]?.unrefCalls).toBe(1);
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('2026-11-19T12:00:00.000Z');

    timers.tick();
    expect(writeFile).toHaveBeenCalledTimes(2);
    timers.tick();
    expect(writeFile).toHaveBeenCalledTimes(3);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('2026-11-19T12:00:02.000Z');

    heartbeat.stop();

    expect(timers.clearIntervalFn).toHaveBeenCalledTimes(1);
    expect(fs.existsSync(filePath)).toBe(false);
  });
});
