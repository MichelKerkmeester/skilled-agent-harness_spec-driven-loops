---
title: "Tasks: static reference-rewrite executor (017 phase 005.004)"
description: "Tasks for the static reference-rewrite executor: ledger/map loading, preimage-keyed planning, dependency-closed batching, compare-and-swap apply, dynamic-site routing, idempotency, and rollback."
trigger_phrases:
  - "reference-rewrite executor tasks"
  - "compare-and-swap rewrite tasks"
  - "preimage blob rewrite tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the static reference-rewrite executor task contract"
    next_safe_action: "Implement the setup tasks after phases 002 and 006 contracts are available"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Task evidence comes from disposable repositories or read-only plan output, never from a real migration run."
---
# Tasks: Static Reference-Rewrite Executor

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

- [ ] T001 Record the rewrite-plan schema, preimage hashing rule, batch identity, and site state model shared with phases 002 and 006.
- [ ] T002 Define the static reference classes the executor rewrites and the dynamic-site dispositions it routes or flags.
- [ ] T003 [P] Seed disposable Git repositories containing each static reference class, an exempt/generated surface, a dynamic site, and a mutated-blob drift case.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Load the phase 002 ledger and phase 006 map; reject any site that has no corresponding map entry.
- [ ] T005 Plan per-site rewrites keyed to the preimage blob hash and semantic site ID, grouped by dependency-closed batch.
- [ ] T006 Implement the compare-and-swap apply gate: a matched preimage rewrites the site, a mismatch regenerates that batch's plan.
- [ ] T007 Implement deterministic dry-run output and require an explicit apply action before any write.
- [ ] T008 Route dynamic reference sites to their producer or flag them with a reason; never patch a guessed dynamic path.
- [ ] T009 Implement idempotent reruns and an inverse rewrite journal that supports batch rollback after an apply failure.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify: Dry-run produces zero writes, index changes, or partial rewrites in a disposable Git repository.
- [ ] T011 Verify: Only sites present in the phase 002 ledger are rewritten; each rewrite cites its ledger site ID and map entry.
- [ ] T012 Verify: A mutated-blob fixture regenerates its batch plan and never receives the stale textual patch.
- [ ] T013 Verify: Regenerating one drifted batch touches no site of any other batch.
- [ ] T014 Verify: Exempt/generated surfaces are skipped and dynamic sites are routed or flagged with a reason.
- [ ] T015 Verify: An injected apply failure is reported and the inverse journal restores the completed portion of the batch.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All executor tasks complete with evidence in the phase checklist.
- [ ] All requirements in `spec.md` meet their acceptance criteria.
- [ ] The executor's rewrite plan and journal are consumable by the phase 003 harness and the verify agent.
- [ ] No real repository migration was executed as part of this phase's implementation evidence.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Ledger input**: See `../002-reference-checker-and-disposition-ledger/spec.md`
- **Map input**: See `../../006-inventory-and-frozen-map/spec.md`
- **Parent map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
