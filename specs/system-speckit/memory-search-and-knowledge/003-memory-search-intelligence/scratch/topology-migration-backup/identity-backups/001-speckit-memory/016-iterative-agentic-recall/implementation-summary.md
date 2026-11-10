---
title: "Implementation Summary: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)"
description: "Planning-stage summary for the governed ReAct agentic memory_context strategy. NOT YET IMPLEMENTED, Wave-2 prove-first. This records the intended delivery and the PENDING status against the Wave-0 shipped record."
trigger_phrases:
  - "028 agentic tool loop implementation summary"
  - "CG-agentic-tool-loop summary"
  - "agentic recall delivery status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/016-iterative-agentic-recall"
    last_updated_at: "2026-07-06T19:16:32.115Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built default-off agentic loop governor + SPECKIT_AGENTIC_RECALL flag, 18 tests pass"
    next_safe_action: "Wire case agentic (needs mode-enum change + live LLM), then benchmark, PENDING"
    blockers:
      - "needs-benchmark: promotion gated on live latency/cost/determinism numbers"
      - "needs-schema-and-llm: case 'agentic' needs a public mode-enum change (Zod + JSON, not byte-identical-when-off) and an LLM in the MCP runtime"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "mcp_server/lib/search/agentic-loop-governor.ts"
      - "mcp_server/lib/search/search-flags.ts"
      - "mcp_server/tests/agentic-loop-governor.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-016-agentic-tool-loop"
      parent_session_id: null
    completion_pct: 50
    open_questions:
      - "Step-cap / cost-ceiling defaults pending the prototype benchmark"
    answered_questions:
      - "Governor bounding shape: Letta Init→Child→Continue→Terminal DAG, step-cap + cost-ceiling + deterministic stop, implemented and unit-proven"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **STATUS: GATE-ZERO IMPLEMENTED (default-off). PROMOTION PENDING.** The bounded loop governor (the gate-zero deliverable) and the default-off `SPECKIT_AGENTIC_RECALL` flag are built, typechecked and unit-proven. The two remaining pieces are intentionally left PENDING because neither is doable in this environment: the `case 'agentic'` router wiring needs a public `mode` enum change (Zod + JSON tool schema) that cannot be byte-identical when the flag is off, plus a live LLM in the synchronous MCP runtime, and the promotion decision is gated on a benchmark that needs real latency/cost/determinism numbers. The flag stays off, so the deterministic path is unchanged. The candidate was later concluded a no-go and the flag and its code removed in the flag-resolution reckoning (see Outcome below).

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-iterative-agentic-recall |
| **Completed** | complete (no-go). Phase 1 (governor + flag) DONE. Phase 2 (wiring) + Phase 3 (benchmark) not pursued, candidate concluded a no-go and removed |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The gate-zero half of the packet is built: the bounded loop governor and its default-off flag, with deterministic unit proof. The headline constraint shaped the order exactly as the plan demanded, the loop would put an LLM into a synchronous, deterministic, pure better-sqlite3 retrieval hot path with no loop or cost governor anywhere, so the governor was built and proven first, before any router wiring. The router wiring and the benchmark are deferred (see Known Limitations) because both need capabilities absent from this environment.

### Loop governor (built, gate-zero)

`agentic-loop-governor.ts` is a bounded controller with a hard step-cap, a hard cost-ceiling and a deterministic stop-condition, shaped on Letta's `Init→Child→Continue→Terminal` tool-rule DAG. It guarantees the loop always terminates three ways (step-cap ∨ cost-ceiling ∨ a terminal final-answer step) and never returns a "clean" answer before a terminal step. It is pure: the agent (LLM step provider) and the ACL-gated tool executor are injected, so it does no I/O, reads no wall-clock and uses no randomness, its bounds are unit-provable and its output is deterministic. On a provider/tool failure it returns a typed `aborted` result with the best partial context. When the budget is exhausted before any result it returns a typed `degraded` result the caller can fall back from. It exists because an ungoverned LLM loop is the iter-22 trap: unbounded reasoning plus cost and latency explosion.

### Default-off flag (built)

`isAgenticRecallEnabled()` (`SPECKIT_AGENTIC_RECALL`, default OFF, opt-in only) gates the governor. The governor fails closed: with the flag off it returns a `disabled` result and runs zero loop logic, so the agentic path is structurally unreachable unless explicitly enabled. The flag is a live, tested consumer, not a dead control.

### Agentic strategy router wiring (PENDING)

Calling `memory_context` with an agentic strategy is not yet wired. It needs a public `mode`-enum change and a live LLM (see Known Limitations).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/agentic-loop-governor.ts` | Created | Bounded controller: step-cap, cost-ceiling, deterministic stop, ACL gate, typed results |
| `mcp_server/lib/search/search-flags.ts` | Modified | Added default-off `SPECKIT_AGENTIC_RECALL` (`isAgenticRecallEnabled()`) |
| `mcp_server/tests/agentic-loop-governor.vitest.ts` | Created | 18 deterministic bound/isolation/failure/determinism tests |
| `mcp_server/tests/flag-ceiling.vitest.ts` | Modified | Registered the new flag in the drift-guard acknowledged list |
| `mcp_server/handlers/memory-context.ts` | NOT changed (PENDING) | `case 'agentic'` wiring deferred, needs public mode-enum change + live LLM |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Governor-first, default-off, prove-first, exactly the planned order. The governor module was built and bound-tested in isolation (no router touched), and the strategy gate was added as a default-off flag the governor consults to fail closed. The router wiring and the seeded benchmark were deliberately NOT attempted here: wiring requires changing the public `mode` enum and providing a live LLM, and the benchmark requires a real run that produces latency/cost/determinism numbers. Nothing is deployed. The work is branch-only and the flag stays off. Verification climbed the unit rung only (the authoritative rung, in-memory/on-server/live wiring behavior is explicitly unseen because the path is not wired). The bounds are unit-provable precisely because the governor is pure.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the governor before any router wiring | An ungoverned LLM loop is the iter-22 trap (unbounded loop, cost/latency explosion). The governor is gate-zero |
| Gate the strategy default-off | A routing leak would inject non-determinism into every deterministic caller. Off-by-default keeps the existing path byte-identical |
| Reuse Letta's tool-rule DAG as the governor template | Avoids inventing a controller. The `Init→Child→Continue→Terminal` shape is a documented bounding pattern |
| Keep this distinct from CG-iterative-context-extension | That sibling is the smaller-blast-radius answer-as-next-query build and lands in 003 routing. It does not put an LLM in the loop |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` (tsc --noEmit) | PASS, 0 errors |
| Governor bounds (step-cap, cost-ceiling, forced-final-at-terminal) | PASS, `agentic-loop-governor.vitest.ts` 18/18 |
| Step-cap hard clamp (over-large maxSteps → HARD_STEP_LIMIT, never unbounded) | PASS |
| Cost-ceiling: forced-final after a result, `degraded` before any result | PASS |
| ACL gate (tool outside allowlist → aborted) + flag fail-closed (off → disabled, 0 steps) | PASS |
| Failure handling (provider/tool throw → typed `aborted`, never throws) + determinism (repeat runs identical) | PASS |
| Flag-off byte-identical isolation (4 deterministic strategies) | N/A here, agentic path not wired into the hot path. Nothing changed, so flag-off output is unchanged by construction |
| Deterministic core (`hybrid-search.ts`, `stage2-fusion.ts`) + `memory-context.ts` untouched | PASS, `git diff` shows zero changes (mine) |
| Latency / cost / determinism benchmark | PENDING, needs a live LLM + real numbers |
| `validate.sh --strict` on this packet | PASS, Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Router wiring deferred (Phase 2 / REQ-004, T007, T010).** `case 'agentic'` is not wired into `executeStrategy`. Reaching it requires admitting `'agentic'` to the public `mode` enum in BOTH `schemas/tool-input-schemas.ts` (Zod) and `tool-schemas.ts` (JSON tool schema). Those schemas are static, not flag-gated, so the change cannot be byte-identical when the flag is off, it would alter the public tool contract regardless of the flag. The meaningful loop body also needs a live LLM step provider in the synchronous MCP runtime (dependency status: unavailable here). Left PENDING. The governor is built so the wiring is a thin, already-bounded seam once those two unblock.
2. **Benchmark deferred (Phase 3 / REQ-005, T012).** Promotion is gated on a seeded N-run benchmark reporting p50/p95 latency delta, per-call cost and determinism variance. That needs a live run. No numbers can be produced in this environment. Left PENDING.
3. **Step-cap and cost-ceiling defaults are UNKNOWN** until that benchmark runs. The governor ships safe defaults (`DEFAULT_MAX_STEPS=4`, `DEFAULT_COST_CEILING=10000`, `HARD_STEP_LIMIT=32`) that bound the loop. The *tuned* values are owned by Phase 3.
4. **Determinism of the full loop is unproven.** The governor is deterministic given a deterministic step provider. Whether a real LLM provider can be made deterministic enough to ever leave opt-in is an open empirical question for the benchmark.
<!-- /ANCHOR:limitations -->

---

## Outcome (no-go, status complete)

The status enum for this packet is **complete**, read as a concluded decision rather than a shipped feature. The gate-zero deliverable (the bounded loop governor and the default-off `SPECKIT_AGENTIC_RECALL` flag) was built, typechecked and unit-proven, default-off and benchmark-gated, with Phase 2 router wiring and the Phase 3 benchmark deliberately not pursued in this environment. The candidate was then resolved against measurement: the oracle ceiling reached +0.344 but the live reasoner netted zero with regressions at roughly 51s per query, and the loop had no production consumer, so it was concluded a **no-go** and the flag and its code were removed in the flag-resolution reckoning. See [`../../007-kept-off-flag-resolution/`](../../007-kept-off-flag-resolution/). The deterministic search core was never touched, so removal was a no-op for deployed callers. The phase records the design-of-record (Letta-shaped governor, default-off isolation) even though the strategy itself does not ship.
