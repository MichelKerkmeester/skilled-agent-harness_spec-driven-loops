// ──────────────────────────────────
// MODULE: Legacy Dark Comparison
// ──────────────────────────────────

import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  LegacyProjectionComparisonOutcome,
  LegacyProjectionMetadata,
  ProjectionSnapshot,
} from './transactional-projection-types.js';

export interface LegacyProjectionComparisonInput<TLegacy> {
  readonly surface: string;
  readonly legacyResult: TLegacy;
  readonly projectionValue: JsonValue;
  readonly snapshot: ProjectionSnapshot;
  readonly legacyMetadata?: LegacyProjectionMetadata;
  readonly maxDifferingPaths?: number;
}

function differingPaths(
  left: JsonValue,
  right: JsonValue,
  maximum: number,
  path = '$',
  output: string[] = [],
): string[] {
  if (output.length >= maximum || canonicalJson(left) === canonicalJson(right)) return output;
  if (
    left === null
    || right === null
    || Array.isArray(left)
    || Array.isArray(right)
    || typeof left !== 'object'
    || typeof right !== 'object'
  ) {
    output.push(path);
    return output;
  }
  const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
  for (const key of keys) {
    if (output.length >= maximum) break;
    if (!(key in left) || !(key in right)) output.push(`${path}.${key}`);
    else differingPaths(left[key]!, right[key]!, maximum, `${path}.${key}`, output);
  }
  return output;
}

/** Produces bounded evidence while returning the exact authoritative legacy result. */
export function compareLegacyProjection<TLegacy>(
  input: LegacyProjectionComparisonInput<TLegacy>,
): LegacyProjectionComparisonOutcome<TLegacy> {
  const maxDifferingPaths = input.maxDifferingPaths ?? 32;
  if (!Number.isSafeInteger(maxDifferingPaths) || maxDifferingPaths < 1 || maxDifferingPaths > 256) {
    throw new TypeError('maxDifferingPaths must be between 1 and 256');
  }
  const legacyValue = input.legacyResult as unknown as JsonValue;
  canonicalJson(legacyValue);
  const metadata = input.legacyMetadata ?? { eventId: null, observedAt: null };
  const legacyHash = sha256Bytes(canonicalBytes(legacyValue));
  const projectionHash = sha256Bytes(canonicalBytes(input.projectionValue));
  const authorityManifest = {
    ledgerId: input.snapshot.ledgerId,
    cutoffSequence: input.snapshot.cutoffSequence,
    cutoffRecordHash: input.snapshot.cutoffRecordHash,
    generationId: input.snapshot.generationId,
    bundleVersion: input.snapshot.bundleVersion,
    bundleDigest: input.snapshot.bundleDigest,
    reducerDigest: input.snapshot.reducerDigest,
    configurationDigest: input.snapshot.configurationDigest,
    eventRegistryDigest: input.snapshot.eventRegistryDigest,
  };
  return Object.freeze({
    legacyResult: input.legacyResult,
    evidence: Object.freeze({
      comparisonSchemaVersion: 1,
      surface: input.surface,
      legacyAuthority: true,
      legacyHash,
      projectionHash,
      parity: legacyHash === projectionHash,
      differingPaths: differingPaths(
        legacyValue,
        input.projectionValue,
        maxDifferingPaths,
      ),
      ...authorityManifest,
      legacyManifestDigest: sha256Bytes(canonicalBytes(authorityManifest as JsonObject)),
      legacyMetadata: Object.freeze({ ...metadata }),
    }),
  });
}
