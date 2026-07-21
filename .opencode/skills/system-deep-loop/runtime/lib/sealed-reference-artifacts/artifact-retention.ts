// ───────────────────────────────────────────────────────────────────
// MODULE: Sealed Artifact Retention
// ───────────────────────────────────────────────────────────────────

import {
  ARTIFACT_LIFECYCLE_EVENT_TYPE,
  ARTIFACT_SEALED_EVENT_TYPE,
  ArtifactLifecycleActions,
  ArtifactRetentionRootTypes,
  parseArtifactLifecyclePayload,
  parseArtifactSealedPayload,
  prepareArtifactLifecycleEvent,
  recordArtifactEvent,
} from './artifact-events.js';
import { parseSealedArtifactReference } from './sealed-artifact-store.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from './sealed-artifact-types.js';

import type { AppendOnlyLedger, VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type { EventTypeRegistry } from '../event-envelope/index.js';
import type {
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactEventWriteResult,
  ArtifactRetentionRootType,
  VerifiedArtifactEvidence,
} from './artifact-events.js';
import type { SealedArtifactStore } from './sealed-artifact-store.js';
import type {
  ArtifactTombstone,
  SealedArtifactReference,
  VerifiedSealedArtifact,
} from './sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/** One active protected reference or explicit hold. */
export interface ArtifactRetentionRoot {
  readonly rootType: ArtifactRetentionRootType;
  readonly rootId: string;
}

/** Current lifecycle projection derived only from verified append order. */
export interface ArtifactLifecycleState {
  readonly reference: SealedArtifactReference;
  readonly hasCreationEvidence: boolean;
  readonly activeRoots: readonly ArtifactRetentionRoot[];
  readonly activeHolds: readonly ArtifactRetentionRoot[];
  readonly retentionUntil: string | null;
  readonly isQuarantined: boolean;
  readonly isDeletionEligible: boolean;
}

/** Completeness and time boundary for one conservative retention pass. */
export interface ArtifactRetentionPlanInput {
  readonly scanComplete: boolean;
  readonly evaluatedAt: string;
}

/** Fail-closed retain or delete decision for one exact digest reference. */
export interface ArtifactRetentionDecision {
  readonly reference: SealedArtifactReference;
  readonly decision: 'retain' | 'delete';
  readonly reason:
    | 'scan-incomplete'
    | 'creation-evidence-missing'
    | 'protected-root'
    | 'hold-active'
    | 'retention-horizon-missing'
    | 'retention-horizon-active'
    | 'quarantined'
    | 'eligibility-missing'
    | 'eligible';
  readonly activeRootCount: number;
  readonly activeHoldCount: number;
}

/** Counted retention result used to gate any destructive sweep. */
export interface ArtifactRetentionPlan {
  readonly scanComplete: boolean;
  readonly evaluatedAt: string;
  readonly retainedCount: number;
  readonly deletionCount: number;
  readonly decisions: readonly ArtifactRetentionDecision[];
}

/** Durable deletion authorization paired with its resulting tombstone. */
export interface ArtifactSweepResult {
  readonly lifecycle: ArtifactEventWriteResult;
  readonly tombstone: ArtifactTombstone;
}

/** Durable restoration authorization paired with reverified bytes. */
export interface ArtifactRestorationResult {
  readonly lifecycle: ArtifactEventWriteResult;
  readonly artifact: VerifiedSealedArtifact;
}

interface MutableLifecycleState {
  reference: SealedArtifactReference;
  hasCreationEvidence: boolean;
  roots: Map<string, ArtifactRetentionRoot>;
  holds: Map<string, ArtifactRetentionRoot>;
  retentionUntil: string | null;
  isQuarantined: boolean;
  isDeletionEligible: boolean;
}

// ───────────────────────────────────────────────────────────────────
// 2. LIFECYCLE REDUCTION
// ───────────────────────────────────────────────────────────────────

function rootKey(rootType: ArtifactRetentionRootType, rootId: string): string {
  return `${rootType}\u0000${rootId}`;
}

function stateFor(
  states: Map<string, MutableLifecycleState>,
  reference: SealedArtifactReference,
): MutableLifecycleState {
  const key = reference.qualified_digest;
  const existing = states.get(key);
  if (existing) return existing;
  const created: MutableLifecycleState = {
    reference,
    hasCreationEvidence: false,
    roots: new Map(),
    holds: new Map(),
    retentionUntil: null,
    isQuarantined: false,
    isDeletionEligible: false,
  };
  states.set(key, created);
  return created;
}

function applyLifecycleEvent(
  states: Map<string, MutableLifecycleState>,
  event: VerifiedLedgerEvent,
): void {
  const eventType = event.event.effective.envelope.event_type;
  const payload = event.event.effective.envelope.payload;
  if (eventType === ARTIFACT_SEALED_EVENT_TYPE) {
    const sealed = parseArtifactSealedPayload(payload);
    stateFor(states, sealed.reference).hasCreationEvidence = true;
    return;
  }
  if (eventType !== ARTIFACT_LIFECYCLE_EVENT_TYPE) return;
  const lifecycle = parseArtifactLifecyclePayload(payload);
  const state = stateFor(states, lifecycle.reference);
  const root = lifecycle.root_type && lifecycle.root_id
    ? Object.freeze({ rootType: lifecycle.root_type, rootId: lifecycle.root_id })
    : null;
  switch (lifecycle.action) {
    case ArtifactLifecycleActions.REFERENCE_ADDED:
      if (root) state.roots.set(rootKey(root.rootType, root.rootId), root);
      break;
    case ArtifactLifecycleActions.REFERENCE_RELEASED:
      if (root) state.roots.delete(rootKey(root.rootType, root.rootId));
      break;
    case ArtifactLifecycleActions.HOLD_PLACED:
      if (root) state.holds.set(rootKey(root.rootType, root.rootId), root);
      break;
    case ArtifactLifecycleActions.HOLD_RELEASED:
      if (root) state.holds.delete(rootKey(root.rootType, root.rootId));
      break;
    case ArtifactLifecycleActions.RETENTION_SET:
      state.retentionUntil = lifecycle.retention_until;
      break;
    case ArtifactLifecycleActions.QUARANTINED:
      state.isQuarantined = true;
      break;
    case ArtifactLifecycleActions.DELETION_ELIGIBLE:
      state.isDeletionEligible = true;
      break;
    case ArtifactLifecycleActions.DELETION_AUTHORIZED:
      state.isDeletionEligible = false;
      break;
    case ArtifactLifecycleActions.RESTORATION_AUTHORIZED:
      state.isDeletionEligible = false;
      state.isQuarantined = false;
      break;
  }
}

/** Derive current retention state solely from typed verified ledger events. */
export function deriveArtifactLifecycleStates(
  events: readonly VerifiedLedgerEvent[],
): ReadonlyMap<string, ArtifactLifecycleState> {
  const states = new Map<string, MutableLifecycleState>();
  let expectedSequence = 1;
  for (const event of events) {
    if (event.frame.sequence !== expectedSequence) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.RETENTION_INDETERMINATE,
        'retention',
        'Lifecycle derivation requires one complete ordered ledger prefix',
        { expectedSequence, actualSequence: event.frame.sequence },
      );
    }
    applyLifecycleEvent(states, event);
    expectedSequence += 1;
  }
  const frozen = new Map<string, ArtifactLifecycleState>();
  for (const [key, state] of states) {
    frozen.set(key, Object.freeze({
      reference: state.reference,
      hasCreationEvidence: state.hasCreationEvidence,
      activeRoots: Object.freeze(Array.from(state.roots.values())),
      activeHolds: Object.freeze(Array.from(state.holds.values())),
      retentionUntil: state.retentionUntil,
      isQuarantined: state.isQuarantined,
      isDeletionEligible: state.isDeletionEligible,
    }));
  }
  return frozen;
}

function retentionDecision(
  reference: SealedArtifactReference,
  state: ArtifactLifecycleState | undefined,
  input: ArtifactRetentionPlanInput,
): ArtifactRetentionDecision {
  const activeRootCount = state?.activeRoots.length ?? 0;
  const activeHoldCount = state?.activeHolds.length ?? 0;
  let reason: ArtifactRetentionDecision['reason'];
  let decision: ArtifactRetentionDecision['decision'] = 'retain';
  if (!input.scanComplete) reason = 'scan-incomplete';
  else if (!state?.hasCreationEvidence) reason = 'creation-evidence-missing';
  else if (activeRootCount > 0) reason = 'protected-root';
  else if (activeHoldCount > 0) reason = 'hold-active';
  else if (state.isQuarantined) reason = 'quarantined';
  else if (state.retentionUntil === null) reason = 'retention-horizon-missing';
  else if (new Date(state.retentionUntil).getTime() > new Date(input.evaluatedAt).getTime()) {
    reason = 'retention-horizon-active';
  } else if (!state.isDeletionEligible) reason = 'eligibility-missing';
  else {
    reason = 'eligible';
    decision = 'delete';
  }
  return Object.freeze({
    reference,
    decision,
    reason,
    activeRootCount,
    activeHoldCount,
  });
}

/** Plan a conservative sweep after the authorized ledger reader verifies all events. */
export async function planArtifactRetention(
  ledger: AppendOnlyLedger,
  referenceInputs: readonly unknown[],
  input: ArtifactRetentionPlanInput,
): Promise<ArtifactRetentionPlan> {
  const evaluatedAt = new Date(input.evaluatedAt);
  if (Number.isNaN(evaluatedAt.getTime()) || !input.evaluatedAt.endsWith('Z')) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'retention',
      'Retention evaluation requires one explicit UTC instant',
    );
  }
  const references = referenceInputs.map(parseSealedArtifactReference);
  const identities = references.map((reference) => reference.qualified_digest);
  if (new Set(identities).size !== identities.length) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'retention',
      'Retention candidates must contain unique exact references',
    );
  }
  const events = await ledger.readVerifiedEvents();
  const states = deriveArtifactLifecycleStates(events);
  const decisions = references.map((reference) => retentionDecision(
    reference,
    states.get(reference.qualified_digest),
    input,
  ));
  return Object.freeze({
    scanComplete: input.scanComplete,
    evaluatedAt: input.evaluatedAt,
    retainedCount: decisions.filter((candidate) => candidate.decision === 'retain').length,
    deletionCount: decisions.filter((candidate) => candidate.decision === 'delete').length,
    decisions: Object.freeze(decisions),
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. AUTHORIZED SWEEP AND RESTORATION
// ───────────────────────────────────────────────────────────────────

/** Record deletion authorization, then bind the tombstone to that durable receipt. */
export async function sweepArtifact(
  store: SealedArtifactStore,
  recorder: ArtifactEventRecorder,
  registry: EventTypeRegistry,
  evidence: VerifiedArtifactEvidence,
  decision: ArtifactRetentionDecision,
  metadata: ArtifactEventMetadata,
  reasonDigest: string,
): Promise<ArtifactSweepResult> {
  if (
    decision.decision !== 'delete'
    || decision.reason !== 'eligible'
    || decision.reference.qualified_digest !== evidence.artifact.reference.qualified_digest
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.RETENTION_PROTECTED,
      'retention',
      'Sweep requires one complete eligible decision for the exact artifact',
      { reason: decision.reason },
    );
  }
  const event = prepareArtifactLifecycleEvent(
    decision.reference,
    registry,
    metadata,
    {
      action: ArtifactLifecycleActions.DELETION_AUTHORIZED,
      reasonDigest,
    },
  );
  const lifecycle = await recordArtifactEvent(recorder, event);
  const tombstone = await store.deleteAuthorized(decision.reference, {
    eventId: lifecycle.receipt.event_id,
    ledgerId: lifecycle.receipt.ledger_id,
    ledgerSequence: lifecycle.receipt.sequence,
    ledgerRecordHash: lifecycle.receipt.recordHash,
    authorizedAt: lifecycle.receipt.committed_at,
  });
  return Object.freeze({ lifecycle, tombstone });
}

/** Record restoration authorization before republishing exact historical bytes. */
export async function restoreArtifact(
  store: SealedArtifactStore,
  recorder: ArtifactEventRecorder,
  registry: EventTypeRegistry,
  referenceInput: unknown,
  artifactSource: unknown,
  metadata: ArtifactEventMetadata,
  reasonDigest: string,
): Promise<ArtifactRestorationResult> {
  const reference = parseSealedArtifactReference(referenceInput);
  await store.validateRestoration(reference, artifactSource);
  const event = prepareArtifactLifecycleEvent(reference, registry, metadata, {
    action: ArtifactLifecycleActions.RESTORATION_AUTHORIZED,
    reasonDigest,
  });
  const lifecycle = await recordArtifactEvent(recorder, event);
  const artifact = await store.restoreAuthorized(reference, artifactSource, {
    eventId: lifecycle.receipt.event_id,
    ledgerId: lifecycle.receipt.ledger_id,
    ledgerSequence: lifecycle.receipt.sequence,
    ledgerRecordHash: lifecycle.receipt.recordHash,
    authorizedAt: lifecycle.receipt.committed_at,
  });
  return Object.freeze({ lifecycle, artifact });
}

/** Enumerate every protected root category expected by conservative retention. */
export function artifactRetentionRootTypes(): readonly ArtifactRetentionRootType[] {
  return Object.freeze(Object.values(ArtifactRetentionRootTypes));
}
