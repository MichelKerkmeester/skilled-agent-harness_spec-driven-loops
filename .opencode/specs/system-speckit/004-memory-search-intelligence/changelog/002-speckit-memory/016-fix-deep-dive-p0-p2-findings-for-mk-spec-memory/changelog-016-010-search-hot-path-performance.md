---
title: "Changelog: Search Hot-Path Performance [016/010-search-hot-path-performance]"
description: "Batched, cached and gated the twelve measured hot spots in the memory_search path with rank parity and FTS token-equivalence proven, leaving the live p50 target as a daemon-side capture."
trigger_phrases:
  - "search hot path performance changelog"
  - "rescue hydration batching"
  - "fts token equivalence"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/004-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/010-search-hot-path-performance/` (Level 2)
> Parent packet: `.opencode/specs/system-speckit/004-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

The `memory_search` hot path had twelve measured hot spots and this phase batches, caches or gates each one without changing what search returns. The rescue layer stopped issuing a `SELECT *` per candidate. Hydration is now one parameterized `id IN (...)` fetch chunked below the SQLite variable limit. Its full-table `LIKE` backfill is FTS-routed when the input is safe. Graph adjacency, the community table and the intent classifier's query embedding are cached per search. The response envelope is serialized once at emission instead of round-tripped through `JSON.parse` and `JSON.stringify` at every transform. Two properties were proven: rank parity through a full-pipeline golden-order fixture and FTS token-equivalence against the substring `LIKE` it replaces. The live p50 under 800ms target is a daemon-side capture pending a restart, not measured in the isolated worktree. Shipped in `d17b0d7b99`.

### Changed

- Rescue hydration is one parameterized `id IN (...)` fetch chunked below the SQLite variable limit.
- The rescue `LIKE` backfill is FTS-routed on safe input and gated to a weak-result path otherwise.
- Graph adjacency is cached across searches, keyed on DB identity and invalidated on edge writes and DB rebind.
- The community table is loaded and parsed once per search instead of per candidate row.
- The intent classifier memoizes its query embedding so a deep query embeds at most once instead of six to eight times.
- The response envelope is built on object references and serialized once at emission.
- The keyword fallback routes through FTS with a SQL-side limit bounded to a small multiple of the requested count.
- Constitutional and retrieval-directive files are cached by path and mtime.
- The scan side batches its stale-check stats with a hash fast-path and a folder-discovery TTL probe.

### Verification

- `npx tsc --build` exit 0.
- 010 targeted vitest 183 passed, 1 skipped, across 6 suites.
- REQ verification 12 of 12. It went 1 on the first pass, then 10 after remediation, then 12 after a second pass.
- Rank parity pass on a full-pipeline golden ordered-id fixture.
- FTS token-equivalence pass across 7 adversarial cases. Unsafe and empty inputs fall back to LIKE.
- Verified by three parallel xhigh reviewers by concern plus two targeted passes.
- `validate.sh --strict` pass.
- Live p50 under 800ms, scan-lag and match_triggers timing not measured. Daemon-side capture pending.

### Files Changed

- `mcp_server/lib/search/rerank/retrieval-rescue.ts` batches hydration and routes the backfill.
- `mcp_server/lib/graph/graph-signals.ts` caches adjacency on DB identity.
- `mcp_server/handlers/memory-search.ts` serializes the envelope once.
- `mcp_server/lib/search/intent-classifier.ts` memoizes the query embedding.

### Follow-Ups

- The headline p50 under 800ms target is not yet measured. Run the fixed-query harness after the daemon leases restart with this code. Mechanism-level baselines are recorded in `scratch/mechanism-baseline-2026-07-04.md`.
- Code effects apply on the next daemon-lease restart.
