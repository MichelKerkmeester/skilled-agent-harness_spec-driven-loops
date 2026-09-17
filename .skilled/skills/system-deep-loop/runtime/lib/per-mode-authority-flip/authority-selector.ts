// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip — Canonical Selector
// ───────────────────────────────────────────────────────────────────
//
// The one route decision a mode adapter would consult at its canonical
// persistence boundary. Nothing in this module is wired to a live adapter:
// it is a pure function over an already-read authority record, built so a
// future wiring step can call it without changing its contract.

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { AUTHORITY_FLIP_MODE_ORDER, AuthorityFlipStates } from './types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  AuthorityFlipDenialReasonCode,
  AuthorityRecord,
  AuthoritySelectorExpectation,
  AuthoritySelectorResult,
} from './types.js';

const MODE_SET: ReadonlySet<string> = new Set(AUTHORITY_FLIP_MODE_ORDER);

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function denied(reasonCode: AuthorityFlipDenialReasonCode): AuthoritySelectorResult {
  return Object.freeze({ outcome: 'denied', reasonCode });
}

function recomputedDigest(record: AuthorityRecord): string {
  const { recordDigest: ignored, ...core } = record;
  void ignored;
  return digest(core);
}

/** Recompute and confirm a record's own tamper-evident binding. */
export function isValidAuthorityRecord(value: unknown): value is AuthorityRecord {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Partial<AuthorityRecord>;
  if (
    record.schemaVersion !== 1
    || typeof record.mode !== 'string'
    || !MODE_SET.has(record.mode)
    || typeof record.state !== 'string'
    || !AuthorityFlipStates.has(record.state)
    || !Number.isSafeInteger(record.epoch)
    || record.epoch! <= 0
    || (record.selectedWriter !== 'legacy' && record.selectedWriter !== 'dark')
    || !(record.candidateSha === null || typeof record.candidateSha === 'string')
    || !Number.isSafeInteger(record.policyVersion)
    || record.policyVersion! < 0
    || !(record.cutoverCertificateDigest === null || typeof record.cutoverCertificateDigest === 'string')
    || !(record.lastTransitionDigest === null || typeof record.lastTransitionDigest === 'string')
    || typeof record.updatedAt !== 'string'
    || Number.isNaN(Date.parse(record.updatedAt))
    || typeof record.recordDigest !== 'string'
  ) return false;
  return recomputedDigest(record as AuthorityRecord) === record.recordDigest;
}

/**
 * Resolve exactly one canonical route for one mode's already-read authority
 * record. Every failure mode — missing, malformed, unknown mode, unknown
 * state, wrong-mode binding, policy drift, or a caller-supplied record
 * digest that no longer matches — denies rather than implicitly choosing a
 * route. `rollback_pending` denies canonical admission entirely rather than
 * exposing either writer, so a rollback in progress can never race a new
 * write against either the legacy or the dark writer.
 */
export function selectAuthorityRoute(
  record: unknown,
  expectation: AuthoritySelectorExpectation,
): AuthoritySelectorResult {
  if (!isValidAuthorityRecord(record)) return denied('RECORD_MALFORMED');
  if (record.mode !== expectation.mode) return denied('WRONG_MODE_BINDING');
  if (
    expectation.policyVersion !== undefined
    && record.policyVersion !== expectation.policyVersion
  ) return denied('POLICY_MISMATCH');
  if (
    expectation.expectedRecordDigest !== undefined
    && record.recordDigest !== expectation.expectedRecordDigest
  ) return denied('RECORD_DIGEST_MISMATCH');

  switch (record.state) {
    case 'legacy_authoritative':
      return Object.freeze({
        outcome: 'selected', route: 'legacy', shadowRoute: null,
        state: record.state, epoch: record.epoch, admissionOpen: true,
      });
    case 'shadowing':
    case 'cutover_ready':
      return Object.freeze({
        outcome: 'selected', route: 'legacy', shadowRoute: 'dark',
        state: record.state, epoch: record.epoch, admissionOpen: true,
      });
    case 'new_authoritative_reversible':
      return Object.freeze({
        outcome: 'selected', route: 'dark', shadowRoute: 'legacy',
        state: record.state, epoch: record.epoch, admissionOpen: true,
      });
    case 'new_authoritative_final':
      return Object.freeze({
        outcome: 'selected', route: 'dark', shadowRoute: null,
        state: record.state, epoch: record.epoch, admissionOpen: true,
      });
    case 'rollback_pending':
      return denied('ACTIVE_TRANSACTION_CONFLICT');
    default:
      return denied('UNKNOWN_AUTHORITY_STATE');
  }
}
