---
title: "Tasks — 003 Session-Trace Causal Reducer"
description: "Task list for the session-trace causal reducer."
trigger_phrases:
  - "009 causal reducer tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/003-causal-reducer"
    last_updated_at: "2026-06-10T09:20:57Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented deferred session-trace causal reducer and tests."
    next_safe_action: "Ready for parent integration phase."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 100
---
# Tasks: Session-Trace Causal Reducer

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

- [x] T001 Confirm `001-aggregator` and Phase 002 guardrails are available. Evidence: `feedback-ledger.ts` read APIs and `insertEdge` caps/guard verified.
- [x] T002 Define reducer options and result telemetry. Evidence: reducer exports options plus result counters, candidates, and skip reasons.
- [x] T003 Define shadow replay output for candidate edges, skipped edges, relation validation, and manual-edge protection. Evidence: dry-run entrypoint returns candidates and skip reasons without edge writes; `enabled` coverage is already zero-floor/non-gating.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `session-trace-causal-reducer.ts`. Evidence: new reducer module added under `mcp_server/lib/feedback/`.
- [x] T005 Implement ordered event grouping. Evidence: reducer sorts by session, timestamp, and event id before session-local replay.
- [x] T006 Implement source selection and caps. Evidence: deterministic helper prefers same-query sources and caps at five.
- [x] T007 Emit auto-session edges with manual-edge protection. Evidence: active path calls `insertEdge` with `created_by='auto-session'`.
- [x] T008 Add default-off flag gate. Evidence: flag-off test leaves an empty in-memory DB untouched.
- [x] T009 Add shadow replay mode that records decisions without writing edges. Evidence: shadow replay test returns three dry-run skips and zero edges.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Test source selection and no-source behavior. Evidence: `session-trace-causal-reducer.vitest.ts` covers both cases.
- [x] T011 Test manual-edge skip and idempotent reruns. Evidence: reducer suite covers curated edge protection and bounded rerun.
- [x] T012 Test shadow replay records candidate/skipped/accepted decisions with no mutation. Evidence: reducer suite covers dry-run output and zero edge count.
- [x] T013 Verify deferred-only invocation. Evidence: grep found reducer calls only in the reducer module and tests.
- [x] T014 Run child strict validation. Evidence: validation command recorded in implementation summary.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] No live invocation path. Evidence: grep found no production caller outside the reducer module.
- [x] Shadow replay evidence exists before any active edge mutation rollout. Evidence: dry-run test covers no-mutation candidate replay.
- [x] Tests pass. Evidence: reducer suite plus canaries passed.
- [x] Strict validation exits 0. Evidence: validation output recorded after execution.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
<!-- /ANCHOR:cross-refs -->
