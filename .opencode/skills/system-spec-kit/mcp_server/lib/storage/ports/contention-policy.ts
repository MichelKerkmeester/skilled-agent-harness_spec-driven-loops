// -------------------------------------------------------------------
// MODULE: Storage Ports - Contention Policy
// -------------------------------------------------------------------

import type { Awaitable } from './common.js';
import type Database from 'better-sqlite3';

export interface ContentionRetryContext {
  readonly attempt: number;
  readonly delayMs: number;
  readonly label?: string;
}

/** Retry policy for transient storage contention. */
export interface ContentionRetryOptions {
  readonly attempts?: number;
  readonly delayMs?: number | (() => number);
  readonly retryDelaysMs?: readonly number[];
  readonly retryable?: (error: unknown) => boolean;
  readonly sleep?: (ms: number) => Awaitable<void>;
  readonly sleepSync?: (ms: number) => void;
  readonly sync?: boolean;
  readonly shouldAbort?: () => boolean;
  readonly onRetry?: (error: unknown, context: ContentionRetryContext) => void;
}

/** Execution metadata for contention-managed operations. */
export interface ContentionOperationOptions extends ContentionRetryOptions {
  readonly label?: string;
}

export interface BusyTimeoutOptions {
  readonly ignoreErrors?: boolean;
}

/** Options for the better-sqlite3 contention adapter. */
export interface BetterSqliteContentionPolicyOptions {
  readonly database?: Database.Database;
  readonly retryable?: (error: unknown) => boolean;
  readonly sleep?: (ms: number) => Awaitable<void>;
  readonly sleepSync?: (ms: number) => void;
}

/** Port for retrying and serializing storage operations under contention. */
export interface ContentionPolicy {
  /** Run an operation through the configured contention retry policy. */
  withRetry<T>(
    operation: () => Awaitable<T>,
    options?: ContentionOperationOptions,
  ): Awaitable<T>;

  /** Run an operation in an exclusive write section when the backend has one. */
  withWriteLock<T>(
    operation: () => Awaitable<T>,
    options?: ContentionOperationOptions,
  ): Awaitable<T>;

  /** Apply a backend busy timeout when supported. */
  setBusyTimeout(
    database: Database.Database,
    timeoutMs: number,
    options?: BusyTimeoutOptions,
  ): void;
}

/** better-sqlite3 implementation of contention retry and write-lock policy. */
export class BetterSqliteContentionPolicy implements ContentionPolicy {
  private readonly database: Database.Database | undefined;
  private readonly retryable: (error: unknown) => boolean;
  private readonly sleep: (ms: number) => Awaitable<void>;
  private readonly sleepSync: (ms: number) => void;

  constructor(options: BetterSqliteContentionPolicyOptions = {}) {
    this.database = options.database;
    this.retryable = options.retryable ?? isSqliteContentionError;
    this.sleep = options.sleep ?? defaultSleep;
    this.sleepSync = options.sleepSync ?? defaultSleepSync;
  }

  withRetry<T>(
    operation: () => Awaitable<T>,
    options: ContentionOperationOptions = {},
  ): Awaitable<T> {
    if (options.sync) {
      return this.withRetrySync(operation as () => T, options);
    }
    return this.withRetryAsync(operation, options);
  }

  withWriteLock<T>(
    operation: () => Awaitable<T>,
    options: ContentionOperationOptions = {},
  ): Awaitable<T> {
    const database = this.database;
    if (!database || database.inTransaction) {
      return this.withRetry(operation, options);
    }

    return this.withRetry(() => runWithWriteLock(database, operation), options);
  }

  setBusyTimeout(
    database: Database.Database,
    timeoutMs: number,
    options: BusyTimeoutOptions = {},
  ): void {
    try {
      database.pragma(`busy_timeout = ${timeoutMs}`);
    } catch (error: unknown) {
      if (!options.ignoreErrors) {
        throw error;
      }
    }
  }

  private async withRetryAsync<T>(
    operation: () => Awaitable<T>,
    options: ContentionOperationOptions,
  ): Promise<T> {
    const retryable = options.retryable ?? this.retryable;
    const attempts = retryAttempts(options);
    for (let attemptIndex = 0; attemptIndex < attempts; attemptIndex += 1) {
      if (options.shouldAbort?.()) {
        return undefined as T;
      }
      try {
        return await operation();
      } catch (error: unknown) {
        const canRetry = retryable(error) && attemptIndex < attempts - 1;
        if (!canRetry) {
          throw error;
        }
        const delayMs = retryDelayMs(options, attemptIndex);
        options.onRetry?.(error, { attempt: attemptIndex + 1, delayMs, label: options.label });
        await (options.sleep ?? this.sleep)(delayMs);
        if (options.shouldAbort?.()) {
          return undefined as T;
        }
      }
    }
    throw new Error('BetterSqliteContentionPolicy.withRetry: unreachable');
  }

  private withRetrySync<T>(
    operation: () => T,
    options: ContentionOperationOptions,
  ): T {
    const retryable = options.retryable ?? this.retryable;
    const attempts = retryAttempts(options);
    for (let attemptIndex = 0; attemptIndex < attempts; attemptIndex += 1) {
      if (options.shouldAbort?.()) {
        return undefined as T;
      }
      try {
        return operation();
      } catch (error: unknown) {
        const canRetry = retryable(error) && attemptIndex < attempts - 1;
        if (!canRetry) {
          throw error;
        }
        const delayMs = retryDelayMs(options, attemptIndex);
        options.onRetry?.(error, { attempt: attemptIndex + 1, delayMs, label: options.label });
        (options.sleepSync ?? this.sleepSync)(delayMs);
        if (options.shouldAbort?.()) {
          return undefined as T;
        }
      }
    }
    throw new Error('BetterSqliteContentionPolicy.withRetrySync: unreachable');
  }
}

export function isSqliteContentionError(error: unknown): boolean {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? (error as { code?: unknown }).code
    : undefined;
  const message = error instanceof Error ? error.message : String(error);
  return code === 'SQLITE_BUSY'
    || code === 'SQLITE_LOCKED'
    || /\bSQLITE_BUSY\b|\bSQLITE_LOCKED\b|database is locked/i.test(message);
}

function retryAttempts(options: ContentionOperationOptions): number {
  const attempts = options.attempts ?? ((options.retryDelaysMs?.length ?? 0) + 1);
  return Math.max(1, attempts);
}

function retryDelayMs(options: ContentionOperationOptions, attemptIndex: number): number {
  const configuredDelay = options.retryDelaysMs?.[attemptIndex] ?? options.delayMs ?? 0;
  const delay = typeof configuredDelay === 'function' ? configuredDelay() : configuredDelay;
  return Math.max(0, delay);
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function defaultSleepSync(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function runWithWriteLock<T>(
  database: Database.Database,
  operation: () => Awaitable<T>,
): Awaitable<T> {
  database.exec('BEGIN IMMEDIATE');
  try {
    const result = operation();
    if (isPromiseLike(result)) {
      return result.then(
        (value) => {
          // Guard the async COMMIT too: a throw here would otherwise leak an
          // open transaction on the shared connection, after which later
          // write-lock attempts silently fall back to running inside it.
          try {
            database.exec('COMMIT');
            return value;
          } catch (commitError: unknown) {
            rollbackQuietly(database);
            throw commitError;
          }
        },
        (error: unknown) => {
          rollbackQuietly(database);
          throw error;
        },
      );
    }
    database.exec('COMMIT');
    return result;
  } catch (error: unknown) {
    rollbackQuietly(database);
    throw error;
  }
}

function isPromiseLike<T>(value: Awaitable<T>): value is Promise<T> {
  return typeof value === 'object'
    && value !== null
    && typeof (value as { then?: unknown }).then === 'function';
}

function rollbackQuietly(database: Database.Database): void {
  try {
    database.exec('ROLLBACK');
  } catch {
    // Ignore rollback errors after a failed write section.
  }
}
