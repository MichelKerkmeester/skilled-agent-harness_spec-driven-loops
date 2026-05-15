import type { RetryConfig, ErrorClassification, RetryOptions } from '../types.js';
/** Defines default config. */
export declare const DEFAULT_CONFIG: RetryConfig;
/** Defines transient http status codes. */
export declare const TRANSIENT_HTTP_STATUS_CODES: Set<number>;
/** Defines permanent http status codes. */
export declare const PERMANENT_HTTP_STATUS_CODES: Set<number>;
/** Defines transient network errors. */
export declare const TRANSIENT_NETWORK_ERRORS: Set<string>;
/** Defines transient error patterns. */
export declare const TRANSIENT_ERROR_PATTERNS: readonly RegExp[];
/** Defines permanent error patterns. */
export declare const PERMANENT_ERROR_PATTERNS: readonly RegExp[];
interface ErrorWithStatus extends Error {
    status?: number;
    statusCode?: number;
    code?: string;
    response?: {
        status: number;
    };
    cause?: unknown;
}
/** Extract status code. */
export declare function extractStatusCode(error: ErrorWithStatus): number | null;
/** Extract error code. */
export declare function extractErrorCode(error: ErrorWithStatus): string | null;
/** Classify error. */
export declare function classifyError(error: Error | null): ErrorClassification;
/** Is transient error. */
export declare function isTransientError(error: Error): boolean;
/** Is permanent error. */
export declare function isPermanentError(error: Error): boolean;
/** Provides calculate backoff. */
export declare function calculateBackoff(attempt: number, config?: RetryConfig): number;
/** Get backoff sequence. */
export declare function getBackoffSequence(config?: RetryConfig): number[];
/** Sleep. */
export declare function sleep(ms: number): Promise<void>;
/** Provides retry with backoff. */
export declare function retryWithBackoff<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
/** Provides with retry. */
export declare function withRetry<T, TArgs extends unknown[]>(fn: (...args: TArgs) => Promise<T>, options?: RetryOptions): (...args: TArgs) => Promise<T>;
export {};
//# sourceMappingURL=retry.d.ts.map