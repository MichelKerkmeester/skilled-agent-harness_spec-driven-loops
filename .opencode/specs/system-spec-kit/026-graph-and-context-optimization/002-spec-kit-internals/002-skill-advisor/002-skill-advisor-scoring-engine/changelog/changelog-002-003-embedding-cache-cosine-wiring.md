---
title: "Skill embedding cache and cosine-similarity lane wiring"
description: "Wired an embedding cache to skill-graph.sqlite and implemented a shadow-only cosine-similarity lane for the skill advisor, without changing live recommendation behavior."
trigger_phrases:
  - "skill embedding cache"
  - "cosine lane wiring"
  - "advisor shadow cosine"
  - "skill-graph embedding column"
  - "semantic shadow cosine"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine`

### Summary

The skill advisor lacked an embedding lane. Token-overlap scoring alone could not recall skills when prompts described intent without keyword overlap. This phase added idempotent embedding columns to skill-graph.sqlite, embedded skill descriptions during scan, embedded incoming recommend prompts before scoring, and wired a cosine-similarity lane that emits real scores but stays shadow-only so existing recommendation output is unchanged.

### Added

- Shadow-only cosine-similarity lane implemented in the existing semantic-shadow.ts export. The lane reads cached skill vectors from skill-graph.sqlite, computes cosine similarity, and emits semantic_shadow matches with cosine evidence above the documented threshold.
- Vitest coverage at mcp_server/skill_advisor/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts for schema idempotence, scan-time embed and skip logic, cosine fixtures, and the live-field shadow invariant.

### Changed

- skill-graph-db.ts now adds idempotent embedding, embedding_model_id, and embedding_content_hash columns. Description embeddings are refreshed through the current createEmbeddingsProvider() API. Rows are skipped when the content hash and model match.
- skill_graph_scan now refreshes embeddings after metadata indexing.
- advisor-recommend.ts embeds each non-cached recommend prompt through withSemanticShadowPromptEmbedding() before scoring.

### Fixed

- None.

### Verification

- Strict spec validation - Pass
- Typecheck (npm run typecheck) - Pass
- Vitest new cosine lane test - Pass — 4 tests
- Vitest skill advisor suite (vitest run mcp_server/skill_advisor) - Pass with one pre-existing caveat: forced-local Python bridge returns ok instead of expected fail_open
- Dist rebuild (npx tsc --build) - Pass
- Shadow-only behavior check - Pass — recommendedSkill and confidence unchanged against disabled semantic lane
- Generated dist check - Pass — cosine logic present in dist/skill_advisor/lib/scorer/lanes/semantic-shadow.js

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| mcp_server/skill_advisor/lib/scorer/lanes/semantic-shadow.ts | Modified | Added cosine-similarity lane implementation with shadow-only behavior |
| mcp_server/skill_advisor/lib/db/skill-graph-db.ts | Modified | Added idempotent embedding, embedding_model_id, and embedding_content_hash columns with loadSkillEmbeddings() |
| mcp_server/skill_advisor/lib/skill_graph_scan.ts | Modified | Refresh embeddings after metadata indexing |
| mcp_server/skill_advisor/lib/handlers/advisor-recommend.ts | Modified | Embed non-cached recommend prompts before scoring |
| mcp_server/skill_advisor/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts | Created | Vitest coverage for schema idempotence, embed-on-scan, cosine fixtures, and shadow invariant |

### Follow-Ups

- None.
