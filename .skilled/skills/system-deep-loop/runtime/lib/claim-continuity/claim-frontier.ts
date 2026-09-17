// ───────────────────────────────────────────────────────────────────
// MODULE: Claim Continuity Resume Frontier
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ContinuityIdentityKinds,
  continuityDigest,
  requireRegisteredIdentity,
  restoreContinuityFrontier,
  validateIdentityRef,
} from '../deep-loop/continuity-identity/index.js';
import {
  CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
  CLAIM_CONTINUITY_REDUCER_VERSION,
} from './claim-continuity-events.js';
import { deriveClaimContinuityReplayFingerprint } from './claim-replay.js';
import {
  CLAIM_CONTINUITY_SCHEMA_VERSION,
  ClaimContinuityError,
  ClaimContinuityErrorCodes,
} from './claim-continuity-types.js';

import type { AppendOnlyLedger } from '../authorized-ledger/index.js';
import type { EventTypeRegistry, JsonObject } from '../event-envelope/index.js';
import type {
  ContinuityIdentityRef,
  RestoredContinuityFrontier,
} from '../deep-loop/continuity-identity/index.js';
import type { DerivedReplayFingerprint } from '../replay-fingerprint/index.js';
import type {
  ClaimContinuityFrontier,
  ClaimContinuityState,
  RestoredClaimContinuityFrontier,
} from './claim-continuity-types.js';

export interface CreateClaimContinuityFrontierInput {
  readonly identityFrontier: RestoredContinuityFrontier;
  readonly fingerprint: DerivedReplayFingerprint<ClaimContinuityState>;
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function exactFields(value: Record<string, unknown>, fields: readonly string[]): boolean {
  const actual = Object.keys(value).sort(compareCodeUnits);
  const expected = [...fields].sort(compareCodeUnits);
  return actual.length === expected.length
    && actual.every((field, index) => field === expected[index]);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isHash(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

function activeRefs(state: Readonly<ClaimContinuityState>): ContinuityIdentityRef[] {
  return Object.values(state.records)
    .filter((record) => record.lifecycle === 'active')
    .map((record) => record.claim_ref)
    .sort((left, right) => compareCodeUnits(left.id, right.id));
}

function refIds(refs: readonly ContinuityIdentityRef[]): string[] {
  return refs.map((ref) => ref.id).sort(compareCodeUnits);
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return JSON.stringify([...left].sort(compareCodeUnits))
    === JSON.stringify([...right].sort(compareCodeUnits));
}

function assertNoDuplicateRefs(refs: readonly ContinuityIdentityRef[]): void {
  if (new Set(refs.map((ref) => ref.id)).size !== refs.length) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_FRONTIER,
      'Resume frontier contains ambiguous duplicate claim references',
    );
  }
}

/** Create the compact extension only after base and claim frontiers agree. */
export function createClaimContinuityFrontier(
  input: CreateClaimContinuityFrontierInput,
): ClaimContinuityFrontier {
  const state = input.fingerprint.projection.state;
  const identity = input.identityFrontier;
  const descriptor = input.fingerprint.descriptor;
  if (
    state.identity_projection_digest !== identity.fingerprint.descriptor.projection_digest
    || !sameStrings(
      refIds(activeRefs(state)),
      refIds(identity.frontier.active_claim_refs),
    )
  ) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_FRONTIER,
      'Claim projection and identity frontier disagree on active claim continuity',
    );
  }
  assertNoDuplicateRefs(identity.frontier.active_claim_refs);
  const core: Omit<ClaimContinuityFrontier, 'frontier_digest'> = {
    schema_version: CLAIM_CONTINUITY_SCHEMA_VERSION,
    continuity_identity_frontier_digest: identity.frontier.frontier_digest,
    identity_projection_digest: state.identity_projection_digest,
    active_claim_refs: activeRefs(state),
    unresolved_match_ids: [...state.unresolved_match_ids].sort(compareCodeUnits),
    claim_reducer_version: CLAIM_CONTINUITY_REDUCER_VERSION,
    claim_projection_schema_version: CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
    claim_ledger_cursor: {
      ledger_id: descriptor.ledger_id,
      sequence: descriptor.range_end_sequence,
      record_hash: descriptor.terminal_head_hash,
    },
    claim_replay_fingerprint: {
      fingerprint_version: descriptor.fingerprint_version,
      run_id: descriptor.run_id,
      range_start_sequence: descriptor.range_start_sequence,
      range_end_sequence: descriptor.range_end_sequence,
      event_registry_digest: descriptor.envelope_registry_digest,
      projection_digest: descriptor.projection_digest,
      final_digest: descriptor.final_digest,
    },
    claim_projection_digest: descriptor.projection_digest,
  };
  return Object.freeze({
    ...core,
    frontier_digest: continuityDigest(core as JsonObject),
  } as ClaimContinuityFrontier);
}

function validateShape(input: unknown): ClaimContinuityFrontier {
  if (!isObject(input) || !exactFields(input, [
    'schema_version',
    'continuity_identity_frontier_digest',
    'identity_projection_digest',
    'active_claim_refs',
    'unresolved_match_ids',
    'claim_reducer_version',
    'claim_projection_schema_version',
    'claim_ledger_cursor',
    'claim_replay_fingerprint',
    'claim_projection_digest',
    'frontier_digest',
  ])) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_FRONTIER,
      'Claim resume frontier does not match the closed schema',
    );
  }
  if (
    input.schema_version !== CLAIM_CONTINUITY_SCHEMA_VERSION
    || !isHash(input.continuity_identity_frontier_digest)
    || !isHash(input.identity_projection_digest)
    || !isHash(input.claim_projection_digest)
    || !isHash(input.frontier_digest)
    || !Array.isArray(input.active_claim_refs)
    || !Array.isArray(input.unresolved_match_ids)
    || !input.unresolved_match_ids.every((value) => typeof value === 'string')
    || input.claim_reducer_version !== CLAIM_CONTINUITY_REDUCER_VERSION
    || input.claim_projection_schema_version !== CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION
    || !isObject(input.claim_ledger_cursor)
    || !exactFields(input.claim_ledger_cursor, ['ledger_id', 'sequence', 'record_hash'])
    || !isObject(input.claim_replay_fingerprint)
    || !exactFields(input.claim_replay_fingerprint, [
      'fingerprint_version',
      'run_id',
      'range_start_sequence',
      'range_end_sequence',
      'event_registry_digest',
      'projection_digest',
      'final_digest',
    ])
  ) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_FRONTIER,
      'Claim resume frontier contains malformed version, cursor, or replay fields',
    );
  }
  const frontier = input as unknown as ClaimContinuityFrontier;
  assertNoDuplicateRefs(frontier.active_claim_refs);
  frontier.active_claim_refs.forEach((ref) => (
    validateIdentityRef(ref, ContinuityIdentityKinds.CLAIM)
  ));
  const { frontier_digest: ignored, ...core } = frontier;
  void ignored;
  if (continuityDigest(core as JsonObject) !== frontier.frontier_digest) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_FRONTIER,
      'Claim resume frontier digest does not match its canonical fields',
    );
  }
  return frontier;
}

/** Restore only after every base reference, cursor, fingerprint, and projection agrees. */
export async function restoreClaimContinuityFrontier(
  input: unknown,
  identityFrontier: RestoredContinuityFrontier,
  identityLedger: AppendOnlyLedger,
  identityEventRegistry: EventTypeRegistry,
  ledger: AppendOnlyLedger,
  eventRegistry: EventTypeRegistry,
): Promise<RestoredClaimContinuityFrontier> {
  const frontier = validateShape(input);
  const currentIdentityFrontier = await restoreContinuityFrontier(
    identityFrontier.frontier,
    identityLedger,
    identityEventRegistry,
  );
  if (
    frontier.continuity_identity_frontier_digest
      !== currentIdentityFrontier.frontier.frontier_digest
    || frontier.identity_projection_digest
      !== currentIdentityFrontier.fingerprint.descriptor.projection_digest
  ) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.STALE_FRONTIER,
      'Claim frontier is bound to another or stale identity frontier',
    );
  }
  const head = await ledger.getVerifiedHead();
  if (
    head.ledgerId !== frontier.claim_ledger_cursor.ledger_id
    || head.sequence !== frontier.claim_ledger_cursor.sequence
    || head.recordHash !== frontier.claim_ledger_cursor.record_hash
    || frontier.claim_replay_fingerprint.range_end_sequence !== head.sequence
  ) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.STALE_FRONTIER,
      'Claim frontier cursor is missing, stale, or bound to another ledger',
    );
  }
  const fingerprint = await deriveClaimContinuityReplayFingerprint(
    ledger,
    eventRegistry,
    frontier.claim_replay_fingerprint.run_id,
    currentIdentityFrontier.state,
    currentIdentityFrontier.fingerprint.descriptor.projection_digest,
  );
  const descriptor = fingerprint.descriptor;
  if (
    descriptor.fingerprint_version !== frontier.claim_replay_fingerprint.fingerprint_version
    || descriptor.range_start_sequence !== frontier.claim_replay_fingerprint.range_start_sequence
    || descriptor.range_end_sequence !== frontier.claim_replay_fingerprint.range_end_sequence
    || descriptor.envelope_registry_digest
      !== frontier.claim_replay_fingerprint.event_registry_digest
    || descriptor.projection_digest !== frontier.claim_replay_fingerprint.projection_digest
    || descriptor.final_digest !== frontier.claim_replay_fingerprint.final_digest
    || descriptor.projection_digest !== frontier.claim_projection_digest
  ) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.REPLAY_MISMATCH,
      'Claim frontier replay fingerprint does not match verified reconstruction',
    );
  }
  const state = fingerprint.projection.state;
  for (const ref of frontier.active_claim_refs) {
    requireRegisteredIdentity(
      currentIdentityFrontier.state,
      ref,
      ContinuityIdentityKinds.CLAIM,
    );
    const record = state.records[ref.id];
    if (!record || record.lifecycle !== 'active') {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.INVALID_FRONTIER,
        'Active claim reference is missing or no longer active',
        { claimId: ref.id },
      );
    }
  }
  if (
    !sameStrings(refIds(frontier.active_claim_refs), refIds(activeRefs(state)))
    || !sameStrings(
      refIds(frontier.active_claim_refs),
      refIds(currentIdentityFrontier.frontier.active_claim_refs),
    )
    || !sameStrings(frontier.unresolved_match_ids, state.unresolved_match_ids)
    || frontier.unresolved_match_ids.some((id) => (
      state.match_records[id]?.decision !== 'unresolved'
    ))
  ) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_FRONTIER,
      'Claim frontier reference sets are missing, ambiguous, or stale',
    );
  }
  if (sha256Bytes(canonicalBytes(state)) !== frontier.claim_projection_digest) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.REPLAY_MISMATCH,
      'Claim projection hash differs from the saved frontier',
    );
  }
  return Object.freeze({
    identityFrontier: currentIdentityFrontier.frontier,
    frontier,
    state,
  });
}
