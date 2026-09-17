// ───────────────────────────────────────────────────────────────────
// MODULE: Fenced State Store
// ───────────────────────────────────────────────────────────────────

import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { readUtf8IfExists, writeCanonicalJsonAtomic } from './durable-file.js';
import { FencedLeaseCoordinator } from './fenced-lease-coordinator.js';
import {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
} from './locks-and-fencing-errors.js';
import { ProtectedResourceKinds } from './locks-and-fencing-types.js';
import { canonicalizeProtectedResource, validateOpaqueIdentity } from './protected-resource-registry.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  CanonicalProtectedResource,
  FencedLease,
  ProtectedResourceIdentity,
  ProtectedResourceKind,
  ReplayIdentity,
} from './locks-and-fencing-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. STATE CONTRACT
// ───────────────────────────────────────────────────────────────────

interface StoredFencedStateCore<TState extends JsonObject> {
  readonly schemaVersion: 1;
  readonly resource: CanonicalProtectedResource;
  readonly stateVersion: number;
  readonly continuityIdentity: string;
  readonly replayIdentity: ReplayIdentity | null;
  readonly fenceToken: number;
  readonly state: Readonly<TState>;
}

interface StoredFencedState<TState extends JsonObject> extends StoredFencedStateCore<TState> {
  readonly stateDigest: string;
}

export interface FencedStateReplaceRequest<TState extends JsonObject> {
  readonly lease: FencedLease;
  readonly expectedVersion: number;
  readonly continuityIdentity: string;
  readonly replayIdentity?: ReplayIdentity | null;
  readonly nextState: Readonly<TState>;
}

export interface FencedStateReceipt {
  readonly resourceDigest: string;
  readonly fenceToken: number;
  readonly priorVersion: number;
  readonly stateVersion: number;
  readonly stateDigest: string;
  readonly replayFingerprint: string | null;
}

export interface VerifiedFencedState<TState extends JsonObject> {
  readonly stateVersion: number;
  readonly continuityIdentity: string;
  readonly replayIdentity: ReplayIdentity | null;
  readonly fenceToken: number;
  readonly state: Readonly<TState>;
  readonly stateDigest: string;
}

const MUTABLE_RESOURCE_KINDS: ReadonlySet<ProtectedResourceKind> = new Set([
  ProtectedResourceKinds.COUNCIL_ROUND,
  ProtectedResourceKinds.FANOUT_STATUS,
  ProtectedResourceKinds.LINEAGE_STATE,
  ProtectedResourceKinds.MERGE_TARGET,
  ProtectedResourceKinds.PAUSE_RESUME,
  ProtectedResourceKinds.PROJECTION,
  ProtectedResourceKinds.WAIT_CHECKPOINT,
]);
const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;

function fencedStateDigest<TState extends JsonObject>(
  state: StoredFencedStateCore<TState>,
): string {
  return sha256Bytes(canonicalBytes(state as unknown as JsonObject));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

// ───────────────────────────────────────────────────────────────────
// 2. STORE
// ───────────────────────────────────────────────────────────────────

/** Versioned state store whose fence check and atomic replacement share one mutex. */
export class FencedStateStore {
  readonly #rootDirectory: string;
  readonly #coordinator: FencedLeaseCoordinator;

  public constructor(rootDirectory: string, coordinator: FencedLeaseCoordinator) {
    if (typeof rootDirectory !== 'string' || rootDirectory.trim() === '') {
      throw new TypeError('Fenced state store requires a rootDirectory');
    }
    this.#rootDirectory = resolve(rootDirectory, 'fenced-protected-state-v1');
    this.#coordinator = coordinator;
    mkdirSync(this.#rootDirectory, { recursive: true });
  }

  /** Replace state only after current fence, version, and continuity checks pass. */
  public async replace<TState extends JsonObject>(
    request: FencedStateReplaceRequest<TState>,
  ): Promise<FencedStateReceipt> {
    const resource = canonicalizeProtectedResource(request.lease.resource);
    if (!MUTABLE_RESOURCE_KINDS.has(resource.kind)) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.INVALID_RESOURCE,
        'mutation',
        'Resource kind does not support replace-style state mutation',
        { kind: resource.kind },
      );
    }
    if (!Number.isSafeInteger(request.expectedVersion) || request.expectedVersion < 0) {
      throw new TypeError('expectedVersion must be a non-negative safe integer');
    }
    const continuityIdentity = validateOpaqueIdentity(
      request.continuityIdentity,
      'continuityIdentity',
    );
    canonicalBytes(request.nextState);

    return this.#coordinator.withFence(request.lease, () => () => {
      const current = this.#readStored<TState>(resource);
      const priorVersion = current?.stateVersion ?? 0;
      if (priorVersion !== request.expectedVersion) {
        throw new LocksAndFencingError(
          LocksAndFencingErrorCodes.VERSION_CONFLICT,
          'mutation',
          'Protected state version changed before commit',
          {
            actualVersion: priorVersion,
            expectedVersion: request.expectedVersion,
            resourceDigest: resource.resourceDigest,
          },
        );
      }
      if (current && current.continuityIdentity !== continuityIdentity) {
        throw new LocksAndFencingError(
          LocksAndFencingErrorCodes.IDENTITY_CONFLICT,
          'mutation',
          'Protected state is bound to another continuity identity',
          { resourceDigest: resource.resourceDigest },
        );
      }
      const stateVersion = priorVersion + 1;
      const core: StoredFencedStateCore<TState> = {
        schemaVersion: 1,
        resource,
        stateVersion,
        continuityIdentity,
        replayIdentity: request.replayIdentity ?? null,
        fenceToken: request.lease.fenceToken,
        state: Object.freeze({ ...request.nextState }),
      };
      const stateDigest = fencedStateDigest(core);
      writeCanonicalJsonAtomic(
        this.#statePath(resource),
        { ...core, stateDigest } as unknown as JsonObject,
      );
      return Object.freeze({
        resourceDigest: resource.resourceDigest,
        fenceToken: request.lease.fenceToken,
        priorVersion,
        stateVersion,
        stateDigest,
        replayFingerprint: request.replayIdentity?.finalDigest ?? null,
      });
    });
  }

  /** Read only after state bytes and their resource binding verify. */
  public readVerified<TState extends JsonObject>(
    resourceInput: ProtectedResourceIdentity,
  ): VerifiedFencedState<TState> | null {
    const resource = canonicalizeProtectedResource(resourceInput);
    const stored = this.#readStored<TState>(resource);
    if (!stored) return null;
    return Object.freeze({
      stateVersion: stored.stateVersion,
      continuityIdentity: stored.continuityIdentity,
      replayIdentity: stored.replayIdentity,
      fenceToken: stored.fenceToken,
      state: stored.state,
      stateDigest: stored.stateDigest,
    });
  }

  #statePath(resource: CanonicalProtectedResource): string {
    return join(this.#rootDirectory, `${resource.resourceDigest}.json`);
  }

  #readStored<TState extends JsonObject>(
    resource: CanonicalProtectedResource,
  ): StoredFencedState<TState> | null {
    const text = readUtf8IfExists(this.#statePath(resource));
    if (text === null) return null;
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.MALFORMED_STATE,
        'storage',
        'Protected state is not valid JSON',
        { resourceDigest: resource.resourceDigest },
      );
    }
    if (
      !isRecord(raw)
      || raw.schemaVersion !== 1
      || !Number.isSafeInteger(raw.stateVersion)
      || (raw.stateVersion as number) <= 0
      || !Number.isSafeInteger(raw.fenceToken)
      || (raw.fenceToken as number) <= 0
      || !isRecord(raw.state)
      || typeof raw.stateDigest !== 'string'
      || !DIGEST_PATTERN.test(raw.stateDigest)
    ) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.MALFORMED_STATE,
        'storage',
        'Protected state fields are malformed',
        { resourceDigest: resource.resourceDigest },
      );
    }
    const storedResource = canonicalizeProtectedResource(raw.resource);
    if (storedResource.resourceKey !== resource.resourceKey) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.MALFORMED_STATE,
        'storage',
        'Protected state resource binding does not match its storage key',
        { resourceDigest: resource.resourceDigest },
      );
    }
    const continuityIdentity = validateOpaqueIdentity(
      raw.continuityIdentity,
      'continuityIdentity',
    );
    const replayIdentity = this.#parseReplayIdentity(raw.replayIdentity);
    const core: StoredFencedStateCore<TState> = {
      schemaVersion: 1,
      resource,
      stateVersion: raw.stateVersion as number,
      continuityIdentity,
      replayIdentity,
      fenceToken: raw.fenceToken as number,
      state: Object.freeze({ ...raw.state }) as TState,
    };
    if (fencedStateDigest(core) !== raw.stateDigest) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.MALFORMED_STATE,
        'storage',
        'Protected state integrity digest does not match',
        { resourceDigest: resource.resourceDigest },
      );
    }
    return Object.freeze({ ...core, stateDigest: raw.stateDigest });
  }

  #parseReplayIdentity(raw: unknown): ReplayIdentity | null {
    if (raw === null) return null;
    if (
      !isRecord(raw)
      || !Number.isSafeInteger(raw.fingerprintVersion)
      || (raw.fingerprintVersion as number) <= 0
      || typeof raw.ledgerId !== 'string'
      || typeof raw.runId !== 'string'
      || !Number.isSafeInteger(raw.rangeStartSequence)
      || !Number.isSafeInteger(raw.rangeEndSequence)
      || typeof raw.finalDigest !== 'string'
      || !DIGEST_PATTERN.test(raw.finalDigest)
    ) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.MALFORMED_STATE,
        'storage',
        'Protected state replay identity is malformed',
        {},
      );
    }
    return Object.freeze({
      fingerprintVersion: raw.fingerprintVersion as number,
      ledgerId: validateOpaqueIdentity(raw.ledgerId, 'ledgerId'),
      runId: validateOpaqueIdentity(raw.runId, 'runId'),
      rangeStartSequence: raw.rangeStartSequence as number,
      rangeEndSequence: raw.rangeEndSequence as number,
      finalDigest: raw.finalDigest,
    });
  }
}
