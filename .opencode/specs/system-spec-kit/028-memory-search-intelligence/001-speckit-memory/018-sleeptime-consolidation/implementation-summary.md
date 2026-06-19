---
title: "Implementation Summary: Async Sleep-Time Consolidation (governed off-turn reorganization)"
description: "Planning-stage summary for the governed, default-off, shadow-gated off-turn memory-reorganization pass. NOT YET IMPLEMENTED — Wave-2 prove-first; records the intended delivery and the PENDING status against the Wave-0 shipped record."
trigger_phrases:
  - "async sleep-time consolidation implementation summary"
  - "sleeptime agent summary"
  - "off-turn reorganization delivery status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/018-sleeptime-consolidation"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored planning-stage doc; candidate PENDING (not shipped in Wave-0)"
    next_safe_action: "Build the tool-rule-DAG governor (T005) before any off-turn agent wiring"
    blockers:
      - "needs-design-prototype + depends-on-010 + needs-benchmark before promotion"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-018-sleeptime-consolidation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Archival-passage substrate need is unresolved; gates the headline candidate"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **STATUS: PENDING — NOT YET IMPLEMENTED.** This is a planning-stage summary for a Wave-2 prove-first, intelligence-class candidate. async-sleeptime-consolidation is absent from the Wave-0 shipped record (`../../../030-memory-search-intelligence-impl/spec.md` §14), so nothing here is delivered. The sections below describe the intended delivery so the packet reads end-to-end; they will be rewritten with evidence once the work runs.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/001-speckit-memory/018-sleeptime-consolidation |
| **Completed** | PENDING |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. When this packet runs, the Memory MCP will gain a background, cadence-gated reorganization pass: after a foreground turn, a sleep-time agent reorganizes recent transcripts into archival memory through a bounded tool-chain, while the synchronous on-save reconsolidation every existing caller depends on stays exactly as it is today. The headline constraint shapes the whole build — this pass mutates archival memory off-turn, the highest-tail-risk move in the Memory subsystem — so it is built default-off, shadow/dry-run by default, and the very first thing built is the governor, not the agent.

### Sleep-time agent (planned)

You will be able to enable an off-turn agent that fires after the foreground turn and reorganizes recent transcripts via a governed tool-chain, gated by sibling 010's turn-count cadence and riding 010's clock host + cursor. It exists so consolidation cost moves off the hot path and amortizes across turns, and so the model gets a quiet pass to preserve durable memory.

### Tool-rule-DAG governor (planned, gate-zero)

A bounded controller with `Init→Child→Continue→Terminal` phases, a step-cap, a cost-ceiling, and a deterministic terminal stop guarantees the off-turn loop always terminates. It exists because an ungoverned off-turn LLM-plus-tool loop is the iter-22 trap: unbounded reasoning plus cost and latency explosion. It is also the reusable bounding template for sibling 016's agentic-recall loop.

### LLM transcript-chunking (planned)

An additive path lets the LLM choose which transcript ranges (`start_index/end_index/context` analogue) become discrete archival memories, beside the existing markdown-structure chunker, which stays the default.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/cognitive/sleeptime-governor.ts` | Created (planned) | Bounded tool-rule DAG: step-cap, cost-ceiling, terminal stop |
| `mcp_server/lib/cognitive/sleeptime-agent.ts` | Created (planned) | Off-turn reorganization agent; shadow/dry-run default |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Modified (planned) | Additive off-turn dispatch point, distinct from the sync path |
| `mcp_server/handlers/chunking-orchestrator.ts` | Modified (planned) | Additive LLM-selected-range archival path |
| `mcp_server/lib/search/search-flags.ts` | Modified (planned) | Default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` + shadow sub-flag |
| `mcp_server/__tests__/` | Created (planned) | Governor bounds + off-turn isolation + cursor-idempotency + shadow harness |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The intended approach is governor-first, default-off, shadow-gated, prove-first: build and bound-test the governor before touching the consolidation path; wire the off-turn agent behind a default-off flag with a shadow/dry-run default and a byte-identical flag-off isolation test on the synchronous path; add the LLM-range chunking path additively; then build a shadow harness that records what each pass would archive so the live-write promotion decision rests on evidence, not optimism. Nothing is deployed; the work is branch-only, the flag stays off, and no archival rows are written in the default shadow state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the governor before any off-turn agent wiring | An ungoverned off-turn LLM loop is the iter-22 trap (unbounded loop, cost/latency explosion); the governor is gate-zero |
| Gate default-off with a shadow/dry-run default | The pass mutates archival off-turn (highest tail-risk); shadow keeps the risk observable and reversible until telemetry justifies a live write |
| Ride sibling 010's clock host + cursor + cadence gate | Building a second clock/counter would race 010 on the same state; consume, don't duplicate |
| Reuse Letta's tool-rule DAG as the governor template | Avoids inventing a controller; the `Init→Child→Continue→Terminal` shape is a documented bounding pattern (also reused by 016) |
| Keep markdown chunking the default; LLM-range is additive | Preserves the existing chunking behavior; the LLM path is opt-in alongside it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Governor bounds (step-cap, cost-ceiling, forced-terminal) | PENDING |
| Flag-off off-turn isolation (sync byte-identical; zero off-turn archival mutation) | PENDING |
| Idempotency against 010's clock host + cursor (replay re-derives) | PENDING |
| Shadow telemetry (would-archive ranges, cadence) | PENDING |
| `validate.sh --strict` on this packet (docs) | PASS (planning docs) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a Wave-2 prove-first design packet; the candidate has never shipped (absent from 030 §14).
2. **Mutates archival off-turn — highest tail-risk.** It ships shadow-gated; a live archival write is a separate opt-in earned only on telemetry.
3. **No episode/archival-passage substrate exists.** Whether the headline agent needs one is an open question (spec §12) that gates the build.
4. **Depends on sibling 010.** The C-G1 clock host + C4-C cursor + `LT-turn-cadence-trigger` gate must land in 010 first; this packet rides/consumes them.
5. **No measured benefit number.** Every leverage/effort tag is structural inference (028 GO-evidence caveat).
<!-- /ANCHOR:limitations -->
