// ───────────────────────────────────────────────────────────────────
// MODULE: Branch Orchestration Ledger Fold
// ───────────────────────────────────────────────────────────────────

import {
  TypedReducerRegistry,
  rebuildProjection,
} from '../authorized-ledger/index.js';
import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import {
  BranchOrchestrationError,
  BranchOrchestrationErrorCodes,
} from './errors.js';
import {
  BRANCH_ORCHESTRATION_EVENT_TYPE,
  BRANCH_ORCHESTRATION_REDUCER_VERSION,
  asBranchOrchestrationRecord,
  branchRecordDigest,
} from './event-contract.js';
import {
  deriveLogicalBranchId,
  logicalBranchCoordinateKey,
  normalizeLogicalBranchCoordinates,
} from './logical-branch-registry.js';
import {
  BranchMutationKinds,
  BranchRecordTypes,
} from './types.js';
import { validateImmutableWavePlan } from './wave-plan.js';

import type {
  LedgerHead,
  RebuiltProjection,
  TypedReducerDefinition,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type { EventReadResult, JsonObject } from '../event-envelope/index.js';
import type {
  BranchMutatedBody,
  BranchOrchestrationProjection,
  BranchOrchestrationRecord,
  BranchRegisteredBody,
  ImmutableWave,
  LeaseAcquiredBody,
  LeaseBody,
  LedgerResumeState,
  ProjectedBranch,
  ProjectedLease,
  ProjectedWave,
  ResumeLeaseState,
  ResumeReconstructedBody,
  WaveAdmittedBody,
  WaveClosedBody,
  WavePlannedBody,
} from './types.js';
import type { BranchOrchestrationErrorCode } from './errors.js';

// ───────────────────────────────────────────────────────────────────
// 1. INITIAL STATE AND HELPERS
// ───────────────────────────────────────────────────────────────────

/** Create the empty deterministic reducer state. */
export function initialBranchOrchestrationProjection(): BranchOrchestrationProjection {
  return {
    schemaVersion: 1,
    runId: null,
    manifestFingerprint: null,
    wavePlan: null,
    branches: {},
    coordinateToBranch: {},
    leases: {},
    waves: {},
    currentWaveOrdinal: null,
    nextWaveOrdinal: null,
    blockedPrerequisiteWaveIds: [],
    transitionDigests: {},
  };
}

function cloneProjection(
  state: Readonly<BranchOrchestrationProjection>,
): BranchOrchestrationProjection {
  return JSON.parse(canonicalJson(state)) as BranchOrchestrationProjection;
}

function fail(
  code: BranchOrchestrationErrorCode,
  phase: 'identity' | 'ledger' | 'lease' | 'manifest' | 'mutation' | 'replay' | 'wave',
  message: string,
  details: Readonly<Record<string, unknown>> = {},
): never {
  throw new BranchOrchestrationError(code, phase, message, details);
}

function bindRun(state: BranchOrchestrationProjection, runId: string): void {
  if (state.runId === null) {
    state.runId = runId;
    return;
  }
  if (state.runId !== runId) {
    fail(
      BranchOrchestrationErrorCodes.RUN_ID_CONFLICT,
      'replay',
      'Ledger contains records for more than one orchestration run',
      { actualRunId: runId, expectedRunId: state.runId },
    );
  }
}

function branchIsSatisfied(branch: Readonly<ProjectedBranch>): boolean {
  return branch.terminalOutcome !== null
    || branch.acceptedResultDigest !== null
    || branch.acceptedSalvageDigest !== null;
}

function waveByOrdinal(
  state: Readonly<BranchOrchestrationProjection>,
  ordinal: number | null,
): ImmutableWave | null {
  if (ordinal === null || state.wavePlan === null) return null;
  return state.wavePlan.waves.find((wave) => wave.ordinal === ordinal) ?? null;
}

function refreshBlockedPrerequisites(state: BranchOrchestrationProjection): void {
  const next = waveByOrdinal(state, state.nextWaveOrdinal);
  state.blockedPrerequisiteWaveIds = next
    ? next.prerequisiteWaveIds.filter(
      (waveId) => state.waves[waveId]?.status !== 'closed-advance',
    )
    : [];
}

function registrationKey(body: BranchRegisteredBody): string {
  return sha256Bytes(canonicalBytes({
    logicalBranchId: body.logical_branch_id,
    coordinateKey: body.coordinate_key,
    invocationFingerprint: body.invocation_fingerprint,
    manifestFingerprint: body.manifest_fingerprint,
    waveId: body.wave_id,
    waveOrdinal: body.wave_ordinal,
    wavePlanFingerprint: body.wave_plan_fingerprint,
  }));
}

function applyBranchRegistration(
  state: BranchOrchestrationProjection,
  body: BranchRegisteredBody,
): void {
  if (state.wavePlan !== null) {
    fail(
      BranchOrchestrationErrorCodes.BRANCH_REGISTRATION_CONFLICT,
      'replay',
      'Branch membership cannot change after the wave plan is recorded',
    );
  }
  const coordinates = normalizeLogicalBranchCoordinates({
    modelId: body.model_id,
    branchId: body.branch_id,
    replicaOrdinal: body.replica_ordinal,
    derivationVersion: body.derivation_version,
  });
  const coordinateKey = logicalBranchCoordinateKey(coordinates);
  const logicalBranchId = deriveLogicalBranchId(coordinates);
  if (
    coordinateKey !== body.coordinate_key
    || logicalBranchId !== body.logical_branch_id
    || registrationKey(body) !== body.registration_key
  ) {
    fail(
      BranchOrchestrationErrorCodes.BRANCH_REGISTRATION_CONFLICT,
      'identity',
      'Branch registration does not match canonical identity derivation',
      { logicalBranchId: body.logical_branch_id },
    );
  }
  if (
    state.manifestFingerprint !== null
    && state.manifestFingerprint !== body.manifest_fingerprint
  ) {
    fail(
      BranchOrchestrationErrorCodes.MANIFEST_DRIFT,
      'manifest',
      'Branch registrations disagree on the normalized manifest fingerprint',
    );
  }
  const coordinateOwner = state.coordinateToBranch[coordinateKey];
  if (coordinateOwner !== undefined && coordinateOwner !== logicalBranchId) {
    fail(
      BranchOrchestrationErrorCodes.DUPLICATE_COORDINATES,
      'manifest',
      'Normalized coordinates map to more than one logical branch',
      { coordinateKey },
    );
  }
  const existing = state.branches[logicalBranchId];
  if (existing) {
    if (canonicalJson(existing.registration) !== canonicalJson(body)) {
      fail(
        BranchOrchestrationErrorCodes.BRANCH_REGISTRATION_CONFLICT,
        'replay',
        'Logical branch registration conflicts with immutable prior bytes',
        { logicalBranchId },
      );
    }
    return;
  }
  state.manifestFingerprint = body.manifest_fingerprint;
  state.coordinateToBranch[coordinateKey] = logicalBranchId;
  state.branches[logicalBranchId] = {
    registration: body,
    lifecycle: 'registered',
    lastStatus: null,
    lastAttemptId: null,
    acceptedResultDigest: null,
    acceptedSalvageDigest: null,
    terminalOutcome: null,
  };
}

function applyWavePlan(
  state: BranchOrchestrationProjection,
  body: WavePlannedBody,
): void {
  const plan = validateImmutableWavePlan(body.plan);
  if (
    state.manifestFingerprint === null
    || plan.manifestFingerprint !== state.manifestFingerprint
  ) {
    fail(
      BranchOrchestrationErrorCodes.MANIFEST_DRIFT,
      'wave',
      'Wave plan is not bound to the registered manifest',
    );
  }
  if (state.wavePlan !== null) {
    if (canonicalJson(state.wavePlan) !== canonicalJson(plan)) {
      fail(
        BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT,
        'wave',
        'An immutable wave plan cannot be replaced in place',
      );
    }
    return;
  }
  const plannedBranchIds = plan.waves.flatMap((wave) => wave.memberBranchIds).sort();
  const registeredBranchIds = Object.keys(state.branches).sort();
  if (canonicalJson(plannedBranchIds) !== canonicalJson(registeredBranchIds)) {
    fail(
      BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT,
      'wave',
      'Wave membership does not exactly cover the registered branches',
    );
  }
  for (const wave of plan.waves) {
    for (const branchId of wave.memberBranchIds) {
      const registration = state.branches[branchId].registration;
      if (
        registration.wave_id !== wave.waveId
        || registration.wave_ordinal !== wave.ordinal
        || registration.wave_plan_fingerprint !== plan.planFingerprint
      ) {
        fail(
          BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT,
          'wave',
          'Registered wave membership differs from the immutable plan',
          { logicalBranchId: branchId },
        );
      }
    }
    state.waves[wave.waveId] = {
      wave,
      status: 'planned',
      authorizationId: null,
    };
  }
  state.wavePlan = plan;
  state.nextWaveOrdinal = 0;
  refreshBlockedPrerequisites(state);
}

function resolveWave(
  state: BranchOrchestrationProjection,
  waveId: string,
  ordinal: number,
  fingerprint: string,
): ProjectedWave {
  if (state.wavePlan === null || state.wavePlan.planFingerprint !== fingerprint) {
    return fail(
      BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT,
      'wave',
      'Wave transition does not match the immutable plan fingerprint',
    );
  }
  const projected = state.waves[waveId];
  if (!projected || projected.wave.ordinal !== ordinal) {
    return fail(
      BranchOrchestrationErrorCodes.WAVE_STATE_CONFLICT,
      'wave',
      'Wave transition references an unknown ordinal or identifier',
      { ordinal, waveId },
    );
  }
  return projected;
}

function applyWaveAdmission(
  state: BranchOrchestrationProjection,
  body: WaveAdmittedBody,
): void {
  const projected = resolveWave(
    state,
    body.wave_id,
    body.wave_ordinal,
    body.plan_fingerprint,
  );
  if (
    state.currentWaveOrdinal !== null
    || state.nextWaveOrdinal !== body.wave_ordinal
    || projected.status !== 'planned'
  ) {
    fail(
      BranchOrchestrationErrorCodes.WAVE_NOT_AUTHORIZED,
      'wave',
      'Only the single ledger-authorized next wave may be admitted',
      { waveOrdinal: body.wave_ordinal },
    );
  }
  const blocked = projected.wave.prerequisiteWaveIds.filter(
    (waveId) => state.waves[waveId]?.status !== 'closed-advance',
  );
  if (blocked.length > 0) {
    fail(
      BranchOrchestrationErrorCodes.WAVE_NOT_AUTHORIZED,
      'wave',
      'Wave prerequisites are not durably closed for advance',
      { blocked },
    );
  }
  projected.status = 'admitted';
  projected.authorizationId = body.authorization_id;
  state.currentWaveOrdinal = body.wave_ordinal;
  state.nextWaveOrdinal = null;
  refreshBlockedPrerequisites(state);
}

function applyWaveClose(
  state: BranchOrchestrationProjection,
  body: WaveClosedBody,
): void {
  const projected = resolveWave(
    state,
    body.wave_id,
    body.wave_ordinal,
    body.plan_fingerprint,
  );
  if (state.currentWaveOrdinal !== body.wave_ordinal || projected.status !== 'admitted') {
    fail(
      BranchOrchestrationErrorCodes.WAVE_STATE_CONFLICT,
      'wave',
      'Only the admitted current wave may be durably closed',
      { waveOrdinal: body.wave_ordinal },
    );
  }
  projected.status = body.decision === 'advance' ? 'closed-advance' : 'closed-stop';
  projected.authorizationId = body.authorization_id;
  state.currentWaveOrdinal = null;
  const nextOrdinal = body.wave_ordinal + 1;
  state.nextWaveOrdinal = body.decision === 'advance'
    && state.wavePlan !== null
    && nextOrdinal < state.wavePlan.waves.length
    ? nextOrdinal
    : null;
  refreshBlockedPrerequisites(state);
}

function projectedLease(body: LeaseBody): ProjectedLease {
  return {
    logicalBranchId: body.logical_branch_id,
    waveId: body.wave_id,
    leaseId: body.lease_id,
    ownerId: body.owner_id,
    attemptId: body.attempt_id,
    fenceToken: body.fence_token,
    acquiredAt: body.acquired_at,
    renewedAt: body.renewed_at,
    expiresAt: body.expires_at,
    status: 'active',
  };
}

function requireRunnableBranch(
  state: BranchOrchestrationProjection,
  logicalBranchId: string,
  waveId: string,
): ProjectedBranch {
  const branch = state.branches[logicalBranchId];
  const wave = state.waves[waveId];
  if (!branch) {
    return fail(
      BranchOrchestrationErrorCodes.BRANCH_NOT_FOUND,
      'lease',
      'Lease record references an unregistered branch',
      { logicalBranchId },
    );
  }
  if (
    branch.registration.wave_id !== waveId
    || !wave
    || wave.status !== 'admitted'
    || state.currentWaveOrdinal !== wave.wave.ordinal
    || branchIsSatisfied(branch)
  ) {
    return fail(
      BranchOrchestrationErrorCodes.WAVE_NOT_AUTHORIZED,
      'lease',
      'Branch is not runnable in the single admitted wave',
      { logicalBranchId, waveId },
    );
  }
  return branch;
}

function applyLeaseAcquired(
  state: BranchOrchestrationProjection,
  body: LeaseAcquiredBody,
  observedAt: string,
): void {
  const branch = requireRunnableBranch(state, body.logical_branch_id, body.wave_id);
  const prior = state.leases[body.logical_branch_id];
  if (prior) {
    if (body.fence_token <= prior.fenceToken) {
      fail(
        BranchOrchestrationErrorCodes.AMBIGUOUS_LEASE_STATE,
        'lease',
        'Fencing tokens must increase strictly across every grant',
        { suppliedFenceToken: body.fence_token, priorFenceToken: prior.fenceToken },
      );
    }
    if (
      prior.status === 'active'
      && (
        body.acquisition !== 'takeover'
        || Date.parse(prior.expiresAt) > Date.parse(observedAt)
      )
    ) {
      fail(
        BranchOrchestrationErrorCodes.AMBIGUOUS_LEASE_STATE,
        'lease',
        'A live accepted lease cannot be replaced without expiry and takeover',
        { logicalBranchId: body.logical_branch_id },
      );
    }
  } else if (body.acquisition !== 'acquired') {
    fail(
      BranchOrchestrationErrorCodes.AMBIGUOUS_LEASE_STATE,
      'lease',
      'The first accepted lease for a branch cannot claim an unexplained takeover',
      { logicalBranchId: body.logical_branch_id },
    );
  }
  state.leases[body.logical_branch_id] = projectedLease(body);
  branch.lifecycle = 'leased';
  branch.lastAttemptId = body.attempt_id;
}

function requireExactLease(
  state: BranchOrchestrationProjection,
  body: LeaseBody | BranchMutatedBody,
  observedAt: string,
): ProjectedLease {
  const lease = state.leases[body.logical_branch_id];
  if (
    !lease
    || lease.status !== 'active'
    || lease.waveId !== body.wave_id
    || lease.leaseId !== body.lease_id
    || lease.ownerId !== body.owner_id
    || lease.attemptId !== body.attempt_id
    || lease.fenceToken !== body.fence_token
    || Date.parse(lease.expiresAt) <= Date.parse(observedAt)
  ) {
    return fail(
      BranchOrchestrationErrorCodes.AMBIGUOUS_LEASE_STATE,
      'lease',
      'Protected record does not carry the single current unexpired lease tuple',
      { logicalBranchId: body.logical_branch_id, fenceToken: body.fence_token },
    );
  }
  return lease;
}

function applyLeaseRenewed(
  state: BranchOrchestrationProjection,
  body: LeaseBody,
  observedAt: string,
): void {
  const lease = requireExactLease(state, body, observedAt);
  if (
    body.acquired_at !== lease.acquiredAt
    || Date.parse(body.renewed_at) < Date.parse(lease.renewedAt)
    || Date.parse(body.expires_at) <= Date.parse(lease.expiresAt)
  ) {
    fail(
      BranchOrchestrationErrorCodes.AMBIGUOUS_LEASE_STATE,
      'lease',
      'Lease renewal cannot move accepted lease time backward',
    );
  }
  lease.renewedAt = body.renewed_at;
  lease.expiresAt = body.expires_at;
}

function applyLeaseReleased(
  state: BranchOrchestrationProjection,
  body: LeaseBody,
  observedAt: string,
): void {
  const lease = requireExactLease(state, body, observedAt);
  lease.status = 'released';
}

function requireMutationDigest(body: BranchMutatedBody): void {
  const actual = sha256Bytes(canonicalBytes({
    mutationKind: body.mutation_kind,
    data: body.data,
  }));
  if (actual !== body.mutation_digest) {
    fail(
      BranchOrchestrationErrorCodes.INVALID_MUTATION,
      'mutation',
      'Branch mutation digest does not match its canonical data',
    );
  }
}

function applyBranchMutation(
  state: BranchOrchestrationProjection,
  body: BranchMutatedBody,
  observedAt: string,
): void {
  requireMutationDigest(body);
  requireExactLease(state, body, observedAt);
  const branch = state.branches[body.logical_branch_id];
  if (!branch || branch.terminalOutcome !== null) {
    fail(
      BranchOrchestrationErrorCodes.INVALID_MUTATION,
      'mutation',
      'Terminal or unknown branches cannot accept another protected mutation',
      { logicalBranchId: body.logical_branch_id },
    );
  }
  branch.lastAttemptId = body.attempt_id;

  switch (body.mutation_kind) {
    case BranchMutationKinds.DISPATCH:
      branch.lifecycle = 'dispatched';
      break;
    case BranchMutationKinds.STATUS:
      branch.lifecycle = 'running';
      branch.lastStatus = typeof body.data.status === 'string' ? body.data.status : 'updated';
      break;
    case BranchMutationKinds.RETRY:
      branch.lifecycle = 'leased';
      branch.lastStatus = 'retry-owned';
      break;
    case BranchMutationKinds.RESULT: {
      const digest = body.data.result_digest;
      if (typeof digest !== 'string' || !/^[a-f0-9]{64}$/u.test(digest)) {
        fail(
          BranchOrchestrationErrorCodes.INVALID_MUTATION,
          'mutation',
          'Accepted result mutation requires a canonical result digest',
        );
      }
      if (branch.acceptedResultDigest !== null && branch.acceptedResultDigest !== digest) {
        fail(
          BranchOrchestrationErrorCodes.INVALID_MUTATION,
          'mutation',
          'A branch cannot accept two different result envelopes',
        );
      }
      branch.acceptedResultDigest = digest;
      branch.lifecycle = 'result-accepted';
      break;
    }
    case BranchMutationKinds.SALVAGE: {
      const digest = body.data.salvage_digest;
      if (typeof digest !== 'string' || !/^[a-f0-9]{64}$/u.test(digest)) {
        fail(
          BranchOrchestrationErrorCodes.INVALID_MUTATION,
          'mutation',
          'Salvage mutation requires a canonical salvage digest',
        );
      }
      if (branch.acceptedSalvageDigest !== null && branch.acceptedSalvageDigest !== digest) {
        fail(
          BranchOrchestrationErrorCodes.INVALID_MUTATION,
          'mutation',
          'A branch cannot accept two different salvage merges',
        );
      }
      branch.acceptedSalvageDigest = digest;
      branch.lifecycle = 'result-accepted';
      break;
    }
    case BranchMutationKinds.TERMINAL: {
      const outcome = body.data.outcome;
      if (outcome !== 'succeeded' && outcome !== 'failed' && outcome !== 'cancelled') {
        fail(
          BranchOrchestrationErrorCodes.INVALID_MUTATION,
          'mutation',
          'Terminal mutation requires a supported outcome',
        );
      }
      if (
        outcome === 'succeeded'
        && branch.acceptedResultDigest === null
        && branch.acceptedSalvageDigest === null
      ) {
        fail(
          BranchOrchestrationErrorCodes.INVALID_MUTATION,
          'mutation',
          'Successful terminal state requires an accepted result or salvage digest',
        );
      }
      branch.terminalOutcome = outcome;
      branch.lifecycle = 'terminal';
      branch.lastStatus = outcome;
      break;
    }
  }
}

function applyResume(
  state: BranchOrchestrationProjection,
  body: ResumeReconstructedBody,
): void {
  const satisfied = Object.values(state.branches).filter(branchIsSatisfied).length;
  if (
    state.manifestFingerprint !== body.manifest_fingerprint
    || state.wavePlan?.planFingerprint !== body.plan_fingerprint
    || Object.keys(state.branches).length !== body.registered_branches
    || satisfied !== body.satisfied_branches
    || state.currentWaveOrdinal !== body.current_wave_ordinal
    || state.nextWaveOrdinal !== body.next_wave_ordinal
  ) {
    fail(
      BranchOrchestrationErrorCodes.WAVE_STATE_CONFLICT,
      'replay',
      'Resume record does not match the ledger-derived orchestration state',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. REDUCER
// ───────────────────────────────────────────────────────────────────

/** Apply one validated record while enforcing all immutable fold invariants. */
export function reduceBranchOrchestrationRecord(
  prior: Readonly<BranchOrchestrationProjection>,
  record: BranchOrchestrationRecord,
  observedAt: string,
): BranchOrchestrationProjection {
  const digest = branchRecordDigest(record);
  const priorDigest = prior.transitionDigests[record.transition_id];
  if (priorDigest !== undefined) {
    if (priorDigest !== digest) {
      return fail(
        BranchOrchestrationErrorCodes.BRANCH_REGISTRATION_CONFLICT,
        'replay',
        'Transition identity is already bound to different canonical bytes',
        { transitionId: record.transition_id },
      );
    }
    return cloneProjection(prior);
  }

  const state = cloneProjection(prior);
  bindRun(state, record.run_id);
  switch (record.record_type) {
    case BranchRecordTypes.BRANCH_REGISTERED:
      applyBranchRegistration(state, record.body as BranchRegisteredBody);
      break;
    case BranchRecordTypes.WAVE_PLANNED:
      applyWavePlan(state, record.body as WavePlannedBody);
      break;
    case BranchRecordTypes.WAVE_ADMITTED:
      applyWaveAdmission(state, record.body as WaveAdmittedBody);
      break;
    case BranchRecordTypes.WAVE_CLOSED:
      applyWaveClose(state, record.body as WaveClosedBody);
      break;
    case BranchRecordTypes.LEASE_ACQUIRED:
      applyLeaseAcquired(state, record.body as LeaseAcquiredBody, observedAt);
      break;
    case BranchRecordTypes.LEASE_RENEWED:
      applyLeaseRenewed(state, record.body as LeaseBody, observedAt);
      break;
    case BranchRecordTypes.LEASE_RELEASED:
      applyLeaseReleased(state, record.body as LeaseBody, observedAt);
      break;
    case BranchRecordTypes.LEASE_REJECTED:
      break;
    case BranchRecordTypes.BRANCH_MUTATED:
      applyBranchMutation(state, record.body as BranchMutatedBody, observedAt);
      break;
    case BranchRecordTypes.RESUME_RECONSTRUCTED:
      applyResume(state, record.body as ResumeReconstructedBody);
      break;
  }
  state.transitionDigests[record.transition_id] = digest;
  return state;
}

/** Preview a transition before immutable append so invalid events never poison the ledger. */
export function previewBranchOrchestrationRecord(
  state: Readonly<BranchOrchestrationProjection>,
  record: BranchOrchestrationRecord,
  observedAt: string,
): BranchOrchestrationProjection {
  return reduceBranchOrchestrationRecord(state, record, observedAt);
}

function reduceVerifiedEvent(
  state: Readonly<BranchOrchestrationProjection>,
  event: Readonly<EventReadResult>,
): BranchOrchestrationProjection {
  const record = asBranchOrchestrationRecord(event.effective.envelope.payload);
  return reduceBranchOrchestrationRecord(
    state,
    record,
    event.effective.envelope.occurred_at,
  );
}

/** Reducer registration consumed by verified projection replay. */
export const branchOrchestrationReducerDefinition:
TypedReducerDefinition<BranchOrchestrationProjection> = Object.freeze({
  eventType: BRANCH_ORCHESTRATION_EVENT_TYPE,
  reducerVersion: BRANCH_ORCHESTRATION_REDUCER_VERSION,
  reduce: reduceVerifiedEvent,
});

/** Rebuild solely from verified ledger order and prove repeated-byte parity. */
export function foldBranchOrchestrationLedger(
  events: readonly VerifiedLedgerEvent[],
  ledgerHead: LedgerHead,
): RebuiltProjection<BranchOrchestrationProjection> {
  return rebuildProjection(
    events,
    initialBranchOrchestrationProjection(),
    BRANCH_ORCHESTRATION_REDUCER_VERSION,
    ledgerHead,
    new TypedReducerRegistry([branchOrchestrationReducerDefinition]),
  );
}

// ───────────────────────────────────────────────────────────────────
// 3. RESUME VIEW
// ───────────────────────────────────────────────────────────────────

/** Derive resume admission and ownership without directory or process inspection. */
export function buildLedgerResumeState(
  projection: Readonly<BranchOrchestrationProjection>,
  now = new Date(),
): LedgerResumeState {
  if (
    projection.runId === null
    || projection.manifestFingerprint === null
    || projection.wavePlan === null
  ) {
    return fail(
      BranchOrchestrationErrorCodes.WAVE_STATE_CONFLICT,
      'replay',
      'Ledger does not contain a complete registered wave plan',
    );
  }
  const registeredBranchIds = Object.keys(projection.branches).sort();
  const satisfiedBranchIds = registeredBranchIds.filter(
    (branchId) => branchIsSatisfied(projection.branches[branchId]),
  );
  const activeLeases: ResumeLeaseState[] = Object.values(projection.leases)
    .filter((lease) => lease.status === 'active')
    .sort((left, right) => left.logicalBranchId.localeCompare(right.logicalBranchId))
    .map((lease) => Object.freeze({
      logicalBranchId: lease.logicalBranchId,
      ownerId: lease.ownerId,
      attemptId: lease.attemptId,
      leaseId: lease.leaseId,
      fenceToken: lease.fenceToken,
      expiresAt: lease.expiresAt,
      isExpired: now.getTime() >= Date.parse(lease.expiresAt),
    }));
  return Object.freeze({
    runId: projection.runId,
    manifestFingerprint: projection.manifestFingerprint,
    wavePlanFingerprint: projection.wavePlan.planFingerprint,
    registeredBranchIds: Object.freeze(registeredBranchIds),
    satisfiedBranchIds: Object.freeze(satisfiedBranchIds),
    activeLeases: Object.freeze(activeLeases),
    currentWave: waveByOrdinal(projection, projection.currentWaveOrdinal),
    nextWave: waveByOrdinal(projection, projection.nextWaveOrdinal),
    blockedPrerequisiteWaveIds: Object.freeze([...projection.blockedPrerequisiteWaveIds]),
  });
}

/** Report whether replay has enough accepted evidence to suppress redispatch. */
export function isProjectedBranchSatisfied(branch: Readonly<ProjectedBranch>): boolean {
  return branchIsSatisfied(branch);
}

/** Verified ledger fold with deterministic digest evidence. */
export type BranchOrchestrationFold = RebuiltProjection<BranchOrchestrationProjection>;
/** JSON-compatible alias for downstream projection consumers. */
export type BranchOrchestrationJson = JsonObject;
