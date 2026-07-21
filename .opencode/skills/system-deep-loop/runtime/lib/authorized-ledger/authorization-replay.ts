// ───────────────────────────────────────────────────────────────────
// MODULE: Authorization Replay Verification
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
} from './authorized-ledger-errors.js';
import { AuthorizationReasonCodes, AuthorizationVerdicts } from './authorized-ledger-types.js';
import { readAuthorizationAudit } from './transition-authorization-gateway.js';

import type { AppendOnlyLedger } from './append-only-ledger.js';
import type {
  AuthorizationDecisionRecord,
  AuthorizationReplayReport,
  PolicyEvaluationInput,
} from './authorized-ledger-types.js';
import type { TransitionPolicyRegistry } from './transition-policy-registry.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function policyInput(decision: AuthorizationDecisionRecord): PolicyEvaluationInput {
  return Object.freeze({
    mode: decision.mode,
    streamId: decision.stream_id,
    priorHeadSequence: decision.prior_head_sequence,
    priorHeadHash: decision.prior_head_hash,
    priorStateVersion: decision.prior_state_version,
    priorStateFingerprint: decision.prior_state_fingerprint,
    requestedEventId: decision.requested_event_id,
    requestedEventType: decision.requested_event_type,
    requestedEventVersion: decision.requested_event_version,
    requestedEventDigest: decision.requested_event_digest,
    actorId: decision.actor_id,
    capabilityId: decision.capability_id,
    authorityState: decision.authority_state,
    authorityEpoch: decision.authority_epoch,
    evidenceDigest: decision.evidence_digest,
    correlationId: decision.correlation_id,
    causationId: decision.causation_id,
    idempotencyKeyDigest: decision.idempotency_key_digest,
  });
}

function sorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...values].sort());
}

// ───────────────────────────────────────────────────────────────────
// 2. REPLAY
// ───────────────────────────────────────────────────────────────────

/** Verify allow linkage, deny absence, unapplied allows, and deterministic policy parity. */
export async function verifyAuthorizationReplay(
  ledger: AppendOnlyLedger,
  rootDirectory: string,
  policies: TransitionPolicyRegistry,
  auditLedgerId = 'authorization-audit',
): Promise<AuthorizationReplayReport> {
  const [events, domainHead, audit] = await Promise.all([
    ledger.readVerifiedEvents(),
    ledger.getVerifiedHead(),
    readAuthorizationAudit(rootDirectory, auditLedgerId),
  ]);
  const appliedDecisionIds = new Set(
    events.map((verified) => verified.frame.authorization_ref.decision_id),
  );
  const eventIdentityDigests = new Set(
    events.map((verified) => `${verified.frame.receipt.event_id}:${verified.frame.canonical_event_hash}`),
  );
  const unappliedAllowDecisionIds: string[] = [];
  const deniedDecisionIds: string[] = [];
  const policyDivergences: string[] = [];

  for (const entry of audit.entries) {
    const decision = entry.decision;
    if (decision.decision === AuthorizationVerdicts.ALLOW) {
      if (!appliedDecisionIds.has(decision.decision_id)) {
        unappliedAllowDecisionIds.push(decision.decision_id);
      }
    } else {
      deniedDecisionIds.push(decision.decision_id);
      if (eventIdentityDigests.has(
        `${decision.requested_event_id}:${decision.requested_event_digest}`,
      )) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.REPLAY_DENIED_EVENT_FOUND,
          'replay',
          'A denied request appears in domain history',
          { decisionId: decision.decision_id, eventId: decision.requested_event_id },
        );
      }
    }

    if (
      decision.reason_code !== AuthorizationReasonCodes.ALLOWED
      && decision.reason_code !== AuthorizationReasonCodes.POLICY_DENIED
    ) {
      continue;
    }
    let policy;
    try {
      policy = policies.resolve(decision.policy_id, decision.policy_version);
    } catch {
      policyDivergences.push(`${decision.decision_id}:policy_missing`);
      continue;
    }
    if (policy.digest !== decision.policy_digest) {
      policyDivergences.push(`${decision.decision_id}:policy_digest`);
      continue;
    }
    let result;
    try {
      result = await policy.evaluate(policyInput(decision));
    } catch {
      policyDivergences.push(`${decision.decision_id}:evaluator_exception`);
      continue;
    }
    if (
      result.verdict !== decision.decision
      || JSON.stringify(sorted(result.matchedRuleIds))
        !== JSON.stringify(sorted(decision.matched_rule_ids))
    ) {
      policyDivergences.push(`${decision.decision_id}:verdict_or_rules`);
    }
  }

  const applied = sorted([...appliedDecisionIds]);
  const unapplied = sorted(unappliedAllowDecisionIds);
  const denied = sorted(deniedDecisionIds);
  const divergences = sorted(policyDivergences);
  const replayDigest = sha256Bytes(canonicalBytes({
    domainHead,
    auditHead: audit.head,
    appliedDecisionIds: applied,
    unappliedAllowDecisionIds: unapplied,
    deniedDecisionIds: denied,
    policyDivergences: divergences,
  }));
  return Object.freeze({
    domainHead,
    auditHead: audit.head,
    appliedDecisionIds: applied,
    unappliedAllowDecisionIds: unapplied,
    deniedDecisionIds: denied,
    policyDivergences: divergences,
    replayDigest,
  });
}
