// ───────────────────────────────────────────────────────────────────
// MODULE: Mode Append Gateway
// ───────────────────────────────────────────────────────────────────
//
// Provides the code-level write path for deep-loop mode state. Agents no
// longer append directly to JSONL files; they go through this gateway, which
// validates, authorizes, fences, and projects each event.
//
// The gateway composes existing substrate: cutover binding, ledger schema
// validation, transition authorization, fenced append, and legacy projection.
// It does not reimplement any of these concerns.

import { resolve } from 'node:path';

import {
  AppendOnlyLedger,
  AuthorizationReasonCodes,
  AuthorizationVerdicts,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  TypedReducerRegistry,
} from '../authorized-ledger/index.js';
import {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
  appendAuthorizedThroughFence,
} from '../locks-and-fencing/index.js';
import { resolveCutoverBinding } from '../cutover-binding/index.js';
import {
  LEGACY_PROJECTION_MANIFEST,
  LegacyProjectionEngine,
  createDeepResearchProjectionContract,
  foldLegacyProjection,
  requireProjectableManifestEntry,
} from '../legacy-projections/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
} from '../replay-fingerprint/index.js';
import {
  createDeepResearchEventRegistry,
} from '../deep-research-ledger-schema/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';

import type {
  DurableAppendReceipt,
  GatewayAllowProof,
  LedgerHead,
} from '../authorized-ledger/index.js';
import type { EventReadResult, EventTypeRegistry, EventWritePreflight, JsonObject } from '../event-envelope/index.js';
import type {
  LegacyProjectionContract,
  LegacyProjectionRefreshBoundary,
} from '../legacy-projections/index.js';
import type { CutoverBindingEnvironment, ResolvedCutoverBinding } from '../cutover-binding/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export interface AppendModeEventOptions {
  /** Mode whose ledger receives the event (e.g., 'deep-research', 'deep-review'). */
  readonly mode: string;
  /** Directory containing the mode's spec folder and ledger storage. */
  readonly runDirectory: string;
  /** Event record prepared by the mode's ledger schema. */
  readonly eventRecord: EventWritePreflight;
  /** Current authority snapshot for the mode. */
  readonly authority: { state: string; epoch: number };
  /** Transition policy to evaluate against. */
  readonly policy: {
    readonly policyId: string;
    readonly policyVersion: number;
    readonly policyDigest: string;
  };
  /** Policy registry for authorization evaluation. */
  readonly policyRegistry: TransitionPolicyRegistry;
  /** Authorization gateway instance. */
  readonly authorizationGateway: TransitionAuthorizationGateway;
  /** Ledger instance for the mode. */
  readonly ledger: AppendOnlyLedger;
  /** Optional event type registry for replay fingerprint derivation. */
  readonly eventRegistry?: EventTypeRegistry;
  /** Optional override for the projection refresh boundary. */
  readonly projectionRefreshBoundary?: LegacyProjectionRefreshBoundary;
  /** Optional projection contract for executing the projection refresh. */
  readonly projectionContract?: LegacyProjectionContract<JsonObject>;
  /** Optional projection engine instance. */
  readonly projectionEngine?: LegacyProjectionEngine;
  /** Optional pre-resolved binding (for tests, bypasses resolveCutoverBinding). */
  readonly binding?: ResolvedCutoverBinding;
  /** Optional override for the cutover binding environment (for tests). */
  readonly bindingEnvironment?: CutoverBindingEnvironment;
  /** Seam for tests; production reads the real environment. */
  readonly now?: () => Date;
}

export interface ModeAppendReceipt extends DurableAppendReceipt {
  readonly ledgerId: string;
  readonly eventId: string;
  readonly eventType: string;
  readonly eventVersion: number;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly committedAt: string;
}

export interface AppendModeEventResult {
  readonly ok: true;
  readonly receipt: ModeAppendReceipt;
  readonly projectionRefreshed: boolean;
  readonly projectionError: string | null;
}

export interface AppendModeEventError {
  readonly ok: false;
  readonly phase: 'binding' | 'envelope' | 'authorization' | 'append' | 'projection';
  readonly reason: string;
  readonly code: string;
}

export type AppendModeEventOutcome = AppendModeEventResult | AppendModeEventError;

// ───────────────────────────────────────────────────────────────────
// 2. ERROR CODES
// ───────────────────────────────────────────────────────────────────

export const ModeAppendGatewayErrorCodes = Object.freeze({
  /** Cutover binding could not resolve actor, capability, or commit. */
  BINDING_FAILED: 'BINDING_FAILED',
  /** Event record does not match the mode's ledger schema. */
  ENVELOPE_INVALID: 'ENVELOPE_INVALID',
  /** Transition authorization denied the request. */
  AUTHORIZATION_DENIED: 'AUTHORIZATION_DENIED',
  /** Fenced append failed (head conflict, fence error, or storage error). */
  APPEND_FAILED: 'APPEND_FAILED',
  /** Projection refresh failed after the append was durable. */
  PROJECTION_FAILED: 'PROJECTION_FAILED',
} as const);

export type ModeAppendGatewayErrorCode =
  typeof ModeAppendGatewayErrorCodes[keyof typeof ModeAppendGatewayErrorCodes];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function resolveModeSurfaceId(mode: string): string {
  if (mode === 'deep-research' || mode === 'research') return 'research-state';
  if (mode === 'deep-review' || mode === 'review') return 'review-state';
  if (mode === 'deep-alignment' || mode === 'alignment') return 'alignment-state-deltas';
  if (mode === 'deep-ai-council' || mode === 'ai-council') return 'council-config-state';
  if (mode === 'deep-improvement' || mode === 'improvement') return 'improvement-ledgers';
  const directMatch = LEGACY_PROJECTION_MANIFEST.find((entry) => (
    entry.disposition === 'project' && (
      entry.surfaceId === mode
      || entry.surfaceId === `${mode}-state`
      || entry.surfaceId === `${mode.replace(/^deep-/, '')}-state`
      || entry.legacyWriter === mode
      || entry.legacyWriter === `deep-${mode}`
    )
  ));
  if (directMatch) return directMatch.surfaceId;
  return mode.startsWith('deep-') ? `${mode.slice(5)}-state` : `${mode}-state`;
}

function resolveDefaultProjectionContract(
  mode: string,
  ledgerId: string,
): LegacyProjectionContract<JsonObject> | null {
  if (mode === 'deep-research' || mode === 'research') {
    return createDeepResearchProjectionContract({
      ledgerId,
      streamIds: Object.freeze([ledgerId]),
    }) as unknown as LegacyProjectionContract<JsonObject>;
  }
  return null;
}

function resolveModeEventRegistry(
  mode: string,
  providedRegistry?: EventTypeRegistry,
): EventTypeRegistry | null {
  if (providedRegistry) return providedRegistry;
  if (mode === 'deep-research' || mode === 'research') {
    return createDeepResearchEventRegistry();
  }
  return null;
}

// ───────────────────────────────────────────────────────────────────
// 4. IMPLEMENTATION
// ───────────────────────────────────────────────────────────────────

/**
 * Append a mode event through the validation, authorization, fencing,
 * and projection pipeline.
 *
 * The pipeline executes in this order:
 * 1. Bind: resolve actor, capability, and commit from the environment
 * 2. Envelope: validate event preflight structure
 * 3. Authorize: transition gateway evaluates policy and issues allow proof
 * 4. Append: fenced writer commits event to append-only ledger
 * 5. Project: refresh legacy projection at declared boundary
 */
export async function appendModeEvent(
  options: AppendModeEventOptions,
): Promise<AppendModeEventOutcome> {
  const now = options.now ?? (() => new Date());

  // Phase 1: Bind execution-time facts from the environment
  let binding: ResolvedCutoverBinding;
  try {
    binding = options.binding ?? resolveCutoverBinding({
      mode: options.mode,
      repositoryRoot: options.runDirectory,
      now,
      environment: options.bindingEnvironment,
    });
  } catch (error) {
    return {
      ok: false,
      phase: 'binding',
      reason: error instanceof Error ? error.message : String(error),
      code: ModeAppendGatewayErrorCodes.BINDING_FAILED,
    };
  }

  // Phase 2: Event Preflight / Envelope verification
  const event = options.eventRecord;

  // Resolve exact registered policy digest if available from policy registry
  let policy = options.policy;
  try {
    const resolvedPolicy = options.policyRegistry.resolve(
      options.policy.policyId,
      options.policy.policyVersion,
    );
    policy = {
      policyId: resolvedPolicy.policyId,
      policyVersion: resolvedPolicy.policyVersion,
      policyDigest: resolvedPolicy.digest,
    };
  } catch {
    // If not found in registry, retain caller-provided policy reference to fail closed
  }

  // Phase 3 & 4: Authorize and Append with bounded retry for concurrent writers
  const maxRetries = 10;
  let receipt: DurableAppendReceipt | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const priorHead = await options.ledger.getVerifiedHead();
    const evidenceDigest = event?.canonicalDigest || (
      event?.envelope?.payload
        ? sha256Bytes(canonicalBytes(event.envelope.payload))
        : '0'.repeat(64)
    );
    const priorStateVersion = event?.identity?.eventType
      ? `${event.identity.eventType}@${event.identity.eventVersion}`
      : `${options.mode}-state@1`;

    const requestId = `${options.mode}-authorize:${sha256Bytes(canonicalBytes({
      actorId: binding.actorId,
      capabilityId: binding.capabilityId,
      eventDigest: event?.canonicalDigest ?? '',
      priorHead,
    }))}`;

    const authRequest = {
      requestId,
      mode: options.mode,
      event,
      priorHead,
      priorStateVersion,
      priorStateFingerprint: priorHead.recordHash,
      actorId: binding.actorId,
      capabilityId: binding.capabilityId,
      authorityEpoch: options.authority.epoch,
      policy,
      evidenceDigest,
    };

    const authResult = await options.authorizationGateway.authorize(authRequest);
    if (authResult.verdict !== AuthorizationVerdicts.ALLOW || !authResult.proof) {
      if (authResult.reasonCode === AuthorizationReasonCodes.STALE_HEAD && attempt < maxRetries - 1) {
        continue;
      }
      return {
        ok: false,
        phase: 'authorization',
        reason: `Authorization denied: ${authResult.reasonCode}`,
        code: ModeAppendGatewayErrorCodes.AUTHORIZATION_DENIED,
      };
    }

    try {
      receipt = await appendAuthorizedThroughFence(
        options.ledger,
        event,
        authResult.proof,
      );
      break;
    } catch (error) {
      const isHeadConflict = error instanceof LocksAndFencingError
        && error.code === LocksAndFencingErrorCodes.HEAD_CONFLICT;
      if (isHeadConflict && attempt < maxRetries - 1) {
        continue;
      }
      return {
        ok: false,
        phase: 'append',
        reason: error instanceof Error ? error.message : String(error),
        code: ModeAppendGatewayErrorCodes.APPEND_FAILED,
      };
    }
  }

  if (!receipt) {
    return {
      ok: false,
      phase: 'append',
      reason: 'Append retry budget exhausted',
      code: ModeAppendGatewayErrorCodes.APPEND_FAILED,
    };
  }

  // Phase 5: Refresh the legacy projection
  let projectionRefreshed = false;
  let projectionError: string | null = null;

  try {
    const surfaceId = resolveModeSurfaceId(options.mode);
    const manifestEntry = requireProjectableManifestEntry(surfaceId);
    const refreshBoundary = options.projectionRefreshBoundary
      ?? manifestEntry.refreshBoundary;

    if (refreshBoundary !== null) {
      const contract = options.projectionContract
        ?? resolveDefaultProjectionContract(options.mode, options.ledger.ledgerId);

      if (!contract) {
        projectionRefreshed = false;
        projectionError = `No projection contract registered for mode ${options.mode}`;
      } else {
        const eventRegistry = resolveModeEventRegistry(options.mode, options.eventRegistry);
        if (!eventRegistry) {
          projectionRefreshed = false;
          projectionError = `No event registry registered for mode ${options.mode}`;
        } else if (eventRegistry.digest !== options.ledger.registryDigest) {
          projectionRefreshed = false;
          projectionError = `Event registry digest mismatch for mode ${options.mode}`;
        } else {
          const reducers = new TypedReducerRegistry<JsonObject>([
            ...Object.keys(contract.acceptedEventVersions).map((eventType) => ({
              eventType,
              reducerVersion: contract.reducerVersion,
              reduce: (state: JsonObject, eventReadResult: Readonly<EventReadResult>) => (
                contract.reduce(state, eventReadResult)
              ),
            })),
          ]);

          const components = new ReplayComponentRegistry<JsonObject>([
            {
              reducerId: contract.reducerId,
              reducerVersion: contract.reducerVersion,
              projectionSchemaVersion: contract.projectionVersion,
              requiredReplayInputKeys: Object.freeze([INITIAL_STATE_REPLAY_INPUT]),
              reducerRegistry: reducers,
            },
          ]);

          const head = await options.ledger.getVerifiedHead();
          const events = await options.ledger.readVerifiedEvents();

          const replayFingerprint = await deriveReplayFingerprint({
            ledger: options.ledger,
            eventRegistry,
            versionRegistry: createReplayFingerprintVersionRegistry(),
            componentRegistry: components,
            runId: `legacy-projection-${contract.artifactId}`,
            rangeStartSequence: contract.base.ledgerHead.sequence + 1,
            rangeEndSequence: head.sequence,
            replay: {
              reducerId: contract.reducerId,
              reducerVersion: contract.reducerVersion,
              projectionSchemaVersion: contract.projectionVersion,
              initialState: contract.base.state,
              replayInputDigests: {
                [INITIAL_STATE_REPLAY_INPUT]: sha256Bytes(canonicalBytes(contract.base.state)),
              },
            },
          });

          const folded = foldLegacyProjection(
            contract,
            events,
            head,
            replayFingerprint,
          );

          const engine = options.projectionEngine ?? new LegacyProjectionEngine({
            shadowRoot: options.runDirectory,
            protectedLegacyPaths: Object.freeze([
              resolve(options.runDirectory, '..', '.legacy-authority-protected'),
            ]),
            now,
          });

          const result = await engine.project({
            contract,
            ledger: options.ledger,
            replayFingerprint,
            expectedLegacyBytes: folded.bytes,
          });

          if (result.ok) {
            projectionRefreshed = true;
            projectionError = null;
          } else {
            projectionRefreshed = false;
            projectionError = result.error.message;
          }
        }
      }
    } else {
      projectionRefreshed = false;
      projectionError = `Surface ${surfaceId} has no declared refresh boundary`;
    }
  } catch (error) {
    projectionRefreshed = false;
    projectionError = error instanceof Error ? error.message : String(error);
  }

  const modeReceipt: ModeAppendReceipt = Object.freeze({
    ...receipt,
    ledgerId: receipt.ledger_id,
    eventId: receipt.event_id,
    eventType: receipt.event_type,
    eventVersion: receipt.event_version,
    streamId: receipt.stream_id,
    streamSequence: receipt.stream_sequence,
    committedAt: receipt.committed_at,
  });

  return {
    ok: true,
    receipt: modeReceipt,
    projectionRefreshed,
    projectionError,
  };
}
