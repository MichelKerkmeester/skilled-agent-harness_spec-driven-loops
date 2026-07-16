---
title: "Tasks: Deep Improvement Common Services - Resume Adapter"
description: "Tasks for planning and verifying the sealed-ledger resume adapter, continuity-ladder reducers, idempotent re-entry, and shared evaluator, canary, and guarded-promotion services."
trigger_phrases:
  - "deep improvement resume adapter tasks"
  - "sealed ledger resume tasks"
  - "deep improvement common services tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
    last_updated_at: "2026-07-15T20:40:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined implementation and verification work for ledger-only re-entry"
    next_safe_action: "Build the continuity-ladder state and crash fixture matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Common Services - Resume Adapter

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

- [ ] T001 Confirm the phase-012 shared mode handoff, typed ledger/reducer contracts, and `004-certificates-and-receipts` navigation contract are available for implementation
- [ ] T002 Inventory deep-improvement common event types, sealed artifacts, receipts, interruption points, and existing evaluator/canary/promotion state
- [ ] T003 Freeze the continuity-ladder levels, source-event matrix, replay-fingerprint inputs, and adversarial fixture corpus
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the sealed-ledger read context with seal verification, event-range selection, schema/upcaster identity, reducer identity, and stable replay fingerprint
- [ ] T005 Add deterministic reducers for run/lineage, candidate, evaluator, score, canary, promotion, terminal, and blocked projections
- [ ] T006 Add the continuity-ladder mapper with explicit `reuse`, `reexecute`, `compensate`, `reject`, and `unknown` outcomes
- [ ] T007 Add the idempotent resume request and re-entry receipt contract with stable logical effect IDs, changing attempt IDs, and conflicting-key rejection
- [ ] T008 Add the shared evaluator service contract for evaluator capsules, raw observations, score revisions, uncertainty, and evidence sufficiency
- [ ] T009 Add the shared canary service contract for sealed epochs, candidate aliases, leak vetoes, cross-domain health, and immutable receipts
- [ ] T010 Add the guarded-promotion service contract for the evidence lattice, explicit decision states, quarantine, and shadow-only application
- [ ] T011 Add consumer adapters for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` without duplicating common service writes
- [ ] T012 Add crash, duplicate, effect-ambiguous, mixed-version, changed-manifest, evaluator-drift, canary-drift, and promotion-drift fixtures
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify: Rebuilding one sealed ledger range repeatedly yields identical projections and resume fingerprints - No mutable checkpoint or process-local state is read
- [ ] T014 Verify: Every continuity-ladder level has one explicit re-entry decision - Unmapped, ambiguous, or incompatible state fails closed
- [ ] T015 Verify: Exact duplicate resume requests return one prior receipt - Conflicting payloads under an existing idempotency key are rejected
- [ ] T016 Verify: Branch-local successes survive interruption - Incomplete external effects remain `UNKNOWN` and follow the explicit effect policy
- [ ] T017 Verify: Event-level replay compatibility is enforced - Unknown types, unsupported versions, broken upcasters, and reducer drift cannot re-enter
- [ ] T018 Verify: Evaluator observations and score revisions replay from the sealed capsule - Prior raw evidence remains immutable and insufficient evidence stays visible
- [ ] T019 Verify: Canary epochs are sealed and independent - Leak vetoes, cross-domain regressions, and unknown coverage prevent promotion
- [ ] T020 Verify: Promotion consumes the complete evidence lattice - Target score alone cannot produce `PROMOTE`
- [ ] T021 Verify: All three benchmark variants consume one common service contract - Shadow resume and promotion do not alter legacy authority
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/replay/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
