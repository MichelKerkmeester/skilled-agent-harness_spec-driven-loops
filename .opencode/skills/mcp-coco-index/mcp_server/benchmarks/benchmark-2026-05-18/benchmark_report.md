---
title: "Benchmark Report 2026-05-18 — 4-Candidate Code-Embedder Bake-Off (hybrid + rerank on)"
description: "Skill-local curated summary of the May 18, 2026 code-embedder bake-off. BAAI/bge-code-v1 wins 11/18 = 61.1% top-5 hit rate at 504ms median; jina-code (default), gemma-300m, and CodeRankEmbed tie at 9/18 = 50.0%; stella skipped (xformers required). Single-run signal; 3-run confirmation pending."
trigger_phrases:
  - "bge-code-v1 benchmark"
  - "code embedder bake-off"
  - "coco-index benchmark 2026-05-18"
  - "stella xformers failure"
  - "hybrid rerank embedder results"
importance_tier: "important"
contextType: "reference"
---

<!-- ANCHOR:toc -->
## TABLE OF CONTENTS

- [1. HEADLINE / OVERVIEW](#1--headline--overview)
- [2. AGGREGATE RESULTS](#2--aggregate-results)
- [3. METHODOLOGY](#3--methodology)
- [4. PER-CANDIDATE PROFILES](#4--per-candidate-profiles)
- [5. PROCESS NOTES](#5--process-notes)
- [6. FINDINGS](#6--findings)
- [7. CAVEATS](#7--caveats)
- [8. RECOMMENDATIONS](#8--recommendations)
- [9. REPRODUCIBILITY](#9--reproducibility)
- [10. CROSS-LINKS](#10--cross-links)
<!-- /ANCHOR:toc -->

# Benchmark Report — Code-Embedder Bake-Off (May 18, 2026)

<!-- ANCHOR:headline -->
## 1. HEADLINE / OVERVIEW

> **`BAAI/bge-code-v1` wins both accuracy and latency.** 11/18 = 61.1% top-5 hit rate, median 504ms, p95 4974ms. Three-way tie at 9/18 = 50.0% across the current default (`jinaai/jina-embeddings-v2-base-code`), `google/embeddinggemma-300m`, and `nomic-ai/CodeRankEmbed`. Single-run signal — 3-run confirmation pending in `016/007/003`.

May 18, 2026. Apple Silicon (MPS). 18-pair paraphrased fixture. Hybrid (FTS5 + vector RRF, k=60) and cross-encoder rerank (BGE-reranker-v2-m3) ON for every candidate.
<!-- /ANCHOR:headline -->

<!-- ANCHOR:aggregate-results -->
## 2. AGGREGATE RESULTS

One row per candidate. Source: [`results.csv`](./results.csv).

| Embedder | Dim | Hit rate | Easy / Med / Hard | Median ms | p95 ms | Verdict |
|---|---|---|---|---|---|---|
| **`sbert/BAAI/bge-code-v1`** | 768 | **11/18 = 61.1%** | **3 / 5 / 3** | **504** | 4974 | PROMOTE (pending 3-run confirm) |
| `sbert/jinaai/jina-embeddings-v2-base-code` (default) | 768 | 9/18 = 50.0% | 3 / 4 / 2 | 1002 | 7305 | BASELINE |
| `sbert/google/embeddinggemma-300m` | 768 | 9/18 = 50.0% | 3 / 4 / 2 | 947 | 18848 | HOLD (worst p95) |
| `sbert/nomic-ai/CodeRankEmbed` | 768 | 9/18 = 50.0% | 3 / 4 / 2 | 1204 | 2027 | HOLD (no unique wins) |
| `sbert/dunzhang/stella_en_400M_v5` | 1024 | SKIPPED | — | — | — | EXCLUDED (xformers required, no Apple Silicon path) |

Fixture difficulty mix: 5 easy + 7 medium + 6 hard = 18 probes.
<!-- /ANCHOR:aggregate-results -->

<!-- ANCHOR:methodology -->
## 3. METHODOLOGY

### Fixture

- 18 paraphrased `(natural-language query, expected_source_path)` pairs.
- Difficulty distribution: 5 easy / 7 medium / 6 hard.
- Designed to stress semantic understanding, not lexical / code-token matching.
- Authored in spec packet `016/004/002-baseline-fixture` and reused unchanged.

### Pipeline

Each candidate ran the same retrieval stack with defaults flipped on:

| Setting | Value | Note |
|---|---|---|
| `COCOINDEX_CHUNK_SIZE` | 1500 | raised from 1000 in 016/011 |
| `COCOINDEX_CHUNK_OVERLAP` | 200 | raised from 150 in 016/011 |
| `COCOINDEX_HYBRID` | true | FTS5 + vector RRF (k=60) |
| `COCOINDEX_HYBRID_VECTOR_WEIGHT` | 0.7 | |
| `COCOINDEX_HYBRID_FTS5_WEIGHT` | 0.7 | |
| `COCOINDEX_HYBRID_RRF_K` | 60 | reciprocal-rank fusion constant |
| `COCOINDEX_RERANK` | true | cross-encoder rerank ON |
| `COCOINDEX_RERANK_MODEL` | `BAAI/bge-reranker-v2-m3` | swapped from GTE-multilingual (silent MPS failure) |
| `COCOINDEX_RERANK_TOP_K` | 20 | rerank top-20 RRF candidates down to top-5 |

### Per-candidate flow

`pre-pull → ccc reset --force → ccc index → 18 × ccc search "<query>" --limit 5 → emit CSV/JSONL → next candidate`.

Each candidate produced 18,847 chunks in `.cocoindex_code/target_sqlite.db` (corpus identical across runs).

### Hit semantics

- Top-5 hit (expected path appears anywhere in the first 5 results returned by `ccc search`).
- Mirror-tree path normalization: `.opencode/`, `.claude/`, `.codex/`, `.gemini/` prefixes are collapsed before comparison.
- Line-range suffixes (`:NN-MM`) are stripped before comparison.
- Latency wraps the `ccc search` subprocess: includes daemon-side embedding + FTS5 + RRF + cross-encoder rerank.

### Environment

- Hardware: Apple Silicon (MPS backend).
- Backend: sentence-transformers via the `sbert/` prefix (Python). This is a different stack from `mk-spec-memory`'s Ollama backend — do not cross-reference performance numbers.
- Versions: sentence-transformers 5.4.1, transformers 5.8.0, torch 2.11.0.
- Reranker: cross-encoder `BAAI/bge-reranker-v2-m3` (verified end-to-end during validation).
<!-- /ANCHOR:methodology -->

<!-- ANCHOR:per-candidate-profiles -->
## 4. PER-CANDIDATE PROFILES

RAM / disk values are best-effort snapshots from `registered_embedders.py`; refer to the HuggingFace card for authoritative metadata.

### 4.1 `BAAI/bge-code-v1` (winner)

| Property | Value |
|---|---|
| HuggingFace | `BAAI/bge-code-v1` |
| Dim | 768 (no schema migration vs default) |
| Approx. RAM (loaded) | ~700 MB |
| Approx. disk (cache) | ~340 MB |
| Category | code-tuned |
| MPS compatible | yes |
| Origin | BAAI (Beijing Academy of Artificial Intelligence) |
| Design intent | Multilingual code retrieval; trained on code-NL pairs across Python / JS / Java / Go / C++ etc. |
| Strengths | Best accuracy + lowest latency in this run. Picks up 4 unique hits the others miss (probes 3, 10, 14, 18). Tightest core latency distribution (min/p25/median/p75 within a 130ms window). |
| Weaknesses | Misses probes 5 + 8 that the others hit (Vitest readiness coverage + freshness-probe queries). |

### 4.2 `jinaai/jina-embeddings-v2-base-code` (current default)

| Property | Value |
|---|---|
| HuggingFace | `jinaai/jina-embeddings-v2-base-code` |
| Dim | 768 |
| Approx. RAM (loaded) | ~600 MB |
| Approx. disk (cache) | ~280 MB |
| Category | code-tuned |
| MPS compatible | yes |
| Origin | Jina AI |
| Design intent | Code-tuned over Python / JS / Go / Java / Ruby / PHP. 8192-token context window. |
| Strengths | Reliable middle-of-pack performer. Picks up probes 5 + 8 that bge-code-v1 misses. |
| Weaknesses | ~2x median latency of bge-code-v1 (1002ms vs 504ms). |

### 4.3 `google/embeddinggemma-300m` (text-baseline reference)

| Property | Value |
|---|---|
| HuggingFace | `google/embeddinggemma-300m` |
| Dim | 768 |
| Approx. RAM (loaded) | ~600 MB |
| Approx. disk (cache) | ~300 MB |
| Category | general text (NOT code-tuned) |
| MPS compatible | yes |
| Origin | Google |
| Design intent | General-purpose 300M text embedder. Retained as the "what if we used a strong general-text model?" baseline. |
| Strengths | Ties the two code-tuned models at 9/18 — text-tuned does not penalize this fixture as much as one might expect. |
| Weaknesses | Worst tail latency (p95 = 18,848ms); one hard probe stalled at ~19s. Median is fine. |

### 4.4 `nomic-ai/CodeRankEmbed` (alternative code-tuned)

| Property | Value |
|---|---|
| HuggingFace | `nomic-ai/CodeRankEmbed` |
| Dim | 768 |
| Approx. RAM (loaded) | ~550 MB |
| Approx. disk (cache) | ~270 MB |
| Category | code-tuned |
| MPS compatible | yes |
| Origin | Nomic AI |
| Design intent | Code-tuned with Python-leaning training mix; promoted as a CoIR-strong retrieval embedder. |
| Strengths | Tightest tail latency (p95 = 2027ms, only ~1.7x median). Most predictable distribution. |
| Weaknesses | Tied at 9/18; zero unique-win probes. |

### 4.5 `dunzhang/stella_en_400M_v5` (SKIPPED)

| Property | Value |
|---|---|
| HuggingFace | `dunzhang/stella_en_400M_v5` |
| Dim | 1024 (would require schema migration to `vec_1024`) |
| Approx. RAM (loaded) | ~800 MB |
| Approx. disk (cache) | ~400 MB |
| Category | general text (MTEB-strong on text + code) |
| Failure mode | Model construction hard-asserts `xformers` (custom `NewAttention` layer). xformers has no usable Apple Silicon build path — CUDA-only pre-built wheels, partial MPS coverage even when built from source. |
| Operator action | Tier-1 follow-on: flip `mps_compatible=True` → `False` in `registered_embedders.py:118` and update `notes:` to flag the xformers requirement. |
<!-- /ANCHOR:per-candidate-profiles -->

<!-- ANCHOR:process-notes -->
## 5. PROCESS NOTES

What we tried, what failed, and why.

### Reranker swap mid-validation: GTE → BGE

- Original default: `Alibaba-NLP/gte-multilingual-reranker-base`.
- Observed: silent failure on Apple Silicon MPS. The cross-encoder threw `AcceleratorError`, which `reranker.py`'s try/except caught and dropped — returning the un-reranked candidate list with no operator-visible signal.
- Action: swapped to `BAAI/bge-reranker-v2-m3` and verified end-to-end on a spot-check query before launching the bake-off.
- Implication: any prior measurement that ran rerank-on with GTE has to be treated as "rerank effectively off". The BGE reranker contributes more lift than vector choice on the 9-tie probes — measurements that ran with a broken reranker are not comparable to this run.

### Top-1 → top-5 hit semantics

- The 018/003 default was top-1; that is unreasonably strict for a paraphrase-heavy fixture.
- Most retrieval consumers (RAG, search-as-UI) consume top-5 anyway.
- Switched to top-5 for this and all future runs. All historical headline numbers in this folder use top-5.

### Stella attempt and clean-up

- Stella's `pre_pull` step logged "pre-pull done" but the daemon hung indefinitely on `ccc index` at 0% CPU.
- Root cause: stella's `modeling.py:451` does `assert self.memory_efficient_attention is not None, 'please install xformers'`. The bench harness's `tail -1 | grep -qi "error|fail"` check missed it because the `AssertionError` is not the last output line.
- Killed manually after 25min wall-time; bench script logged `candidate marked failed`; restore step ran (back to jina-code baseline).
- Tier-1 follow-on: tighten `pre_pull` to check exit code AND grep entire output for `AssertionError | ImportError | FileNotFoundError`.

### Run was split across two sessions

- First pass measured 3 candidates (jina-code, gemma, nomic) before pausing for power.
- Resumed pass measured bge-code-v1 (clean) and stella (failed). Resumed wall-clock: 3161s = 52 min. Total campaign across both passes: ~127 min.
<!-- /ANCHOR:process-notes -->

<!-- ANCHOR:findings -->
## 6. FINDINGS

### 6.1 bge-code-v1's 4 unique wins

These are probes that ONLY bge-code-v1 hit — the source of its +2-pair lead.

| Probe | Difficulty | Query (truncated) | Expected path |
|---|---|---|---|
| 3 | easy | CocoIndex configuration that chooses the default local code embedder | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` |
| 10 | medium | context save command that reads structured JSON and refreshes graph metadata | `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` |
| 14 | hard | filesystem walker that emits typed structural symbols and imports | `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` |
| 18 | medium | integration test for reprocessing only changed files during refresh | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` |

Observed pattern: bge-code-v1 prefers the actual runtime / artifact location over the nearest namesake. On probe 3 it resolves "default local code embedder" to the `_DEFAULT_MODEL` constant in `config.py`; the others surface `registered_embedders.py` (close, but not the configuration entry point). On probe 14 it bridges "filesystem walker" → `structural-indexer.ts`; the others lock onto file-name matches (`directory-walker.ts`, walker-named test files).

### 6.2 bge-code-v1's 2 unique losses

- Probe 5 (easy): `Vitest coverage for code graph readiness snapshots and staleness` — others hit, bge missed.
- Probe 8 (medium): `readiness probe that checks whether the semantic code index is fresh` — others hit, bge missed.

The 11.1pp lead is real, but it is composed of `+4 unique wins − 2 unique losses = +2 net`. If any of the 4 unique wins prove fragile under retry variance, the lead shrinks toward parity. This is the primary motivation for the 3-run confirmation in `016/007/003`.

### 6.3 Universal floor — 7 probes (2, 4, 7, 9, 13, 16, 17)

Probes hit by ALL 4 candidates. The hybrid + rerank stack reliably surfaces these regardless of embedder choice. Either the expected file has lexical tokens that FTS5 catches directly, or the semantic match is so strong any 768d code-aware embedding lands it.

### 6.4 Universal ceiling — 5 probes (1, 6, 11, 12, 15)

Probes missed by ALL 4 candidates. These define the stack-level retrieval ceiling for this fixture.

| # | Difficulty | Query | Expected |
|---|---|---|---|
| 1 | easy | registry of available embedding backends with dimensions and model notes | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` |
| 6 | medium | construct an Ollama-backed embedder and apply query/document prompts | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts` |
| 11 | hard | Apple Silicon device fallback that prefers Metal when CUDA is absent | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` |
| 12 | hard | paraphrase recovery path that promotes sibling memory artifacts | `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts` |
| 15 | hard | query-time path class adjustment that favors implementation paths | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` |

Probe 1 is the standout — an "easy" entry missed by every candidate. The `registry.ts` file is dominated by `MANIFESTS` array entries and type aliases, and every embedder ranks `registered_embedders.py` higher because the Python file is denser in matching tokens. This may be a fixture-vs-corpus mismatch rather than embedder weakness; flag for the next fixture refresh.

### 6.5 Latency distribution

Percentiles computed across 18 probes per candidate. Latency includes embedder forward pass + FTS5 query + RRF fusion + cross-encoder rerank.

| Embedder | min | p25 | median | p75 | p95 | max | mean |
|---|---|---|---|---|---|---|---|
| **bge-code-v1** | **429** | **486** | **504** | **555** | 4974 | 4974 | **765** |
| jina-code | 800 | 884 | 1002 | 1218 | 7305 | 7305 | 1376 |
| gemma-300m | 767 | 833 | 947 | 1132 | 18848 | 18848 | 1989 |
| nomic-CodeRankEmbed | 808 | 1013 | 1204 | 1484 | 2027 | 2027 | 1253 |

All values in milliseconds.

Observations:

- bge-code-v1's core distribution (min through p75) sits within a 130ms window — by far the tightest of the four. Its p95 of 4974ms is a single-probe outlier.
- gemma-300m's p95 (18.8s) would be a deal-breaker for interactive use; one hard probe stalled near the 30s harness timeout.
- nomic-CodeRankEmbed has the best tail/median ratio (2027/1204 ≈ 1.68x) — most predictable, even though its median is the worst of the four.
- Mean ≪ p95 for every candidate at this sample size. p95 is dominated by single outliers — take the percentile column with caution.
<!-- /ANCHOR:findings -->

<!-- ANCHOR:caveats -->
## 7. CAVEATS

- **Single-run signal.** One run per candidate. Per `113/005-extraction-rerun` (memory: `project_116_confirmation_rcaf_holds`), single-sample wins under ~2% on small fixtures are noise-floor. bge-code-v1's 11.1pp lead is well above the noise floor, but only 4 unique probes account for the entire gap. The 3-run confirmation in `016/007/003` is required before promotion.
- **Stack-level confound.** All 4 candidates ran with hybrid + rerank on. The +2pp gap from bge-code-v1 is on top of an already-uplifted baseline. We have no measurement of bge-code-v1 against the pre-016/011 stack (chunk 1000/150, no FTS5, no rerank).
- **Reranker is doing more lift than the embedder on the 9-tie probes.** Three different vector spaces (jina, gemma, nomic) converge on the same top-5 after the BGE cross-encoder reorders the top-20 RRF candidates. The reranker contributes more lift than vector choice on the universal-floor probes.
- **Fixture is small.** 18 pairs is too few for stable percentile estimates; p95 is dominated by single outliers (probe 5 for jina at 7305ms; probe 8 for gemma at 18848ms). A 30-50 pair refresh is a Tier-3 follow-on.
- **Mirror-tree normalization is generous.** It counts `.gemini/skills/.../X.py` as a hit for `.opencode/skills/.../X.py`. Correct for this 4-way mirror codebase but inflates hit rates vs a single-mirror codebase.
- **Reranker model lock-in.** Results are valid for the `BAAI/bge-reranker-v2-m3` reranker. If the reranker is swapped again, every hit-rate number here needs re-measurement.
- **Stack mismatch with mk-spec-memory.** This bench uses `sbert/` (sentence-transformers, Python). `mk-spec-memory` uses Ollama. Do not cross-reference latency or hit-rate numbers between the two skills' benchmarks.
- **No schema migration cost was tested.** All 4 measured candidates are 768d. A future stella or SFR-Embedding-Code-2B-R run would need `vec_1024` / `vec_2048` plus a full re-index.
<!-- /ANCHOR:caveats -->

<!-- ANCHOR:recommendations -->
## 8. RECOMMENDATIONS

### Tier 1 — apply directly

1. **Fix stella metadata in `registered_embedders.py:118`.** `mps_compatible=True` → `False`; update `notes:` to flag the xformers requirement. ~2-line change. Tracked in `016/004/004-extended-bake-off` Tier-1.
2. **Tighten the bench harness pre-pull check.** Current `tail -1 | grep -qi "error|fail"` misses mid-traceback assertions. Replace with subprocess exit-code check + grep the entire output for `AssertionError | ImportError | FileNotFoundError`.

### Tier 2 — validate before applying

3. **3-run replay of bge-code-v1.** Tracked in `016/007/003-bge-code-v1-confirmation-and-promote/`. If the hit rate sits in 10/18–12/18 across runs, swap `_DEFAULT_MODEL` jina-code → bge-code-v1 in `cocoindex_code/config.py`. If any run drops to 9/18, hold at jina-code.
4. **Investigate the 5 universal-ceiling probes.** Manually verify the expected paths (probes 1, 6, 11, 12, 15) are still the best answers. Fix the fixture if not.

### Tier 3 — future work

5. **Larger fixture (30-50 pairs)** for stable percentile estimates and per-difficulty stratification.
6. **CUDA-gated bench harness** for stella + SFR-Embedding-Code-2B-R (need GPU/RAM headroom and, for stella, xformers).
7. **Add Ollama-backed candidates.** Currently blocked by `016/007/002-cocoindex-ollama-adapter/` — CocoIndex's Python registry is sbert-only today.
<!-- /ANCHOR:recommendations -->

<!-- ANCHOR:reproducibility -->
## 9. REPRODUCIBILITY

### Replay

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Stop daemon + clear LMDB wedge state
pkill -KILL -f "ccc run-daemon" && rm -f .cocoindex_code/lock.mdb

# Run all 4 candidates with hybrid + rerank defaults on
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh \
  sbert/jinaai/jina-embeddings-v2-base-code \
  sbert/google/embeddinggemma-300m \
  sbert/nomic-ai/CodeRankEmbed \
  sbert/BAAI/bge-code-v1
```

### Expected wall-clock

- 4-candidate clean run: ~80–110 min (pre-pull + reset + index + 18 probes × 4 candidates).
- Resumed 2-candidate run (this measurement campaign): 3161s = 52 min.
- Full measurement campaign (split across two sessions, jina + gemma + nomic, then bge + stella-attempt): ~127 min.

### Inputs

- Fixture: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture/evidence/code-retrieval-fixture.json`
- Harness: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh`

### Outputs in this folder

- [`results.csv`](./results.csv) — 4-row aggregate, one row per candidate.
- [`per-probe.jsonl`](./per-probe.jsonl) — 72 rows = 4 embedders × 18 probes.
- [`SOURCE.md`](./SOURCE.md) — pointer to the authoritative spec packet and follow-on packets.
<!-- /ANCHOR:reproducibility -->

<!-- ANCHOR:cross-links -->
## 10. CROSS-LINKS

### Authoritative spec packet

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/`

- `benchmark-results.md` — 12-section spec-side headline doc (deeper per-probe matrix, latency analysis, full ADR-style context).
- `implementation-summary.md` — completion record (status COMPLETED 2026-05-18).
- `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.{csv,jsonl}` — primary evidence (mirrored into this folder).
- `evidence/runlog-with-hybrid-rerank.txt` — full bench harness log.

### Follow-on packets

- `016/007/003-bge-code-v1-confirmation-and-promote/` — 3-run replay; if min ≥ 10/18 → promote bge-code-v1 as `_DEFAULT_MODEL`.
- `016/007/002-cocoindex-ollama-adapter/` — add Ollama provider to CocoIndex's Python registry (unblocks Ollama-backed candidates in future bake-offs).

### Tracking sub-phase (skill-local format adoption)

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format/`

### Sibling skill benchmark (text-side bake-off)

`.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/` — different stack (Ollama), different fixture; do not cross-reference numbers.

### Format convention

[`../FORMAT.md`](../FORMAT.md) (symlinked from `system-spec-kit`).

### Local pointers

- [`SOURCE.md`](./SOURCE.md) — spec packet pointer with per-file map.
- [`results.csv`](./results.csv) — primary aggregate.
- [`per-probe.jsonl`](./per-probe.jsonl) — 72 per-probe rows.
<!-- /ANCHOR:cross-links -->
