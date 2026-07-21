// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Projection Store
// ───────────────────────────────────────────────────────────────────

import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  statSync,
} from 'node:fs';
import {
  basename,
  dirname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from 'node:path';

import { writeTextAtomic } from '../deep-loop/atomic-state.js';
import { sha256Bytes } from '../event-envelope/index.js';
import { appendUtf8Durable } from '../locks-and-fencing/durable-file.js';
import {
  LegacyProjectionError,
  LegacyProjectionErrorCodes,
} from './legacy-projection-errors.js';
import { legacyProjectionDigest } from './legacy-projection-fold.js';
import { LEGACY_PROJECTION_MANIFEST_DIGEST } from './legacy-projection-manifest.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  FoldedLegacyProjection,
  LegacyProjectionContract,
  LegacyProjectionEngineOptions,
  LegacyProjectionReceipt,
  LegacyProjectionWatermark,
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const WATERMARK_VERSION = 1;
const ARTIFACT_ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;
const BASE_SHA_PATTERN = /^[a-f0-9]{40,64}$/u;
const WATERMARK_FIELDS = new Set([
  'watermark_version',
  'artifact_id',
  'ledger_id',
  'ledger_sequence',
  'ledger_record_hash',
  'projection_version',
  'reducer_version',
  'replay_fingerprint',
  'base_sha',
  'base_digest',
  'prior_ledger_sequence',
  'prior_output_digest',
  'output_digest',
  'output_byte_length',
  'refreshed_at',
]);

interface ProjectionPathIdentity {
  readonly artifactId: string;
  readonly projectionVersion: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. PATH AND WATERMARK HELPERS
// ───────────────────────────────────────────────────────────────────

function isWithin(root: string, candidate: string): boolean {
  const child = relative(root, candidate);
  return child === '' || (!child.startsWith(`..${sep}`) && child !== '..' && !isAbsolute(child));
}

function canonicalCandidate(path: string): string {
  const suffix: string[] = [];
  let cursor = resolve(path);
  while (!existsSync(cursor)) {
    const parent = dirname(cursor);
    if (parent === cursor) break;
    suffix.unshift(basename(cursor));
    cursor = parent;
  }
  const existingRoot = existsSync(cursor) ? realpathSync.native(cursor) : cursor;
  return resolve(existingRoot, ...suffix);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasExactFields(value: Record<string, unknown>): boolean {
  const fields = Object.keys(value);
  return fields.length === WATERMARK_FIELDS.size
    && fields.every((field) => WATERMARK_FIELDS.has(field));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function parseWatermark(
  path: string,
  contract: ProjectionPathIdentity,
): LegacyProjectionWatermark | null {
  if (!existsSync(path)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    throw new LegacyProjectionError(
      LegacyProjectionErrorCodes.WATERMARK_INVALID,
      'Projection watermark is not valid JSON',
      {
        artifactId: contract.artifactId,
        projectionVersion: contract.projectionVersion,
        invariant: 'parseable-watermark',
      },
    );
  }
  if (
    !isRecord(parsed)
    || !hasExactFields(parsed)
    || parsed.watermark_version !== WATERMARK_VERSION
    || parsed.artifact_id !== contract.artifactId
    || !isNonEmptyString(parsed.ledger_id)
    || !Number.isSafeInteger(parsed.ledger_sequence)
    || (parsed.ledger_sequence as number) < 0
    || typeof parsed.ledger_record_hash !== 'string'
    || !DIGEST_PATTERN.test(parsed.ledger_record_hash)
    || !isNonEmptyString(parsed.projection_version)
    || !isNonEmptyString(parsed.reducer_version)
    || typeof parsed.replay_fingerprint !== 'string'
    || !DIGEST_PATTERN.test(parsed.replay_fingerprint)
    || typeof parsed.base_sha !== 'string'
    || !BASE_SHA_PATTERN.test(parsed.base_sha)
    || typeof parsed.base_digest !== 'string'
    || !DIGEST_PATTERN.test(parsed.base_digest)
    || (
      parsed.prior_ledger_sequence !== null
      && (!Number.isSafeInteger(parsed.prior_ledger_sequence) || (parsed.prior_ledger_sequence as number) < 0)
    )
    || (
      parsed.prior_output_digest !== null
      && (
        typeof parsed.prior_output_digest !== 'string'
        || !DIGEST_PATTERN.test(parsed.prior_output_digest)
      )
    )
    || typeof parsed.output_digest !== 'string'
    || !DIGEST_PATTERN.test(parsed.output_digest)
    || !Number.isSafeInteger(parsed.output_byte_length)
    || (parsed.output_byte_length as number) < 0
    || !isNonEmptyString(parsed.refreshed_at)
  ) {
    throw new LegacyProjectionError(
      LegacyProjectionErrorCodes.WATERMARK_INVALID,
      'Projection watermark does not match the closed progress shape',
      {
        artifactId: contract.artifactId,
        projectionVersion: contract.projectionVersion,
        invariant: 'closed-watermark-shape',
      },
    );
  }
  return Object.freeze(parsed as unknown as LegacyProjectionWatermark);
}

function decodeProjectionBytes(bytes: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new LegacyProjectionError(
      LegacyProjectionErrorCodes.INVALID_INPUT,
      'Legacy projection bytes must be valid UTF-8',
      { invariant: 'legacy-utf8-bytes' },
    );
  }
}

function encodeProjectionBytes(bytes: Uint8Array | string): Uint8Array {
  return typeof bytes === 'string' ? new TextEncoder().encode(bytes) : Uint8Array.from(bytes);
}

// ───────────────────────────────────────────────────────────────────
// 3. SHADOW STORE
// ───────────────────────────────────────────────────────────────────

/** Publish disposable projections beneath one root that cannot overlap legacy authority. */
export class ShadowProjectionStore {
  readonly #shadowRoot: string;
  readonly #protectedPaths: readonly string[];
  readonly #now: () => Date;
  readonly #faultInjection: LegacyProjectionEngineOptions['faultInjection'];

  public constructor(options: LegacyProjectionEngineOptions) {
    if (options.protectedLegacyPaths.length === 0) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.INVALID_INPUT,
        'At least one authoritative legacy path must be protected',
        { invariant: 'declared-legacy-authority' },
      );
    }
    const proposedRoot = canonicalCandidate(options.shadowRoot);
    const protectedPaths = options.protectedLegacyPaths.map(canonicalCandidate);
    if (protectedPaths.some((path) => isWithin(path, proposedRoot) || isWithin(proposedRoot, path))) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.LIVE_TARGET_REJECTED,
        'Shadow root overlaps an authoritative legacy path',
        { invariant: 'isolated-shadow-root' },
      );
    }
    mkdirSync(proposedRoot, { recursive: true });
    if (lstatSync(proposedRoot).isSymbolicLink()) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.SYMLINK_ESCAPE,
        'Shadow root cannot be a symbolic link',
        { invariant: 'non-symlink-shadow-root' },
      );
    }
    this.#shadowRoot = realpathSync.native(proposedRoot);
    this.#protectedPaths = Object.freeze(protectedPaths);
    this.#now = options.now ?? (() => new Date());
    this.#faultInjection = options.faultInjection;
  }

  /** Publish exact projected bytes and advance progress only after output durability. */
  public publish<TState extends JsonObject>(
    contract: LegacyProjectionContract<TState>,
    projection: FoldedLegacyProjection<TState>,
    expectedBytes: Uint8Array | string,
  ): LegacyProjectionReceipt {
    const oracleBytes = encodeProjectionBytes(expectedBytes);
    const expectedDigest = legacyProjectionDigest(oracleBytes);
    if (expectedDigest !== projection.digest) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.BYTE_PARITY_MISMATCH,
        'Projected bytes do not match the immutable legacy oracle',
        {
          artifactId: contract.artifactId,
          ledgerSequence: projection.ledgerHead.sequence,
          projectionVersion: contract.projectionVersion,
          invariant: 'byte-identical-legacy-oracle',
          details: { expectedDigest, actualDigest: projection.digest },
        },
      );
    }
    if (
      contract.format === 'jsonl'
      && projection.bytes.length > 0
      && projection.bytes[projection.bytes.length - 1] !== 0x0a
    ) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.BYTE_PARITY_MISMATCH,
        'Non-empty legacy JSONL projection must end with one newline byte',
        {
          artifactId: contract.artifactId,
          ledgerSequence: projection.ledgerHead.sequence,
          projectionVersion: contract.projectionVersion,
          invariant: 'jsonl-terminal-newline',
        },
      );
    }

    const outputPath = this.#prepareTarget(contract.relativePath, contract);
    const watermarkPath = this.#prepareTarget(
      `.legacy-projection-watermarks/${contract.artifactId}.json`,
      contract,
    );
    const previous = parseWatermark(watermarkPath, contract);
    this.#assertMonotonic(previous, contract, projection);

    const previousBytes = existsSync(outputPath)
      ? Uint8Array.from(readFileSync(outputPath))
      : null;
    const publication = this.#publishOutput(
      contract,
      projection,
      previous,
      previousBytes,
      outputPath,
    );
    if (publication === 'unchanged' && previous !== null) {
      return this.#receipt(
        contract,
        projection,
        expectedDigest,
        oracleBytes,
        outputPath,
        watermarkPath,
        publication,
        previous.refreshed_at,
      );
    }

    this.#faultInjection?.afterOutputDurableBeforeWatermark?.();
    const refreshedAt = this.#now().toISOString();
    const watermark: LegacyProjectionWatermark = {
      watermark_version: WATERMARK_VERSION,
      artifact_id: contract.artifactId,
      ledger_id: projection.ledgerHead.ledgerId,
      ledger_sequence: projection.ledgerHead.sequence,
      ledger_record_hash: projection.ledgerHead.recordHash,
      projection_version: contract.projectionVersion,
      reducer_version: contract.reducerVersion,
      replay_fingerprint: projection.replayFingerprint,
      base_sha: contract.base.baseSha,
      base_digest: contract.base.baseDigest,
      prior_ledger_sequence: previous?.ledger_sequence ?? null,
      prior_output_digest: previous?.output_digest ?? null,
      output_digest: projection.digest,
      output_byte_length: projection.bytes.length,
      refreshed_at: refreshedAt,
    };
    writeTextAtomic(watermarkPath, `${JSON.stringify(watermark, null, 2)}\n`);
    return this.#receipt(
      contract,
      projection,
      expectedDigest,
      oracleBytes,
      outputPath,
      watermarkPath,
      publication,
      refreshedAt,
    );
  }

  #prepareTarget(
    relativePath: string,
    contract: ProjectionPathIdentity,
  ): string {
    if (
      relativePath.includes('\0')
      || isAbsolute(relativePath)
      || relativePath.split(/[\\/]/u).some((segment) => segment === '..' || segment === '.')
      || !ARTIFACT_ID_PATTERN.test(contract.artifactId)
    ) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.PATH_ESCAPE,
        'Projection target must be a normalized relative shadow path',
        {
          artifactId: contract.artifactId,
          projectionVersion: contract.projectionVersion,
          invariant: 'relative-shadow-target',
        },
      );
    }
    const target = resolve(this.#shadowRoot, relativePath);
    if (
      target === this.#shadowRoot
      || !isWithin(this.#shadowRoot, target)
      || this.#protectedPaths.some((path) => isWithin(path, target) || target === path)
    ) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.LIVE_TARGET_REJECTED,
        'Projection target resolves outside the isolated shadow namespace',
        {
          artifactId: contract.artifactId,
          projectionVersion: contract.projectionVersion,
          invariant: 'shadow-only-publication',
        },
      );
    }
    this.#assertNoSymlink(target, contract);
    mkdirSync(dirname(target), { recursive: true });
    this.#assertNoSymlink(target, contract);
    this.#assertNoHardLinkAlias(target, contract);
    return target;
  }

  #assertNoSymlink(target: string, contract: ProjectionPathIdentity): void {
    const child = relative(this.#shadowRoot, target);
    let cursor = this.#shadowRoot;
    for (const segment of child.split(sep)) {
      cursor = resolve(cursor, segment);
      if (!existsSync(cursor)) break;
      if (lstatSync(cursor).isSymbolicLink()) {
        throw new LegacyProjectionError(
          LegacyProjectionErrorCodes.SYMLINK_ESCAPE,
          'Projection target traverses a symbolic link',
          {
            artifactId: contract.artifactId,
            projectionVersion: contract.projectionVersion,
            invariant: 'non-symlink-shadow-target',
          },
        );
      }
    }
  }

  #assertNoHardLinkAlias(target: string, contract: ProjectionPathIdentity): void {
    if (!existsSync(target)) return;
    const targetStat = statSync(target);
    if (!targetStat.isFile() || targetStat.nlink !== 1) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.LIVE_TARGET_REJECTED,
        'Projection target must be a singly linked regular shadow file',
        {
          artifactId: contract.artifactId,
          projectionVersion: contract.projectionVersion,
          invariant: 'regular-unaliased-shadow-target',
        },
      );
    }
    for (const protectedPath of this.#protectedPaths) {
      if (!existsSync(protectedPath)) continue;
      const protectedStat = statSync(protectedPath);
      if (targetStat.dev === protectedStat.dev && targetStat.ino === protectedStat.ino) {
        throw new LegacyProjectionError(
          LegacyProjectionErrorCodes.LIVE_TARGET_REJECTED,
          'Projection target aliases an authoritative legacy inode',
          {
            artifactId: contract.artifactId,
            projectionVersion: contract.projectionVersion,
            invariant: 'no-hardlink-authority-alias',
          },
        );
      }
    }
  }

  #assertMonotonic<TState extends JsonObject>(
    previous: LegacyProjectionWatermark | null,
    contract: LegacyProjectionContract<TState>,
    projection: FoldedLegacyProjection<TState>,
  ): void {
    if (previous === null) return;
    if (previous.reducer_version !== contract.reducerVersion) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.REDUCER_VERSION_MISMATCH,
        'Existing watermark is bound to a different reducer version',
        {
          artifactId: contract.artifactId,
          ledgerSequence: projection.ledgerHead.sequence,
          projectionVersion: contract.projectionVersion,
          invariant: 'stable-reducer-version',
        },
      );
    }
    if (
      previous.ledger_id !== contract.ledgerId
      || previous.projection_version !== contract.projectionVersion
      || previous.base_sha !== contract.base.baseSha
      || previous.base_digest !== contract.base.baseDigest
    ) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.WATERMARK_INVALID,
        'Existing watermark belongs to a different projection contract',
        {
          artifactId: contract.artifactId,
          ledgerSequence: projection.ledgerHead.sequence,
          projectionVersion: contract.projectionVersion,
          invariant: 'stable-watermark-contract',
        },
      );
    }
    if (previous.ledger_sequence > projection.ledgerHead.sequence) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.WATERMARK_REGRESSION,
        'Projection request would move the durable watermark backwards',
        {
          artifactId: contract.artifactId,
          ledgerSequence: projection.ledgerHead.sequence,
          projectionVersion: contract.projectionVersion,
          invariant: 'monotonic-watermark',
        },
      );
    }
    if (
      previous.ledger_sequence === projection.ledgerHead.sequence
      && (
        previous.ledger_record_hash !== projection.ledgerHead.recordHash
        || previous.replay_fingerprint !== projection.replayFingerprint
        || previous.output_digest !== projection.digest
      )
    ) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.WATERMARK_INVALID,
        'Same-head projection evidence conflicts with the durable watermark',
        {
          artifactId: contract.artifactId,
          ledgerSequence: projection.ledgerHead.sequence,
          projectionVersion: contract.projectionVersion,
          invariant: 'same-head-idempotency',
        },
      );
    }
  }

  #publishOutput<TState extends JsonObject>(
    contract: LegacyProjectionContract<TState>,
    projection: FoldedLegacyProjection<TState>,
    previous: LegacyProjectionWatermark | null,
    currentBytes: Uint8Array | null,
    outputPath: string,
  ): LegacyProjectionReceipt['publication'] {
    const currentDigest = currentBytes === null ? null : sha256Bytes(currentBytes);
    if (currentDigest === projection.digest) {
      return previous?.ledger_sequence === projection.ledgerHead.sequence
        ? 'unchanged'
        : 'recovered';
    }

    this.#faultInjection?.beforeOutputCommit?.();
    const projectedText = decodeProjectionBytes(projection.bytes);
    const previousIsDurable = previous !== null
      && currentBytes !== null
      && currentDigest === previous.output_digest
      && currentBytes.length === previous.output_byte_length;
    if (
      contract.format === 'jsonl'
      && previousIsDurable
      && currentBytes.length <= projection.bytes.length
      && Buffer.from(projection.bytes.subarray(0, currentBytes.length)).equals(Buffer.from(currentBytes))
      && (currentBytes.length === 0 || currentBytes[currentBytes.length - 1] === 0x0a)
    ) {
      const suffix = projection.bytes.subarray(currentBytes.length);
      if (suffix.length > 0) appendUtf8Durable(outputPath, decodeProjectionBytes(suffix));
      return 'appended';
    }

    writeTextAtomic(outputPath, projectedText);
    return 'replaced';
  }

  #receipt<TState extends JsonObject>(
    contract: LegacyProjectionContract<TState>,
    projection: FoldedLegacyProjection<TState>,
    expectedDigest: string,
    expectedBytes: Uint8Array,
    outputPath: string,
    watermarkPath: string,
    publication: LegacyProjectionReceipt['publication'],
    refreshedAt: string,
  ): LegacyProjectionReceipt {
    return Object.freeze({
      artifactId: contract.artifactId,
      censusSurfaceId: contract.censusSurfaceId,
      outputPath,
      watermarkPath,
      ledgerHead: Object.freeze({ ...projection.ledgerHead }),
      foldId: contract.foldId,
      projectionVersion: contract.projectionVersion,
      reducerVersion: contract.reducerVersion,
      serializerId: contract.serializerId,
      refreshBoundary: contract.refreshBoundary,
      replayFingerprint: projection.replayFingerprint,
      baseSha: contract.base.baseSha,
      baseDigest: contract.base.baseDigest,
      manifestDigest: LEGACY_PROJECTION_MANIFEST_DIGEST,
      expectedDigest,
      projectedDigest: projection.digest,
      expectedBytes: Object.freeze(Array.from(expectedBytes)),
      projectedBytes: Object.freeze(Array.from(projection.bytes)),
      byteLength: projection.bytes.length,
      publication,
      refreshedAt,
    });
  }
}
