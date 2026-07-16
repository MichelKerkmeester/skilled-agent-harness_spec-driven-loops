---
title: "Tasks: partial-failure policy"
description: "Tasks for implementing and verifying typed leaf failures, quorum evaluation, degraded results, and ledgered fan-in abort decisions."
trigger_phrases:
  - "partial-failure policy tasks"
  - "durable fan-in failure tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined implementation and verification tasks"
    next_safe_action: "Start with the policy input and failure schemas"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Partial-Failure Policy

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

- [ ] T001 Pin BASE and read phase 003's protected-contract-versus-known-defect classification for fan-out failures
- [ ] T002 Freeze the child-004 await-set/decision-boundary input and child-006 reduction handoff schemas
- [ ] T003 Inventory current executor, timeout, signal, artifact, salvage, retry, summary, and exit-code behavior in `fanout-run.cjs` and `fanout-pool.cjs`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define the versioned leaf-failure envelope and bounded failure taxonomy
- [ ] T005 Implement deterministic classification for executor, timeout, signal, artifact, parse, salvage, policy, budget, and integrity failures
- [ ] T006 Project the immutable admitted set and decision epoch from canonical dispatch receipts
- [ ] T007 Implement strict, quorum, deadline, and progressive evaluation with the two-thirds default
- [ ] T008 Apply fatal integrity overrides before count/fraction threshold evaluation
- [ ] T009 Append idempotent leaf-failure, policy-evaluation, degraded, abort, and late-result events through transition authorization
- [ ] T010 Mark sufficient partial result envelopes as degraded with counts, failed branch IDs, reason codes, and policy receipt
- [ ] T011 Gate child-006 reduction so only validated successful envelopes accompany `proceed|proceed_degraded`
- [ ] T012 Add the dark compatibility projection against legacy `ok|partial` status and exit codes `0|2|3`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify every terminal failure class and retry-exhaustion path produces one counted leaf failure
- [ ] T014 Verify fan-out sizes 0-12 against exact success and failure threshold arithmetic
- [ ] T015 Verify strict, quorum, deadline, and progressive provisional/final state transitions
- [ ] T016 Verify every fatal override aborts an otherwise-sufficient quorum and invokes no reducer
- [ ] T017 Verify degraded envelopes contain all required provenance, arithmetic, finality, and receipt fields
- [ ] T018 Verify crash/restart and duplicate-event replay converge on one immutable verdict
- [ ] T019 Verify late results append evidence without changing a closed epoch or reduction input
- [ ] T020 Verify dark-policy differences from legacy summaries are classified through phase 003, not silently normalized
- [ ] T021 Run packet strict validation and the targeted fan-out pool/runtime test suite
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
