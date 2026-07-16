---
title: "Summary: 016/004/004 Extended Bake-Off — bge-code-v1 wins 11/18 = 61.1%"
description: "4-candidate code-embedder bake-off with hybrid+rerank defaults on. Headline: BAAI/bge-code-v1 wins 11/18 = 61.1% (+11.1pp over the 3-way tie at 9/18), and is the fastest at 504ms median. Stella skipped (xformers required, not viable on Apple Silicon)."
trigger_phrases:
  - "016/004/004 summary"
  - "bge-code-v1 wins"
  - "extended bake-off results"
  - "hybrid rerank bench complete"
  - "stella xformers"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off"
    last_updated_at: "2026-05-18T17:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wrote benchmark-results.md (11 sections, full per-probe + per-embedder analysis)"
    next_safe_action: "Tier-1 actions: fix stella mps_compatible metadata + tighten harness pre-pull check. Tier-2: 3-run confirmation of bge-code-v1 lead before promoting as default."
    blockers: []
    key_files:
      - "benchmark-results.md"
      - "evidence/cocoindex-embedder-comparison-with-hybrid-rerank.csv"
      - "evidence/cocoindex-embedder-comparison-with-hybrid-rerank.jsonl"
      - "evidence/runlog-with-hybrid-rerank.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000006004"
      session_id: "016-006-004-extended-bake-off-impl"
      parent_session_id: "016-006-004-extended-bake-off"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Summary: 016/004/004 Extended Bake-Off — bge-code-v1 wins

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | In Progress |
| Primary artifact | `benchmark-results.md` (detailed 11-section results doc) |
| Evidence | `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.{csv,jsonl}` + `evidence/runlog-with-hybrid-rerank.txt` |
| Owner | Main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Re-benchmark of 4 code-embedder candidates against the 18-pair fixture (`002-baseline-fixture/`), this time with the 016/011 retrieval stack defaults flipped on (hybrid FTS5+vector RRF, cross-encoder rerank with BGE-reranker-v2-m3 swap). 5th candidate (stella) attempted and skipped.

| Embedder | Hit rate | Median latency |
|---|---|---|
| **BAAI/bge-code-v1** | **11/18 = 61.1%** | **504ms** |
| jinaai/jina-v2-base-code (current default) | 9/18 = 50.0% | 1002ms |
| google/embeddinggemma-300m | 9/18 = 50.0% | 947ms |
| nomic-ai/CodeRankEmbed | 9/18 = 50.0% | 1204ms |
| stella_en_400M_v5 | SKIPPED | — |

Detailed per-probe analysis, latency percentiles, unique-win breakdown, universal floor/ceiling, and stella xformers failure analysis live in `benchmark-results.md`.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Code prep (preceding session):** flipped `COCOINDEX_HYBRID=true` + `COCOINDEX_RERANK=true` defaults in `cocoindex_code/config.py`; swapped reranker GTE → BGE after discovering GTE silently fails on Apple Silicon MPS; raised chunk size/overlap 1000/150 → 1500/200 (016/011 outputs).
2. **Bench harness adaptation:** copied `run-extended-bake-off.sh` → `run-extended-bake-off-with-hybrid-rerank.sh` with two parser fixes — read `expected_source_path` (not `expected_path`); strip mirror-tree prefix + `:NN-MM` line-range suffix and check top-5 hit (not top-1).
3. **First pass (paused mid-flight for power):** 3 candidates measured — jina-code, gemma, nomic.
4. **Resumed pass:** 2 candidates remaining — bge-code-v1 completed cleanly (11/18); stella indexed step hung indefinitely on `AssertionError: please install xformers`.
5. **Killed stella after 25min wall-time at 0% CPU**, bench script logged `candidate marked failed`, restore step ran (back to jina-code baseline).
6. **Results aggregated** into `benchmark-results.md` + this summary. CSV/JSONL/runlog in `evidence/`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- **D1:** Raise top-1 → top-5 hit semantics. Top-1 was the original 018/003 default but is unreasonably strict for a paraphrase-heavy fixture. Most retrieval consumers (RAG, search-as-UI) consume top-5 anyway.
- **D2:** Swap reranker default `Alibaba-NLP/gte-multilingual-reranker-base` → `BAAI/bge-reranker-v2-m3`. GTE crashes with `AcceleratorError` on MPS (caught silently by `reranker.py`'s try/except, returning unchanged candidates). BGE works end-to-end; verified by spot-check on `how does user login work` query.
- **D3:** Skip stella rather than build xformers from source. xformers on Apple Silicon is a high-risk / low-reward path; the 4 measured candidates already span the relevant capability axes.
- **D4:** Defer promoting bge-code-v1 as the new `_DEFAULT_MODEL`. Single-run signal; want a 3-run confirmation per the noise-floor lessons from `113/005-extraction-rerun`.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- [x] `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.csv` exists (5 rows = header + 4 candidates; stella row absent because marked failed)
- [x] `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.jsonl` exists (72 rows = 4 embedders × 18 probes)
- [x] `benchmark-results.md` written with full per-probe + per-embedder analysis
- [x] Bench harness logs successful candidate completion in `evidence/runlog-with-hybrid-rerank.txt` (total_wall_s=3161 for the resumed bge+stella attempt)
- [x] All bench processes cleanly killed at end (no zombie daemons or hung `ccc index` processes)
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` — pending operator-run if needed
- [ ] CocoIndex restored to jina-code baseline — pending. Restore was attempted; killed mid-flight by operator request. Operator should run: `pkill -KILL -f "ccc " && rm -f .cocoindex_code/lock.mdb && ccc reset --force && ccc index` to bring the daemon back on jina-code baseline.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- **Single-run signal.** bge-code-v1's 11.1pp lead is well above the historical noise floor (~2pp from 113/005), but only 4 unique probes account for the entire gap. Recommend 3-run confirmation before promoting as `_DEFAULT_MODEL`.
- **18-pair fixture is small** for stable percentile estimates. p95 figures are dominated by single outliers.
- **5 universal-ceiling probes (1, 6, 11, 12, 15)** are missed by all 4 candidates — likely a mix of stack ceiling and fixture-vs-corpus mismatch. Re-evaluate during next fixture refresh.
- **Stella metadata is stale:** `registered_embedders.py:118` lists `mps_compatible=True` but the model is effectively non-functional on Apple Silicon without xformers. Tier-1 follow-on.
- **Bench harness pre-pull check is weak** — only inspects last log line, missed stella's mid-traceback `AssertionError`. Tier-1 follow-on.
- **CocoIndex daemon was killed mid-restore** at operator's request to free up power. Operator needs to run reset+index when ready to resume normal MCP search operations.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:next-steps -->
## Next Steps (Tier-Ordered)

### Tier 1 — Apply directly (no validation needed)
1. Fix `registered_embedders.py:118` stella entry: `mps_compatible=True` → `False`, update notes with xformers requirement.
2. Tighten `run-extended-bake-off-with-hybrid-rerank.sh` pre_pull function: check exit code AND grep entire output for `AssertionError|ImportError|FileNotFoundError` (not just last line).

### Tier 2 — Validate before applying
3. 3-run replay of bge-code-v1 to confirm 11/18 holds. If hit rate sits in 10-12/18 across runs, swap `_DEFAULT_MODEL` jina-code → bge-code-v1 in `cocoindex_code/config.py`. If any run drops to 9/18, hold at jina-code.
4. Manually verify the 5 universal-ceiling probes' expected paths are correct (probes 1, 6, 11, 12, 15). Fix fixture if not.

### Tier 3 — Future work
5. Larger fixture (30-50 pairs) for stable percentile estimates and per-difficulty stratification.
6. CUDA-gated bench harness for stella + SFR-Embedding-Code-2B-R (need GPU/RAM headroom + xformers).
<!-- /ANCHOR:next-steps -->
