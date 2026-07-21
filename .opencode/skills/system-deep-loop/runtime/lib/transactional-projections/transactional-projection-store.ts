// ──────────────────────────────────
// MODULE: Transactional Projection Store
// ──────────────────────────────────

import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedStateStore,
  ProtectedResourceKinds,
} from '../locks-and-fencing/index.js';
import {
  TransactionalProjectionError,
  TransactionalProjectionErrorCodes,
} from './transactional-projection-errors.js';

import type { FencedLease, ProtectedResourceIdentity, ReplayIdentity } from '../locks-and-fencing/index.js';
import type {
  ProjectionStoreRead,
  ProjectionStoreState,
  TransactionalProjectionStoreOptions,
} from './transactional-projection-types.js';

function initialStoreState(ledgerId: string, bundleId: string): ProjectionStoreState {
  return Object.freeze({
    storeSchemaVersion: 1,
    ledgerId,
    bundleId,
    activeGenerationId: null,
    previousGenerationId: null,
    publicationOrder: [],
    stagedGenerationIds: [],
    generations: {},
  });
}

/** One fenced document is the transaction boundary for all projections and pointers. */
export class TransactionalProjectionStore {
  public readonly resource: ProtectedResourceIdentity;
  readonly #ledgerId: string;
  readonly #bundleId: string;
  readonly #continuityIdentity: string;
  readonly #store: FencedStateStore;

  public constructor(options: TransactionalProjectionStoreOptions, coordinator: FencedLeaseCoordinator) {
    if (!options.ledgerId || !options.bundleId || !(coordinator instanceof FencedLeaseCoordinator)) {
      throw new TypeError('Transactional projection store requires ledger, bundle, and fence coordinator');
    }
    this.#ledgerId = options.ledgerId;
    this.#bundleId = options.bundleId;
    this.#continuityIdentity = `projection:${options.ledgerId}:${options.bundleId}`;
    const resource = options.resource ?? Object.freeze({
      kind: ProtectedResourceKinds.PROJECTION,
      components: Object.freeze({ ledgerId: options.ledgerId, projectionId: options.bundleId }),
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    });
    if (
      resource.kind !== ProtectedResourceKinds.PROJECTION
      || resource.atomicityDomain !== AtomicityDomains.SINGLE_HOST_FILESYSTEM
      || resource.components.ledgerId !== options.ledgerId
      || resource.components.projectionId !== options.bundleId
    ) throw new TypeError('Projection resource must bind the exact ledger and bundle identities');
    this.resource = resource;
    this.#store = new FencedStateStore(options.rootDirectory, coordinator);
  }

  public read(): ProjectionStoreRead {
    const stored = this.#store.readVerified<ProjectionStoreState>(this.resource);
    if (!stored) {
      return Object.freeze({
        stateVersion: 0,
        replayIdentity: null,
        state: initialStoreState(this.#ledgerId, this.#bundleId),
      });
    }
    if (
      stored.state.storeSchemaVersion !== 1
      || stored.state.ledgerId !== this.#ledgerId
      || stored.state.bundleId !== this.#bundleId
      || !Array.isArray(stored.state.publicationOrder)
      || !Array.isArray(stored.state.stagedGenerationIds)
      || !stored.state.generations
      || Array.isArray(stored.state.generations)
      || typeof stored.state.generations !== 'object'
    ) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.GENERATION_INVALID,
        'generation',
        'Projection store root does not match its closed schema and identity binding',
      );
    }
    return Object.freeze({
      stateVersion: stored.stateVersion,
      replayIdentity: stored.replayIdentity,
      state: stored.state,
    });
  }

  public async replace(
    lease: FencedLease,
    expectedVersion: number,
    nextState: ProjectionStoreState,
    replayIdentity: ReplayIdentity | null,
  ): Promise<number> {
    const receipt = await this.#store.replace({
      lease,
      expectedVersion,
      continuityIdentity: this.#continuityIdentity,
      replayIdentity,
      nextState,
    });
    return receipt.stateVersion;
  }
}
