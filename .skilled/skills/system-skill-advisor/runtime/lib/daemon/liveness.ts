// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Daemon Liveness
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const PARENT_CHECK_INTERVAL_MS = 30_000;
export const HEARTBEAT_INTERVAL_MS = 15_000;

// The launcher's watchdog reads this name.
export const HEARTBEAT_FILE_NAME = 'advisor-server.heartbeat';

// ───────────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────────

type IntervalHandle = ReturnType<typeof setInterval>;
type SetIntervalFn = (callback: () => void, intervalMs: number) => IntervalHandle;
type ClearIntervalFn = (timer: IntervalHandle) => void;

interface LivenessHandle {
  readonly stop: () => void;
}

interface ParentWatchOptions {
  readonly onOrphaned: () => void | Promise<void>;
  readonly getParentPid?: () => number;
  readonly intervalMs?: number;
  readonly setIntervalFn?: SetIntervalFn;
  readonly clearIntervalFn?: ClearIntervalFn;
}

interface HeartbeatOptions {
  readonly filePath: string;
  readonly intervalMs?: number;
  readonly writeFile?: (filePath: string, contents: string) => void;
  readonly removeFile?: (filePath: string) => void;
  readonly now?: () => Date;
  readonly setIntervalFn?: SetIntervalFn;
  readonly clearIntervalFn?: ClearIntervalFn;
}

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function unrefInterval(timer: IntervalHandle): void {
  if (typeof (timer as { unref?: () => void }).unref === 'function') {
    (timer as { unref: () => void }).unref();
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. LIVENESS WATCHERS
// ───────────────────────────────────────────────────────────────────

/** Watch for the launcher process change without keeping the server alive. */
export function startParentWatch(options: ParentWatchOptions): LivenessHandle {
  const getParentPid = options.getParentPid ?? (() => process.ppid);
  const parentPid = getParentPid();
  const intervalMs = options.intervalMs ?? PARENT_CHECK_INTERVAL_MS;
  const setIntervalFn = options.setIntervalFn
    ?? ((callback: () => void, ms: number) => setInterval(callback, ms));
  const clearIntervalFn = options.clearIntervalFn
    ?? ((timer: IntervalHandle) => clearInterval(timer));

  let stopped = false;
  let timer: IntervalHandle | null = null;

  const stop = (): void => {
    if (stopped) return;
    stopped = true;
    if (timer !== null) {
      clearIntervalFn(timer);
    }
  };

  const checkParent = (): void => {
    if (stopped || getParentPid() === parentPid) return;
    stop();
    void options.onOrphaned();
  };

  timer = setIntervalFn(checkParent, intervalMs);
  unrefInterval(timer);

  return { stop };
}

/** Keep a synchronous watchdog timestamp on disk so event-loop stalls are visible. */
export function startHeartbeat(options: HeartbeatOptions): LivenessHandle {
  const writeFile = options.writeFile
    ?? ((filePath: string, contents: string) => fs.writeFileSync(filePath, contents, 'utf8'));
  const removeFile = options.removeFile
    ?? ((filePath: string) => fs.rmSync(filePath, { force: true }));
  const now = options.now ?? (() => new Date());
  const intervalMs = options.intervalMs ?? HEARTBEAT_INTERVAL_MS;
  const setIntervalFn = options.setIntervalFn
    ?? ((callback: () => void, ms: number) => setInterval(callback, ms));
  const clearIntervalFn = options.clearIntervalFn
    ?? ((timer: IntervalHandle) => clearInterval(timer));

  let stopped = false;
  let timer: IntervalHandle | null = null;

  const writeHeartbeat = (): void => {
    if (stopped) return;
    try {
      writeFile(options.filePath, now().toISOString());
    } catch {
      // Keep the interval alive so a later write can recover.
    }
  };

  const stop = (): void => {
    if (stopped) return;
    stopped = true;
    if (timer !== null) {
      clearIntervalFn(timer);
    }
    try {
      removeFile(options.filePath);
    } catch {
      // Shutdown must continue if the heartbeat file is already unavailable.
    }
  };

  writeHeartbeat();
  timer = setIntervalFn(writeHeartbeat, intervalMs);
  unrefInterval(timer);

  return { stop };
}
