// ───────────────────────────────────────────────────────────────────
// MODULE: Fenced Legacy and Dark Shadow Adapter
// ───────────────────────────────────────────────────────────────────

import { FencedLeaseCoordinator } from './fenced-lease-coordinator.js';

import type { FencedLease, FencedMutationContext } from './locks-and-fencing-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. SHADOW CONTRACT
// ───────────────────────────────────────────────────────────────────

export type FencedShadowStatus = 'dark-recorded' | 'dark-failed';

export interface FencedShadowTelemetry {
  readonly status: FencedShadowStatus;
  readonly resourceDigest: string;
  readonly fenceToken: number;
  readonly correlationId: string;
  readonly errorCode: string | null;
  readonly observedAt: string;
}

export interface FencedShadowAdapterOptions {
  readonly now?: () => Date;
  readonly telemetryCapacity?: number;
}

/** Serialize legacy authority and dark observation under one fencing epoch. */
export class FencedShadowAdapter {
  readonly #coordinator: FencedLeaseCoordinator;
  readonly #now: () => Date;
  readonly #telemetryCapacity: number;
  readonly #telemetry: FencedShadowTelemetry[] = [];

  public constructor(
    coordinator: FencedLeaseCoordinator,
    options: FencedShadowAdapterOptions = {},
  ) {
    this.#coordinator = coordinator;
    this.#now = options.now ?? (() => new Date());
    this.#telemetryCapacity = options.telemetryCapacity ?? 256;
    if (!Number.isSafeInteger(this.#telemetryCapacity) || this.#telemetryCapacity < 1) {
      throw new TypeError('Shadow telemetry capacity must be a positive safe integer');
    }
  }

  /** Return the exact legacy result even when the dark observation fails. */
  public async run<TLegacy>(
    lease: FencedLease,
    legacyMutation: (context: FencedMutationContext) => TLegacy | Promise<TLegacy>,
    darkObservation: (
      legacyResult: TLegacy,
      context: FencedMutationContext,
    ) => unknown | Promise<unknown>,
  ): Promise<TLegacy> {
    return this.#coordinator.withFence(lease, async (context) => {
      const legacyResult = await legacyMutation(context);
      try {
        await darkObservation(legacyResult, context);
        this.#record(lease, 'dark-recorded', null);
      } catch (error: unknown) {
        const errorCode = error && typeof error === 'object' && 'code' in error
          ? String(error.code)
          : error instanceof Error
            ? error.name
            : 'UNEXPECTED_FAILURE';
        this.#record(lease, 'dark-failed', errorCode);
      }
      return legacyResult;
    });
  }

  /** Return copies so dark telemetry cannot influence authoritative control flow. */
  public readTelemetry(): readonly FencedShadowTelemetry[] {
    return Object.freeze(this.#telemetry.map((entry) => Object.freeze({ ...entry })));
  }

  #record(lease: FencedLease, status: FencedShadowStatus, errorCode: string | null): void {
    this.#telemetry.push(Object.freeze({
      status,
      resourceDigest: lease.resource.resourceDigest,
      fenceToken: lease.fenceToken,
      correlationId: lease.correlationId,
      errorCode,
      observedAt: this.#now().toISOString(),
    }));
    if (this.#telemetry.length > this.#telemetryCapacity) this.#telemetry.shift();
  }
}

