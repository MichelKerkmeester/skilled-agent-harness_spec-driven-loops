---
title: "Code Index Stack 003: CocoIndex Embedder Comparison and ADR-001"
description: "Empirical benchmark of jina-code vs gemma-300m on the 018/002 fixture. ADR-001 ratifies sbert/jinaai/jina-embeddings-v2-base-code as the CocoIndex production embedder after parity on top-3 recall and a clear jina-code advantage on p95 latency."
trigger_phrases:
  - "cocoindex embedder comparison"
  - "ADR-001 jina-code verdict"
  - "018/003 comparison measure"
  - "embedder benchmark fixture"
  - "KEEP-JINA-CODE ratification"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/003-comparison-measure` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

Without an empirical measurement, the CocoIndex embedder choice was unratified. The 018/001 swap mechanism and 018/002 fixture existed, but no comparison data tied them to a production verdict.

Both primary candidates were benchmarked against the full 018/002 fixture. For each candidate the daemon was stopped, the CocoIndex databases were reset, `COCOINDEX_CODE_EMBEDDING_MODEL` was set, a full `ccc index` was run (24-25 minutes per candidate), then 18 fixture queries were probed with `ccc search --limit 5`. Mirror-equivalent paths across `.opencode`, `.claude`, `.codex`, `.gemini` were normalized for hit scoring.

jina-code and gemma tied at 7/18 top-3 hits after normalization, but jina-code posted 590 ms p95 latency vs 4011 ms for gemma. ADR-001 verdict is KEEP-JINA-CODE. No config flip was needed because `_DEFAULT_MODEL` already pointed at `sbert/jinaai/jina-embeddings-v2-base-code`. Production state was restored with a clean full index: 8,427 files, 127,346 chunks, 0 errors. Optional CodeRankEmbed and bge-code sweeps were deferred as the primary pair provided a sufficient verdict.

### Added

- `evidence/cocoindex-embedder-comparison.jsonl` with 36 per-pair rows for jina-code and gemma primary candidates (NEW)
- `evidence/cocoindex-embedder-comparison.csv` with aggregate hit counts and latency metrics per embedder (NEW)
- `evidence/cocoindex-embedder-runlog.txt` with raw benchmark run output (NEW)
- ADR-001 ratification in `decision-record.md` with alternatives table, five-checks evaluation, rollback path

### Changed

- `decision-record.md` now carries the accepted KEEP-JINA-CODE verdict with measured recall and latency evidence

### Fixed

- None. Benchmark-and-ratification phase with no prior bug to fix.

### Verification

- `cat evidence/cocoindex-embedder-comparison.csv`: PASS, rows for jina-code and gemma present.
- MPS gate: `_resolve_device(None) == "mps"` and `Config.from_env().device == "mps"` confirmed.
- Rescue gate: no `rescue` or `SPECKIT_RERANK_LAYER` code found under `cocoindex_code`.
- Production restore: `ccc index` with jina-code completed with 8,427 files, 127,346 chunks, errors 0.
- Strict packet validation (`validate.sh --strict`): PASS, exit 0.
- ADR-001 five-checks evaluation: 5/5 PASS.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `evidence/cocoindex-embedder-comparison.jsonl` (NEW) | Created | 36 per-pair rows. jina-code and gemma top-3 paths plus normalized hit flag per fixture query. |
| `evidence/cocoindex-embedder-comparison.csv` (NEW) | Created | Aggregate metrics. Top-3 hit count, hit rate, easy/medium/hard breakdown, median and p95 latency per embedder. |
| `evidence/cocoindex-embedder-runlog.txt` (NEW) | Created | Raw benchmark run output capturing reindex progress and search probe results. |
| `decision-record.md` | Updated | ADR-001 authored. Verdict KEEP-JINA-CODE. Alternatives table, five-checks evaluation, rollback path included. |

### Follow-Ups

- Run a second sweep for CodeRankEmbed and bge-code only if future retrieval failures justify the additional 50 minutes of reindex time per candidate.
- Investigate fixture search-surface noise where canonical docs and mirrored skill directories outrank the canonical `.opencode` source file. Consider a path-class filter or mirror-aware scoring in a future fixture revision.
