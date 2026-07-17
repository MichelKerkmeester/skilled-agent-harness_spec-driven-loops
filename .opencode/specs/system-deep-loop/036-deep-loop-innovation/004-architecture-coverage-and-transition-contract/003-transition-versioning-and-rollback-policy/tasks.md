---
title: "Tasks: Transition, Versioning & Rollback Policy"
description: "Tasks for authoring, challenging, tracing, and ratifying the transition, versioning, authority-cutover, and rollback-window contract."
trigger_phrases:
  - "transition versioning rollback policy tasks"
  - "event upcaster cutover contract tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Created the policy authoring and verification task sequence"
    next_safe_action: "Execute the source trace and policy challenge tasks in order"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Transition, Versioning & Rollback Policy

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

- [ ] T001 Extract and cite parent Sequencing Invariants 2, 3, 7, and 8 as the policy's non-negotiable constraints
- [ ] T002 Extract and cite the manifest `migration_model` and phases 003, 005, and 011 outcomes
- [ ] T003 Confirm `depends_on: []`, planning-only scope, Level 2 structure, and the phases 003-012 downstream boundary
- [ ] T004 Freeze the event, compatibility, authorization, authority-state, certificate, and rollback vocabulary
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the canonical event envelope, stable type discriminator, positive per-type version, and version registry rules
- [ ] T006 Define latest-version-only writes, supported-old reads, forward-safe refusal, compatible-reader routing, and mixed-version replay behavior
- [ ] T007 Define pure adjacent-version upcasters, chain composition, source preservation, determinism, and fail-closed gap or loss handling
- [ ] T008 Define the authorization request inputs, current-state binding, actor capability, invariant evidence, policy version, and authority epoch
- [ ] T009 Define allow/deny decision fields, atomic append semantics, stale-state behavior, idempotency binding, and gateway-outage denial
- [ ] T010 Define bounded rejection receipts that preserve auditability without advancing domain state or exposing sensitive payloads
- [ ] T011 Define the per-mode authority state machine, legal edges, one-writer invariant, monotonic epochs, and compare-and-swap rules
- [ ] T012 Define shadow-parity readiness evidence and the cutover certificate consumed by phase 014
- [ ] T013 Define the minimum 14-day/five-successful-run rollback window, extension conditions, retained assets, and closure gate
- [ ] T014 Define rollback triggers, admission freeze, spine fencing, state reconciliation, legacy restoration, and rollback certificates
- [ ] T015 Build the phases 003-012 conformance matrix and prohibit downstream weakening or local redefinition
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Verify supported historical events reach the current shape through deterministic complete chains while stored bytes remain unchanged
- [ ] T017 Verify unknown types, future versions, missing links, lossy transforms, and malformed envelopes fail closed
- [ ] T018 Verify missing authorization data, stale state or epoch, unknown rules, duplicate requests, and gateway outage create no domain mutation
- [ ] T019 Verify illegal authority edges, simultaneous writers, cross-mode flips, and unresolved shadow divergences block cutover
- [ ] T020 Verify rollback window closure waits for both 14 days and five successful authoritative runs and extends on unresolved evidence
- [ ] T021 Tabletop a mid-window rollback and verify no event deletion, new-epoch legacy restoration, bounded reconciliation, and certificate emission
- [ ] T022 Verify phases 003, 005, 011, and 012 retain their manifest ownership and every phase 006-012 has a conformance obligation
- [ ] T023 Run strict spec-kit validation and confirm only deterministic metadata omissions remain
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All policy-authoring and challenge tasks complete
- [ ] All requirements in spec.md are ratified with traceable review evidence
- [ ] The architecture-parent handoff records this contract as frozen before program phase 006 begins
- [ ] Strict validation has no error except expected missing `description.json` and `graph-metadata.json`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Program source**: See `../../spec.md` and `../../manifest/phase-tree.json`
<!-- /ANCHOR:cross-refs -->

