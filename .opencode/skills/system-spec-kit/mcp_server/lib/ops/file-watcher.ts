// ───────────────────────────────────────────────────────────────
// MODULE: File Watcher
// ───────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { BetterSqliteContentionPolicy } from '../storage/ports/contention-policy.js';

// Feature catalog: Real-time filesystem watching with chokidar
// Feature catalog: Watcher delete/rename cleanup

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Describes the WatcherConfig shape.
 */
export interface WatcherConfig {
  paths: string[];
  reindexFn: (filePath: string) => Promise<unknown>;
  removeFn?: (filePath: string) => Promise<unknown>;
  debounceMs?: number;
  watchFactory?: (paths: string[], options: Record<string, unknown>) => FSWatcher;
}

/**
 * Describes the FSWatcher shape.
 */
export interface FSWatcher {
  on: (event: string, listener: (...args: unknown[]) => void) => FSWatcher;
  close: () => Promise<void>;
}

interface ChokidarModule {
  default: {
    watch: (paths: string[], options: Record<string, unknown>) => FSWatcher;
  };
}

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

const DEFAULT_DEBOUNCE_MS = 2000;
const RETRY_DELAYS_MS = [1000, 2000, 4000];
const MAX_BUSY_RETRIES = RETRY_DELAYS_MS.length;
const busyRetryPolicy = new BetterSqliteContentionPolicy({ retryable: isSqliteBusyError });

// Watcher metrics counters
let filesReindexed = 0;
let totalReindexTimeMs = 0;
let chokidarModule: ChokidarModule | null = null;
let chokidarModulePromise: Promise<ChokidarModule | null> | null = null;
let chokidarModuleLoadError: string | null = null;

/** Return accumulated watcher metrics for diagnostics. */
export function getWatcherMetrics(): { filesReindexed: number; avgReindexTimeMs: number } {
  return {
    filesReindexed,
    avgReindexTimeMs: filesReindexed > 0 ? Math.round(totalReindexTimeMs / filesReindexed) : 0,
  };
}

export function resetWatcherMetrics(): void {
  filesReindexed = 0;
  totalReindexTimeMs = 0;
}

/* ───────────────────────────────────────────────────────────────
   4. HELPERS
──────────────────────────────────────────────────────────────── */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Coordinates early wake-up of in-flight retry sleeps so a watcher shutdown
 * never has to wait for a pending backoff timer to expire. A retry sleep
 * registers a `wake` callback; `wakeAll()` settles every outstanding sleep
 * immediately, letting each one re-check its abort condition. This keeps
 * `close()` from blocking on a non-cancellable timer (and from deadlocking
 * under fake timers, where the backoff timeout would otherwise never fire).
 */
interface RetryWaker {
  register(wake: () => void): () => void;
  wakeAll(): void;
}

function createRetryWaker(): RetryWaker {
  const waiters = new Set<() => void>();
  let woken = false;
  return {
    register(wake: () => void): () => void {
      // Sticky after wakeAll(): a sleep entered after shutdown began is woken
      // at once, so a task that hits SQLITE_BUSY mid-close still exits promptly
      // instead of stalling close() on a fresh retry timer.
      if (woken) {
        wake();
        return () => undefined;
      }
      waiters.add(wake);
      return () => { waiters.delete(wake); };
    },
    wakeAll(): void {
      woken = true;
      const pending = Array.from(waiters);
      waiters.clear();
      for (const wake of pending) {
        wake();
      }
    },
  };
}

/**
 * Sleep that resolves either when `ms` elapses or when woken early via the
 * supplied waker. On early wake the backoff timer is cleared so no stray timer
 * survives shutdown.
 */
function abortableSleep(ms: number, waker?: RetryWaker): Promise<void> {
  if (!waker) {
    return sleep(ms);
  }
  return new Promise((resolve) => {
    let settled = false;
    let unregister = (): void => undefined;
    const finish = (): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      unregister();
      resolve();
    };
    const timer = setTimeout(finish, ms);
    unregister = waker.register(finish);
  });
}

async function loadChokidarModule(): Promise<ChokidarModule | null> {
  if (chokidarModule !== null) {
    return chokidarModule;
  }
  if (chokidarModulePromise !== null) {
    return chokidarModulePromise;
  }

  const loadPromise = (async (): Promise<ChokidarModule | null> => {
    try {
      chokidarModule = await import('chokidar') as ChokidarModule;
      chokidarModuleLoadError = null;
      return chokidarModule;
    } catch (error: unknown) {
      chokidarModuleLoadError = error instanceof Error ? error.message : String(error);
      return null;
    }
  })();

  chokidarModulePromise = loadPromise;
  try {
    return await loadPromise;
  } finally {
    if (chokidarModulePromise === loadPromise) {
      chokidarModulePromise = null;
    }
  }
}

function getWatchFactory(): (paths: string[], options: Record<string, unknown>) => FSWatcher {
  if (chokidarModule?.default?.watch) {
    return chokidarModule.default.watch;
  }

  if (chokidarModulePromise === null) {
    void loadChokidarModule();
  }
  const loadErrorSuffix = chokidarModuleLoadError
    ? ` Last module resolution error: ${chokidarModuleLoadError}`
    : '';
  throw new Error(`chokidar module is still loading or unavailable; retry startFileWatcher once lazy import completes.${loadErrorSuffix}`);
}

function isDotfilePath(filePath: string): boolean {
  const parts = filePath
    .split(/[/\\]/)
    .filter((part) => part.length > 0);

  for (const part of parts) {
    if (!part.startsWith('.') || part.length <= 1) {
      continue;
    }

    // The hidden workspace control root stores first-class Spec Kit assets.
    // Treating it as a dotfile path would suppress watcher events and break
    // auto re-indexing in default layouts.
    if (part === '.opencode') {
      continue;
    }

    return true;
  }

  return false;
}

function isMarkdownPath(filePath: string): boolean {
  return filePath.toLowerCase().endsWith('.md');
}

function shouldIgnoreWatchTarget(targetPath: string): boolean {
  if (isDotfilePath(targetPath)) return true;
  const basename = path.basename(targetPath);
  return basename.startsWith('.');
}

function getWatchScopedPath(targetPath: string, watchRoots: string[]): string | null {
  const resolvedTarget = path.resolve(targetPath);

  for (const watchRoot of watchRoots) {
    const relativeTarget = path.relative(watchRoot, resolvedTarget);
    const isWithinRoot = relativeTarget === '' || (
      !relativeTarget.startsWith(`..${path.sep}`) &&
      relativeTarget !== '..' &&
      !path.isAbsolute(relativeTarget)
    );

    if (isWithinRoot) {
      return relativeTarget;
    }
  }

  return null;
}

function isSqliteBusyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: unknown })?.code;
  return code === 'SQLITE_BUSY' || /SQLITE_BUSY/i.test(message);
}

async function hashFileContent(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return createHash('sha256').update(content).digest('hex');
}

interface BusyRetryOptions {
  shouldAbort?: () => boolean;
  waker?: RetryWaker;
}

async function withBusyRetry(
  operation: () => Promise<void>,
  options: BusyRetryOptions = {},
): Promise<void> {
  const { shouldAbort, waker } = options;
  await busyRetryPolicy.withRetry(operation, {
    attempts: MAX_BUSY_RETRIES + 1,
    retryDelaysMs: RETRY_DELAYS_MS,
    shouldAbort,
    sleep: (ms) => abortableSleep(ms, waker),
  });
}

/* ───────────────────────────────────────────────────────────────
   5. WATCHER CORE
──────────────────────────────────────────────────────────────── */

/**
 * Provides the startFileWatcher helper.
 */
export function startFileWatcher(config: WatcherConfig): FSWatcher {
  const watchFactory = config.watchFactory ?? getWatchFactory();

  const debounceMs = config.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const watchRoots = config.paths.map((watchPath) => path.resolve(watchPath));
  const debounceTimers = new Map<string, NodeJS.Timeout>();
  const contentHashes = new Map<string, string>();
  const canonicalPaths = new Map<string, string>();
  const inFlightReindex = new Set<Promise<void>>();
  let isClosing = false;
  // Wakes in-flight SQLITE_BUSY backoff sleeps on close() so shutdown never
  // blocks on a pending retry timer.
  const retryWaker = createRetryWaker();

  // C3 fix: Bounded concurrency — prevent unbounded parallel reindex operations
  const MAX_CONCURRENT_REINDEX = 2;
  // Cap the pending-slot queue so a runaway watcher event storm
  // can't grow the wait list without bound. 1000 pending entries is generous
  // enough for ordinary workloads (debounceTimers already coalesces by file
  // path upstream so each slot maps to one distinct file's reindex turn) but
  // keeps a runaway loop from leaking memory until OOM. When the queue is at
  // cap the OLDEST waiter is rejected — newer events represent fresher state,
  // and the dropped waiter's caller has its own catch path that tolerates
  // QUEUE_OVERFLOW. On close() every queued waiter is rejected with the same
  // sentinel so dependent code can exit early without hanging.
  const MAX_PENDING_REINDEX_SLOTS = 1000;
  const QUEUE_OVERFLOW_REASON = 'file-watcher reindex queue overflow';
  const QUEUE_CLOSED_REASON = 'file-watcher closed before queued reindex ran';
  interface QueuedSlot {
    readonly resolve: () => void;
    readonly reject: (reason: Error) => void;
  }
  let activeReindexCount = 0;
  const pendingReindexSlots: QueuedSlot[] = [];

  function acquireReindexSlot(): Promise<void> {
    if (isClosing) {
      return Promise.reject(new Error(QUEUE_CLOSED_REASON));
    }
    if (activeReindexCount < MAX_CONCURRENT_REINDEX) {
      activeReindexCount++;
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      // Drop the oldest waiter when the queue is at cap; the
      // displaced waiter's wrapping operation should treat the sentinel error
      // as a recoverable signal (skip this round, debounce will re-fire on the
      // next change).
      if (pendingReindexSlots.length >= MAX_PENDING_REINDEX_SLOTS) {
        const dropped = pendingReindexSlots.shift();
        if (dropped) {
          dropped.reject(new Error(QUEUE_OVERFLOW_REASON));
        }
      }
      pendingReindexSlots.push({
        resolve: () => { activeReindexCount++; resolve(); },
        reject,
      });
    });
  }

  function releaseReindexSlot(): void {
    activeReindexCount--;
    const next = pendingReindexSlots.shift();
    if (next) next.resolve();
  }

  // Drain the pending-slot queue on close() so the watcher does
  // not silently leak Promises. Every queued waiter rejects with the same
  // sentinel; the wrapping `operation()` catch in scheduleTask logs and exits
  // cleanly. The active count is intentionally NOT decremented here — those
  // slots are owned by in-flight reindex tasks and `releaseReindexSlot()` runs
  // in their finally blocks.
  function abortPendingReindexQueue(): void {
    while (pendingReindexSlots.length > 0) {
      const slot = pendingReindexSlots.shift();
      if (slot) {
        slot.reject(new Error(QUEUE_CLOSED_REASON));
      }
    }
  }

  // AbortController per file path for cancellation of stale reindex
  const activeAbortControllers = new Map<string, AbortController>();

  const trackInFlight = (task: Promise<void>): void => {
    inFlightReindex.add(task);
    void task.finally(() => {
      inFlightReindex.delete(task);
    });
  };

  const watcher = watchFactory(config.paths, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 1000 },
    ignored: (targetPath: string) => {
      return shouldIgnoreWatchTarget(getWatchScopedPath(targetPath, watchRoots) ?? targetPath);
    },
    followSymlinks: false,
  });

  const scheduleTask = (
    targetPath: unknown,
    operation: () => Promise<void>,
  ): void => {
    if (typeof targetPath !== 'string') {
      return;
    }
    if (isClosing) {
      return;
    }

    const filePath = targetPath;
    const watchScopedPath = getWatchScopedPath(filePath, watchRoots);

    if (!isMarkdownPath(filePath) || shouldIgnoreWatchTarget(watchScopedPath ?? filePath)) {
      return;
    }

    const existing = debounceTimers.get(filePath);
    if (existing) {
      clearTimeout(existing);
    }

    const timeout = setTimeout(() => {
      debounceTimers.delete(filePath);
      if (isClosing) {
        return;
      }

      const task = operation().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        // Queue-overflow and queue-closed errors are expected
        // outcomes of the bounded-queue policy, not failures. Log them at a
        // lower severity so storms do not drown legitimate task warnings.
        if (message === QUEUE_OVERFLOW_REASON || message === QUEUE_CLOSED_REASON) {
          console.error(`[file-watcher] Skipped queued reindex for ${path.basename(filePath)}: ${message}`);
          return;
        }
        console.warn(`[file-watcher] Watch task failed for ${path.basename(filePath)}: ${message}`);
      });
      trackInFlight(task);
    }, debounceMs);

    debounceTimers.set(filePath, timeout);
  };

  const scheduleReindex = (targetPath: unknown, options: { force?: boolean } = {}): void => {
    const filePath = typeof targetPath === 'string' ? targetPath : null;
    const forceReindex = options.force === true;

    // Abort any in-flight reindex for this same file before scheduling new one
    if (filePath) {
      const prev = activeAbortControllers.get(filePath);
      if (prev) prev.abort();
    }

    scheduleTask(targetPath, async () => {
      if (!filePath) {
        return;
      }

      const controller = new AbortController();
      activeAbortControllers.set(filePath, controller);

      try {
        let resolvedPath: string;
        try {
          resolvedPath = await fs.realpath(filePath);
        } catch (realpathErr: unknown) {
          const code = realpathErr instanceof Error && 'code' in realpathErr && typeof realpathErr.code === 'string'
            ? realpathErr.code
            : undefined;
          if (code === 'ENOENT') return;
          throw realpathErr;
        }

        if (controller.signal.aborted) return;
        activeAbortControllers.set(resolvedPath, controller);
        canonicalPaths.set(filePath, resolvedPath);
        canonicalPaths.set(resolvedPath, resolvedPath);

        const containmentRoots = await Promise.all(config.paths.map(async (root) => {
          const normalizedRoot = path.resolve(root);
          try {
            return await fs.realpath(normalizedRoot);
          } catch (rootErr: unknown) {
            const code = rootErr instanceof Error && 'code' in rootErr && typeof rootErr.code === 'string'
              ? rootErr.code
              : undefined;
            if (code === 'ENOENT') return normalizedRoot;
            throw rootErr;
          }
        }));
        const isContained = containmentRoots.some((root) => {
          const rootPrefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
          return resolvedPath === root || resolvedPath.startsWith(rootPrefix);
        });
        if (!isContained) {
          console.warn(`[file-watcher] Skipping reindex outside watch roots: ${path.basename(filePath)}`);
          return;
        }

        // Handle ENOENT gracefully when a file is rapidly
        // Created then deleted before the debounce timer fires.
        let nextHash: string;
        try {
          nextHash = await hashFileContent(resolvedPath);
        } catch (hashErr: unknown) {
          const code = hashErr instanceof Error && 'code' in hashErr && typeof hashErr.code === 'string'
            ? hashErr.code
            : undefined;
          if (code === 'ENOENT') return; // File was deleted — silently ignore
          throw hashErr;
        }

        if (controller.signal.aborted) return;

        if (!forceReindex) {
          const previousHash = contentHashes.get(resolvedPath);
          if (previousHash && previousHash === nextHash) {
            return;
          }
        }

        // C3: Acquire concurrency slot before CPU-intensive reindex
        await acquireReindexSlot();
        try {
          if (controller.signal.aborted) return;

          const reindexStart = Date.now();
          await withBusyRetry(async () => {
            await config.reindexFn(resolvedPath);
          }, { shouldAbort: () => isClosing, waker: retryWaker });
          if (isClosing) return;
          const reindexElapsed = Date.now() - reindexStart;
          filesReindexed++;
          totalReindexTimeMs += reindexElapsed;
          console.error(`[file-watcher] Reindexed ${path.basename(resolvedPath)} in ${reindexElapsed}ms (total: ${filesReindexed} files, avg: ${Math.round(totalReindexTimeMs / filesReindexed)}ms)`);

          contentHashes.set(resolvedPath, nextHash);
        } finally {
          releaseReindexSlot();
        }
      } finally {
        if (activeAbortControllers.get(filePath) === controller) {
          activeAbortControllers.delete(filePath);
        }
        const resolvedPath = canonicalPaths.get(filePath);
        if (resolvedPath && activeAbortControllers.get(resolvedPath) === controller) {
          activeAbortControllers.delete(resolvedPath);
        }
      }
    });
  };

  const scheduleRemove = (targetPath: unknown): void => {
    const filePath = typeof targetPath === 'string' ? targetPath : null;

    scheduleTask(targetPath, async () => {
      if (!filePath) {
        return;
      }

      const canonicalPath = canonicalPaths.get(filePath) ?? filePath;
      contentHashes.delete(canonicalPath);
      contentHashes.delete(filePath);
      canonicalPaths.delete(filePath);
      if (canonicalPath !== filePath) {
        canonicalPaths.delete(canonicalPath);
      }
      if (!config.removeFn) {
        return;
      }

      await withBusyRetry(async () => {
        await config.removeFn?.(filePath);
      }, { shouldAbort: () => isClosing, waker: retryWaker });
      if (isClosing) return;
      console.error(`[file-watcher] Removed indexed entries for ${path.basename(filePath)}`);
    });
  };

  watcher.on('add', (targetPath: unknown) => {
    scheduleReindex(targetPath, { force: true });
  });
  watcher.on('change', (targetPath: unknown) => {
    scheduleReindex(targetPath);
  });
  watcher.on('unlink', (targetPath: unknown) => {
    scheduleRemove(targetPath);
  });
  watcher.on('error', (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[file-watcher] Watcher error: ${message}`);
  });

  const originalClose = watcher.close.bind(watcher);
  watcher.close = async () => {
    isClosing = true;
    for (const timeout of debounceTimers.values()) {
      clearTimeout(timeout);
    }
    debounceTimers.clear();

    // Drop every queued slot waiter before settling in-flight
    // work. The waiters reject with QUEUE_CLOSED_REASON; their wrapping
    // operation()s catch and log without re-entering the watcher.
    abortPendingReindexQueue();

    // Wake any in-flight SQLITE_BUSY backoff sleeps so a task mid-retry exits
    // immediately (it re-checks isClosing) instead of holding close() until a
    // non-cancellable retry timer expires.
    retryWaker.wakeAll();

    while (inFlightReindex.size > 0) {
      await Promise.allSettled(Array.from(inFlightReindex));
    }

    await originalClose();
  };

  return watcher;
}

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

/**
 * Defines the __testables constant.
 */
export const __testables = {
  getWatchScopedPath,
  isDotfilePath,
  isMarkdownPath,
  shouldIgnoreWatchTarget,
  isSqliteBusyError,
  resetWatcherMetrics,
};
