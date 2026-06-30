---
title: "Implementation Summary: memory_index_scan UX hardening deep-research [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/implementation-summary]"
description: "Outcome of a 5-iteration deep-research design loop on making the spec-kit memory indexing subsystem future-proof, foot-gun-proof, always-completing, degradation-tolerant, and self-healing. Design research only; canonical synthesis is research/research.md."
trigger_phrases:
  - "memory index scan ux hardening outcome"
  - "memory_index_scan async scan job recommendation"
  - "012 deep research summary"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening"
    last_updated_at: "2026-05-31T14:06:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized research.md + resource-map.md from 5 iterations"
    next_safe_action: "Run /speckit:plan for the minimal first slice"
    blockers: []
    key_files:
      - "research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/core/db-state.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-memory-index-scan-ux-hardening |
| **Completed** | 2026-05-31 (design research; 5/5 iterations) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A design-research deliverable, not code. Five convergence-gated iterations (executor `gpt-5.5`: iteration 1 via cli-codex reasoning xhigh; iterations 2-5 via cli-opencode variant high) investigated five angles and produced `research/research.md` (17 sections, every current-behavior claim cited to `file:line`) plus `research/resource-map.md`.

### Recommended design — self-maintaining index
`memory_index_scan` becomes an **idempotent, coalescing, phased async scan job**:
- **Caller contract (A1):** always returns a job envelope; a 2nd call for the same `scanKey` joins the in-flight job (`coalesced:true`); the hardcoded 30s `INDEX_SCAN_COOLDOWN` (`core/config.ts:126`) becomes an internal worker-start guard, never a raw E429. Reuses the existing `embedder_status` jobId/progress surface.
- **Timeout hardening (A2):** 3-phase job — bounded walk → commit-lexical (rows `pending`, BM25/FTS-searchable immediately via `vector-index-mutations.ts:337`) → async vector drain. Eliminates the `force:true`-on-big-root `-32001` class structurally.
- **Concurrency (A3):** single-writer serialization via atomic claim-by-update (`retry-manager.ts:303`); per-worktree DBs are independent lease domains; heartbeat lease-steal after the ~60s expiry.
- **Embedder resilience (A4):** run scan indexing in async mode so lexical always commits; vector drain checks provider/circuit state BEFORE the atomic pending→retry claim (so an outage can't convert clean `pending` backlog into prunable `retry` rows); surface `complete_with_pending_vectors` + `degraded` + `nextVectorAttemptAfter`.
- **Self-healing (A5):** bounded orphan sweep reusing `delete_memory_from_database()`; move reconciliation keyed on `graph-metadata.json` `packet_id` + doc role/anchor (content hash confirmation only); a `memory_health.index` freshness summary (`healthy_fresh`/`healthy_lagging_vectors`/`stale_needs_scan`/`degraded_needs_repair`/`unavailable`); lazy reconcile-on-`File not found`-search + post-commit stale marker feeding the A1 coalescer.

### Minimal first slice (recommended for /speckit:plan)
1. Caller-contract coalescing — a 2nd scan returns the in-flight/recent job instead of E429 (least code, kills the foot-gun).
2. `memory_health.index` block + bounded orphan sweep — directly fixes this session's observed orphan rows and makes index freshness visible.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `/deep:start-research-loop:auto` workflow with `--iterations 5`. Iteration 1 ran on cli-codex `gpt-5.5` reasoning xhigh; iterations 2-5 ran on cli-opencode `openai/gpt-5.5 --variant high` (operator directive). Each iteration was a fresh executor context that read the actual `mcp_server/` source, wrote an iteration narrative + JSONL state record + delta file, and the reducer refreshed registry/dashboard/strategy. newInfoRatio trend: 0.92 → 0.86 → 0.78 → 0.74 → 0.62 (monotonic; healthy). Stop reason: maxIterationsReached with all five angles answered. The synthesis was reconciled against the real iteration-5 output after a premature-write was caught and corrected.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the existing `embedder_status` async job model for scans rather than invent a new surface | Lowest-risk path; the jobId/progress/eta pattern already exists and is caller-friendly |
| Make the 30s cooldown an internal coalescing key, not a caller error | Removes the E429 foot-gun while preserving thrash protection |
| Commit lexical rows first, defer vectors via existing `pending`/`retry` status | Decouples search availability from the fragile embedder; eliminates the timeout class |
| Key move-reconciliation on `packet_id` + doc role/anchor, content-hash as confirmation only | Avoids false-positive merges of copied/template-identical files |
| Design research only — no production code changed | Scope discipline; implementation is a separate gated `/speckit:plan` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 5/5 iteration narratives + delta files + state records present | PASS |
| research/research.md — 17 sections, no fabricated ratios (0.71 removed; real 0.62) | PASS |
| research/resource-map.md emitted | PASS |
| config.status = complete | PASS |
| Every current-behavior claim cited to file:line | PASS (per-iteration narratives) |
| Production code changed | NONE (design research only) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Design research only** — no code changed; implementation is a follow-on `/speckit:plan`.
2. **Reducer `keyFindings` count shows 0** — a delta-type-mapping quirk; the findings are fully present in `research/research.md` and the per-iteration `deltas/iter-*.jsonl`.
3. **Memory-index save of this packet** was completed by authoring this continuity doc directly + indexing it; the canonical `generate-context.js` planner aborted on this research-shaped payload (insufficient created/modified evidence — expected for a read-only research packet).
<!-- /ANCHOR:limitations -->
