// ───────────────────────────────────────────────────────────────────
// MODULE: Dark Ledger Adapter
// ───────────────────────────────────────────────────────────────────

import { AppendOnlyLedger } from './append-only-ledger.js';
import { AuthorizedLedgerError } from './authorized-ledger-errors.js';
import { TransitionAuthorizationGateway } from './transition-authorization-gateway.js';

import type {
  AuthorizationReasonCode,
  DurableAppendReceipt,
  TransitionAuthorizationRequest,
} from './authorized-ledger-types.js';
import type { EventWritePreflight } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. LEGACY BOUNDARY INVENTORY
// ───────────────────────────────────────────────────────────────────

export const LEGACY_DARK_BOUNDARIES = Object.freeze([
  {
    boundaryId: 'research-state-jsonl',
    source: 'deep-research/scripts/reduce-state.cjs',
    legacyBehavior: 'JSONL events and reducer projections remain authoritative',
  },
  {
    boundaryId: 'review-state-jsonl',
    source: 'runtime/scripts/reduce-state.cjs',
    legacyBehavior: 'JSONL events and reducer projections remain authoritative',
  },
  {
    boundaryId: 'alignment-state-jsonl',
    source: 'runtime/scripts/reduce-alignment-state.cjs',
    legacyBehavior: 'JSONL events and reducer projections remain authoritative',
  },
  {
    boundaryId: 'improvement-state-jsonl',
    source: 'deep-improvement/scripts/shared/reduce-state.cjs',
    legacyBehavior: 'JSONL events and reducer projections remain authoritative',
  },
  {
    boundaryId: 'atomic-state-checkpoint',
    source: 'runtime/lib/deep-loop/atomic-state.ts',
    legacyBehavior: 'Atomic snapshot bytes and write result remain authoritative',
  },
  {
    boundaryId: 'jsonl-repair-consumer',
    source: 'runtime/lib/deep-loop/jsonl-repair.ts',
    legacyBehavior: 'Legacy tail-repair semantics remain authoritative for legacy files only',
  },
  {
    boundaryId: 'council-round-state',
    source: 'runtime/lib/council/round-state-jsonl.cjs',
    legacyBehavior: 'Council round JSONL and writer result remain authoritative',
  },
  {
    boundaryId: 'fanout-status-ledger',
    source: 'runtime/scripts/fanout-pool.cjs',
    legacyBehavior: 'Fan-out status lines and process outcome remain authoritative',
  },
  {
    boundaryId: 'fanout-wait-checkpoint',
    source: 'runtime/scripts/fanout-run.cjs',
    legacyBehavior: 'Wait checkpoint bytes and resume control flow remain authoritative',
  },
  {
    boundaryId: 'runtime-observability',
    source: 'runtime/lib/deep-loop/observability-events.cjs',
    legacyBehavior: 'Observability JSONL and emitter outcome remain authoritative',
  },
  {
    boundaryId: 'iteration-verification',
    source: 'runtime/scripts/verify-iteration.cjs',
    legacyBehavior: 'Verification output and exit status remain authoritative',
  },
] as const);

export type LegacyDarkBoundaryId = typeof LEGACY_DARK_BOUNDARIES[number]['boundaryId'];

// ───────────────────────────────────────────────────────────────────
// 2. TELEMETRY TYPES
// ───────────────────────────────────────────────────────────────────

export type DarkLedgerStatus = 'appended' | 'denied' | 'failed';

/** Bounded shadow evidence that excludes legacy values and event payloads. */
export interface DarkLedgerTelemetryEvent {
  readonly boundaryId: LegacyDarkBoundaryId;
  readonly status: DarkLedgerStatus;
  readonly eventId: string;
  readonly requestId: string;
  readonly decisionId: string | null;
  readonly reasonCode: AuthorizationReasonCode | null;
  readonly errorCode: string | null;
  readonly receipt: DurableAppendReceipt | null;
  readonly observedAt: string;
}

export interface DarkLedgerAdapterOptions {
  readonly now?: () => Date;
  readonly observe?: (event: Readonly<DarkLedgerTelemetryEvent>) => void;
  readonly telemetryCapacity?: number;
}

// ───────────────────────────────────────────────────────────────────
// 3. ADAPTER
// ───────────────────────────────────────────────────────────────────

/** Run typed authorization and append only after the legacy result is final. */
export class DarkLedgerAdapter {
  readonly #gateway: TransitionAuthorizationGateway;
  readonly #ledger: AppendOnlyLedger;
  readonly #now: () => Date;
  readonly #observe: ((event: Readonly<DarkLedgerTelemetryEvent>) => void) | null;
  readonly #telemetryCapacity: number;
  readonly #telemetry: DarkLedgerTelemetryEvent[] = [];

  public constructor(
    gateway: TransitionAuthorizationGateway,
    ledger: AppendOnlyLedger,
    options: DarkLedgerAdapterOptions = {},
  ) {
    this.#gateway = gateway;
    this.#ledger = ledger;
    this.#now = options.now ?? (() => new Date());
    this.#observe = options.observe ?? null;
    this.#telemetryCapacity = options.telemetryCapacity ?? 256;
    if (!Number.isSafeInteger(this.#telemetryCapacity) || this.#telemetryCapacity < 1) {
      throw new TypeError('Dark ledger telemetry capacity must be a positive safe integer');
    }
  }

  /** Attempt shadow persistence while returning the exact authoritative legacy value. */
  public async recordAfterLegacy<T>(
    boundaryId: LegacyDarkBoundaryId,
    legacyResult: T,
    event: EventWritePreflight,
    request: TransitionAuthorizationRequest,
  ): Promise<T> {
    try {
      const authorization = await this.#gateway.authorize(request);
      if (authorization.verdict === 'deny') {
        this.#record({
          boundaryId,
          status: 'denied',
          eventId: event.identity.eventId,
          requestId: request.requestId,
          decisionId: authorization.decision?.decision_id ?? null,
          reasonCode: authorization.reasonCode,
          errorCode: null,
          receipt: null,
        });
        return legacyResult;
      }

      const receipt = await this.#ledger.appendAuthorized(event, authorization.proof);
      this.#record({
        boundaryId,
        status: 'appended',
        eventId: event.identity.eventId,
        requestId: request.requestId,
        decisionId: authorization.decision.decision_id,
        reasonCode: null,
        errorCode: null,
        receipt,
      });
    } catch (error) {
      this.#record({
        boundaryId,
        status: 'failed',
        eventId: event.identity.eventId,
        requestId: request.requestId,
        decisionId: null,
        reasonCode: null,
        errorCode: error instanceof AuthorizedLedgerError ? error.code : 'UNEXPECTED_FAILURE',
        receipt: null,
      });
    }
    return legacyResult;
  }

  /** Return a copy so telemetry cannot become a control-flow mutation channel. */
  public readTelemetry(): readonly DarkLedgerTelemetryEvent[] {
    return Object.freeze(this.#telemetry.map((entry) => Object.freeze({ ...entry })));
  }

  #record(event: Omit<DarkLedgerTelemetryEvent, 'observedAt'>): void {
    const complete = Object.freeze({
      ...event,
      observedAt: this.#now().toISOString(),
    });
    this.#telemetry.push(complete);
    if (this.#telemetry.length > this.#telemetryCapacity) this.#telemetry.shift();
    try {
      this.#observe?.(complete);
    } catch {
      // The retained copy keeps adapter failure observable without changing legacy control flow.
    }
  }
}
