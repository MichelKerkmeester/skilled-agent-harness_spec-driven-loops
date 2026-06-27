---
title: "Implementation Summary"
description: "Status COMPLETE. Ran a 72-cell read-only benchmark deciding whether SPECKIT_DETERMINISTIC_RANKING can graduate to default-on. Flag-ON ranking is perfectly reproducible (determinism 1.0), but removing the wall-clock recency inputs diverges materially from the current default on 5 of 12 queries (mean top-K overlap 0.686, Kendall tau 0.731, score delta 0.0047). Recency is load-bearing on real-match queries with no ground-truth that the deterministic order is better, so the verdict is STAY DEFAULT-OFF and keep the flag as an opt-in reproducibility tool."
trigger_phrases:
  - "deterministic ranking benchmark"
  - "should the determinism flag graduate"
  - "deterministic ranking verdict"
  - "recency load-bearing ranking"
  - "SPECKIT_DETERMINISTIC_RANKING graduation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/042-deterministic-ranking-benchmark"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran 72-cell matrix, computed metrics, authored results and verdict"
    next_safe_action: "A future graduation needs a labeled-relevance benchmark"
    blockers: []
    key_files:
      - "results/metrics.json"
      - "benchmark-results.md"
      - "scripts/deterministic-ranking-benchmark.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-23 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A single in-process benchmark harness and the run it produced. The harness opens a read-only backup of the live 17,599-row corpus with the active `nomic-embed-text-v1.5` embedder, embeds each of the twelve benchmark queries once, then drives the production `executePipeline` six times per query, three with `SPECKIT_DETERMINISTIC_RANKING` off and three with it on, toggling the flag through `process.env` and reusing the single embedding so only ranking varies. From the seventy-two orderings it computed a flag-ON determinism reading and the off-vs-on divergence as top-10 Jaccard overlap, Kendall tau on shared ids and mean composite-score delta, all written to `results/metrics.json`.

The findings:

**The flag works as a reproducibility tool.** Flag-ON ranking is perfectly reproducible, mean determinism 1.0 across all twelve queries, stable both within a run and across separate process invocations. The OFF control also read 1.0 here, which is expected: over a tight benchmark window `julianday('now')` barely advances, so the recency term moves little between the three OFF runs. The divergence that matters is OFF-vs-ON, not the within-path stability.

**But recency is load-bearing on real-match queries.** Removing the wall-clock recency inputs reorders a large share of the top-10 on corpus-aligned and generic queries with strong matches. Mean top-K overlap OFF-vs-ON is 0.686, so only about 69% of the top-10 survives the recency removal, and the mean Kendall tau of 0.731 sits well below a 0.95 graduation bar. Five of twelve queries diverge past the 0.8 overlap bar: `agent` and `deep-loop` keep only about 18% of their top-10 (overlap 0.176), `routing` lands at 0.429, `semantic-search` at 0.667, and `quality` flips to a negative rank correlation (tau -0.400) at overlap 0.333. The mean score delta of 0.0047 is tiny, so the absolute scores barely move and the reordering is the whole story.

**The divergence concentrates exactly where recency does useful work.** Off-corpus and maximally-vague queries (`kubernetes`, `authentication`, `the-thing-with-confidence`) show zero divergence, overlap 1.0 and tau 1.0. With no strong semantic match there is nothing for recency to tip, so the order is identical with the flag off or on. The reordering clusters on the queries with real competing matches, which is the signal that recency is doing real work rather than adding noise.

**No evidence the deterministic order is better.** The corpus carries no labeled ground-truth, so the benchmark can show the ranking changes but not that it improves. Defaulting to deterministic ranking would trade away an intended recency behavior on roughly 40% of queries for a reproducibility guarantee that production search does not need.

**Verdict: STAY DEFAULT-OFF.** The flag passes the reproducibility test and fails the no-harm test. Keep `SPECKIT_DETERMINISTIC_RANKING` default-off and keep it available as an opt-in for reproducible benchmark and audit runs, set it to `true` when bit-identical re-runs matter. The always-on trigger id tie-break that shipped with the flag is the pure-win part and needs no flag, it improves ordering stability without removing recency. A future graduation would need a labeled-relevance benchmark showing deterministic ranking does not lose relevant results, not just a reproducibility argument.

This benchmark mutated no production code and did not flip the flag default.

**Subsequent removal.** Per the stay-off verdict above and the operator directive to remove benchmark-rejected stay-off flag code, the `SPECKIT_DETERMINISTIC_RANKING` flag reader and its gated branches were later deleted, reverting to the default recency-on ranking. The always-on trigger id tie-break was kept as the pure-win part. The result is behavior-identical to the prior default.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The harness opened a read-only backup of the live corpus and defined the twelve benchmark queries with their vagueness class. For each query it embedded the text once with `nomic-embed-text-v1.5` and reused that embedding across all six runs. It then called the production `executePipeline` three times with `SPECKIT_DETERMINISTIC_RANKING` off and three times with it on, setting the flag through `process.env` between runs, and collected the six ranked id lists. From those it derived the flag-ON determinism, the top-10 Jaccard overlap, the Kendall tau on shared ids and the mean composite-score delta per query, then wrote the per-query rows and aggregate means to `results/metrics.json`, the single source for both the data tables and this verdict.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **An in-process harness, not an out-of-process command dispatch.** Dispatching the query through a command would re-embed per call and add launch noise to a comparison that must isolate ranking. The in-process harness with embed-once-reuse holds the embedding fixed so only ranking varies.
- **A read-only backup with no reindex.** The benchmark must not mutate the live corpus or flip the flag default for any other consumer, so it reads a backup and toggles the flag only through `process.env` inside the run.
- **OFF-vs-ON divergence as the graduation metric, not OFF stability.** Over a tight window the OFF control looks stable because recency barely advances, so the harness measures the divergence between the flag-off and flag-on orderings directly rather than inferring the recency effect from within-path determinism.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `results/metrics.json` reports 72 pipeline calls, twelve queries by OFF x3 and ON x3, with a determinism reading and the divergence triplet per query.
- Every number in `benchmark-results.md` and in the findings above is sourced from `metrics.json`, computed by the harness from the collected orderings.
- The run is read-only against a corpus backup, no reindex and no write, and the flag was toggled only through `process.env`, so no memory record was written and no flag default was changed.
- `node scripts/deterministic-ranking-benchmark.mjs` reproduces the matrix from the backup with byte-identical flag-ON orderings across runs.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No labeled ground-truth.** The corpus has no relevance labels, so the benchmark proves the ranking changes under recency removal but cannot prove the deterministic order is worse, only that it is different. This is exactly why the verdict is stay-off rather than a measured regression number.
- **The OFF control window is tight.** Over the short benchmark window `julianday('now')` barely advances, so the OFF determinism reads 1.0 and the within-path recency motion is understated. The OFF-vs-ON divergence is the load-bearing measurement and is unaffected, but a longer-window control would show the OFF path is not literally frozen in production.
- **Twelve queries, one corpus snapshot.** The five-of-twelve divergence rate is measured on one query set against one corpus backup. It establishes that recency is load-bearing on real-match queries, but the precise rate would shift with a different query mix or a re-indexed corpus.
- **A future graduation needs a labeled-relevance benchmark.** The path to graduating the flag is a benchmark with labeled relevance showing deterministic ranking does not lose relevant results. The always-on trigger id tie-break is the pure-win part of Fix 5 and could be split into its own tracking row, since it needs no flag.
<!-- /ANCHOR:limitations -->
