// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Fingerprint Version Registry
// ───────────────────────────────────────────────────────────────────

import {
  FINGERPRINT_CANONICALIZATION_ALGORITHM,
  FINGERPRINT_HASH_ALGORITHM,
  serializeReplayFingerprintDescriptor,
} from './canonical-descriptor.js';
import {
  ReplayFingerprintError,
  ReplayFingerprintErrorCodes,
} from './replay-fingerprint-types.js';

import type { FingerprintVersionDefinition } from './replay-fingerprint-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Independent registry retaining every supported historical descriptor implementation. */
export class FingerprintVersionRegistry {
  public readonly currentVersion: number;
  readonly #definitions: ReadonlyMap<number, FingerprintVersionDefinition>;

  public constructor(definitions: readonly FingerprintVersionDefinition[]) {
    if (!Array.isArray(definitions) || definitions.length === 0) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.INVALID_INPUT,
        'fingerprint_version',
        'Fingerprint registry requires at least one historical implementation',
        { stage: 'fingerprint-registry' },
      );
    }
    const registered = new Map<number, FingerprintVersionDefinition>();
    for (const definition of definitions) {
      if (
        !Number.isSafeInteger(definition.fingerprintVersion)
        || definition.fingerprintVersion <= 0
        || definition.hashAlgorithm !== FINGERPRINT_HASH_ALGORITHM
        || typeof definition.canonicalizationAlgorithm !== 'string'
        || definition.canonicalizationAlgorithm.length === 0
        || typeof definition.serializeDescriptor !== 'function'
        || registered.has(definition.fingerprintVersion)
      ) {
        throw new ReplayFingerprintError(
          ReplayFingerprintErrorCodes.INVALID_INPUT,
          'fingerprint_version',
          'Fingerprint versions require unique positive identities and registered algorithms',
          { stage: 'fingerprint-registry-entry' },
        );
      }
      registered.set(
        definition.fingerprintVersion,
        Object.freeze({ ...definition }),
      );
    }
    this.#definitions = registered;
    this.currentVersion = Math.max(...registered.keys());
    Object.freeze(this);
  }

  /** Resolve one exact historical version; envelope versions are never consulted. */
  public resolve(version: unknown): FingerprintVersionDefinition {
    if (!Number.isSafeInteger(version) || (version as number) <= 0) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.UNSUPPORTED_FINGERPRINT_VERSION,
        'fingerprint_version',
        'Fingerprint version is missing or is not a positive registered version',
        { stage: 'fingerprint-version' },
      );
    }
    const definition = this.#definitions.get(version as number);
    if (!definition) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.UNSUPPORTED_FINGERPRINT_VERSION,
        'fingerprint_version',
        'Fingerprint version has no registered historical implementation',
        { stage: 'fingerprint-version' },
      );
    }
    return definition;
  }

  /** Resolve the only version current writers may emit. */
  public current(): FingerprintVersionDefinition {
    return this.resolve(this.currentVersion);
  }

  /** Return registered versions in numeric order without callable implementations. */
  public inspect(): readonly number[] {
    return Object.freeze(Array.from(this.#definitions.keys()).sort((left, right) => left - right));
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. DEFAULT IMPLEMENTATION
// ───────────────────────────────────────────────────────────────────

/** Construct the runtime registry with its retained version-one implementation. */
export function createReplayFingerprintVersionRegistry(): FingerprintVersionRegistry {
  return new FingerprintVersionRegistry([{
    fingerprintVersion: 1,
    hashAlgorithm: FINGERPRINT_HASH_ALGORITHM,
    canonicalizationAlgorithm: FINGERPRINT_CANONICALIZATION_ALGORITHM,
    serializeDescriptor: serializeReplayFingerprintDescriptor,
  }]);
}
