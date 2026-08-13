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
    last_updated_at: "2026-07-20T19:09:21Z"
    last_updated_by: "codex"
    recent_action: "Completed policy authoring and challenge verification"
    next_safe_action: "Phase 006 implements the first conforming typed writer"
    blockers: []
    key_files:
      - "transition-versioning-and-rollback-policy.md"
      - "implementation-summary.md"
    completion_pct: 100
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

- [x] T001 Extract and cite parent Sequencing Invariants 2, 3, 7, and 8 as the policy's non-negotiable constraints [File: transition-versioning-and-rollback-policy.md:27]
- [x] T002 Extract and cite the manifest `migration_model` and phases 003, 005, and 011 outcomes [File: transition-versioning-and-rollback-policy.md:27]
- [x] T003 Confirm `depends_on: []`, planning-only scope, Level 2 structure, and the phases 006-015 downstream boundary [File: spec.md:45]
- [x] T004 Freeze the event, compatibility, authorization, authority-state, certificate, and rollback vocabulary [File: transition-versioning-and-rollback-policy.md:38]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define the canonical event envelope, stable type discriminator, positive per-type version, and version registry rules [File: transition-versioning-and-rollback-policy.md:56]
- [x] T006 Define latest-version-only writes, supported-old reads, forward-safe refusal, compatible-reader routing, and mixed-version replay behavior [File: transition-versioning-and-rollback-policy.md:90]
- [x] T007 Define pure adjacent-version upcasters, chain composition, source preservation, determinism, and fail-closed gap or loss handling [File: transition-versioning-and-rollback-policy.md:105]
- [x] T008 Define the authorization request inputs, current-state binding, actor capability, invariant evidence, policy version, and authority epoch [File: transition-versioning-and-rollback-policy.md:127]
- [x] T009 Define allow/deny decision fields, atomic append semantics, stale-state behavior, idempotency binding, and gateway-outage denial [File: transition-versioning-and-rollback-policy.md:142]
- [x] T010 Define bounded rejection receipts that preserve auditability without advancing domain state or exposing sensitive payloads [File: transition-versioning-and-rollback-policy.md:168]
- [x] T011 Define the per-mode authority state machine, legal edges, one-writer invariant, monotonic epochs, and compare-and-swap rules [File: transition-versioning-and-rollback-policy.md:174]
- [x] T012 Define shadow-parity readiness evidence and the cutover certificate consumed by phase 014 [File: transition-versioning-and-rollback-policy.md:204]
- [x] T013 Define the minimum 14-day/five-successful-run rollback window, extension conditions, retained assets, and closure gate [File: transition-versioning-and-rollback-policy.md:210]
- [x] T014 Define rollback triggers, admission freeze, spine fencing, state reconciliation, legacy restoration, and rollback certificates [File: transition-versioning-and-rollback-policy.md:238]
- [x] T015 Build the phases 006-015 conformance matrix and prohibit downstream weakening or local redefinition [File: transition-versioning-and-rollback-policy.md:258]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Verify supported historical events reach the current shape through deterministic complete chains while stored bytes remain unchanged [File: transition-versioning-and-rollback-policy.md:281]
- [x] T017 Verify unknown types, future versions, missing links, lossy transforms, and malformed envelopes fail closed [File: transition-versioning-and-rollback-policy.md:282]
- [x] T018 Verify missing authorization data, stale state or epoch, unknown rules, duplicate requests, and gateway outage create no domain mutation [File: transition-versioning-and-rollback-policy.md:284]
- [x] T019 Verify illegal authority edges, simultaneous writers, cross-mode flips, and unresolved shadow divergences block cutover [File: transition-versioning-and-rollback-policy.md:289]
- [x] T020 Verify rollback window closure waits for both 14 days and five successful authoritative runs and extends on unresolved evidence [File: transition-versioning-and-rollback-policy.md:291]
- [x] T021 Tabletop a mid-window rollback and verify no event deletion, new-epoch legacy restoration, bounded reconciliation, and certificate emission [File: transition-versioning-and-rollback-policy.md:293]
- [x] T022 Verify source phases 003, 005, and 011 retain their manifest ownership while every consumer phase 006-015 has a conformance obligation [File: transition-versioning-and-rollback-policy.md:258]
- [x] T023 Run strict spec-kit validation and require Errors 0 with no strict-mode warning [File: implementation-summary.md:116]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All policy-authoring and challenge tasks complete
- [x] All requirements in spec.md are ratified with traceable review evidence
- [x] The leaf handoff records this contract as frozen before program phase 006 begins
- [x] Strict validation exits 0 with Errors 0 and Warnings 0
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Ratified policy**: See `transition-versioning-and-rollback-policy.md`
- **Completion evidence**: See `implementation-summary.md`
- **Program source**: See `../../spec.md` and `../../manifest/phase-tree.json`
<!-- /ANCHOR:cross-refs -->
