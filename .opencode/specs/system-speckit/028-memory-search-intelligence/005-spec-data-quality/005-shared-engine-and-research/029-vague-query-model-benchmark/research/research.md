---
title: "Deep Research: 029 Search-Quality Findings, Root Causes and Prioritized Fixes"
description: "A 5-iteration gpt-5.5-xhigh deep-research pass that traced the vague-query benchmark findings to their source in the live memory-search pipeline. One real correctness bug (the graduated evidence-gap cap is dead on the live path), one determinism finding (residual wall-clock ranking inputs), two telemetry/presentation honesty issues, and a trivial metric fix. Each with a cited root cause, a fix design, and a blast-radius estimate, sequenced into a fix plan."
trigger_phrases:
  - "evidence-gap cap dead"
  - "memory search verdict bug research"
  - "029 findings root cause"
  - "search determinism wall-clock"
  - "weightsApplied telemetry"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/029-vague-query-model-benchmark"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Converged 5-iteration deep research on the 029 search-quality findings"
    next_safe_action: "Hand the prioritized fix plan to plan or implement, P1 first"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-23-029-search-findings-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All seven research questions answered across five iterations."
---
# Deep Research: 029 Search-Quality Findings, Root Causes and Prioritized Fixes

A read-only deep-research loop (5 iterations, gpt-5.5-fast xhigh executor, orchestrator-written state) traced the vague-query benchmark findings to their source in the live `/memory:search` pipeline. The headline reframes the benchmark's surface symptoms: the dashboard contradiction is not a presentation quirk, it is a graduated flag that never runs in production.

## Executive verdict

| # | Finding | Class | Severity |
|---|---|---|---|
| Q1 | The graduated evidence-gap cap is **dead on the live path** (a field-bridging bug) | Real correctness bug | HIGH |
| Q6 | Retrieval is **not strictly deterministic**, residual wall-clock ranking inputs | Reproducibility | MEDIUM |
| Q4 | The intent classifier is by-design; `weightsApplied` telemetry is **misleading** | Telemetry honesty | MEDIUM |
| Q5 | One dashboard data gap (bare-dash scores); count and title are model-rendering | Presentation | LOW |
| Q3 | The `citeCorrect` benchmark metric is **binary** and mislabels the caveat tier | Tooling | LOW |

## Q1: The evidence-gap cap is dead code in production (the real bug)

The `good`-verdict-beside-`[EVIDENCE GAP DETECTED]`-banner contradiction on 19 of 144 cells is a **field-bridging bug**. Stage 4 detects the gap and sets `metadata.stage4.evidenceGapDetected` plus `annotations.evidenceGapWarning`; the **banner** renders from the warning [SOURCE: `handlers/memory-search.ts:1502-1508`], but the **verdict cap** caps `good`→`weak` only on `options.evidenceGapDetected` [SOURCE: `confidence-scoring.ts:663-670`], which the formatter feeds from `Boolean(safeExtraData?.evidenceGap)` [SOURCE: `search-results.ts:1139-1142`]. The live handler never sets `extraData.evidenceGap`, only `…evidenceGapWarning` [SOURCE: `handlers/memory-search.ts:1365-1386`]. So the boolean is always falsy, the cap never fires, and the graduated, default-on, unit-tested `SPECKIT_EVIDENCE_GAP_VERDICT_V1` is effectively dead on the production render path.

**Fix:** bridge the Stage-4 boolean into `extraData` near `handlers/memory-search.ts:1365-1372` (`evidenceGap: pipelineResult.metadata.stage4.evidenceGapDetected`).
**Blast radius (caught):** the same `safeExtraData.evidenceGap` also drives recovery classification [SOURCE: `recovery-payload.ts:76-80`], so the fix also fires the recovery prompt on a gap. Verify that is desired, do not assume.

## Q6: Retrieval is not strictly deterministic

The tie-breaks are deterministic (ANN by id, RRF by rrfScore then content-hash then id, Stage 2 by score/hash/id), so ordering is stable given fixed scores. But the **scores** carry wall-clock inputs: `vector_search()` defaults `useDecay=true` and uses `julianday('now')` before ordering [SOURCE: `vector-index-queries.ts:371-404`], the trigger channel uses `Date.now()` via `timestampBoost()` [SOURCE: `hybrid-search.ts:714-793`], and Stage 2 recency uses `Date.now()` [SOURCE: `stage2-fusion.ts:1090-1103`; `folder-scoring.ts:138-152`]. The trigger-channel ordering also lacks a final id tie-break [SOURCE: `hybrid-search.ts:761-764`]. So a fixed query string is not bit-reproducible. INFERRED: the benchmark's large per-query swings (e.g. `agent` 0.0→0.88) are dominated by the models dispatching different actual query strings, but the clock inputs are a real residual, so "fully model-driven" cannot be asserted from code alone.

**Fix (scope decision):** for benchmark or strict reproducibility, inject a fixed `now`, set `useDecay=false`, and add an id tie-break to the trigger channel. For production, recency is arguably intentional, so the decision is whether reproducibility is a goal beyond benchmarks.

## Q4: Intent is by-design; the telemetry is misleading

`understand` for vague queries is the safe sub-confidence-floor fallback (`SPECKIT_INTENT_CONFIDENCE_FLOOR` 0.25) [SOURCE: `intent-classifier.ts:591-635`], and the retrieval-class profile weights are dark-launched off (`SPECKIT_RETRIEVAL_PROFILE_WEIGHTS`) [SOURCE: `retrieval-profile.ts:74-77`]. Both by-design. The defect is that the envelope's `weightsApplied` reports Stage-2 intent weighting (always off for hybrid search), not the retrieval-class profile weighting a reader assumes [SOURCE: `memory-search.ts:1388-1394`; `stage2-fusion.ts:1305-1323`].

**Fix:** add a real retrieval-profile status field; stop overloading `intent.weightsApplied` as class-profile status. Optional larger move: route short queries to a real class and promote the weights flag.

## Q5: One dashboard data gap, the rest is model-rendering

Bare-dash scores are a real data gap: graph-channel and degree-channel rows carry `rrfScore`/`score` but the public row shape exposes only `similarity`, absent for those channels, so the model renders a dash [SOURCE: `search-results.ts:679-689`; `graph-search-fn.ts:589-603`]. The count-versus-rows mismatch and the `"(truncated)"` title are model-side rendering of imperfect data, not in the code (the server rewrites the count post-truncation at `context-server.ts:1328`, and the `"(truncated)"` literal is absent; code truncators use `...`).

**Fix:** surface the resolved row score for every row (formatter). Reconcile the count and the long-path title by tightening the presentation contract (lowest priority).

## Q3: The citeCorrect metric is binary

`extract-metrics.mjs:65-66` computes `citeExpected = good ? cite_results : do_not_cite_results` and demands exact equality, so every `cite_with_caveat` cell scores wrong (the false 1.0→0.55 drop). **Fix:** valid-set membership, `{good:[cite_results], weak:[cite_with_caveat, do_not_cite_results], gap:[do_not_cite_results]}`. Benchmark script only, trivial.

## Q7: Prioritized fix plan

| Order | Finding | Fix | Effort | Blast radius |
|---|---|---|---|---|
| 1 | Q1 evidence-gap cap dead | bridge `stage4.evidenceGapDetected` into `extraData` | 1 line + a recovery-path verify | MED (also activates recovery) |
| 2 | Q3 citeCorrect metric | valid-set membership in `extract-metrics.mjs` | trivial | LOW (benchmark script) |
| 3 | Q4 telemetry honesty | real retrieval-profile status field | small | LOW (telemetry) |
| 4 | Q5a bare-dash score | surface resolved row score | small | LOW (formatter row shape) |
| 5 | Q6 determinism | fixed `now` + `useDecay=false` for benchmarks, trigger id tie-break | small-med | MED (scoring; scope to benchmark or decide) |
| 6 | Q5b/c count + title | tighten presentation contract | small | LOW (contract/prompt) |

Sequence rationale: Q1 first, it is the only correctness bug and it proves whether the graduated flag works at all. Q3 next, trivial and it unblocks honest benchmark numbers. Q4 and Q5a are small honesty fixes. Q6 is a scope decision rather than a clear bug. Q5b/c is presentation polish.

<!-- ANCHOR:references -->
## References

- `handlers/memory-search.ts:1365-1386`, `:1502-1508`, evidence-gap warning set, banner render, missing `extraData.evidenceGap`
- `lib/search/confidence-scoring.ts:663-670`, the verdict cap
- `formatters/search-results.ts:1139-1142`, `:679-689`, cap input wiring, row score resolution
- `lib/search/pipeline/stage4-filter.ts:264-345`; `lib/search/evidence-gap-detector.ts:29-32`, `:199-208`, the detector
- `lib/search/recovery-payload.ts:76-80`, the recovery blast radius
- `lib/search/vector-index-queries.ts:371-404`, `:448-462`, vector decay wall-clock input
- `lib/search/hybrid-search.ts:714-793`, `:761-764`, trigger timestamp boost, missing id tie-break
- `lib/search/pipeline/stage2-fusion.ts:1090-1103`, `:1305-1323`, recency clock, hybrid intent-weight gate
- `lib/search/intent-classifier.ts:591-635`; `lib/search/retrieval-profile.ts:74-77`; `handlers/memory-search.ts:1388-1394`, intent fallback, profile-weight gate, telemetry seam
- `scripts/extract-metrics.mjs:64-66`, `:99`, the binary citeCorrect metric
- Iteration detail: `iterations/iteration-001.md` … `iteration-005.md`
<!-- /ANCHOR:references -->
