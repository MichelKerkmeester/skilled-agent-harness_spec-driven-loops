---
title: "Implementation Summary: Manual Test Verification and Fixes"
description: "Completed manual verification arc, shipped fixes, readiness recovery, and deferred finding record."
trigger_phrases:
  - "manual verification summary"
  - "gold battery fix summary"
  - "bm25 scoped fill summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/015-manual-test-verification-and-fixes"
    last_updated_at: "2026-07-05T23:59:00Z"
    last_updated_by: "opencode"
    recent_action: "Record manual verification and shipped fixes"
    next_safe_action: "Run strict validation for the surface-alignment parent"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-manual-test-verification-and-fixes |
| **Completed** | 2026-07-05 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This documentation phase records the completed manual verification-and-fixes arc for the Fable-5-refined `008` surface-alignment features. The code and tests were already committed to `origin/028`; this phase creates the documentation record only.

### Verification Results

| Area | Result | Evidence |
|------|--------|----------|
| Overall runnable manual items | 25 PASS / 2 FAIL / 3 BLOCKED | Approximately 30 runnable items from approximately 510 total scenarios; most non-runnable scenarios needed the spec-memory daemon. |
| deep-loop-runtime scoring + coverage-graph | 8/8 PASS | Manual verification category result. |
| deep-loop observability + convergence | 7/7 PASS | Manual verification category result. |
| system-code-graph 05/06/08 | 5 PASS, 1 FAIL, 3 BLOCKED before fix/recovery | FAIL was `code_graph_apply` gold-battery ENOENT; BLOCKED was stale graph readiness. |
| stress harness from `012-fix` | Substrate, durability, and matrix PASS; search-quality had one failing file before fix | Search-quality failure closed by BM25 scoped fill-limit fix. |

### Fixes Shipped Before This Documentation Pass

| Fix | Commit | Files | Runtime/Test Effect |
|-----|--------|-------|---------------------|
| Gold-battery path normalization | `bda7f57879` | `system-code-graph/mcp_server/lib/gold-query-verifier.ts` | `GOLD_BATTERY_RELATIVE_PATH` no longer points at pre-normalization `system-spec-kit/026-...`; it points at normalized `system-speckit/026-...`, where the gold file exists at 10.8KB. Source fix shipped; dist is gitignored; runtime effect waits for code-graph daemon reload. |
| BM25 scoped fill-limit regression | `e4fcccc320` | `system-spec-kit/mcp_server/lib/search/hybrid-search.ts`; `bm25-scope-then-limit-stress.vitest.ts` | Restores corpus-bounded `candidateLimit = (specFolder||db) ? index.getStats().documentCount : limit`; preserves performance saving through rank-ordered 500-id metadata batches with early exit at `limit` survivors; preserves fail-closed guards. |

### BM25 Verification Evidence

| Check | Result | Notes |
|-------|--------|-------|
| `stress:harness` | 45/45 PASS | Baseline was 42/45 before the fix. |
| `hybrid-search.vitest` | 102/102 PASS | Search suite green after the BM25 fix. |
| `tsc` | Clean | TypeScript validation green. |
| Regression baseline delta | 0 | No new regression beyond the fixed fill-limit behavior. |

### Recovery Actions

| Action | Result | Notes |
|--------|--------|-------|
| `code_graph_scan` | Graph stale to fresh/ready/live | The three blocked code-graph scenarios became runnable; `blast_radius` moved BLOCKED to ok. |
| Spec-memory daemon cold-start | Real search hits served | `memory_search "surface alignment remediation"` returned 3 hits. Historical crash-on-request is resolved by DELETE-journal DB rebuild plus native-ABI rebuild. |
| `memory_health` | Still degraded/0-memories | Recorded as a health-reporting/main-DB-init quirk and daemon-side follow-up, not as a search-serving failure. |

### Files Changed By This Documentation Pass

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Level-2 specification for this verification-and-fixes record. |
| `plan.md` | Created | Delivered plan and evidence flow. |
| `tasks.md` | Created | Completed task ledger. |
| `checklist.md` | Created | Evidence checklist. |
| `implementation-summary.md` | Created | Final state summary. |
| `decision-record.md` | Created | BM25 adjudication record. |
| `description.json` | Generated | Spec metadata. |
| `graph-metadata.json` | Generated | Phase graph metadata. |
| `../spec.md` | Modified | Parent phase documentation map row for `015`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The manual verification and code/test fixes completed before this documentation pass. This pass records the facts, generated phase metadata, and updates the parent phase map without modifying code, tests, product files, or git state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Treat BM25 under-fill as product regression | Corpus-bounded over-fetch was an intentional 2026-06-11 scoping fix, while the 016/010 performance commit claimed no behavior change but broke scoped fill-limit. |
| Use A-incremental rather than a straight revert | Straight revert would be correct but would re-inflate metadata SELECT volume; A-incremental keeps correctness and preserves the useful performance saving. |
| Defer lexical-overlap-quality-gate | It fails identically on origin, delta 0, and even fails when run alone; ownership belongs to the FTS/016 fixture-vs-engine decision. |
| Close `exactTriggerSearch limit*3` as safe | Its SQL filters scope, tier, active rows, and triggers in `WHERE` before `LIMIT`, so the BM25 scope-crowding failure mode does not apply. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Manual runnable scenarios | Pass with recorded failures/blockers | 25 PASS / 2 FAIL / 3 BLOCKED across approximately 30 runnable items. |
| Gold-battery failure | Fixed at source | Commit `bda7f57879`; `system-code-graph/mcp_server/lib/gold-query-verifier.ts`; runtime effect pending daemon reload. |
| BM25 scoped fill-limit | Fixed and verified | Commit `e4fcccc320`; `stress:harness` 45/45; `hybrid-search.vitest` 102/102; `tsc` clean. |
| Code-graph blockers | Unblocked | `code_graph_scan` restored fresh/ready/live graph status; `blast_radius` BLOCKED to ok. |
| Spec-memory daemon search | Pass | Cold-started and served `memory_search "surface alignment remediation"` with 3 hits. |
| Lexical-overlap-quality-gate | Deferred | 18/20 FAIL, pre-existing, origin parity delta 0, fails alone; deferred to FTS/016 owner. |
| `exactTriggerSearch limit*3` | Closed safe | SQL filters happen in `WHERE` before `LIMIT`; no scope-crowding under-fetch. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-E01 | Evidence cites commits and files | Commits `bda7f57879` and `e4fcccc320` plus source file paths recorded | Pass |
| NFR-E02 | No false completion claims | Lexical-overlap-quality-gate remains explicitly deferred | Pass |
| NFR-S01 | Runtime readiness separated from product fixes | Code-graph scan and spec-memory daemon recovery recorded separately | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The gold-battery source fix is shipped, but live runtime effect waits for a code-graph daemon reload because dist is gitignored.
2. `memory_health` still self-reports degraded/0-memories; this is a health-reporting/main-DB-init follow-up, not a search-serving failure in the recorded cold-start check.
3. The lexical-overlap-quality-gate remains open and deferred to the FTS/016 owner.
<!-- /ANCHOR:limitations -->
