

---
title: "Changelog: DFIDF cold start cache"
description: "Chronological changelog for the DFIDF cold start cache phase."
trigger_phrases:
  - "018 dfidf follow-on"
  - "dfidf cold start cache"
  - "corpus stats cache"
  - "phase changelog"
  - "nested changelog"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/024-dfidf-cold-start-cache` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The advisor corpus DF/IDF module computed document frequencies and IDF values from the provided corpus every time. No persisted cache existed under advisor database scope, so unchanged cold starts had no reusable side-file. The fix adds a persisted cache API keyed by graph-metadata source mtimes so unchanged cold-start corpus stats can be reused.

### Added

- Persisted cache API added to df-idf.ts with optional updater cache integration.
- Cache reuse and mtime invalidation test coverage added in df-idf-cache.vitest.ts.

### Changed

- None.

### Fixed

- None.

### Verification

- Focused packet tests - PASS: relevant focused Vitest and syntax checks passed.
- Full advisor Vitest - PASS: 54 files passed, 371 tests passed, 4 skipped.
- Strict validation - PASS: all new packet folders passed strict validation.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/corpus/df-idf.ts` | Modify | Persisted cache API with optional updater cache integration. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/cache/df-idf-cache.vitest.ts` | Create | Cache reuse and mtime invalidation test coverage. |

### Follow-Ups

- The cache API is explicit; callers that keep using computeCorpusStats() continue to compute directly by design.
