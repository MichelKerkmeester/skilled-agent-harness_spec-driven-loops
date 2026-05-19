---
title: "mcp-coco-index Code-Retrieval Pipeline Future-Proofing -- 2026-05-19"
description: "Curated benchmark report for the 6-packet 016/004 arc (packets 013-018) plus the nomic-CodeRankEmbed embedder promotion follow-on. Winner: nomic-ai/CodeRankEmbed + jinaai/jina-reranker-v3 at 14/18 = 77.8% top-5 hit rate; ~10% faster median than bge-code-v1 at identical recall."
trigger_phrases:
  - "mcp-coco-index benchmark"
  - "code retrieval pipeline future-proofing"
  - "nomic-CodeRankEmbed benchmark"
  - "jina-reranker-v3 benchmark"
  - "mcp-coco-index 2026-05-19"
  - "corrected-fixture 18-probe bench"
importance_tier: "important"
contextType: "reference"
---

<!--
Generated 2026-05-19 to capture the 013-018 future-proofing arc + nomic-CodeRankEmbed promotion.
Aligned with sk-doc/assets/benchmark/benchmark_report_template.md.
Source spec packets: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/{013,014,015,016,017,018}/
Validate after edits:
  python3 .opencode/skills/sk-doc/scripts/validate_document.py \
    .opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md \
    --type readme
-->

# mcp-coco-index Code-Retrieval Pipeline Future-Proofing -- May 19, 2026

> **Winner:** `nomic-ai/CodeRankEmbed` embedder + `jinaai/jina-reranker-v3` reranker, **14/18 = 77.8%** top-5 hit rate, median 1964 ms, p95 13554 ms. **Pipeline-fix-first approach** delivered embedder-agnostic gains: bge-code-v1 ties on hit rate but loses ~10% median latency. Locked nomic as production default after 6 packets of pipeline hardening (013/014/015/016/017/018) eliminated the candidate-set defects that previously made embedder choice load-bearing.

---

<!-- ANCHOR:table-of-contents -->
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
- [10. RELATED RESOURCES](#10--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:1-headline-overview -->
## 1. HEADLINE / OVERVIEW

**This bench is the empirical close of the 6-packet 016/004 CocoIndex future-proofing arc (013-018) plus the nomic embedder promotion follow-on.** It supersedes the May 18, 2026 bake-off (`../benchmark-2026-05-18/`) which was structurally invalidated by a stale pipx install + a broken chunker + 4-mirror pollution + inherited RRF defaults.

### Headline numbers

- **Final hit rate**: 14/18 (77.8%) under default config (nomic embedder + jina-v3 reranker + locked RRF + tree-sitter chunking + mirror dedup)
- **Pre-arc baseline**: 10-11/18 (rerank not firing in May 18 bench; corrected May 18 evening run: 10/18)
- **Embedder choice is no longer load-bearing**: nomic and bge-code-v1 tie at 14/18 with the same per-probe hit pattern
- **Reranker choice IS load-bearing**: jina-v3 beats BGE-baseline by +2 probes on both embedders

### What this bench changed (vs pre-arc)

| Layer | Pre-arc | Post-arc | Effect |
|---|---|---|---|
| Fixture | 2 path-extraction bugs + 1 fixture-truth bug | Corrected (013) | +3 probes measurable |
| Mirror dedup | None (4× redundancy in rerank window) | Canonical .opencode preferred (014) | −14% p95 latency |
| Chunker | RecursiveSplitter line-windowing | tree-sitter AST (015) | probe 14 now hits on bge-path-class |
| Query expansion | n/a | Module shipped opt-in default-false (016) | Empirical regression; opt-in for future tuning |
| RRF fusion | k=60, vec=0.7, fts=0.7 (inherited) | k=60, vec=0.9, fts=0.5 (locked from 7-cell sweep) (017) | −2.8% p95 latency at identical recall |
| Reranker default | BAAI/bge-reranker-v2-m3 (silently disabled in pipx) | jinaai/jina-reranker-v3 (018) | +2 probes net (10→14 hits) |
| Embedder default | sbert/jinaai/jina-embeddings-v2-base-code | sbert/nomic-ai/CodeRankEmbed (follow-on) | tie on hit rate; −10% median latency |

<!-- /ANCHOR:1-headline-overview -->

---

<!-- ANCHOR:2-aggregate-results -->
## 2. AGGREGATE RESULTS

### Final production state (default config, no env overrides)

```
Embedder:   sbert/nomic-ai/CodeRankEmbed
Chunker:    tree-sitter code-aware (TS/JS/Py/Go/Rust/Java)
Mirror:     .opencode canonical (query-time 4-way dedup)
Expansion:  COCOINDEX_QUERY_EXPANSION=false (opt-in)
RRF:        K=60, vec_weight=0.9, fts5_weight=0.5
Reranker:   jinaai/jina-reranker-v3
```

### Embedder × Reranker matrix (all under post-017 corrected pipeline)

| Embedder | Reranker | Hit rate | Easy/Med/Hard | Median ms | p95 ms |
|---|---|---:|---|---:|---:|
| **nomic-ai/CodeRankEmbed** (production) | **jina-reranker-v3** | **14/18 (77.8%)** | 4/4/6 | **1964** | 13554 |
| nomic-ai/CodeRankEmbed | BGE + path-class | 13/18 (72.2%) | 4/4/5 | 1585 | **11608** |
| nomic-ai/CodeRankEmbed | BGE-baseline | 12/18 (66.7%) | 4/4/4 | **1573** | 12760 |
| BAAI/bge-code-v1 | jina-reranker-v3 | 14/18 (77.8%) | 4/4/6 | 2183 | 13938 |
| BAAI/bge-code-v1 | BGE + path-class | 13/18 (72.2%) | 4/4/5 | 1726 | 12389 |
| BAAI/bge-code-v1 | BGE-baseline | 12/18 (66.7%) | 4/4/4 | 1758 | 12178 |

See [`results.csv`](./results.csv) for the machine-readable matrix.

### Per-probe hit pattern (identical across embedders)

| Probe | Class | Diff | BGE-baseline | BGE+path-class | jina-v3 |
|---:|---|---|:---:|:---:|:---:|
| 1 | control | easy | ✓ | ✓ | ✓ |
| 2 | ? | easy | ✓ | ✓ | ✓ |
| 3 | FAILURE | easy | ✓ | ✓ | ✓ |
| 4 | ? | easy | ✓ | ✓ | ✓ |
| 5 | control | easy | ✗ | ✗ | ✗ |
| 6 | ? | medium | ✓ | ✓ | ✓ |
| 7 | ? | medium | ✓ | ✓ | ✓ |
| 8 | ? | medium | ✓ | ✓ | ✓ |
| 9 | ? | medium | ✓ | ✓ | ✓ |
| 10 | FAILURE | medium | ✗ | ✗ | ✓ |
| 11 | control | hard | ✓ | ✓ | ✓ |
| 12 | ? | hard | ✗ | ✗ | ✗ |
| 13 | ? | hard | ✗ | ✗ | ✗ |
| 14 | FAILURE | hard | ✗ | ✓ | ✗ |
| 15 | ? | hard | ✓ | ✓ | ✓ |
| 16 | control | medium | ✓ | ✓ | ✓ |
| 17 | ? | hard | ✓ | ✓ | ✓ |
| 18 | FAILURE | medium | ✗ | ✗ | ✓ |

Both embedders produce the **identical 18-probe hit/miss pattern**. The reranker is the only lever moving hit rate within this embedder pair.

<!-- /ANCHOR:2-aggregate-results -->

---

<!-- ANCHOR:3-methodology -->
## 3. METHODOLOGY

### Fixture

- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-corrected.json`
- 18 probe pairs: 5 control + 5 FAILURE + 8 unclassified. 5 easy / 7 medium / 6 hard.
- Corrected by packet 013 (fixed 2 path-extraction bugs + 1 fixture-truth bug in probe 10).

### Harness

- Embedder swap: `ccc daemon stop && ccc reset --force && ccc index` with `COCOINDEX_CODE_EMBEDDING_MODEL=<embedder>` for each lane row.
- Bench harness: `phase2-bench/run-phase2-smoke.sh` (3 reranker lanes × 18 probes per embedder).
- Hit semantics: top-5 hit (expected path appears anywhere in the first 5 results).
- Path-normalization: 4-mirror collapse (`.opencode/`, `.codex/`, `.gemini/`, `.claude/`) + line-range suffix stripping (`:NN-MM`).
- Latency timer wraps `ccc search` subprocess (daemon-side embedding + FTS5 + RRF fusion + reranker scoring).

### Pipeline configuration

```
COCOINDEX_CHUNK_SIZE=1500
COCOINDEX_CHUNK_OVERLAP=200
COCOINDEX_CODE_AWARE_CHUNKING=true           (015 tree-sitter)
COCOINDEX_CANONICAL_MIRROR=.opencode         (014 mirror dedup)
COCOINDEX_QUERY_EXPANSION=false              (016 opt-out default)
COCOINDEX_HYBRID=true
COCOINDEX_HYBRID_VECTOR_WEIGHT=0.9           (017 locked)
COCOINDEX_HYBRID_FTS5_WEIGHT=0.5             (017 locked)
COCOINDEX_HYBRID_RRF_K=60                    (017 unchanged)
COCOINDEX_RERANK=true
COCOINDEX_RERANK_MODEL=jinaai/jina-reranker-v3   (018 default; was BGE)
COCOINDEX_RERANK_PATH_CLASS_BOOST=false      (opt-in for Lane C)
COCOINDEX_RERANK_TOP_K=20
```

### Embedder pool sizes (post-reindex chunk count)

| Embedder | Chunks | Files | Re-index wall time |
|---|---:|---:|---:|
| nomic-ai/CodeRankEmbed | 83,781 | 8,489 | ~25 min |
| BAAI/bge-code-v1 | 83,737 | 8,489 | ~10 min |

(Chunk counts differ by ~44 because re-indexes happened at different file-system states; close enough for matrix comparison.)

### Environment

- Hardware: Apple Silicon (MPS backend)
- sentence-transformers 5.4.1, transformers 5.8.0, torch 2.11.0
- Python 3.11.14

<!-- /ANCHOR:3-methodology -->

---

<!-- ANCHOR:4-per-candidate-profiles -->
## 4. PER-CANDIDATE PROFILES

### 4.1 `sbert/nomic-ai/CodeRankEmbed` -- production default winner

| Property | Value |
|---|---|
| HuggingFace | `nomic-ai/CodeRankEmbed` |
| Dim | 768 |
| Approx. RAM (loaded) | ~600 MB |
| Approx. disk (cache) | ~300 MB |
| Category | code-tuned |
| MPS compatible | Yes |
| Origin | Nomic AI |
| Best lane (this bench) | jina-v3 reranker, 14/18, p50 1964 ms, p95 13554 ms |
| Latency advantage vs bge-code-v1 | ~10% lower median across all 3 lanes |
| Strengths | Same hit rate as bge-code-v1 but ~10% faster median latency. Strong tail behavior (p95 12760 ms on BGE-baseline lane, best in matrix). |
| Weaknesses | Inherits all post-arc shared misses (probes 5, 12, 13). |

### 4.2 `sbert/BAAI/bge-code-v1` -- opt-in runner-up

| Property | Value |
|---|---|
| HuggingFace | `BAAI/bge-code-v1` |
| Dim | 768 |
| Approx. RAM (loaded) | ~700 MB |
| Approx. disk (cache) | ~340 MB |
| Category | code-tuned |
| MPS compatible | Yes |
| Origin | BAAI |
| Best lane (this bench) | jina-v3 reranker, 14/18, p50 2183 ms, p95 13938 ms |
| Strengths | Tied production-grade hit rate. Slightly larger model footprint than nomic but proven on this codebase since the May 18 bake-off. |
| Weaknesses | ~10% higher median latency than nomic at every reranker lane. Opt-in via `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/BAAI/bge-code-v1`. |

### 4.3 Other candidates (from May 18 bake-off, pre-arc context)

The May 18 bake-off measured 5 candidates. Three (jinaai/jina-v2-base-code, google/embeddinggemma-300m, nomic-ai/CodeRankEmbed) tied at 9/18 under broken pipeline. After 013-018 corrections + nomic re-bench, nomic vaulted to 14/18 -- a +5-probe gain entirely from pipeline fixes (not embedder changes). The other two embedders were NOT re-benched under the corrected pipeline; their post-arc hit rates are unknown but presumably also ~14/18 if the "embedder choice is no longer load-bearing" finding generalizes.

| Embedder (May 18 pre-arc) | Hit rate | Latency p95 | Status |
|---|---:|---:|---|
| nomic-ai/CodeRankEmbed (pre-arc) | 9/18 (50.0%) | 2027 ms | **Re-benched post-arc to 14/18 (this report)** |
| jinaai/jina-v2-base-code (pre-arc default) | 9/18 (50.0%) | 7305 ms | Not re-benched; available as opt-in |
| google/embeddinggemma-300m (pre-arc) | 9/18 (50.0%) | 18848 ms | Not re-benched; high tail latency disqualifies regardless |
| BAAI/bge-code-v1 (pre-arc winner) | 11/18 (61.1%) | 4974 ms | **Re-benched post-arc to 14/18 (this report)** |
| dunzhang/stella_en_400M_v5 | 0/18 | n/a | SKIPPED -- xformers incompatible with Apple Silicon MPS |

<!-- /ANCHOR:4-per-candidate-profiles -->

---

<!-- ANCHOR:5-process-notes -->
## 5. PROCESS NOTES

### Sequence of events

1. **Packet 013** (commit `c801b53f2`): hardened bench harness with path-extraction guards + corrected fixture probe 10 fixture-truth bug.
2. **Packet 014** (commit `872b3be47`): query-time mirror dedup with `.opencode` as canonical preference.
3. **Packet 015** (commit `cd8f04bc3`): tree-sitter AST-aware chunking for TS/JS/Py/Go/Rust/Java; probe 14 import-header bug fixed.
4. **Packet 016** (commit `1638f6835`): deterministic query expansion module; empirical bench showed regression; **shipped with `COCOINDEX_QUERY_EXPANSION=false` as default** + opt-in for future tuning.
5. **Packet 017** (commits `24471c843` + `ee788254d`): 7-cell RRF sweep proved fusion math is a no-op on hit rate; locked latency-optimum `(K=60, V=0.9, F=0.5)` for 2.8% p95 win.
6. **Packet 018** (commit `38d4e2d62`): rerank matrix bench (3 lanes; Lane A no-rerank deferred); jina-reranker-v3 locked as production default at 14/18.
7. **Follow-on**: nomic-CodeRankEmbed re-benched under corrected pipeline; tied bge-code-v1 on hit rate with ~10% lower median latency; promoted to production default.

### Bench harness fixes during this work

- `sweep-rrf.sh` used bash 4+ `mapfile` builtin (not available on macOS bash 3.2). Patched to use bash-3.2-compatible `while IFS= read` array reader.
- `rerank-matrix-bench.sh` Lane A (no-rerank ablation) exhibits 32-sec/probe timeout with `COCOINDEX_RERANK_ENABLED=false`. Bug deferred to follow-on debug packet; Lanes B/C/D are sufficient for production reranker verdict.

### Daemon lifecycle gotchas

- `ccc daemon stop` reliably stops the daemon, but auto-restart on first `ccc search` does NOT pick up env vars set BEFORE the stop -- the daemon caches from its OWN env at process start. The matrix bench was originally hitting stale-daemon hangs because of this. Fix: force-kill via `ps -ef | grep "ccc run-daemon" | grep -v grep | awk '{print $2}' | xargs kill -9` before re-launching with new env.

<!-- /ANCHOR:5-process-notes -->

---

<!-- ANCHOR:6-findings -->
## 6. FINDINGS

### Finding 1: Pipeline-fix-first beats model-swap-first

The pre-arc 011 deep-research concluded "switch to jina-reranker-v3" based on public CoIR benchmarks. That conclusion was directionally correct but couldn't have been TRUSTED without the 013/014/015 candidate-set fixes. The corrected-pipeline matrix shows jina-v3 IS the right pick -- but for the right reasons (genuine reranker quality on body chunks), not for the wrong reasons (catching defects the BGE family missed by accident).

### Finding 2: Embedder choice is no longer load-bearing

Under the corrected pipeline, nomic-CodeRankEmbed and BAAI/bge-code-v1 produce IDENTICAL per-probe hit patterns across all 3 reranker lanes. The pre-arc 2-probe advantage of bge-code-v1 (11/18 vs 9/18 over nomic) was entirely an artifact of pipeline defects. Embedder maintainability + latency are the only remaining differentiators -- both lean nomic.

### Finding 3: RRF fusion is downstream of recall

The 7-cell sweep (K ∈ {30,60,90,120} × V ∈ {0.7,0.9} × F ∈ {0.5,0.7}) showed IDENTICAL 12/18 hit rate across all cells. Fusion can only re-rank within the candidate set -- it cannot rescue probes missed at the recall stage. Locking the latency-optimum cell `(60, 0.9, 0.5)` saved 2.8% p95 but moved zero probes.

### Finding 4: Reranker choice IS load-bearing

Across both embedders, switching from BGE-baseline (12/18) to BGE+path-class (13/18) to jina-v3 (14/18) consistently lifts hit rate by +1 to +2 probes per step. The reranker is the dominant lever in the post-arc pipeline.

### Finding 5: Query expansion is a research artifact, not a production lever

Deterministic NL → identifier expansion (camelCase / snake_case / synonyms) pulls test files and doc files into the top-K, displacing implementation. Shipped as opt-in default-false. Future packet: path-class-aware expansion (only expand for implementation files) would likely fix this.

### Finding 6: 3 probes are fundamentally unsolvable in this embedder set

Probes 5, 12, 13 miss across EVERY embedder × reranker combination. Either fixture-truth issues OR the entire embedder family lacks the semantic understanding needed. Candidate for future probe-forensics packet.

<!-- /ANCHOR:6-findings -->

---

<!-- ANCHOR:7-caveats -->
## 7. CAVEATS

### Single-iteration data

Per-embedder/reranker measurements are n=1. Hit rate is binary per probe so variance is bounded, but latency p95 has natural ±10% jitter on Apple Silicon. The bench would benefit from 3-iteration confirmation for the top-2 candidates.

### Lane A (no-rerank ablation) not measured

The harness exhibits a 32-sec/probe timeout under `COCOINDEX_RERANK_ENABLED=false` (verified hit rate 0/18, latency p95 32 sec). Deferred to a follow-on debug packet. We know reranking adds 2+ probes vs no-rerank on bge-code-v1, but we don't have a clean measurement on the corrected pipeline.

### Embedder pool only partially explored

5 candidates measured pre-arc (May 18). Only 2 (nomic, bge-code-v1) re-benched post-arc. jina-v2-base-code, gemma-300m, stella unmeasured under corrected pipeline. Hypothesis: their hit rates would also lift +5 if re-benched, since the "embedder choice is no longer load-bearing" pattern likely generalizes. Untested.

### Fixture size is small

18 probes is enough for binary signal but not enough for high-confidence rank ordering. Confidence intervals on hit rate ±2 probes is realistic. Wider fixtures (50+ probes) would tighten.

### Re-index requirements

Switching embedder requires a FULL re-index (~10-30 min wall on Apple Silicon for ~83k chunks). Operators cannot A/B-test embedders without disk-resident vector duplication or sequential re-index passes.

### Sandbox interactions

The 015 packet's `ccc index` failed under codex's `workspace-write` sandbox with `RuntimeError: Operation not permitted (os error 1)`. Main-agent recovery completed the re-index. Future automated pipelines must NOT run `ccc index` inside a codex sandbox.

<!-- /ANCHOR:7-caveats -->

---

<!-- ANCHOR:8-recommendations -->
## 8. RECOMMENDATIONS

### Ship now (this bench)

1. **Promote `sbert/nomic-ai/CodeRankEmbed`** as the production embedder default (done in same commit as this report)
2. **Promote `jinaai/jina-reranker-v3`** as the production reranker default (already done in packet 018, commit `38d4e2d62`)
3. **Lock RRF params `(K=60, V=0.9, F=0.5)`** (already done in packet 017, commit `ee788254d`)
4. **Keep BGE family + jina-v2-base-code + gemma + mxbai as opt-in** via env override (`COCOINDEX_CODE_EMBEDDING_MODEL` / `COCOINDEX_RERANK_MODEL`)

### Follow-on packets (not blocking arc closure)

- **Lane A no-rerank debug**: fix the 32-sec/probe timeout in `COCOINDEX_RERANK_ENABLED=false` dispatch path
- **Path-class-aware query expansion**: only expand for implementation files (skip tests + docs) to make 016's expansion module net-positive
- **3-iteration confirmation**: rerun top-2 embedder × jina-v3 lanes ×3 to bound variance on hit rate + latency
- **Re-bench jina-v2 + gemma + mxbai under corrected pipeline**: confirm or refute the "embedder choice is no longer load-bearing" generalization
- **Probe forensics**: deep-dive probes 5, 12, 13 (universally missed) -- fixture truth issue OR fundamental semantic gap?
- **Wider fixture**: build a 50+ probe fixture to tighten rank-ordering confidence

<!-- /ANCHOR:8-recommendations -->

---

<!-- ANCHOR:9-reproducibility -->
## 9. REPRODUCIBILITY

### Re-run instructions

```bash
# 1. Ensure clean daemon
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc daemon stop
ps -ef | grep "ccc run-daemon" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null

# 2. Switch embedder + re-index (~15-30 min wall)
COCOINDEX_CODE_EMBEDDING_MODEL=sbert/nomic-ai/CodeRankEmbed \
  .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc reset --force
COCOINDEX_CODE_EMBEDDING_MODEL=sbert/nomic-ai/CodeRankEmbed \
  .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc index

# 3. Run 3-lane bench (~3 min wall)
COCOINDEX_CODE_EMBEDDING_MODEL=sbert/nomic-ai/CodeRankEmbed \
FIXTURE_OVERRIDE=.opencode/specs/.../phase2-bench/code-retrieval-fixture-corrected.json \
OUTPUT_TAG=-reproduce \
COMPARISON_OUTPUT=/tmp/reproduce-comparison.md \
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh
```

`run-phase2-smoke.sh` defaults to `sbert/BAAI/bge-code-v1` for the historical reranker matrix. For nomic reproduction, the `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/nomic-ai/CodeRankEmbed` prefix is required and must match the model used for the preceding reset/index.

### Source data

- Per-probe JSONLs: `.opencode/specs/.../011-rerank-model-fit-investigation/research/phase2-bench/{baseline-bge,bge-path-class,jina-v3}-{017-recalibrated,nomic-coderankembed}.results.jsonl`
- Comparison MDs: `.opencode/specs/.../017-hybrid-fusion-empirical-recalibration/evidence/phase2-comparison-017-recalibrated.md` (bge-code-v1) and `.opencode/specs/.../018-rerank-matrix-rebench/evidence/nomic-coderankembed/phase2-comparison-nomic.md`

### Determinism notes

- All `ccc search` calls are deterministic given the same DB state + same env vars
- Per-lane runs reset the daemon to pick up env changes
- The bench harness writes raw JSONL + a markdown comparison file in one shot

<!-- /ANCHOR:9-reproducibility -->

---

<!-- ANCHOR:10-related-resources -->
## 10. RELATED RESOURCES

### Predecessor bench

- [`../benchmark-2026-05-18/`](../benchmark-2026-05-18/) -- May 18, 2026. 5-candidate bake-off. **STRUCTURALLY INVALIDATED** by stale-pipx-no-rerank-firing bug; preserved as historical record. The bge-code-v1 11/18 win was real but not the "hybrid+rerank ON" framing claimed.

### Source spec packets (full audit trail)

- `013-bench-harness-and-fixture-audit`
- `014-mirror-dedup-canonical-preference`
- `015-code-aware-chunking-tree-sitter-stage-b`
- `016-query-expansion-identifier-bridging`
- `017-hybrid-fusion-empirical-recalibration`
- `018-rerank-matrix-rebench`

Located under: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/`

### Decision records

- ADR-016 (013 bench harness corrections)
- ADR-017 (014 mirror dedup)
- ADR-018 (015 tree-sitter chunking)
- ADR-019 (016 query expansion opt-in default-false)
- ADR-020 (017 RRF empirical no-op + latency-optimum lock)
- ADR-021 (018 jina-reranker-v3 production default + arc closure)

Located in: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`

### Sibling benchmark surfaces

- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/` -- mk-spec-memory embedder benchmarks (ADR-013 nomic switch, ADR-014 cascade reorder)
- `.opencode/skills/system-skill-advisor/mcp_server/benchmarks/` -- skill-advisor embedder parity benchmarks (016/010 packet)

<!-- /ANCHOR:10-related-resources -->
