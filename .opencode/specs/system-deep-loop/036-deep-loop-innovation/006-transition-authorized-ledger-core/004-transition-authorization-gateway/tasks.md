---
title: "Tasks: Transition-Authorization Gateway"
description: "Tasks for the default-deny transition gateway, versioned decision events, exact allow linkage, replay audit, and dark ledger integration."
trigger_phrases:
  - "transition authorization gateway tasks"
  - "default deny gateway tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Mapped gateway implementation and verification tasks"
    next_safe_action: "Implement the default-deny evaluator before exposing the typed append path"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Transition-Authorization Gateway

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the authorization input, policy, verdict, reason-code, and linkage vocabulary against the phase-004 contracts [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T002 Confirm the envelope exposes canonical request bytes and the ledger exposes no proof-free domain append [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T003 Define the gateway-only non-domain decision-event capability and its prohibition on domain types, reducers, effects, and recursive authorization [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T004 Inventory every dark state-transition emission boundary and map it to the authoritative legacy behavior that must remain unchanged [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T005 Build fixtures for allow, policy deny, malformed input, unknown policy, stale head/epoch, evaluator failure, audit-storage failure, and proof mismatch [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Implement the canonical authorization-request builder with complete-field and request-digest validation [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T007 Implement the immutable policy registry keyed by policy ID, version, digest, and evaluator version [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T008 Implement deterministic policy evaluation over verified prior state, actor capability, authority epoch, and invariant evidence [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T009 Normalize every tested incomplete, unknown, stale, unsupported, exceptional, or timed-out result to a typed deny [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T010 Register the typed authorization-decision event containing complete input, policy, verdict, reason, and decision-digest fields [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T011 Implement the gateway-owned audit emitter and prevent every other caller or event type from using it [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T012 Implement bounded rejection metadata that excludes sensitive request payload content [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T013 Implement under-lock proof validation for verdict, request, prior head, authority epoch, policy digest, target event, freshness, and single use [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T014 Implement explicit unapplied-allow handling and exact idempotent retry after post-decision/pre-domain-append failure [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T015 Implement replay/audit reconstruction and deterministic policy re-evaluation without history mutation [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T016 Implement the reusable dark adapter and frozen transition-boundary census while preserving existing legacy writers and exact legacy results [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T017 Bind authorization-decision, policy, prior-head, authority-epoch, and target-event linkage into authorization replay inputs and reports [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Verify every non-allow and failure row defaults to deny before domain sequence allocation [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T019 Verify both allow and deny verdicts are durable typed ledger events in the non-domain authorization-audit stream [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T020 Verify a deny advances only the audit stream and changes no domain head or receipt [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T021 Verify an exact allow event precedes and unlocks only its single matching domain event [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T022 Verify direct, missing, different-event, different-ledger, stale-input, unknown-policy, and altered-link cases fail closed [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T023 Verify decision-audit storage failure prevents domain append and post-allow crash replay reports an unapplied authorization [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T024 Verify replay reproduces audit/domain ordering, allow linkage, deny absence, policy parity, and unapplied authorization [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T025 Verify reusable-adapter allow, deny, and typed-ledger failure cases return the exact authoritative legacy result through phase 013 [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T026 Run the accepted focused co-landing gate and prove no typed domain append succeeds without the gateway [evidence: The relevant gateway/ledger module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. [evidence: T001-T026 are checked above against focused source and executable evidence.]
- [x] All requirements in spec.md met with evidence. [evidence: the implementation summary maps gateway requirements to the accepted invariant proofs.]
- [x] Phase gate green (validate/typecheck/focused test). [evidence: final commands and exits are recorded in `implementation-summary.md`.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
