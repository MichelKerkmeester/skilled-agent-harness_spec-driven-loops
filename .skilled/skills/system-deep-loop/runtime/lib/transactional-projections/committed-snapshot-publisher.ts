// ──────────────────────────────────
// MODULE: Committed Snapshot Publisher
// ──────────────────────────────────

import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';

import type { JsonValue } from '../event-envelope/index.js';
import type { TransactionalProjectionEngine } from './transactional-projection-engine.js';
import type {
  ProjectionDeliveryResult,
  ProjectionPublicationManifest,
  ProjectionSnapshot,
} from './transactional-projection-types.js';

export type ProjectionSnapshotSink = (
  manifest: Readonly<ProjectionPublicationManifest>,
) => void | Promise<void>;

function immutableManifest(snapshot: ProjectionSnapshot): ProjectionPublicationManifest {
  const core = {
    manifestSchemaVersion: 1 as const,
    generationId: snapshot.generationId,
    ledgerId: snapshot.ledgerId,
    bundleId: snapshot.bundleId,
    bundleVersion: snapshot.bundleVersion,
    cutoffSequence: snapshot.cutoffSequence,
    cutoffRecordHash: snapshot.cutoffRecordHash,
    canonicalProjectionHash: snapshot.canonicalProjectionHash,
    snapshot,
  };
  return Object.freeze({
    ...core,
    manifestDigest: sha256Bytes(canonicalBytes(core as unknown as JsonValue)),
  });
}

/** Delivers immutable committed manifests without access to canonical mutation APIs. */
export class CommittedSnapshotPublisher {
  readonly #engine: TransactionalProjectionEngine;

  public constructor(engine: TransactionalProjectionEngine) {
    this.#engine = engine;
  }

  public manifest(): ProjectionPublicationManifest {
    return immutableManifest(this.#engine.readSnapshot());
  }

  public async deliver(sink: ProjectionSnapshotSink): Promise<ProjectionDeliveryResult> {
    const manifest = this.manifest();
    try {
      await sink(manifest);
      return Object.freeze({
        status: 'delivered',
        manifestDigest: manifest.manifestDigest,
        errorName: null,
      });
    } catch (error: unknown) {
      return Object.freeze({
        status: 'delivery-failed',
        manifestDigest: manifest.manifestDigest,
        errorName: error instanceof Error ? error.name : 'UnknownError',
      });
    }
  }
}

/** Byte comparison helper for callers that persist delivery retry records elsewhere. */
export function samePublicationManifest(
  left: ProjectionPublicationManifest,
  right: ProjectionPublicationManifest,
): boolean {
  return canonicalJson(left) === canonicalJson(right);
}
