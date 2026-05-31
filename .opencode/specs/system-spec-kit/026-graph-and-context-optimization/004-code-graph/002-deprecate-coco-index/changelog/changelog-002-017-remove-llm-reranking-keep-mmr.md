---
title: "Code Graph 002/017: Remove LLM Reranking Vestiges, Keep MMR"
description: "Residual inactive LLM-model reranking vestiges removed from code, docs plus tests while the algorithmic MMR diversity reranker remained live. Behavior-neutral cleanup verified via tsc, affected Vitest set plus a broad subsystem subset."
trigger_phrases:
  - "remove llm reranking keep mmr"
  - "reranker vestige cleanup"
  - "cross-encoder removal 017"
  - "mmr only stage 3"
  - "confidence reranker weight removal"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/017-remove-llm-reranking-keep-mmr` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

Packet 014/003 (commit `b564013c0e`) already removed the core inactive LLM-model reranking path: the cross-encoder modules, local GGUF reranker sidecar, conditional rerank gate, Stage 3 Step 1 cross-encoder step plus seven related tests. After that removal, residual confidence scoring vestiges, explainability signals, audit metrics, active documentation claims plus test assertions still referenced the dead reranker path. The live pipeline no longer assigned `rerankerScore`, so all of those references were inert noise.

This packet is the 39-file cleanup layer. It removed every inactive LLM-model reranker vestige from confidence scoring, explainability, audit, feature flags, documentation plus tests. MMR (Maximal Marginal Relevance) diversity reranking was explicitly preserved because it is algorithmic vector math in Stage 3, not a separate LLM model sidecar. The result is that active memory-search surfaces now accurately describe the MMR-only Stage 3 pipeline.

### Added

None.

### Changed

- `confidence-scoring.ts` now uses three confidence factors: margin at 0.35, channel agreement at 0.30, plus anchor density at 0.15. The inactive 0.20 reranker factor was removed without redistribution because it was already inert with the cross-encoder gate hard-OFF.
- Stage 3 architecture documentation now describes MMR diversity reranking plus MPAB chunk collapse as the only active behavior.
- Feature flag references updated to remove retired flags: `SPECKIT_CROSS_ENCODER`, `RERANKER_LOCAL`, `SPECKIT_RERANKER_MODEL`, `SPECKIT_RERANKER_TIMEOUT_MS` plus `ENABLE_RERANKER`.
- Root README updated to remove stale shipped/embedder claims, correct the MMR-only Stage 3 bullet, fix doc links plus correct tool counts.
- `references/memory/embedder_pluggability.md` rewritten to mk-spec-memory-only, collapsing obsolete code-graph embedder content to a no-embedder-since-014 note.

### Fixed

- `result-explainability.ts` emitted a dead `reranker_support` signal that could never fire. The signal and its summary case were removed.
- `decision-audit.ts` reported a stale `rerankTriggerRate` SLA metric from the removed reranker path. The metric was removed.
- `stage2-fusion.ts` carried a stale canonical reranker output comment. The comment was removed.
- Confidence documentation described four factors. It now correctly describes three.
- UX docs referenced `reranker_support` and `reranker_boost` fields that no longer exist. Both references were removed.
- `scripts/tests/memory-pipeline-regressions.vitest.ts` asserted the default embedder as `BAAI/bge-base-en-v1.5`. The assertion was corrected to `nomic-ai/nomic-embed-text-v1.5`.
- Reranker-specific assertions and fixtures were removed from 12 affected Vitest files. The `result-confidence` high-envelope fixture was strengthened with `sources: ['vector','fts']` and a second anchor so it reaches the `high` tier without the removed reranker boost.

### Verification

| Check | Result |
|-------|--------|
| `node_modules/.bin/tsc --noEmit -p mcp_server/tsconfig.json` | PASS: 0 errors |
| Affected test set | PASS: 14 files, 493 tests passed |
| Broad search/scoring/pipeline/retrieval subsystem subset | PASS: 107 files, 2371 tests passed |
| Full 528-file mcp_server Vitest suite | NOT RUN: projected 5+ hours. Substituted with full compile, affected tests, broad subsystem subset |
| MMR independence | PASS: no cross-encoder imports. `SPECKIT_MMR`-gated Stage 3 step intact. `stage3-rerank-regression` passes MMR-only |
| Residual `rerankerScore` live assignments | PASS: zero live assignments in `mcp_server/lib` plus handlers |
| Packet validation | PASS: strict `validate.sh` exit 0 after `description.json` generation |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Removed inert reranker confidence factor, fields, helper plus driver. Three-factor model remains. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts` | Removed dead `reranker_support` signal and summary case. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts` | Removed stale `rerankTriggerRate` metric. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Removed stale canonical reranker output comment. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md` | Aligned search docs to MMR-only Stage 3. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md` | Aligned pipeline docs to MMR diversity reranking plus MPAB. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/README.md` | Removed stale reranker-sidecar quality references. |
| `.opencode/skills/system-spec-kit/README.md` | Aligned to MMR-only and corrected embedder/tool counts. |
| `.opencode/skills/system-spec-kit/references/config/environment_variables.md` | Removed retired reranker flags and stale cloud key row. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Aligned catalog index and confidence factor count. |
| `.opencode/skills/system-spec-kit/feature_catalog/01--retrieval/002-semantic-and-lexical-search-memorysearch.md` | Aligned retrieval docs to MMR-only Stage 3. |
| `.opencode/skills/system-spec-kit/feature_catalog/01--retrieval/004-hybrid-search-pipeline.md` | Aligned hybrid pipeline docs to MMR-only behavior. |
| `.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md` | Rewritten to mk-spec-memory-only. Collapsed obsolete code-graph embedder content. |
| `.opencode/skills/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts` | Corrected stale default embedder assertion to `nomic-ai/nomic-embed-text-v1.5`. |
| `README.md` | Removed stale shipped/embedder claims. Fixed MMR-only bullet, doc links plus tool counts. |

### Follow-Ups

- Run the full 528-file mcp_server Vitest suite when machine capacity allows to close the substitution gap documented in Known Limitations.
