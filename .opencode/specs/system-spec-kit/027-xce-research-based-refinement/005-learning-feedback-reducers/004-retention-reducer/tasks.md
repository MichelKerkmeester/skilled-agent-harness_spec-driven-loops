---
title: "Tasks — 004 Feedback Retention Reducer"
description: "Task list for learned retention and edge floor logic."
trigger_phrases:
  - "009 retention reducer tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/004-retention-reducer"
    last_updated_at: "2026-06-10T11:40:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented gated feedback retention reducer."
    next_safe_action: "Monitor shadow audits before active rollout."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 100
---
# Tasks: Feedback Retention Reducer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete, `[P]` parallelizable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm `001-aggregator` and Phase 002 retention row fields are available. Evidence: `aggregateEvents()` exposes `weightedHitCount`, `queryCount`, `firstSeen`, `lastSeen`; `RetentionExpiredRow` includes tier, pin, access, and delete metadata.
- [x] T002 Define `RetentionDecision` types. Evidence: `feedback-retention-reducer.ts` exports `delete | extend | protect` decisions.
- [x] T003 Define shadow replay output for protect, extend, delete, and no-op decisions. Evidence: sweep `feedbackRetention` report includes decisions, audit counts, active-block state, and applied ids.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `feedback-retention-reducer.ts`. Evidence: new reducer module under `mcp_server/lib/feedback/`.
- [x] T005 Implement protect/extend/delete rules. Evidence: tests cover protected tiers, important positive extension, and delete fallback.
- [x] T006 Create `edge-tier-basement.ts`. Evidence: helper imports existing production `STATE_LIMITS` export and does not modify `stage4-filter.ts`.
- [x] T007 Implement dry-run behavior. Evidence: dry-run test asserts row and audit counts are unchanged.
- [x] T008 Add retention feature flags and active-mode gate. Evidence: master flag, mode flag, and shadow-evaluation gate are covered by flag matrix tests.
- [x] T009 Add shadow replay mode with audit payloads and no mutation. Evidence: shadow test records extend/protect/delete audits with unchanged retention rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Test all retention decision classes. Evidence: `feedback-retention-reducer.vitest.ts` passes.
- [x] T011 Test edge-floor narrowness. Evidence: `feedback-retention-reducer.vitest.ts` edge basement cases pass.
- [x] T012 Test sweep integration audit behavior. Evidence: `memory-retention-feedback-learning.vitest.ts` passes.
- [x] T013 Test shadow replay emits protect/extend/delete/no-op decisions without mutation. Evidence: shadow and dry-run safety tests pass.
- [x] T014 Run child strict validation. Evidence: `validate.sh ... --strict` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Shadow mode works without writes. Evidence: shadow test keeps memory rows and `delete_after` unchanged.
- [x] Active mode is blocked until ledger quality and shadow replay evidence pass. Evidence: active test blocks without the gate and applies only with it.
- [x] Tests pass. Evidence: new suites and canaries passed locally.
- [x] Strict validation exits 0. Evidence: child strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
<!-- /ANCHOR:cross-refs -->
