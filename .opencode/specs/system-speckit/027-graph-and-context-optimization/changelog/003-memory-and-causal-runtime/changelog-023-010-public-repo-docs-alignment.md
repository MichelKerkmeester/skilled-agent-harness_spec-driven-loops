---
title: "010 Public Repo Docs Alignment"
description: "Two-phase closure of docs drift after the May 2026 retrieval-pipeline arc. A 10-iteration cli-devin sweep found 7 P1 findings. Six commits across cli-codex and main-agent then closed all P1s: root README embedder defaults aligned, mcp-coco-index references and assets sk-doc-aligned, benchmark-2026-05-20 folder filled, expanded bench folder renamed."
trigger_phrases:
  - "010 public repo docs alignment"
  - "benchmark folder rename expanded"
  - "root README nomic embedder alignment"
  - "mcp-coco-index references sk-doc alignment"
  - "qwen3 reranker README update"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-20

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/010-public-repo-docs-alignment` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots`

### Summary

After the May 2026 retrieval-pipeline arc, public-repo documentation had drifted from current code defaults. The root README still cited `jina-embeddings-v3` as the mk-spec-memory cascade primary. The two-stage CocoIndex pipeline narrative (Stage 1 `nomic-CodeRankEmbed` + Stage 2 `Qwen3-Reranker-0.6B`) was absent. Several runtime docs under `mcp-coco-index/{references,assets}/` carried duplicate H2 headers and evergreen packet-ID violations.

A cli-devin SWE-1.6 sweep ran 10 iterations across every README, INSTALL_GUIDE, SKILL.md, AGENTS.md, feature_catalog entry, plus reference doc in the public repo, producing `review/review-report.md` with 7 P1 findings and 2 P2/INFO items. Six commits then closed all 7 P1s: cli-codex closed 6 in parallel. Main agent closed the residual the sweep had marked clean (8 stale spots in the root README), then sk-doc-aligned `mcp-coco-index/{references,assets}/`, filled the `benchmark-2026-05-20` folder from 3 to 15 files, then renamed the expanded bench folder to drop the `-expanded` suffix. All 18 docs passed `validate_document.py` with 0 issues. The 4 pytest calibration tests passed.

### Added

- Benchmark folder `benchmark-2026-05-20/` expanded from 3 to 15 files: 6 lane-reranker JSONs, `results.csv` (6 rows), `per-probe.jsonl` (438 rows), 4 sk-doc-compliant narrative sidecars (NEW)
- Canonical `benchmark-2026-05-20/SOURCE.md` documenting fixture composition and data provenance (NEW)
- `benchmark-2026-05-20/benchmark_report.md` as the top-level bench summary (NEW)

### Changed

- `README.md` root embedder callouts updated: `nomic-embed-text-v1.5` named as mk-spec-memory cascade primary (ADR-013/014) with `jina-embeddings-v3` as documented fallback. CocoIndex Stage 1 (`nomic-CodeRankEmbed`) + Stage 2 (`Qwen3-Reranker-0.6B`) two-stage pipeline narrative added.
- `mcp-coco-index/references/tool_reference.md` `Pipeline architecture` block moved from intro region to numbered Section 2 and 6 duplicate H2 headers renumbered.
- `mcp-coco-index/references/settings_reference.md` and `search_patterns.md` updated to replace 5 evergreen packet-ID violations with feature names and source anchors.
- `benchmark-2026-05-20-expanded/` renamed to `benchmark-2026-05-20/` across all 15 files via `git mv`. Path strings updated to match in `registered_embedders.py`, `run-expanded-bench.sh`, plus 4 destination lane JSON fixtures.

### Fixed

- Root README mk-spec-memory cascade default cited `jina-embeddings-v3` as primary. Now correctly cites `nomic-embed-text-v1.5` per ADR-013/014.
- Root README CocoIndex section omitted Stage-2 Qwen3-Reranker-0.6B entirely. Two-stage pipeline narrative now present.
- `tool_reference.md` had duplicate `## 1.` headers breaking navigation. Renumbered across 6 H2 sections.
- Two pre-existing validator failures in `benchmark-2026-05-19/SOURCE.md` (missing TOC and OVERVIEW) and `benchmark-2026-05-18/risk-analysis` (missing OVERVIEW) corrected.
- `test_calibration_perturbation.py` path strings pointed at the old expanded folder name. Updated to `benchmark-2026-05-20`.

### Verification

| Check | Result |
|---|---|
| `validate_document.py` across all 18 docs in `mcp-coco-index/{references,assets,mcp_server/benchmarks}/` | 18 of 18 pass, 0 issues |
| `pytest mcp_server/tests/test_calibration_perturbation.py` | 4 passed |
| Live-surface grep `benchmark-2026-05-20-expanded` excluding spec-packet paths | Empty (0 hits) |
| Live-surface grep for evergreen packet-ID violations in `mcp-coco-index/{assets,references}/` | Empty (0 hits) |
| cli-devin sweep sentinel after remediation | `DOCS_SWEEP_010_COMPLETE iter=10 verdict=0_P1_REMAINING` |

### Files Changed

| File | What changed |
|---|---|
| `README.md` | mk-spec-memory cascade default updated to `nomic-embed-text-v1.5`. CocoIndex Stage 1 + Stage 2 pipeline narrative added. 8 stale spots corrected. |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md` | `## Pipeline architecture` block moved to numbered Section 2. 6 H2 headers renumbered. |
| `.opencode/skills/mcp-coco-index/references/settings_reference.md` | 5 evergreen packet-ID violations replaced with feature names and source anchors. |
| `.opencode/skills/mcp-coco-index/references/search_patterns.md` | Evergreen alignment pass to match post-restructure surface names. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20/` (NEW) | 15-file bench folder: 6 lane JSONs, `results.csv`, `per-probe.jsonl`, `SOURCE.md`, `benchmark_report.md`, 4 narrative sidecars, fixture JSON. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md` | Updated to reflect renamed bench folder and correct file count. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embedders/registered_embedders.py` | Path string updated from `benchmark-2026-05-20-expanded` to `benchmark-2026-05-20`. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_calibration_perturbation.py` | Fixture path updated to `benchmark-2026-05-20`. |

### Follow-Ups

- Seven spec-packet historical markdown files retain the old `benchmark-2026-05-20-expanded` path string by design (evergreen rule). Readers scanning grep results without context may flag these as drift. Both SOURCE.md and this changelog document the convention as intentional.
- Two P2/INFO items from the cli-devin report remain open: mk-spec-memory embedder cross-check and a longer-timeout `cocoindex_code` module path grep re-run. Both are explicitly low-priority and outside this packet's scope.
