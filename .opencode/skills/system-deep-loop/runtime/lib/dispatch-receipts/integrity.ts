// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Receipt Integrity
// ───────────────────────────────────────────────────────────────────

import {
  canonicalReceiptJson,
  deriveReceiptKey,
  signReceipt,
  verifyReceipt,
} from '../deep-loop/receipt-crypto.js';
import {
  DispatchReceiptError,
  DispatchReceiptErrorCodes,
} from './errors.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  DispatchReceiptMacProvider,
  DispatchReceiptMacVerification,
  DispatchReceiptPayload,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DISPATCH_RECEIPT_CANONICALIZATION_VERSION = 'receipt-canonical-json-v1';

const MAC_PATTERN = /^[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 2. PROVIDERS
// ───────────────────────────────────────────────────────────────────

/** Construct an advisory provider whose key cannot be reconstructed after process loss. */
export function createProcessLocalDispatchReceiptMacProvider(
  runMasterSecret: string,
  providerId = 'process-local',
  keyId = 'ephemeral-run-master',
): DispatchReceiptMacProvider {
  if (typeof runMasterSecret !== 'string' || runMasterSecret.length < 16) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.MAC_PROFILE_INVALID,
      'integrity',
      'Process-local receipt key material is missing or too short',
    );
  }
  return Object.freeze({
    profile: Object.freeze({
      keyId,
      providerId,
      scheme: 'hmac-sha256' as const,
      trustScope: 'process-local-advisory' as const,
      verifierVersion: '1',
    }),
    canVerifyAfterRestart: () => false,
    deriveKey: (dispatchId: string) => deriveReceiptKey(runMasterSecret, dispatchId),
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. SIGNING
// ───────────────────────────────────────────────────────────────────

function assertProvider(provider: DispatchReceiptMacProvider): void {
  const profile = provider.profile;
  if (
    profile.scheme !== 'hmac-sha256'
    || typeof profile.providerId !== 'string'
    || profile.providerId.trim() === ''
    || typeof profile.keyId !== 'string'
    || profile.keyId.trim() === ''
    || typeof profile.verifierVersion !== 'string'
    || profile.verifierVersion.trim() === ''
    || (profile.trustScope === 'durable-cross-resume'
      && provider.canVerifyAfterRestart() !== true)
  ) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.MAC_PROFILE_INVALID,
      'integrity',
      'Receipt MAC profile overstates or omits its verifier capability',
    );
  }
}

/** Attach optional HMAC evidence while keeping the ledger as the durable integrity authority. */
export function attachDispatchReceiptIntegrity(
  unsignedPayload: JsonObject,
  dispatchId: string,
  provider?: DispatchReceiptMacProvider,
): DispatchReceiptPayload {
  if (!provider) {
    return Object.freeze({
      ...unsignedPayload,
      canonicalization_version: DISPATCH_RECEIPT_CANONICALIZATION_VERSION,
      mac_scheme: 'none',
      mac_key_provider_id: 'none',
      mac_key_id: 'none',
      mac_verifier_version: 'none',
      mac_trust_scope: 'ledger-only',
      mac: null,
    }) as DispatchReceiptPayload;
  }

  assertProvider(provider);
  const profile = provider.profile;
  const payloadWithoutMac: JsonObject = {
    ...unsignedPayload,
    canonicalization_version: DISPATCH_RECEIPT_CANONICALIZATION_VERSION,
    mac_scheme: profile.scheme,
    mac_key_provider_id: profile.providerId,
    mac_key_id: profile.keyId,
    mac_verifier_version: profile.verifierVersion,
    mac_trust_scope: profile.trustScope,
  };
  const key = provider.deriveKey(dispatchId);
  const mac = signReceipt(payloadWithoutMac, key);
  if (!MAC_PATTERN.test(mac)) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.MAC_PROFILE_INVALID,
      'integrity',
      'Receipt provider did not produce a fixed HMAC-SHA256 digest',
    );
  }
  return Object.freeze({ ...payloadWithoutMac, mac }) as DispatchReceiptPayload;
}

// ───────────────────────────────────────────────────────────────────
// 4. VERIFICATION
// ───────────────────────────────────────────────────────────────────

function matchingProvider(
  payload: DispatchReceiptPayload,
  providers: readonly DispatchReceiptMacProvider[],
): DispatchReceiptMacProvider | null {
  return providers.find((provider) => (
    provider.profile.providerId === payload.mac_key_provider_id
    && provider.profile.keyId === payload.mac_key_id
    && provider.profile.verifierVersion === payload.mac_verifier_version
    && provider.profile.trustScope === payload.mac_trust_scope
  )) ?? null;
}

/** Verify optional MAC evidence without promoting advisory evidence above ledger integrity. */
export function verifyDispatchReceiptIntegrity(
  payload: DispatchReceiptPayload,
  providers: readonly DispatchReceiptMacProvider[] = [],
): DispatchReceiptMacVerification {
  if (payload.canonicalization_version !== DISPATCH_RECEIPT_CANONICALIZATION_VERSION) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.MAC_PROFILE_INVALID,
      'integrity',
      'Dispatch receipt uses an unknown canonicalization profile',
    );
  }
  if (payload.mac_scheme === 'none') {
    if (
      payload.mac !== null
      || payload.mac_trust_scope !== 'ledger-only'
      || payload.mac_key_provider_id !== 'none'
      || payload.mac_key_id !== 'none'
      || payload.mac_verifier_version !== 'none'
    ) {
      throw new DispatchReceiptError(
        DispatchReceiptErrorCodes.MAC_PROFILE_INVALID,
        'integrity',
        'Ledger-only receipt carries contradictory MAC metadata',
      );
    }
    return 'ledger-only';
  }
  if (payload.mac === null || !MAC_PATTERN.test(payload.mac)) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.MAC_VERIFICATION_FAILED,
      'integrity',
      'Dispatch receipt MAC is malformed',
    );
  }

  const provider = matchingProvider(payload, providers);
  if (!provider) {
    if (payload.mac_trust_scope === 'process-local-advisory') {
      return 'process-local-advisory-unavailable';
    }
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.MAC_VERIFICATION_FAILED,
      'integrity',
      'Restart-verifiable receipt provider is unavailable',
      { providerId: payload.mac_key_provider_id },
    );
  }
  assertProvider(provider);
  if (
    payload.mac_trust_scope === 'durable-cross-resume'
    && provider.canVerifyAfterRestart() !== true
  ) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.MAC_PROFILE_INVALID,
      'integrity',
      'Receipt provider cannot satisfy its durable trust label',
      { providerId: payload.mac_key_provider_id },
    );
  }
  const key = provider.deriveKey(payload.dispatch_id);
  if (!verifyReceipt(payload, payload.mac, key)) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.MAC_VERIFICATION_FAILED,
      'integrity',
      'Dispatch receipt MAC verification failed',
      { providerId: payload.mac_key_provider_id },
    );
  }
  return payload.mac_trust_scope === 'durable-cross-resume'
    ? 'durable-verified'
    : 'process-local-advisory-verified';
}

/** Expose the exact canonical MAC input for deterministic, secret-free fixtures. */
export function canonicalDispatchReceiptMacInput(payload: DispatchReceiptPayload): string {
  const { mac: ignored, ...unsigned } = payload;
  void ignored;
  return canonicalReceiptJson(unsigned);
}
