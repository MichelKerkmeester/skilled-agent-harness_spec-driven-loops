// ───────────────────────────────────────────────────────────────────
// MODULE: Path Coverage Reducer
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import { PATH_COVERAGE_PROJECTION_VERSION } from './types.js';

import type {
  AuthorizedExclusion,
  CoveragePath,
  CoverageUniverse,
  EvidenceLocator,
  LedgerEventOrigin,
  PathCoverageEvent,
  PathCoverageProjection,
  PathCoverageRecord,
  PathState,
  SemanticEvidenceGrowthRecord,
} from './types.js';

const SHA256_PATTERN = /^[a-f0-9]{64}$/;

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

function requireDigest(value: string, field: string): void {
  if (!SHA256_PATTERN.test(value)) throw new TypeError(`${field} must be a SHA-256 digest`);
}

function validateOrigin(origin: LedgerEventOrigin, universe: CoverageUniverse): void {
  if (origin.ledgerId !== universe.ledgerHead.ledgerId) {
    throw new TypeError('Path transition origin belongs to a different ledger');
  }
  if (
    !Number.isSafeInteger(origin.sequence)
    || origin.sequence <= 0
    || origin.sequence > universe.ledgerHead.sequence
  ) {
    throw new TypeError('Path transition origin is outside the frozen ledger range');
  }
  if (origin.eventId.length === 0) throw new TypeError('Path transition event identity is required');
  requireDigest(origin.recordHash, 'origin.recordHash');
}

function validateEvidence(locator: EvidenceLocator, universe: CoverageUniverse): void {
  if (locator.evidenceClass.length === 0) throw new TypeError('Evidence class is required');
  requireDigest(locator.digest, 'evidence.digest');
  if (locator.kind === 'ledger-event') {
    if (locator.ledgerId !== universe.ledgerHead.ledgerId) {
      throw new TypeError('Evidence locator belongs to a different ledger');
    }
    if (
      !Number.isSafeInteger(locator.sequence)
      || locator.sequence <= 0
      || locator.sequence > universe.ledgerHead.sequence
    ) {
      throw new TypeError('Evidence locator is outside the frozen ledger range');
    }
    if (locator.eventId.length === 0) throw new TypeError('Evidence event identity is required');
    return;
  }
  if (
    locator.projectionVersion.length === 0
    || locator.rowId.length === 0
  ) {
    throw new TypeError('Projection evidence requires a version and row identity');
  }
  if (
    locator.projectionKind === 'semantic-community'
    && locator.projectionVersion !== universe.communityProjectionVersion
  ) {
    throw new TypeError('Semantic evidence belongs to a stale projection version');
  }
  if (
    locator.projectionKind === 'claim-relationship'
    && locator.projectionVersion !== universe.relationshipProjectionVersion
  ) {
    throw new TypeError('Relationship evidence belongs to a stale projection version');
  }
  if (
    locator.projectionKind === 'coverage-graph'
    && locator.projectionVersion !== universe.coverageGraphProjectionVersion
  ) {
    throw new TypeError('Coverage graph evidence belongs to a stale projection version');
  }
}

function validateExclusion(exclusion: AuthorizedExclusion): void {
  if (
    exclusion.reasonCode.length === 0
    || exclusion.policyId.length === 0
    || exclusion.policyVersion.length === 0
  ) {
    throw new TypeError('Exclusion requires a reason and versioned policy identity');
  }
  const authorization = exclusion.authorization;
  if (!Number.isSafeInteger(authorization.audit_sequence) || authorization.audit_sequence <= 0) {
    throw new TypeError('Exclusion authorization requires a durable audit sequence');
  }
  requireDigest(authorization.audit_record_hash, 'exclusion.authorization.audit_record_hash');
  requireDigest(authorization.decision_digest, 'exclusion.authorization.decision_digest');
  requireDigest(authorization.request_digest, 'exclusion.authorization.request_digest');
  requireDigest(authorization.policy_digest, 'exclusion.authorization.policy_digest');
}

function uniqueEvidence(
  existing: readonly EvidenceLocator[],
  added: readonly EvidenceLocator[],
): readonly EvidenceLocator[] {
  const values = new Map<string, EvidenceLocator>();
  [...existing, ...added].forEach((locator) => values.set(canonicalJson(locator), locator));
  return Object.freeze([...values.values()].sort((left, right) => (
    compareText(canonicalJson(left), canonicalJson(right))
  )));
}

function missingEvidenceClasses(
  path: CoveragePath,
  evidence: readonly EvidenceLocator[],
): readonly string[] {
  const observed = new Set(evidence.map((locator) => locator.evidenceClass));
  return path.requiredEvidenceClasses.filter((evidenceClass) => !observed.has(evidenceClass));
}

function initialRecord(pathId: string): PathCoverageRecord {
  return Object.freeze({
    pathId,
    state: 'unvisited',
    evidence: [],
    blockerIds: [],
    exclusion: null,
    transitions: [],
  });
}

function transition(
  record: PathCoverageRecord,
  state: PathState,
  origin: LedgerEventOrigin,
  reason: string,
  updates: Partial<Pick<PathCoverageRecord, 'evidence' | 'blockerIds' | 'exclusion'>> = {},
): PathCoverageRecord {
  return Object.freeze({
    ...record,
    ...updates,
    state,
    transitions: Object.freeze([
      ...record.transitions,
      Object.freeze({
        eventId: origin.eventId,
        ledgerSequence: origin.sequence,
        from: record.state,
        to: state,
        reason,
      }),
    ]),
  });
}

function projectionHash(
  projection: Omit<PathCoverageProjection, 'projectionHash'>,
): string {
  return sha256Bytes(canonicalBytes(projection));
}

function finalizeProjection(
  universe: CoverageUniverse,
  paths: Readonly<Record<string, PathCoverageRecord>>,
  semanticEvidenceGrowth: readonly SemanticEvidenceGrowthRecord[],
  lateDiscoveredMajorRegionIds: readonly string[],
  sourceEventIds: readonly string[],
  lastLedgerSequence: number,
): PathCoverageProjection {
  const core: Omit<PathCoverageProjection, 'projectionHash'> = {
    projectionVersion: PATH_COVERAGE_PROJECTION_VERSION,
    universeId: universe.universeId,
    paths,
    semanticEvidenceGrowth,
    lateDiscoveredMajorRegionIds,
    staleUniverse: lateDiscoveredMajorRegionIds.length > 0,
    sourceEventIds,
    lastLedgerSequence,
  };
  return canonicalFreeze({ ...core, projectionHash: projectionHash(core) });
}

/** Create the replay base state for every path in a frozen universe. */
export function createEmptyPathCoverageProjection(
  universe: CoverageUniverse,
): PathCoverageProjection {
  const paths = Object.fromEntries(universe.paths.map((path) => [
    path.pathId,
    initialRecord(path.pathId),
  ]));
  return finalizeProjection(universe, paths, [], [], [], 0);
}

function sortedEvents(events: readonly PathCoverageEvent[]): readonly PathCoverageEvent[] {
  const ordered = [...events].sort((left, right) => (
    left.origin.sequence - right.origin.sequence
    || compareText(left.origin.eventId, right.origin.eventId)
  ));
  const sequences = new Set<number>();
  const eventIds = new Set<string>();
  for (const event of ordered) {
    if (sequences.has(event.origin.sequence)) {
      throw new TypeError(`Repeated ledger sequence: ${event.origin.sequence}`);
    }
    if (eventIds.has(event.origin.eventId)) {
      throw new TypeError(`Repeated path coverage event identity: ${event.origin.eventId}`);
    }
    sequences.add(event.origin.sequence);
    eventIds.add(event.origin.eventId);
  }
  return ordered;
}

/** Fold path transitions in durable ledger order into one deterministic projection. */
export function reducePathCoverage(
  universe: CoverageUniverse,
  events: readonly PathCoverageEvent[],
): PathCoverageProjection {
  const initial = createEmptyPathCoverageProjection(universe);
  const paths: Record<string, PathCoverageRecord> = { ...initial.paths };
  const pathDefinitions = new Map(universe.paths.map((path) => [path.pathId, path]));
  const communityPaths = new Map(universe.paths
    .filter((path) => path.semanticCommunityId !== null)
    .map((path) => [path.semanticCommunityId as string, path.pathId]));
  const semanticEvidenceGrowth: SemanticEvidenceGrowthRecord[] = [];
  const lateDiscoveredMajorRegionIds = new Set<string>();
  const sourceEventIds: string[] = [];
  let lastLedgerSequence = 0;

  for (const event of sortedEvents(events)) {
    validateOrigin(event.origin, universe);
    sourceEventIds.push(event.origin.eventId);
    lastLedgerSequence = event.origin.sequence;

    if (event.kind === 'semantic-novelty-observed') {
      event.evidence.forEach((locator) => validateEvidence(locator, universe));
      const pathId = event.communityId === null ? undefined : communityPaths.get(event.communityId);
      if (event.concept === 'new_community' && !pathId) {
        lateDiscoveredMajorRegionIds.add(event.communityId ?? `unknown-${event.origin.eventId}`);
      }
      if (event.communityId !== null) {
        semanticEvidenceGrowth.push(Object.freeze({
          communityId: event.communityId,
          concept: event.concept,
          evidence: uniqueEvidence([], event.evidence),
          eventId: event.origin.eventId,
          ledgerSequence: event.origin.sequence,
        }));
      }
      continue;
    }

    const path = pathDefinitions.get(event.pathId);
    const current = paths[event.pathId];
    if (!path || !current) throw new TypeError(`Unknown coverage path: ${event.pathId}`);

    if (event.kind === 'path-activated') {
      if (current.state === 'excluded') throw new TypeError('An excluded path cannot be reactivated');
      paths[event.pathId] = transition(current, 'active', event.origin, 'exploration-started');
      continue;
    }
    if (event.kind === 'path-blocked') {
      if (event.blockerId.length === 0) throw new TypeError('Blocked paths require a blocker identity');
      if (current.state === 'excluded') throw new TypeError('An excluded path cannot become blocked');
      paths[event.pathId] = transition(current, 'blocked', event.origin, 'stop-blocker-observed', {
        blockerIds: Object.freeze([...new Set([...current.blockerIds, event.blockerId])].sort(compareText)),
      });
      continue;
    }

    event.evidence.forEach((locator) => validateEvidence(locator, universe));
    const evidence = uniqueEvidence(current.evidence, event.evidence);
    if (event.kind === 'path-addressed') {
      if (current.state === 'excluded') throw new TypeError('An excluded path cannot be addressed');
      const missing = missingEvidenceClasses(path, evidence);
      if (missing.length > 0) {
        throw new TypeError(`Path closure lacks mandatory evidence classes: ${missing.join(', ')}`);
      }
      paths[event.pathId] = transition(current, 'addressed', event.origin, 'evidence-obligations-satisfied', {
        evidence,
        blockerIds: [],
        exclusion: null,
      });
      continue;
    }

    validateExclusion(event.exclusion);
    if (evidence.length === 0) {
      throw new TypeError('An excluded path must retain ledger or projection evidence');
    }
    paths[event.pathId] = transition(current, 'excluded', event.origin, 'authorized-policy-exclusion', {
      evidence,
      blockerIds: [],
      exclusion: event.exclusion,
    });
  }

  const orderedPaths = Object.fromEntries(Object.entries(paths).sort(([left], [right]) => (
    compareText(left, right)
  )));
  return finalizeProjection(
    universe,
    orderedPaths,
    semanticEvidenceGrowth.sort((left, right) => (
      left.ledgerSequence - right.ledgerSequence || compareText(left.eventId, right.eventId)
    )),
    [...lateDiscoveredMajorRegionIds].sort(compareText),
    sourceEventIds,
    lastLedgerSequence,
  );
}
