---
title: "Code Index Stack Phase 004: Extended Code-Embedder Bake-Off"
description: "4-candidate code-embedder bake-off with hybrid+rerank defaults nominally on. bge-code-v1 recorded the highest hit rate at 11/18 = 61.1%. A same-evening erratum established that rerank was not firing during the bench due to a stale pipx install. stella was skipped because xformers is not viable on Apple Silicon."
trigger_phrases:
  - "extended code-embedder bake-off"
  - "bge-code-v1 11/18 wins"
  - "stella xformers skip apple silicon"
  - "hybrid rerank not firing pipx erratum"
  - "016 004 004 benchmark results"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off` (Level 2)
> Parent packet: `002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

The 018/003 bake-off had ended in a three-way tie at 9/18 = 38.9% with two candidates (nomic-CodeRankEmbed and bge-code-v1) crashing mid-bench due to daemon loss. This packet re-ran the benchmark with all four candidates against the same 18-pair fixture, with the 016/011 retrieval stack defaults nominally flipped on (hybrid FTS5+vector RRF, cross-encoder rerank with BGE-reranker-v2-m3).

bge-code-v1 recorded 11/18 = 61.1% at 504ms median, beating a three-way tie at 9/18 = 50.0% held by jina-code, gemma-300m, nomic-CodeRankEmbed. Stella was skipped after its indexing step hung indefinitely on an `AssertionError: please install xformers`. No usable Apple Silicon build path exists for xformers.

A same-evening erratum invalidated the "hybrid+rerank ON" framing. The pipx-installed `ccc` at `~/.local/pipx/venvs/cocoindex-code/` was a stale May 7 copy missing `reranker.py`, `fts_index.py`, `fusion.py`, `registered_embedders.py`. What was actually measured was pure-vector + RRF-no-FTS5 + no rerank. The bge-code-v1 win was real under those conditions, but the +2 pairs attributed to hybrid+rerank was structurally wrong. An instrumented single-candidate re-bench found bge-code-v1 drops to 10/18 = 55.6% when rerank actually fires. The corrected 4-candidate re-baseline is owned by `007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/`.

### Added

- Benchmark harness script `evidence/run-extended-bake-off-with-hybrid-rerank.sh` (extended from 018/003 ad-hoc approach) with two parser fixes: read `expected_source_path` rather than `expected_path` and strip mirror-tree prefix plus line-range suffix for top-5 hit check
- `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.csv` with 4 candidate rows (stella absent due to failure)
- `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.jsonl` with 72 rows (4 embedders times 18 probes)
- `evidence/runlog-with-hybrid-rerank.txt` capturing full bench session including stella failure trace
- `benchmark-results.md` with 11 sections covering per-probe analysis, latency percentiles, unique-win breakdown, universal floor/ceiling analysis. Section 0 documents the erratum.

### Changed

- Reranker default swapped from `Alibaba-NLP/gte-multilingual-reranker-base` to `BAAI/bge-reranker-v2-m3` (GTE crashes on Apple Silicon MPS with `AcceleratorError` caught silently by `reranker.py`'s try/except)
- Top-1 hit semantics raised to top-5 to match real retrieval consumer behavior (RAG, search-as-UI)
- Chunk size and overlap raised 1000/150 to 1500/200 per 016/011 outputs

### Fixed

- Parser bug in 018/003 harness that read `expected_path` instead of `expected_source_path`, causing all hits to be misclassified as misses
- Mirror-tree prefix and line-range suffix stripping added so retrieved file paths match fixture expected paths

### Verification

- `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.csv` exists with 5 rows (header plus 4 candidates)
- `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.jsonl` exists with 72 rows
- `evidence/runlog-with-hybrid-rerank.txt` records `total_wall_s=3161` for the resumed bge+stella attempt
- `benchmark-results.md` written with full per-probe and per-embedder analysis across 11 sections
- All bench processes cleanly killed at session end with no zombie daemons or hung `ccc index` processes
- Erratum added to `benchmark-results.md` Section 0 after same-evening instrumented re-bench confirmed rerank was not firing
- Strict packet validation pending operator run

### Files Changed

| File | What changed |
|------|--------------|
| `evidence/run-extended-bake-off-with-hybrid-rerank.sh` (NEW) | Bench harness with parser fixes and top-5 hit logic |
| `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.csv` (NEW) | 4-candidate hit-rate and latency summary table |
| `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.jsonl` (NEW) | Per-probe results for all 4 candidates (72 rows) |
| `evidence/runlog-with-hybrid-rerank.txt` (NEW) | Full session log including stella failure trace |
| `benchmark-results.md` (NEW) | 11-section results document with erratum at Section 0 |
| `implementation-summary.md` (NEW) | Completion summary with erratum note and corrected next-steps |

### Follow-Ups

- Run 3-candidate confirmation of bge-code-v1 lead using the corrected pipeline (owned by `007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/`).
- Fix `registered_embedders.py:118` stella entry from `mps_compatible=True` to `False` and update notes with the xformers requirement.
- Tighten `run-extended-bake-off-with-hybrid-rerank.sh` pre-pull check to inspect exit code and grep full output for `AssertionError|ImportError|FileNotFoundError` rather than only the last log line.
- Restore CocoIndex daemon to jina-code baseline by running `pkill -KILL -f "ccc " && rm -f .cocoindex_code/lock.mdb && ccc reset --force && ccc index`.
- Manually verify the 5 universal-ceiling probes (1, 6, 11, 12, 15) for correct expected paths in the fixture.
