// ───────────────────────────────────────────────────────────────────
// MODULE: Contradiction and Supersession Event Registry
// ───────────────────────────────────────────────────────────────────

import {
  EventTypeRegistry,
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ClaimRelationshipError,
  ClaimRelationshipErrorCodes,
} from './errors.js';

import type {
  EventTypeDefinition,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  ContradictionCandidate,
  ContradictionCandidateInput,
  ContradictionEventPayload,
  EvidenceCatalogRecord,
  RelationAction,
  RelationshipCandidate,
  RelationshipEvidenceRef,
  RelationshipEventPayload,
  RelationshipReferenceSnapshot,
  SupersessionCandidate,
  SupersessionCandidateInput,
  SupersessionEventPayload,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const RelationshipEventTypes = {
  CONTRADICTION_RECORDED: 'deep-loop.claim.contradiction-recorded',
  SUPERSESSION_RECORDED: 'deep-loop.claim.supersession-recorded',
} as const;

export type RelationshipEventType =
  typeof RelationshipEventTypes[keyof typeof RelationshipEventTypes];

export const CLAIM_RELATIONSHIP_EVENT_VERSION = 1;
export const CLAIM_RELATIONSHIP_REDUCER_VERSION = 'claim-relationships@1';
export const CLAIM_RELATIONSHIP_PROJECTION_SCHEMA_VERSION = 'claim-relationships-projection@1';
export const CLAIM_RELATIONSHIP_REDUCER_ID = 'claim-relationship-status-fold';

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const COMMON_FIELDS = [
  'relationship_id',
  'semantic_community_ids',
  'evidence_refs',
  'provenance_refs',
  'independence_refs',
  'detector_version',
  'evidence_snapshot_ref',
  'relation_action',
] as const;
const OPTIONAL_FIELDS = ['retracts_event_id'] as const;

function compareText(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

// ───────────────────────────────────────────────────────────────────
// 2. NORMALIZATION
// ───────────────────────────────────────────────────────────────────

function requireText(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 4_096) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Relationship identity and context fields must be bounded non-empty strings',
      { field },
    );
  }
  return value;
}

function sortedUnique(values: readonly string[], field: string): string[] {
  if (!Array.isArray(values) || values.length === 0) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Relationship reference collections must be non-empty',
      { field },
    );
  }
  const normalized = values.map((value) => requireText(value, field)).sort(compareText);
  if (new Set(normalized).size !== normalized.length) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Relationship reference collections must not contain duplicates',
      { field },
    );
  }
  return Object.freeze(normalized) as unknown as string[];
}

function normalizeEvidenceRef(input: RelationshipEvidenceRef): RelationshipEvidenceRef {
  const evidenceId = requireText(input.evidence_id, 'evidence_refs.evidence_id');
  const locator = requireText(input.locator, 'evidence_refs.locator');
  if (typeof input.digest !== 'string' || !DIGEST_PATTERN.test(input.digest)) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Evidence references require a lowercase SHA-256 digest',
      { evidenceId },
    );
  }
  if (!['supporting', 'refuting', 'qualifying'].includes(input.position)) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Evidence position is not registered',
      { evidenceId },
    );
  }
  return Object.freeze({
    evidence_id: evidenceId,
    locator,
    digest: input.digest,
    position: input.position,
  });
}

function normalizeEvidenceRefs(
  inputs: readonly RelationshipEvidenceRef[],
): readonly RelationshipEvidenceRef[] {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Relationship candidates require at least one exact evidence reference',
    );
  }
  const normalized = inputs.map(normalizeEvidenceRef).sort(
    (left, right) => compareText(canonicalJson(left), canonicalJson(right)),
  );
  const identities = normalized.map((reference) => canonicalJson(reference));
  if (new Set(identities).size !== identities.length) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Relationship evidence references must not contain exact duplicates',
    );
  }
  return Object.freeze(normalized);
}

function candidateId(value: Readonly<JsonObject>): string {
  return `candidate-${sha256Bytes(canonicalBytes(value))}`;
}

/** Return one order-independent pair or reject a relation to itself. */
export function canonicalContradictionPair(
  firstClaimId: string,
  secondClaimId: string,
): readonly [string, string] {
  const first = requireText(firstClaimId, 'firstClaimId');
  const second = requireText(secondClaimId, 'secondClaimId');
  if (first === second) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.SELF_RELATION,
      'A claim cannot contradict itself',
      { claimId: first },
    );
  }
  return first < second ? [first, second] : [second, first];
}

/** Derive the stable identity of a symmetric contradiction relation. */
export function contradictionRelationshipId(
  firstClaimId: string,
  secondClaimId: string,
  scopeInput: string,
): string {
  const [leftClaimId, rightClaimId] = canonicalContradictionPair(firstClaimId, secondClaimId);
  const scope = requireText(scopeInput, 'incompatibilityScope');
  return `contradiction-${sha256Bytes(canonicalBytes({
    kind: 'CONTRADICTION',
    left_claim_id: leftClaimId,
    right_claim_id: rightClaimId,
    incompatibility_scope: scope,
  }))}`;
}

/** Derive the stable identity of one directed predecessor-to-successor relation. */
export function supersessionRelationshipId(
  predecessorClaimIdInput: string,
  successorClaimIdInput: string,
  scopeInput: string,
): string {
  const predecessorClaimId = requireText(predecessorClaimIdInput, 'predecessorClaimId');
  const successorClaimId = requireText(successorClaimIdInput, 'successorClaimId');
  if (predecessorClaimId === successorClaimId) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.SELF_RELATION,
      'A claim cannot supersede itself',
      { claimId: predecessorClaimId },
    );
  }
  const scope = requireText(scopeInput, 'replacementScope');
  return `supersession-${sha256Bytes(canonicalBytes({
    kind: 'SUPERSESSION',
    predecessor_claim_id: predecessorClaimId,
    successor_claim_id: successorClaimId,
    replacement_scope: scope,
  }))}`;
}

function normalizeCandidateContext(input: {
  readonly semanticCommunityIds: readonly string[];
  readonly evidenceRefs: readonly RelationshipEvidenceRef[];
  readonly provenanceRefs: readonly string[];
  readonly independenceRefs: readonly string[];
  readonly detectorVersion: string;
  readonly evidenceSnapshotRef: string;
}): Readonly<{
  semanticCommunityIds: readonly string[];
  evidenceRefs: readonly RelationshipEvidenceRef[];
  provenanceRefs: readonly string[];
  independenceRefs: readonly string[];
  detectorVersion: string;
  evidenceSnapshotRef: string;
}> {
  return Object.freeze({
    semanticCommunityIds: sortedUnique(input.semanticCommunityIds, 'semanticCommunityIds'),
    evidenceRefs: normalizeEvidenceRefs(input.evidenceRefs),
    provenanceRefs: sortedUnique(input.provenanceRefs, 'provenanceRefs'),
    independenceRefs: sortedUnique(input.independenceRefs, 'independenceRefs'),
    detectorVersion: requireText(input.detectorVersion, 'detectorVersion'),
    evidenceSnapshotRef: requireText(input.evidenceSnapshotRef, 'evidenceSnapshotRef'),
  });
}

/** Normalize a detector observation without granting it status authority. */
export function createContradictionCandidate(
  input: ContradictionCandidateInput,
): ContradictionCandidate {
  const [leftClaimId, rightClaimId] = canonicalContradictionPair(
    input.observedClaimId,
    input.counterpartClaimId,
  );
  const incompatibilityScope = requireText(
    input.incompatibilityScope,
    'incompatibilityScope',
  );
  const context = normalizeCandidateContext(input);
  const core = {
    kind: 'CONTRADICTION',
    relationshipId: contradictionRelationshipId(
      leftClaimId,
      rightClaimId,
      incompatibilityScope,
    ),
    leftClaimId,
    rightClaimId,
    incompatibilityScope,
    ...context,
  } as const;
  return Object.freeze({ ...core, candidateId: candidateId(core as unknown as JsonObject) });
}

/** Normalize a directed detector observation without granting it status authority. */
export function createSupersessionCandidate(
  input: SupersessionCandidateInput,
): SupersessionCandidate {
  const predecessorClaimId = requireText(input.predecessorClaimId, 'predecessorClaimId');
  const successorClaimId = requireText(input.successorClaimId, 'successorClaimId');
  const replacementScope = requireText(input.replacementScope, 'replacementScope');
  const strengthRationale = requireText(input.strengthRationale, 'strengthRationale');
  const relationshipId = supersessionRelationshipId(
    predecessorClaimId,
    successorClaimId,
    replacementScope,
  );
  const context = normalizeCandidateContext(input);
  const core = {
    kind: 'SUPERSESSION',
    relationshipId,
    predecessorClaimId,
    successorClaimId,
    replacementScope,
    strengthRationale,
    ...context,
  } as const;
  return Object.freeze({ ...core, candidateId: candidateId(core as unknown as JsonObject) });
}

// ───────────────────────────────────────────────────────────────────
// 3. PAYLOADS AND REGISTRY
// ───────────────────────────────────────────────────────────────────

function actionFields(
  action: RelationAction,
  retractsEventId: string | undefined,
): Readonly<{ relation_action: RelationAction; retracts_event_id?: string }> {
  if (action === 'assert' && retractsEventId === undefined) {
    return Object.freeze({ relation_action: action });
  }
  if (action === 'withdraw' && retractsEventId !== undefined) {
    return Object.freeze({
      relation_action: action,
      retracts_event_id: requireText(retractsEventId, 'retractsEventId'),
    });
  }
  throw new ClaimRelationshipError(
    ClaimRelationshipErrorCodes.AMBIGUOUS_WITHDRAWAL,
    'Withdrawals require exactly one prior event and assertions cannot retract',
  );
}

/** Convert an inert candidate into canonical payload bytes for authorized recording. */
export function relationshipPayload(
  candidate: RelationshipCandidate,
  action: RelationAction,
  retractsEventId?: string,
): RelationshipEventPayload {
  const common = {
    relationship_id: candidate.relationshipId,
    semantic_community_ids: [...candidate.semanticCommunityIds],
    evidence_refs: candidate.evidenceRefs.map((reference) => ({ ...reference })),
    provenance_refs: [...candidate.provenanceRefs],
    independence_refs: [...candidate.independenceRefs],
    detector_version: candidate.detectorVersion,
    evidence_snapshot_ref: candidate.evidenceSnapshotRef,
    ...actionFields(action, retractsEventId),
  };
  if (candidate.kind === 'CONTRADICTION') {
    return Object.freeze({
      ...common,
      left_claim_id: candidate.leftClaimId,
      right_claim_id: candidate.rightClaimId,
      incompatibility_scope: candidate.incompatibilityScope,
    }) as ContradictionEventPayload;
  }
  return Object.freeze({
    ...common,
    predecessor_claim_id: candidate.predecessorClaimId,
    successor_claim_id: candidate.successorClaimId,
    replacement_scope: candidate.replacementScope,
    strength_rationale: candidate.strengthRationale,
  }) as SupersessionEventPayload;
}

function isText(value: JsonValue | undefined): value is string {
  return typeof value === 'string' && value.trim() !== '' && value.length <= 4_096;
}

function isSortedUniqueStrings(value: JsonValue | undefined): value is string[] {
  return Array.isArray(value)
    && value.length > 0
    && value.every(isText)
    && new Set(value).size === value.length
    && value.every((entry, index) => index === 0 || value[index - 1] < entry);
}

function isEvidenceReference(value: JsonValue): value is RelationshipEvidenceRef {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const keys = Object.keys(value).sort(compareText);
  return canonicalJson(keys) === canonicalJson(['digest', 'evidence_id', 'locator', 'position'])
    && isText(value.evidence_id)
    && isText(value.locator)
    && typeof value.digest === 'string'
    && DIGEST_PATTERN.test(value.digest)
    && ['supporting', 'refuting', 'qualifying'].includes(value.position as string);
}

function isEvidenceReferences(value: JsonValue | undefined): value is RelationshipEvidenceRef[] {
  if (!Array.isArray(value) || value.length === 0 || !value.every(isEvidenceReference)) return false;
  const serialized = value.map((entry) => canonicalJson(entry));
  return new Set(serialized).size === serialized.length
    && serialized.every((entry, index) => index === 0 || serialized[index - 1] < entry);
}

function hasValidCommonPayload(payload: Readonly<JsonObject>): boolean {
  const action = payload.relation_action;
  const withdrawalShape = action === 'withdraw' && isText(payload.retracts_event_id);
  const assertionShape = action === 'assert' && payload.retracts_event_id === undefined;
  return isText(payload.relationship_id)
    && isSortedUniqueStrings(payload.semantic_community_ids)
    && isEvidenceReferences(payload.evidence_refs)
    && isSortedUniqueStrings(payload.provenance_refs)
    && isSortedUniqueStrings(payload.independence_refs)
    && isText(payload.detector_version)
    && isText(payload.evidence_snapshot_ref)
    && (withdrawalShape || assertionShape);
}

function validateContradictionPayload(payload: Readonly<JsonObject>): boolean {
  try {
    return hasValidCommonPayload(payload)
      && isText(payload.left_claim_id)
      && isText(payload.right_claim_id)
      && payload.left_claim_id < payload.right_claim_id
      && isText(payload.incompatibility_scope)
      && payload.relationship_id === contradictionRelationshipId(
        payload.left_claim_id,
        payload.right_claim_id,
        payload.incompatibility_scope,
      );
  } catch {
    return false;
  }
}

function validateSupersessionPayload(payload: Readonly<JsonObject>): boolean {
  try {
    return hasValidCommonPayload(payload)
      && isText(payload.predecessor_claim_id)
      && isText(payload.successor_claim_id)
      && payload.predecessor_claim_id !== payload.successor_claim_id
      && isText(payload.replacement_scope)
      && isText(payload.strength_rationale)
      && payload.relationship_id === supersessionRelationshipId(
        payload.predecessor_claim_id,
        payload.successor_claim_id,
        payload.replacement_scope,
      );
  } catch {
    return false;
  }
}

/** Create the closed registry for the two versioned relationship events. */
export function createClaimRelationshipEventRegistry(): EventTypeRegistry {
  const definitions: EventTypeDefinition[] = [
    {
      eventType: RelationshipEventTypes.CONTRADICTION_RECORDED,
      currentVersion: CLAIM_RELATIONSHIP_EVENT_VERSION,
      versions: [{
        version: CLAIM_RELATIONSHIP_EVENT_VERSION,
        payload: {
          requiredFields: [
            ...COMMON_FIELDS,
            'left_claim_id',
            'right_claim_id',
            'incompatibility_scope',
          ],
          optionalFields: OPTIONAL_FIELDS,
          validate: validateContradictionPayload,
        },
      }],
      upcasters: [],
    },
    {
      eventType: RelationshipEventTypes.SUPERSESSION_RECORDED,
      currentVersion: CLAIM_RELATIONSHIP_EVENT_VERSION,
      versions: [{
        version: CLAIM_RELATIONSHIP_EVENT_VERSION,
        payload: {
          requiredFields: [
            ...COMMON_FIELDS,
            'predecessor_claim_id',
            'successor_claim_id',
            'replacement_scope',
            'strength_rationale',
          ],
          optionalFields: OPTIONAL_FIELDS,
          validate: validateSupersessionPayload,
        },
      }],
      upcasters: [],
    },
  ];
  return new EventTypeRegistry(definitions);
}

// ───────────────────────────────────────────────────────────────────
// 4. REFERENCE SNAPSHOT
// ───────────────────────────────────────────────────────────────────

function normalizeCatalogRecord(input: EvidenceCatalogRecord): EvidenceCatalogRecord {
  const evidenceId = requireText(input.evidence_id, 'evidence_records.evidence_id');
  const locator = requireText(input.locator, 'evidence_records.locator');
  if (typeof input.digest !== 'string' || !DIGEST_PATTERN.test(input.digest)) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Evidence catalog records require a lowercase SHA-256 digest',
      { evidenceId },
    );
  }
  return Object.freeze({ evidence_id: evidenceId, locator, digest: input.digest });
}

/** Normalize the content-addressed claim and evidence universe used during replay. */
export function normalizeReferenceSnapshot(
  input: RelationshipReferenceSnapshot,
): RelationshipReferenceSnapshot {
  const claimIds = sortedUnique(input.claim_ids, 'claim_ids');
  if (!Array.isArray(input.evidence_records) || input.evidence_records.length === 0) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Reference snapshots require at least one evidence record',
    );
  }
  const evidenceRecords = input.evidence_records.map(normalizeCatalogRecord).sort(
    (left, right) => compareText(left.evidence_id, right.evidence_id),
  );
  if (new Set(evidenceRecords.map((entry) => entry.evidence_id)).size !== evidenceRecords.length) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Reference snapshots cannot bind one evidence identity twice',
    );
  }
  return Object.freeze({
    snapshot_ref: requireText(input.snapshot_ref, 'snapshot_ref'),
    claim_ids: claimIds,
    evidence_records: Object.freeze(evidenceRecords) as unknown as EvidenceCatalogRecord[],
  });
}
