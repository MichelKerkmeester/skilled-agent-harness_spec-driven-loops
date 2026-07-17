---
title: "Task Breakdown: Causal Relation-Coverage Reporting Honesty"
description: "Tasks for correcting the misleading relation-coverage backfill hint and locking the honest contract with tests."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/019-causal-relation-coverage-honesty"
    last_updated_at: "2026-06-04T09:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Reporter + tests complete"
    next_safe_action: "Commit + deploy with #2"
    blockers: []
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Causal Relation-Coverage Reporting Honesty

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` done · `[ ]` open. IDs `T#`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1: Confirm `relation-coverage.ts` is a pure reporter and autoRepair runs no relation backfill (`lastBackfillAt` always null).
- [x] T2: Confirm the only failing target is `caused` (≥5%), which needs semantic inference — no deterministic backfill satisfies it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T3: Add `backfillJob.implemented: boolean`; widen `command` to `string | null`.
- [x] T4: Return `implemented:false`, `command:null`; rewrite `remediationHint` to the real mechanism.
- [x] T5: New `relation-coverage-unit.vitest.ts`; honest-contract assertions added to `causal-stats-output.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T6: `npm run build` → exit 0.
- [x] T7: Run relation-coverage tests → 5 passed across 2 files.
- [ ] T8: Commit code + packet.
- [ ] T9: Deploy with #2; verify `memory_causal_stats` shows the honest hint.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Reporter honest, tests green, build clean, deployed; `memory_causal_stats` no longer advises the no-op `memory_health({autoRepair})` backfill.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — R1–R4; `plan.md` — affected surfaces + rollback.
- Future feature: autonomous relation-inference backfill (`caused`/`contradicts`) — not built here.
<!-- /ANCHOR:cross-refs -->
