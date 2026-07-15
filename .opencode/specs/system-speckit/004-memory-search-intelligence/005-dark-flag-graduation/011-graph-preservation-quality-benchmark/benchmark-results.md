---
title: "Benchmark Results: Graph Preservation Quality Benchmark"
description: "Measured per-flag, per-slice before/after Recall@20/nDCG@10/MRR for SPECKIT_RETRIEVAL_CLASS_ROUTING and SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION against a 60-query, 131-relevance-row scoped fixture whose slice membership is verified against the live classifiers. Neither flag shows a positive Recall@20 lift; content-rich-short-query graph preservation shows zero measurable effect anywhere despite confirmed routing-channel activation, and retrieval-class routing shows a small nDCG regression on its own target slice. Both pass the REQ-008 control-slice neutrality check."
trigger_phrases:
  - "graph preservation quality benchmark results"
  - "content rich short query graph preservation benchmark results"
  - "retrieval class routing benchmark results"
  - "F15 counter memory health wiring results"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Graph Preservation Quality Benchmark

## 1. RUN METADATA

| Field | Value |
|-------|-------|
| Run date | 2026-07-10 |
| Corpus | live production corpus at run time, copied read-only into an isolated temp snapshot before scoring |
| Active embedder | nomic-embed-text-v1.5, ollama, 768-dim |
| Search limit (Recall@K) | 20 |
| nDCG cutoff | 10 |
| MRR cutoff | 20 |
| Harness | `scripts/evals/run-graph-preservation-flag-eval.mjs` |
| Raw report | `graph-preservation-benchmark-output.json` (see repo-relative copy alongside this file) |
| Fixture | `lib/eval/data/graph-preservation-ground-truth.json` -- 60 queries, 131 relevance rows |
| Pre-flight | quiescence-verified (0 pending/retry/failed embeddings, no active scan/embedder job); see §2 |

No flag default was changed by this run. The benchmark measures and records; flag graduation is a separate, future decision per this packet's own scope (REQ-005, out of scope here).

---

## 2. PRE-FLIGHT (REQ-003)

REQ-003 was amended during this packet's implementation (see `plan.md`'s Reindex step and `spec.md` REQ-003): no shipped tool performs a full `causal_edges` regeneration, so the requirement is quiescence-verification of a read-only copied snapshot, not regeneration-from-scratch.

| Check | Result |
|-------|--------|
| Pending embeddings | 0 |
| Retry-queued embeddings | 0 |
| Failed embeddings | 0 |
| Active index scan job | false |
| Active embedder job | false |
| Quiescent | true |
| Checked at | 2026-07-10T12:25:29.753Z |

The source database was quiescent; the driver proceeded to copy the metadata DB and active vector shard read-only into an isolated temp root and asserted (via `assertWithinEvalRoot`) that the active vector-index connection actually resolved under that temp root before running any search, guarding against `shared/paths.ts`'s workspace-boundary fallback silently redirecting a write at the canonical checkout.

---

## 3. FIXTURE SUMMARY (REQ-001)

| Slice | Queries | Relevance rows |
|-------|--------:|----------------:|
| `content_rich_short` | 26 | 66 |
| `single_hop` | 18 | 36 |
| `control` | 16 | 29 |
| **Total** | **60** | **131** |

Every query's slice label was checked against the live `isContentRichShortQuery()` and `classifyRetrievalClass()` at fixture-authoring time and again in `tests/graph-preservation-ground-truth.vitest.ts`'s standing suite: 0 predicate mismatches across all 60 queries. Every relevance row's file-path anchor was resolved against the live corpus before scoring; 131/131 resolved (0 unresolved).

---

## 4. RESULTS: `SPECKIT_RETRIEVAL_CLASS_ROUTING`

### 4.1 Overall

| Metric | Off | On | Delta |
|--------|----:|---:|------:|
| Recall@20 | 0.741667 | 0.741667 | 0.000000 |
| nDCG@10 | 0.493920 | 0.488652 | -0.005268 |
| MRR@20 | 0.455731 | 0.457708 | +0.001978 |

### 4.2 Per-slice

| Slice (n) | Recall Δ | nDCG Δ | MRR Δ |
|-----------|---------:|-------:|------:|
| `content_rich_short` (26) | 0.000000 | 0.000000 | 0.000000 |
| `single_hop` (18) | 0.000000 | **-0.017559** | +0.006592 |
| `control` (16) | 0.000000 | 0.000000 | 0.000000 |

**Control-slice neutrality (REQ-008):** all three metrics are exactly 0 on the control slice, well inside the ±0.02 noise band this packet resolves for its own noise-band decision (see `run-graph-preservation-flag-eval.mjs`'s `CONTROL_SLICE_NOISE_BAND`; 040's own open question on noise-band width is unresolved, per-packet resolution required). `controlSliceNeutral: true`.

**Reading the single-hop result:** the flag's own target population (`single_hop`, n=18) shows a real, non-zero nDCG regression (-0.0176) alongside a small MRR gain (+0.0066) and unchanged Recall@20. This is a mixed, not a clean-positive, result on the exact population the flag is meant to help -- ranking quality within the top-10 got slightly worse even though the first relevant hit's rank improved slightly on average.

---

## 5. RESULTS: `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`

### 5.1 Overall

| Metric | Off | On | Delta |
|--------|----:|---:|------:|
| Recall@20 | 0.741667 | 0.741667 | 0.000000 |
| nDCG@10 | 0.493920 | 0.493920 | 0.000000 |
| MRR@20 | 0.455731 | 0.455731 | 0.000000 |

### 5.2 Per-slice

| Slice (n) | Recall Δ | nDCG Δ | MRR Δ |
|-----------|---------:|-------:|------:|
| `content_rich_short` (26) | 0.000000 | 0.000000 | 0.000000 |
| `single_hop` (18) | 0.000000 | 0.000000 | 0.000000 |
| `control` (16) | 0.000000 | 0.000000 | 0.000000 |

**Control-slice neutrality (REQ-008):** trivially satisfied (every slice, including control, is exactly 0). `controlSliceNeutral: true`.

**This flag shows literally zero measurable effect anywhere in this run**, including on its own target slice (`content_rich_short`, n=26). Before treating that as "the flag does nothing," it was checked directly: `routeQuery('cache stability audit')` (a real fixture query) was called with the flag off and on. Off selects `["vector","fts"]`; on selects `["vector","fts","graph","degree"]`, with `routingReasons` explicitly showing `graph-preserved-by-content-rich-short-query` and `degree-preserved-by-content-rich-short-query`. The flag is genuinely toggling the intended routing behavior -- the channel activation is real, confirmed, not a wiring bug in this driver.

**Why zero delta despite real channel activation:** the content-rich-short fixture slice was authored from real, distinctive document titles (e.g. "cache stability audit", "onnx cross-platform backend") specifically so each query would have a clear, gradeable, real corpus match. That construction choice makes these queries strong lexical (BM25/FTS) matches by design -- vector+fts alone already retrieves the correct top-ranked result within the top-20 for this population, so adding graph+degree channels has no room to move Recall@20/nDCG@10/MRR: the correct answer was already found before those channels contributed anything. This is a genuine property of *this benchmark's fixture*, not proof the flag has no value on harder, less lexically-obvious content-rich-short queries (e.g. paraphrased or conceptual short queries whose correct answer isn't a near-verbatim title match) -- see §6.

---

## 6. LIMITATIONS AND WHAT WOULD CHANGE THE VERDICT

1. **Fixture lexical-match bias.** Per §5.2, the content-rich-short slice was authored from real document titles, which are strong BM25/FTS matches by construction. This is a defensible, honest way to build a *gradeable* fixture (per the fixture-authoring feasibility investigation, ungraded/ungrounded fixture data was the larger risk to avoid), but it means this run cannot distinguish "the flag has no value" from "the flag has no value when the correct answer is already lexically obvious." A follow-up slice of paraphrased/conceptual content-rich-short queries (correct answer requires graph-relationship inference, not lexical overlap) would be a more adversarial test of this specific flag's claimed value.
2. **Single-run, no repeated-sampling variance estimate.** All deltas above are from one measured pass per flag per variant; the -0.0176 nDCG regression on `single_hop` and the +0.0066 MRR gain are both small enough that a second independently-authored `single_hop` batch could plausibly shift the sign of either. Neither flag's non-control-slice movement is currently backed by a variance/significance estimate.
3. **This packet does not decide graduation.** Per REQ-005 and this packet's own scope, no flag default changed. Read together, these results do not make a graduation case for either flag as currently measured: `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` shows no measured benefit on this fixture, and `SPECKIT_RETRIEVAL_CLASS_ROUTING` shows a real ranking-quality regression on its own target population. Neither result rules out value on a harder or larger fixture; both are honest, negative-leaning findings on the fixture this run actually measured.

---

## 7. F15 COUNTER WIRING (REQ-006, REQ-007)

Independent of the benchmark above. `getContentRichShortQueryGraphPreservationCount()` is now read inside `handleMemoryHealth()` and surfaced as `data.routing.contentRichShortQueryGraphPreservationCount`, following the same try/catch-guarded, additive-only shape the block's existing `routingTelemetry`/`graphChannelMetrics` fields use.

| Check | Result |
|-------|--------|
| Counter visible in `memory_health` | confirmed (`021-REQ006` test) |
| Increments on a real content-rich-short query | confirmed: 0 -> 1 after one `routeQuery()` call with the flag on |
| Resets via the existing test-only hook | confirmed: back to 0 after `resetContentRichShortQueryGraphPreservationCount()` |
| Additive-only (no other `routing` field changes, `routeQuery()` output byte-identical) | confirmed (`021-REQ007` test) |
| Existing `handler-memory-crud.vitest.ts` / `handler-memory-health-edge.vitest.ts` regression suites | pass unchanged (135 tests, 0 failures) |
