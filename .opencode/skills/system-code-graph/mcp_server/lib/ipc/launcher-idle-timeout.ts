// MODULE: Launcher Idle Timeout Monitor

const DEFAULT_IDLE_TIMEOUT_MIN = 30;
const MS_PER_MINUTE = 60_000;
const MIN_IDLE_CHECK_INTERVAL_MS = 1_000;
const MAX_IDLE_CHECK_INTERVAL_MS = 60_000;

type IntervalHandle = ReturnType<typeof setInterval>;
type DataListener = (chunk: unknown) => void;
type StdinLike = {
  on(eventName: 'data', listener: DataListener): unknown;
  off?: (eventName: 'data', listener: DataListener) => unknown;
  removeListener?: (eventName: 'data', listener: DataListener) => unknown;
};

interface LauncherIdleMonitorOptions {
  readonly serviceName: string;
  readonly timeoutMinutesRaw?: string;
  readonly stdin?: StdinLike | null;
  readonly getActiveClientCount?: () => number;
  readonly onIdle: () => void | Promise<void>;
  readonly log?: (message: string) => void;
  readonly now?: () => number;
  readonly setIntervalFn?: (callback: () => void, ms: number) => IntervalHandle;
  readonly clearIntervalFn?: (timer: IntervalHandle) => void;
}

interface LauncherIdleMonitor {
  readonly timeoutMs: number | null;
  readonly markActivity: () => void;
  readonly stop: () => void;
}

function parseLauncherIdleTimeoutMs(rawValue = process.env.SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN): number | null {
  const raw = rawValue === undefined || rawValue === null || String(rawValue).trim() === ''
    ? String(DEFAULT_IDLE_TIMEOUT_MIN)
    : String(rawValue).trim();
  const parsedMinutes = Number(raw);
  if (!Number.isFinite(parsedMinutes) || parsedMinutes < 0) {
    return DEFAULT_IDLE_TIMEOUT_MIN * MS_PER_MINUTE;
  }
  if (parsedMinutes === 0) {
    return null;
  }
  return Math.max(1, Math.round(parsedMinutes * MS_PER_MINUTE));
}

function removeDataListener(stdin: StdinLike | null | undefined, listener: DataListener): void {
  if (!stdin) return;
  if (typeof stdin.off === 'function') {
    stdin.off('data', listener);
    return;
  }
  if (typeof stdin.removeListener === 'function') {
    stdin.removeListener('data', listener);
  }
}

function createLauncherIdleMonitor(options: LauncherIdleMonitorOptions): LauncherIdleMonitor {
  const log = options.log ?? ((message: string) => console.error(message));
  const timeoutMs = parseLauncherIdleTimeoutMs(options.timeoutMinutesRaw);
  const noop = () => undefined;
  if (timeoutMs === null) {
    log(`[${options.serviceName}] launcher idle timeout disabled`);
    return { timeoutMs, markActivity: noop, stop: noop };
  }

  const now = options.now ?? (() => Date.now());
  const setIntervalFn = options.setIntervalFn ?? ((callback: () => void, ms: number) => setInterval(callback, ms));
  const clearIntervalFn = options.clearIntervalFn ?? ((interval: IntervalHandle) => clearInterval(interval));
  const stdin = options.stdin === undefined ? process.stdin : options.stdin;
  const checkIntervalMs = Math.min(
    MAX_IDLE_CHECK_INTERVAL_MS,
    Math.max(MIN_IDLE_CHECK_INTERVAL_MS, Math.floor(timeoutMs / 2)),
  );

  let stopped = false;
  let lastActivityAt = now();
  let timer: IntervalHandle | null = null;

  const markActivity = () => {
    if (!stopped) {
      lastActivityAt = now();
    }
  };

  const stop = () => {
    if (stopped) return;
    stopped = true;
    removeDataListener(stdin, markActivity);
    if (timer !== null) {
      clearIntervalFn(timer);
    }
  };

  const checkIdle = async () => {
    if (stopped) return;
    const activeClients = options.getActiveClientCount?.() ?? 0;
    if (activeClients > 0) {
      lastActivityAt = now();
      return;
    }
    const idleForMs = now() - lastActivityAt;
    if (idleForMs < timeoutMs) return;

    stopped = true;
    removeDataListener(stdin, markActivity);
    if (timer !== null) {
      clearIntervalFn(timer);
    }
    log(`[${options.serviceName}] launcher idle timeout reached after ${Math.round(idleForMs)}ms`);
    try {
      await options.onIdle();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      log(`[${options.serviceName}] launcher idle shutdown failed: ${message}`);
      // DR-008-04: a failed idle shutdown previously left stopped=true with the timer cleared,
      // permanently disabling the watchdog. Re-arm so the shutdown is retried next interval.
      stopped = false;
      lastActivityAt = now();
      stdin?.on('data', markActivity);
      timer = setIntervalFn(() => {
        void checkIdle();
      }, checkIntervalMs);
      if (typeof (timer as { unref?: () => void }).unref === 'function') {
        (timer as { unref: () => void }).unref();
      }
    }
  };

  stdin?.on('data', markActivity);
  timer = setIntervalFn(() => {
    void checkIdle();
  }, checkIntervalMs);
  if (typeof (timer as { unref?: () => void }).unref === 'function') {
    (timer as { unref: () => void }).unref();
  }

  return { timeoutMs, markActivity, stop };
}

export {
  createLauncherIdleMonitor,
  parseLauncherIdleTimeoutMs,
};

export type {
  LauncherIdleMonitor,
  LauncherIdleMonitorOptions,
};
