// -------------------------------------------------------------------
// MODULE: Storage Ports - Contention Policy
// -------------------------------------------------------------------

import type { Awaitable } from './common.js';

/** Retry policy for transient storage contention. */
export interface ContentionRetryOptions {
  readonly attempts?: number;
  readonly delayMs?: number;
}

/** Execution metadata for contention-managed operations. */
export interface ContentionOperationOptions extends ContentionRetryOptions {
  readonly label?: string;
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
}
