---
title: "Hybrid-Search Scope-Then-Limit: Resolve Filters Before Truncating"
description: "The BM25 lane applied the caller's limit before resolving spec-folder and deprecated-tier filters, so a scoped search could return fewer results than existed. It now over-fetches the candidate set with batched metadata resolution under the SQLite parameter limit, filters, then truncates."
trigger_phrases:
  - "021 hybrid search scope then limit changelog"
  - "scoped search under-returning fix"
  - "over-fetch filter then truncate"
  - "027 021 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/021-hybrid-search-scope-then-limit` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The BM25 lane of hybrid search truncated to the caller's limit before it resolved the spec-folder and deprecated-tier filters. A scoped query whose top-limit raw hits were mostly out of scope could therefore return fewer in-scope results than actually existed, or none. The lane now resolves scope first: it over-fetches the candidate set up to the document count when a scope or database filter is in play, resolves the per-candidate metadata in batches that stay under the SQLite bound-parameter limit, applies the spec-folder and tier filters, and only then truncates to the caller's limit. A scoped search with no database to resolve against returns empty early rather than over-fetching pointlessly.

### Added

- None. The fix is contained to the existing BM25 lane.

### Changed

- `lib/search/hybrid-search.ts` — the candidate limit becomes the document count when a spec-folder or database filter is present, metadata is resolved in chunked batches of 500 to stay under the SQLite parameter limit, filters are applied, then the result is sliced to the caller's limit; a scoped query with no database returns empty early

### Fixed

- Resolved the scope-then-limit ordering bug where the limit was applied before the filter, which under-returned scoped results.
- Deep-review remediation chunked the metadata lookup so an over-fetched candidate set could not exceed the SQLite parameter limit and throw.

### Verification

| Check | Result |
|-------|--------|
| Deep review | resolved after the IN()-overflow chunking remediation |
| Hybrid-search suite | PASS: held at the existing parity count, scoped queries return their real result set |
| Parameter-limit safety | PASS: chunked metadata resolution stays under the SQLite bound-parameter limit |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts` | Modified |

### Follow-Ups

- None.
