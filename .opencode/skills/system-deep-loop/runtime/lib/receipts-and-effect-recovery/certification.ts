// ───────────────────────────────────────────────────────────────────
// MODULE: Boundary Receipt Certification
// ───────────────────────────────────────────────────────────────────

import {
  createHmac,
  timingSafeEqual,
} from 'node:crypto';

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ReceiptEffectError,
  ReceiptEffectErrorCodes,
} from './errors.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  BoundaryReceiptPayload,
  CertificationEnvelope,
  CertificationProfile,
  ReceiptCertificationProvider,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function providerKey(profile: Readonly<CertificationProfile>): string {
  return [
    profile.scheme,
    profile.provider_id,
    profile.key_id,
    profile.verifier_version,
  ].join('\u0000');
}

function profileFromEnvelope(
  envelope: Readonly<CertificationEnvelope>,
): CertificationProfile {
  return Object.freeze({
    scheme: envelope.scheme,
    provider_id: envelope.provider_id,
    key_id: envelope.key_id,
    verifier_version: envelope.verifier_version,
    trust_scope: envelope.trust_scope,
  });
}

function signatureBytes(base64: string): Uint8Array {
  const decoded = Buffer.from(base64, 'base64');
  if (
    decoded.length === 0
    || decoded.toString('base64').replace(/=+$/u, '') !== base64.replace(/=+$/u, '')
  ) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.CERTIFICATION_INVALID,
      'certification',
      'Receipt signature is not canonical base64',
    );
  }
  return Uint8Array.from(decoded);
}

function signingArtifact(
  facts: Readonly<Omit<BoundaryReceiptPayload, 'certification'>>,
  profile: Readonly<CertificationProfile>,
): Uint8Array {
  return Uint8Array.from(canonicalBytes({
    facts: facts as unknown as JsonObject,
    certification_profile: profile,
  }));
}

function unsignedFacts(
  payload: Readonly<BoundaryReceiptPayload>,
): Omit<BoundaryReceiptPayload, 'certification'> {
  const { certification: _certification, ...facts } = payload;
  return facts as Omit<BoundaryReceiptPayload, 'certification'>;
}

// ───────────────────────────────────────────────────────────────────
// 2. PROVIDER REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Immutable exact-profile registry whose providers retain their own key material. */
export class CertificationProviderRegistry {
  readonly #providers: ReadonlyMap<string, ReceiptCertificationProvider>;
  public readonly digest: string;

  public constructor(providers: readonly ReceiptCertificationProvider[]) {
    const registered = new Map<string, ReceiptCertificationProvider>();
    for (const provider of providers) {
      const key = providerKey(provider.profile);
      if (registered.has(key)) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.INVALID_INPUT,
          'input',
          'Certification provider registry contains a duplicate exact profile',
          { providerId: provider.profile.provider_id },
        );
      }
      registered.set(key, provider);
    }
    this.#providers = registered;
    this.digest = sha256Bytes(canonicalBytes(this.inspect()));
    Object.freeze(this);
  }

  /** Resolve the exact scheme, provider, key, and verifier version. */
  public resolve(
    profile: Readonly<CertificationProfile>,
  ): ReceiptCertificationProvider {
    const provider = this.#providers.get(providerKey(profile));
    if (!provider || canonicalJson(provider.profile) !== canonicalJson(profile)) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.CERTIFICATION_PROVIDER_UNKNOWN,
        'certification',
        'Certification profile is not registered',
        { providerId: profile.provider_id, scheme: profile.scheme },
      );
    }
    return provider;
  }

  /** Return key-free provider metadata for candidate and policy evidence. */
  public inspect(): readonly CertificationProfile[] {
    return Object.freeze(
      Array.from(this.#providers.values())
        .map((provider) => provider.profile)
        .sort((left, right) => providerKey(left).localeCompare(providerKey(right))),
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. HMAC PROVIDER
// ───────────────────────────────────────────────────────────────────

/** Create a provider-backed HMAC profile without exposing its secret in receipts. */
export function createHmacCertificationProvider(
  profile: CertificationProfile,
  providerSecret: string | Uint8Array,
): ReceiptCertificationProvider {
  const key = typeof providerSecret === 'string'
    ? Buffer.from(providerSecret, 'utf8')
    : Buffer.from(providerSecret);
  if (key.length < 32 || profile.scheme !== 'hmac-sha256') {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.INVALID_INPUT,
      'input',
      'HMAC provider requires the hmac-sha256 scheme and at least 256 bits of key material',
      { providerId: profile.provider_id },
    );
  }
  const frozenProfile = Object.freeze({ ...profile });
  return Object.freeze({
    profile: frozenProfile,
    async sign(bytes: Uint8Array): Promise<Uint8Array> {
      return Uint8Array.from(createHmac('sha256', key).update(bytes).digest());
    },
    async verify(bytes: Uint8Array, signature: Uint8Array): Promise<boolean> {
      const expected = createHmac('sha256', key).update(bytes).digest();
      const candidate = Buffer.from(signature);
      return expected.length === candidate.length && timingSafeEqual(expected, candidate);
    },
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. CERTIFY AND VERIFY
// ───────────────────────────────────────────────────────────────────

/** Bind all receipt facts and signer metadata into one certification envelope. */
export async function certifyBoundaryReceipt(
  facts: Readonly<Omit<BoundaryReceiptPayload, 'certification'>>,
  profile: Readonly<CertificationProfile>,
  providers: CertificationProviderRegistry,
): Promise<CertificationEnvelope> {
  const provider = providers.resolve(profile);
  const bytes = signingArtifact(facts, profile);
  const signature = await provider.sign(bytes);
  if (signature.length === 0) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.CERTIFICATION_INVALID,
      'certification',
      'Certification provider returned an empty signature',
      { providerId: profile.provider_id },
    );
  }
  return Object.freeze({
    ...profile,
    signed_digest: sha256Bytes(bytes),
    signature_base64: Buffer.from(signature).toString('base64'),
  });
}

/** Verify signer registration, trust scope, digest binding, and signature bytes. */
export async function verifyBoundaryReceiptCertification(
  payload: Readonly<BoundaryReceiptPayload>,
  providers: CertificationProviderRegistry,
  requireDurable = true,
): Promise<void> {
  const profile = profileFromEnvelope(payload.certification);
  if (requireDurable && profile.trust_scope !== 'durable-cross-resume') {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.DURABLE_CERTIFICATION_REQUIRED,
      'certification',
      'Process-local advisory certification cannot satisfy cross-resume verification',
      { providerId: profile.provider_id },
    );
  }
  const provider = providers.resolve(profile);
  const bytes = signingArtifact(unsignedFacts(payload), profile);
  const digest = sha256Bytes(bytes);
  if (digest !== payload.certification.signed_digest) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.CERTIFICATION_INVALID,
      'certification',
      'Receipt facts do not match the signed canonical digest',
      { providerId: profile.provider_id },
    );
  }
  const isValid = await provider.verify(
    bytes,
    signatureBytes(payload.certification.signature_base64),
  );
  if (!isValid) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.CERTIFICATION_INVALID,
      'certification',
      'Receipt signature verification failed',
      { providerId: profile.provider_id },
    );
  }
}
