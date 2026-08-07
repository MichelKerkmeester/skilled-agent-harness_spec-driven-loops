// ───────────────────────────────────────────────────────────────────
// MODULE: Immutable Frame Store
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  closeSync,
  constants,
  existsSync,
  fsyncSync,
  linkSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  unlinkSync,
  writeFileSync,
  writeSync,
} from 'node:fs';
import { randomUUID } from 'node:crypto';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';

import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import {
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
} from './authorized-ledger-errors.js';

import type {
  LedgerHead,
  LedgerStorageOptions,
  TornTailRecoveryRecord,
} from './authorized-ledger-types.js';
import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface LockRecord extends JsonObject {
  readonly token: string;
  readonly owner_pid: number;
  readonly acquired_at: string;
}

export interface StoredFrameFile {
  readonly sequence: number;
  readonly fileName: string;
  readonly path: string;
  readonly bytes: Buffer;
  readonly isTerminated: boolean;
}

export interface StoredRecoveryEvidence {
  readonly record: TornTailRecoveryRecord;
  readonly quarantinedPath: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const LEDGER_ID_PATTERN = /^[a-z][a-z0-9-]{0,127}$/;
const FRAME_FILE_PATTERN = /^(\d{16})\.frame$/;
const RECOVERY_FILE_PATTERN = /^(\d{16})\.recovery$/;
const DEFAULT_LOCK_TIMEOUT_MS = 5_000;
const LOCK_RETRY_MS = 10;
const DIRECTORY_MODE = 0o700;
const FILE_MODE = 0o600;
const RECOVERY_VERSION = 1;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function wait(delayMs: number): Promise<void> {
  return new Promise((resolveWait) => setTimeout(resolveWait, delayMs));
}

function isProcessAlive(processId: number): boolean {
  if (!Number.isSafeInteger(processId) || processId <= 0) return false;
  try {
    process.kill(processId, 0);
    return true;
  } catch (error: unknown) {
    return error instanceof Error && 'code' in error && error.code !== 'ESRCH';
  }
}

function fsyncDirectory(directoryPath: string): void {
  const descriptor = openSync(directoryPath, constants.O_RDONLY);
  try {
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
}

function assertContained(rootPath: string, candidatePath: string): void {
  const pathFromRoot = relative(rootPath, candidatePath);
  if (pathFromRoot.startsWith('..') || isAbsolute(pathFromRoot)) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.PATH_INVALID,
      'storage',
      'Ledger path escapes its configured storage root',
      { rootPath, candidatePath },
    );
  }
}

function ensurePrivateDirectory(directoryPath: string): void {
  if (!existsSync(directoryPath)) mkdirSync(directoryPath, { recursive: true, mode: DIRECTORY_MODE });
  const metadata = lstatSync(directoryPath);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.PATH_INVALID,
      'storage',
      'Ledger storage component must be a real directory',
      { directoryPath },
    );
  }
  chmodSync(directoryPath, DIRECTORY_MODE);
}

function readPrivateFile(filePath: string): Buffer {
  const metadata = lstatSync(filePath);
  if (!metadata.isFile() || metadata.isSymbolicLink()) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.PATH_INVALID,
      'storage',
      'Ledger frame must be a regular non-symbolic file',
      { filePath },
    );
  }
  if ((metadata.mode & 0o077) !== 0) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.PATH_INVALID,
      'storage',
      'Ledger frame permissions are broader than owner-only access',
      { filePath, mode: metadata.mode & 0o777 },
    );
  }
  const descriptor = openSync(filePath, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    return readFileSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
}

function parseSequence(fileName: string, pattern: RegExp): number {
  const match = pattern.exec(fileName);
  if (!match) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_INSERTION_DETECTED,
      'integrity',
      'Unexpected file exists inside immutable ledger storage',
      { fileName },
    );
  }
  const sequence = Number(match[1]);
  if (!Number.isSafeInteger(sequence) || sequence <= 0) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_SEQUENCE_MISMATCH,
      'integrity',
      'Ledger filename does not contain a positive safe sequence',
      { fileName },
    );
  }
  return sequence;
}

function frameFileName(sequence: number): string {
  return `${String(sequence).padStart(16, '0')}.frame`;
}

function recoveryFileName(sequence: number): string {
  return `${String(sequence).padStart(16, '0')}.recovery`;
}

function parseJsonObject(bytes: Buffer, filePath: string): JsonObject {
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_MALFORMED,
      'integrity',
      'Immutable ledger evidence is not valid UTF-8 JSON',
      { filePath },
    );
  }
  if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_MALFORMED,
      'integrity',
      'Immutable ledger evidence must contain one JSON object',
      { filePath },
    );
  }
  return parsed as JsonObject;
}

function readLockRecord(lockPath: string): LockRecord | null {
  if (!existsSync(lockPath)) return null;
  try {
    const parsed = parseJsonObject(readPrivateFile(lockPath), lockPath);
    if (
      typeof parsed.token !== 'string'
      || typeof parsed.owner_pid !== 'number'
      || typeof parsed.acquired_at !== 'string'
    ) {
      return null;
    }
    return parsed as LockRecord;
  } catch {
    return null;
  }
}

function withoutRecoveryHash(
  record: TornTailRecoveryRecord,
): Omit<TornTailRecoveryRecord, 'recovery_hash'> {
  const { recovery_hash: ignored, ...hashInput } = record;
  void ignored;
  return hashInput;
}

// ───────────────────────────────────────────────────────────────────
// 4. FRAME STORE
// ───────────────────────────────────────────────────────────────────

/** Exclusive, owner-only filesystem store for immutable single-frame files. */
export class ImmutableFrameStore {
  public readonly ledgerId: string;
  public readonly rootDirectory: string;
  public readonly ledgerDirectory: string;
  public readonly framesDirectory: string;
  public readonly recoveriesDirectory: string;
  public readonly quarantineDirectory: string;
  readonly #pendingDirectory: string;
  readonly #staleLocksDirectory: string;
  readonly #lockPath: string;
  readonly #lockTimeoutMs: number;

  public constructor(options: LedgerStorageOptions) {
    if (!LEDGER_ID_PATTERN.test(options.ledgerId)) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.INPUT_INVALID,
        'input',
        'Ledger identity must be lowercase hyphen-case and bounded',
        { ledgerId: options.ledgerId },
      );
    }
    if (typeof options.rootDirectory !== 'string' || options.rootDirectory.trim() === '') {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.INPUT_INVALID,
        'input',
        'Ledger root directory must be a non-empty path',
      );
    }

    const requestedRoot = resolve(options.rootDirectory);
    ensurePrivateDirectory(requestedRoot);
    this.rootDirectory = realpathSync(requestedRoot);
    this.ledgerId = options.ledgerId;
    this.ledgerDirectory = join(this.rootDirectory, options.ledgerId);
    this.framesDirectory = join(this.ledgerDirectory, 'frames');
    this.recoveriesDirectory = join(this.ledgerDirectory, 'recoveries');
    this.quarantineDirectory = join(this.ledgerDirectory, 'quarantine');
    this.#pendingDirectory = join(this.ledgerDirectory, 'pending');
    this.#staleLocksDirectory = join(this.ledgerDirectory, 'stale-locks');
    this.#lockPath = join(this.ledgerDirectory, 'writer.lock');
    this.#lockTimeoutMs = options.lockTimeoutMs ?? DEFAULT_LOCK_TIMEOUT_MS;

    for (const candidate of [
      this.ledgerDirectory,
      this.framesDirectory,
      this.recoveriesDirectory,
      this.quarantineDirectory,
      this.#pendingDirectory,
      this.#staleLocksDirectory,
      this.#lockPath,
    ]) {
      assertContained(this.rootDirectory, candidate);
    }
    for (const directoryPath of [
      this.ledgerDirectory,
      this.framesDirectory,
      this.recoveriesDirectory,
      this.quarantineDirectory,
      this.#pendingDirectory,
      this.#staleLocksDirectory,
    ]) {
      ensurePrivateDirectory(directoryPath);
    }
  }

  /** Run one operation while holding the ledger's cross-process writer lock. */
  public async withExclusiveLock<T>(operation: () => T | Promise<T>): Promise<T> {
    const token = randomUUID();
    const startedAt = Date.now();
    while (!this.#tryAcquireLock(token)) {
      if (Date.now() - startedAt >= this.#lockTimeoutMs) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.LOCK_TIMEOUT,
          'lock',
          'Timed out waiting for the ledger writer lock',
          { ledgerId: this.ledgerId, lockTimeoutMs: this.#lockTimeoutMs },
        );
      }
      await wait(LOCK_RETRY_MS);
    }

    try {
      return await operation();
    } finally {
      this.#releaseLock(token);
    }
  }

  /** Read every committed frame in filename order without acquiring another lock. */
  public readFrameFilesUnlocked(): readonly StoredFrameFile[] {
    const fileNames = readdirSync(this.framesDirectory).sort();
    const seenSequences = new Set<number>();
    return Object.freeze(fileNames.map((fileName) => {
      const sequence = parseSequence(fileName, FRAME_FILE_PATTERN);
      if (seenSequences.has(sequence)) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.FRAME_FORK_DETECTED,
          'integrity',
          'Multiple committed files claim the same ledger sequence',
          { ledgerId: this.ledgerId, sequence },
        );
      }
      seenSequences.add(sequence);
      const filePath = join(this.framesDirectory, fileName);
      assertContained(this.framesDirectory, filePath);
      const bytes = readPrivateFile(filePath);
      return Object.freeze({
        sequence,
        fileName,
        path: filePath,
        bytes,
        isTerminated: bytes.length > 0 && bytes[bytes.length - 1] === 0x0a,
      });
    }));
  }

  /** Read and integrity-check every torn-tail recovery marker. */
  public readRecoveryEvidenceUnlocked(): ReadonlyMap<number, StoredRecoveryEvidence> {
    const evidence = new Map<number, StoredRecoveryEvidence>();
    for (const fileName of readdirSync(this.recoveriesDirectory).sort()) {
      const sequence = parseSequence(fileName, RECOVERY_FILE_PATTERN);
      const filePath = join(this.recoveriesDirectory, fileName);
      const bytes = readPrivateFile(filePath);
      if (bytes.length === 0 || bytes[bytes.length - 1] !== 0x0a) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.FRAME_MALFORMED,
          'integrity',
          'Recovery marker is not a complete immutable record',
          { fileName },
        );
      }
      const parsed = parseJsonObject(bytes.subarray(0, -1), filePath) as unknown as TornTailRecoveryRecord;
      const expectedHash = sha256Bytes(canonicalBytes(withoutRecoveryHash(parsed)));
      if (
        parsed.recovery_version !== RECOVERY_VERSION
        || parsed.ledger_id !== this.ledgerId
        || parsed.sequence !== sequence
        || parsed.recovery_hash !== expectedHash
      ) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.FRAME_HASH_MISMATCH,
          'integrity',
          'Recovery marker identity or digest is invalid',
          { fileName, sequence },
        );
      }
      const quarantinedPath = join(this.quarantineDirectory, parsed.quarantined_file);
      assertContained(this.quarantineDirectory, quarantinedPath);
      if (
        basename(quarantinedPath) !== parsed.quarantined_file
        || !existsSync(quarantinedPath)
        || sha256Bytes(readPrivateFile(quarantinedPath)) !== parsed.quarantined_digest
      ) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.FRAME_HASH_MISMATCH,
          'integrity',
          'Recovery marker does not match its byte-preserved quarantine file',
          { fileName, sequence },
        );
      }
      if (evidence.has(sequence)) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.FRAME_FORK_DETECTED,
          'integrity',
          'Multiple recovery markers claim the same ledger sequence',
          { sequence },
        );
      }
      evidence.set(sequence, Object.freeze({ record: parsed, quarantinedPath }));
    }
    return evidence;
  }

  /** Persist one immutable frame and expose it only after file and directory fsync. */
  public commitFrameUnlocked(
    sequence: number,
    frameBytes: readonly number[],
    afterFrameFsyncBeforeCommit?: () => void,
  ): void {
    const targetPath = join(this.framesDirectory, frameFileName(sequence));
    const pendingPath = join(
      this.#pendingDirectory,
      `${frameFileName(sequence)}.${randomUUID()}.pending`,
    );
    assertContained(this.framesDirectory, targetPath);
    assertContained(this.#pendingDirectory, pendingPath);
    if (existsSync(targetPath)) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.FRAME_FORK_DETECTED,
        'storage',
        'A committed frame already occupies the requested sequence',
        { ledgerId: this.ledgerId, sequence },
      );
    }

    const descriptor = openSync(
      pendingPath,
      constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | constants.O_NOFOLLOW,
      FILE_MODE,
    );
    try {
      writeSync(descriptor, Uint8Array.from([...frameBytes, 0x0a]));
      fsyncSync(descriptor);
    } finally {
      closeSync(descriptor);
    }
    afterFrameFsyncBeforeCommit?.();

    try {
      linkSync(pendingPath, targetPath);
    } catch (error: unknown) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.STORAGE_FAILURE,
        'storage',
        'Failed to atomically publish the immutable ledger frame',
        {
          ledgerId: this.ledgerId,
          sequence,
          cause: error instanceof Error ? error.message : String(error),
        },
      );
    }
    chmodSync(targetPath, FILE_MODE);
    fsyncDirectory(this.framesDirectory);
    unlinkSync(pendingPath);
    fsyncDirectory(this.#pendingDirectory);
  }

  /** Preserve a torn final candidate and link its bytes to the verified prior head. */
  public quarantineTornTailUnlocked(
    candidate: StoredFrameFile,
    priorHead: LedgerHead,
    recoveredAt: string,
  ): TornTailRecoveryRecord {
    const frames = this.readFrameFilesUnlocked();
    const lastFrame = frames.at(-1);
    if (
      !lastFrame
      || lastFrame.path !== candidate.path
      || candidate.isTerminated
      || candidate.sequence !== priorHead.sequence + 1
    ) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.RECOVERY_NOT_ALLOWED,
        'integrity',
        'Only the torn final frame candidate after a verified head may be quarantined',
        { ledgerId: this.ledgerId, sequence: candidate.sequence },
      );
    }

    const quarantinedDigest = sha256Bytes(candidate.bytes);
    const quarantinedFile = `${candidate.fileName}.torn.${quarantinedDigest}`;
    const quarantinedPath = join(this.quarantineDirectory, quarantinedFile);
    const recoveryPath = join(this.recoveriesDirectory, recoveryFileName(candidate.sequence));
    assertContained(this.quarantineDirectory, quarantinedPath);
    assertContained(this.recoveriesDirectory, recoveryPath);
    if (existsSync(quarantinedPath) || existsSync(recoveryPath)) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.RECOVERY_NOT_ALLOWED,
        'integrity',
        'Recovery evidence already exists for the torn sequence',
        { ledgerId: this.ledgerId, sequence: candidate.sequence },
      );
    }

    renameSync(candidate.path, quarantinedPath);
    chmodSync(quarantinedPath, FILE_MODE);
    fsyncDirectory(this.framesDirectory);
    fsyncDirectory(this.quarantineDirectory);

    const hashInput: Omit<TornTailRecoveryRecord, 'recovery_hash'> = {
      recovery_version: RECOVERY_VERSION,
      ledger_id: this.ledgerId,
      sequence: candidate.sequence,
      prior_sequence: priorHead.sequence,
      prior_record_hash: priorHead.recordHash,
      quarantined_file: quarantinedFile,
      quarantined_digest: quarantinedDigest,
      recovered_at: recoveredAt,
    };
    const record: TornTailRecoveryRecord = Object.freeze({
      ...hashInput,
      recovery_hash: sha256Bytes(canonicalBytes(hashInput)),
    });
    const descriptor = openSync(
      recoveryPath,
      constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | constants.O_NOFOLLOW,
      FILE_MODE,
    );
    try {
      writeFileSync(descriptor, `${canonicalJson(record)}\n`, 'utf8');
      fsyncSync(descriptor);
    } finally {
      closeSync(descriptor);
    }
    fsyncDirectory(this.recoveriesDirectory);
    return record;
  }

  #tryAcquireLock(token: string): boolean {
    const record: LockRecord = {
      token,
      owner_pid: process.pid,
      acquired_at: new Date().toISOString(),
    };
    const candidatePath = join(this.#staleLocksDirectory, `.candidate-${token}.lock`);
    const descriptor = openSync(
      candidatePath,
      constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | constants.O_NOFOLLOW,
      FILE_MODE,
    );
    try {
      writeFileSync(descriptor, canonicalJson(record), 'utf8');
      fsyncSync(descriptor);
    } finally {
      closeSync(descriptor);
    }
    try {
      linkSync(candidatePath, this.#lockPath);
    } catch (error: unknown) {
      unlinkSync(candidatePath);
      fsyncDirectory(this.#staleLocksDirectory);
      if (!(error instanceof Error) || !('code' in error) || error.code !== 'EEXIST') throw error;
      this.#archiveDeadLock();
      return false;
    }
    fsyncDirectory(this.ledgerDirectory);
    unlinkSync(candidatePath);
    fsyncDirectory(this.#staleLocksDirectory);
    return true;
  }

  #archiveDeadLock(): void {
    const holder = readLockRecord(this.#lockPath);
    if (holder && isProcessAlive(holder.owner_pid)) return;
    const archivedPath = join(
      this.#staleLocksDirectory,
      `${Date.now()}-${holder?.token ?? randomUUID()}.lock`,
    );
    try {
      renameSync(this.#lockPath, archivedPath);
      chmodSync(archivedPath, FILE_MODE);
      fsyncDirectory(this.ledgerDirectory);
      fsyncDirectory(this.#staleLocksDirectory);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return;
      throw error;
    }
  }

  #releaseLock(token: string): void {
    const holder = readLockRecord(this.#lockPath);
    if (!holder || holder.token !== token || holder.owner_pid !== process.pid) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.LOCK_LOST,
        'lock',
        'Ledger writer lock identity changed before release',
        { ledgerId: this.ledgerId },
      );
    }
    unlinkSync(this.#lockPath);
    fsyncDirectory(dirname(this.#lockPath));
  }
}
