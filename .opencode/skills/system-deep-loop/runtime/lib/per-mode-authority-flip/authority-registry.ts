// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip — Durable Authority Registry
// ───────────────────────────────────────────────────────────────────
//
// One durable, mode-keyed authority record per canonical workstream, with
// monotonic-epoch compare-and-swap and crash-safe atomic writes. A mode
// this registry has never written reads back as its default:
// `legacy_authoritative` at epoch 1, selected writer `legacy`. Nothing in
// this file is invoked against a real mode's root by this build; every
// caller in this package is a unit test supplying its own temporary root.

import { closeSync, existsSync, mkdirSync, openSync, readFileSync, unlinkSync } from 'node:fs';
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

/** File-scoped, lock-guarded, mode-keyed authority CAS store. */
export class AuthorityRegistry {
  readonly #root: string;
  readonly #now: () => Date;

  public constructor(rootDirectory: string, now: () => Date = () => new Date()) {
    mkdirSync(rootDirectory, { recursive: true, mode: 0o700 });
    this.#root = rootDirectory;
    this.#now = now;
  }

  #recordPath(mode: CutoverCertificateMode): string {
    return join(this.#root, `authority-${mode}.json`);
  }

  #lockPath(mode: CutoverCertificateMode): string {
    return join(this.#root, `authority-${mode}.lock`);
  }

  #transactionLockPath(): string {
    return join(this.#root, 'authority-flip-transaction.lock');
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
   * writes. The lock is released even if `operation` throws or rejects.
   */
  public async withTransactionLock<T>(operation: () => Promise<T>): Promise<T> {
    const lockPath = this.#transactionLockPath();
    let descriptor: number | undefined;
    try {
      descriptor = openSync(lockPath, 'wx', 0o600);
    } catch {
      throw new AuthorityFlipError(
        'ACTIVE_TRANSACTION_CONFLICT',
        'Another authority transaction is already active for this registry root',
      );
    }
    try {
      return await operation();
    } finally {
      closeSync(descriptor);
      try {
        unlinkSync(lockPath);
      } catch {
        // Best-effort cleanup; a stale lock file blocks the next transaction
        // loudly (ACTIVE_TRANSACTION_CONFLICT) rather than silently racing.
      }
    }
  }

  /**
   * Execute the one forward edge this registry owns:
   * `cutover_ready(epoch N) -> new_authoritative_reversible(epoch N+1)`.
   * Any other current state, a mismatched epoch, or an already-published
   * identical target (a resumed retry after a crash) is handled explicitly
   * rather than silently overwritten.
   */
  public compareAndSwap(input: AuthorityCompareAndSwapInput): Readonly<{
    record: AuthorityRecord;
    resumed: boolean;
  }> {
    const path = this.#recordPath(input.mode);
    const lockPath = this.#lockPath(input.mode);
    let descriptor: number | undefined;
    try {
      descriptor = openSync(lockPath, 'wx', 0o600);
    } catch {
      throw new AuthorityFlipError(
        'ACTIVE_TRANSACTION_CONFLICT',
        'Another writer holds this mode\'s authority record lock',
        { mode: input.mode },
      );
    }
    try {
      const current = this.read(input.mode);
      const nextEpoch = input.expectedEpoch + 1;

      if (
        current.state === 'new_authoritative_reversible'
        && current.epoch === nextEpoch
        && current.cutoverCertificateDigest === input.cutoverCertificateDigest
        && current.lastTransitionDigest === input.lastTransitionDigest
      ) {
        // The durable ledger event for this exact transition was already
        // appended and this record already reflects it: a crash between the
        // ledger append and the registry publish resumes here idempotently
        // rather than re-running the CAS.
        return Object.freeze({ record: current, resumed: true });
      }
      if (current.state !== input.expectedState || current.epoch !== input.expectedEpoch) {
        throw new AuthorityFlipError('CAS_CONFLICT', 'Authority record no longer matches the expected state/epoch', {
          mode: input.mode,
          expectedState: input.expectedState,
          expectedEpoch: input.expectedEpoch,
          actualState: current.state,
          actualEpoch: current.epoch,
        });
      }

      const core = Object.freeze({
        schemaVersion: AUTHORITY_FLIP_SCHEMA_VERSION,
        mode: input.mode,
        state: 'new_authoritative_reversible' as const,
        epoch: nextEpoch,
        selectedWriter: input.nextSelectedWriter,
        candidateSha: input.candidateSha,
        policyVersion: input.policyVersion,
        cutoverCertificateDigest: input.cutoverCertificateDigest,
        lastTransitionDigest: input.lastTransitionDigest,
        updatedAt: input.at,
      });
      const next: AuthorityRecord = Object.freeze({ ...core, recordDigest: digest(core) });
      writeCanonicalJsonAtomic(path, next as unknown as JsonObject);
      return Object.freeze({ record: next, resumed: false });
    } finally {
      closeSync(descriptor);
      try {
        unlinkSync(lockPath);
      } catch {
        // Best-effort cleanup only; a leaked lock file fails the next
        // attempt loudly rather than corrupting this write.
      }
    }
  }
}
