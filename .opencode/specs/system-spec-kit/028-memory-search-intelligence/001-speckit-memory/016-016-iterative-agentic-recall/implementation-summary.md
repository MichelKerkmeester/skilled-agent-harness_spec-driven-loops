---
title: "Implementation Summary: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)"
description: "Planning-stage summary for the governed ReAct agentic memory_context strategy. NOT YET IMPLEMENTED — Wave-2 prove-first; this records the intended delivery and the PENDING status against the Wave-0 shipped record."
trigger_phrases:
  - "028 agentic tool loop implementation summary"
  - "CG-agentic-tool-loop summary"
  - "agentic recall delivery status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/016-016-iterative-agentic-recall"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored planning-stage doc; candidate PENDING (not shipped in Wave-0)"
    next_safe_action: "Build the governor prototype (T004) before any router wiring"
    blockers:
      - "needs-design-prototype: greenfield governor + needs-benchmark before promotion"
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
      - "Step-cap / cost-ceiling defaults pending the prototype benchmark"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **STATUS: PENDING — NOT YET IMPLEMENTED.** This is a planning-stage summary for a Wave-2 prove-first candidate. CG-agentic-tool-loop is absent from the Wave-0 shipped record (`../../../030-memory-search-intelligence-impl/spec.md` §14), so nothing here is delivered. The sections below describe the intended delivery so the packet reads end-to-end; they will be rewritten with evidence once the work runs.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/001-speckit-memory/016-016-iterative-agentic-recall |
| **Completed** | PENDING |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. When this packet runs, you will be able to opt a complex `memory_context` request into an agentic, reason-act-observe retrieval loop that iteratively calls the existing memory tools and refines its own query, while every existing deterministic caller stays exactly as it is today. The headline constraint shapes the whole build: the loop puts an LLM into a synchronous, deterministic, pure better-sqlite3 retrieval hot path that has no loop or cost governor anywhere, so the first thing built is the governor, not the strategy.

### Agentic strategy (planned)

You will be able to call `memory_context` with the agentic strategy and get a bounded ReAct loop (Cognee `_run_tool_loop` shape) over the memory tools, behind a default-off flag. It exists so hard, multi-faceted asks can iterate retrieval instead of taking one static search.

### Loop governor (planned, gate-zero)

A bounded controller with a step-cap, a cost-ceiling, and a deterministic stop-condition (Letta `Init→Child→Continue→Terminal` tool-rule DAG shape) guarantees the loop always terminates. It exists because an ungoverned LLM loop is the iter-22 trap: unbounded reasoning plus cost and latency explosion.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/agentic-loop-governor.ts` | Created (planned) | Bounded controller: step-cap, cost-ceiling, deterministic stop |
| `mcp_server/handlers/memory-context.ts` | Modified (planned) | One additive `case 'agentic'` in `executeStrategy` (`:1292-1311`) |
| `mcp_server/lib/search/search-flags.ts` | Modified (planned) | Default-off `SPECKIT_AGENTIC_RECALL` flag |
| `mcp_server/__tests__/` | Created (planned) | Governor bound tests + strategy-isolation test + determinism benchmark |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The intended approach is governor-first, default-off, prove-first: build and bound-test the governor before touching the router, wire the strategy behind a default-off flag with a byte-identical flag-off isolation test, then build a seeded benchmark that reports latency, cost, and determinism numbers used for an evidence-based promotion decision. Nothing is deployed; the work is branch-only and the flag stays off until the numbers justify flipping it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the governor before any router wiring | An ungoverned LLM loop is the iter-22 trap (unbounded loop, cost/latency explosion); the governor is gate-zero |
| Gate the strategy default-off | A routing leak would inject non-determinism into every deterministic caller; off-by-default keeps the existing path byte-identical |
| Reuse Letta's tool-rule DAG as the governor template | Avoids inventing a controller; the `Init→Child→Continue→Terminal` shape is a documented bounding pattern |
| Keep this distinct from CG-iterative-context-extension | That sibling is the smaller-blast-radius answer-as-next-query build and lands in 003 routing; it does not put an LLM in the loop |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Governor bounds (step-cap, cost-ceiling, forced-final) | PENDING |
| Flag-off byte-identical isolation | PENDING |
| Deterministic core (`hybrid-search.ts`, stage2-fusion) untouched | PENDING |
| Latency / cost / determinism benchmark | PENDING |
| `validate.sh --strict` on this packet (docs) | PASS (planning docs) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a Wave-2 prove-first design packet; the candidate has never shipped (absent from 030 §14).
2. **Step-cap and cost-ceiling defaults are UNKNOWN** until the prototype benchmark runs. They are owned by Phase 3.
3. **Determinism is unproven.** Whether the loop can be made deterministic enough to ever leave opt-in is an open empirical question.
<!-- /ANCHOR:limitations -->
