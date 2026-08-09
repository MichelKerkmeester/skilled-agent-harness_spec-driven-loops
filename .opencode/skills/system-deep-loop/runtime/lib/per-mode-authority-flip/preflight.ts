// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip — Fail-Closed Preflight
// ───────────────────────────────────────────────────────────────────
//
// Consumes — never re-derives — evidence two already-independently-verified
// artifacts already certify: the cutover certificate (which already binds
// the mode gate, shadow-parity, and rollback-drill certificates) and the
// in-flight migration handoff. This module adds only what is genuinely new
// to the authority flip itself: cross-binding both artifacts' evidence to
// the same classification manifest, the eight-mode order guard, and the
// rollback-asset presence check.

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { verifyCutoverCertificate } from '../cutover-certificate/index.js';
import { verifyInflightMigrationHandoff } from '../inflight-state-migration/index.js';
import { checkManifestOrder } from './manifest-order.js';

import type { JsonObject } from '../event-envelope/index.js';
import type { CutoverPreflightInput, CutoverPreflightResult } from './types.js';

const HEX_64 = /^[a-f0-9]{64}$/u;

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function isValidRollbackAssetDigests(values: readonly unknown[]): values is readonly string[] {
  if (values.length === 0) return false;
  if (!values.every((value) => typeof value === 'string' && HEX_64.test(value))) return false;
  return new Set(values).size === values.length;
}

/**
 * Validate every hard precondition for exactly one mode's forward flip.
 * Every branch that is not a clean pass returns a typed denial; nothing here
 * mutates any authority record, and nothing here calls the authorization
 * gateway — that only happens after this preflight already passed.
 */
export function evaluateCutoverPreflight(input: CutoverPreflightInput): CutoverPreflightResult {
  try {
    const order = checkManifestOrder([input.mode], input.alreadyFlippedModes);
    if (order.verdict === 'denied') return Object.freeze({ verdict: 'blocked', reasonCode: order.reasonCode });

    const { certificate, expectation } = input.cutover;
    if (expectation.mode !== input.mode) {
      return Object.freeze({ verdict: 'blocked', reasonCode: 'WRONG_MODE_BINDING' });
    }
    if (expectation.fromAuthorityEpoch !== input.expectedAuthorityEpoch) {
      return Object.freeze({ verdict: 'blocked', reasonCode: 'STALE_AUTHORITY_EPOCH' });
    }
    const certificateVerification = verifyCutoverCertificate(certificate, expectation);
    if (certificateVerification.verdict !== 'valid') {
      return Object.freeze({ verdict: 'blocked', reasonCode: 'CUTOVER_CERTIFICATE_INVALID' });
    }
    if (
      certificate.facts.mode !== input.mode
      || certificate.facts.fromAuthorityEpoch !== input.expectedAuthorityEpoch
    ) {
      return Object.freeze({ verdict: 'blocked', reasonCode: 'CANDIDATE_MISMATCH' });
    }

    const { handoff, classificationManifest } = input.migration;
    if (handoff.classificationManifestDigest !== classificationManifest.finalDigest) {
      return Object.freeze({ verdict: 'blocked', reasonCode: 'MIGRATION_HANDOFF_UNBOUND' });
    }
    if (
      classificationManifest.finalDigest !== certificate.facts.evidence.classificationManifestDigest
    ) {
      return Object.freeze({ verdict: 'blocked', reasonCode: 'MIGRATION_HANDOFF_UNBOUND' });
    }
    if (!verifyInflightMigrationHandoff(classificationManifest, handoff)) {
      return Object.freeze({ verdict: 'blocked', reasonCode: 'MIGRATION_HANDOFF_INVALID' });
    }
    // `verifyInflightMigrationHandoff` already proves every row reached a
    // terminal receipt (COMMITTED, BLOCKED, or ABORTED) bound to this exact
    // manifest — a policy-frozen BLOCK disposition (e.g. a control row that
    // stays legacy-owned forever, mirroring PIN) is a legitimate terminal
    // outcome and does not gate the flip. An ABORTED row means an attempted
    // operation itself failed at runtime and remains genuinely unresolved.
    if (handoff.closure.abortedRows > 0) {
      return Object.freeze({ verdict: 'blocked', reasonCode: 'MIGRATION_HANDOFF_INVALID' });
    }

    if (!isValidRollbackAssetDigests(input.rollbackAssetDigests)) {
      return Object.freeze({ verdict: 'blocked', reasonCode: 'ROLLBACK_ASSETS_INVALID' });
    }

    return Object.freeze({
      verdict: 'ready',
      cutoverCertificateDigest: certificate.certificateDigest,
      classificationManifestDigest: classificationManifest.finalDigest,
    });
  } catch {
    return Object.freeze({ verdict: 'blocked', reasonCode: 'RECORD_MALFORMED' });
  }
}

/** Deterministic digest over the rollback asset set, bound into the transition event. */
export function rollbackAssetSetDigest(rollbackAssetDigests: readonly string[]): string {
  return digest([...rollbackAssetDigests].sort());
}
