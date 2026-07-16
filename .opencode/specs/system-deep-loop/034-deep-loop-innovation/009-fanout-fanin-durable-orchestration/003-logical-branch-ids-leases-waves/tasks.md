---
title: "Tasks: Logical Branch IDs, Leases & Waves"
description: "Tasks for stable logical branch registration, fenced worker leases, deterministic wave scheduling, and ledger-driven resume over the capped fan-out pool."
trigger_phrases:
  - "logical branch ids leases waves tasks"
  - "fenced wave scheduling tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
    last_updated_at: "2026-07-15T14:44:21Z"
    last_updated_by: "codex"
    recent_action: "Sequenced branch identity, lease lifecycle, wave scheduling, and resume verification"
    next_safe_action: "Implement T001 through T012 against the phase-005 and phase-007 contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Logical Branch IDs, Leases & Waves

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

- [ ] T001 Pin phase 005's normalized expansion coordinates, logical-ID handoff, invocation fingerprint, and legacy-parity fixtures
- [ ] T002 Pin the phase-006 transition/event vocabulary, phase-007 lease/fence API, and predecessor result-envelope branch reference
- [ ] T003 Inventory every dispatch, status, retry, orphan, salvage, result, terminal, and summary mutation around `fanout-pool.cjs`
- [ ] T004 Freeze manifest-reorder, collision, partial-wave, crash-boundary, duplicate-worker, and stale-resume fixtures
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement versioned logical-branch ID derivation from explicit model ID, branch ID, and replica ordinal
- [ ] T006 Implement directory-safety, canonical-coordinate, alias, and collision validation before any branch is registered
- [ ] T007 Implement immutable idempotent branch registration with manifest, derivation, invocation, wave-plan, and dispatch linkage
- [ ] T008 Implement the canonical `(run_id, logical_branch_id)` protected-resource mapping through the phase-007 registry
- [ ] T009 Implement worker lease acquire, renew, expire, release, takeover, and typed displaced-holder rejection
- [ ] T010 Route dispatch, status, retry, salvage, result, and terminal writes through atomic transition-and-fence validation
- [ ] T011 Implement deterministic wave IDs, ordinals, membership, prerequisites, and immutable plan fingerprints
- [ ] T012 Implement wave admission above `runCappedPool`, preserving the pool's capped work-conserving scheduling and retry semantics
- [ ] T013 Implement durable wave close/advance/stop authorization without absorbing successor budget or partial-failure policy
- [ ] T014 Implement the ledger resume fold for manifest/plan validation, terminal preservation, live-lease retention, expired takeover, and next-wave selection
- [ ] T015 Preserve the legacy flat-pool/status path as authoritative while durable orchestration runs additive-dark
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Verify branch IDs remain stable across reorder, restart, host/time changes, retries, and waves; unsafe, aliased, and colliding inputs fail closed
- [ ] T017 Verify identical registration is idempotent and conflicting coordinates, derivation versions, or fingerprints cannot reuse an ID
- [ ] T018 Verify every dispatch receipt, attempt, result envelope, salvage record, and terminal event resolves exactly one registered branch
- [ ] T019 Verify expired-worker takeover advances the fence and rejects every stale dispatch, status, retry, salvage, result, and terminal mutation
- [ ] T020 Verify wave compilation is deterministic and no future-wave item enters the pool before durable advance authorization
- [ ] T021 Verify `runCappedPool` retains baseline concurrency, work conservation, retry, stall, orphan, ordered-settlement, and summary behavior
- [ ] T022 Verify crashes after each ledger boundary resume without rerunning terminal branches or changing the current/next wave
- [ ] T023 Verify manifest drift, plan drift, unknown versions, ambiguous lease state, unsupported atomicity, and ledger-head conflict all block dispatch
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
