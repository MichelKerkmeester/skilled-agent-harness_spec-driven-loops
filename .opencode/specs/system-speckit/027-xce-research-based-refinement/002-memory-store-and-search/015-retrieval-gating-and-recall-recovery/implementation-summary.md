---
title: "Implementation Summary"
description: "Recalibrated the retrieval request-quality gate to read absolute cosine relevance so on-topic memory searches stop reporting weak/do_not_cite, with ordering left untouched and the change flag-gated."
trigger_phrases:
  - "retrieval gating implementation"
  - "absolute relevance calibration"
  - "request quality good"
  - "recall recovery"
  - "impl summary core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/015-retrieval-gating-and-recall-recovery"
    last_updated_at: "2026-06-16T18:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Implemented vector-lane cold inclusion (option A) behind opt-in flag"
    next_safe_action: "Live-activate SPECKIT_INCLUDE_ARCHIVED_VECTOR + spot-check when daemon is up"
    blockers: []
    key_files:
      - "mcp_server/lib/search/pipeline/types.ts"
      - "mcp_server/lib/search/confidence-scoring.ts"
      - "mcp_server/lib/search/search-flags.ts"
      - "mcp_server/lib/search/sqlite-fts.ts"
      - "mcp_server/lib/search/hybrid-search.ts"
      - "mcp_server/lib/search/vector-index-queries.ts"
      - "mcp_server/lib/storage/lineage-state.ts"
      - "mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:4444444444444444444444444444444444444444444444444444444444444444"
      session_id: "impl-015-retrieval-gating-and-recall-recovery"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Live-verify the vector-lane projection backfill on the running daemon."
    answered_questions:
      - "Calibrate off cosine, not RRF magnitude."
      - "Include archived/cold tiers by default for all users; FSRS ranks them."
      - "Vector lane: option A (orphans only), implemented behind opt-in flag."
      - "Do not add a reranker."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-retrieval-gating-and-recall-recovery |
| **Completed** | Partial (calibration + query-time cold-tier inclusion + presentation shipped; vector-lane inclusion and index repair deferred; reranker rejected) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

On-topic memory searches used to report `requestQuality: weak` and `do_not_cite_results` even when the exactly-right specs were indexed and surfaced. The gate read the RRF fusion score (a relative rank-fusion magnitude around 0.01-0.05) against thresholds calibrated for a cosine scale (HIGH 0.7 / LOW 0.4), so `good` was structurally unreachable and every hybrid query collapsed to weak. This session shipped the calibration fix and the presentation fix, and staged the higher-risk recall work.

### Absolute relevance calibration (shipped)

You now get a request-quality verdict that reads the real relevance scale. `resolveAbsoluteRelevance()` in `mcp_server/lib/search/pipeline/types.ts` prefers cosine similarity (0-1) over the RRF magnitude; lexical-only hits fall back to the effective score so the gate always has a value to read. `confidence-scoring.ts` feeds that absolute relevance into the confidence `scorePrior` and into the `assessRequestQuality` topScore, while margins keep using the ordering score. The result ordering is untouched: `resolveEffectiveScore` still drives which results rank first, so calibration only changes the confidence, quality, and digest scale, not the ranking.

Because `formatters/search-results.ts` derives `citationPolicy` (deriveCitationPolicy) and `responsePolicy` (deriveResponsePolicy) purely from `requestQuality.label === 'good'`, and `avgConfidence` for the recovery gate is the mean calibrated `confidence.value`, raising calibration flips the citation policy from do_not_cite to cite_results and relaxes the recovery trigger together. The whole change sits behind `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` (default ON, graduated) in `search-flags.ts`; set it to `false` to revert.

### Consistent score scale in the response (shipped)

The evidence digest "avg score" and each per-result "why" in `mcp_server/lib/response/profile-formatters.ts` now read the same absolute relevance the gate reads, so the number a user sees matches the verdict they get instead of showing a third, lower-scaled value.

### Truncation-resilient presentation (shipped)

`/memory:search` no longer looks empty when the token budget truncates results. `.opencode/commands/memory/assets/search_presentation.txt` now renders from `progressiveDisclosure` when `meta.tokenBudgetTruncated` is set, and de-duplicates constitutional auto-surface rows so a repeated constitutional rule does not crowd out real hits.

### Cold/archived-tier inclusion in the query-time channels (shipped)

Archived/cold memories are now included in retrieval for all users, not walled off. The deprecated-tier hard exclusion in the query-time channels — lexical FTS/BM25 (`mcp_server/lib/search/sqlite-fts.ts`) and the in-memory BM25 plus trigger channels (`mcp_server/lib/search/hybrid-search.ts`) — is now gated by `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` (default ON). This matches the existing hot/cold model: `fsrs-scheduler.ts` decays the deprecated tier at 0.25x (coldest), so retrievability already ranks cold rows below hot ones and a hard wall was redundant. Constitutional rows keep their own injected path and stay out of the ranked channels. Set `SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false` to restore the hard exclusion.

### Vector-lane inclusion and index repair (staged / deferred)

NOT done, documented as open tasks: the vector lane filters through the materialized `active_memory_projection` (built with `activePredicate` excluding deprecated), so cold rows reach the vector channel only after that predicate is redefined and the projection rebuilt — deferred to land with the Tier A index repair (2,745 failed vectors, ~527 missing vectors, ~3,237 un-enriched rows), which is CPU-heavy local re-embedding to run when the operator is home. A reranker was considered and REJECTED per operator directive; `pipeline/stage3-rerank.ts` stays as-is.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The calibration shipped behind a default-ON graduated flag so it can be reverted with a single env toggle. A new `absolute-relevance-calibration.vitest.ts` adds 6 tests, all passing, covering cosine-over-RRF preference, the lexical fallback, and the `=false` revert path. The existing confidence and recovery suites run green (129 tests, no regression), and `npm run typecheck` is clean. The presentation change is a render-side update to the command asset. The staged recall items were deliberately held: the archived opt-in needs live verification because flipping it wrong would flood results with the 4,847 deprecated docs, and Tier A index repair is CPU-heavy local ollama re-embedding that must run only when the operator is home and confirms.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Calibrate off absolute cosine relevance, not the RRF magnitude | Chose cosine because the RRF magnitude is a relative rank-fusion value, not a 0-1 relevance, so any threshold against it is brittle and corpus-dependent |
| Leave `resolveEffectiveScore` ordering untouched | Kept ordering on the fusion score because the bug was the gate's scale, not the ranking, and changing both would risk a regression we did not need |
| Flag-gate calibration default ON, graduated | Shipped default-ON so the fix takes effect, but kept a one-toggle revert because it changes a public response policy on a live daemon |
| Include cold/deprecated tiers by default for all users (query-time channels) | Operator directive; the FSRS temperature model already down-ranks cold rows (deprecated decays 0.25x), so a hard exclusion was redundant and hid relevant history |
| Defer vector-lane cold inclusion to the index rebuild | The vector lane filters via the materialized `active_memory_projection`; including cold rows there needs a projection redefinition + rebuild, which belongs with the deferred reindex |
| Do not add a reranker | Operator directive; calibration + cold-tier inclusion fix the reported symptom without a new provider dependency or added latency |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `absolute-relevance-calibration.vitest.ts` (6 tests) | PASS |
| `cold-orphan-projection-backfill.vitest.ts` (6 tests — admit orphan, skip active-key, one-per-key, idempotent, flag-off) | PASS |
| `hybrid-search.vitest.ts` cold-tier inclusion + flag-off revert (104 tests) | PASS |
| Existing confidence/recovery suites (129 tests) | PASS, no regression |
| `npm run typecheck` | PASS, clean |
| Ordering unchanged (`resolveEffectiveScore`) | PASS, ordering path not modified |
| Revert paths (`SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION=false`, `SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false`) | PASS, test-proven |
| Pre-existing baseline failures (`token-budget-enforcement`: memory_health 1500 vs 1000; `reconsolidation` 9 tests) | Out of scope, unrelated — confirmed still failing with all my code stashed; zero new regressions |
| LIVE: daemon recycled to rebuilt dist; front-door `memory_search` strong query | `requestQuality:"good"`, `citationPolicy:"cite_results"`, top confidence 0.81 "high" (was weak/do_not_cite ~0.31) |
| LIVE: cli-opencode fresh session `/memory:search` against rebuilt daemon | results=5, top score 0.89, hybrid-RAG specs ranked (was "avg score 0.14") |
| LIVE: reindex `memory_embedding_reconcile --mode apply` | failedVectors 2,745 → 24 (2,721 mislabeled rows flipped to success; cheap, no re-embed) |
| Real-data validation of vector-lane backfill (on DB copy) | admits only 2 cold-orphans; 0 dup keys/ids; UNIQUE invariant intact — near-inert, archived already reachable |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Vector-lane cold inclusion (option A) is implemented behind an opt-in flag, awaiting live activation.** Query-time channels (lexical/BM25/trigger) include cold rows by default now. For the vector (semantic) lane, `backfillColdOrphanProjection()` admits archived rows whose logical key has no active winner into `active_memory_projection` (the join that gated them — only 5 of 4,847 deprecated rows were in it), and the vector query filter is relaxed under `SPECKIT_INCLUDE_ARCHIVED_VECTOR` (default OFF). It is unit-tested and wired best-effort into daemon boot. It stays opt-in because a live projection mutation needs one confirmation on the running daemon (logical-key match against real data, no duplicate explosion); it is NOT a re-embed (2,676 rows already embedded). Activation: set the flag, restart, spot-check.
2. **Index health is still degraded.** 2,745 failed vectors, ~527 missing vectors, and ~3,237 un-enriched rows depress recall corpus-wide. Tier A repair is CPU-heavy local re-embedding and is deferred until the operator is home and confirms. (The vector-lane projection change above is separate and does not require re-embedding.)
3. **No reranker.** Per operator directive, Stage 3 keeps only MMR diversity (`rerankProvider:'none'`). Ranking quality rides on hybrid fusion plus the calibration fix.
4. **Calibration improves the verdict, not raw recall.** A genuinely missing or unindexed doc still will not surface; the calibration fix stops the over-conservative gate, but corpus-wide recall depends on Tier A repair.
5. **Live end-to-end not yet re-run.** The original queries should be re-run once the daemon reconnects on the new dist to confirm `good`/`cite_results` and z_archive surfacing.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 3 IMPLEMENTATION SUMMARY
- Narrative carries; no Files Changed table at Level 3
- Honest implemented-vs-staged status
-->
