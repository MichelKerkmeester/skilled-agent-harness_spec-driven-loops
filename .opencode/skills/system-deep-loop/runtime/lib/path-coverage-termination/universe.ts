// ───────────────────────────────────────────────────────────────────
// MODULE: Frozen Coverage Universe
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import { SCHEMA_VERSION as COVERAGE_GRAPH_SCHEMA_VERSION } from '../coverage-graph/coverage-graph-db.js';
import { semanticCommunityIdentityDigest } from '../semantic-communities/index.js';
import { modeCoverageProfiles } from './profiles.js';
import { COVERAGE_UNIVERSE_SCHEMA_VERSION } from './types.js';

import type {
  CompileCoverageUniverseInput,
  CoverageCertificate,
  CoveragePath,
  CoverageUniverse,
  MajorRegionDefinition,
  ModeCoverageProfile,
} from './types.js';

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const STABLE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,511}$/;
const COVERAGE_GRAPH_PROJECTION_VERSION = `coverage-graph-schema@${COVERAGE_GRAPH_SCHEMA_VERSION}`;

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalFreeze<T>(value: T): T {
  const clone = JSON.parse(canonicalJson(value)) as T;
  const freeze = (entry: unknown): void => {
    if (entry !== null && typeof entry === 'object') {
      Object.values(entry).forEach(freeze);
      Object.freeze(entry);
    }
  };
  freeze(clone);
  return clone;
}

function requireStableId(value: string, field: string): void {
  if (!STABLE_ID_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a stable non-empty identity`);
  }
}

function requireDigest(value: string, field: string): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a lowercase SHA-256 digest`);
  }
}

function replayFingerprintDigest(input: CompileCoverageUniverseInput['replayFingerprint']): string {
  const digest = typeof input === 'string' ? input : input.final_digest;
  requireDigest(digest, 'replayFingerprint');
  return digest;
}

function cartesianProduct(
  dimensionIds: readonly string[],
  values: Readonly<Record<string, readonly string[]>>,
): readonly Readonly<Record<string, string>>[] {
  let products: Readonly<Record<string, string>>[] = [Object.freeze({})];
  for (const dimensionId of dimensionIds) {
    const dimensionValues = values[dimensionId] ?? [];
    products = products.flatMap((coordinates) => dimensionValues.map((value) => Object.freeze({
      ...coordinates,
      [dimensionId]: value,
    })));
  }
  return products;
}

function derivePathId(
  identity: Readonly<{
    namespace: CoverageUniverse['namespace'];
    runId: string;
    mode: CoverageUniverse['mode'];
    profileVersion: string;
    inputFingerprint: string;
  }>,
  regionId: string,
  coordinates: Readonly<Record<string, string>>,
): string {
  const digest = sha256Bytes(canonicalBytes({
    namespace: identity.namespace,
    run_id: identity.runId,
    mode: identity.mode,
    profile_version: identity.profileVersion,
    input_fingerprint: identity.inputFingerprint,
    region_id: regionId,
    coordinates,
  }));
  return `path-${digest}`;
}

function compilePaths(
  identity: Parameters<typeof derivePathId>[0],
  profile: ModeCoverageProfile,
  dimensionValues: Readonly<Record<string, readonly string[]>>,
): readonly CoveragePath[] {
  const paths = profile.majorRegionRule.regions.flatMap((region) => (
    cartesianProduct(region.dimensionIds, dimensionValues).map((coordinates) => ({
      pathId: derivePathId(identity, region.regionId, coordinates),
      regionId: region.regionId,
      coordinates,
      mandatory: region.mandatory,
      major: region.major,
      weight: region.weight,
      requiredEvidenceClasses: [...region.requiredEvidenceClasses].sort(compareText),
      semanticCommunityId: coordinates['semantic-community'] ?? null,
    } satisfies CoveragePath))
  ));
  return Object.freeze(paths.sort((left, right) => compareText(left.pathId, right.pathId)));
}

function universeCore(
  universe: Omit<CoverageUniverse, 'universeId'>,
): Omit<CoverageUniverse, 'universeId'> {
  return universe;
}

function universeId(universe: Omit<CoverageUniverse, 'universeId'>): string {
  return `universe-${sha256Bytes(canonicalBytes(universeCore(universe)))}`;
}

function invalidDimensionReasons(
  input: CompileCoverageUniverseInput,
  profile: ModeCoverageProfile,
  dimensionValues: Readonly<Record<string, readonly string[]>>,
): string[] {
  const reasons: string[] = [];
  const allowed = new Set(profile.pathDimensions.map((dimension) => dimension.dimensionId));
  for (const key of Object.keys(input.dimensionValues)) {
    if (!allowed.has(key)) reasons.push(`unknown_dimension:${key}`);
  }
  for (const dimension of profile.pathDimensions) {
    const values = dimensionValues[dimension.dimensionId] ?? [];
    if (values.length === 0) reasons.push(`missing_required_dimension:${dimension.dimensionId}`);
  }
  return reasons.sort(compareText);
}

function normalizedDimensions(
  input: CompileCoverageUniverseInput,
  profile: ModeCoverageProfile,
): Readonly<Record<string, readonly string[]>> {
  const stableCommunities = Object.keys(input.semanticCommunityProjection.communities)
    .sort(compareText);
  const entries = profile.pathDimensions.map((dimension) => {
    const sourceValues = dimension.source === 'semantic-community'
      ? stableCommunities
      : input.dimensionValues[dimension.dimensionId] ?? [];
    const values = [...new Set(sourceValues)].sort(compareText);
    if (values.some((value) => value.length === 0)) {
      throw new TypeError(`Dimension ${dimension.dimensionId} contains an empty identity`);
    }
    return [dimension.dimensionId, Object.freeze(values)] as const;
  });
  return Object.freeze(Object.fromEntries(entries));
}

function compileInternal(
  input: CompileCoverageUniverseInput,
  universeVersion: number,
  predecessorUniverseId: string | null,
  invalidatesUniverseIds: readonly string[],
): CoverageUniverse {
  const profile = modeCoverageProfiles.resolve(input.mode, input.profileVersion);
  requireStableId(input.namespace.specFolder, 'namespace.specFolder');
  requireStableId(input.namespace.sessionId, 'namespace.sessionId');
  requireStableId(input.runId, 'runId');
  requireDigest(input.inputFingerprint, 'inputFingerprint');
  requireStableId(input.ledgerHead.ledgerId, 'ledgerHead.ledgerId');
  requireDigest(input.ledgerHead.recordHash, 'ledgerHead.recordHash');
  if (!Number.isSafeInteger(input.ledgerHead.sequence) || input.ledgerHead.sequence < 0) {
    throw new TypeError('ledgerHead.sequence must be a non-negative safe integer');
  }
  if (!Number.isSafeInteger(universeVersion) || universeVersion <= 0) {
    throw new TypeError('universeVersion must be a positive safe integer');
  }

  const semanticNamespace = input.semanticCommunityProjection.namespace;
  const invalidReasons: string[] = [];
  if (
    semanticNamespace.spec_folder !== input.namespace.specFolder
    || semanticNamespace.session_id !== input.namespace.sessionId
  ) {
    invalidReasons.push('semantic_namespace_mismatch');
  }
  const dimensionValues = normalizedDimensions(input, profile);
  invalidReasons.push(...invalidDimensionReasons(input, profile, dimensionValues));

  const identity = {
    namespace: input.namespace,
    runId: input.runId,
    mode: input.mode,
    profileVersion: input.profileVersion,
    inputFingerprint: input.inputFingerprint,
  } as const;
  const paths = compilePaths(identity, profile, dimensionValues);
  if (paths.length === 0) invalidReasons.push('empty_coverage_universe');
  const ambiguousMajorCommunityIds = Object.values(input.semanticCommunityProjection.memberships)
    .filter((membership) => membership.status === 'ambiguous')
    .map((membership) => membership.claim_id)
    .sort(compareText);
  const core: Omit<CoverageUniverse, 'universeId'> = {
    schemaVersion: COVERAGE_UNIVERSE_SCHEMA_VERSION,
    universeVersion,
    predecessorUniverseId,
    invalidatesUniverseIds: [...invalidatesUniverseIds].sort(compareText),
    namespace: input.namespace,
    runId: input.runId,
    mode: input.mode,
    profileVersion: input.profileVersion,
    inputFingerprint: input.inputFingerprint,
    coverageGraphProjectionVersion: COVERAGE_GRAPH_PROJECTION_VERSION,
    communityProjectionVersion: input.semanticCommunityProjection.projection_version,
    communityMembershipDigest: semanticCommunityIdentityDigest(input.semanticCommunityProjection),
    relationshipProjectionVersion: input.relationshipProjection.projection_schema_version,
    ledgerHead: input.ledgerHead,
    replayFingerprint: replayFingerprintDigest(input.replayFingerprint),
    frozen: true,
    valid: invalidReasons.length === 0,
    invalidReasons: [...new Set(invalidReasons)].sort(compareText),
    dimensionValues,
    paths,
    ambiguousMajorCommunityIds,
  };
  return canonicalFreeze({ ...core, universeId: universeId(core) }) as CoverageUniverse;
}

/** Compile the first immutable denominator for one run and profile version. */
export function compileCoverageUniverse(input: CompileCoverageUniverseInput): CoverageUniverse {
  return compileInternal(input, 1, null, []);
}

function sameStableRun(
  previous: CoverageUniverse,
  input: CompileCoverageUniverseInput,
): boolean {
  return canonicalJson({
    namespace: previous.namespace,
    run_id: previous.runId,
    mode: previous.mode,
    profile_version: previous.profileVersion,
    input_fingerprint: previous.inputFingerprint,
  }) === canonicalJson({
    namespace: input.namespace,
    run_id: input.runId,
    mode: input.mode,
    profile_version: input.profileVersion,
    input_fingerprint: input.inputFingerprint,
  });
}

/** Mint a successor denominator without rewriting the prior frozen universe. */
export function mintSuccessorCoverageUniverse(
  previous: CoverageUniverse,
  input: CompileCoverageUniverseInput,
): CoverageUniverse {
  if (!sameStableRun(previous, input)) {
    throw new TypeError('A successor universe must retain the same stable run identity');
  }
  if (input.ledgerHead.sequence < previous.ledgerHead.sequence) {
    throw new TypeError('A successor universe cannot move the ledger position backward');
  }
  const successor = compileInternal(
    input,
    previous.universeVersion + 1,
    previous.universeId,
    [...previous.invalidatesUniverseIds, previous.universeId],
  );
  if (successor.universeId === previous.universeId) {
    throw new TypeError('A successor universe must change the committed denominator state');
  }
  return successor;
}

function regionForPath(
  profile: ModeCoverageProfile,
  path: CoveragePath,
): MajorRegionDefinition | undefined {
  return profile.majorRegionRule.regions.find((region) => region.regionId === path.regionId);
}

/** Return deterministic structural failures that make a universe unsafe for stopping. */
export function validateCoverageUniverse(universe: CoverageUniverse): readonly string[] {
  const failures = new Set<string>(universe.invalidReasons);
  if (universe.schemaVersion !== COVERAGE_UNIVERSE_SCHEMA_VERSION) failures.add('unsupported_schema');
  if (universe.coverageGraphProjectionVersion !== COVERAGE_GRAPH_PROJECTION_VERSION) {
    failures.add('coverage_graph_projection_version_mismatch');
  }
  if (universe.frozen !== true) failures.add('universe_not_frozen');
  if (!universe.valid) failures.add('universe_marked_invalid');

  let profile: ModeCoverageProfile;
  try {
    profile = modeCoverageProfiles.resolve(universe.mode, universe.profileVersion);
  } catch {
    failures.add('unknown_profile');
    return Object.freeze([...failures].sort(compareText));
  }
  if (universe.paths.length === 0) failures.add('empty_coverage_universe');
  if (new Set(universe.paths.map((path) => path.pathId)).size !== universe.paths.length) {
    failures.add('duplicate_path_id');
  }
  for (const region of profile.majorRegionRule.regions) {
    if (!universe.paths.some((path) => path.regionId === region.regionId)) {
      failures.add(`missing_major_region:${region.regionId}`);
    }
  }
  const identity = {
    namespace: universe.namespace,
    runId: universe.runId,
    mode: universe.mode,
    profileVersion: universe.profileVersion,
    inputFingerprint: universe.inputFingerprint,
  } as const;
  const expectedPathIds = compilePaths(identity, profile, universe.dimensionValues)
    .map((path) => path.pathId)
    .sort(compareText);
  const actualPathIds = universe.paths.map((path) => path.pathId).sort(compareText);
  if (canonicalJson(actualPathIds) !== canonicalJson(expectedPathIds)) {
    failures.add('cartesian_path_set_mismatch');
  }
  for (const path of universe.paths) {
    const region = regionForPath(profile, path);
    if (!region) {
      failures.add(`unknown_path_region:${path.regionId}`);
      continue;
    }
    const coordinateKeys = Object.keys(path.coordinates).sort(compareText);
    if (canonicalJson(coordinateKeys) !== canonicalJson([...region.dimensionIds].sort(compareText))) {
      failures.add(`path_coordinate_mismatch:${path.pathId}`);
    }
    if (derivePathId(identity, path.regionId, path.coordinates) !== path.pathId) {
      failures.add(`path_identity_mismatch:${path.pathId}`);
    }
    if (canonicalJson(path.requiredEvidenceClasses) !== canonicalJson(
      [...region.requiredEvidenceClasses].sort(compareText),
    )) {
      failures.add(`path_evidence_contract_mismatch:${path.pathId}`);
    }
  }
  const { universeId: actualUniverseId, ...core } = universe;
  if (universeId(core) !== actualUniverseId) failures.add('universe_hash_mismatch');
  return Object.freeze([...failures].sort(compareText));
}

/** Check a certificate against the currently active denominator. */
export function isCoverageCertificateCurrent(
  certificate: CoverageCertificate,
  activeUniverse: CoverageUniverse,
): boolean {
  return certificate.universeId === activeUniverse.universeId
    && certificate.universeVersion === activeUniverse.universeVersion
    && certificate.communityMembershipDigest === activeUniverse.communityMembershipDigest;
}
