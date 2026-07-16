---
title: "Code Index Stack Phase 014: Mirror Dedup with Canonical Preference"
description: "CocoIndex now collapses runtime mirror aliases before the rerank window is selected. A two-pass dedup in query.py keeps one canonical copy per mirrored file (default .opencode/), ships a pure path-helper module, adds env-var configurability and delivers a 14.5% p95 latency improvement with zero hit-rate regression on the 18-probe corrected bench."
trigger_phrases:
  - "mirror dedup canonical preference"
  - "cocoindex mirror collapse"
  - "COCOINDEX_CANONICAL_MIRROR"
  - "rerank window mirror pollution"
  - "path_utils mirror helper"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

CocoIndex indexes every project file under four runtime mirror prefixes (.opencode/, .codex/, .gemini/, .claude/). Before this packet, all four copies competed for slots in the rerank candidate window, polluting up to 75% of rerank slots in the worst case and degrading top-5 diversity for the user. The existing `_dedup_and_rank_hybrid_rows()` in query.py did not span mirror prefixes before the rerank cut.

A two-pass dedup now collapses mirror aliases to one canonical copy before the rerank-window selection. Pass A groups candidates by path stem and keeps the canonical-mirror copy (default .opencode/) when present, falling back to the first ranked mirror when the canonical is absent. Pass B preserves the existing source-realpath and content-hash dedup. A new pure helper module (`path_utils.py`) exposes `extract_path_stem`, `is_mirror_path` and `select_canonical_mirror_copy` for reuse by downstream packets.

The 18-probe corrected bench (three lanes) showed hit rate unchanged at 14/18 across all lanes and p95 latency improvements of 14.53%, 4.26% and 5.69% versus the 013-corrected baseline. Zero probe regressions were recorded. 104 pytest tests passed with zero regressions on the existing suite.

### Added

- `path_utils.py` with `extract_path_stem`, `is_mirror_path` and `select_canonical_mirror_copy` as pure helper functions
- `COCOINDEX_CANONICAL_MIRROR` env var in `config.py` (default `.opencode`): selects which mirror prefix is treated as canonical across all queries
- `COCOINDEX_MIRROR_PREFIXES` env var in `config.py` (default four-mirror JSON list): operators set `[]` to disable mirror collapse without code changes
- 39 new pytest tests in `test_path_utils.py` and `test_dedup_mirrors.py` covering four-mirror collapse, canonical-absent fallback, mixed mirror and non-mirror preservation, empty set, single candidate and opt-out behavior
- ADR-017 appended to the embedder bake-off decision record documenting canonical-mirror policy, env contract, dedup pass ordering and rollback path

### Changed

- `_dedup_and_rank_hybrid_rows()` in `query.py`: mirror-collapse Pass A inserted before the existing content-hash and line-range dedup Pass B
- `cocoindex_code/README.md`: updated to document mirror dedup behavior and the new `path_utils.py` helper module

### Fixed

- Rerank window contained up to four identical-content copies of each mirrored file, consuming rerank slots that could serve diverse results. Mirror-collapse Pass A eliminates redundant candidates before the cut.
- p95 query latency reduced 4.26% to 14.53% across three embedder lanes because the reranker scores fewer redundant candidates per query.

### Verification

| Check | Result |
|---|---|
| Targeted pytest (39 new tests) | PASS: 39 passed |
| Full MCP server pytest | PASS: 104 passed, zero regressions |
| Corrected bench rerun (18-probe, 3 lanes) | PASS: baseline-bge 14/18, bge-path-class 14/18, jina-v3 14/18 |
| Probe regression check | PASS: no hit/miss deltas versus 013 corrected baseline |
| Latency gate (p95 delta vs 013 corrected baseline) | PASS: baseline-bge -14.53%, bge-path-class -4.26%, jina-v3 -5.69% |
| Strict packet validation | PASS: `validate.sh --strict` returned `RESULT: PASSED` |
| Sequential-thinking MCP | Attempted 5 times. Each call returned `user cancelled MCP tool call`. Work proceeded with explicit planning and inline verification. |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | Added `COCOINDEX_CANONICAL_MIRROR` and `COCOINDEX_MIRROR_PREFIXES` env vars with defaults and validation |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/path_utils.py` (NEW) | Created | Pure mirror path helper module with three exported functions |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modified | Added mirror-collapse Pass A to `_dedup_and_rank_hybrid_rows()` before existing content-hash dedup |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_path_utils.py` (NEW) | Created | Unit tests for `path_utils.py` helper functions |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_dedup_mirrors.py` (NEW) | Created | Integration tests for mirror-aware hybrid dedup across six scenarios |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md` | Modified | Documented mirror dedup behavior and `path_utils.py` helper |
| `decision-record.md` (embedder bake-off packet) | Modified | Appended ADR-017 with canonical-mirror policy and rollback path |

### Follow-Ups

- Rerank-score JSONL files were empty in the retained bench run. Mirror-collapse behavior is demonstrated by targeted integration tests rather than rerank-score rows. A future bench run with a live daemon should confirm the rerank-score reduction.
- Sequential-thinking MCP did not execute successfully across five attempts. The five calls are recorded as attempted. Future invocations should verify whether the tool is available in the active runtime context before depending on it.
- Probes 1, 5, 12 and 15 remain genuine failures after mirror dedup. These are code-pipeline issues (chunking quality, query expansion) that packet 015 and 016 address.
