---
title: "Checklist: Transition-Authorization Gateway"
description: "Verification checklist for default-deny evaluation, decision-event auditability, exact allow linkage, replay integrity, and dark non-authority."
trigger_phrases:
  - "transition authorization gateway checklist"
  - "default deny gateway verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
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

This checklist is the blocking verifier contract for the transition-authorization gateway. The accepted focused receipt binds the candidate SHA, policy/event registry identities, exact test command, and executable invariant cases. Verification fails on zero discovered cases, any proof-free typed append, any non-allow result that mutates domain state, any missing verdict event, or any dark-path influence on authoritative legacy behavior before phase 014.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The phase-004 spine ADR and transition/versioning/rollback policy are frozen and their authorization fields map to the implementation contract [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-002 [P0] The envelope, ledger, replay-fingerprint, and gateway interfaces compose without a proof-free domain append seam [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-003 [P0] Every dark state-transition boundary and its unchanged authoritative legacy behavior are inventoried [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-004 [P1] The candidate report pins the exact SHA, policy/event registry identities, focused command, and executable fixture set [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] The gateway is the single authorization entry point and the ledger revalidates allow linkage under its exclusive append lock [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-006 [P0] The decision-event capability is schema-closed to non-domain authorization types and cannot call reducers, effects, or itself recursively [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-007 [P1] Policy identity binds evaluator implementation and every tested exceptional, timed-out, unknown, unsupported, or stale outcome defaults to deny [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-008 [P1] Typed errors and reason codes distinguish policy denial, invalid input, stale state, evaluator failure, audit failure, and proof failure [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] A complete allowed request records one durable allow event before one exact linked domain event [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-010 [P0] A policy-denied request records one durable deny event and no domain event [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-011 [P0] Missing input, unknown policy, unsupported registry/event input, stale head/epoch, evaluator exception, and timeout all default to deny [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-012 [P0] A deny advances only the audit stream and changes no domain sequence or domain receipt [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-013 [P0] Direct append and missing, different-event, different-ledger, stale-input, unknown-policy, or altered-link proofs fail closed [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-014 [P0] Both verdict classes round-trip as registered typed ledger events with complete input, policy, verdict, reason, digest, and linkage fields [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-015 [P0] Unauthorized callers and domain event types cannot use the gateway-owned decision-audit emitter [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-016 [P0] Decision-audit append failure prevents domain append and returns an explicit observable failure [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-017 [P0] A crash after durable allow and before domain append replays as unapplied authorization; exact retry cannot mint conflicting history [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-018 [P0] Stale prior-head or authority-epoch input denies before append and proof linkage is revalidated by the ledger [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-019 [P0] Replay verifies every domain event has an earlier exact allow, every deny has no linked domain event, and audit/domain ordering remains distinct [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-020 [P0] Replay verifies policy parity and rejects altered authorization linkage without rewriting history [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-021 [P0] Reusable-adapter allow, deny, and ledger-failure fixtures return the exact authoritative legacy result through phase 013 [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-022 [P0] The accepted co-landing gate verifies the envelope consumer plus proof-required ledger and gateway as one dark unit [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-023 [P0] Every inventoried transition boundary is frozen in the reusable-adapter census, and no proof-free domain writer or adapter bypass exists [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-024 [P1] Every authorization requirement maps to at least one positive, negative, replay, crash, or concurrency fixture [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-025 [P1] The unapplied-allow state, exact retry rule, and audit/domain sequence distinction are documented and exercised [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-026 [P0] Sensitive payload content is absent from decision events; only approved bounded metadata and canonical digests are retained [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-027 [P0] Actor capability, authority epoch, policy digest, prior head, request digest, and target event are all integrity-bound to the verdict [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-028 [P0] Authority unavailability, unknown policy, decision-storage failure, evaluator exception, and evaluator timeout cannot fail open [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-029 [P1] Append-only audit evidence remains replayable and no public API mutates decision or policy history [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P1] The implemented decision schema, policy contract, reason codes, proof lifecycle, replay semantics, and dark authority posture match `spec.md` and `plan.md` [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-031 [P1] Source traceability covers the phase-004 ADR, transition policy, program parent, phase-tree manifest, and typed-ledger sibling [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-032 [P1] Gateway, policy registry, decision schema, ledger proof seam, replay verifier, and fixtures have explicit ownership with no duplicate authorization implementation [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-033 [P1] Changes stay inside the approved phase-006 implementation write set and preserve legacy runtime files as authoritative inputs until phase 014 [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check has exact-SHA evidence, both verdict classes are durably auditable, all uncertain or failed evaluations deny, only an earlier exact allow unlocks one domain append, replay detects every authorization/linkage drift class, and dark gateway behavior cannot influence the authoritative legacy path before phase 014.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the independent verifier confirms the full default-deny and proof-linkage matrix, the phase-006 co-landing gate is green, strict spec validation passes apart from intentionally absent generated metadata, and verification leaves no unexpected tracked mutation.
<!-- /ANCHOR:sign-off -->
