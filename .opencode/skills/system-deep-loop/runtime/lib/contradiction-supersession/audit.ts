// ───────────────────────────────────────────────────────────────────
// MODULE: Contradiction and Supersession Audit
// ───────────────────────────────────────────────────────────────────

import {
  CLAIM_RELATIONSHIP_REDUCER_VERSION,
  RelationshipEventTypes,
} from './event-registry.js';
import { replayClaimRelationships } from './replay.js';

import type {
  JsonObject,
} from '../event-envelope/index.js';
import type {
  ContradictionEventPayload,
  RelationshipAppendReceiptEvidence,
  RelationshipAuditRecord,
  RelationshipAuditReport,
  RelationshipAuditResult,
  RelationshipAuthorizationReference,
  SupersessionEventPayload,
} from './types.js';
import type { ReplayClaimRelationshipsInput } from './replay.js';

function authorizationReference(
  input: Readonly<{
    audit_ledger_id: string;
    audit_sequence: number;
    audit_record_hash: string;
    decision_id: string;
    decision_digest: string;
    request_digest: string;
    policy_digest: string;
    authority_epoch: number;
  }>,
): RelationshipAuthorizationReference {
  return Object.freeze({ ...input });
}

function appendReceipt(
  input: Readonly<{
    ledger_id: string;
    sequence: number;
    event_id: string;
    event_type: string;
    event_version: number;
    stream_id: string;
    stream_sequence: number;
    committed_at: string;
  }>,
): RelationshipAppendReceiptEvidence {
  return Object.freeze({ ...input });
}

/** Build an immutable audit view only after replay and fingerprint verification succeed. */
export async function auditClaimRelationships(
  input: ReplayClaimRelationshipsInput,
): Promise<RelationshipAuditResult> {
  const replay = await replayClaimRelationships(input);
  if (!replay.ok) return replay;
  const events = await input.ledger.readVerifiedEvents();
  const records = events.map((verified): RelationshipAuditRecord => {
    const envelope = verified.event.effective.envelope;
    const payload = envelope.payload as unknown as
      ContradictionEventPayload | SupersessionEventPayload;
    const claimIds = envelope.event_type === RelationshipEventTypes.CONTRADICTION_RECORDED
      ? [
        (payload as ContradictionEventPayload).left_claim_id,
        (payload as ContradictionEventPayload).right_claim_id,
      ]
      : [
        (payload as SupersessionEventPayload).predecessor_claim_id,
        (payload as SupersessionEventPayload).successor_claim_id,
      ];
    return Object.freeze({
      event_id: envelope.event_id,
      event_type: envelope.event_type,
      event_version: envelope.event_version,
      ledger_sequence: verified.frame.sequence,
      relationship_id: payload.relationship_id,
      relation_action: payload.relation_action,
      retracts_event_id: payload.retracts_event_id ?? null,
      claim_ids: claimIds,
      evidence_refs: payload.evidence_refs.map((reference) => ({ ...reference })),
      evidence_snapshot_ref: payload.evidence_snapshot_ref,
      detector_version: payload.detector_version,
      reducer_version: CLAIM_RELATIONSHIP_REDUCER_VERSION,
      authorization_reference: authorizationReference(verified.frame.authorization_ref),
      append_receipt: appendReceipt(verified.frame.receipt),
    });
  });
  const report: RelationshipAuditReport = Object.freeze({
    projection: replay.projection,
    records: Object.freeze(records) as unknown as RelationshipAuditRecord[],
    replay_fingerprint: replay.fingerprint.descriptor.final_digest,
    event_registry_digest: input.eventRegistry.digest,
    reducer_version: CLAIM_RELATIONSHIP_REDUCER_VERSION,
  });
  return Object.freeze({ ok: true, report });
}

/** Narrow an audit report to canonical JSON for external evidence stores. */
export function claimRelationshipAuditAsJson(
  report: RelationshipAuditReport,
): Readonly<JsonObject> {
  return report;
}
