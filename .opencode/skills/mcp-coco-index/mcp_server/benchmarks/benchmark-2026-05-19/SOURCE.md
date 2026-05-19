---
title: "Source manifest -- benchmark-2026-05-19"
description: "Pointers to the source spec packets, evidence files, and commit hashes that this benchmark report distills. Each item names the canonical location so the full audit trail remains discoverable from this folder."
trigger_phrases:
  - "benchmark-2026-05-19 sources"
  - "mcp-coco-index 2026-05-19 audit trail"
importance_tier: "important"
contextType: "reference"
---

# Source manifest -- benchmark-2026-05-19

## Spec packets (full audit trail)

Located under: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/`

| Packet | Commit | Evidence |
|---|---|---|
| 013-bench-harness-and-fixture-audit | `c801b53f2` | `evidence/phase2-comparison-013-bench-corrected.md` |
| 014-mirror-dedup-canonical-preference | `872b3be47` | `evidence/phase2-comparison-014-dedup.md` |
| 015-code-aware-chunking-tree-sitter-stage-b | `cd8f04bc3` | `evidence/phase2-comparison-015-treesitter.md` + delta |
| 016-query-expansion-identifier-bridging | `1638f6835` | `evidence/phase2-comparison-016-query-expansion.md` |
| 017-hybrid-fusion-empirical-recalibration | `24471c843` + `ee788254d` | `evidence/cells/*.json` + `sweep-results.md` + `phase2-comparison-017-recalibrated.md` |
| 018-rerank-matrix-rebench | `38d4e2d62` | `evidence/rerank-matrix-results.md` + `phase2-comparison-018-final.md` + `evidence/nomic-coderankembed/phase2-comparison-nomic.md` |

## Decision records (ADR-016 through ADR-021)

Located in: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`

| ADR | Topic |
|---|---|
| ADR-016 | 013 bench harness corrections + fixture audit |
| ADR-017 | 014 mirror dedup with canonical preference |
| ADR-018 | 015 tree-sitter code-aware chunking |
| ADR-019 | 016 deterministic query expansion (opt-in default-false) |
| ADR-020 | 017 RRF empirical recalibration (no-op finding + latency-optimum lock) |
| ADR-021 | 018 jina-reranker-v3 production default + arc closure |

## Bench harness sources

Located in: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/`

| File | Purpose |
|---|---|
| `run-phase2-smoke.sh` | 3-lane 18-probe bench harness (per-embedder) |
| `sweep-rrf.sh` + `sweep-rrf.py` | RRF parameter sweep (packet 017) |
| `rerank-matrix-bench.sh` + `rerank-matrix-analyze.py` | Reranker matrix harness (packet 018) |
| `code-retrieval-fixture-corrected.json` | 18-probe corrected fixture (013 hardened) |

## Per-embedder + per-reranker raw JSONLs

bge-code-v1 (017 final-gate, in-place; used as 018 lane data):
- `phase2-bench/baseline-bge-017-recalibrated.results.jsonl`
- `phase2-bench/bge-path-class-017-recalibrated.results.jsonl`
- `phase2-bench/jina-v3-017-recalibrated.results.jsonl`

nomic-CodeRankEmbed (this benchmark, follow-on):
- `phase2-bench/baseline-bge-nomic-coderankembed.results.jsonl`
- `phase2-bench/bge-path-class-nomic-coderankembed.results.jsonl`
- `phase2-bench/jina-v3-nomic-coderankembed.results.jsonl`

## Code changes that ship with this benchmark

| File | Packet | Change |
|---|---|---|
| `cocoindex_code/config.py` | 015-018 + follow-on | All new env vars + default flips |
| `cocoindex_code/chunkers/*` | 015 | New tree-sitter chunker module |
| `cocoindex_code/query.py` | 014 + 016 | Mirror dedup + (opt-in) expansion integration |
| `cocoindex_code/query_expansion.py` | 016 | New module |
| `cocoindex_code/path_utils.py` | 014 | New helper |
| `cocoindex_code/fts_index.py` | 016 | FTS5 clause input |
| `cocoindex_code/rerankers_jina_v3.py` | 011 carry-forward | Production default (was 011 Track B throwaway) |
| `cocoindex_code/registered_embedders.py` | follow-on | `_DEFAULT_NAME` → nomic |

## Predecessor bench

- `../benchmark-2026-05-18/` -- May 18, 2026. 5-candidate bake-off. **STRUCTURALLY INVALIDATED** by stale-pipx-no-rerank-firing bug. Preserved as historical record.
