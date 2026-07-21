---
title: "Tasks: Conditional Budget-Aware Fan-in"
description: "Tasks for conditional fan-in over durable results, typed budget floors, evidence sufficiency, outstanding-leaf disposition, and replay-stable reduction handoff."
trigger_phrases:
  - "conditional budget-aware fan-in tasks"
  - "dynamic fan-in tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin"
    last_updated_at: "2026-07-21T05:20:03Z"
    last_updated_by: "codex"
    recent_action: "Completed the policy, decision, budget, disposition, event, reduction, and shadow modules"
    next_safe_action: "Keep legacy wait-for-all authoritative pending an explicit cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/conditional-fanin/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/conditional-fanin.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Conditional Budget-Aware Fan-in

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| \`[ ]\` | Pending |
| \`[x]\` | Completed |
| \`[P]\` | Parallelizable |
| \`[B]\` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pin current \`fanout-run.cjs\` wait-for-all, static budget-cap, pool-summary, termination, and salvage fixtures [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T002 Freeze versioned interfaces for typed budgets, result envelopes, logical branches, dispatch attempts, leases, waves, partial-failure eligibility, and reduction handoff [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T003 Define \`FanInPolicy\`, decision event, stop taxonomy, simultaneous-trigger precedence, event-cut semantics, and deterministic result ordering [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T004 Define the phase-011 value-of-computation extension slot and its deterministic no-signal default [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement the ledger-folded \`FanInDecisionView\` at an explicit event-sequence cut [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T006 Implement sufficiency evaluation across minimum result count, support/agreement, and provenance-diversity evidence [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T007 Implement the typed budget continuation probe for one more useful result plus settlement margin across every ancestor and dimension [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T008 Implement deterministic continue/stop evaluation and retain all simultaneously satisfied triggers [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T009 Implement transition-authorized decision finalization with immutable included/excluded IDs and reducer-input digest [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T010 Implement queued withdrawal and reserved-not-started cancellation with idempotent proven-unused release [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T011 Implement fenced cancel requests for running cancellable leaves and detached salvage for running non-cancellable leaves [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T012 Implement late-result linkage, spend settlement, and authoritative reducer-input exclusion after the decision cut [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T013 Bind reduction handoff to the decision ID, ordered result IDs, completion classification, and content digest [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T014 Emit additive-dark shadow decisions beside the legacy wait-for-all path without moving authority [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify sufficiency finalizes before all N leaves only when count, agreement, and provenance-diversity gates pass [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T016 Verify each typed dimension and ancestor can independently trigger budget floor without convergence misclassification [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T017 Verify simultaneous budget-floor and sufficiency triggers retain both conditions and use deterministic primary precedence [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T018 Verify cancel/complete, release/settle, lease-expiry, and decision/late-result races preserve spend and salvage evidence [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T019 Verify replay under equivalent event delivery reconstructs identical stop reasons, leaf dispositions, included IDs, and reducer digest [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T020 Verify partial-failure policy variants feed one stable fan-in schema without taking ownership of finalization [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T021 Verify the phase-011 extension cannot bypass typed admission, mutate a finalized decision, or redefine budget exhaustion [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T022 Verify shadow mode leaves current \`fanout-run.cjs\` wait-for-all output authoritative and records comparison evidence [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] T023 Run strict spec validation and the bounded runtime test/build/typecheck gates selected by the parent packet [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:evidence -->
## Evidence

| Tasks | Evidence |
|-------|----------|
| T001-T004 | `implementation-summary.md`; `policy.ts`; `types.ts`; `shadow-adapter.ts`; unchanged `fanout-run.cjs` |
| T005-T014 | `runtime/lib/conditional-fanin/*`; `conditional-fanin.vitest.ts` |
| T015-T022 | 29 passing leaf fixtures covering event cuts, quorum, 16 scope/dimension denials, precedence, dispositions, salvage, late results, reducer binding, extension ranking, and dark authority |
| T023 | Leaf Vitest exit 0; runtime TypeScript exit 0; strict packet validation exit 0 |
<!-- /ANCHOR:evidence -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See \`spec.md\`
- **Plan**: See \`plan.md\`
<!-- /ANCHOR:cross-refs -->
