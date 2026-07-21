// ───────────────────────────────────────────────────────────────────
// MODULE: Semantic Community Projection
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  admitSemanticEquivalenceEdge,
  sameSemanticNamespace,
} from './semantic-equivalence.js';
import { SEMANTIC_PROJECTION_SCHEMA_VERSION } from './semantic-community-types.js';

import type {
  CoverageSnapshot,
  SemanticClaimObservation,
  SemanticClaimRecord,
  SemanticCommunityLineageRecord,
  SemanticCommunityProjection,
  SemanticCommunityRecord,
  SemanticEquivalenceEdgeRecord,
  SemanticIncrementalResult,
  SemanticMembershipRecord,
  SemanticNamespaceRecord,
  SemanticNoveltyResult,
  SemanticProjectionConfig,
  SemanticProjectionHistory,
} from './semantic-community-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CANONICAL HELPERS
// ───────────────────────────────────────────────────────────────────

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function freezeJson<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach((entry) => freezeJson(entry));
    Object.freeze(value);
  }
  return value;
}

function canonicalClone<T>(value: T): T {
  return freezeJson(JSON.parse(canonicalJson(value)) as T);
}

function canonicalRecord<T>(entries: readonly (readonly [string, T])[]): Readonly<Record<string, T>> {
  return Object.freeze(Object.fromEntries(
    [...entries].sort(([left], [right]) => compareCodeUnits(left, right)),
  ));
}

function pairKey(left: string, right: string): string {
  return [left, right].sort(compareCodeUnits).join('\u0000');
}

function memberKey(members: ReadonlySet<string>): string {
  return [...members].sort(compareCodeUnits).join('\u0000');
}

// ───────────────────────────────────────────────────────────────────
// 2. GRAPH CLUSTERING
// ───────────────────────────────────────────────────────────────────

interface ClusterScore {
  readonly ratio: number;
  readonly averageScore: number;
  readonly edgeCount: number;
}

interface ProjectedSubset {
  readonly communities: Readonly<Record<string, SemanticCommunityRecord>>;
  readonly memberships: Readonly<Record<string, SemanticMembershipRecord>>;
}

function edgeIndex(
  edges: Readonly<Record<string, SemanticEquivalenceEdgeRecord>>,
): ReadonlyMap<string, SemanticEquivalenceEdgeRecord> {
  return new Map(Object.values(edges).map((edge) => [
    pairKey(edge.source_id, edge.target_id),
    edge,
  ]));
}

function crossClusterScore(
  left: ReadonlySet<string>,
  right: ReadonlySet<string>,
  edges: ReadonlyMap<string, SemanticEquivalenceEdgeRecord>,
  minimumScore: number,
): ClusterScore {
  let scoreSum = 0;
  let edgeCount = 0;
  for (const leftId of left) {
    for (const rightId of right) {
      const edge = edges.get(pairKey(leftId, rightId));
      if (edge && edge.score >= minimumScore) {
        scoreSum += edge.score;
        edgeCount += 1;
      }
    }
  }
  const possible = left.size * right.size;
  return {
    ratio: possible === 0 ? 0 : edgeCount / possible,
    averageScore: edgeCount === 0 ? 0 : scoreSum / edgeCount,
    edgeCount,
  };
}

function clusterClaims(
  claimIds: readonly string[],
  edges: ReadonlyMap<string, SemanticEquivalenceEdgeRecord>,
  config: SemanticProjectionConfig,
  minimumScore: number,
): ReadonlyArray<ReadonlySet<string>> {
  const clusters: Set<string>[] = [...claimIds]
    .sort(compareCodeUnits)
    .map((claimId) => new Set([claimId]));

  while (true) {
    let selected: {
      readonly leftIndex: number;
      readonly rightIndex: number;
      readonly score: ClusterScore;
      readonly key: string;
    } | null = null;
    for (let leftIndex = 0; leftIndex < clusters.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < clusters.length; rightIndex += 1) {
        const score = crossClusterScore(
          clusters[leftIndex],
          clusters[rightIndex],
          edges,
          minimumScore,
        );
        if (
          score.edgeCount === 0
          || score.ratio < config.minimum_cross_community_ratio
        ) {
          continue;
        }
        const key = [memberKey(clusters[leftIndex]), memberKey(clusters[rightIndex])]
          .sort(compareCodeUnits)
          .join('\u0001');
        if (
          selected === null
          || score.ratio > selected.score.ratio
          || (score.ratio === selected.score.ratio
            && score.averageScore > selected.score.averageScore)
          || (score.ratio === selected.score.ratio
            && score.averageScore === selected.score.averageScore
            && key < selected.key)
        ) {
          selected = { leftIndex, rightIndex, score, key };
        }
      }
    }
    if (!selected) break;
    const merged = new Set([
      ...clusters[selected.leftIndex],
      ...clusters[selected.rightIndex],
    ]);
    clusters.splice(selected.rightIndex, 1);
    clusters.splice(selected.leftIndex, 1, merged);
    clusters.sort((left, right) => compareCodeUnits(memberKey(left), memberKey(right)));
  }
  return Object.freeze(clusters.map((cluster) => Object.freeze(cluster)));
}

function touchedClusters(
  claimId: string,
  clusters: ReadonlyArray<ReadonlySet<string>>,
  edges: ReadonlyMap<string, SemanticEquivalenceEdgeRecord>,
): ReadonlyArray<ReadonlySet<string>> {
  return clusters.filter((cluster) => (
    cluster.size >= 2
    && [...cluster].some((memberId) => edges.has(pairKey(claimId, memberId)))
  ));
}

function communitiesPassCohesion(
  clusters: ReadonlyArray<ReadonlySet<string>>,
  edges: ReadonlyMap<string, SemanticEquivalenceEdgeRecord>,
  config: SemanticProjectionConfig,
): boolean {
  for (let left = 0; left < clusters.length; left += 1) {
    for (let right = left + 1; right < clusters.length; right += 1) {
      const score = crossClusterScore(
        clusters[left],
        clusters[right],
        edges,
        config.cohesion_score_threshold,
      );
      if (score.ratio < config.minimum_cross_community_ratio) return false;
    }
  }
  return true;
}

function ambiguousClaims(
  claimIds: readonly string[],
  edges: ReadonlyMap<string, SemanticEquivalenceEdgeRecord>,
  config: SemanticProjectionConfig,
): ReadonlyMap<string, ReadonlyArray<ReadonlySet<string>>> {
  const candidates: Array<{
    readonly claimId: string;
    readonly touched: ReadonlyArray<ReadonlySet<string>>;
    readonly separationScore: number;
  }> = [];
  for (const claimId of [...claimIds].sort(compareCodeUnits)) {
    const withoutClaim = claimIds.filter((candidate) => candidate !== claimId);
    const established = clusterClaims(
      withoutClaim,
      edges,
      config,
      config.cohesion_score_threshold,
    );
    const touched = touchedClusters(claimId, established, edges);
    if (touched.length >= 2 && !communitiesPassCohesion(touched, edges, config)) {
      candidates.push({
        claimId,
        touched,
        separationScore: touched.reduce((score, cluster) => score + cluster.size ** 2, 0),
      });
    }
  }
  const adjacency = new Map<string, Set<string>>();
  claimIds.forEach((claimId) => adjacency.set(claimId, new Set()));
  for (const edge of edges.values()) {
    if (!adjacency.has(edge.source_id) || !adjacency.has(edge.target_id)) continue;
    adjacency.get(edge.source_id)?.add(edge.target_id);
    adjacency.get(edge.target_id)?.add(edge.source_id);
  }
  const componentKeyByClaim = new Map<string, string>();
  for (const claimId of [...claimIds].sort(compareCodeUnits)) {
    if (componentKeyByClaim.has(claimId)) continue;
    const members: string[] = [];
    const queue = [claimId];
    componentKeyByClaim.set(claimId, claimId);
    while (queue.length > 0) {
      const current = queue.shift() as string;
      members.push(current);
      for (const neighbor of adjacency.get(current) ?? []) {
        if (!componentKeyByClaim.has(neighbor)) {
          componentKeyByClaim.set(neighbor, claimId);
          queue.push(neighbor);
        }
      }
    }
    const key = members.sort(compareCodeUnits)[0];
    members.forEach((member) => componentKeyByClaim.set(member, key));
  }
  const maximumByComponent = new Map<string, number>();
  for (const candidate of candidates) {
    const key = componentKeyByClaim.get(candidate.claimId) as string;
    maximumByComponent.set(
      key,
      Math.max(maximumByComponent.get(key) ?? 0, candidate.separationScore),
    );
  }
  const ambiguous = new Map<string, ReadonlyArray<ReadonlySet<string>>>();
  for (const candidate of candidates) {
    const key = componentKeyByClaim.get(candidate.claimId) as string;
    if (candidate.separationScore === maximumByComponent.get(key)) {
      ambiguous.set(candidate.claimId, candidate.touched);
    }
  }
  return ambiguous;
}

function representativeClaimId(
  members: readonly string[],
  claims: Readonly<Record<string, SemanticClaimRecord>>,
  edges: ReadonlyMap<string, SemanticEquivalenceEdgeRecord>,
): string {
  return [...members].sort((left, right) => {
    const leftEdges = members
      .filter((member) => member !== left)
      .map((member) => edges.get(pairKey(left, member)))
      .filter((edge): edge is SemanticEquivalenceEdgeRecord => edge !== undefined);
    const rightEdges = members
      .filter((member) => member !== right)
      .map((member) => edges.get(pairKey(right, member)))
      .filter((edge): edge is SemanticEquivalenceEdgeRecord => edge !== undefined);
    if (leftEdges.length !== rightEdges.length) return rightEdges.length - leftEdges.length;
    const leftScore = leftEdges.reduce((sum, edge) => sum + edge.score, 0);
    const rightScore = rightEdges.reduce((sum, edge) => sum + edge.score, 0);
    if (leftScore !== rightScore) return rightScore - leftScore;
    const fingerprintOrder = compareCodeUnits(
      claims[left].normalized_fingerprint,
      claims[right].normalized_fingerprint,
    );
    return fingerprintOrder || compareCodeUnits(left, right);
  })[0];
}

function projectSubset(
  claimIds: readonly string[],
  claims: Readonly<Record<string, SemanticClaimRecord>>,
  edges: Readonly<Record<string, SemanticEquivalenceEdgeRecord>>,
  config: SemanticProjectionConfig,
): ProjectedSubset {
  const indexedEdges = edgeIndex(edges);
  const ambiguous = ambiguousClaims(claimIds, indexedEdges, config);
  const stableIds = claimIds.filter((claimId) => !ambiguous.has(claimId));
  const clusters = clusterClaims(
    stableIds,
    indexedEdges,
    config,
    config.equivalence_threshold,
  );
  const communities = new Map<string, SemanticCommunityRecord>();
  const memberships = new Map<string, SemanticMembershipRecord>();

  for (const cluster of clusters) {
    const members = [...cluster].sort(compareCodeUnits);
    const communityHash = sha256Bytes(canonicalBytes({
      namespace: claims[members[0]].namespace,
      projection_version: config.projection_version,
      member_claim_ids: members,
    }));
    const communityId = `community-${communityHash}`;
    const representative = representativeClaimId(members, claims, indexedEdges);
    const membershipVersionHash = sha256Bytes(canonicalBytes({
      community_id: communityId,
      representative_claim_id: representative,
      member_claim_ids: members,
      projection_version: config.projection_version,
    }));
    const membershipVersion = `membership-${membershipVersionHash}`;
    communities.set(communityId, Object.freeze({
      community_id: communityId,
      representative_claim_id: representative,
      member_claim_ids: members,
      membership_version: membershipVersion,
      membership_version_hash: membershipVersionHash,
    }));
    for (const claimId of members) {
      memberships.set(claimId, Object.freeze({
        claim_id: claimId,
        status: 'stable',
        community_id: communityId,
        candidate_community_ids: [],
        membership_version: membershipVersion,
      }));
    }
  }

  for (const claimId of [...ambiguous.keys()].sort(compareCodeUnits)) {
    const candidateCommunityIds = Object.values(Object.fromEntries(communities))
      .filter((community) => community.member_claim_ids.some(
        (memberId) => indexedEdges.has(pairKey(claimId, memberId)),
      ))
      .map((community) => community.community_id)
      .sort(compareCodeUnits);
    const membershipHash = sha256Bytes(canonicalBytes({
      claim_id: claimId,
      status: 'ambiguous',
      candidate_community_ids: candidateCommunityIds,
      projection_version: config.projection_version,
    }));
    memberships.set(claimId, Object.freeze({
      claim_id: claimId,
      status: 'ambiguous',
      community_id: null,
      candidate_community_ids: candidateCommunityIds,
      membership_version: `membership-${membershipHash}`,
    }));
  }

  return Object.freeze({
    communities: canonicalRecord([...communities.entries()]),
    memberships: canonicalRecord([...memberships.entries()]),
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. LINEAGE AND NOVELTY
// ───────────────────────────────────────────────────────────────────

function overlap(left: SemanticCommunityRecord, right: SemanticCommunityRecord): boolean {
  const rightMembers = new Set(right.member_claim_ids);
  return left.member_claim_ids.some((memberId) => rightMembers.has(memberId));
}

function deriveLineage(
  previous: SemanticCommunityProjection,
  communities: Readonly<Record<string, SemanticCommunityRecord>>,
  projectionVersion: string,
): readonly SemanticCommunityLineageRecord[] {
  const previousCommunities = Object.values(previous.communities);
  const currentCommunities = Object.values(communities);
  return Object.freeze(currentCommunities
    .sort((left, right) => compareCodeUnits(left.community_id, right.community_id))
    .map((current) => {
      const fromIds = previousCommunities
        .filter((prior) => overlap(prior, current))
        .map((prior) => prior.community_id)
        .sort(compareCodeUnits);
      const isSplit = fromIds.length === 1 && currentCommunities.filter(
        (candidate) => previousCommunities.some(
          (prior) => prior.community_id === fromIds[0] && overlap(prior, candidate),
        ),
      ).length > 1;
      const lineageKind: SemanticCommunityLineageRecord['lineage_kind'] = fromIds.length === 0
        ? 'created'
        : fromIds.length > 1
          ? 'merge'
          : isSplit
            ? 'split'
            : 'continued';
      const core = {
        lineage_kind: lineageKind,
        from_community_ids: fromIds,
        to_community_ids: [current.community_id],
        projection_version: projectionVersion,
      };
      return Object.freeze({
        ...core,
        lineage_hash: sha256Bytes(canonicalBytes(core)),
      });
    }));
}

function evidenceForCommunities(
  projection: SemanticCommunityProjection,
  communityIds: ReadonlySet<string>,
): ReadonlySet<string> {
  const evidence = new Set<string>();
  for (const communityId of communityIds) {
    const community = projection.communities[communityId];
    if (!community) continue;
    for (const claimId of community.member_claim_ids) {
      projection.claims[claimId]?.evidence_links.forEach((link) => evidence.add(link));
    }
  }
  return evidence;
}

function noveltyResult(
  previous: SemanticCommunityProjection,
  projection: SemanticCommunityProjection,
  claim: SemanticClaimRecord,
  candidateClaimIds: readonly string[],
): SemanticNoveltyResult {
  const membership = projection.memberships[claim.claim_id];
  if (!membership) throw new Error('Projection omitted the arriving claim membership');
  const priorCommunityIds = new Set<string>();
  for (const candidateId of candidateClaimIds) {
    const prior = previous.memberships[candidateId];
    if (prior?.community_id) priorCommunityIds.add(prior.community_id);
    prior?.candidate_community_ids.forEach((id) => priorCommunityIds.add(id));
  }
  const priorEvidence = evidenceForCommunities(previous, priorCommunityIds);
  const evidenceIncrement = claim.evidence_links.filter((link) => !priorEvidence.has(link)).length;
  const concept = membership.status === 'ambiguous'
    ? 'ambiguous'
    : priorCommunityIds.size > 0
      ? 'existing_community_member'
      : 'new_community';
  const evidence = evidenceIncrement > 0 ? 'new_evidence' : 'no_new_evidence';
  return Object.freeze({
    claim_id: claim.claim_id,
    projection_version: projection.projection_version,
    concept,
    evidence,
    classifications: [
      concept,
      ...(evidence === 'new_evidence' ? [evidence] : []),
    ],
    concept_novelty_increment: concept === 'new_community' ? 1 : 0,
    evidence_novelty_increment: evidenceIncrement,
    community_id: membership.community_id,
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. PROJECTION API
// ───────────────────────────────────────────────────────────────────

/** Create an empty sidecar projection without touching coverage-graph storage. */
export function createEmptySemanticCommunityProjection(
  namespace: SemanticNamespaceRecord,
  config: SemanticProjectionConfig,
): SemanticCommunityProjection {
  if (!namespace.session_id) throw new TypeError('Semantic projection requires a session namespace');
  return canonicalClone({
    schema_version: SEMANTIC_PROJECTION_SCHEMA_VERSION,
    namespace,
    projection_version: config.projection_version,
    config_digest: config.config_digest,
    claims: {},
    edges: {},
    communities: {},
    memberships: {},
    lineage: [],
    last_ledger_sequence: 0,
  }) as SemanticCommunityProjection;
}

function affectedClaimIds(
  arrivingClaimId: string,
  edges: Readonly<Record<string, SemanticEquivalenceEdgeRecord>>,
): readonly string[] {
  const adjacency = new Map<string, Set<string>>();
  for (const edge of Object.values(edges)) {
    if (!adjacency.has(edge.source_id)) adjacency.set(edge.source_id, new Set());
    if (!adjacency.has(edge.target_id)) adjacency.set(edge.target_id, new Set());
    adjacency.get(edge.source_id)?.add(edge.target_id);
    adjacency.get(edge.target_id)?.add(edge.source_id);
  }
  const visited = new Set([arrivingClaimId]);
  const queue = [arrivingClaimId];
  while (queue.length > 0) {
    const current = queue.shift() as string;
    for (const neighbor of adjacency.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return Object.freeze([...visited].sort(compareCodeUnits));
}

/** Recompute only the arriving claim's connected candidate component. */
export function projectSemanticClaimIncrementally(
  previous: SemanticCommunityProjection,
  observation: SemanticClaimObservation,
  config: SemanticProjectionConfig,
): SemanticIncrementalResult {
  if (
    previous.projection_version !== config.projection_version
    || previous.config_digest !== config.config_digest
    || observation.projection_version !== config.projection_version
    || observation.config_digest !== config.config_digest
    || !sameSemanticNamespace(previous.namespace, observation.claim.namespace)
  ) {
    throw new TypeError('Incremental claim does not match the projection namespace and version');
  }
  if (previous.claims[observation.claim.claim_id]) {
    throw new TypeError('Claim identities are immutable and cannot be observed twice');
  }
  if (observation.candidate_assessments.length > config.candidate_limit) {
    throw new RangeError('Candidate assessment count exceeds the configured bound');
  }

  const claims = { ...previous.claims, [observation.claim.claim_id]: observation.claim };
  const edges: Record<string, SemanticEquivalenceEdgeRecord> = { ...previous.edges };
  let admittedEdgeCount = 0;
  const admittedCandidateIds = new Set<string>();
  const assessments = [...observation.candidate_assessments].sort((left, right) => (
    compareCodeUnits(left.candidate_claim_id, right.candidate_claim_id)
    || left.candidate_rank - right.candidate_rank
  ));
  for (const assessment of assessments) {
    const candidate = previous.claims[assessment.candidate_claim_id];
    if (!candidate) throw new TypeError('Candidate assessment does not reference an existing claim');
    const edge = admitSemanticEquivalenceEdge(observation, candidate, assessment, config);
    if (!edge) continue;
    admittedCandidateIds.add(candidate.claim_id);
    const existing = edges[edge.edge_id];
    if (existing && canonicalJson(existing) !== canonicalJson(edge)) {
      throw new TypeError('One semantic edge identity has conflicting versioned provenance');
    }
    if (!existing) admittedEdgeCount += 1;
    edges[edge.edge_id] = edge;
  }

  const rescannedClaimIds = affectedClaimIds(observation.claim.claim_id, edges);
  const affectedSet = new Set(rescannedClaimIds);
  const affectedEdges = Object.fromEntries(Object.entries(edges).filter(([, edge]) => (
    affectedSet.has(edge.source_id) && affectedSet.has(edge.target_id)
  ))) as Record<string, SemanticEquivalenceEdgeRecord>;
  const affectedProjection = projectSubset(
    rescannedClaimIds,
    claims,
    affectedEdges,
    config,
  );

  const preservedCommunities = Object.entries(previous.communities).filter(([, community]) => (
    community.member_claim_ids.every((claimId) => !affectedSet.has(claimId))
  ));
  const preservedMemberships = Object.entries(previous.memberships).filter(([claimId]) => (
    !affectedSet.has(claimId)
  ));
  const communities = canonicalRecord([
    ...preservedCommunities,
    ...Object.entries(affectedProjection.communities),
  ]);
  const memberships = canonicalRecord([
    ...preservedMemberships,
    ...Object.entries(affectedProjection.memberships),
  ]);
  const projection = canonicalClone({
    schema_version: SEMANTIC_PROJECTION_SCHEMA_VERSION,
    namespace: previous.namespace,
    projection_version: config.projection_version,
    config_digest: config.config_digest,
    claims: canonicalRecord(Object.entries(claims)),
    edges: canonicalRecord(Object.entries(edges)),
    communities,
    memberships,
    lineage: [
      ...previous.lineage,
      ...deriveLineage(previous, communities, config.projection_version),
    ],
    last_ledger_sequence: Math.max(
      previous.last_ledger_sequence,
      observation.claim.originating_ledger_event.sequence,
    ),
  }) as SemanticCommunityProjection;
  const affectedCommunityIds = new Set<string>();
  for (const claimId of rescannedClaimIds) {
    const prior = previous.memberships[claimId];
    const current = projection.memberships[claimId];
    if (prior?.community_id) affectedCommunityIds.add(prior.community_id);
    if (current?.community_id) affectedCommunityIds.add(current.community_id);
    current?.candidate_community_ids.forEach((id) => affectedCommunityIds.add(id));
  }
  return Object.freeze({
    projection,
    novelty: noveltyResult(
      previous,
      projection,
      observation.claim,
      [...admittedCandidateIds].sort(compareCodeUnits),
    ),
    telemetry: Object.freeze({
      candidate_count: assessments.length,
      admitted_edge_count: admittedEdgeCount,
      rescanned_claim_ids: [...rescannedClaimIds],
      affected_community_ids: [...affectedCommunityIds].sort(compareCodeUnits),
      full_rebuild_claim_count: Object.keys(claims).length,
    }),
  });
}

/** Rebuild the final graph independently from the incremental projection path. */
export function rebuildSemanticCommunityProjection(
  namespace: SemanticNamespaceRecord,
  observations: readonly SemanticClaimObservation[],
  config: SemanticProjectionConfig,
): SemanticCommunityProjection {
  const claims: Record<string, SemanticClaimRecord> = {};
  for (const observation of observations) {
    if (
      observation.projection_version !== config.projection_version
      || observation.config_digest !== config.config_digest
      || !sameSemanticNamespace(namespace, observation.claim.namespace)
    ) {
      throw new TypeError('Rebuild claim does not match the projection namespace and version');
    }
    if (claims[observation.claim.claim_id]) {
      throw new TypeError('Claim identities are immutable and cannot be observed twice');
    }
    if (observation.candidate_assessments.length > config.candidate_limit) {
      throw new RangeError('Candidate assessment count exceeds the configured bound');
    }
    claims[observation.claim.claim_id] = observation.claim;
  }

  const edges: Record<string, SemanticEquivalenceEdgeRecord> = {};
  for (const observation of observations) {
    const assessments = [...observation.candidate_assessments].sort((left, right) => (
      compareCodeUnits(left.candidate_claim_id, right.candidate_claim_id)
      || left.candidate_rank - right.candidate_rank
    ));
    for (const assessment of assessments) {
      const candidate = claims[assessment.candidate_claim_id];
      if (!candidate) {
        throw new TypeError('Candidate assessment does not reference an observed claim');
      }
      const edge = admitSemanticEquivalenceEdge(observation, candidate, assessment, config);
      if (!edge) continue;
      const existing = edges[edge.edge_id];
      if (existing && canonicalJson(existing) !== canonicalJson(edge)) {
        throw new TypeError('One semantic edge identity has conflicting versioned provenance');
      }
      edges[edge.edge_id] = edge;
    }
  }

  const rebuilt = projectSubset(
    Object.keys(claims).sort(compareCodeUnits),
    claims,
    edges,
    config,
  );
  const empty = createEmptySemanticCommunityProjection(namespace, config);
  return canonicalClone({
    schema_version: SEMANTIC_PROJECTION_SCHEMA_VERSION,
    namespace,
    projection_version: config.projection_version,
    config_digest: config.config_digest,
    claims: canonicalRecord(Object.entries(claims)),
    edges: canonicalRecord(Object.entries(edges)),
    communities: rebuilt.communities,
    memberships: rebuilt.memberships,
    lineage: deriveLineage(empty, rebuilt.communities, config.projection_version),
    last_ledger_sequence: observations.reduce(
      (maximum, observation) => Math.max(
        maximum,
        observation.claim.originating_ledger_event.sequence,
      ),
      0,
    ),
  }) as SemanticCommunityProjection;
}

/** Hash only stable community identities, representatives, and membership versions. */
export function semanticCommunityIdentityDigest(
  projection: SemanticCommunityProjection,
): string {
  return sha256Bytes(canonicalBytes({
    projection_version: projection.projection_version,
    communities: Object.values(projection.communities)
      .sort((left, right) => compareCodeUnits(left.community_id, right.community_id)),
    memberships: Object.values(projection.memberships)
      .sort((left, right) => compareCodeUnits(left.claim_id, right.claim_id)),
  }));
}

/** Adapt sidecar metrics to the existing snapshot boundary without persisting authority. */
export function semanticCommunityCoverageSnapshot(
  projection: SemanticCommunityProjection,
  iteration: number,
): CoverageSnapshot {
  if (!Number.isSafeInteger(iteration) || iteration <= 0) {
    throw new RangeError('Coverage snapshot iteration must be a positive safe integer');
  }
  return Object.freeze({
    specFolder: projection.namespace.spec_folder,
    loopType: projection.namespace.loop_type,
    sessionId: projection.namespace.session_id,
    iteration,
    metrics: {
      semantic_projection_version: projection.projection_version,
      semantic_community_count: Object.keys(projection.communities).length,
      semantic_ambiguous_count: Object.values(projection.memberships)
        .filter((membership) => membership.status === 'ambiguous').length,
      semantic_shadow_only: true,
    },
    nodeCount: Object.keys(projection.claims).length,
    edgeCount: Object.keys(projection.edges).length,
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. VERSION HISTORY
// ───────────────────────────────────────────────────────────────────

/** Start immutable history with one config-addressed projection. */
export function createSemanticProjectionHistory(
  projection: SemanticCommunityProjection,
): SemanticProjectionHistory {
  return canonicalClone({
    namespace: projection.namespace,
    active_projection_version: projection.projection_version,
    versions: { [projection.projection_version]: projection },
  }) as SemanticProjectionHistory;
}

/** Rebuild a changed model or threshold into a new retained projection version. */
export function transitionSemanticProjectionVersion(
  history: SemanticProjectionHistory,
  observations: readonly SemanticClaimObservation[],
  config: SemanticProjectionConfig,
): Readonly<{
  history: SemanticProjectionHistory;
  projection: SemanticCommunityProjection;
  recomputedClaimIds: readonly string[];
}> {
  const existing = history.versions[config.projection_version];
  if (existing) {
    if (existing.config_digest !== config.config_digest) {
      throw new TypeError('Projection version collision would rewrite historical membership');
    }
    return Object.freeze({
      history,
      projection: existing,
      recomputedClaimIds: Object.freeze([]),
    });
  }
  const rebuilt = rebuildSemanticCommunityProjection(history.namespace, observations, config);
  const previous = history.versions[history.active_projection_version];
  const projection = canonicalClone({
    ...rebuilt,
    lineage: [
      ...rebuilt.lineage,
      ...deriveLineage(previous, rebuilt.communities, config.projection_version),
    ],
  }) as SemanticCommunityProjection;
  const nextHistory = canonicalClone({
    namespace: history.namespace,
    active_projection_version: config.projection_version,
    versions: {
      ...history.versions,
      [config.projection_version]: projection,
    },
  }) as SemanticProjectionHistory;
  return Object.freeze({
    history: nextHistory,
    projection,
    recomputedClaimIds: Object.freeze(
      observations.map((observation) => observation.claim.claim_id).sort(compareCodeUnits),
    ),
  });
}
