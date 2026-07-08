// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Atomic State
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Options for deferred atomic snapshot writes. */
export interface DeferredAtomicWriterOptions {
  readonly debounceMs?: number;
}

/** Options for diff-gated JSONL appends. */
export interface AppendJsonlIfChangedAtomicOptions {
  readonly cache?: Map<string, string>;
  readonly diffData?: unknown;
  readonly diffField?: string;
}

/** Debounced writer for replace-style JSON state snapshots. */
export interface DeferredAtomicWriter {
  write(data: unknown): void;
  flushNow(): Promise<void>;
  close(): Promise<void>;
}

const DEFAULT_DEFERRED_WRITE_DEBOUNCE_MS = 50;
const DIFF_FIELD_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/u;

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

const serializedStateCache = new Map<string, string>();
const serializedJsonlAppendCache = new Map<string, string>();

function canonicalizeJson(value: unknown, isRoot = false): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => canonicalizeJson(entry));
  }

  if (typeof value !== 'object' || value === null) {
    return value;
  }

  const source = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};

  for (const key of Object.keys(source).sort()) {
    if (isRoot && key === '_integrity') {
      continue;
    }

    sorted[key] = canonicalizeJson(source[key]);
  }

  return sorted;
}

function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fsyncPath(path: string): void {
  let fd: number | undefined;
  try {
    fd = openSync(path, 'r');
    fsyncSync(fd);
  } finally {
    if (typeof fd === 'number') {
      closeSync(fd);
    }
  }
}

function makeTempPath(targetPath: string): string {
  return `${targetPath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
}

function serializeState(data: unknown): string {
  const serialized = JSON.stringify(data);
  if (typeof serialized !== 'string') {
    throw new TypeError('State data must serialize to JSON.');
  }
  return serialized;
}

function serializePrettyState(data: unknown): string {
  const serialized = JSON.stringify(data, null, 2);
  if (typeof serialized !== 'string') {
    throw new TypeError('State data must serialize to JSON.');
  }
  return `${serialized}\n`;
}

function appendTextWithFsync(path: string, content: string): void {
  let fd: number | undefined;

  mkdirSync(dirname(path), { recursive: true });
  try {
    fd = openSync(path, 'a');
    writeFileSync(fd, content, 'utf8');
    fsyncSync(fd);
  } finally {
    if (typeof fd === 'number') {
      closeSync(fd);
    }
  }

  try {
    fsyncPath(dirname(path));
  } catch {
  }
}

function readLastJsonlLine(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  const lines = readFileSync(path, 'utf8').split(/\r?\n/u);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index].trim();
    if (line !== '') {
      return line;
    }
  }
  return null;
}

function readLastDiffFingerprint(path: string, diffField: string | undefined): string | null {
  const line = readLastJsonlLine(path);
  if (line === null) {
    return null;
  }

  if (diffField === undefined) {
    return line;
  }

  try {
    const parsed = JSON.parse(line) as unknown;
    if (isJsonRecord(parsed) && typeof parsed[diffField] === 'string') {
      return parsed[diffField];
    }
  } catch {
  }

  return null;
}

function computeSerializedHash(serialized: string): string {
  const digest = createHash('sha256').update(serialized).digest('hex');
  return `sha256:${digest}`;
}

function attachDiffField(data: unknown, diffField: string | undefined, fingerprint: string): unknown {
  if (diffField === undefined) {
    return data;
  }

  if (!DIFF_FIELD_PATTERN.test(diffField)) {
    throw new TypeError('Diff field must be a valid JSON object key.');
  }

  if (!isJsonRecord(data)) {
    throw new TypeError('Diff field requires JSON object row data.');
  }

  return { ...data, [diffField]: fingerprint };
}

function serializeIntegrityPayload(data: unknown): string {
  const serialized = JSON.stringify(canonicalizeJson(data, true));
  if (typeof serialized !== 'string') {
    throw new TypeError('State data must serialize to JSON.');
  }
  return serialized;
}

// ───────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ───────────────────────────────────────────────────────────────────

/**
 * Compute a deterministic SHA-256 digest for JSON state.
 *
 * The root `_integrity` field is excluded so stamped snapshots can verify
 * against the same payload that produced their stored hash.
 *
 * @param obj - JSON-serializable object or registry snapshot.
 * @returns Digest formatted as `sha256:<hex>`.
 * @throws If the input cannot be serialized as JSON.
 */
export function computeIntegrityHash(obj: unknown): string {
  const digest = createHash('sha256').update(serializeIntegrityPayload(obj)).digest('hex');
  return `sha256:${digest}`;
}

/**
 * Attach an integrity stamp to a JSON object before writing it.
 *
 * This mutates the provided object so callers can stamp existing state
 * snapshots without changing their write path.
 *
 * @param obj - JSON object to stamp.
 * @returns The same object with `_integrity` set.
 */
export function stampIntegrity<T extends object>(obj: T): T & { _integrity: string } {
  const stamped = obj as T & { _integrity: string };
  stamped._integrity = computeIntegrityHash(obj);
  return stamped;
}

/**
 * Verify a stamped JSON object and warn rather than throw on mismatch.
 *
 * This helper is for whole-object registry/config snapshots only. Append-only
 * JSONL needs a deferred sidecar or per-record design, so this function does
 * not stamp or validate JSONL streams. A mismatch is warning-only for now;
 * blocking mutation is a follow-up once operators have confirmed warnings
 * surface reliably in practice.
 *
 * @param obj - Stamped JSON object to verify.
 * @returns True when the stored integrity hash matches; false otherwise.
 */
export function verifyIntegrity(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    console.warn('[deep-loop] State integrity check skipped: expected stamped object state.');
    return false;
  }

  const storedIntegrity = (obj as Record<string, unknown>)._integrity;
  const computedIntegrity = computeIntegrityHash(obj);

  if (storedIntegrity === computedIntegrity) {
    return true;
  }

  console.warn('[deep-loop] State integrity mismatch detected; continuing with on-disk state.', {
    stored: typeof storedIntegrity === 'string' ? storedIntegrity : null,
    computed: computedIntegrity,
  });
  return false;
}

/**
 * Atomically write JSON-serializable state to a file.
 *
 * Writes to a temp file first, fsyncs it, then renames onto the target
 * so readers always see either the previous complete file or the new one.
 * Prefer writeStateIfChangedAtomic for production snapshot writes so
 * unchanged state does not pay the fsync + rename cost.
 *
 * @param path - Target file path.
 * @param data - Serializable data to write.
 * @throws If write, fsync, or rename fails.
 */
export function writeStateAtomic(path: string, data: unknown): void {
  writeTextAtomic(path, serializePrettyState(data));
}

/**
 * Atomically write JSON-serializable state only when its serialized form changed.
 *
 * The cache is keyed by the resolved target path so equivalent relative paths
 * share the same skip decision.
 *
 * @param path - Target file path.
 * @param data - Serializable data to write.
 * @param cache - Optional cache override for isolated callers or tests.
 * @returns True when a write occurred; false when unchanged state was skipped.
 * @throws If serialization, write, fsync, or rename fails.
 */
export function writeStateIfChangedAtomic(
  path: string,
  data: unknown,
  cache: Map<string, string> = serializedStateCache,
): boolean {
  const targetPath = resolve(path);
  const serialized = serializeState(data);

  if (cache.get(targetPath) === serialized) {
    return false;
  }

  writeStateAtomic(targetPath, data);
  cache.set(targetPath, serialized);
  return true;
}

/**
 * Append a JSONL row only when a stable serialized diff has changed.
 *
 * The optional diff field persists the fingerprint on the row so short-lived
 * command processes can compare against the last ledger write without sharing
 * in-memory cache state.
 *
 * @param path - Target JSONL path.
 * @param data - Serializable row data to append.
 * @param options - Optional cache, diff payload, and persisted diff field.
 * @returns True when a row was appended; false when unchanged state was skipped.
 * @throws If serialization, read, append, or fsync fails.
 */
export function appendJsonlIfChangedAtomic(
  path: string,
  data: unknown,
  options: AppendJsonlIfChangedAtomicOptions = {},
): boolean {
  const targetPath = resolve(path);
  const cache = options.cache ?? serializedJsonlAppendCache;
  const cacheKey = `${targetPath}\0${options.diffField ?? ''}`;
  const diffSerialized = serializeState(options.diffData ?? data);
  const diffFingerprint = options.diffField === undefined
    ? diffSerialized
    : computeSerializedHash(diffSerialized);

  if (cache.get(cacheKey) === diffFingerprint) {
    return false;
  }

  if (readLastDiffFingerprint(targetPath, options.diffField) === diffFingerprint) {
    cache.set(cacheKey, diffFingerprint);
    return false;
  }

  const row = attachDiffField(data, options.diffField, diffFingerprint);
  const serializedRow = serializeState(row);
  const currentContent = existsSync(targetPath) ? readFileSync(targetPath, 'utf8') : '';
  const separator = currentContent === '' || currentContent.endsWith('\n') ? '' : '\n';

  appendTextWithFsync(targetPath, `${separator}${serializedRow}\n`);
  cache.set(cacheKey, diffFingerprint);
  return true;
}

/**
 * Create a debounced atomic writer for replace-style JSON snapshots.
 *
 * The default debounce window is 50 ms. Writes during that window supersede
 * older pending state, so callers must use `flushNow()` or `close()` from
 * process-exit handlers to avoid losing the final in-memory version on crash.
 * Append-only JSONL streams should keep immediate append semantics instead of
 * using this coalescing path.
 *
 * @param path - Target file path.
 * @param options - Optional debounce configuration.
 * @returns Deferred writer bound to the resolved target path.
 */
export function createDeferredAtomicWriter(
  path: string,
  options: DeferredAtomicWriterOptions = {},
): DeferredAtomicWriter {
  const targetPath = resolve(path);
  const debounceMs = Math.max(0, options.debounceMs ?? DEFAULT_DEFERRED_WRITE_DEBOUNCE_MS);
  let pendingContent: string | null = null;
  let pendingVersion = 0;
  let flushTimer: ReturnType<typeof setTimeout> | null = null;
  let flushPromise: Promise<void> | null = null;
  let hasLastFlushError = false;
  let lastFlushError: unknown = null;
  let isClosed = false;

  function clearFlushTimer(): void {
    if (flushTimer !== null) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
  }

  function scheduleFlush(): void {
    if (flushTimer !== null || flushPromise !== null || isClosed) {
      return;
    }

    flushTimer = setTimeout(() => {
      flushTimer = null;
      void drainPendingWrites().catch((error: unknown) => {
        hasLastFlushError = true;
        lastFlushError = error;
        console.error('[deep-loop] Deferred atomic writer flush failed.', error);
      });
    }, debounceMs);
  }

  async function drainPendingWrites(): Promise<void> {
    if (flushPromise !== null) {
      await flushPromise;
      if (pendingContent !== null) {
        await drainPendingWrites();
      }
      return;
    }

    if (pendingContent === null) {
      return;
    }

    const activeFlush = (async (): Promise<void> => {
      while (pendingContent !== null) {
        const content = pendingContent;
        const capturedVersion = pendingVersion;

        // Give same-turn callers a chance to mark the writer dirty again.
        await Promise.resolve();

        writeTextAtomic(targetPath, content);

        if (pendingVersion === capturedVersion) {
          pendingContent = null;
        }
      }
    })();

    flushPromise = activeFlush;
    try {
      await activeFlush;
    } finally {
      if (flushPromise === activeFlush) {
        flushPromise = null;
      }
    }
  }

  async function flushNow(): Promise<void> {
    clearFlushTimer();
    if (hasLastFlushError) {
      hasLastFlushError = false;
      const error = lastFlushError;
      lastFlushError = null;
      throw error;
    }
    await drainPendingWrites();
  }

  return {
    write(data: unknown): void {
      if (isClosed) {
        throw new Error('Deferred atomic writer is closed.');
      }

      pendingContent = serializePrettyState(data);
      pendingVersion += 1;
      scheduleFlush();
    },

    flushNow,

    async close(): Promise<void> {
      isClosed = true;
      await flushNow();
    },
  };
}

/**
 * Atomically write a text payload to a file.
 *
 * Same temp + fsync + rename guarantee as writeStateAtomic, but for
 * already-serialized content (e.g. markdown) that must not be re-encoded
 * as JSON. Readers always see either the previous complete file or the
 * new one, never a torn mid-write tail.
 *
 * @param path - Target file path.
 * @param content - Exact bytes to write.
 * @throws If write, fsync, or rename fails.
 */
export function writeTextAtomic(path: string, content: string): void {
  const tempPath = makeTempPath(path);

  try {
    writeFileSync(tempPath, content, 'utf8');
    fsyncPath(tempPath);
    renameSync(tempPath, path);
    try {
      fsyncPath(dirname(path));
    } catch {
    }
  } catch (error: unknown) {
    if (existsSync(tempPath)) {
      rmSync(tempPath, { force: true });
    }
    throw error;
  }
}
