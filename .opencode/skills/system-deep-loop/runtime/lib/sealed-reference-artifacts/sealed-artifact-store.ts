// ───────────────────────────────────────────────────────────────────
// MODULE: Sealed Reference Artifact Store
// ───────────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';
import {
  chmodSync,
  closeSync,
  existsSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {
  dirname,
  isAbsolute,
  join,
  parse,
  relative,
  resolve,
  sep,
} from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import {
  MAX_CANONICAL_BYTES,
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  createArtifactCanonicalizerRegistry,
} from './artifact-registries.js';
import {
  ARTIFACT_DESCRIPTOR_VERSION,
  ARTIFACT_REFERENCE_VERSION,
  ARTIFACT_TOMBSTONE_VERSION,
  DEFAULT_ARTIFACT_CANONICALIZATION_VERSION,
  DEFAULT_ARTIFACT_DIGEST_ALGORITHM,
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from './sealed-artifact-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  ArtifactCanonicalizerRegistry,
  ArtifactDigestRegistry,
} from './artifact-registries.js';
import type {
  ArtifactDeletionAuthorization,
  ArtifactStoreOptions,
  ArtifactStorePaths,
  ArtifactTombstone,
  DerivedSealedArtifact,
  SealArtifactOptions,
  SealArtifactResult,
  SealDescriptor,
  SealedArtifactErrorCode,
  SealedArtifactReference,
  VerifiedSealedArtifact,
} from './sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const FILE_MODE = 0o600;
const IMMUTABLE_FILE_MODE = 0o400;
const DEFAULT_LOCK_TIMEOUT_MS = 5_000;
const LOCK_RETRY_MS = 10;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const ALGORITHM_PATTERN = /^[a-z][a-z0-9-]{0,63}$/;
const QUARANTINE_ERROR_CODES: ReadonlySet<SealedArtifactErrorCode> = new Set([
  SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
  SealedArtifactErrorCodes.DESCRIPTOR_CONFLICT,
  SealedArtifactErrorCodes.DIGEST_CONFLICT,
]);

const DESCRIPTOR_FIELDS = new Set([
  'descriptor_version',
  'artifact_kind',
  'media_type',
  'byte_length',
  'digest_algorithm',
  'content_digest',
  'canonicalization_version',
  'source_provenance_digest',
]);

const REFERENCE_FIELDS = new Set([
  'reference_version',
  'artifact_kind',
  'digest_algorithm',
  'content_digest',
  'qualified_digest',
  'descriptor_version',
  'canonicalization_version',
  'descriptor_digest',
]);

const TOMBSTONE_FIELDS = new Set([
  'tombstone_version',
  'reference',
  'descriptor',
  'descriptor_digest',
  'deletion_event_id',
  'deletion_ledger_id',
  'deletion_ledger_sequence',
  'deletion_record_hash',
  'deleted_at',
]);

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactFields(value: Record<string, unknown>, fields: ReadonlySet<string>): boolean {
  const keys = Object.keys(value);
  return keys.length === fields.size && keys.every((key) => fields.has(key));
}

function isBoundedString(value: unknown, maxLength = 1_024): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function parseJson(bytes: Uint8Array, subject: string): unknown {
  try {
    return JSON.parse(Buffer.from(bytes).toString('utf8')) as unknown;
  } catch {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      `${subject} is not valid canonical JSON`,
      { subject },
    );
  }
}

function requireCanonicalEncoding(bytes: Uint8Array, value: unknown, subject: string): void {
  const expected = Buffer.from(canonicalBytes(value));
  if (Buffer.compare(Buffer.from(bytes), expected) !== 0) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      `${subject} bytes are not in canonical form`,
      { subject },
    );
  }
}

function qualifiedDigest(algorithm: string, digest: string): string {
  return `${algorithm}:${digest}`;
}

function immutableBytes(bytes: Uint8Array): readonly number[] {
  return Object.freeze(Array.from(bytes));
}

/** Validate a closed, algorithm-qualified reference without resolving storage. */
export function parseSealedArtifactReference(input: unknown): SealedArtifactReference {
  if (!isRecord(input) || !hasExactFields(input, REFERENCE_FIELDS)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'descriptor',
      'Artifact reference must use the closed content-addressed shape',
    );
  }
  if (input.reference_version !== ARTIFACT_REFERENCE_VERSION) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.UNSUPPORTED_REFERENCE_VERSION,
      'descriptor',
      'Artifact reference version is not supported',
      { referenceVersion: typeof input.reference_version === 'number' ? input.reference_version : -1 },
    );
  }
  if (input.descriptor_version !== ARTIFACT_DESCRIPTOR_VERSION) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.UNSUPPORTED_DESCRIPTOR_VERSION,
      'descriptor',
      'Artifact descriptor version is not supported',
      { descriptorVersion: typeof input.descriptor_version === 'number' ? input.descriptor_version : -1 },
    );
  }
  if (
    !isBoundedString(input.artifact_kind, 128)
    || !isBoundedString(input.digest_algorithm, 64)
    || !ALGORITHM_PATTERN.test(input.digest_algorithm)
    || typeof input.content_digest !== 'string'
    || !DIGEST_PATTERN.test(input.content_digest)
    || input.qualified_digest !== qualifiedDigest(input.digest_algorithm, input.content_digest)
    || !isBoundedString(input.canonicalization_version, 128)
    || typeof input.descriptor_digest !== 'string'
    || !DIGEST_PATTERN.test(input.descriptor_digest)
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'descriptor',
      'Artifact reference contains malformed or mutable-only identity fields',
    );
  }
  return Object.freeze({
    reference_version: ARTIFACT_REFERENCE_VERSION,
    artifact_kind: input.artifact_kind,
    digest_algorithm: input.digest_algorithm,
    content_digest: input.content_digest,
    qualified_digest: input.qualified_digest,
    descriptor_version: ARTIFACT_DESCRIPTOR_VERSION,
    canonicalization_version: input.canonicalization_version,
    descriptor_digest: input.descriptor_digest,
  });
}

/** Validate immutable descriptor metadata before any content bytes are released. */
export function parseSealDescriptor(input: unknown): SealDescriptor {
  if (!isRecord(input) || !hasExactFields(input, DESCRIPTOR_FIELDS)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'descriptor',
      'Seal descriptor does not match the closed metadata shape',
    );
  }
  if (input.descriptor_version !== ARTIFACT_DESCRIPTOR_VERSION) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.UNSUPPORTED_DESCRIPTOR_VERSION,
      'descriptor',
      'Seal descriptor version is not supported',
      { descriptorVersion: typeof input.descriptor_version === 'number' ? input.descriptor_version : -1 },
    );
  }
  if (
    !isBoundedString(input.artifact_kind, 128)
    || !isBoundedString(input.media_type, 256)
    || !isNonNegativeInteger(input.byte_length)
    || input.byte_length > MAX_CANONICAL_BYTES
    || !isBoundedString(input.digest_algorithm, 64)
    || !ALGORITHM_PATTERN.test(input.digest_algorithm)
    || typeof input.content_digest !== 'string'
    || !DIGEST_PATTERN.test(input.content_digest)
    || !isBoundedString(input.canonicalization_version, 128)
    || !(
      input.source_provenance_digest === null
      || (typeof input.source_provenance_digest === 'string'
        && DIGEST_PATTERN.test(input.source_provenance_digest))
    )
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'descriptor',
      'Seal descriptor contains malformed identity metadata',
    );
  }
  return Object.freeze({
    descriptor_version: ARTIFACT_DESCRIPTOR_VERSION,
    artifact_kind: input.artifact_kind,
    media_type: input.media_type,
    byte_length: input.byte_length,
    digest_algorithm: input.digest_algorithm,
    content_digest: input.content_digest,
    canonicalization_version: input.canonicalization_version,
    source_provenance_digest: input.source_provenance_digest,
  });
}

function parseTombstone(input: unknown): ArtifactTombstone {
  if (!isRecord(input) || !hasExactFields(input, TOMBSTONE_FIELDS)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Artifact tombstone does not match the closed receipt shape',
    );
  }
  if (
    input.tombstone_version !== ARTIFACT_TOMBSTONE_VERSION
    || !isBoundedString(input.deletion_event_id)
    || !isBoundedString(input.deletion_ledger_id)
    || !isPositiveInteger(input.deletion_ledger_sequence)
    || typeof input.deletion_record_hash !== 'string'
    || !DIGEST_PATTERN.test(input.deletion_record_hash)
    || !isBoundedString(input.deleted_at, 64)
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Artifact tombstone contains malformed deletion evidence',
    );
  }
  const reference = parseSealedArtifactReference(input.reference);
  const descriptor = parseSealDescriptor(input.descriptor);
  if (input.descriptor_digest !== reference.descriptor_digest) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Artifact tombstone descriptor commitment does not match its reference',
    );
  }
  return Object.freeze({
    tombstone_version: ARTIFACT_TOMBSTONE_VERSION,
    reference,
    descriptor,
    descriptor_digest: reference.descriptor_digest,
    deletion_event_id: input.deletion_event_id,
    deletion_ledger_id: input.deletion_ledger_id,
    deletion_ledger_sequence: input.deletion_ledger_sequence,
    deletion_record_hash: input.deletion_record_hash,
    deleted_at: input.deleted_at,
  });
}

function sameReference(left: SealedArtifactReference, right: SealedArtifactReference): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function isErrno(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === code;
}

function assertSafeTarget(rootDirectory: string, target: string): void {
  const lexicalRelative = relative(rootDirectory, resolve(target));
  if (
    lexicalRelative === ''
    || lexicalRelative === '..'
    || lexicalRelative.startsWith(`..${sep}`)
    || isAbsolute(lexicalRelative)
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'publication',
      'Artifact path escapes its dedicated store root',
    );
  }
  const parts = lexicalRelative.split(sep);
  let cursor = rootDirectory;
  for (const part of parts.slice(0, -1)) {
    cursor = join(cursor, part);
    if (existsSync(cursor) && lstatSync(cursor).isSymbolicLink()) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'publication',
        'Artifact path crosses a symbolic-link boundary',
      );
    }
  }
  if (existsSync(target) && lstatSync(target).isSymbolicLink()) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'publication',
      'Artifact path cannot resolve through a symbolic-link object',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. DURABLE FILE HELPERS
// ───────────────────────────────────────────────────────────────────

function ensureDirectory(path: string): void {
  mkdirSync(path, { recursive: true, mode: 0o700 });
}

function fsyncDirectory(path: string): void {
  const descriptor = openSync(path, 'r');
  try {
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
}

function writeDurable(path: string, bytes: Uint8Array): void {
  ensureDirectory(dirname(path));
  const descriptor = openSync(path, 'wx', FILE_MODE);
  try {
    writeFileSync(descriptor, bytes);
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
}

function writeAtomic(path: string, bytes: Uint8Array): void {
  ensureDirectory(dirname(path));
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  writeDurable(temporaryPath, bytes);
  renameSync(temporaryPath, path);
  fsyncDirectory(dirname(path));
}

function readBoundedFile(path: string): Uint8Array {
  const descriptor = openSync(path, 'r');
  const chunks: Buffer[] = [];
  const buffer = Buffer.allocUnsafe(64 * 1_024);
  let byteLength = 0;
  try {
    for (;;) {
      const bytesRead = readSync(descriptor, buffer, 0, buffer.byteLength, null);
      if (bytesRead === 0) break;
      byteLength += bytesRead;
      if (byteLength > MAX_CANONICAL_BYTES) {
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
          'read',
          'Artifact bytes exceed the registered canonical content boundary',
          { byteLength, limit: MAX_CANONICAL_BYTES },
        );
      }
      chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
    }
  } finally {
    closeSync(descriptor);
  }
  return Uint8Array.from(Buffer.concat(chunks, byteLength));
}

function immutableRename(source: string, destination: string): void {
  ensureDirectory(dirname(destination));
  renameSync(source, destination);
  chmodSync(destination, IMMUTABLE_FILE_MODE);
  fsyncDirectory(dirname(destination));
}

// ───────────────────────────────────────────────────────────────────
// 4. STORE
// ───────────────────────────────────────────────────────────────────

/** Filesystem-backed immutable store whose only read API verifies before release. */
export class SealedArtifactStore {
  readonly #options: ArtifactStoreOptions;
  readonly #rootDirectory: string;
  readonly #canonicalizers: ArtifactCanonicalizerRegistry;
  readonly #now: () => Date;
  readonly #lockTimeoutMs: number;

  public constructor(
    options: ArtifactStoreOptions,
    canonicalizers = createArtifactCanonicalizerRegistry(),
    callerDigestRegistry?: ArtifactDigestRegistry,
  ) {
    if (callerDigestRegistry !== undefined) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'descriptor',
        'Artifact stores do not accept caller-provided digest implementations',
      );
    }
    if (!isBoundedString(options.rootDirectory, 8_192)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'publication',
        'Artifact store root must be a bounded path',
      );
    }
    const requestedRoot = resolve(options.rootDirectory);
    if (requestedRoot === parse(requestedRoot).root) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'publication',
        'Artifact store root cannot be a filesystem root',
      );
    }
    ensureDirectory(requestedRoot);
    this.#options = options;
    this.#rootDirectory = realpathSync(requestedRoot);
    this.#canonicalizers = canonicalizers;
    this.#now = options.now ?? (() => new Date());
    this.#lockTimeoutMs = options.lockTimeoutMs ?? DEFAULT_LOCK_TIMEOUT_MS;
  }

  /** Derive immutable bytes and identity without publishing any storage path. */
  public derive(
    artifactKind: string,
    input: unknown,
    options: SealArtifactOptions = {},
  ): DerivedSealedArtifact {
    const canonicalizationVersion = options.canonicalizationVersion
      ?? DEFAULT_ARTIFACT_CANONICALIZATION_VERSION;
    const digestAlgorithm = options.digestAlgorithm ?? DEFAULT_ARTIFACT_DIGEST_ALGORITHM;
    if (digestAlgorithm !== DEFAULT_ARTIFACT_DIGEST_ALGORITHM) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.UNSUPPORTED_DIGEST_ALGORITHM,
        'descriptor',
        'Sealed artifacts require the fixed SHA-256 digest algorithm',
        { algorithm: digestAlgorithm },
      );
    }
    const canonicalized = this.#canonicalizers.canonicalize(
      artifactKind,
      canonicalizationVersion,
      input,
    );
    if (options.mediaType && options.mediaType !== canonicalized.mediaType) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'descriptor',
        'Caller media type does not match the registered canonicalization profile',
        { artifactKind, canonicalizationVersion },
      );
    }
    const sourceProvenanceDigest = options.sourceProvenanceDigest ?? null;
    if (
      sourceProvenanceDigest !== null
      && !DIGEST_PATTERN.test(sourceProvenanceDigest)
    ) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'descriptor',
        'Source provenance digest must be a lowercase SHA-256 commitment',
      );
    }
    const contentDigest = sha256Bytes(canonicalized.bytes);
    const descriptor: SealDescriptor = Object.freeze({
      descriptor_version: ARTIFACT_DESCRIPTOR_VERSION,
      artifact_kind: artifactKind,
      media_type: canonicalized.mediaType,
      byte_length: canonicalized.bytes.byteLength,
      digest_algorithm: digestAlgorithm,
      content_digest: contentDigest,
      canonicalization_version: canonicalizationVersion,
      source_provenance_digest: sourceProvenanceDigest,
    });
    const descriptorBytes = Uint8Array.from(canonicalBytes(descriptor));
    const reference: SealedArtifactReference = Object.freeze({
      reference_version: ARTIFACT_REFERENCE_VERSION,
      artifact_kind: artifactKind,
      digest_algorithm: digestAlgorithm,
      content_digest: contentDigest,
      qualified_digest: qualifiedDigest(digestAlgorithm, contentDigest),
      descriptor_version: ARTIFACT_DESCRIPTOR_VERSION,
      canonicalization_version: canonicalizationVersion,
      descriptor_digest: sha256Bytes(descriptorBytes),
    });
    return Object.freeze({
      reference,
      descriptor,
      bytes: immutableBytes(canonicalized.bytes),
      descriptorBytes: immutableBytes(descriptorBytes),
      referenceBytes: immutableBytes(Uint8Array.from(canonicalBytes(reference))),
    });
  }

  /** Return path ownership for diagnostics without accepting caller-supplied paths. */
  public inspectPaths(input: unknown): ArtifactStorePaths {
    const reference = parseSealedArtifactReference(input);
    const prefix = reference.content_digest.slice(0, 2);
    const identity = `${reference.digest_algorithm}-${reference.content_digest}`;
    const paths: ArtifactStorePaths = {
      blobPath: join(this.#rootDirectory, 'blobs', reference.digest_algorithm, prefix, `${identity}.blob`),
      descriptorPath: join(
        this.#rootDirectory,
        'descriptors',
        reference.digest_algorithm,
        prefix,
        `${identity}.json`,
      ),
      referencePath: join(
        this.#rootDirectory,
        'references',
        reference.digest_algorithm,
        prefix,
        `${identity}.ref`,
      ),
      tombstonePath: join(
        this.#rootDirectory,
        'tombstones',
        reference.digest_algorithm,
        prefix,
        `${identity}.json`,
      ),
      quarantineMarkerPath: join(
        this.#rootDirectory,
        'quarantine-markers',
        reference.digest_algorithm,
        prefix,
        `${identity}.json`,
      ),
    };
    Object.values(paths).forEach((path) => assertSafeTarget(this.#rootDirectory, path));
    return Object.freeze(paths);
  }

  /** Publish only after blob, descriptor, and persisted verification have succeeded. */
  public async seal(
    artifactKind: string,
    input: unknown,
    options: SealArtifactOptions = {},
  ): Promise<SealArtifactResult> {
    const derived = this.derive(artifactKind, input, options);
    return this.#withLock(async () => {
      const paths = this.inspectPaths(derived.reference);
      if (existsSync(paths.tombstonePath)) {
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.ARTIFACT_TOMBSTONED,
          'publication',
          'Deleted identity requires explicit byte-identical restoration',
          { qualifiedDigest: derived.reference.qualified_digest },
        );
      }
      if (existsSync(paths.quarantineMarkerPath)) {
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.ARTIFACT_QUARANTINED,
          'publication',
          'Quarantined identity cannot be selected for publication',
          { qualifiedDigest: derived.reference.qualified_digest },
        );
      }
      if (existsSync(paths.referencePath)) {
        let existing: VerifiedSealedArtifact;
        try {
          existing = this.#readVerifiedUnlocked(derived.reference);
        } catch (error: unknown) {
          if (
            error instanceof SealedArtifactError
            && QUARANTINE_ERROR_CODES.has(error.code)
          ) {
            this.#quarantineUnlocked(derived.reference, error.code);
          }
          throw error;
        }
        if (Buffer.compare(Buffer.from(existing.bytes), Buffer.from(derived.bytes)) !== 0) {
          this.#quarantineUnlocked(derived.reference, SealedArtifactErrorCodes.DIGEST_CONFLICT);
          throw new SealedArtifactError(
            SealedArtifactErrorCodes.DIGEST_CONFLICT,
            'publication',
            'One content digest resolved to different canonical bytes',
            { qualifiedDigest: derived.reference.qualified_digest },
          );
        }
        return Object.freeze({ status: 'idempotent', artifact: existing });
      }
      await this.#publishUnlocked(derived);
      return Object.freeze({
        status: 'sealed',
        artifact: this.#readVerifiedUnlocked(derived.reference),
      });
    });
  }

  /** Verify reference, descriptor, size, algorithm, and exact returned bytes. */
  public async readVerified(
    input: unknown,
    expectedArtifactKind?: string,
  ): Promise<VerifiedSealedArtifact> {
    const reference = parseSealedArtifactReference(input);
    return this.#withLock(async () => {
      try {
        return this.#readVerifiedUnlocked(reference, expectedArtifactKind);
      } catch (error: unknown) {
        if (
          error instanceof SealedArtifactError
          && QUARANTINE_ERROR_CODES.has(error.code)
        ) {
          this.#quarantineUnlocked(reference, error.code);
        }
        throw error;
      }
    });
  }

  /** Create a receipt-bound tombstone, then remove the now-unreachable object files. */
  public async deleteAuthorized(
    input: unknown,
    authorization: ArtifactDeletionAuthorization,
  ): Promise<ArtifactTombstone> {
    const reference = parseSealedArtifactReference(input);
    return this.#withLock(async () => {
      const verified = this.#readVerifiedUnlocked(reference);
      if (
        !isBoundedString(authorization.eventId)
        || !isBoundedString(authorization.ledgerId)
        || !isPositiveInteger(authorization.ledgerSequence)
        || !DIGEST_PATTERN.test(authorization.ledgerRecordHash)
        || !isBoundedString(authorization.authorizedAt, 64)
      ) {
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.INVALID_INPUT,
          'retention',
          'Deletion requires a complete durable ledger authorization receipt',
        );
      }
      const tombstone: ArtifactTombstone = Object.freeze({
        tombstone_version: ARTIFACT_TOMBSTONE_VERSION,
        reference,
        descriptor: verified.descriptor,
        descriptor_digest: reference.descriptor_digest,
        deletion_event_id: authorization.eventId,
        deletion_ledger_id: authorization.ledgerId,
        deletion_ledger_sequence: authorization.ledgerSequence,
        deletion_record_hash: authorization.ledgerRecordHash,
        deleted_at: this.#now().toISOString(),
      });
      const paths = this.inspectPaths(reference);
      writeAtomic(paths.tombstonePath, Uint8Array.from(canonicalBytes(tombstone)));
      for (const path of [paths.referencePath, paths.blobPath, paths.descriptorPath]) {
        if (existsSync(path)) rmSync(path, { force: true });
      }
      return tombstone;
    });
  }

  /** Restore only the exact descriptor and canonical bytes committed by a tombstone. */
  public async restoreAuthorized(
    input: unknown,
    artifactSource: unknown,
    authorization: ArtifactDeletionAuthorization,
  ): Promise<VerifiedSealedArtifact> {
    const reference = parseSealedArtifactReference(input);
    return this.#withLock(async () => {
      const paths = this.inspectPaths(reference);
      const derived = this.#restorationCandidateUnlocked(reference, artifactSource);
      if (!isBoundedString(authorization.eventId) || !DIGEST_PATTERN.test(authorization.ledgerRecordHash)) {
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.INVALID_INPUT,
          'restoration',
          'Restoration requires durable ledger authorization evidence',
        );
      }
      await this.#publishUnlocked(derived, true);
      rmSync(paths.tombstonePath, { force: true });
      return this.#readVerifiedUnlocked(reference);
    });
  }

  /** Prove restoration identity before a caller requests durable authorization. */
  public async validateRestoration(
    input: unknown,
    artifactSource: unknown,
  ): Promise<void> {
    const reference = parseSealedArtifactReference(input);
    await this.#withLock(async () => {
      this.#restorationCandidateUnlocked(reference, artifactSource);
    });
  }

  async #publishUnlocked(derived: DerivedSealedArtifact, restoring = false): Promise<void> {
    const paths = this.inspectPaths(derived.reference);
    const stagingDirectory = join(this.#rootDirectory, 'staging', randomUUID());
    const stagedBlob = join(stagingDirectory, 'content.blob');
    const stagedDescriptor = join(stagingDirectory, 'descriptor.json');
    ensureDirectory(stagingDirectory);
    try {
      this.#options.faultInjection?.beforeBlobWrite?.();
      writeDurable(stagedBlob, Uint8Array.from(derived.bytes));
      this.#options.faultInjection?.beforeDescriptorWrite?.();
      writeDurable(stagedDescriptor, Uint8Array.from(derived.descriptorBytes));
      this.#options.faultInjection?.beforePersistenceVerification?.();
      const persistedBlob = Uint8Array.from(readFileSync(stagedBlob));
      const persistedDescriptor = Uint8Array.from(readFileSync(stagedDescriptor));
      if (
        Buffer.compare(Buffer.from(persistedBlob), Buffer.from(derived.bytes)) !== 0
        || Buffer.compare(Buffer.from(persistedDescriptor), Buffer.from(derived.descriptorBytes)) !== 0
      ) {
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.PUBLICATION_FAILED,
          'publication',
          'Staged artifact failed post-write verification',
          { qualifiedDigest: derived.reference.qualified_digest },
        );
      }

      this.#commitImmutableFile(stagedBlob, paths.blobPath, derived.bytes, derived.reference);
      this.#commitImmutableFile(
        stagedDescriptor,
        paths.descriptorPath,
        derived.descriptorBytes,
        derived.reference,
      );
      this.#options.faultInjection?.beforeReferencePublication?.();
      writeAtomic(paths.referencePath, Uint8Array.from(derived.referenceBytes));
      chmodSync(paths.referencePath, IMMUTABLE_FILE_MODE);
      if (restoring && !existsSync(paths.referencePath)) {
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.PUBLICATION_FAILED,
          'restoration',
          'Restoration did not publish the exact digest reference',
        );
      }
    } finally {
      rmSync(stagingDirectory, { recursive: true, force: true });
    }
  }

  #commitImmutableFile(
    stagedPath: string,
    finalPath: string,
    expectedBytes: readonly number[],
    reference: SealedArtifactReference,
  ): void {
    if (existsSync(finalPath)) {
      const existing = Uint8Array.from(readFileSync(finalPath));
      if (Buffer.compare(Buffer.from(existing), Buffer.from(expectedBytes)) !== 0) {
        this.#quarantineUnlocked(reference, SealedArtifactErrorCodes.DIGEST_CONFLICT);
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.DIGEST_CONFLICT,
          'publication',
          'Existing immutable object conflicts with the candidate identity',
          { qualifiedDigest: reference.qualified_digest },
        );
      }
      rmSync(stagedPath, { force: true });
      return;
    }
    immutableRename(stagedPath, finalPath);
  }

  #readVerifiedUnlocked(
    input: unknown,
    expectedArtifactKind?: string,
  ): VerifiedSealedArtifact {
    const reference = parseSealedArtifactReference(input);
    if (reference.digest_algorithm !== DEFAULT_ARTIFACT_DIGEST_ALGORITHM) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.UNSUPPORTED_DIGEST_ALGORITHM,
        'descriptor',
        'Sealed artifacts require the fixed SHA-256 digest algorithm',
        { algorithm: reference.digest_algorithm },
      );
    }
    this.#canonicalizers.describe(
      reference.artifact_kind,
      reference.canonicalization_version,
    );
    const paths = this.inspectPaths(reference);
    if (existsSync(paths.quarantineMarkerPath)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.ARTIFACT_QUARANTINED,
        'read',
        'Artifact identity is quarantined and cannot be consumed',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    if (existsSync(paths.tombstonePath)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.ARTIFACT_TOMBSTONED,
        'read',
        'Artifact identity has a durable deletion tombstone',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    if (!existsSync(paths.referencePath)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.ARTIFACT_MISSING,
        'read',
        'Exact digest reference is not published',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    const publishedBytes = Uint8Array.from(readFileSync(paths.referencePath));
    const publishedValue = parseJson(publishedBytes, 'Artifact reference');
    requireCanonicalEncoding(publishedBytes, publishedValue, 'Artifact reference');
    const published = parseSealedArtifactReference(publishedValue);
    if (!sameReference(reference, published)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.DESCRIPTOR_CONFLICT,
        'read',
        'Published reference does not match the requested exact identity',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    if (expectedArtifactKind && expectedArtifactKind !== reference.artifact_kind) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'read',
        'Artifact kind does not match the consumer contract',
        { expectedArtifactKind, actualArtifactKind: reference.artifact_kind },
      );
    }
    if (!existsSync(paths.descriptorPath) || !existsSync(paths.blobPath)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
        'read',
        'Published reference is missing its immutable object or descriptor',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    const descriptorBytes = Uint8Array.from(readFileSync(paths.descriptorPath));
    const descriptorValue = parseJson(descriptorBytes, 'Seal descriptor');
    requireCanonicalEncoding(descriptorBytes, descriptorValue, 'Seal descriptor');
    if (sha256Bytes(descriptorBytes) !== reference.descriptor_digest) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.DESCRIPTOR_CONFLICT,
        'read',
        'Seal descriptor bytes do not match the published commitment',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    const descriptor = parseSealDescriptor(descriptorValue);
    const profile = this.#canonicalizers.describe(
      descriptor.artifact_kind,
      descriptor.canonicalization_version,
    );
    if (
      descriptor.artifact_kind !== reference.artifact_kind
      || descriptor.digest_algorithm !== reference.digest_algorithm
      || descriptor.content_digest !== reference.content_digest
      || descriptor.descriptor_version !== reference.descriptor_version
      || descriptor.canonicalization_version !== reference.canonicalization_version
      || descriptor.media_type !== profile.mediaType
    ) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.DESCRIPTOR_CONFLICT,
        'read',
        'Seal descriptor identity does not match the published reference',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    const bytes = readBoundedFile(paths.blobPath);
    if (
      bytes.byteLength !== descriptor.byte_length
      || sha256Bytes(bytes) !== descriptor.content_digest
    ) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
        'read',
        'Artifact bytes fail the sealed length or digest commitment',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    return Object.freeze({ reference, descriptor, bytes: immutableBytes(bytes) });
  }

  #restorationCandidateUnlocked(
    reference: SealedArtifactReference,
    artifactSource: unknown,
  ): DerivedSealedArtifact {
    const paths = this.inspectPaths(reference);
    if (!existsSync(paths.tombstonePath)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.ARTIFACT_MISSING,
        'restoration',
        'Restoration requires an exact retained tombstone',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    const tombstoneBytes = Uint8Array.from(readFileSync(paths.tombstonePath));
    const tombstoneValue = parseJson(tombstoneBytes, 'Artifact tombstone');
    requireCanonicalEncoding(tombstoneBytes, tombstoneValue, 'Artifact tombstone');
    const tombstone = parseTombstone(tombstoneValue);
    if (!sameReference(tombstone.reference, reference)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.RESTORATION_MISMATCH,
        'restoration',
        'Restoration reference does not match the deletion tombstone',
      );
    }
    const derived = this.derive(reference.artifact_kind, artifactSource, {
      canonicalizationVersion: reference.canonicalization_version,
      digestAlgorithm: reference.digest_algorithm,
      mediaType: tombstone.descriptor.media_type,
      sourceProvenanceDigest: tombstone.descriptor.source_provenance_digest,
    });
    if (
      !sameReference(derived.reference, reference)
      || canonicalJson(derived.descriptor) !== canonicalJson(tombstone.descriptor)
    ) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.RESTORATION_MISMATCH,
        'restoration',
        'Restoration bytes or identity metadata do not match deleted history',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    return derived;
  }

  #quarantineUnlocked(reference: SealedArtifactReference, reason: string): void {
    const paths = this.inspectPaths(reference);
    const quarantineDirectory = join(
      this.#rootDirectory,
      'quarantine',
      reference.digest_algorithm,
      reference.content_digest,
      randomUUID(),
    );
    ensureDirectory(quarantineDirectory);
    for (const [label, path] of [
      ['reference', paths.referencePath],
      ['descriptor', paths.descriptorPath],
      ['blob', paths.blobPath],
    ] as const) {
      if (!existsSync(path)) continue;
      chmodSync(path, FILE_MODE);
      renameSync(path, join(quarantineDirectory, label));
    }
    writeAtomic(paths.quarantineMarkerPath, Uint8Array.from(canonicalBytes({
      quarantine_version: 1,
      qualified_digest: reference.qualified_digest,
      reason,
      quarantined_at: this.#now().toISOString(),
    })));
  }

  async #withLock<T>(operation: () => Promise<T>): Promise<T> {
    ensureDirectory(this.#rootDirectory);
    const lockPath = join(this.#rootDirectory, '.artifact-store-lock');
    const deadline = Date.now() + this.#lockTimeoutMs;
    for (;;) {
      try {
        mkdirSync(lockPath, { mode: 0o700 });
        break;
      } catch (error: unknown) {
        if (!isErrno(error, 'EEXIST') || Date.now() >= deadline) {
          throw new SealedArtifactError(
            SealedArtifactErrorCodes.PUBLICATION_FAILED,
            'publication',
            'Artifact store lock is unavailable; operation failed closed',
          );
        }
        await delay(LOCK_RETRY_MS);
      }
    }
    try {
      return await operation();
    } finally {
      rmSync(lockPath, { recursive: true, force: true });
    }
  }
}
