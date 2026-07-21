// ───────────────────────────────────────────────────────────────────
// MODULE: Path Coverage Termination Unit Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createEmptyClaimRelationshipProjection } from '../../lib/contradiction-supersession/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  MODE_COVERAGE_PROFILES,
  ModeCoverageProfileRegistry,
  compileCoverageUniverse,
  createPathCoverageShadowEvaluation,
  evaluatePathCoverageTermination,
  isCoverageCertificateCurrent,
  mintSuccessorCoverageUniverse,
  modeCoverageProfiles,
  reducePathCoverage,
  validateModeCoverageProfile,
} from '../../lib/path-coverage-termination/index.js';

import type { AuthorizationReference } from '../../lib/authorized-ledger/authorized-ledger-types.js';
import type { VerifiedAuthorizationAudit } from '../../lib/authorized-ledger/index.js';
import type {
  ActiveRelationshipProjection,
  ClaimRelationshipProjection,
} from '../../lib/contradiction-supersession/index.js';
import type {
  CompileCoverageUniverseInput,
  CoveragePath,
  CoverageUniverse,
  EvidenceLocator,
  LegacyCouncilBridge,
  LimitKind,
  ModeCoverageProfile,
  PathCoverageEvent,
  PathCoverageMode,
  PathCoverageProjection,
  ProjectionFreshness,
} from '../../lib/path-coverage-termination/index.js';
import type {
  SemanticCommunityProjection,
  SemanticMembershipRecord,
} from '../../lib/semantic-communities/index.js';

const NAMESPACE = Object.freeze({
  specFolder: 'specs/path-coverage-fixture',
  sessionId: 'path-coverage-fixture',
});
const LEDGER_ID = 'path-coverage-ledger';
const LEDGER_SEQUENCE = 1_000;

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function semanticProjection(
  communityCount = 1,
  claimsPerCommunity = 1,
  ambiguous = false,
  projectionVersion = 'semantic-projection@fixture-1',
): SemanticCommunityProjection {
  const claims: Record<string, SemanticCommunityProjection['claims'][string]> = {};
  const communities: Record<string, SemanticCommunityProjection['communities'][string]> = {};
  const memberships: Record<string, SemanticMembershipRecord> = {};
  let sequence = 1;
  for (let communityIndex = 1; communityIndex <= communityCount; communityIndex += 1) {
    const communityId = `community-${communityIndex}`;
    const memberClaimIds: string[] = [];
    for (let claimIndex = 1; claimIndex <= claimsPerCommunity; claimIndex += 1) {
      const claimId = `claim-${communityIndex}-${claimIndex}`;
      memberClaimIds.push(claimId);
      claims[claimId] = {
        claim_id: claimId,
        raw_text: `Claim ${communityIndex} paraphrase ${claimIndex}`,
        normalized_fingerprint: digest({ communityIndex, claimIndex }),
        evidence_links: [`ledger://evidence/${communityIndex}/${claimIndex}`],
        namespace: {
          spec_folder: NAMESPACE.specFolder,
          loop_type: 'research',
          session_id: NAMESPACE.sessionId,
        },
        coverage_node_name: claimId,
        coverage_node_content_hash: digest(claimId),
        coverage_node_iteration: sequence,
        originating_ledger_event: {
          ledger_id: LEDGER_ID,
          sequence,
          event_id: `semantic-event-${sequence}`,
          record_hash: digest({ semantic: sequence }),
        },
      };
      memberships[claimId] = {
        claim_id: claimId,
        status: 'stable',
        community_id: communityId,
        candidate_community_ids: [],
        membership_version: `membership-${communityIndex}`,
      };
      sequence += 1;
    }
    communities[communityId] = {
      community_id: communityId,
      representative_claim_id: memberClaimIds[0],
      member_claim_ids: memberClaimIds,
      membership_version: `membership-${communityIndex}`,
      membership_version_hash: digest({ communityId, memberClaimIds }),
    };
  }
  if (ambiguous) {
    memberships['claim-ambiguous'] = {
      claim_id: 'claim-ambiguous',
      status: 'ambiguous',
      community_id: null,
      candidate_community_ids: Object.keys(communities),
      membership_version: 'membership-ambiguous',
    };
  }
  return Object.freeze({
    schema_version: 'semantic-community-projection@1',
    namespace: {
      spec_folder: NAMESPACE.specFolder,
      loop_type: 'research',
      session_id: NAMESPACE.sessionId,
    },
    projection_version: projectionVersion,
    config_digest: digest({ projectionVersion }),
    claims: Object.freeze(claims),
    edges: Object.freeze({}),
    communities: Object.freeze(communities),
    memberships: Object.freeze(memberships),
    lineage: [],
    last_ledger_sequence: sequence - 1,
  });
}

function contradictionProjection(): ClaimRelationshipProjection {
  const evidenceState = Object.freeze({
    assertion_event_id: 'contradiction-event-1',
    withdrawal_event_id: null,
    evidence_refs: [],
    assertion_evidence_refs: [],
    withdrawal_evidence_refs: [],
    evidence_snapshot_ref: 'claim-snapshot-1',
  });
  const relationship: ActiveRelationshipProjection = Object.freeze({
    relationship_id: 'relationship-critical-1',
    kind: 'CONTRADICTION',
    source_claim_id: 'claim-1-1',
    counterpart_claim_id: 'claim-critical-counterpart',
    scope: 'same factual proposition',
    assertion_event_id: 'contradiction-event-1',
    detector_version: 'detector@1',
    semantic_community_ids: ['community-1'],
    evidence_state: evidenceState,
  });
  return Object.freeze({
    projection_schema_version: 'claim-relationships-projection@1',
    authority_mode: 'additive-dark',
    history: [],
    active_relationships: [relationship],
    claims: {},
    canonical_active_contradiction_count: 1,
  });
}

function dimensionsFor(profile: ModeCoverageProfile): Readonly<Record<string, readonly string[]>> {
  return Object.freeze(Object.fromEntries(profile.pathDimensions
    .filter((dimension) => dimension.source === 'declared')
    .map((dimension) => [
      dimension.dimensionId,
      Object.freeze([`${dimension.dimensionId}-fixture`]),
    ])));
}

function compileFor(
  mode: PathCoverageMode,
  options: Readonly<{
    semantic?: SemanticCommunityProjection;
    relationship?: ClaimRelationshipProjection;
    dimensions?: Readonly<Record<string, readonly string[]>>;
    ledgerSequence?: number;
    replayLabel?: string;
  }> = {},
): CoverageUniverse {
  const profile = MODE_COVERAGE_PROFILES.find((entry) => entry.mode === mode) as ModeCoverageProfile;
  const semantic = options.semantic ?? semanticProjection();
  const relationship = options.relationship ?? createEmptyClaimRelationshipProjection();
  const ledgerSequence = options.ledgerSequence ?? LEDGER_SEQUENCE;
  const input: CompileCoverageUniverseInput = {
    namespace: NAMESPACE,
    runId: `run-${mode}`,
    mode,
    profileVersion: profile.profileVersion,
    inputFingerprint: digest({ mode, input: 'fixture' }),
    dimensionValues: options.dimensions ?? dimensionsFor(profile),
    semanticCommunityProjection: semantic,
    relationshipProjection: relationship,
    ledgerHead: {
      ledgerId: LEDGER_ID,
      sequence: ledgerSequence,
      recordHash: digest({ ledgerSequence }),
    },
    replayFingerprint: digest({ mode, replay: options.replayLabel ?? 'fixture' }),
  };
  return compileCoverageUniverse(input);
}

function evidenceFor(
  universe: CoverageUniverse,
  path: CoveragePath,
  sequence: number,
): readonly EvidenceLocator[] {
  return path.requiredEvidenceClasses.map((evidenceClass, index) => {
    const locatorDigest = digest({ pathId: path.pathId, evidenceClass, index });
    if (evidenceClass === 'ledger-event') {
      return Object.freeze({
        kind: 'ledger-event' as const,
        evidenceClass,
        digest: locatorDigest,
        ledgerId: LEDGER_ID,
        sequence: 1,
        eventId: `evidence-event-${sequence}-${index}`,
      });
    }
    return Object.freeze({
      kind: 'projection-row' as const,
      evidenceClass,
      digest: locatorDigest,
      projectionKind: evidenceClass === 'semantic-membership'
        ? 'semantic-community' as const
        : 'coverage-graph' as const,
      projectionVersion: evidenceClass === 'semantic-membership'
        ? universe.communityProjectionVersion
        : universe.coverageGraphProjectionVersion,
      rowId: `row-${sequence}-${index}`,
    });
  });
}

function origin(sequence: number): PathCoverageEvent['origin'] {
  return Object.freeze({
    ledgerId: LEDGER_ID,
    sequence,
    eventId: `path-event-${sequence}`,
    recordHash: digest({ pathEvent: sequence }),
  });
}

function addressedEvents(universe: CoverageUniverse): readonly PathCoverageEvent[] {
  return universe.paths.map((path, index) => ({
    kind: 'path-addressed' as const,
    pathId: path.pathId,
    origin: origin(index + 1),
    evidence: evidenceFor(universe, path, index + 1),
  }));
}

const AUTHORIZATION: AuthorizationReference = Object.freeze({
  audit_ledger_id: 'path-coverage-audit',
  audit_sequence: 1,
  audit_record_hash: digest('audit-record'),
  decision_id: 'exclusion-decision-1',
  decision_digest: digest('decision'),
  request_digest: digest('request'),
  policy_digest: digest('policy'),
  authority_epoch: 1,
});

function authorizationAudit(
  authorization: AuthorizationReference = AUTHORIZATION,
): VerifiedAuthorizationAudit {
  const decision = Object.freeze({
    decision: 'allow',
    decision_id: authorization.decision_id,
    decision_digest: authorization.decision_digest,
    request_digest: authorization.request_digest,
    policy_digest: authorization.policy_digest,
    authority_epoch: authorization.authority_epoch,
    policy_id: 'authorized-path-exclusion',
    policy_version: 1,
  });
  const receipt = Object.freeze({
    auditLedgerId: authorization.audit_ledger_id,
    sequence: authorization.audit_sequence,
    recordHash: authorization.audit_record_hash,
    canonicalEventHash: digest('authorization-audit-event'),
  });
  return Object.freeze({
    head: Object.freeze({
      ledgerId: authorization.audit_ledger_id,
      sequence: authorization.audit_sequence,
      recordHash: authorization.audit_record_hash,
    }),
    entries: Object.freeze([Object.freeze({
      frame: Object.freeze({
        ledger_id: authorization.audit_ledger_id,
        sequence: authorization.audit_sequence,
        record_hash: authorization.audit_record_hash,
        decision_digest: authorization.decision_digest,
      }),
      event: Object.freeze({}),
      decision,
      receipt,
    })]),
  }) as unknown as VerifiedAuthorizationAudit;
}

function excludedProjection(universe: CoverageUniverse): PathCoverageProjection {
  const [excluded, ...addressed] = universe.paths;
  const events: PathCoverageEvent[] = [
    {
      kind: 'path-excluded',
      pathId: excluded.pathId,
      origin: origin(1),
      evidence: [evidenceFor(universe, excluded, 1)[0]],
      exclusion: {
        reasonCode: 'not-applicable-to-frozen-input',
        policyId: 'authorized-path-exclusion',
        policyVersion: '1',
        authorization: AUTHORIZATION,
      },
    },
    ...addressed.map((path, index) => ({
      kind: 'path-addressed' as const,
      pathId: path.pathId,
      origin: origin(index + 2),
      evidence: evidenceFor(universe, path, index + 2),
    })),
  ];
  return reducePathCoverage(universe, events);
}

function freshness(universe: CoverageUniverse): ProjectionFreshness {
  return Object.freeze({
    fresh: true,
    communityProjectionVersion: universe.communityProjectionVersion,
    communityMembershipDigest: universe.communityMembershipDigest,
    relationshipProjectionVersion: universe.relationshipProjectionVersion,
    ledgerSequence: universe.ledgerHead.sequence,
  });
}

function evaluate(
  universe: CoverageUniverse,
  projection: PathCoverageProjection,
  options: Readonly<{
    relationship?: ClaimRelationshipProjection;
    activeUniverseId?: string;
    projectionFreshness?: ProjectionFreshness;
    limit?: { readonly reached: false } | {
      readonly reached: true;
      readonly kind: LimitKind;
      readonly limitId: string;
    };
    stopBlockers?: readonly { blockerId: string; severity: 'STOP' | 'WARN'; reason: string }[];
    authorizationAudit?: VerifiedAuthorizationAudit;
  }> = {},
) {
  return evaluatePathCoverageTermination({
    universe,
    activeUniverseId: options.activeUniverseId ?? universe.universeId,
    projection,
    authorizationAudit: options.authorizationAudit ?? authorizationAudit(),
    relationshipProjection: options.relationship ?? createEmptyClaimRelationshipProjection(),
    projectionFreshness: options.projectionFreshness ?? freshness(universe),
    stopBlockers: options.stopBlockers ?? [],
    limit: options.limit ?? { reached: false },
  });
}

describe('mode coverage profile registry', () => {
  it('freezes one complete denominator contract for every supported mode', () => {
    expect(modeCoverageProfiles.list().map((profile) => profile.mode)).toEqual([
      'alignment',
      'benchmark',
      'context',
      'council',
      'improvement',
      'research',
      'review',
    ]);
    for (const profile of MODE_COVERAGE_PROFILES) {
      expect(profile.pathDimensions.length).toBeGreaterThan(0);
      expect(profile.majorRegionRule.regions.length).toBeGreaterThan(0);
      expect(profile.closeableStatuses).toEqual(['addressed', 'excluded']);
      expect(profile.contradictionPolicy.blockUnresolvedCritical).toBe(true);
    }
  });

  it('rejects unknown and incomplete profiles instead of defaulting missing regions', () => {
    expect(() => modeCoverageProfiles.resolve('unknown', 'unknown@1')).toThrow(/Unknown/);
    const complete = MODE_COVERAGE_PROFILES[0];
    const incomplete = {
      ...complete,
      pathDimensions: complete.pathDimensions.slice(1),
    } as ModeCoverageProfile;
    expect(() => validateModeCoverageProfile(incomplete)).toThrow(/Incomplete or altered/);
    expect(() => new ModeCoverageProfileRegistry([incomplete])).toThrow(/Incomplete or altered/);
  });
});

describe.each(MODE_COVERAGE_PROFILES)('$mode coverage profile', (profile) => {
  it('allows stop only after complete evidence-grounded coverage', () => {
    const universe = compileFor(profile.mode);
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const result = evaluate(universe, projection);

    expect(result.decision).toBe('STOP_ALLOWED');
    expect(result.certificate.openPathIds).toEqual([]);
    expect(result.certificate.denominator).toBe(universe.paths.length);
    expect(result.certificate.weightedCoverage).toBe(1);
    expect(result.partialCoverage).toBeNull();
  });

  it('reports a partial denominator while an ordinary path remains open', () => {
    const universe = compileFor(profile.mode);
    const events = addressedEvents(universe).slice(0, -1);
    const projection = reducePathCoverage(universe, events);
    const result = evaluate(universe, projection);
    const replayed = evaluate(universe, reducePathCoverage(universe, [...events].reverse()));

    expect(result.decision).toBe('CONTINUE');
    expect(result.certificate.openPathIds).toHaveLength(1);
    expect(result.partialCoverage?.denominator).toBe(universe.paths.length);
    expect(result.partialCoverage?.uncoveredPaths[0].requiredEvidenceClasses.length)
      .toBeGreaterThan(0);
    expect(replayed.certificate.certificateHash).toBe(result.certificate.certificateHash);
  });

  it('fails closed when a required path is blocked', () => {
    const universe = compileFor(profile.mode);
    const events: PathCoverageEvent[] = [
      ...addressedEvents(universe).slice(0, -1),
      {
        kind: 'path-blocked',
        pathId: universe.paths.at(-1)?.pathId as string,
        blockerId: 'fixture-stop-blocker',
        origin: origin(universe.paths.length),
      },
    ];
    const projection = reducePathCoverage(universe, events);
    const result = evaluate(universe, projection);
    const replayed = evaluate(universe, reducePathCoverage(universe, [...events].reverse()));

    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.blockedPathIds).toHaveLength(1);
    expect(result.certificate.blockerIds.some((id) => id.includes('fixture-stop-blocker')))
      .toBe(true);
    expect(replayed.certificate.certificateHash).toBe(result.certificate.certificateHash);
  });

  it('closes a path only through an evidence-backed authorized exclusion', () => {
    const universe = compileFor(profile.mode);
    const projection = excludedProjection(universe);
    const result = evaluate(universe, projection);
    const replayed = evaluate(universe, projection);

    expect(result.decision).toBe('STOP_ALLOWED');
    expect(result.certificate.exclusions).toHaveLength(1);
    expect(result.certificate.exclusions[0]).toMatchObject({
      reasonCode: 'not-applicable-to-frozen-input',
      policyId: 'authorized-path-exclusion',
      policyVersion: '1',
    });
    expect(replayed.certificate.certificateHash).toBe(result.certificate.certificateHash);
  });

  it('blocks an empty denominator instead of treating it as vacuously complete', () => {
    const emptySemantic = semanticProjection(0);
    const emptyDimensions = Object.freeze(Object.fromEntries(profile.pathDimensions
      .filter((dimension) => dimension.source === 'declared')
      .map((dimension) => [dimension.dimensionId, Object.freeze([])])));
    const universe = compileFor(profile.mode, {
      semantic: emptySemantic,
      dimensions: emptyDimensions,
    });
    const projection = reducePathCoverage(universe, []);
    const result = evaluate(universe, projection);
    const replayed = evaluate(universe, projection);

    expect(universe.valid).toBe(false);
    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.denominator).toBe(0);
    expect(replayed.certificate.certificateHash).toBe(result.certificate.certificateHash);
  });

  it('replays shuffled input events to identical states and certificate hashes', () => {
    const universe = compileFor(profile.mode);
    const events = addressedEvents(universe);
    const forward = reducePathCoverage(universe, events);
    const replayed = reducePathCoverage(universe, [...events].reverse());
    const forwardResult = evaluate(universe, forward);
    const replayedResult = evaluate(universe, replayed);

    expect(replayed.projectionHash).toBe(forward.projectionHash);
    expect(replayedResult.certificate.certificateHash)
      .toBe(forwardResult.certificate.certificateHash);
  });

  it('blocks complete coverage when a canonical contradiction remains active', () => {
    const relationship = contradictionProjection();
    const universe = compileFor(profile.mode, { relationship });
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const result = evaluate(universe, projection, { relationship });
    const replayed = evaluate(universe, projection, { relationship });

    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.unresolvedContradictionIds)
      .toEqual(['relationship-critical-1']);
    expect(replayed.certificate.certificateHash).toBe(result.certificate.certificateHash);
  });

  it.each(['iteration', 'time', 'budget'] as const)(
    'returns INCOMPLETE_LIMIT when the %s limit fires below full coverage',
    (kind) => {
      const universe = compileFor(profile.mode);
      const events = addressedEvents(universe).slice(0, -1);
      const result = evaluate(universe, reducePathCoverage(universe, events), {
        limit: { reached: true, kind, limitId: `${kind}-fixture` },
      });
      const replayed = evaluate(universe, reducePathCoverage(universe, [...events].reverse()), {
        limit: { reached: true, kind, limitId: `${kind}-fixture` },
      });

      expect(result.decision).toBe('INCOMPLETE_LIMIT');
      expect(result.decision).not.toBe('STOP_ALLOWED');
      expect(result.certificate.triggeredLimit).toEqual({
        kind,
        limitId: `${kind}-fixture`,
      });
      expect(result.partialCoverage?.triggeredLimit).toEqual({
        kind,
        limitId: `${kind}-fixture`,
      });
      expect(result.certificate.openPathIds).toHaveLength(1);
      expect(replayed.certificate.certificateHash).toBe(result.certificate.certificateHash);
    },
  );
});

describe('cross-profile path coverage invariants', () => {
  it('keeps paraphrases inside one committed community on one concept path', () => {
    const semantic = semanticProjection(1, 3);
    const universe = compileFor('research', { semantic });
    const communityPaths = universe.paths.filter((path) => path.semanticCommunityId !== null);
    const events: PathCoverageEvent[] = [
      ...addressedEvents(universe),
      {
        kind: 'semantic-novelty-observed',
        communityId: 'community-1',
        concept: 'existing_community_member',
        evidence: [{
          kind: 'projection-row',
          evidenceClass: 'semantic-membership',
          digest: digest('paraphrase-evidence'),
          projectionKind: 'semantic-community',
          projectionVersion: semantic.projection_version,
          rowId: 'claim-1-3',
        }],
        origin: origin(universe.paths.length + 1),
      },
    ];
    const result = evaluate(universe, reducePathCoverage(universe, events));

    expect(communityPaths).toHaveLength(1);
    expect(result.decision).toBe('STOP_ALLOWED');
    expect(result.certificate.semanticEvidenceGrowth).toHaveLength(1);
    expect(result.certificate.semanticEvidenceGrowth[0].concept)
      .toBe('existing_community_member');
  });

  it('mints a successor for a new stable community and invalidates the earlier stop', () => {
    const baseSemantic = semanticProjection(1, 2);
    const expandedSemantic = semanticProjection(2, 2);
    const base = compileFor('research', { semantic: baseSemantic });
    const baseProjection = reducePathCoverage(base, addressedEvents(base));
    const baseResult = evaluate(base, baseProjection);
    const profile = modeCoverageProfiles.resolve('research', 'research-coverage@1');
    const successor = mintSuccessorCoverageUniverse(base, {
      namespace: NAMESPACE,
      runId: base.runId,
      mode: 'research',
      profileVersion: base.profileVersion,
      inputFingerprint: base.inputFingerprint,
      dimensionValues: dimensionsFor(profile),
      semanticCommunityProjection: expandedSemantic,
      relationshipProjection: createEmptyClaimRelationshipProjection(),
      ledgerHead: {
        ledgerId: LEDGER_ID,
        sequence: LEDGER_SEQUENCE + 1,
        recordHash: digest({ ledgerSequence: LEDGER_SEQUENCE + 1 }),
      },
      replayFingerprint: digest('expanded-replay'),
    });
    const successorProjection = reducePathCoverage(successor, addressedEvents(base));
    const successorResult = evaluate(successor, successorProjection);
    const staleResult = evaluate(base, baseProjection, { activeUniverseId: successor.universeId });

    expect(baseResult.decision).toBe('STOP_ALLOWED');
    expect(successor.universeVersion).toBe(2);
    expect(successor.predecessorUniverseId).toBe(base.universeId);
    expect(successor.paths.length).toBe(base.paths.length + 1);
    expect(isCoverageCertificateCurrent(baseResult.certificate, successor)).toBe(false);
    expect(staleResult.decision).toBe('STOP_BLOCKED');
    expect(successorResult.decision).toBe('CONTINUE');
    expect(successorResult.certificate.openPathIds).toHaveLength(1);
    expect(evaluate(successor, successorProjection).certificate.certificateHash)
      .toBe(successorResult.certificate.certificateHash);
  });

  it('marks an unknown newly observed community stale until a successor exists', () => {
    const universe = compileFor('research');
    const events: PathCoverageEvent[] = [
      ...addressedEvents(universe),
      {
        kind: 'semantic-novelty-observed',
        communityId: 'community-late',
        concept: 'new_community',
        evidence: [],
        origin: origin(universe.paths.length + 1),
      },
    ];
    const projection = reducePathCoverage(universe, events);
    const result = evaluate(universe, projection);

    expect(projection.staleUniverse).toBe(true);
    expect(projection.lateDiscoveredMajorRegionIds).toEqual(['community-late']);
    expect(result.decision).toBe('STOP_BLOCKED');
  });

  it('derives stale-universe blockers from late regions and rejects either flag mismatch', () => {
    const universe = compileFor('research');
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const { projectionHash: _projectionHash, ...core } = projection;
    const hiddenLateRegionCore = {
      ...core,
      lateDiscoveredMajorRegionIds: ['community-late'],
      staleUniverse: false,
    };
    const hiddenLateRegion = {
      ...hiddenLateRegionCore,
      projectionHash: digest(hiddenLateRegionCore),
    } as PathCoverageProjection;
    const spuriousStaleFlagCore = {
      ...core,
      lateDiscoveredMajorRegionIds: [],
      staleUniverse: true,
    };
    const spuriousStaleFlag = {
      ...spuriousStaleFlagCore,
      projectionHash: digest(spuriousStaleFlagCore),
    } as PathCoverageProjection;

    const hiddenLateRegionResult = evaluate(universe, hiddenLateRegion);
    const spuriousStaleFlagResult = evaluate(universe, spuriousStaleFlag);

    expect(hiddenLateRegionResult.decision).toBe('STOP_BLOCKED');
    expect(hiddenLateRegionResult.certificate.blockerIds).toContain(
      'projection:late-major-region',
    );
    expect(hiddenLateRegionResult.certificate.blockerIds).toContain(
      'projection:stale-universe-mismatch',
    );
    expect(spuriousStaleFlagResult.decision).toBe('STOP_BLOCKED');
    expect(spuriousStaleFlagResult.certificate.blockerIds).toContain(
      'projection:stale-universe-mismatch',
    );
  });

  it('blocks a self-consistent projection with a forged ledger evidence locator', () => {
    const universe = compileFor('council');
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const target = universe.paths.find((path) => (
      path.requiredEvidenceClasses.includes('ledger-event')
    )) as CoveragePath;
    const record = projection.paths[target.pathId];
    const forgedEvidence = record.evidence.map((locator) => locator.kind === 'ledger-event'
      ? Object.freeze({
        ...locator,
        ledgerId: 'fabricated-ledger',
        sequence: universe.ledgerHead.sequence + 1,
        eventId: 'fabricated-event',
      })
      : locator);
    const forgedPaths = {
      ...projection.paths,
      [target.pathId]: Object.freeze({ ...record, evidence: Object.freeze(forgedEvidence) }),
    };
    const { projectionHash: _projectionHash, ...core } = projection;
    const forgedCore = { ...core, paths: forgedPaths };
    const forged = {
      ...forgedCore,
      projectionHash: digest(forgedCore),
    } as PathCoverageProjection;
    const result = evaluate(universe, forged);

    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.openPathIds).toContain(target.pathId);
    expect(result.certificate.blockerIds).toContain(
      `path:${target.pathId}:invalid-evidence-locator`,
    );
  });

  it('blocks a self-consistent projection-row locator from the wrong projection version', () => {
    const universe = compileFor('research');
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const target = universe.paths.find((path) => (
      path.semanticCommunityId !== null
    )) as CoveragePath;
    const record = projection.paths[target.pathId];
    const forgedEvidence = record.evidence.map((locator) => locator.kind === 'projection-row'
      ? Object.freeze({ ...locator, projectionVersion: 'semantic-projection@forged' })
      : locator);
    const forgedPaths = {
      ...projection.paths,
      [target.pathId]: Object.freeze({ ...record, evidence: Object.freeze(forgedEvidence) }),
    };
    const { projectionHash: _projectionHash, ...core } = projection;
    const forgedCore = { ...core, paths: forgedPaths };
    const forged = {
      ...forgedCore,
      projectionHash: digest(forgedCore),
    } as PathCoverageProjection;
    const result = evaluate(universe, forged);

    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.openPathIds).toContain(target.pathId);
    expect(result.certificate.blockerIds).toContain(
      `path:${target.pathId}:invalid-evidence-locator`,
    );
  });

  it('blocks a forged coverage-graph locator impersonating a required evidence class', () => {
    const universe = compileFor('council');
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const target = universe.paths.find((path) => (
      path.requiredEvidenceClasses.includes('ledger-event')
    )) as CoveragePath;
    const record = projection.paths[target.pathId];
    const forgedLocator = Object.freeze({
      kind: 'projection-row' as const,
      evidenceClass: 'ledger-event',
      digest: digest('forged-coverage-graph-impersonation'),
      projectionKind: 'coverage-graph' as const,
      projectionVersion: 'coverage-graph-schema@forged',
      rowId: 'fabricated-row',
    });
    const forgedPaths = {
      ...projection.paths,
      [target.pathId]: Object.freeze({
        ...record,
        evidence: Object.freeze([forgedLocator]),
      }),
    };
    const { projectionHash: _projectionHash, ...core } = projection;
    const forgedCore = { ...core, paths: forgedPaths };
    const forged = {
      ...forgedCore,
      projectionHash: digest(forgedCore),
    } as PathCoverageProjection;
    const result = evaluate(universe, forged);

    expect(() => reducePathCoverage(universe, [{
      kind: 'path-addressed',
      pathId: target.pathId,
      origin: origin(1),
      evidence: [forgedLocator],
    }])).toThrow(/Coverage graph evidence belongs to a stale projection version/);
    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.openPathIds).toContain(target.pathId);
    expect(result.certificate.blockerIds).toContain(
      `path:${target.pathId}:invalid-evidence-locator`,
    );
  });

  it('blocks one forged coverage-graph locator swapped into an honest projection', () => {
    const universe = compileFor('research');
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const target = universe.paths.find((path) => (
      path.regionId === 'research-falsification'
    )) as CoveragePath;
    const record = projection.paths[target.pathId];
    const forgedEvidence = record.evidence.map((locator) => (
      locator.kind === 'projection-row' && locator.projectionKind === 'coverage-graph'
        ? Object.freeze({
          ...locator,
          projectionVersion: 'coverage-graph-schema@forged',
          rowId: 'fabricated-row',
        })
        : locator
    ));
    const forgedPaths = {
      ...projection.paths,
      [target.pathId]: Object.freeze({ ...record, evidence: Object.freeze(forgedEvidence) }),
    };
    const { projectionHash: _projectionHash, ...core } = projection;
    const forgedCore = { ...core, paths: forgedPaths };
    const forged = {
      ...forgedCore,
      projectionHash: digest(forgedCore),
    } as PathCoverageProjection;
    const result = evaluate(universe, forged);

    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.openPathIds).toContain(target.pathId);
    expect(result.certificate.blockerIds).toContain(
      `path:${target.pathId}:invalid-evidence-locator`,
    );
  });

  it('allows an honestly versioned coverage-graph locator to close its path', () => {
    const universe = compileFor('research');
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const target = universe.paths.find((path) => (
      path.regionId === 'research-falsification'
    )) as CoveragePath;
    const locator = projection.paths[target.pathId].evidence.find((entry) => (
      entry.kind === 'projection-row' && entry.projectionKind === 'coverage-graph'
    ));
    const result = evaluate(universe, projection);

    expect(locator).toMatchObject({
      projectionKind: 'coverage-graph',
      projectionVersion: universe.coverageGraphProjectionVersion,
    });
    expect(result.decision).toBe('STOP_ALLOWED');
    expect(result.certificate.openPathIds).toEqual([]);
  });

  it('blocks a self-consistent universe with a fabricated coverage-graph binding', () => {
    const universe = compileFor('research');
    const { universeId: _universeId, ...core } = universe;
    const forgedCore = {
      ...core,
      coverageGraphProjectionVersion: 'coverage-graph-schema@forged',
    };
    const forgedUniverse = Object.freeze({
      ...forgedCore,
      universeId: `universe-${digest(forgedCore)}`,
    }) as CoverageUniverse;
    const projection = reducePathCoverage(
      forgedUniverse,
      addressedEvents(forgedUniverse),
    );
    const result = evaluate(forgedUniverse, projection);

    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.blockerIds).toContain(
      'universe:coverage_graph_projection_version_mismatch',
    );
  });

  it('blocks a forged exclusion that does not match the verified authorization audit', () => {
    const universe = compileFor('research');
    const projection = excludedProjection(universe);
    const target = universe.paths[0];
    const record = projection.paths[target.pathId];
    const forgedAuthorization = Object.freeze({
      ...AUTHORIZATION,
      decision_digest: digest('fabricated-exclusion-decision'),
    });
    const forgedPaths = {
      ...projection.paths,
      [target.pathId]: Object.freeze({
        ...record,
        exclusion: Object.freeze({
          ...record.exclusion,
          authorization: forgedAuthorization,
        }),
      }),
    };
    const { projectionHash: _projectionHash, ...core } = projection;
    const forgedCore = { ...core, paths: forgedPaths };
    const forged = {
      ...forgedCore,
      projectionHash: digest(forgedCore),
    } as PathCoverageProjection;
    const result = evaluate(universe, forged);

    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.openPathIds).toContain(target.pathId);
    expect(result.certificate.blockerIds).toContain(
      `path:${target.pathId}:exclusion-authorization-mismatch`,
    );
  });

  it('blocks a self-consistent universe with a shrunk cartesian denominator', () => {
    const profile = modeCoverageProfiles.resolve('review', 'review-coverage@1');
    const universe = compileFor('review', {
      dimensions: {
        ...dimensionsFor(profile),
        'changed-surface': ['surface-a', 'surface-b'],
      },
    });
    const removed = universe.paths.find((path) => (
      path.regionId === 'review-surface-dimension'
    )) as CoveragePath;
    const { universeId: _universeId, ...core } = universe;
    const shrunkCore = {
      ...core,
      paths: universe.paths.filter((path) => path.pathId !== removed.pathId),
    };
    const shrunkUniverse = Object.freeze({
      ...shrunkCore,
      universeId: `universe-${digest(shrunkCore)}`,
    }) as CoverageUniverse;
    const projection = reducePathCoverage(
      shrunkUniverse,
      addressedEvents(shrunkUniverse),
    );
    const result = evaluate(shrunkUniverse, projection);

    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.blockerIds).toContain(
      'universe:cartesian_path_set_mismatch',
    );
  });

  it('blocks ambiguous communities, stale projections, and explicit STOP blockers', () => {
    const semantic = semanticProjection(1, 1, true);
    const universe = compileFor('research', { semantic });
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const ambiguous = evaluate(universe, projection);
    const stale = evaluate(universe, projection, {
      projectionFreshness: { ...freshness(universe), fresh: false },
    });
    const stopped = evaluate(universe, projection, {
      stopBlockers: [{ blockerId: 'operator-stop', severity: 'STOP', reason: 'Manual stop gate' }],
    });

    expect(ambiguous.decision).toBe('STOP_BLOCKED');
    expect(ambiguous.certificate.ambiguousMajorCommunityIds)
      .toEqual(['claim-ambiguous']);
    expect(stale.decision).toBe('STOP_BLOCKED');
    expect(stopped.decision).toBe('STOP_BLOCKED');
  });

  it('fails closed on an unsupported path projection schema even with a matching hash', () => {
    const universe = compileFor('council');
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const { projectionHash: _projectionHash, ...core } = projection;
    const unsupportedCore = {
      ...core,
      projectionVersion: 'path-coverage-projection@unsupported',
    };
    const unsupported = {
      ...unsupportedCore,
      projectionHash: digest(unsupportedCore),
    } as unknown as PathCoverageProjection;
    const result = evaluate(universe, unsupported);

    expect(result.decision).toBe('STOP_BLOCKED');
    expect(result.certificate.blockerIds).toContain('projection:unsupported-version');
  });

  it('rejects aggregate-only closure attempts with no evidence locators', () => {
    const universe = compileFor('council');
    const target = universe.paths[0];
    expect(() => reducePathCoverage(universe, [{
      kind: 'path-addressed',
      pathId: target.pathId,
      origin: origin(1),
      evidence: [],
    }])).toThrow(/mandatory evidence classes/);
  });

  it('rejects unauthorized exclusions and stale semantic evidence locators', () => {
    const universe = compileFor('research');
    const semanticPath = universe.paths.find((path) => path.semanticCommunityId !== null) as CoveragePath;
    expect(() => reducePathCoverage(universe, [{
      kind: 'path-addressed',
      pathId: semanticPath.pathId,
      origin: origin(1),
      evidence: [{
        kind: 'projection-row',
        evidenceClass: 'semantic-membership',
        digest: digest('stale-semantic-row'),
        projectionKind: 'semantic-community',
        projectionVersion: 'semantic-projection@stale',
        rowId: 'community-1',
      }],
    }])).toThrow(/stale projection version/);

    expect(() => reducePathCoverage(universe, [{
      kind: 'path-excluded',
      pathId: semanticPath.pathId,
      origin: origin(1),
      evidence: [evidenceFor(universe, semanticPath, 1)[0]],
      exclusion: {
        reasonCode: 'not-applicable',
        policyId: 'authorized-path-exclusion',
        policyVersion: '',
        authorization: AUTHORIZATION,
      },
    }])).toThrow(/versioned policy identity/);
  });

  it('keeps one uncovered mandatory path open despite high weighted coverage', () => {
    const profile = modeCoverageProfiles.resolve('review', 'review-coverage@1');
    const universe = compileFor('review', {
      dimensions: {
        ...dimensionsFor(profile),
        'changed-surface': ['surface-a', 'surface-b', 'surface-c'],
      },
    });
    const projection = reducePathCoverage(universe, addressedEvents(universe).slice(0, -1));
    const result = evaluate(universe, projection);

    expect(result.certificate.weightedCoverage).toBeGreaterThan(0.5);
    expect(result.certificate.openPathIds).toHaveLength(1);
    expect(result.decision).toBe('CONTINUE');
  });

  it('allows complete coverage even when a safety limit is reached simultaneously', () => {
    const universe = compileFor('research');
    const projection = reducePathCoverage(universe, addressedEvents(universe));
    const result = evaluate(universe, projection, {
      limit: { reached: true, kind: 'iteration', limitId: 'iteration-fixture' },
    });

    expect(result.certificate.openPathIds).toEqual([]);
    expect(result.decision).toBe('STOP_ALLOWED');
  });

  it('ranks blocked paths before heavier uncovered paths deterministically', () => {
    const universe = compileFor('research');
    const blockedPath = universe.paths.find((path) => (
      path.regionId === 'research-source-class'
    )) as CoveragePath;
    const highestWeightPath = universe.paths.find((path) => (
      path.regionId === 'research-falsification'
    )) as CoveragePath;
    const remainingPath = universe.paths.find((path) => (
      path.regionId === 'research-question-branch'
    )) as CoveragePath;
    const openPathIds = new Set([
      blockedPath.pathId,
      highestWeightPath.pathId,
      remainingPath.pathId,
    ]);
    const events: PathCoverageEvent[] = [
      ...addressedEvents(universe).filter((event) => !openPathIds.has(event.pathId)),
      {
        kind: 'path-blocked',
        pathId: blockedPath.pathId,
        blockerId: 'ranked-blocker',
        origin: origin(universe.paths.length + 1),
      },
    ];
    const result = evaluate(universe, reducePathCoverage(universe, events));

    expect(result.partialCoverage?.uncoveredPaths.map((path) => path.pathId)).toEqual([
      blockedPath.pathId,
      highestWeightPath.pathId,
      remainingPath.pathId,
    ]);
    expect(result.partialCoverage?.uncoveredPaths.map((path) => path.rank)).toEqual([1, 2, 3]);
  });

  it('preserves the full legacy council bridge as authoritative shadow output', () => {
    const universe = compileFor('council');
    const projection = reducePathCoverage(universe, addressedEvents(universe).slice(0, -1));
    const pathCoverage = evaluate(universe, projection);
    const legacyBridge: LegacyCouncilBridge = Object.freeze({
      status: 'ok',
      data: { decision: 'STOP_ALLOWED', trace: [{ signal: 'agreementRatio', passed: true }] },
      graph_decision: 'STOP_ALLOWED',
      graph_decision_json: '"STOP_ALLOWED"',
      graph_signals_json: { agreementRatio: 1 },
      graph_blockers_json: [],
      graph_blockers_csv: '',
      graph_stop_blocked: false,
      graph_trace_json: [{ signal: 'agreementRatio', passed: true }],
      graph_convergence_score: 1,
    });
    const shadow = createPathCoverageShadowEvaluation(legacyBridge, pathCoverage);

    expect(shadow.authority).toBe('legacy-convergence');
    expect(shadow.authoritativeDecision).toBe('STOP_ALLOWED');
    expect(shadow.pathCoverage.decision).toBe('CONTINUE');
    expect(shadow.legacyBridge).toBe(legacyBridge);
    expect(shadow.bridge).toMatchObject({
      graph_decision: 'STOP_ALLOWED',
      graph_convergence_score: 1,
      path_coverage_shadow_only: true,
      path_coverage_decision: 'CONTINUE',
      path_coverage_disagrees: true,
    });
  });
});
