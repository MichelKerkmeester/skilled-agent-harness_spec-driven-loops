// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Fingerprint Version Registry
// ───────────────────────────────────────────────────────────────────

import {
  FINGERPRINT_CANONICALIZATION_ALGORITHM,
  FINGERPRINT_HASH_ALGORITHM,
  hashReplayFingerprintBytes,
  serializeReplayFingerprintDescriptor,
} from './canonical-descriptor.js';
import {
  ReplayFingerprintError,
  ReplayFingerprintErrorCodes,
} from './replay-fingerprint-types.js';

import type {
  FingerprintVersionDefinition,
  ReplayFingerprintDescriptor,
} from './replay-fingerprint-types.js';

interface RegisteredFingerprintVersionDefinition extends FingerprintVersionDefinition {
  readonly implementationIdentity: string;
}

const PROBE_HASH_A = 'a'.repeat(64);
const PROBE_HASH_B = 'b'.repeat(64);
const PROBE_HASH_C = 'c'.repeat(64);

function probeDescriptor(
  definition: FingerprintVersionDefinition,
): ReplayFingerprintDescriptor {
  return {
    fingerprint_version: definition.fingerprintVersion,
    hash_algorithm: definition.hashAlgorithm,
    canonicalization_algorithm: definition.canonicalizationAlgorithm,
    ledger_id: 'probe-ledger',
    run_id: 'probe-run',
    range_start_sequence: 1,
    range_end_sequence: 2,
    event_count: 2,
    genesis_record_hash: PROBE_HASH_A,
    terminal_head_hash: PROBE_HASH_B,
    ordered_record_hashes: [PROBE_HASH_A, PROBE_HASH_B],
    stored_bytes_digest: PROBE_HASH_A,
    authorization_linkage_digest: PROBE_HASH_B,
    envelope_registry_digest: PROBE_HASH_C,
    observed_event_type_versions: ['deep-loop.probe.recorded@1'],
    upcaster_registry_digest: PROBE_HASH_A,
    ordered_chain_identities: ['sequence=1|hop=none'],
    effective_event_digest: PROBE_HASH_B,
    reducer_id: 'probe-reducer',
    reducer_version: '1',
    projection_schema_version: '1',
    replay_input_digests: {
      initial_state: PROBE_HASH_A,
      probe_config: PROBE_HASH_B,
    },
    projection_digest: PROBE_HASH_C,
    final_digest: PROBE_HASH_A,
  };
}

function equalBytes(left: Uint8Array, right: Uint8Array): boolean {
  return Buffer.compare(Buffer.from(left), Buffer.from(right)) === 0;
}

function probeFailure(message: string): ReplayFingerprintError {
  return new ReplayFingerprintError(
    ReplayFingerprintErrorCodes.INVALID_INPUT,
    'fingerprint_version',
    message,
    { stage: 'fingerprint-registry-probe' },
  );
}

function probeFingerprintImplementation(
  definition: FingerprintVersionDefinition,
): void {
  const descriptor = probeDescriptor(definition);
  let coreBytes: Uint8Array;
  let descriptorBytes: Uint8Array;
  try {
    coreBytes = definition.serializeDescriptor(descriptor, false);
    descriptorBytes = definition.serializeDescriptor(descriptor, true);
    if (
      coreBytes.byteLength === 0
      || descriptorBytes.byteLength === 0
      || !equalBytes(coreBytes, definition.serializeDescriptor(descriptor, false))
      || !equalBytes(descriptorBytes, definition.serializeDescriptor(descriptor, true))
      || equalBytes(coreBytes, descriptorBytes)
    ) {
      throw probeFailure('Fingerprint serializer failed its repeated-byte or final-field probe');
    }
  } catch (error: unknown) {
    if (error instanceof ReplayFingerprintError) throw error;
    throw probeFailure('Fingerprint serializer could not encode the registered probe descriptor');
  }

  const reordered = {
    ...descriptor,
    replay_input_digests: {
      probe_config: PROBE_HASH_B,
      initial_state: PROBE_HASH_A,
    },
  };
  if (
    !equalBytes(coreBytes, definition.serializeDescriptor(reordered, false))
    || !equalBytes(descriptorBytes, definition.serializeDescriptor(reordered, true))
  ) {
    throw probeFailure('Fingerprint serializer depends on replay-input map insertion order');
  }

  const coreMutations: ReadonlyArray<readonly [string, unknown]> = [
    ['fingerprint_version', definition.fingerprintVersion + 1],
    ['hash_algorithm', 'sha256-probe'],
    ['canonicalization_algorithm', definition.canonicalizationAlgorithm + '-probe'],
    ['ledger_id', 'probe-ledger-changed'],
    ['run_id', 'probe-run-changed'],
    ['range_start_sequence', 2],
    ['range_end_sequence', 3],
    ['event_count', 3],
    ['genesis_record_hash', PROBE_HASH_B],
    ['terminal_head_hash', PROBE_HASH_C],
    ['ordered_record_hashes', [PROBE_HASH_B, PROBE_HASH_A]],
    ['stored_bytes_digest', PROBE_HASH_B],
    ['authorization_linkage_digest', PROBE_HASH_C],
    ['envelope_registry_digest', PROBE_HASH_A],
    ['observed_event_type_versions', ['deep-loop.probe.recorded@2']],
    ['upcaster_registry_digest', PROBE_HASH_B],
    ['ordered_chain_identities', ['sequence=2|hop=none']],
    ['effective_event_digest', PROBE_HASH_C],
    ['reducer_id', 'probe-reducer-changed'],
    ['reducer_version', '2'],
    ['projection_schema_version', '2'],
    ['replay_input_digests', {
      initial_state: PROBE_HASH_A,
      probe_config: PROBE_HASH_C,
    }],
    ['projection_digest', PROBE_HASH_A],
  ];
  for (const [field, value] of coreMutations) {
    try {
      const mutated = { ...descriptor, [field]: value } as ReplayFingerprintDescriptor;
      if (equalBytes(coreBytes, definition.serializeDescriptor(mutated, false))) {
        throw probeFailure('Fingerprint serializer omits the core field: ' + field);
      }
    } catch (error: unknown) {
      if (error instanceof ReplayFingerprintError && error.stage === 'fingerprint-registry-probe') {
        throw error;
      }
    }
  }

  const changedFinal = { ...descriptor, final_digest: PROBE_HASH_B };
  if (
    !equalBytes(coreBytes, definition.serializeDescriptor(changedFinal, false))
    || equalBytes(descriptorBytes, definition.serializeDescriptor(changedFinal, true))
  ) {
    throw probeFailure('Fingerprint serializer does not isolate and commit the final digest correctly');
  }
}

function registerFingerprintImplementation(
  definition: FingerprintVersionDefinition,
): RegisteredFingerprintVersionDefinition {
  probeFingerprintImplementation(definition);
  const implementationIdentity = hashReplayFingerprintBytes(Buffer.from([
    String(definition.fingerprintVersion),
    definition.hashAlgorithm,
    definition.canonicalizationAlgorithm,
    Function.prototype.toString.call(definition.serializeDescriptor),
  ].join('\u0000'), 'utf8'));
  return Object.freeze({ ...definition, implementationIdentity });
}

// ───────────────────────────────────────────────────────────────────
// 1. REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Independent registry retaining every supported historical descriptor implementation. */
export class FingerprintVersionRegistry {
  public readonly currentVersion: number;
  readonly #definitions: ReadonlyMap<number, RegisteredFingerprintVersionDefinition>;

  public constructor(definitions: readonly FingerprintVersionDefinition[]) {
    if (!Array.isArray(definitions) || definitions.length === 0) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.INVALID_INPUT,
        'fingerprint_version',
        'Fingerprint registry requires at least one historical implementation',
        { stage: 'fingerprint-registry' },
      );
    }
    const registered = new Map<number, RegisteredFingerprintVersionDefinition>();
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
      registered.set(definition.fingerprintVersion, registerFingerprintImplementation(definition));
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
