---
title: "Tasks: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)"
description: "Task Format: T### [P?] Description (file path). Governor-first, default-off, benchmark-before-promote. All PENDING, CG-agentic-tool-loop never shipped in Wave-0 (030 §14)."
trigger_phrases:
  - "028 agentic tool loop tasks"
  - "react memory_context strategy tasks"
  - "CG-agentic-tool-loop tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/022-iterative-agentic-recall"
    last_updated_at: "2026-07-04T17:51:08.473Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown. All tasks PENDING (candidate not yet implemented)"
    next_safe_action: "Start T004, build the loop governor module"
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

> **STATUS: PHASE 1 DONE (governor + flag, default-off). PHASE 2 (wiring) + PHASE 3 (benchmark) PENDING.** The gate-zero loop governor and the default-off `SPECKIT_AGENTIC_RECALL` flag are built and unit-proven (typecheck 0 errors, 18/18 governor tests). Router wiring (T007/T010) is left PENDING, it needs a public `mode`-enum change (Zod + JSON tool schema) that cannot be byte-identical when the flag is off, plus a live LLM. The benchmark (T012) is left PENDING, it needs a live run producing latency/cost/determinism numbers.

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

- [x] T001 Confirm the static-router seam unchanged from research: `executeStrategy` switch is `quick/deep/focused/resume` only, no tool-calling (`mcp_server/handlers/memory-context.ts`). VERIFIED: switch is at `:1362-1375` (research cited `:1292-1311`, the seam is intact, only the line numbers drifted), four cases only, `git diff` shows zero changes to the handler
- [x] T002 Reserve and document the default-off `SPECKIT_AGENTIC_RECALL` flag name in the flag registry (`mcp_server/lib/search/search-flags.ts`). DONE: `isAgenticRecallEnabled()` added (opt-in, default OFF)
- [ ] T003 [P] Capture the flag-off recall baseline (golden output for the four existing strategies) for the later byte-identical isolation test. PENDING: only needed once T007 wires the router. The path is unwired so flag-off output is unchanged by construction
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create the bounded loop governor with step-cap, cost-ceiling and a deterministic stop-condition modeled on Letta's `Init→Child→Continue→Terminal` tool-rule DAG (`mcp_server/lib/search/agentic-loop-governor.ts`). DONE: `runAgenticLoop()` with `maxSteps`/`costCeiling`/`HARD_STEP_LIMIT` clamps and four-phase progression
- [x] T005 Implement the reason-act-observe loop body that emits a structured step (`tool_call | final_answer`), executes ACL-gated tools, appends observations and forces a best-effort final answer at the cap (Cognee `_run_tool_loop` shape). DONE in the governor: `AgenticStep` union, injected ACL-gated `toolExecutor`, observation accumulation, forced-final at the step-cap. NOTE: binding the executor to the *real* memory tools lives in the router wiring (T007, PENDING)
- [x] T006 Add the default-off `SPECKIT_AGENTIC_RECALL` flag (`mcp_server/lib/search/search-flags.ts`). DONE (same as T002)
- [ ] T007 Add `case 'agentic'` to `executeStrategy` dispatching through the governor. Default branch and existing cases unchanged (`mcp_server/handlers/memory-context.ts`). PENDING (gate): reaching the case requires admitting `'agentic'` to the public `mode` enum in `schemas/tool-input-schemas.ts` (Zod) AND `tool-schemas.ts` (JSON), a static, non-flag-gated public-contract change that cannot be byte-identical when the flag is off, plus a live LLM step provider in the MCP runtime
- [x] T008 Add governor abort/error handling: typed partial/forced-final result on tool failure or cost-ceiling-before-first-result (graceful degrade). DONE: typed `aborted` (provider/tool/ACL) preserving best partial. `degraded` when the budget is exhausted before any result
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Unit-test the governor bounds: terminates at step-cap, aborts at cost-ceiling, forces a final answer at terminal, never unbounded (`mcp_server/tests/agentic-loop-governor.vitest.ts`). DONE: 18/18 passing, covering step-cap, hard-clamp, cost-ceiling (forced-final + degraded), terminal final-answer, ACL, provider/tool failure, determinism, flag fail-closed. NOTE: repo convention is `tests/*.vitest.ts`, not the `__tests__/` path the spec assumed
- [ ] T010 Isolation test: with the flag off, all four existing strategies produce byte-identical recall output vs the T003 baseline and no agentic code executes. PENDING: depends on T007 wiring. Until then the path is unwired and flag-off output is unchanged by construction (handler `git diff` = 0). Governor-level fail-closed (flag off → `disabled`, 0 steps) IS tested
- [x] T011 Confirm the deterministic core is untouched: `git diff` shows zero changes to `lib/search/hybrid-search.ts` and `lib/search/pipeline/stage2-fusion.ts`. DONE: `git diff --stat` empty for both (and for `handlers/memory-context.ts`)
- [ ] T012 Build and run the seeded N-run benchmark: latency p50/p95 delta, cost/call, determinism variance. Record numbers and the promote/keep-off/drop decision. PENDING (gate): needs a live LLM + real numbers, not producible in this environment
- [x] T013 node --check + tsc + related suite green. `validate.sh --strict` passes. DONE for the shipped scope: `npm run typecheck` 0 errors. Governor suite 18/18. `validate.sh --strict` Errors 0 / Warnings 0. (Full-suite promotion gates T010/T012 remain PENDING)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Governor bounds proven, flag-off isolation proven, deterministic core untouched and benchmark numbers recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Shipped record (Wave-0)**: Wave-0 record (CG-agentic-tool-loop absent → PENDING)
<!-- /ANCHOR:cross-refs -->
