---
title: "Changelog: Memory MCP Graceful Embedder Degrade to Lexical [001-speckit-memory/004-graceful-degradation]"
description: "Chronological changelog for the Memory MCP graceful embedder-degrade to lexical phase."
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

Memory recall now degrades to lexical search when the embedder is unavailable. A null or empty embedding no longer collapses Stage 1 into an empty result set. The pipeline falls back to BM25 and FTS, carries explicit metadata that the dense channel was skipped and leaves the successful embedding path unchanged.

### Added

- Added `embedder_available` and `vector_search_skipped` to Stage 1 metadata.
- Added handler-level response plumbing for the degrade flags.
- Added targeted degrade-to-lexical tests.

### Changed

- Routed null and empty embeddings into lexical candidate generation instead of throwing.
- Preserved the happy path and cache behavior for successful embeddings.
- Propagated real input errors as typed Stage 1 input errors.

### Fixed

- Prevented embedder outages from being swallowed into empty recall results.

### Verification

- TypeScript and build: PASS.
- Search and pipeline suite: PASS, 440 tests.
- Degrade-to-lexical test file: PASS, 5 cases.
- Happy-path envelope assertion: PASS.
- Independent adversarial review: SHIP.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modified | Degrades missing embeddings to lexical search and preserves typed input failures |
| `mcp_server/lib/search/pipeline/types.ts` | Modified | Adds degrade metadata to Stage 1 output |
| `mcp_server/handlers/memory-search.ts` | Modified | Returns degrade metadata to callers |
| `mcp_server/tests/stage1-embedder-degrade.vitest.ts` | Created | Covers lexical fallback and flag behavior |
| `mcp_server/tests/...regression-embedding-semantic-search.vitest.ts` | Created | Guards the successful embedding path |

### Follow-Ups

- Callers that used an embedder exception as the outage signal should read the metadata flag instead.
- Recall quality during an outage is lexical-only until the embedder recovers.
