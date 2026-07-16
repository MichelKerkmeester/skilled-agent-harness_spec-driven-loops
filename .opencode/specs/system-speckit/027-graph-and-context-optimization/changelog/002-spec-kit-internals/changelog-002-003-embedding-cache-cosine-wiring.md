---
title: "Changelog: Skill embedding cache and cosine-similarity lane wiring [002-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring]"
description: "Chronological changelog for the Skill embedding cache and cosine-similarity lane wiring phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine`

### Summary

The skill advisor semantic-shadow lane lacked an embedding-based scoring path. This phase added per-skill embedding caching to skill-graph.sqlite, embedded recommend prompts at call time, and wired a cosine similarity lane that emits real LaneMatch scores. The lane remains shadow-only this phase so it does not change live recommendation output. A future phase promotes the lane after an ablation sweep.

### Added

- A shadow-only cosine similarity lane in semantic-shadow.ts that reads cached skill vectors, computes cosine similarity, and emits semantic_shadow matches with cosine evidence above the documented threshold.
- Cached vectors stored in skill-graph.sqlite through new idempotent embedding, embedding_model_id, and embedding_content_hash columns.
- Vitest coverage for the new cosine lane at mcp_server/skill_advisor/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts covering schema idempotence, scan-time embed and skip behavior, cosine fixtures, and the live-field shadow invariant.

### Changed

- skill-graph-db.ts now adds idempotent embedding, embedding_model_id, and embedding_content_hash columns, refreshes description embeddings through the current createEmbeddingsProvider() API, skips rows when hash and model match, and exposes cached vectors through loadSkillEmbeddings().
- skill_graph_scan now refreshes embeddings after metadata indexing.
- advisor-recommend.ts now embeds each non-cached recommend prompt through withSemanticShadowPromptEmbedding() before scoring.

### Fixed

- None.

### Verification

- Strict spec validation - Pass
- Typecheck (npm run typecheck) - Pass
- Vitest new cosine lane test - Pass , , ,  4 tests
- Vitest skill advisor suite (vitest run mcp_server/skill_advisor) - Fails one existing compat test: forced-local Python bridge now returns ok instead of expected fail_open
- Dist rebuild (npx tsc --build) - Pass
- Shadow-only behavior check - Pass , , ,  recommendedSkill and confidence unchanged against disabled semantic lane
- Generated dist check - Pass , , ,  cosine logic present in dist/skill_advisor/lib/scorer/lanes/semantic-shadow.js

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/skill_advisor/lib/scorer/lanes/semantic-shadow.ts` | Modified | Added cosine similarity lane with shadow-only scoring |
| `mcp_server/skill_advisor/lib/db/skill-graph-db.ts` | Modified | Added embedding columns and caching logic |
| `mcp_server/skill_advisor/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts` | Created | Vitest coverage for cosine lane |

### Follow-Ups

- None.
