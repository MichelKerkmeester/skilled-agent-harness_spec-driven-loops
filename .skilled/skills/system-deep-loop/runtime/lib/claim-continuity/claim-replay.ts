// ───────────────────────────────────────────────────────────────────
// MODULE: Claim Continuity Replay Identity
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
} from '../replay-fingerprint/index.js';
import {
  CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
  CLAIM_CONTINUITY_REDUCER_ID,
  CLAIM_CONTINUITY_REDUCER_VERSION,
} from './claim-continuity-events.js';
import {
  claimContinuityInitialState,
  createClaimContinuityReducerRegistry,
} from './claim-reducer.js';
import {
  ClaimContinuityError,
  ClaimContinuityErrorCodes,
} from './claim-continuity-types.js';

import type { AppendOnlyLedger } from '../authorized-ledger/index.js';
import type { EventTypeRegistry, JsonValue } from '../event-envelope/index.js';
import type {
  ContinuityIdentityState,
} from '../deep-loop/continuity-identity/index.js';
import type {
  DerivedReplayFingerprint,
  ReplayComponentDefinition,
} from '../replay-fingerprint/index.js';
import type { ClaimContinuityState } from './claim-continuity-types.js';

export const CLAIM_IDENTITY_PROJECTION_REPLAY_INPUT = 'identity_projection';

function digest(value: JsonValue): string {
  return sha256Bytes(canonicalBytes(value));
}

/** Bind replay to the complete content-addressed identity projection. */
export function createClaimContinuityReplayComponentRegistry(
  identityState: Readonly<ContinuityIdentityState>,
): ReplayComponentRegistry<ClaimContinuityState> {
  const identityValue = identityState as JsonValue;
  const definition: ReplayComponentDefinition<ClaimContinuityState> = {
    reducerId: CLAIM_CONTINUITY_REDUCER_ID,
    reducerVersion: CLAIM_CONTINUITY_REDUCER_VERSION,
    projectionSchemaVersion: CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: [
      INITIAL_STATE_REPLAY_INPUT,
      CLAIM_IDENTITY_PROJECTION_REPLAY_INPUT,
    ],
    reducerRegistry: createClaimContinuityReducerRegistry(identityState),
    replayInputSources: {
      [CLAIM_IDENTITY_PROJECTION_REPLAY_INPUT]: {
        kind: 'content-addressed',
        value: identityValue,
      },
    },
    bindReplayInputs: (inputs) => createClaimContinuityReducerRegistry(
      inputs[CLAIM_IDENTITY_PROJECTION_REPLAY_INPUT] as unknown as ContinuityIdentityState,
    ),
  };
  return new ReplayComponentRegistry([definition]);
}

/** Derive replay identity from the complete verified claim prefix and identity state. */
export async function deriveClaimContinuityReplayFingerprint(
  ledger: AppendOnlyLedger,
  eventRegistry: EventTypeRegistry,
  runId: string,
  identityState: Readonly<ContinuityIdentityState>,
  identityProjectionDigest: string,
): Promise<DerivedReplayFingerprint<ClaimContinuityState>> {
  if (typeof runId !== 'string' || runId.trim() === '' || runId.length > 512) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_INPUT,
      'Claim replay run ID must be a non-empty bounded string',
    );
  }
  if (digest(identityState as JsonValue) !== identityProjectionDigest) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.REPLAY_MISMATCH,
      'Identity state does not match its declared projection digest',
    );
  }
  const head = await ledger.getVerifiedHead();
  if (head.sequence === 0) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_FRONTIER,
      'Claim replay fingerprint requires at least one verified event',
    );
  }
  const initialState = claimContinuityInitialState(identityProjectionDigest);
  return deriveReplayFingerprint({
    ledger,
    eventRegistry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: createClaimContinuityReplayComponentRegistry(identityState),
    runId,
    rangeStartSequence: 1,
    rangeEndSequence: head.sequence,
    replay: {
      reducerId: CLAIM_CONTINUITY_REDUCER_ID,
      reducerVersion: CLAIM_CONTINUITY_REDUCER_VERSION,
      projectionSchemaVersion: CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: {
        [INITIAL_STATE_REPLAY_INPUT]: digest(initialState),
        [CLAIM_IDENTITY_PROJECTION_REPLAY_INPUT]: identityProjectionDigest,
      },
    },
  });
}
