---
title: "Changelog: Memory MCP C9 — Graceful Embedder-Degrade to Lexical [001-speckit-memory/004-graceful-degradation]"
description: "Chronological changelog for the Memory MCP C9 — Graceful Embedder-Degrade to Lexical phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/004-graceful-degradation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

An embedder outage no longer takes Memory recall down with it. When the embedder returns a null or empty embedding, the search pipeline now degrades to lexical (BM25/FTS) candidate generation and reports embedder_available:false / vector_search_skipped:true, instead of throwing inside Stage-1 and being swallowed to empty candidates. You still get results — just the lexical tier — and the response tells you the dense channel was skipped.

### Added

- Add embedder_available / vector_search_skipped to the Stage-1 output metadata (mcp_server/lib/search/pipeline/types.ts) — commit 484b77b589
- Plumb the degrade flags through the recall response + add the handler-level concept guard (mcp_server/handlers/memory-search.ts) — commit 484b77b589
- [Scope addition, documented/benign/zero-live-blast] Make pre-existing input throws (>5 concepts, empty query/concept, unknown searchType) propagate as a typed Stage1InputError rather than being swallowed to empty (mcp_server/lib/search/pipeline/stage1-candidate-gen.ts) — commit 484b77b589
- Add stage1-embedder-degrade.vitest.ts (5 cases) asserting degrade-to-lexical + flags (mcp_server/tests/stage1-embedder-degrade.vitest.ts) — commit 484b77b589
- Add the gate-D envelope assertion that the happy path is unchanged (mcp_server/tests/...regression-embedding-semantic-search.vitest.ts) — commit 484b77b589
- tsc + build pass; 440 search/pipeline tests pass — commit 484b77b589

### Changed

- Confirm the three null-embedding throw sites + the keep-lexical substrate (mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:700-707, 1014-1020; mcp_server/lib/search/hybrid-search.ts:931-947) — evidence: iter-003 f-iter003-007, iter-034 C9-sketch
- Capture baseline suite state — 440 search/pipeline tests; 2 pre-existing unrelated failures confirmed identical on baseline via stash (commit 484b77b589)
- Route null/empty embedding → lexical (useVector=false) instead of throwing; hybrid path via the live substrate + explicit route for the vector/multi-concept branches (mcp_server/lib/search/pipeline/stage1-candidate-gen.ts) — commit 484b77b589
- Prove the happy (embedder-success) path byte-identical via git diff -w trace; degrade traced to BM25; metadata plumbed through cache — independent opus adversarial review: SHIP (commit 484b77b589)
- All tasks marked [x]
- No [B] blocked tasks remaining

### Fixed

- No fixes recorded.

### Verification

- tsc + build - PASS
- Full search/pipeline suite - PASS — 440 tests (2 pre-existing unrelated failures confirmed identical on baseline)
- stage1-embedder-degrade.vitest.ts (5 cases) - PASS
- Gate-D envelope assertion (happy path unchanged) - PASS
- Happy path byte-identical - PASS — traced via git diff -w; degrade traced to BM25
- Independent opus adversarial review - SHIP
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modified | Route null embedding → lexical instead of throwing; typed Stage1InputError for genuine input errors |
| `mcp_server/lib/search/pipeline/types.ts` | Modified | Added embedder_available / vector_search_skipped to Stage-1 output metadata |
| `mcp_server/handlers/memory-search.ts` | Modified | Plumbed the degrade flags through the response + handler-level concept guard |
| `mcp_server/tests/stage1-embedder-degrade.vitest.ts` | Created | Degrade-to-lexical regression test (5 cases) |
| `mcp_server/tests/...regression-embedding-semantic-search.vitest.ts` | Created | Gate-D envelope assertion (happy path unchanged) |

### Follow-Ups

- Old-contract callers. Any caller that previously caught the embedder-unavailable exception to detect an outage must now read embedder_available:false instead. The behavior is reversible (revert 484b77b589).
- Degrade quality is lexical-only. During an embedder outage, recall runs on BM25/FTS/graph without the dense channel, so semantic recall quality is reduced until the embedder returns. This is the intended downgrade, not a defect.
