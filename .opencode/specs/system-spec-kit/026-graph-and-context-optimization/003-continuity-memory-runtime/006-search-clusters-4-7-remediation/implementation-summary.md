---
title: "Implementation Summary: Memory search Clusters 4-7 remediation"
description: "Closed the Clusters 4-7 runtime defects for memory search, causal stats, folder discovery, CocoIndex health, quality fallback routing, and intent stability."
trigger_phrases:
  - "memory search clusters 4-7 implementation"
  - "memory causal graph remediation summary"
  - "cocoindex daemon probe summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-clusters-4-7-remediation"
    last_updated_at: "2026-05-08T21:15:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Implemented Clusters 4-7 remediation and captured verification evidence"
    next_safe_action: "Resolve repo-wide Vitest baseline failures if this packet needs a full-suite green gate"
    blockers:
      - "Repo-wide pnpm vitest run fails outside this packet: 6 failed suites and 208 failed tests in advisor, hook, scaffold, alignment, and code-graph fixtures."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts"
    session_dedup:
      fingerprint: "sha256:064afa1687c8c6cb6838c7eb061ce2a449a6d46d29a83a82d595f20746627a5b"
      session_id: "memory-clusters-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: Chose a memory-specific runtime session id for memory_context when callers omit sessionId."
      - "Q2: Chose structural code graph and memory causal graph as the user-facing names."
      - "Q3: Documented existing AskUserQuestion custom-answer routing instead of adding a new menu option."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-clusters-4-7-remediation` |
| **Completed** | 2026-05-08 |
| **Level** | 2 |
| **Requirements Closed** | 13/13 |
| **Requirements Deferred** | 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Memory search now has explicit weak-signal behavior instead of silent success paths. Causal stats show complete relation output and actionable remediation, folder discovery avoids binding weak token matches, CocoIndex health is visible, and the query router records a bounded FTS5 -> BM25 -> Grep fallback when retrieval quality is a gap.

### Cluster 4: Memory Causal Graph Stats

`memory_causal_stats` now zero-fills the required output relations, gates health on `meetsTarget`, exposes relation-coverage targets, and emits either top unlinked records or the backfill command when coverage misses target. The handler path in the authored spec named `handlers/memory-causal-stats.ts`, but the registered implementation lives in `handlers/causal-graph.ts`.

### Cluster 5: State Hygiene

`memory_context` now uses a memory-specific runtime session id when callers omit `sessionId`, which keeps session dedup stable without broadening global session state. The command docs also describe dedup over trigger and constitutional context channels.

### Cluster 6: Discovery And Channel Health

Folder auto-discovery now requires each meaningful query token to clear a configurable similarity threshold, defaulting to `0.45`. CocoIndex daemon probing was added with a 30s TTL and bounded PID/log metadata, and `memory_health` surfaces the probe status.

### Cluster 7: Fallbacks And Stability

The query router now exposes a quality-gap fallback plan when `quality:"gap"` and `avg_score < 0.20`, with a 200ms budget and FTS5, BM25, Grep tiers. The informal intent-classifier paraphrase check is now a formal 20-case corpus with an 80% accuracy floor.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/handlers/causal-graph.ts` | Modified | Memory causal graph output, coverage health, remediation hints |
| `mcp_server/lib/causal/relation-coverage.ts` | Created | Per-relation coverage target/current-state tracker |
| `mcp_server/handlers/memory-context.ts` | Modified | Memory-specific stable session id for dedup |
| `mcp_server/handlers/memory-search.ts` | Modified | CocoIndex status warning and quality-gap fallback telemetry |
| `mcp_server/lib/search/folder-discovery.ts` | Modified | Per-token similarity gate for folder auto-binding |
| `mcp_server/lib/cocoindex/daemon-probe.ts` | Created | Reachable/unreachable/degraded CocoIndex probe with TTL cache |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | `cocoIndex.status` in memory health |
| `mcp_server/lib/search/query-router.ts` | Modified | Quality-gap fallback plan and routing reason |
| `mcp_server/lib/query/query-plan.ts` | Modified | Fallback policy shape for tier/deadline metadata |
| `mcp_server/lib/search/intent-classifier.ts` | Modified | Formal 20-paraphrase stability corpus export |
| `commands/memory/search.md` | Modified | Custom-answer routing and graph naming disambiguation |
| `mcp_server/tests/*.vitest.ts` | Modified/Created | Four new test files plus router and causal integration assertions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed additive around existing handler contracts: no causal graph schema change, no Cluster 1-3 rewrite, and no hook-surface edits. New helpers are isolated under `lib/causal` and `lib/cocoindex`, while existing response envelopes keep compatibility by adding fields instead of replacing old ones.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use a memory-specific runtime session id | It fixes REQ-011 inside `memory_context` without coupling unrelated MCP tools to the same synthetic session. |
| Use "structural code graph" and "memory causal graph" | It separates code-structure retrieval from memory-lineage analysis and is reversible by grep. |
| Document custom-answer routing | The existing AskUserQuestion flow already routes free-form answers as retrieval queries, so a new menu option would add UI churn without new capability. |
| Keep `enabled` and `derived_from` in causal stats output | Existing storage relations remain valid, while the new `produced` and `cited_by` buckets are also zero-filled for the packet contract. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pnpm tsc --noEmit` | FAIL: wrapper cannot find `tsc` because `mcp_server/node_modules/.bin` lacks the TypeScript binary. |
| `node ../node_modules/typescript/lib/tsc.js --noEmit --composite false -p tsconfig.json` | PASS |
| Focused packet and adjacent memory-search tests | PASS: 11 files, 114 tests (`intent-classifier-corpus`, `causal-stats-output`, `folder-discovery-threshold`, `cocoindex-daemon-probe`, `query-router`, `handler-causal-graph`, `integration-causal-graph`, `memory-search-ux-hooks`, Gate D search pipeline, Gate D embedding search, `memory-search-eval-channels`) |
| `pnpm vitest run` | FAIL: full run reported 6 failed suites and 208 failed tests across repo-wide advisor, hook, scaffold, alignment, code-graph, and fixture areas. Packet-adjacent failures found in that run were fixed and rerun green in the focused battery. |
| Strict packet validation | PASS: `validate.sh .../006-search-clusters-4-7-remediation --strict` exited 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full-suite gate is blocked by repo-wide baseline failures.** The packet-focused battery passes, but `pnpm vitest run` is red before this packet can honestly claim the baseline holds.
2. **Requested `pnpm tsc --noEmit` wrapper is not available.** Direct TypeScript invocation passes with the installed compiler at `../node_modules/typescript/lib/tsc.js`.
3. **CocoIndex probe is filesystem-liveness based.** It reports PID/log/lock/socket state with a 30s TTL and does not inspect process arguments or environment values.
<!-- /ANCHOR:limitations -->
