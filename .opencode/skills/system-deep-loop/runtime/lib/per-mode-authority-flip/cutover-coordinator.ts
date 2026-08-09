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
import { checkManifestOrder } from './manifest-order.js';
import { evaluateCutoverPreflight, rollbackAssetSetDigest } from './preflight.js';
import { AUTHORITY_FLIP_EVENT_TYPE } from './types.js';

import type { AppendOnlyLedger, TransitionAuthorizationGateway } from '../authorized-ledger/index.js';
import type { EventTypeRegistry, JsonObject } from '../event-envelope/index.js';
import type { AuthorityTransitionFacts, CutoverDecision, CutoverRequest } from './types.js';

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

export interface AuthorityFlipCoordinatorOptions {
  readonly registry: AuthorityRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly now?: () => Date;
  readonly faultInjection?: AuthorityFlipCoordinatorFaultInjection;
}

/** Dark, unit-testable coordinator for the one forward authority-flip edge. */
export class AuthorityFlipCoordinator {
  readonly #registry: AuthorityRegistry;
  readonly #ledger: AppendOnlyLedger;
  readonly #gateway: TransitionAuthorizationGateway;
  readonly #now: () => Date;
  readonly #faultInjection: AuthorityFlipCoordinatorFaultInjection;
  readonly #eventRegistry: EventTypeRegistry;

  public constructor(options: AuthorityFlipCoordinatorOptions) {
    this.#registry = options.registry;
    this.#ledger = options.ledger;
    this.#gateway = options.gateway;
    this.#now = options.now ?? (() => new Date());
    this.#faultInjection = options.faultInjection ?? {};
    this.#eventRegistry = createAuthorityTransitionEventRegistry();
  }

  public async requestCutover(request: CutoverRequest): Promise<CutoverDecision> {
    const orderCheck = checkManifestOrder(request.requestedModes, request.preflight.alreadyFlippedModes);
    if (orderCheck.verdict === 'denied') {
      return Object.freeze({ disposition: 'denied', reasonCode: orderCheck.reasonCode });
    }
    const [mode] = request.requestedModes;
    if (mode !== request.preflight.mode) {
      return Object.freeze({ disposition: 'denied', reasonCode: 'WRONG_MODE_BINDING' });
    }

    return this.#registry.withTransactionLock(async () => {
      const preflight = evaluateCutoverPreflight(request.preflight);
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

        try {
          await appendAuthorityTransitionEvent(this.#ledger, preparedEvent, authorization.proof);
        } catch {
          return Object.freeze({ disposition: 'denied', reasonCode: 'LEDGER_APPEND_FAILED' });
        }

        if (this.#faultInjection.afterLedgerAppendBeforeCas) {
          this.#faultInjection.afterLedgerAppendBeforeCas();
        }
      }

      let casResult;
      try {
        casResult = this.#registry.compareAndSwap({
          mode,
          expectedState: 'cutover_ready',
          expectedEpoch,
          nextSelectedWriter: 'dark',
          candidateSha: facts.candidateSha,
          policyVersion: request.policyVersion,
          cutoverCertificateDigest: facts.cutoverCertificateDigest,
          lastTransitionDigest: facts.transitionDigest,
          at: this.#now().toISOString(),
        });
      } catch {
        return Object.freeze({ disposition: 'denied', reasonCode: 'CAS_CONFLICT' });
      }

      return Object.freeze({
        disposition: 'flipped',
        record: casResult.record,
        transitionEvent: buildAuthorityTransitionEvent(facts),
        resumed: casResult.resumed,
      });
    });
  }
}

export type { AuthorityTransitionFacts };
