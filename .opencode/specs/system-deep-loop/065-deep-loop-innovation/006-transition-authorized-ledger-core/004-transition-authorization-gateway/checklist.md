---
title: "Checklist: Transition-Authorization Gateway"
description: "Verification checklist for default-deny evaluation, decision-event auditability, exact allow linkage, replay integrity, and dark non-authority."
trigger_phrases:
  - "transition authorization gateway checklist"
  - "default deny gateway verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined P0 verification for default-deny and decision-event auditability"
    next_safe_action: "Run the gateway matrix against allow, deny, stale, malformed, and failure cases"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Transition-Authorization Gateway

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the transition-authorization gateway. Each implementation receipt must bind the exact candidate SHA, policy-registry digest, event-registry digest, replay-fingerprint version, and fixture manifest. Verification fails on zero discovered cases, any proof-free typed append, any non-allow result that mutates domain state, any missing verdict event, or any dark-path influence on authoritative legacy behavior before phase 014.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-004 spine ADR and transition/versioning/rollback policy are frozen and their authorization fields map to the implementation contract
- [ ] CHK-002 [P0] The envelope, ledger, replay-fingerprint, and gateway interfaces compose without a proof-free domain append seam
- [ ] CHK-003 [P0] Every dark state-transition boundary and its unchanged authoritative legacy behavior are inventoried
- [ ] CHK-004 [P1] The candidate report pins the exact SHA, policy-registry digest, event-registry digest, fingerprint version, and fixture manifest
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The gateway is the single authorization entry point and the ledger revalidates allow linkage under its exclusive append lock
- [ ] CHK-006 [P0] The decision-event capability is schema-closed to non-domain authorization types and cannot call reducers, effects, or itself recursively
- [ ] CHK-007 [P1] Policy evaluation is deterministic and side-effect-free; no clock, network, mutable global, or permissive fallback can produce allow
- [ ] CHK-008 [P1] Typed errors and reason codes distinguish policy denial, invalid input, stale state, evaluator failure, audit failure, and proof failure
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] A complete allowed request records one durable allow event before one exact linked domain event
- [ ] CHK-010 [P0] A policy-denied request records one durable deny event and no domain event
- [ ] CHK-011 [P0] Missing input, malformed canonical bytes, unknown policy/rule, unsupported type/version, stale head/epoch, evaluator exception, timeout, and ambiguity all default to deny
- [ ] CHK-012 [P0] A deny changes no domain sequence, projection, idempotency success, receipt, budget, admission, or side effect
- [ ] CHK-013 [P0] Direct append and missing, deny, wrong-request, wrong-head, wrong-epoch, wrong-policy, wrong-event, stale, reused, or tampered proofs fail closed
- [ ] CHK-014 [P0] Both verdict classes round-trip as registered typed ledger events with complete input, policy, verdict, reason, digest, and linkage fields
- [ ] CHK-015 [P0] Unauthorized callers and domain event types cannot use the gateway-owned decision-audit emitter
- [ ] CHK-016 [P0] Decision-audit append failure prevents domain append and returns an explicit observable failure
- [ ] CHK-017 [P0] A crash after durable allow and before domain append replays as unapplied authorization; exact retry cannot mint conflicting history
- [ ] CHK-018 [P0] Concurrent head or authority-epoch change after evaluation invalidates the allow under the ledger lock
- [ ] CHK-019 [P0] Replay verifies every domain event has an earlier exact allow, every deny has no linked domain event, and audit/domain ordering remains distinct
- [ ] CHK-020 [P0] Replay detects request, policy, evaluator, verdict, decision-digest, head, epoch, target-event, and linkage mutation without rewriting history
- [ ] CHK-021 [P0] Gateway allow, deny, evaluator failure, and ledger failure fixtures leave authoritative legacy state, output, control flow, and effects unchanged through phase 013
- [ ] CHK-022 [P0] The phase-006 parent gate fails if the ledger, envelope, fingerprints, and gateway do not co-land as one dark unit
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P0] Every inventoried typed transition boundary routes through the gateway and no direct writer, test helper, recovery path, or adapter bypass remains
- [ ] CHK-024 [P1] Every authorization requirement maps to at least one positive, negative, replay, crash, or concurrency fixture
- [ ] CHK-025 [P1] The unapplied-allow state, exact retry rule, and audit/domain sequence distinction are documented and exercised
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-026 [P0] Sensitive payload content is absent from decision events; only approved bounded metadata and canonical digests are retained
- [ ] CHK-027 [P0] Actor capability, authority epoch, policy digest, prior head, request digest, and target event are all integrity-bound to the verdict
- [ ] CHK-028 [P0] Gateway unavailability, policy-registry corruption, decision-storage failure, and unexpected evaluator output cannot fail open
- [ ] CHK-029 [P1] Audit access and retention preserve decision evidence without granting authority to mutate domain state or policy history
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-030 [P1] The implemented decision schema, policy contract, reason codes, proof lifecycle, replay semantics, and dark authority posture match `spec.md` and `plan.md`
- [ ] CHK-031 [P1] Source traceability covers the phase-004 ADR, transition policy, program parent, phase-tree manifest, and typed-ledger sibling
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-032 [P1] Gateway, policy registry, decision schema, ledger proof seam, replay verifier, and fixtures have explicit ownership with no duplicate authorization implementation
- [ ] CHK-033 [P1] Changes stay inside the approved phase-006 implementation write set and preserve legacy runtime files as authoritative inputs until phase 014
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check has exact-SHA evidence, both verdict classes are durably auditable, all uncertain or failed evaluations deny, only an earlier exact allow unlocks one domain append, replay detects every authorization/linkage drift class, and dark gateway behavior cannot influence the authoritative legacy path before phase 014.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the independent verifier confirms the full default-deny and proof-linkage matrix, the phase-006 co-landing gate is green, strict spec validation passes apart from intentionally absent generated metadata, and verification leaves no unexpected tracked mutation.
<!-- /ANCHOR:sign-off -->
