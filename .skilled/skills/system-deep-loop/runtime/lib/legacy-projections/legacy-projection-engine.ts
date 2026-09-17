// ───────────────────────────────────────────────────────────────────
// MODULE: Legacy Projection Engine
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  AuthorizedLedgerError,
} from '../authorized-ledger/index.js';
import {
  LegacyProjectionError,
  LegacyProjectionErrorCodes,
} from './legacy-projection-errors.js';
import { foldLegacyProjection } from './legacy-projection-fold.js';
import { ShadowProjectionStore } from './shadow-projection-store.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  LegacyProjectionEngineOptions,
  LegacyProjectionObservation,
  LegacyProjectionRequest,
  LegacyProjectionResult,
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. ENGINE
// ───────────────────────────────────────────────────────────────────

/** Fold verified ledger events into disposable legacy bytes without acquiring authority. */
export class LegacyProjectionEngine {
  readonly #store: ShadowProjectionStore;
  readonly #now: () => Date;
  readonly #observe: ((observation: Readonly<LegacyProjectionObservation>) => void) | null;

  public constructor(options: LegacyProjectionEngineOptions) {
    this.#store = new ShadowProjectionStore(options);
    this.#now = options.now ?? (() => new Date());
    this.#observe = options.observe ?? null;
  }

  /** Execute one oracle-bound refresh and return failure evidence instead of partial authority. */
  public async project<TState extends JsonObject>(
    request: LegacyProjectionRequest<TState>,
  ): Promise<LegacyProjectionResult> {
    const startedAt = this.#now().getTime();
    try {
      if (!(request.ledger instanceof AppendOnlyLedger)) {
        throw new LegacyProjectionError(
          LegacyProjectionErrorCodes.LEDGER_INVALID,
          'Projection source must be the verified authorized ledger implementation',
          {
            artifactId: request.contract.artifactId,
            projectionVersion: request.contract.projectionVersion,
            invariant: 'verified-authorized-ledger-source',
          },
        );
      }
      const events = await request.ledger.readVerifiedEvents();
      const head = await request.ledger.getVerifiedHead();
      const projection = foldLegacyProjection(
        request.contract,
        events,
        head,
        request.replayFingerprint,
      );
      const receipt = this.#store.publish(
        request.contract,
        projection,
        request.expectedLegacyBytes,
      );
      this.#emit({
        artifactId: request.contract.artifactId,
        status: receipt.publication === 'unchanged' ? 'unchanged' : 'published',
        ledgerSequence: receipt.ledgerHead.sequence,
        watermarkSequence: receipt.ledgerHead.sequence,
        lagEvents: 0,
        refreshDurationMs: Math.max(0, this.#now().getTime() - startedAt),
        projectionVersion: receipt.projectionVersion,
        code: null,
        invariant: null,
        observedAt: this.#now().toISOString(),
      });
      return Object.freeze({ ok: true, receipt });
    } catch (error: unknown) {
      const normalized = error instanceof LegacyProjectionError
        ? error
        : error instanceof AuthorizedLedgerError
          ? new LegacyProjectionError(
            LegacyProjectionErrorCodes.LEDGER_INVALID,
            'Authorized ledger verification rejected the projection prefix',
            {
              artifactId: request.contract.artifactId,
              projectionVersion: request.contract.projectionVersion,
              invariant: 'verified-authorized-ledger-prefix',
              details: { cause: error.code, phase: error.phase },
            },
          )
          : new LegacyProjectionError(
          LegacyProjectionErrorCodes.PUBLICATION_FAILED,
          'Legacy projection failed before a trusted receipt was available',
          {
            artifactId: request.contract.artifactId,
            projectionVersion: request.contract.projectionVersion,
            invariant: 'fail-closed-projection-boundary',
            details: { cause: error instanceof Error ? error.message.slice(0, 160) : String(error).slice(0, 160) },
          },
        );
      this.#emit({
        artifactId: normalized.artifactId,
        status: 'failed',
        ledgerSequence: normalized.ledgerSequence,
        watermarkSequence: null,
        lagEvents: null,
        refreshDurationMs: Math.max(0, this.#now().getTime() - startedAt),
        projectionVersion: normalized.projectionVersion ?? request.contract.projectionVersion,
        code: normalized.code,
        invariant: normalized.invariant,
        observedAt: this.#now().toISOString(),
      });
      return Object.freeze({ ok: false, error: normalized });
    }
  }

  #emit(observation: LegacyProjectionObservation): void {
    try {
      this.#observe?.(Object.freeze({ ...observation }));
    } catch {
      // Observation failures cannot turn a derived shadow projector into a control-flow authority.
    }
  }
}
