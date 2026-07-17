---
title: "Implementation Summary: Async Sleep-Time Consolidation (governed off-turn reorganization)"
description: "Safe-core summary for the governed, default-off, shadow-gated off-turn memory-reorganization pass. The bounded governor and shadow agent scaffold are implemented. Off-turn dispatch, live archival writes and benchmark promotion remain pending."
trigger_phrases:
  - "async sleep-time consolidation implementation summary"
  - "sleeptime agent summary"
  - "off-turn reorganization delivery status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/018-sleeptime-consolidation"
    last_updated_at: "2026-07-06T19:16:32.744Z"
    last_updated_by: "codex"
    recent_action: "Implemented default-off sleeptime governor and shadow scaffold"
    next_safe_action: "Consume 010 cadence/cursor gate"
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
    completion_pct: 35
    open_questions:
      - "Archival-passage substrate need is unresolved, gates the headline candidate"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **STATUS: SAFE CORE IMPLEMENTED. LIVE BEHAVIOR PENDING.** The bounded sleep-time governor and shadow agent scaffold are delivered behind default-off flags. Off-turn dispatch, cursor/cadence consumption, LLM-selected archival chunking, live archival writes and benchmark promotion remain pending.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-sleeptime-consolidation |
| **Status** | in_progress |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The bounded sleep-time governor is implemented in `mcp_server/lib/cognitive/sleeptime-governor.ts`. It enforces bounded phases, a step cap, a cost ceiling, ACL allowlist checks, typed partial aborts and deterministic terminal handling. The shadow agent scaffold is implemented in `mcp_server/lib/cognitive/sleeptime-agent.ts`. It selects transcript ranges through the governor and records shadow output without archival writes by default.

### Sleep-time agent (shadow scaffold)

The scaffold can run in shadow mode and return would-archive ranges. Live archival writes require explicit caller injection plus `SPECKIT_SLEEPTIME_LIVE_WRITE=true`. No live save-path dispatch is wired here.

### Tool-rule-DAG governor

A bounded controller with `Init→Child→Continue→Terminal` phases, a step-cap, a cost-ceiling and a deterministic terminal stop guarantees the off-turn loop always terminates. It exists because an ungoverned off-turn LLM-plus-tool loop is the iter-22 trap: unbounded reasoning plus cost and latency explosion. It is also the reusable bounding template for sibling 016's agentic-recall loop.

### LLM transcript-chunking (planned)

This remains pending. The markdown-structure chunker stays unchanged until shadow telemetry and benchmark evidence justify adding a live archival path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/cognitive/sleeptime-governor.ts` | Created | Bounded tool-rule DAG: step-cap, cost-ceiling, terminal stop |
| `mcp_server/lib/cognitive/sleeptime-agent.ts` | Created | Shadow agent scaffold. No archival write by default |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Not changed | Dispatch waits on sibling 010 cadence/cursor |
| `mcp_server/handlers/chunking-orchestrator.ts` | Not changed | LLM-range archival path remains benchmark-gated |
| `mcp_server/lib/search/search-flags.ts` | Modified | Default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` + `SPECKIT_SLEEPTIME_LIVE_WRITE` |
| `mcp_server/tests/sleeptime-governor.vitest.ts` | Created | Governor bounds, shadow default, live-write opt-in tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as governor-first, default-off, shadow-gated plumbing. The synchronous save/reconsolidation path was not modified. No archival rows are written by default. The live behavior remains pending until sibling 010's cadence/cursor gate exists and shadow telemetry earns a promotion.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the governor before any off-turn agent wiring | An ungoverned off-turn LLM loop is the iter-22 trap (unbounded loop, cost/latency explosion). The governor is gate-zero |
| Gate default-off with a shadow/dry-run default | The pass mutates archival off-turn (highest tail-risk). Shadow keeps the risk observable and reversible until telemetry justifies a live write |
| Ride sibling 010's clock host + cursor + cadence gate | Building a second clock/counter would race 010 on the same state. Consume, don't duplicate |
| Reuse Letta's tool-rule DAG as the governor template | Avoids inventing a controller. The `Init→Child→Continue→Terminal` shape is a documented bounding pattern (also reused by 016) |
| Keep markdown chunking the default. LLM-range is additive | Preserves the existing chunking behavior. The LLM path is opt-in alongside it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Governor bounds (step-cap, cost-ceiling, forced-terminal) | PASS |
| Flag-off off-turn isolation (sync byte-identical, zero off-turn archival mutation) | PASS by construction: no dispatch hook was added. Flags default off |
| Idempotency against 010's clock host + cursor (replay re-derives) | PENDING |
| Shadow telemetry (would-archive ranges, cadence) | PENDING |
| `validate.sh --strict` on this packet (docs) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No off-turn dispatch is wired.** This phase intentionally waits for sibling 010's cadence/cursor gate.
2. **Live archival writes remain gated.** Shadow mode is default. Live writes require a separate flag and explicit writer injection.
3. **LLM-selected archival chunking remains pending.** The markdown chunker is unchanged.
4. **Cursor replay idempotency is unproven here.** It depends on sibling 010.
5. **No measured benefit number.** Every promotion decision still requires shadow telemetry and benchmark evidence.
<!-- /ANCHOR:limitations -->
