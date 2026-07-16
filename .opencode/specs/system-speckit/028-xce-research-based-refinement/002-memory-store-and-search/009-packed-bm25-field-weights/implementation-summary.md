---
title: "Implementation Summary"
description: "Shipped packed-inmemory BM25 engine with typed-array postings, BM25F field weighting, explicit engine selection, budget tests, and fixture-backed baseline eval evidence."
trigger_phrases:
  - "014-packed-bm25-field-weights summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights"
    last_updated_at: "2026-06-10T20:40:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shipped packed-inmemory BM25 fallback with typed postings and BM25F weighting"
    next_safe_action: "Track 3x RSS separately if needed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-packed-bm25-field-weights"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-packed-bm25-field-weights |
| **Completed** | 2026-06-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status: SHIPPED. The reserved `packed-inmemory` BM25 engine now has a real packed postings implementation, BM25F field weighting, explicit selection logging, fixture budget gates, and a baseline comparison against legacy and FTS5 scoring.

### Packed Engine Design

The packed engine stores per-document length and term keys only. Term frequencies live in a term dictionary that builds append-only numeric postings during warmup, then compacts them into typed arrays for search. After finalization, mutable construction arrays are cleared; later incremental updates hydrate only the touched term back into mutable form.

Search reads postings for query terms instead of scanning every document. Each posting carries total, title, trigger phrase, path, and body frequencies. BM25F scoring multiplies those field frequencies by the shared field weights at query time, so callers can override weights without rebuilding the index.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | Modified | Added packed storage, typed-array postings, BM25F scoring, selection logging, and packed warmup finalization |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts` | Modified | Added a fixture-backed engine comparison helper for legacy, packed, and FTS5 metrics |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts` | Created | Added current-corpus and relevance fixtures for budget and baseline evaluation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts` | Created | Added budget, BM25F, engine-toggle, and baseline parity tests |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | Reconciled status, continuity, tasks, and evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as an additive in-memory engine path. `legacy-inmemory` remains selectable, `packed-inmemory` now uses the packed implementation, and `auto` chooses the packed in-memory fallback when an in-memory fallback instance is needed. Selection is logged once per routing reason.

The FTS5 channel is unchanged. The packed fallback mirrors the FTS5 field-priority intent with title > trigger phrases > path > body weights from `BM25_FIELD_WEIGHTS`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep legacy behind the engine flag | Regression comparison and rollback remain possible without changing callers |
| Use typed arrays after warmup | Query-time search only needs compact numeric postings; mutable warmup arrays are discarded after finalization |
| Keep weights query-time tunable | Title weighting can be restored without rebuilding the index or changing the FTS5 channel |
| Treat 3x RSS as a future scale risk | The current P0 corpus passed; 3x exceeded 150 MB and should be handled by a separate scale packet if needed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS, exit 0 |
| `npx vitest run tests/bm25-packed-inmemory.vitest.ts` | PASS, 1 test file, 4 tests |
| Current corpus budget fixture | SUPERSEDED: the original 111 MB spike measurement under-modeled warmup churn; the realistic-fixture re-validation breached the 150 MB budget (spike in the hundreds of MB, RAM gate left failing) and the budget was closed by phase 017 at a 136.5 MB peak-sampled spike |
| 3x corpus projection | MEASURED: 30,735 docs, RSS spike 247,676,928 bytes, warmup 2,689 ms; exceeds 150 MB and is not the current P0 gate |
| BM25 baseline comparison | PASS: packed MRR@5 1.0000, NDCG@10 1.0000, Recall@20 1.0000, HitRate@1 1.0000; legacy MRR@5 0.9000; FTS5 MRR@5 1.0000 |
| Comment hygiene | PASS for all changed code and test files via `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>` |
| Alignment drift | FAIL on out-of-scope pre-existing files: `mcp_server/lib/storage/canonical-fingerprint.ts` missing module header, `scripts/deploy-mcp.sh` missing strict mode |
| Strict spec validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights --strict`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **RSS budget closed by phase 017, not by this phase.** The original current-corpus gate measurement was repudiated by the realistic-fixture re-validation (budget breach, RAM gate left failing at phase close); phase 017 closed the budget at a 136.5 MB peak-sampled spike. The minisearch contingency was never triggered.
2. **Live database was not touched.** Budget and relevance evidence used fixture DBs and generated fixture corpora only.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
