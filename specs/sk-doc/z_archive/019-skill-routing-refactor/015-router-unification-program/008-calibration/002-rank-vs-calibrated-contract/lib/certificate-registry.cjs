// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Fenced Calibration Certificate Registry                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  CalibrationContractError,
  METHOD_ENVELOPE,
  transitionCertificate,
  validateCertificate,
} = require('./calibration-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fail(code, message) {
  throw new CalibrationContractError(code, message);
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertCas(registry, expectedFenceToken, expectedActiveCertificateId) {
  if (expectedFenceToken !== registry.fenceToken) {
    fail('CAS_FENCE_MISMATCH', 'certificate pointer fence token is stale');
  }
  if (expectedActiveCertificateId !== registry.activeCertificateId) {
    fail('CAS_PREIMAGE_MISMATCH', 'certificate pointer preimage is stale');
  }
}

function assertTrustedAttestation(certificate, attestation) {
  if (!isPlainObject(attestation) || attestation.result !== 'validated') {
    fail('CERTIFICATE_EXTERNAL_VALIDATION_REQUIRED', 'trusted validation is missing');
  }
  const methodContract = METHOD_ENVELOPE.methods[certificate.method];
  const bindingsMatch = attestation.corpusId === certificate.corpusId
    && attestation.policyHash === certificate.policyHash
    && attestation.riskSlice === certificate.riskSlice
    && attestation.generation === certificate.generation
    && attestation.method === certificate.method
    && attestation.acceptanceMetric === methodContract.acceptanceMetric
    && attestation.observedMetric === certificate.metrics[methodContract.acceptanceMetric];
  if (!bindingsMatch) {
    fail(
      'CERTIFICATE_EXTERNAL_VALIDATION_MISMATCH',
      'trusted validation does not bind the candidate and fixed method metric'
    );
  }
  if (typeof attestation.issuedBy !== 'string'
    || attestation.issuedBy.trim() === ''
    || !Number.isFinite(Date.parse(attestation.issuedAt))) {
    fail(
      'CERTIFICATE_EXTERNAL_VALIDATION_INVALID',
      'trusted validation requires issuer and date-time'
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

class CertificateRegistry {
  /**
   * Create an in-memory model of the external pointer and trust boundary.
   *
   * @param {Object} [options] - Initial pointer and trusted references.
   */
  constructor(options = {}) {
    this.fenceToken = options.fenceToken ?? 0;
    this.activeCertificateId = options.activeCertificateId ?? null;
    this.retainedPriorCertificateId = options.retainedPriorCertificateId ?? null;
    this.certificates = new Map();
    this.trustedAttestations = new Map(options.trustedAttestations || []);
    for (const certificate of options.certificates || []) {
      const parsed = validateCertificate(certificate);
      this.certificates.set(parsed.certificateId, parsed);
    }
  }

  /**
   * Resolve an immutable certificate artifact by identity.
   *
   * @param {string} certificateId - Content identity.
   * @returns {Object|null} Certificate or null.
   */
  get(certificateId) {
    return this.certificates.get(certificateId) || null;
  }

  /**
   * Promote a candidate by fenced CAS using a distinct trusted attestation.
   *
   * @param {Object} candidate - Sealed candidate certificate.
   * @param {Object} cas - Expected fence and active pointer preimage.
   * @returns {Object} Newly active validated certificate.
   */
  rotate(candidate, cas) {
    const parsed = validateCertificate(candidate);
    if (parsed.status !== 'candidate') {
      fail('CERTIFICATE_PROMOTION_STATUS_INVALID', 'only candidate certificates promote');
    }
    assertCas(this, cas.expectedFenceToken, cas.expectedActiveCertificateId);
    const attestation = this.trustedAttestations.get(parsed.certHash);
    assertTrustedAttestation(parsed, attestation);
    const validated = transitionCertificate(parsed, 'validated', {
      validatedAt: attestation.issuedAt,
      validatedBy: attestation.issuedBy,
    });
    this.certificates.set(validated.certificateId, validated);
    this.retainedPriorCertificateId = this.activeCertificateId;
    this.activeCertificateId = validated.certificateId;
    this.fenceToken += 1;
    return validated;
  }

  /**
   * Restore the retained validated artifact by fenced pointer swap.
   *
   * @param {Object} cas - Expected fence and active pointer preimage.
   * @returns {Object} Restored validated certificate.
   */
  restoreRetainedPrior(cas) {
    assertCas(this, cas.expectedFenceToken, cas.expectedActiveCertificateId);
    const retained = this.get(this.retainedPriorCertificateId);
    if (!retained) {
      fail('CERTIFICATE_RETAINED_PRIOR_UNAVAILABLE', 'retained prior cannot be resolved');
    }
    const parsed = validateCertificate(retained);
    if (parsed.status !== 'validated') {
      fail(
        'CERTIFICATE_RETAINED_PRIOR_STATUS_INVALID',
        'retained prior must already be validated'
      );
    }
    if (parsed.certificateId === this.activeCertificateId) {
      fail('CERTIFICATE_RESTORE_NOOP', 'retained prior is already active');
    }
    const displacedCertificateId = this.activeCertificateId;
    this.activeCertificateId = parsed.certificateId;
    this.retainedPriorCertificateId = displacedCertificateId;
    this.fenceToken += 1;
    return parsed;
  }

  /**
   * Replace the active artifact with an immutable terminal lifecycle record.
   *
   * @param {string} nextStatus - expired or revoked.
   * @param {Object} cas - Expected fence and active pointer preimage.
   * @returns {Object} Active terminal artifact.
   */
  transitionActive(nextStatus, cas) {
    if (!['expired', 'revoked'].includes(nextStatus)) {
      fail('CERTIFICATE_LIFECYCLE_INVALID', 'active transition must expire or revoke');
    }
    assertCas(this, cas.expectedFenceToken, cas.expectedActiveCertificateId);
    const active = this.get(this.activeCertificateId);
    if (!active) fail('CERTIFICATE_NOT_ACTIVE', 'active certificate cannot be resolved');
    const terminal = transitionCertificate(active, nextStatus);
    this.certificates.set(terminal.certificateId, terminal);
    this.activeCertificateId = terminal.certificateId;
    this.fenceToken += 1;
    return terminal;
  }

  /**
   * Return pointer state without exposing mutable internal collections.
   *
   * @returns {Object} Pointer state snapshot.
   */
  snapshot() {
    return Object.freeze({
      fenceToken: this.fenceToken,
      activeCertificateId: this.activeCertificateId,
      retainedPriorCertificateId: this.retainedPriorCertificateId,
    });
  }
}

module.exports = {
  CertificateRegistry,
};
