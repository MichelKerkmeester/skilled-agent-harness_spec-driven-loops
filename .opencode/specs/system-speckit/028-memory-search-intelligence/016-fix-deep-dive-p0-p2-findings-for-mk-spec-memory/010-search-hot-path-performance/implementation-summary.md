---
title: "Implementation Summary: Search Hot-Path Performance"
description: "Batched, cached, and gated the twelve measured hot spots in the memory_search path — one id-IN rescue hydration, FTS-routed backfill, per-search graph/community/intent caches, single-envelope serialization, bounded keyword fallback, path+mtime directive cache, and scan-side stat batching — with rank parity and FTS token-equivalence proven; the live p50<800ms target is a daemon-side capture pending, not measured in the isolated worktree."
trigger_phrases:
  - "search hot path performance"
  - "memory search latency"
  - "rescue hydration batching"
  - "envelope single serialization"
  - "fts token equivalence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/010-search-hot-path-performance"
    last_updated_at: "2026-07-04T10:36:45.419Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Integrated 010 (12 REQs); parity + FTS gates green; live p50 is daemon-side"
    next_safe_action: "Phase 012 envelope-presentation-and-command-doc-alignment"
    blockers: []
    key_files:
      - "mcp_server/lib/search/rerank/retrieval-rescue.ts"
      - "mcp_server/lib/graph/graph-signals.ts"
      - "mcp_server/handlers/memory-search.ts"
      - "mcp_server/lib/search/intent-classifier.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-016-010-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The live p50<800ms / scan-lag / match_triggers targets are daemon-side captures — they require the 33k-row live corpus and were not measurable in the isolated worktree; run the harness after the daemon leases restart to confirm the speedup lands"
    answered_questions:
      - "Rank parity holds: a full-pipeline golden-order fixture (through rescue/enrichment, not stopped at fusion) asserts identical ordered ids, so the perf changes do not alter ranking"
      - "The FTS-routed backfill is token-equivalent to the LIKE it replaces across the adversarial table (quotes, NEAR/OR/-, unicode, empty, no-op gate); unsafe/empty inputs fall back to LIKE"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-search-hot-path-performance |
| **Completed** | 2026-07-04 (code + parity/equivalence gates; live latency pending daemon-side) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `memory_search` hot path had twelve measured hot spots, and this phase batches, caches, or gates each one without changing what the search returns. The rescue layer stopped issuing a `SELECT *` per candidate — hydration is now one parameterized `id IN (...)` fetch chunked below the SQLite variable limit — and its full-table substring `LIKE` backfill is FTS-routed when the input is safe and gated to a weak-result path otherwise. Graph adjacency is cached across searches (keyed on DB identity, reusing the scheme phase 008 established, invalidated on edge writes and DB rebind), the community table is loaded and parsed once per search instead of per candidate row, and the intent classifier memoizes its query embedding so a deep query embeds a distinct text at most once instead of six-to-eight times. The response envelope is built on object references and serialized once at emission rather than round-tripped through `JSON.parse`/`JSON.stringify` at every transform. The keyword fallback routes through FTS with a SQL-side limit bounded to a small multiple of the requested count instead of materializing the full table into JS, constitutional and retrieval-directive files are cached by `(path, mtime)` so they are not re-read once per result, and the scan side batches its stale-check stats through directory reads with a hash fast-path and a folder-discovery TTL probe.

### The two gates that had to hold

Because this is pure performance work, two properties had to be proven, not assumed. Rank parity: a fixed-query fixture runs the full pipeline — through rescue and enrichment, not stopped at fusion — and asserts an identical ordered id list, so none of the batching or caching reorders results. FTS token-equivalence: the FTS-routed backfill must match the substring `LIKE` semantics it replaces, so an adversarial table asserts the FTS route and the LIKE route return the same ids across double-quotes, the FTS5 operators `NEAR`/`OR`/unary `-`, unicode, the empty string, and the no-op weak-result gate; unsafe or empty inputs fall back to LIKE rather than diverge.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented the 12 REQs; the first pass was the weakest of the program — an independent xhigh reviewer passed only the batched-hydration REQ and failed the other eleven, catching that the intent memoization did not actually reduce embed calls and that the envelope single-serialization was never implemented, neither of which the green build and tests revealed. A large GPT-high remediation brought it to 10 of 12, verified by **three parallel xhigh reviewers** split by concern — one on the two gates, one on the code-gap REQs, one on the mechanism-and-test-strength REQs. That parallel pass isolated exactly two survivors: a rank-parity test that stopped at fusion instead of exercising the full pipeline, and a stray `JSON.parse`/`JSON.stringify` still living in the handler hot path. A tight second remediation fixed both, and Opus 4.8 confirmed each against the reviewer's exact file:line before integrating the 16 hot-path files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rank parity proven with a full-pipeline golden-order fixture | A parity test that stops at fusion can't catch a reorder in the rescue/enrichment path — exactly where the hydration and backfill changes landed |
| FTS-routed backfill falls back to LIKE on unsafe/empty input | FTS MATCH can't be made token-equivalent to substring LIKE for every input; gating the un-equivalent inputs to LIKE preserves semantics while the safe majority gets the FTS speedup |
| Adjacency cache reuses 008's DB-identity keying | 008 already owns the signal-cache DB-identity fix; re-fixing it here with a memoryId-only key would reintroduce the cross-database staleness 008 closed |
| Live latency is a daemon-side capture, not faked | The p50<800ms gate needs the 33k-row live corpus, absent in the worktree; reporting a fabricated number would be worse than an honest pending |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --build` (integrated main) | PASS (exit 0) |
| 010 targeted vitest (6 suites) | PASS (183 passed, 1 skipped) |
| REQ-001..012 verification | 12/12 (1/12 first pass → 10/12 after remediation → 12/12 after 2nd) |
| REQ-004 rank parity | PASS (full-pipeline golden ordered-id fixture) |
| REQ-003 FTS token-equivalence | PASS (7 adversarial cases; unsafe/empty fall back to LIKE) |
| REQ-008 envelope single-serialization | PASS (stray handler JSON round-trip removed; 0→1 serialization asserted) |
| Independent verify | 3 parallel xhigh reviewers by concern + 2 targeted passes |
| `validate.sh --strict` | PASS |
| **Live p50<800ms / scan-lag / match_triggers** | **NOT MEASURED — daemon-side capture pending** |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The headline p50<800ms target is not yet measured.** The batching, caching, and gating that should produce the speedup are all implemented and unit-verified, but the warm p50/p95, full-scan event-loop-lag, and `match_triggers` timing require the live 33k-row corpus and the running daemon — absent in the isolated worktree. Run the fixed-query harness after the daemon leases restart with this code to confirm the target lands. Mechanism-level baselines (call/parse/serialization counts) are recorded in `scratch/mechanism-baseline-2026-07-04.md`.
2. **Code effects apply on the next daemon-lease restart.** Like phases 001–009, the hot-path changes take effect when the daemon reloads the rebuilt dist.
3. **The perf work assumes a corrected corpus and decided ranking contract.** It runs late in program order so it batches over the 008-cleaned graph and the 006/007 ranking contract; if those shift, the parity golden order must be recaptured.
<!-- /ANCHOR:limitations -->
