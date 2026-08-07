---
title: "DFIDF cold start cache"
description: "The advisor corpus DF/IDF module computed document frequencies from scratch on every cold start. This phase adds a persisted cache keyed by graph-metadata source mtimes so unchanged corpus stats can be reused without recomputation."
trigger_phrases:
  - "dfidf cold start cache"
  - "corpus stats cache"
  - "018 dfidf follow-on"
  - "DFIDF cache reuse"
  - "corpus mtime invalidation"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/024-dfidf-cold-start-cache` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The advisor corpus DF/IDF module computed document frequencies and IDF values from the provided corpus every time without any persisted cache. This phase adds an explicit cache API keyed by graph-metadata source mtimes so unchanged cold-start corpus stats can be reused. Callers that continue to use `computeCorpusStats()` still compute directly by design.

### Added

- Persisted DF/IDF corpus cache API in the advisor corpus module, keyed by graph-metadata source mtimes.
- Test coverage for cache reuse and mtime-based cache invalidation.

### Changed

- None.

### Fixed

- None.

### Verification

- Focused packet tests - PASS: relevant focused Vitest and syntax checks passed.
- Full advisor Vitest - PASS: 54 files passed, 371 passed, 4 skipped.
- Strict validation - PASS: all new packet folders passed strict validation.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/corpus/df-idf.ts` | Modify | Add persisted cache API and optional updater cache integration. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/cache/df-idf-cache.vitest.ts` | Create | Cover cache reuse and mtime invalidation. |

### Follow-Ups

- The cache API is explicit, callers that keep using `computeCorpusStats()` continue to compute directly by design.
