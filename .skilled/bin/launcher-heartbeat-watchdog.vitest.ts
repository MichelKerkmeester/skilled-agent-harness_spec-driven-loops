// ───────────────────────────────────────────────────────────────────
// MODULE: Launcher Heartbeat Watchdog Tests
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const requireCjs = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));
const launcher = requireCjs(join(HERE, 'system-skill-advisor-launcher.cjs'));

function createFakeChild() {
  const signals: string[] = [];
  const messages: unknown[][] = [];
  return {
    child: {
      exitCode: null as number | null,
      signalCode: null as string | null,
      kill(signal: string) {
        signals.push(signal);
      },
      send(...args: unknown[]) {
        messages.push(args);
      },
    },
    signals,
    messages,
  };
}

function createFakeTimers() {
  let intervalCallback: (() => void) | undefined;
  let timeoutCallback: (() => void) | undefined;
  let intervalDelayMs = 0;
  let timeoutDelayMs = 0;
  let intervalUnrefed = false;
  let timeoutUnrefed = false;
  let intervalCleared = false;

  return {
    options: {
      setIntervalFn(callback: () => void, delayMs: number) {
        intervalCallback = callback;
        intervalDelayMs = delayMs;
        return { unref: () => { intervalUnrefed = true; } };
      },
      clearIntervalFn() {
        intervalCleared = true;
      },
      setTimeoutFn(callback: () => void, delayMs: number) {
        timeoutCallback = callback;
        timeoutDelayMs = delayMs;
        return { unref: () => { timeoutUnrefed = true; } };
      },
    },
    runInterval() {
      if (!intervalCallback) throw new Error('interval callback was not registered');
      intervalCallback();
    },
    runTimeout() {
      if (!timeoutCallback) throw new Error('timeout callback was not registered');
      timeoutCallback();
    },
    get intervalDelayMs() {
      return intervalDelayMs;
    },
    get timeoutDelayMs() {
      return timeoutDelayMs;
    },
    get intervalUnrefed() {
      return intervalUnrefed;
    },
    get timeoutUnrefed() {
      return timeoutUnrefed;
    },
    get intervalCleared() {
      return intervalCleared;
    },
  };
}

function createWatchdog(mtimeMs: number | null, nowMs: number) {
  const fakeChild = createFakeChild();
  const timers = createFakeTimers();
  const watchdog = launcher.startHeartbeatWatchdog(fakeChild.child, {
    heartbeatPath: join(HERE, launcher.HEARTBEAT_FILE_NAME),
    spawnedAtMs: 1_000,
    statMtimeMs: () => mtimeMs,
    now: () => nowMs,
    ...timers.options,
  });
  return { fakeChild, timers, watchdog };
}

describe('launcher heartbeat verdict', () => {
  it.each([
    [null, 1_000],
    [999, 1_000],
  ])('does not arm for mtime %s before spawn time %s', (mtimeMs, spawnedAtMs) => {
    expect(launcher.heartbeatVerdict({ mtimeMs, spawnedAtMs, nowMs: 10_000 })).toBe('not-armed');
  });

  it('is fresh just under the stale limit', () => {
    const spawnedAtMs = 1_000;
    expect(launcher.heartbeatVerdict({
      mtimeMs: spawnedAtMs,
      spawnedAtMs,
      nowMs: spawnedAtMs + launcher.HEARTBEAT_STALE_MS - 1,
    })).toBe('fresh');
  });

  it('is stale over the limit', () => {
    const spawnedAtMs = 1_000;
    expect(launcher.heartbeatVerdict({
      mtimeMs: spawnedAtMs,
      spawnedAtMs,
      nowMs: spawnedAtMs + launcher.HEARTBEAT_STALE_MS + 1,
    })).toBe('stale');
  });
});

describe('launcher heartbeat watchdog', () => {
  it('sends SIGTERM, then SIGKILL after the grace while the child is running', () => {
    const { fakeChild, timers, watchdog } = createWatchdog(
      1_000,
      1_000 + launcher.HEARTBEAT_STALE_MS + 1,
    );

    timers.runInterval();
    expect(fakeChild.signals).toEqual(['SIGTERM']);
    expect(timers.intervalDelayMs).toBe(launcher.HEARTBEAT_CHECK_INTERVAL_MS);
    expect(timers.intervalCleared).toBe(true);
    expect(timers.intervalUnrefed).toBe(true);
    expect(timers.timeoutDelayMs).toBe(launcher.HEARTBEAT_KILL_GRACE_MS);
    expect(timers.timeoutUnrefed).toBe(true);
    expect(fakeChild.child.exitCode).toBeNull();
    expect(fakeChild.child.signalCode).toBeNull();

    timers.runTimeout();
    expect(fakeChild.signals).toEqual(['SIGTERM', 'SIGKILL']);
    expect(fakeChild.messages).toEqual([]);
    watchdog.stop();
  });

  it('does not signal a fresh heartbeat', () => {
    const { fakeChild, timers, watchdog } = createWatchdog(
      1_000,
      1_000 + launcher.HEARTBEAT_STALE_MS - 1,
    );

    timers.runInterval();
    expect(fakeChild.signals).toEqual([]);
    expect(fakeChild.messages).toEqual([]);
    watchdog.stop();
    expect(timers.intervalCleared).toBe(true);
  });

  it('does not signal when no heartbeat file is available', () => {
    const { fakeChild, timers, watchdog } = createWatchdog(
      null,
      1_000 + launcher.HEARTBEAT_STALE_MS + 1,
    );

    timers.runInterval();
    expect(fakeChild.signals).toEqual([]);
    expect(fakeChild.messages).toEqual([]);
    watchdog.stop();
    expect(timers.intervalCleared).toBe(true);
  });
});
