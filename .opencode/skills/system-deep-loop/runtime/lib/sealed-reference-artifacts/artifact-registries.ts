// ───────────────────────────────────────────────────────────────────
// MODULE: Sealed Artifact Registries
// ───────────────────────────────────────────────────────────────────

import {
  MAX_CANONICAL_BYTES,
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  DEFAULT_ARTIFACT_CANONICALIZATION_VERSION,
  DEFAULT_ARTIFACT_DIGEST_ALGORITHM,
  DEFAULT_ARTIFACT_MEDIA_TYPE,
  InitialArtifactKinds,
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from './sealed-artifact-types.js';

import type { JsonValue } from '../event-envelope/index.js';
import type {
  ArtifactCanonicalizerDefinition,
  ArtifactDigestDefinition,
  CanonicalizedArtifact,
} from './sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

const IDENTITY_PATTERN = /^[a-z][a-z0-9]*(?:[._@-][a-z0-9]+)*$/;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function normalizedString(value: string): string {
  return value.replace(/\r\n?/g, '\n').normalize('NFC');
}

function normalizeJson(value: unknown, path = '$'): JsonValue {
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'string') return normalizedString(value);
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (Array.isArray(value)) {
    return value.map((entry, index) => normalizeJson(entry, `${path}[${index}]`));
  }
  if (!isPlainObject(value)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'canonicalization',
      'Artifact source must be bounded canonical JSON content',
      { path, valueType: typeof value },
    );
  }

  const normalized: Record<string, JsonValue> = Object.create(null);
  for (const [rawKey, entry] of Object.entries(value)) {
    const key = normalizedString(rawKey);
    if (Object.prototype.hasOwnProperty.call(normalized, key)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'canonicalization',
        'Unicode normalization produced an ambiguous object key',
        { path, key },
      );
    }
    normalized[key] = normalizeJson(entry, `${path}.${key}`);
  }
  return normalized;
}

function canonicalizeJson(input: unknown): Uint8Array {
  try {
    return Uint8Array.from(canonicalBytes(normalizeJson(input)));
  } catch (error: unknown) {
    if (error instanceof SealedArtifactError) throw error;
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'canonicalization',
      'Artifact source does not satisfy the bounded canonical JSON contract',
      { cause: error instanceof Error ? error.name : 'unknown' },
    );
  }
}

function canonicalizerKey(artifactKind: string, version: string): string {
  return `${artifactKind}\u0000${version}`;
}

function requireIdentity(value: string, field: string): string {
  if (!IDENTITY_PATTERN.test(value) || value.length > 128) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'canonicalization',
      'Registry identity is malformed or unbounded',
      { field },
    );
  }
  return value;
}

function requireBoundedString(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 256) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'canonicalization',
      'Registry field must be a bounded non-empty string',
      { field },
    );
  }
  return value;
}

// ───────────────────────────────────────────────────────────────────
// 2. CANONICALIZER REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Frozen kind-and-version registry for deterministic artifact bytes. */
export class ArtifactCanonicalizerRegistry {
  public readonly digest: string;
  readonly #definitions: ReadonlyMap<string, ArtifactCanonicalizerDefinition>;

  public constructor(definitions: readonly ArtifactCanonicalizerDefinition[]) {
    if (!Array.isArray(definitions) || definitions.length === 0) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'canonicalization',
        'Canonicalizer registry requires at least one definition',
      );
    }
    const registered = new Map<string, ArtifactCanonicalizerDefinition>();
    const inspection: Record<string, JsonValue>[] = [];
    for (const definition of definitions) {
      const artifactKind = requireIdentity(definition.artifactKind, 'artifactKind');
      const version = requireIdentity(
        definition.canonicalizationVersion,
        'canonicalizationVersion',
      );
      const mediaType = requireBoundedString(definition.mediaType, 'mediaType');
      const implementationIdentity = requireIdentity(
        definition.implementationIdentity,
        'implementationIdentity',
      );
      if (typeof definition.canonicalize !== 'function') {
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.INVALID_INPUT,
          'canonicalization',
          'Canonicalizer definition requires executable code',
          { artifactKind, version },
        );
      }
      const key = canonicalizerKey(artifactKind, version);
      if (registered.has(key)) {
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.INVALID_INPUT,
          'canonicalization',
          'Canonicalizer registry contains an ambiguous duplicate',
          { artifactKind, version },
        );
      }
      const frozen = Object.freeze({
        artifactKind,
        canonicalizationVersion: version,
        mediaType,
        implementationIdentity,
        canonicalize: definition.canonicalize,
      });
      registered.set(key, frozen);
      inspection.push({
        artifact_kind: artifactKind,
        canonicalization_version: version,
        media_type: mediaType,
        implementation_identity: implementationIdentity,
      });
    }
    this.#definitions = registered;
    this.digest = sha256Bytes(canonicalBytes(inspection));
    Object.freeze(this);
  }

  /** Resolve and execute exactly one registered canonicalization profile. */
  public canonicalize(
    artifactKind: string,
    canonicalizationVersion: string,
    input: unknown,
  ): CanonicalizedArtifact {
    const definition = this.#definitions.get(
      canonicalizerKey(artifactKind, canonicalizationVersion),
    );
    if (!definition) {
      const hasKind = Array.from(this.#definitions.values()).some(
        (candidate) => candidate.artifactKind === artifactKind,
      );
      throw new SealedArtifactError(
        hasKind
          ? SealedArtifactErrorCodes.UNSUPPORTED_CANONICALIZATION
          : SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND,
        'canonicalization',
        hasKind
          ? 'Artifact canonicalization version is not registered'
          : 'Artifact kind is not registered',
        { artifactKind, canonicalizationVersion },
      );
    }
    const first = definition.canonicalize(input);
    const second = definition.canonicalize(input);
    if (
      !(first instanceof Uint8Array)
      || !(second instanceof Uint8Array)
      || first.byteLength === 0
      || first.byteLength > MAX_CANONICAL_BYTES
      || second.byteLength > MAX_CANONICAL_BYTES
    ) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'canonicalization',
        'Registered canonicalizer produced empty, unbounded, or non-byte content',
        { artifactKind, canonicalizationVersion },
      );
    }
    if (Buffer.compare(Buffer.from(first), Buffer.from(second)) !== 0) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'canonicalization',
        'Registered canonicalizer produced non-deterministic bytes',
        { artifactKind, canonicalizationVersion },
      );
    }
    return Object.freeze({
      artifactKind,
      canonicalizationVersion,
      mediaType: definition.mediaType,
      bytes: Uint8Array.from(first),
    });
  }

  /** Resolve profile metadata without accepting unverified artifact bytes. */
  public describe(
    artifactKind: string,
    canonicalizationVersion: string,
  ): Readonly<Pick<
    ArtifactCanonicalizerDefinition,
    'artifactKind' | 'canonicalizationVersion' | 'mediaType' | 'implementationIdentity'
  >> {
    const definition = this.#definitions.get(
      canonicalizerKey(artifactKind, canonicalizationVersion),
    );
    if (!definition) {
      const hasKind = Array.from(this.#definitions.values()).some(
        (candidate) => candidate.artifactKind === artifactKind,
      );
      throw new SealedArtifactError(
        hasKind
          ? SealedArtifactErrorCodes.UNSUPPORTED_CANONICALIZATION
          : SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND,
        'canonicalization',
        hasKind
          ? 'Artifact canonicalization version is not registered'
          : 'Artifact kind is not registered',
        { artifactKind, canonicalizationVersion },
      );
    }
    return Object.freeze({
      artifactKind: definition.artifactKind,
      canonicalizationVersion: definition.canonicalizationVersion,
      mediaType: definition.mediaType,
      implementationIdentity: definition.implementationIdentity,
    });
  }
}

/** Create the initial platform-neutral JSON profiles for shared reference inputs. */
export function createArtifactCanonicalizerRegistry(): ArtifactCanonicalizerRegistry {
  return new ArtifactCanonicalizerRegistry(
    Object.values(InitialArtifactKinds).map((artifactKind) => ({
      artifactKind,
      canonicalizationVersion: DEFAULT_ARTIFACT_CANONICALIZATION_VERSION,
      mediaType: DEFAULT_ARTIFACT_MEDIA_TYPE,
      implementationIdentity: 'deep-loop-canonical-json-v1',
      canonicalize: canonicalizeJson,
    })),
  );
}

// ───────────────────────────────────────────────────────────────────
// 3. DIGEST REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Frozen algorithm registry used for both publication and verified reads. */
export class ArtifactDigestRegistry {
  public readonly digest: string;
  readonly #definitions: ReadonlyMap<string, ArtifactDigestDefinition>;

  public constructor(definitions: readonly ArtifactDigestDefinition[]) {
    if (!Array.isArray(definitions) || definitions.length === 0) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'descriptor',
        'Digest registry requires at least one definition',
      );
    }
    const registered = new Map<string, ArtifactDigestDefinition>();
    const inspection: Record<string, JsonValue>[] = [];
    for (const definition of definitions) {
      const algorithm = requireIdentity(definition.algorithm, 'algorithm');
      const implementationIdentity = requireIdentity(
        definition.implementationIdentity,
        'implementationIdentity',
      );
      if (typeof definition.digest !== 'function' || registered.has(algorithm)) {
        throw new SealedArtifactError(
          SealedArtifactErrorCodes.INVALID_INPUT,
          'descriptor',
          'Digest registry definition is incomplete or duplicated',
          { algorithm },
        );
      }
      registered.set(algorithm, Object.freeze({
        algorithm,
        implementationIdentity,
        digest: definition.digest,
      }));
      inspection.push({
        algorithm,
        implementation_identity: implementationIdentity,
      });
    }
    this.#definitions = registered;
    this.digest = sha256Bytes(canonicalBytes(inspection));
    Object.freeze(this);
  }

  /** Compute and validate one registered lowercase digest. */
  public calculate(algorithm: string, bytes: Uint8Array): string {
    const definition = this.#definitions.get(algorithm);
    if (!definition) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.UNSUPPORTED_DIGEST_ALGORITHM,
        'descriptor',
        'Artifact digest algorithm is not registered',
        { algorithm },
      );
    }
    const digest = definition.digest(Uint8Array.from(bytes));
    if (!DIGEST_PATTERN.test(digest)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.INVALID_INPUT,
        'descriptor',
        'Registered digest implementation returned an invalid commitment',
        { algorithm },
      );
    }
    return digest;
  }

  /** Resolve registered algorithm identity without accepting content bytes. */
  public describe(
    algorithm: string,
  ): Readonly<Pick<ArtifactDigestDefinition, 'algorithm' | 'implementationIdentity'>> {
    const definition = this.#definitions.get(algorithm);
    if (!definition) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.UNSUPPORTED_DIGEST_ALGORITHM,
        'descriptor',
        'Artifact digest algorithm is not registered',
        { algorithm },
      );
    }
    return Object.freeze({
      algorithm: definition.algorithm,
      implementationIdentity: definition.implementationIdentity,
    });
  }
}

/** Create the runtime's default SHA-256 content identity registry. */
export function createArtifactDigestRegistry(): ArtifactDigestRegistry {
  return new ArtifactDigestRegistry([{
    algorithm: DEFAULT_ARTIFACT_DIGEST_ALGORITHM,
    implementationIdentity: 'node-crypto-sha256-v1',
    digest: (bytes) => sha256Bytes(bytes),
  }]);
}
