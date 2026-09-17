// ───────────────────────────────────────────────────────────────────
// MODULE: Branch Orchestration Event Contract
// ───────────────────────────────────────────────────────────────────

import { EventTypeRegistry, canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { validateLogicalBranchId } from './logical-branch-registry.js';
import {
  BranchMutationKinds,
  BranchRecordTypes,
} from './types.js';
import { validateImmutableWavePlan } from './wave-plan.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  BranchMutationKind,
  BranchOrchestrationRecord,
  BranchRecordType,
  ImmutableWavePlan,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const BRANCH_ORCHESTRATION_EVENT_TYPE = 'fanout.orchestration.recorded';
export const BRANCH_ORCHESTRATION_EVENT_VERSION = 1;
export const BRANCH_ORCHESTRATION_REDUCER_VERSION = 'branch-orchestration-fold-v1';

const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;
const RECORD_TYPES = new Set<string>(Object.values(BranchRecordTypes));
const MUTATION_KINDS = new Set<string>(Object.values(BranchMutationKinds));

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireExactFields(
  value: Record<string, unknown>,
  required: readonly string[],
): void {
  const actual = Object.keys(value).sort();
  const expected = [...required].sort();
  if (
    actual.length !== expected.length
    || actual.some((field, index) => field !== expected[index])
  ) {
    throw new TypeError(`Expected exact fields: ${expected.join(',')}`);
  }
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '' || value !== value.trim()) {
    throw new TypeError(`${field} must be a canonical non-empty string`);
  }
  return value;
}

function requireDigest(value: unknown, field: string): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a lowercase SHA-256 digest`);
  }
  return value;
}

function requirePositiveInteger(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) <= 0) {
    throw new TypeError(`${field} must be a positive safe integer`);
  }
  return value as number;
}

function requireNonNegativeInteger(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    throw new TypeError(`${field} must be a non-negative safe integer`);
  }
  return value as number;
}

function requireIsoTimestamp(value: unknown, field: string): string {
  if (
    typeof value !== 'string'
    || !value.endsWith('Z')
    || Number.isNaN(Date.parse(value))
  ) {
    throw new TypeError(`${field} must be an RFC 3339 UTC timestamp`);
  }
  return value;
}

function validateBranchRegistration(body: Record<string, unknown>): void {
  requireExactFields(body, [
    'logical_branch_id',
    'coordinate_key',
    'model_id',
    'branch_id',
    'replica_ordinal',
    'derivation_version',
    'manifest_fingerprint',
    'invocation_fingerprint',
    'registration_key',
    'wave_id',
    'wave_ordinal',
    'wave_plan_fingerprint',
  ]);
  validateLogicalBranchId(body.logical_branch_id);
  requireString(body.coordinate_key, 'coordinate_key');
  requireString(body.model_id, 'model_id');
  requireString(body.branch_id, 'branch_id');
  requirePositiveInteger(body.replica_ordinal, 'replica_ordinal');
  requirePositiveInteger(body.derivation_version, 'derivation_version');
  requireDigest(body.manifest_fingerprint, 'manifest_fingerprint');
  requireDigest(body.invocation_fingerprint, 'invocation_fingerprint');
  requireDigest(body.registration_key, 'registration_key');
  requireString(body.wave_id, 'wave_id');
  requireNonNegativeInteger(body.wave_ordinal, 'wave_ordinal');
  requireDigest(body.wave_plan_fingerprint, 'wave_plan_fingerprint');
}

function validateWavePlanned(body: Record<string, unknown>): void {
  requireExactFields(body, ['plan']);
  if (!isRecord(body.plan)) throw new TypeError('plan must be an object');
  validateImmutableWavePlan(body.plan as unknown as ImmutableWavePlan);
}

function validateWaveTransition(body: Record<string, unknown>, isClose: boolean): void {
  const fields = [
    'wave_id',
    'wave_ordinal',
    'plan_fingerprint',
    'authorization_id',
    ...(isClose ? ['policy_id', 'decision'] : []),
  ];
  requireExactFields(body, fields);
  requireString(body.wave_id, 'wave_id');
  requireNonNegativeInteger(body.wave_ordinal, 'wave_ordinal');
  requireDigest(body.plan_fingerprint, 'plan_fingerprint');
  requireString(body.authorization_id, 'authorization_id');
  if (isClose) {
    requireString(body.policy_id, 'policy_id');
    if (body.decision !== 'advance' && body.decision !== 'stop') {
      throw new TypeError('decision must be advance or stop');
    }
  }
}

const LEASE_FIELDS = [
  'logical_branch_id',
  'wave_id',
  'lease_id',
  'owner_id',
  'attempt_id',
  'fence_token',
  'acquired_at',
  'renewed_at',
  'expires_at',
] as const;

function validateLeaseBody(body: Record<string, unknown>, hasAcquisition: boolean): void {
  requireExactFields(body, [...LEASE_FIELDS, ...(hasAcquisition ? ['acquisition'] : [])]);
  validateLogicalBranchId(body.logical_branch_id);
  requireString(body.wave_id, 'wave_id');
  requireString(body.lease_id, 'lease_id');
  requireString(body.owner_id, 'owner_id');
  requireString(body.attempt_id, 'attempt_id');
  requirePositiveInteger(body.fence_token, 'fence_token');
  const acquiredAt = requireIsoTimestamp(body.acquired_at, 'acquired_at');
  const renewedAt = requireIsoTimestamp(body.renewed_at, 'renewed_at');
  const expiresAt = requireIsoTimestamp(body.expires_at, 'expires_at');
  if (Date.parse(renewedAt) < Date.parse(acquiredAt) || Date.parse(expiresAt) <= Date.parse(renewedAt)) {
    throw new TypeError('lease timestamps must be monotonic');
  }
  if (hasAcquisition && body.acquisition !== 'acquired' && body.acquisition !== 'takeover') {
    throw new TypeError('acquisition must be acquired or takeover');
  }
}

function validateLeaseRejected(body: Record<string, unknown>): void {
  requireExactFields(body, [
    'logical_branch_id',
    'lease_id',
    'owner_id',
    'attempt_id',
    'fence_token',
    'mutation_kind',
    'rejection_code',
  ]);
  validateLogicalBranchId(body.logical_branch_id);
  requireString(body.lease_id, 'lease_id');
  requireString(body.owner_id, 'owner_id');
  requireString(body.attempt_id, 'attempt_id');
  requirePositiveInteger(body.fence_token, 'fence_token');
  const mutationKind = requireString(body.mutation_kind, 'mutation_kind');
  if (!MUTATION_KINDS.has(mutationKind) && mutationKind !== 'lease_renew' && mutationKind !== 'lease_release') {
    throw new TypeError('rejected mutation kind is not registered');
  }
  requireString(body.rejection_code, 'rejection_code');
}

function validateBranchMutation(body: Record<string, unknown>): void {
  requireExactFields(body, [
    'logical_branch_id',
    'wave_id',
    'lease_id',
    'owner_id',
    'attempt_id',
    'fence_token',
    'mutation_kind',
    'mutation_digest',
    'data',
  ]);
  validateLogicalBranchId(body.logical_branch_id);
  requireString(body.wave_id, 'wave_id');
  requireString(body.lease_id, 'lease_id');
  requireString(body.owner_id, 'owner_id');
  requireString(body.attempt_id, 'attempt_id');
  requirePositiveInteger(body.fence_token, 'fence_token');
  if (!MUTATION_KINDS.has(String(body.mutation_kind))) {
    throw new TypeError('mutation kind is not registered');
  }
  requireDigest(body.mutation_digest, 'mutation_digest');
  if (!isRecord(body.data)) throw new TypeError('mutation data must be an object');
  canonicalBytes(body.data as JsonObject);
}

function validateResume(body: Record<string, unknown>): void {
  requireExactFields(body, [
    'manifest_fingerprint',
    'plan_fingerprint',
    'registered_branches',
    'satisfied_branches',
    'current_wave_ordinal',
    'next_wave_ordinal',
  ]);
  requireDigest(body.manifest_fingerprint, 'manifest_fingerprint');
  requireDigest(body.plan_fingerprint, 'plan_fingerprint');
  requireNonNegativeInteger(body.registered_branches, 'registered_branches');
  requireNonNegativeInteger(body.satisfied_branches, 'satisfied_branches');
  for (const field of ['current_wave_ordinal', 'next_wave_ordinal'] as const) {
    if (body[field] !== null) requireNonNegativeInteger(body[field], field);
  }
}

/** Validate the closed discriminated payload carried by the canonical event type. */
export function validateBranchOrchestrationRecord(payload: Readonly<JsonObject>): void {
  const raw = payload as Record<string, unknown>;
  requireExactFields(raw, ['record_type', 'run_id', 'transition_id', 'body']);
  const recordType = requireString(raw.record_type, 'record_type');
  if (!RECORD_TYPES.has(recordType)) throw new TypeError('record_type is not registered');
  requireString(raw.run_id, 'run_id');
  requireString(raw.transition_id, 'transition_id');
  if (!isRecord(raw.body)) throw new TypeError('body must be an object');
  const body = raw.body;

  switch (recordType as BranchRecordType) {
    case BranchRecordTypes.BRANCH_REGISTERED:
      validateBranchRegistration(body);
      break;
    case BranchRecordTypes.WAVE_PLANNED:
      validateWavePlanned(body);
      break;
    case BranchRecordTypes.WAVE_ADMITTED:
      validateWaveTransition(body, false);
      break;
    case BranchRecordTypes.WAVE_CLOSED:
      validateWaveTransition(body, true);
      break;
    case BranchRecordTypes.LEASE_ACQUIRED:
      validateLeaseBody(body, true);
      break;
    case BranchRecordTypes.LEASE_RENEWED:
    case BranchRecordTypes.LEASE_RELEASED:
      validateLeaseBody(body, false);
      break;
    case BranchRecordTypes.LEASE_REJECTED:
      validateLeaseRejected(body);
      break;
    case BranchRecordTypes.BRANCH_MUTATED:
      validateBranchMutation(body);
      break;
    case BranchRecordTypes.RESUME_RECONSTRUCTED:
      validateResume(body);
      break;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Build the closed event registry consumed by the durable branch ledger. */
export function createBranchOrchestrationEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry([{
    eventType: BRANCH_ORCHESTRATION_EVENT_TYPE,
    currentVersion: BRANCH_ORCHESTRATION_EVENT_VERSION,
    versions: [{
      version: BRANCH_ORCHESTRATION_EVENT_VERSION,
      payload: {
        requiredFields: ['record_type', 'run_id', 'transition_id', 'body'],
        optionalFields: [],
        validate: validateBranchOrchestrationRecord,
      },
    }],
    upcasters: [],
  }]);
}

/** Stable digest used for transition idempotency and reducer conflict checks. */
export function branchRecordDigest(record: BranchOrchestrationRecord): string {
  validateBranchOrchestrationRecord(record);
  return sha256Bytes(canonicalBytes(record));
}

/** Narrow an already validated payload at the reducer boundary. */
export function asBranchOrchestrationRecord(
  payload: Readonly<JsonObject>,
): BranchOrchestrationRecord {
  validateBranchOrchestrationRecord(payload);
  return payload as BranchOrchestrationRecord;
}

/** Narrow a registered protected mutation discriminator. */
export function isBranchMutationKind(value: string): value is BranchMutationKind {
  return MUTATION_KINDS.has(value);
}
