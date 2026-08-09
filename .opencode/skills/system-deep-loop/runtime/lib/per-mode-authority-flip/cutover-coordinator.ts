// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip — Atomic Cutover Coordinator
// ───────────────────────────────────────────────────────────────────
//
// Ties the preflight, the transition authorization gateway, the
// authority-transition ledger event, and the mode-keyed authority registry
// into one per-mode transaction. This coordinator is never invoked against
// a real mode's registry root or a real ledger by this build — every call
// site in this package is a unit test supplying its own temporary root and
// fixture evidence. Wiring a live mode adapter to call this coordinator is
// a separate, explicitly out-of-scope, operator-gated step.

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { AuthorityRegistry } from './authority-registry.js';
import {
  appendAuthorityTransitionEvent,
  buildAuthorityTransitionEvent,
  buildAuthorityTransitionFacts,
  createAuthorityTransitionEventRegistry,
  prepareAuthorityTransitionEventWrite,
} from './ledger-event.js';
import { checkManifestOrder, deriveFlippedModes } from './manifest-order.js';
import { evaluateCutoverPreflight, rollbackAssetSetDigest } from './preflight.js';
import { AUTHORITY_FLIP_EVENT_TYPE, AuthorityFlipError } from './types.js';

import type { AuthorityPendingTransition } from './authority-registry.js';
import type {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import type { EventTypeRegistry, JsonObject } from '../event-envelope/index.js';
import type { AuthorityTransitionFacts, CutoverCertificateMode, CutoverDecision, CutoverRequest } from './types.js';

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Test-only crash-simulation seam, mirroring `MigrationCoordinatorFaultInjection`. */
export interface AuthorityFlipCoordinatorFaultInjection {
  readonly afterLedgerAppendBeforeCas?: () => void;
}

/**
 * Deployment-resolved identity a caller's request must match exactly. Unlike
 * the generic gateway's `ExpectedTransitionIdentity`, both fields are
 * mandatory here: this coordinator only ever authorizes the one irreversible
 * authority-transition event type, so a resolver that cannot pin an actor and
 * capability is treated the same as no resolver at all — deny, never proceed
 * on an unverified claim.
 */
export interface AuthorityFlipExpectedIdentity {
  readonly actorId: string;
  readonly capabilityId: string;
}

export interface AuthorityFlipCoordinatorOptions {
  readonly registry: AuthorityRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  /** Resolves and verifies the exact set of transition policies this coordinator may authorize under. */
  readonly policies: TransitionPolicyRegistry;
  /**
   * Mandatory, fail-closed identity binding for the authority-transition
   * event this coordinator exclusively handles. A resolver that throws,
   * resolves to `null`, or resolves to a value that does not exactly match
   * the request's own `actorId`/`capabilityId` denies before any
   * authorization or durable write is attempted. This is intentionally a
   * required constructor dependency — the coordinator cannot be built
   * without one — because leaving it optional (as the generic ledger
   * gateway's `identityResolver` is, for its many other event types) let a
   * live coordinator accept an arbitrary caller-asserted identity for this
   * specific irreversible transition.
   */
  readonly identityResolver: (
    context: Readonly<{ mode: CutoverCertificateMode; request: CutoverRequest }>,
  ) => AuthorityFlipExpectedIdentity | null | Promise<AuthorityFlipExpectedIdentity | null>;
  readonly now?: () => Date;
  readonly faultInjection?: AuthorityFlipCoordinatorFaultInjection;
}

/** Dark, unit-testable coordinator for the one forward authority-flip edge. */
export class AuthorityFlipCoordinator {
  readonly #registry: AuthorityRegistry;
  readonly #ledger: AppendOnlyLedger;
  readonly #gateway: TransitionAuthorizationGateway;
  readonly #policies: TransitionPolicyRegistry;
  readonly #identityResolver: AuthorityFlipCoordinatorOptions['identityResolver'];
  readonly #now: () => Date;
  readonly #faultInjection: AuthorityFlipCoordinatorFaultInjection;
  readonly #eventRegistry: EventTypeRegistry;

  public constructor(options: AuthorityFlipCoordinatorOptions) {
    this.#registry = options.registry;
    this.#ledger = options.ledger;
    this.#gateway = options.gateway;
    this.#policies = options.policies;
    this.#identityResolver = options.identityResolver;
    this.#now = options.now ?? (() => new Date());
    this.#faultInjection = options.faultInjection ?? {};
    this.#eventRegistry = createAuthorityTransitionEventRegistry();
  }

  public async requestCutover(request: CutoverRequest): Promise<CutoverDecision> {
    if (request.requestedModes.length !== 1) {
      return Object.freeze({ disposition: 'denied', reasonCode: 'MULTI_MODE_REQUEST_REJECTED' });
    }

    return this.#registry.withTransactionLock(async () => {
      // The manifest-order predecessor set is derived fresh from the
      // durable registry on every call, inside the same lock the CAS
      // itself runs under — a caller-supplied `alreadyFlippedModes` claim
      // is never trusted, so a forged predecessor set cannot admit an
      // out-of-order flip.
      const flippedModes = deriveFlippedModes(this.#registry);
      const orderCheck = checkManifestOrder(request.requestedModes, flippedModes);
      if (orderCheck.verdict === 'denied') {
        return Object.freeze({ disposition: 'denied', reasonCode: orderCheck.reasonCode });
      }
      const [mode] = request.requestedModes;
      if (mode !== request.preflight.mode) {
        return Object.freeze({ disposition: 'denied', reasonCode: 'WRONG_MODE_BINDING' });
      }

      // Mandatory, fail-closed identity binding for this event type only —
      // never trust the request's own actorId/capabilityId claim without an
      // independent deployment-resolved match.
      const identityDenial = await this.#requireVerifiedIdentity(mode, request);
      if (identityDenial) return identityDenial;

      // The request's own policy tuple must be the exact tuple that
      // approved the cutover certificate it is presenting — otherwise a
      // certificate approved under one policy could authorize the actual
      // ledger append under a different, more permissive one.
      const policyDenial = this.#requireCertificateMatchingPolicy(request);
      if (policyDenial) return policyDenial;

      // Deterministically finish (or abort) any transition a previous
      // attempt prepared but never confirmed — a crash between the ledger
      // append and the registry publish never leaves those two facts split
      // for longer than the next call to this coordinator.
      await this.#reconcilePendingTransition(mode);

      const preflight = evaluateCutoverPreflight({ ...request.preflight, alreadyFlippedModes: flippedModes });
      if (preflight.verdict !== 'ready') {
        return Object.freeze({ disposition: 'denied', reasonCode: preflight.reasonCode });
      }

      const current = this.#registry.read(mode);
      const expectedEpoch = request.preflight.expectedAuthorityEpoch;
      const facts = buildAuthorityTransitionFacts({
        mode,
        fromAuthorityEpoch: expectedEpoch,
        candidateSha: request.preflight.cutover.certificate.facts.candidateSha,
        policyId: request.policyId,
        policyVersion: request.policyVersion,
        policyDigest: request.policyDigest,
        certificate: request.preflight.cutover.certificate,
        classificationManifestDigest: preflight.classificationManifestDigest,
        migrationHandoffDigest: request.preflight.migration.handoff.finalDigest,
        rollbackAssetSetDigest: rollbackAssetSetDigest(request.preflight.rollbackAssetDigests),
        actorId: request.actorId,
        requestDigest: digest({ requestId: request.requestId, mode, expectedEpoch }),
        decidedAt: request.decidedAt,
      });

      if (current.state !== 'cutover_ready' || current.epoch !== expectedEpoch) {
        const alreadyFlipped = current.state === 'new_authoritative_reversible'
          && current.epoch === expectedEpoch + 1
          && current.lastTransitionDigest === facts.transitionDigest;
        if (!alreadyFlipped) {
          return Object.freeze({ disposition: 'denied', reasonCode: 'STALE_AUTHORITY_EPOCH' });
        }
        // The registry already reflects this exact transition — a prior
        // attempt completed the ledger append and the CAS both. Resume
        // idempotently without re-authorizing or re-appending.
        return Object.freeze({
          disposition: 'flipped',
          record: current,
          transitionEvent: buildAuthorityTransitionEvent(facts),
          resumed: true,
        });
      }

      const existingEvents = await this.#ledger.readVerifiedEvents();
      const alreadyAppended = existingEvents.some((entry) => {
        const payload = entry.event.effective.envelope.payload;
        if (
          entry.event.effective.envelope.event_type !== AUTHORITY_FLIP_EVENT_TYPE
          || !isRecord(payload)
          || !isRecord(payload.transitionFacts)
        ) return false;
        return payload.transitionFacts.transitionDigest === facts.transitionDigest;
      });

      const casInput = {
        mode,
        expectedState: 'cutover_ready' as const,
        expectedEpoch,
        nextSelectedWriter: 'dark' as const,
        candidateSha: facts.candidateSha,
        policyVersion: request.policyVersion,
        cutoverCertificateDigest: facts.cutoverCertificateDigest,
        lastTransitionDigest: facts.transitionDigest,
        at: this.#now().toISOString(),
      };

      if (!alreadyAppended) {
        const priorHead = await this.#ledger.getVerifiedHead();
        const transitionEvent = buildAuthorityTransitionEvent(facts);
        const preparedEvent = prepareAuthorityTransitionEventWrite(transitionEvent, {
          eventId: `authority-flip-${mode}-${facts.toAuthorityEpoch}`,
          streamId: `${mode}-authority-flip`,
          streamSequence: 1,
          occurredAt: request.decidedAt,
          recordedAt: request.decidedAt,
          producer: { name: 'per-mode-authority-flip', version: '1' },
          correlationId: request.correlationId,
          causationId: null,
          idempotencyKey: `authority-flip:${mode}:${facts.fromAuthorityEpoch}:${facts.toAuthorityEpoch}`,
        }, this.#eventRegistry);

        let authorization;
        try {
          authorization = await this.#gateway.authorize({
            requestId: request.requestId,
            mode,
            event: preparedEvent,
            priorHead,
            priorStateVersion: `authority-flip@${facts.fromAuthorityEpoch}`,
            priorStateFingerprint: digest({ mode, epoch: facts.fromAuthorityEpoch }),
            actorId: request.actorId,
            capabilityId: request.capabilityId,
            authorityEpoch: facts.fromAuthorityEpoch,
            policy: {
              policyId: request.policyId,
              policyVersion: request.policyVersion,
              policyDigest: request.policyDigest,
            },
            evidenceDigest: facts.transitionDigest,
          });
        } catch {
          return Object.freeze({ disposition: 'denied', reasonCode: 'GATEWAY_FAILURE' });
        }
        if (authorization.verdict !== 'allow') {
          return Object.freeze({
            disposition: 'denied',
            reasonCode: authorization.reasonCode === 'gateway_failure' ? 'GATEWAY_FAILURE' : 'AUTHORIZATION_DENIED',
          });
        }

        // Durably record the exact CAS this event authorizes before the
        // event itself becomes durable, so a crash immediately after the
        // append below can still be completed (or, if the append never
        // actually lands, cleanly aborted) from disk alone.
        this.#registry.preparePendingTransition(casInput, this.#now().toISOString());

        try {
          await appendAuthorityTransitionEvent(this.#ledger, preparedEvent, authorization.proof);
        } catch {
          this.#registry.clearPendingTransition(mode);
          return Object.freeze({ disposition: 'denied', reasonCode: 'LEDGER_APPEND_FAILED' });
        }

        if (this.#faultInjection.afterLedgerAppendBeforeCas) {
          this.#faultInjection.afterLedgerAppendBeforeCas();
        }
      }

      let casResult;
      try {
        casResult = this.#registry.compareAndSwap(casInput);
      } catch {
        return Object.freeze({ disposition: 'denied', reasonCode: 'CAS_CONFLICT' });
      }
      this.#registry.clearPendingTransition(mode);

      return Object.freeze({
        disposition: 'flipped',
        record: casResult.record,
        transitionEvent: buildAuthorityTransitionEvent(facts),
        resumed: casResult.resumed,
      });
    });
  }

  /**
   * Resolve the deployment's expected identity for this exact request and
   * deny unless it is present and matches both fields exactly. A throwing
   * resolver, a `null` resolution, or a resolution missing either field is
   * treated identically to no resolver at all: fail closed.
   */
  async #requireVerifiedIdentity(
    mode: CutoverCertificateMode,
    request: CutoverRequest,
  ): Promise<CutoverDecision | null> {
    let expected: AuthorityFlipExpectedIdentity | null;
    try {
      expected = await this.#identityResolver({ mode, request });
    } catch {
      return Object.freeze({ disposition: 'denied', reasonCode: 'IDENTITY_UNVERIFIED' });
    }
    if (
      !isRecord(expected)
      || typeof expected.actorId !== 'string' || expected.actorId.length === 0
      || typeof expected.capabilityId !== 'string' || expected.capabilityId.length === 0
      || expected.actorId !== request.actorId
      || expected.capabilityId !== request.capabilityId
    ) {
      return Object.freeze({ disposition: 'denied', reasonCode: 'IDENTITY_UNVERIFIED' });
    }
    return null;
  }

  /**
   * Require the request's own policy tuple to exactly equal the cutover
   * certificate's approving-policy tuple, with both resolved through the
   * same pinned policy registry — a raw string match alone would not prove
   * either tuple is a genuinely registered policy.
   */
  #requireCertificateMatchingPolicy(request: CutoverRequest): CutoverDecision | null {
    try {
      const evidence = request.preflight.cutover.certificate.facts.evidence;
      if (
        request.policyId !== evidence.approvingPolicyId
        || request.policyVersion !== evidence.approvingPolicyVersion
        || request.policyDigest !== evidence.approvingPolicyDigest
      ) {
        return Object.freeze({ disposition: 'denied', reasonCode: 'POLICY_MISMATCH' });
      }
      const resolved = this.#policies.resolve(request.policyId, request.policyVersion);
      if (resolved.digest !== request.policyDigest) {
        return Object.freeze({ disposition: 'denied', reasonCode: 'POLICY_MISMATCH' });
      }
      return null;
    } catch {
      return Object.freeze({ disposition: 'denied', reasonCode: 'POLICY_MISMATCH' });
    }
  }

  /**
   * Deterministically complete or abort a transition a previous attempt
   * prepared but never confirmed. Called at the start of every
   * `requestCutover`, inside the transaction lock, so this is also the
   * startup-reconciliation path for a freshly constructed coordinator that
   * never saw the original request. The marker alone is never trusted as
   * authority: completion only happens once the ledger is independently
   * confirmed to already hold the exact prepared event.
   */
  async #reconcilePendingTransition(mode: CutoverCertificateMode): Promise<void> {
    const pending: AuthorityPendingTransition | null = this.#registry.readPendingTransition(mode);
    if (!pending) return;

    const current = this.#registry.read(mode);
    const targetEpoch = pending.expectedEpoch + 1;
    if (
      current.state === 'new_authoritative_reversible'
      && current.epoch === targetEpoch
      && current.lastTransitionDigest === pending.lastTransitionDigest
    ) {
      // The registry publish already completed; only the marker survived.
      this.#registry.clearPendingTransition(mode);
      return;
    }

    const existingEvents = await this.#ledger.readVerifiedEvents();
    const ledgerHasEvent = existingEvents.some((entry) => {
      const payload = entry.event.effective.envelope.payload;
      if (
        entry.event.effective.envelope.event_type !== AUTHORITY_FLIP_EVENT_TYPE
        || !isRecord(payload)
        || !isRecord(payload.transitionFacts)
      ) return false;
      return payload.transitionFacts.transitionDigest === pending.lastTransitionDigest;
    });

    if (!ledgerHasEvent) {
      // Never became durable in the ledger — nothing to complete. The
      // registry is still at its pre-transition state, so clearing the
      // marker is a clean abort, not a lost transition.
      this.#registry.clearPendingTransition(mode);
      return;
    }

    if (current.state !== pending.expectedState || current.epoch !== pending.expectedEpoch) {
      // The ledger durably recorded this transition, but the registry is in
      // neither its expected pre-state nor its expected post-state. This is
      // a genuine split between two durable facts that cannot be resolved
      // by guessing — fail loud instead of silently forcing a CAS.
      throw new AuthorityFlipError(
        'CAS_CONFLICT',
        'A ledger-committed authority transition could not be reconciled against durable registry state',
        {
          mode,
          expectedState: pending.expectedState,
          expectedEpoch: pending.expectedEpoch,
          actualState: current.state,
          actualEpoch: current.epoch,
        },
      );
    }

    this.#registry.compareAndSwap({ ...pending, at: this.#now().toISOString() });
    this.#registry.clearPendingTransition(mode);
  }
}

export type { AuthorityTransitionFacts };
