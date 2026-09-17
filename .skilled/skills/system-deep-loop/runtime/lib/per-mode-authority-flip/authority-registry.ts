// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip — Durable Authority Registry
// ───────────────────────────────────────────────────────────────────
//
// One durable, mode-keyed authority record per canonical workstream, with
// monotonic-epoch compare-and-swap and crash-safe atomic writes. A mode
// this registry has never written reads back as its default:
// `legacy_authoritative` at epoch 1, selected writer `legacy`. The coordinator
// factory can bind this store to production roots; tests use isolated
// temporary roots to prove the crash-safe behavior independently.

import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { writeCanonicalJsonAtomic } from '../locks-and-fencing/durable-file.js';
import { isValidAuthorityRecord } from './authority-selector.js';
import { AUTHORITY_FLIP_SCHEMA_VERSION } from './types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type { AuthorityRecord, AuthorityRoute, CutoverCertificateMode } from './types.js';
import { AuthorityFlipError } from './types.js';

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

/** A lock older than this, or whose owning process is confirmed dead, is reclaimable. */
const DEFAULT_STALE_LOCK_TTL_MS = 10 * 60 * 1000;

interface LockHolderRecord {
  readonly pid: number;
  readonly acquiredAt: string;
}

function isLockHolderRecord(value: unknown): value is LockHolderRecord {
  return typeof value === 'object' && value !== null
    && Number.isSafeInteger((value as Partial<LockHolderRecord>).pid)
    && typeof (value as Partial<LockHolderRecord>).acquiredAt === 'string'
    && !Number.isNaN(Date.parse((value as LockHolderRecord).acquiredAt));
}

/** A dead PID reports `ESRCH`; anything else (alive, or unknown/EPERM) is treated as live. */
function isPidAlive(pid: number): boolean {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error: unknown) {
    return (error as NodeJS.ErrnoException | undefined)?.code !== 'ESRCH';
  }
}

function defaultRecord(mode: CutoverCertificateMode, now: string): AuthorityRecord {
  const core = Object.freeze({
    schemaVersion: AUTHORITY_FLIP_SCHEMA_VERSION,
    mode,
    state: 'legacy_authoritative' as const,
    epoch: 1,
    selectedWriter: 'legacy' as const,
    candidateSha: null,
    policyVersion: 0,
    cutoverCertificateDigest: null,
    lastTransitionDigest: null,
    updatedAt: now,
  });
  return Object.freeze({ ...core, recordDigest: digest(core) });
}

export interface AuthorityCompareAndSwapInput {
  readonly mode: CutoverCertificateMode;
  readonly expectedState: 'cutover_ready';
  readonly expectedEpoch: number;
  readonly nextSelectedWriter: AuthorityRoute;
  readonly candidateSha: string;
  readonly policyVersion: number;
  readonly cutoverCertificateDigest: string;
  readonly lastTransitionDigest: string;
  readonly at: string;
}

/**
 * Every durable fact `compareAndSwap` needs to finish a forward transition,
 * captured before the ledger append so a crash between the append and the
 * registry publish can be completed or aborted from disk alone — without
 * requiring the original caller's request object to be replayed.
 */
export interface AuthorityPendingTransition extends AuthorityCompareAndSwapInput {
  readonly preparedAt: string;
}

/**
 * The only writer identities a durable authority record may ever carry. Both
 * the live compare-and-swap input and the crash-recovery replay of a pending
 * transition route through this one predicate so the write path and the
 * recovery path can never again accept different writer sets: the original
 * defect was the live path writing a value the recovery path would refuse,
 * leaving a record every subsequent read rejected as malformed.
 */
function isAdmittedAuthorityWriter(value: unknown): value is AuthorityRoute {
  return value === 'legacy' || value === 'dark';
}

function isValidPendingTransition(value: unknown): value is AuthorityPendingTransition {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Partial<AuthorityPendingTransition>;
  return record.expectedState === 'cutover_ready'
    && typeof record.mode === 'string'
    && Number.isSafeInteger(record.expectedEpoch)
    && isAdmittedAuthorityWriter(record.nextSelectedWriter)
    && typeof record.candidateSha === 'string'
    && Number.isSafeInteger(record.policyVersion)
    && typeof record.cutoverCertificateDigest === 'string'
    && typeof record.lastTransitionDigest === 'string'
    && typeof record.at === 'string'
    && typeof record.preparedAt === 'string';
}

/** File-scoped, lock-guarded, mode-keyed authority CAS store. */
export class AuthorityRegistry {
  readonly #root: string;
  readonly #now: () => Date;
  readonly #staleLockTtlMs: number;

  public constructor(
    rootDirectory: string,
    now: () => Date = () => new Date(),
    staleLockTtlMs: number = DEFAULT_STALE_LOCK_TTL_MS,
  ) {
    mkdirSync(rootDirectory, { recursive: true, mode: 0o700 });
    this.#root = rootDirectory;
    this.#now = now;
    this.#staleLockTtlMs = staleLockTtlMs;
  }

  #recordPath(mode: CutoverCertificateMode): string {
    return join(this.#root, `authority-${mode}.json`);
  }

  #transactionLockPath(): string {
    return join(this.#root, 'authority-flip-transaction.lock');
  }

  #pendingTransitionPath(mode: CutoverCertificateMode): string {
    return join(this.#root, `authority-flip-prepare-${mode}.json`);
  }

  /** True once the owning process is confirmed dead or the lock has aged past the TTL. */
  #isLockStale(lockPath: string): boolean {
    let raw: string;
    try {
      raw = readFileSync(lockPath, 'utf8');
    } catch {
      return false;
    }
    let parsed: unknown;
    try {
      parsed = raw.trim().length > 0 ? JSON.parse(raw) : null;
    } catch {
      // Malformed lock content never auto-reclaims: a stranger process using
      // a different lock protocol, or genuine corruption, fails loud rather
      // than being silently displaced.
      return false;
    }
    if (!isLockHolderRecord(parsed)) return false;
    const ownerAlive = isPidAlive(parsed.pid);
    const ageMs = this.#now().getTime() - Date.parse(parsed.acquiredAt);
    return !ownerAlive || (Number.isFinite(ageMs) && ageMs > this.#staleLockTtlMs);
  }

  /**
   * Open the lock file exclusively, retrying exactly once after reclaiming a
   * confirmed-stale holder. A live, non-stale holder still fails closed
   * immediately — this only recovers a genuinely abandoned lock (the owning
   * process is dead, or its lease aged out), never a real live conflict.
   */
  #acquireLock(
    lockPath: string,
    conflictMessage: string,
    details: Readonly<Record<string, boolean | number | string>>,
  ): number {
    const payload = JSON.stringify({ pid: process.pid, acquiredAt: this.#now().toISOString() } satisfies LockHolderRecord);
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const descriptor = openSync(lockPath, 'wx', 0o600);
        writeFileSync(descriptor, payload);
        return descriptor;
      } catch (error: unknown) {
        const code = (error as NodeJS.ErrnoException | undefined)?.code;
        if (code !== 'EEXIST') throw new AuthorityFlipError('ACTIVE_TRANSACTION_CONFLICT', conflictMessage, details);
        if (attempt === 0 && this.#isLockStale(lockPath)) {
          try {
            unlinkSync(lockPath);
          } catch {
            // Someone else reclaimed it first; fall through to a normal retry.
          }
          continue;
        }
        throw new AuthorityFlipError('ACTIVE_TRANSACTION_CONFLICT', conflictMessage, details);
      }
    }
    throw new AuthorityFlipError('ACTIVE_TRANSACTION_CONFLICT', conflictMessage, details);
  }

  #releaseLock(descriptor: number, lockPath: string): void {
    closeSync(descriptor);
    try {
      unlinkSync(lockPath);
    } catch {
      // Best-effort cleanup only; a leaked lock file is still recoverable
      // through the stale-lock reclaim path on the next acquisition attempt.
    }
  }

  /** Read the durable record, or the default legacy record if none was ever written. */
  public read(mode: CutoverCertificateMode): AuthorityRecord {
    const path = this.#recordPath(mode);
    if (!existsSync(path)) return defaultRecord(mode, this.#now().toISOString());
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(path, 'utf8'));
    } catch {
      throw new AuthorityFlipError('RECORD_MALFORMED', 'Authority record is not valid JSON', { mode });
    }
    if (!isValidAuthorityRecord(parsed) || parsed.mode !== mode) {
      throw new AuthorityFlipError('RECORD_MALFORMED', 'Authority record failed integrity verification', { mode });
    }
    return parsed;
  }

  /**
   * Serialize every cutover/rollback attempt across the whole registry root
   * so at most one authority transition is ever in flight at a time,
   * preventing two concurrent attempts from interleaving their reads and
   * writes. The lock is released even if `operation` throws or rejects. A
   * lock left behind by a process that no longer exists (or that aged past
   * the stale-lock TTL) is reclaimed rather than blocking every future
   * transaction forever.
   */
  public async withTransactionLock<T>(operation: () => Promise<T>): Promise<T> {
    const lockPath = this.#transactionLockPath();
    const descriptor = this.#acquireLock(
      lockPath,
      'Another authority transaction is already active for this registry root',
      {},
    );
    try {
      return await operation();
    } finally {
      this.#releaseLock(descriptor, lockPath);
    }
  }

  /**
   * Durably record a forward transition's exact CAS input before the
   * ledger event is appended, so a crash between the append and the
   * registry publish can be completed — or, if the ledger never actually
   * received the event, cleanly aborted — from disk alone.
   */
  public preparePendingTransition(input: AuthorityCompareAndSwapInput, preparedAt: string): void {
    const pending: AuthorityPendingTransition = Object.freeze({ ...input, preparedAt });
    writeCanonicalJsonAtomic(this.#pendingTransitionPath(input.mode), pending as unknown as JsonObject);
  }

  /** Read a leftover prepared transition, or null if none is outstanding. */
  public readPendingTransition(mode: CutoverCertificateMode): AuthorityPendingTransition | null {
    const path = this.#pendingTransitionPath(mode);
    if (!existsSync(path)) return null;
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(path, 'utf8'));
    } catch {
      throw new AuthorityFlipError('RECORD_MALFORMED', 'Prepared transition marker is not valid JSON', { mode });
    }
    if (!isValidPendingTransition(parsed) || parsed.mode !== mode) {
      throw new AuthorityFlipError('RECORD_MALFORMED', 'Prepared transition marker failed integrity verification', { mode });
    }
    return parsed;
  }

  /** Clear a prepared transition marker once it has been completed or aborted. */
  public clearPendingTransition(mode: CutoverCertificateMode): void {
    try {
      unlinkSync(this.#pendingTransitionPath(mode));
    } catch {
      // Already absent; nothing to clear.
    }
  }
}
