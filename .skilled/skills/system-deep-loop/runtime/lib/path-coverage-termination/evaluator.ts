// ───────────────────────────────────────────────────────────────────
// MODULE: Path Coverage Termination Evaluator
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import { modeCoverageProfiles } from './profiles.js';
import {
  PATH_COVERAGE_PROJECTION_VERSION,
  PATH_COVERAGE_SCHEMA_VERSION,
} from './types.js';
import { validateCoverageUniverse } from './universe.js';

import type {
  AuthorizedExclusion,
  CertificatePathRecord,
  CoverageCertificate,
  CoveragePath,
  CoverageUniverse,
  EvaluatePathCoverageInput,
  EvidenceLocator,
  PartialCoverageReport,
  PathCoverageEvaluation,
  PathCoverageProjection,
  PathCoverageRecord,
  TerminationDecision,
  UncoveredPathReport,
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

function roundCoverage(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function validEvidenceLocator(
  locator: EvidenceLocator,
  universe: CoverageUniverse,
): boolean {
  if (locator.evidenceClass.length === 0 || !SHA256_PATTERN.test(locator.digest)) {
    return false;
  }
  if (locator.kind === 'ledger-event') {
    return locator.ledgerId === universe.ledgerHead.ledgerId
      && Number.isSafeInteger(locator.sequence)
      && locator.sequence > 0
      && locator.sequence <= universe.ledgerHead.sequence
      && locator.eventId.length > 0;
  }
  if (locator.projectionVersion.length === 0 || locator.rowId.length === 0) {
    return false;
  }
  if (locator.projectionKind === 'semantic-community') {
    return locator.projectionVersion === universe.communityProjectionVersion;
  }
  if (locator.projectionKind === 'claim-relationship') {
    return locator.projectionVersion === universe.relationshipProjectionVersion;
  }
  return locator.projectionVersion === universe.coverageGraphProjectionVersion;
}

function validExclusion(
  exclusion: AuthorizedExclusion | null,
  audit: EvaluatePathCoverageInput['authorizationAudit'],
): boolean {
  if (exclusion === null) return false;
  const authorization = exclusion.authorization;
  if (
    exclusion.reasonCode.length === 0
    || exclusion.policyId.length === 0
    || exclusion.policyVersion.length === 0
    || authorization.audit_ledger_id.length === 0
    || !Number.isSafeInteger(authorization.audit_sequence)
    || authorization.audit_sequence <= 0
    || !SHA256_PATTERN.test(authorization.audit_record_hash)
    || authorization.decision_id.length === 0
    || !SHA256_PATTERN.test(authorization.decision_digest)
    || !SHA256_PATTERN.test(authorization.request_digest)
    || !SHA256_PATTERN.test(authorization.policy_digest)
    || !Number.isSafeInteger(authorization.authority_epoch)
    || authorization.authority_epoch <= 0
    || authorization.audit_ledger_id !== audit.head.ledgerId
    || authorization.audit_sequence > audit.head.sequence
  ) {
    return false;
  }
  const entry = audit.entries.find((candidate) => (
    candidate.receipt.auditLedgerId === authorization.audit_ledger_id
    && candidate.receipt.sequence === authorization.audit_sequence
    && candidate.decision.decision_id === authorization.decision_id
  ));
  if (!entry) return false;
  return entry.receipt.recordHash === authorization.audit_record_hash
    && entry.frame.ledger_id === authorization.audit_ledger_id
    && entry.frame.sequence === authorization.audit_sequence
    && entry.frame.record_hash === authorization.audit_record_hash
    && entry.frame.decision_digest === authorization.decision_digest
    && entry.decision.decision === 'allow'
    && entry.decision.decision_digest === authorization.decision_digest
    && entry.decision.request_digest === authorization.request_digest
    && entry.decision.policy_digest === authorization.policy_digest
    && entry.decision.authority_epoch === authorization.authority_epoch
    && entry.decision.policy_id === exclusion.policyId
    && String(entry.decision.policy_version) === exclusion.policyVersion
    && (
      authorization.audit_sequence !== audit.head.sequence
      || authorization.audit_record_hash === audit.head.recordHash
    );
}

function missingEvidence(
  path: CoveragePath,
  evidence: readonly EvidenceLocator[],
): readonly string[] {
  const observed = new Set(evidence.map((locator) => locator.evidenceClass));
  return Object.freeze(path.requiredEvidenceClasses.filter((entry) => !observed.has(entry)));
}

function projectionHashMatches(projection: PathCoverageProjection): boolean {
  const { projectionHash, ...core } = projection;
  return sha256Bytes(canonicalBytes(core)) === projectionHash;
}

interface EvaluatedPath {
  readonly definition: CoveragePath;
  readonly record: PathCoverageRecord;
  readonly closed: boolean;
  readonly hasInvalidEvidenceLocator: boolean;
  readonly hasValidExclusionAuthorization: boolean;
  readonly missingEvidenceClasses: readonly string[];
}

function evaluatePaths(input: EvaluatePathCoverageInput): readonly EvaluatedPath[] {
  const profile = modeCoverageProfiles.resolve(
    input.universe.mode,
    input.universe.profileVersion,
  );
  return Object.freeze(input.universe.paths.map((definition) => {
    const record = input.projection.paths[definition.pathId] ?? {
      pathId: definition.pathId,
      state: 'unvisited' as const,
      evidence: [],
      blockerIds: [],
      exclusion: null,
      transitions: [],
    };
    const validEvidence = record.evidence.filter((locator) => (
      validEvidenceLocator(locator, input.universe)
    ));
    const hasInvalidEvidenceLocator = validEvidence.length !== record.evidence.length;
    const missingEvidenceClasses = missingEvidence(definition, validEvidence);
    const hasValidExclusionAuthorization = record.state === 'excluded'
      && validExclusion(record.exclusion, input.authorizationAudit);
    const addressed = record.state === 'addressed'
      && validEvidence.length > 0
      && !hasInvalidEvidenceLocator
      && missingEvidenceClasses.length === 0;
    const excluded = record.state === 'excluded'
      && validEvidence.length > 0
      && !hasInvalidEvidenceLocator
      && hasValidExclusionAuthorization;
    return Object.freeze({
      definition,
      record,
      closed: profile.closeableStatuses.includes(record.state as 'addressed' | 'excluded')
        && (addressed || excluded),
      hasInvalidEvidenceLocator,
      hasValidExclusionAuthorization,
      missingEvidenceClasses,
    });
  }));
}

function contradictionIds(input: EvaluatePathCoverageInput): readonly string[] {
  return Object.freeze(input.relationshipProjection.active_relationships
    .filter((relationship) => relationship.kind === 'CONTRADICTION')
    .map((relationship) => relationship.relationship_id)
    .sort(compareText));
}

function blockerIds(
  input: EvaluatePathCoverageInput,
  paths: readonly EvaluatedPath[],
  unresolvedContradictionIds: readonly string[],
): readonly string[] {
  const blockers = new Set<string>();
  validateCoverageUniverse(input.universe).forEach((failure) => blockers.add(`universe:${failure}`));
  if (input.activeUniverseId !== input.universe.universeId) blockers.add('universe:stale-successor-exists');
  if (input.projection.universeId !== input.universe.universeId) blockers.add('projection:universe-mismatch');
  if (input.projection.projectionVersion !== PATH_COVERAGE_PROJECTION_VERSION) {
    blockers.add('projection:unsupported-version');
  }
  if (!projectionHashMatches(input.projection)) blockers.add('projection:hash-mismatch');
  const hasLateDiscoveredMajorRegion = input.projection.lateDiscoveredMajorRegionIds.length > 0;
  if (hasLateDiscoveredMajorRegion) blockers.add('projection:late-major-region');
  if (input.projection.staleUniverse !== hasLateDiscoveredMajorRegion) {
    blockers.add('projection:stale-universe-mismatch');
  }
  if (input.projection.lastLedgerSequence > input.universe.ledgerHead.sequence) {
    blockers.add('projection:ledger-range-exceeded');
  }
  const expectedPathIds = input.universe.paths.map((path) => path.pathId).sort(compareText);
  const projectedPathIds = Object.keys(input.projection.paths).sort(compareText);
  if (canonicalJson(expectedPathIds) !== canonicalJson(projectedPathIds)) {
    blockers.add('projection:path-set-mismatch');
  }
  if (
    !input.projectionFreshness.fresh
    || input.projectionFreshness.communityProjectionVersion
      !== input.universe.communityProjectionVersion
    || input.projectionFreshness.communityMembershipDigest
      !== input.universe.communityMembershipDigest
    || input.projectionFreshness.relationshipProjectionVersion
      !== input.universe.relationshipProjectionVersion
    || input.projectionFreshness.ledgerSequence !== input.universe.ledgerHead.sequence
  ) {
    blockers.add('projection:stale');
  }
  if (
    input.relationshipProjection.projection_schema_version
      !== input.universe.relationshipProjectionVersion
  ) {
    blockers.add('contradiction:projection-version-mismatch');
  }
  if (
    unresolvedContradictionIds.length
      !== input.relationshipProjection.canonical_active_contradiction_count
  ) {
    blockers.add('contradiction:canonical-count-mismatch');
  }
  unresolvedContradictionIds.forEach((id) => blockers.add(`contradiction:${id}`));
  input.universe.ambiguousMajorCommunityIds.forEach((id) => blockers.add(`community:${id}`));
  input.stopBlockers
    .filter((blocker) => blocker.severity === 'STOP')
    .forEach((blocker) => blockers.add(`stop:${blocker.blockerId}`));
  for (const path of paths) {
    if (path.record.pathId !== path.definition.pathId) {
      blockers.add(`path:${path.definition.pathId}:record-id-mismatch`);
    }
    if (path.record.state === 'blocked') {
      if (path.record.blockerIds.length === 0) blockers.add(`path:${path.definition.pathId}:blocked`);
      path.record.blockerIds.forEach((id) => blockers.add(`path:${path.definition.pathId}:${id}`));
    }
    if (
      (path.record.state === 'addressed' || path.record.state === 'excluded')
      && !path.closed
    ) {
      if (path.hasInvalidEvidenceLocator) {
        blockers.add(`path:${path.definition.pathId}:invalid-evidence-locator`);
      }
      if (path.record.state === 'excluded' && !path.hasValidExclusionAuthorization) {
        blockers.add(`path:${path.definition.pathId}:exclusion-authorization-mismatch`);
      }
      blockers.add(`path:${path.definition.pathId}:invalid-closure`);
    }
  }
  return Object.freeze([...blockers].sort(compareText));
}

function decisionFor(
  blockerIdList: readonly string[],
  openPathIds: readonly string[],
  input: EvaluatePathCoverageInput,
): TerminationDecision {
  if (blockerIdList.length > 0) return 'STOP_BLOCKED';
  if (openPathIds.length === 0) return 'STOP_ALLOWED';
  if (input.limit.reached) return 'INCOMPLETE_LIMIT';
  return 'CONTINUE';
}

function certificatePath(path: EvaluatedPath): CertificatePathRecord {
  return Object.freeze({
    pathId: path.definition.pathId,
    regionId: path.definition.regionId,
    mandatory: path.definition.mandatory,
    major: path.definition.major,
    weight: path.definition.weight,
    state: path.record.state,
    requiredEvidenceClasses: path.definition.requiredEvidenceClasses,
    evidence: path.record.evidence,
    blockerIds: path.record.blockerIds,
    exclusion: path.record.exclusion,
  });
}

function certificateHash(
  certificate: Omit<CoverageCertificate, 'certificateHash'>,
): string {
  return sha256Bytes(canonicalBytes(certificate));
}

function buildCertificate(
  input: EvaluatePathCoverageInput,
  decision: TerminationDecision,
  paths: readonly EvaluatedPath[],
  blockerIdList: readonly string[],
  unresolvedContradictionIds: readonly string[],
): CoverageCertificate {
  const closed = paths.filter((path) => path.closed);
  const open = paths.filter((path) => !path.closed);
  const blocked = paths.filter((path) => path.record.state === 'blocked');
  const totalWeight = paths.reduce((sum, path) => sum + path.definition.weight, 0);
  const closedWeight = closed.reduce((sum, path) => sum + path.definition.weight, 0);
  const exclusions = closed
    .map((path) => path.record.exclusion)
    .filter((entry): entry is AuthorizedExclusion => entry !== null);
  const core: Omit<CoverageCertificate, 'certificateHash'> = {
    schemaVersion: PATH_COVERAGE_SCHEMA_VERSION,
    decision,
    universeId: input.universe.universeId,
    universeVersion: input.universe.universeVersion,
    profileVersion: input.universe.profileVersion,
    mode: input.universe.mode,
    runId: input.universe.runId,
    inputFingerprint: input.universe.inputFingerprint,
    replayFingerprint: input.universe.replayFingerprint,
    ledgerHead: input.universe.ledgerHead,
    coverageGraphProjectionVersion: input.universe.coverageGraphProjectionVersion,
    communityProjectionVersion: input.universe.communityProjectionVersion,
    communityMembershipDigest: input.universe.communityMembershipDigest,
    relationshipProjectionVersion: input.universe.relationshipProjectionVersion,
    projectionFresh: blockerIdList.every((id) => !id.startsWith('projection:')),
    denominator: paths.length,
    closedPathCount: closed.length,
    addressedMajorRegions: closed.filter((path) => path.definition.major).length,
    totalMajorRegions: paths.filter((path) => path.definition.major).length,
    unweightedCoverage: paths.length === 0 ? 0 : roundCoverage(closed.length / paths.length),
    weightedCoverage: totalWeight === 0 ? 0 : roundCoverage(closedWeight / totalWeight),
    openPathIds: open.map((path) => path.definition.pathId).sort(compareText),
    blockedPathIds: blocked.map((path) => path.definition.pathId).sort(compareText),
    blockerIds: blockerIdList,
    unresolvedContradictionIds,
    ambiguousMajorCommunityIds: input.universe.ambiguousMajorCommunityIds,
    exclusions,
    paths: paths.map(certificatePath).sort((left, right) => compareText(left.pathId, right.pathId)),
    semanticEvidenceGrowth: input.projection.semanticEvidenceGrowth,
    triggeredLimit: input.limit.reached
      ? { kind: input.limit.kind, limitId: input.limit.limitId }
      : null,
  };
  return canonicalFreeze({ ...core, certificateHash: certificateHash(core) });
}

function uncoveredPathReport(path: EvaluatedPath, rank: number): UncoveredPathReport {
  return Object.freeze({
    rank,
    pathId: path.definition.pathId,
    regionId: path.definition.regionId,
    state: path.record.state,
    mandatory: path.definition.mandatory,
    weight: path.definition.weight,
    blockerIds: path.record.blockerIds,
    requiredEvidenceClasses: path.definition.requiredEvidenceClasses,
    missingEvidenceClasses: path.missingEvidenceClasses,
  });
}

function buildPartialReport(
  input: EvaluatePathCoverageInput,
  certificate: CoverageCertificate,
): PartialCoverageReport {
  if (certificate.decision === 'STOP_ALLOWED') {
    throw new TypeError('A complete stop certificate does not have a partial report');
  }
  const open = certificate.paths
    .filter((path) => certificate.openPathIds.includes(path.pathId))
    .sort((left, right) => {
      const blockedOrder = Number(right.state === 'blocked') - Number(left.state === 'blocked');
      if (blockedOrder !== 0) return blockedOrder;
      if (left.mandatory !== right.mandatory) return Number(right.mandatory) - Number(left.mandatory);
      return right.weight - left.weight || compareText(left.pathId, right.pathId);
    });
  const definitions = new Map(input.universe.paths.map((path) => [path.pathId, path]));
  const uncoveredPaths = open.map((path, index) => {
    const definition = definitions.get(path.pathId) as CoveragePath;
    const source = input.projection.paths[path.pathId];
    const record: PathCoverageRecord = source ?? {
      pathId: path.pathId,
      state: path.state,
      evidence: path.evidence,
      blockerIds: path.blockerIds,
      exclusion: path.exclusion,
      transitions: [],
    };
    const validEvidence = record.evidence.filter((locator) => (
      validEvidenceLocator(locator, input.universe)
    ));
    return uncoveredPathReport({
      definition,
      record,
      closed: false,
      hasInvalidEvidenceLocator: validEvidence.length !== record.evidence.length,
      hasValidExclusionAuthorization: record.state === 'excluded'
        && validExclusion(record.exclusion, input.authorizationAudit),
      missingEvidenceClasses: missingEvidence(definition, validEvidence),
    }, index + 1);
  });
  return canonicalFreeze({
    decision: certificate.decision,
    certificateHash: certificate.certificateHash,
    universeId: certificate.universeId,
    denominator: certificate.denominator,
    addressedMajorRegions: certificate.addressedMajorRegions,
    totalMajorRegions: certificate.totalMajorRegions,
    weightedCoverage: certificate.weightedCoverage,
    unweightedCoverage: certificate.unweightedCoverage,
    openPathIds: certificate.openPathIds,
    blockedPathIds: certificate.blockedPathIds,
    blockerIds: certificate.blockerIds,
    unresolvedContradictionIds: certificate.unresolvedContradictionIds,
    projectionVersions: {
      coverageGraph: certificate.coverageGraphProjectionVersion,
      community: certificate.communityProjectionVersion,
      communityMembership: certificate.communityMembershipDigest,
      relationship: certificate.relationshipProjectionVersion,
    },
    triggeredLimit: certificate.triggeredLimit,
    uncoveredPaths,
    authorizedExclusions: certificate.exclusions,
  }) as PartialCoverageReport;
}

function reasonFor(decision: TerminationDecision, certificate: CoverageCertificate): string {
  if (decision === 'STOP_ALLOWED') return 'Every required path is evidence-closed with fresh projections and no blockers';
  if (decision === 'STOP_BLOCKED') return `Stopping is blocked by: ${certificate.blockerIds.join(', ')}`;
  if (decision === 'INCOMPLETE_LIMIT') {
    const limit = certificate.triggeredLimit;
    return `${limit?.kind as string} limit ${limit?.limitId as string} reached with ${certificate.openPathIds.length} uncovered path(s)`;
  }
  return `${certificate.openPathIds.length} required path(s) remain open`;
}

/** Evaluate stopping from explicit frozen inputs without consulting iteration count. */
export function evaluatePathCoverageTermination(
  input: EvaluatePathCoverageInput,
): PathCoverageEvaluation {
  const paths = evaluatePaths(input);
  const unresolvedContradictionIds = contradictionIds(input);
  const blockers = blockerIds(input, paths, unresolvedContradictionIds);
  const openPathIds = paths
    .filter((path) => !path.closed)
    .map((path) => path.definition.pathId)
    .sort(compareText);
  const decision = decisionFor(blockers, openPathIds, input);
  const certificate = buildCertificate(
    input,
    decision,
    paths,
    blockers,
    unresolvedContradictionIds,
  );
  return canonicalFreeze({
    decision,
    reason: reasonFor(decision, certificate),
    certificate,
    partialCoverage: decision === 'STOP_ALLOWED'
      ? null
      : buildPartialReport(input, certificate),
  });
}
