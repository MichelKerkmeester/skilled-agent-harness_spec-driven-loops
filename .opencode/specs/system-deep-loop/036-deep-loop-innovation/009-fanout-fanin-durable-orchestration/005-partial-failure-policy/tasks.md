---
title: "Tasks: partial-failure policy"
description: "Tasks for implementing and verifying typed leaf failures, quorum evaluation, degraded results, and ledgered fan-in abort decisions."
trigger_phrases:
  - "partial-failure policy tasks"
  - "durable fan-in failure tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
    last_updated_at: "2026-07-21T08:06:00Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation and verification tasks"
    next_safe_action: "Keep the typed policy dark until compatibility activation"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Pin BASE and read phase 003's protected-contract-versus-known-defect classification for fan-out failures [Evidence: `contract-defect-ledger.json`]
- [x] T002 Freeze the child-004 await-set/decision-boundary input and child-006 reduction handoff schemas [Evidence: `runtime/lib/partial-failure-policy/policy.ts`]
- [x] T003 Inventory current executor, timeout, signal, artifact, salvage, retry, summary, and exit-code behavior in `fanout-run.cjs` and `fanout-pool.cjs`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define the versioned leaf-failure envelope and bounded failure taxonomy [Evidence: `runtime/lib/partial-failure-policy/types.ts`]
- [x] T005 Implement deterministic classification for executor, timeout, signal, artifact, parse, salvage, policy, budget, and integrity failures [Evidence: `runtime/lib/partial-failure-policy/failure.ts`]
- [x] T006 Project the immutable admitted set and decision epoch from canonical dispatch receipts [Evidence: `runtime/lib/partial-failure-policy/policy.ts`]
- [x] T007 Implement strict, quorum, deadline, and progressive evaluation with the two-thirds default [Evidence: `runtime/lib/partial-failure-policy/evaluator.ts`]
- [x] T008 Apply fatal integrity overrides before count/fraction threshold evaluation [Evidence: `runtime/lib/partial-failure-policy/evaluator.ts`]
- [x] T009 Append idempotent leaf-failure, policy-evaluation, degraded, abort, and late-result events through transition authorization [Evidence: `runtime/lib/partial-failure-policy/ledger-events.ts`]
- [x] T010 Mark sufficient partial result envelopes as degraded with counts, failed branch IDs, reason codes, and policy receipt [Evidence: `runtime/lib/partial-failure-policy/evaluator.ts`]
- [x] T011 Gate child-006 reduction so only validated successful envelopes accompany `proceed|proceed_degraded`
- [x] T012 Add the dark compatibility projection against legacy `ok|partial` status and exit codes `0|2|3`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify every terminal failure class and retry-exhaustion path produces one counted leaf failure [Test: partial-failure-policy.vitest.ts taxonomy and retry cases]
- [x] T014 Verify fan-out sizes 0-12 against exact success and failure threshold arithmetic [Test: partial-failure-policy.vitest.ts threshold matrices]
- [x] T015 Verify strict, quorum, deadline, and progressive provisional/final state transitions [Test: partial-failure-policy.vitest.ts state-machine cases]
- [x] T016 Verify every fatal override aborts an otherwise-sufficient quorum and invokes no reducer [Test: partial-failure-policy.vitest.ts fatal-override case]
- [x] T017 Verify degraded envelopes contain all required provenance, arithmetic, finality, and receipt fields [Test: partial-failure-policy.vitest.ts degraded-marker case]
- [x] T018 Verify crash/restart and duplicate-event replay converge on one immutable verdict [Test: partial-failure-policy.vitest.ts replay cases]
- [x] T019 Verify late results append evidence without changing a closed epoch or reduction input [Test: partial-failure-policy.vitest.ts late-result case]
- [x] T020 Verify dark-policy differences from legacy summaries are classified through phase 003, not silently normalized [Test: partial-failure-policy.vitest.ts additive-dark case]
- [x] T021 Run packet strict validation and the targeted fan-out pool/runtime test suite [Evidence: focused 39 tests passed; legacy 99 tests passed; `validate.sh --strict` exit 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
