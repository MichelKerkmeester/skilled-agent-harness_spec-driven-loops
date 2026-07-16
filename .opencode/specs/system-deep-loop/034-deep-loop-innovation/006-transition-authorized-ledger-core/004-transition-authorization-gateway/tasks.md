---
title: "Tasks: Transition-Authorization Gateway"
description: "Tasks for the default-deny transition gateway, versioned decision events, exact allow linkage, replay audit, and dark ledger integration."
trigger_phrases:
  - "transition authorization gateway tasks"
  - "default deny gateway tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
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

- [ ] T001 Freeze the authorization input, policy, verdict, reason-code, and linkage vocabulary against the phase-004 contracts
- [ ] T002 Confirm the envelope exposes canonical request bytes and the ledger exposes no proof-free domain append
- [ ] T003 Define the gateway-only non-domain decision-event capability and its prohibition on domain types, reducers, effects, and recursive authorization
- [ ] T004 Inventory every dark state-transition emission boundary and map it to the authoritative legacy behavior that must remain unchanged
- [ ] T005 Build fixtures for allow, policy deny, malformed input, unknown policy, stale head/epoch, evaluator failure, audit-storage failure, and proof mismatch
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Implement the canonical authorization-request builder with complete-field and request-digest validation
- [ ] T007 Implement the immutable policy registry keyed by policy ID, version, digest, and evaluator version
- [ ] T008 Implement deterministic policy evaluation over verified prior state, actor capability, authority epoch, and invariant evidence
- [ ] T009 Normalize every incomplete, unknown, stale, unsupported, exceptional, timed-out, or ambiguous result to a typed deny
- [ ] T010 Register the typed authorization-decision event containing complete input, policy, verdict, reason, and decision-digest fields
- [ ] T011 Implement the gateway-owned audit emitter and prevent every other caller or event type from using it
- [ ] T012 Implement bounded rejection metadata that excludes sensitive request payload content
- [ ] T013 Implement under-lock proof validation for verdict, request, prior head, authority epoch, policy digest, target event, freshness, and single use
- [ ] T014 Implement explicit unapplied-allow handling and exact idempotent retry after post-decision/pre-domain-append failure
- [ ] T015 Implement replay/audit reconstruction and deterministic policy re-evaluation without history mutation
- [ ] T016 Integrate the gateway at every dark transition boundary while preserving legacy control flow, persistence, output, and effects
- [ ] T017 Bind authorization-decision and target-event linkage into the replay-fingerprint inputs
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Verify every non-allow and failure row defaults to deny before domain sequence allocation
- [ ] T019 Verify both allow and deny verdicts are durable typed ledger events in the non-domain authorization-audit stream
- [ ] T020 Verify a deny changes no domain head, projection, idempotency success, receipt, or effect
- [ ] T021 Verify an exact allow event precedes and unlocks only its single matching domain event
- [ ] T022 Verify direct, missing, deny, stale, mismatched, reused, tampered, and unknown-policy proofs fail closed
- [ ] T023 Verify decision-audit storage failure prevents domain append and post-allow crash replay reports an unapplied authorization
- [ ] T024 Verify replay reproduces decision order and detects request, policy, verdict, head, epoch, or linkage drift
- [ ] T025 Verify gateway allow, deny, and failure cases leave authoritative legacy outputs and effects unchanged through phase 013
- [ ] T026 Run the phase-006 parent co-landing gate and prove no typed writer can ship before the gateway
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
