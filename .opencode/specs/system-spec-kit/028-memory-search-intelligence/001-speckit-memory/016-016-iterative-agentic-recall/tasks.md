---
title: "Tasks: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)"
description: "Task Format: T### [P?] Description (file path). Governor-first, default-off, benchmark-before-promote. All PENDING — CG-agentic-tool-loop never shipped in Wave-0 (030 §14)."
trigger_phrases:
  - "028 agentic tool loop tasks"
  - "react memory_context strategy tasks"
  - "CG-agentic-tool-loop tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/016-016-iterative-agentic-recall"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown; all tasks PENDING (candidate not yet implemented)"
    next_safe_action: "Start T004 — build the loop governor module"
    blockers:
      - "needs-design-prototype: greenfield governor is gate-zero"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-016-agentic-tool-loop"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Step-cap / cost-ceiling defaults pending benchmark"
    answered_questions: []
---
# Tasks: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> **STATUS: PENDING (Wave-2, prove-first).** CG-agentic-tool-loop is **absent** from the Wave-0 shipped record (`../../../030-memory-search-intelligence-impl/spec.md` §14 status table), so no task is pre-checked. Gate: needs-design-prototype (greenfield controller/step-cap/cost-ceiling) + needs-benchmark before promotion.

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the static-router seam unchanged from research: `executeStrategy` switch is `quick/deep/focused/resume` only, no tool-calling (`mcp_server/handlers/memory-context.ts:1292-1311`)
- [ ] T002 Reserve and document the default-off `SPECKIT_AGENTIC_RECALL` flag name in the flag registry plan (`mcp_server/lib/search/search-flags.ts`)
- [ ] T003 [P] Capture the flag-off recall baseline (golden output for the four existing strategies) for the later byte-identical isolation test
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create the bounded loop governor with step-cap, cost-ceiling, and a deterministic stop-condition modeled on Letta's `Init→Child→Continue→Terminal` tool-rule DAG (`mcp_server/lib/search/agentic-loop-governor.ts`; ref `voice_sleeptime_agent.py:87-91,132-148`)
- [ ] T005 Implement the reason-act-observe loop body that emits a structured step (`tool_call | final_answer`), executes ACL-gated memory tools, appends observations, and forces a best-effort final answer at the cap (Cognee `_run_tool_loop` shape, `agentic_retriever.py:419-478`)
- [ ] T006 Add the default-off `SPECKIT_AGENTIC_RECALL` flag (`mcp_server/lib/search/search-flags.ts`)
- [ ] T007 Add `case 'agentic'` to `executeStrategy` dispatching through the governor; default branch and existing cases unchanged (`mcp_server/handlers/memory-context.ts:1292-1311`)
- [ ] T008 Add governor abort/error handling: typed partial/forced-final result on tool failure or cost-ceiling-before-first-result (graceful degrade to focused strategy)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Unit-test the governor bounds: terminates at step-cap, aborts at cost-ceiling, forces a final answer at terminal — never unbounded (`mcp_server/__tests__/`)
- [ ] T010 Isolation test: with the flag off, all four existing strategies produce byte-identical recall output vs the T003 baseline and no agentic code executes
- [ ] T011 Confirm the deterministic core is untouched: `git diff` shows zero changes to `lib/search/hybrid-search.ts` and `lib/search/pipeline/stage2-fusion.ts`
- [ ] T012 Build and run the seeded N-run benchmark: latency p50/p95 delta, cost/call, determinism variance; record numbers and the promote/keep-off/drop decision (`mcp_server/__tests__/`)
- [ ] T013 node --check + tsc + existing suite green; `validate.sh --strict` passes on this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Governor bounds proven; flag-off isolation proven; deterministic core untouched; benchmark numbers recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Shipped record (Wave-0)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (CG-agentic-tool-loop absent → PENDING)
<!-- /ANCHOR:cross-refs -->
