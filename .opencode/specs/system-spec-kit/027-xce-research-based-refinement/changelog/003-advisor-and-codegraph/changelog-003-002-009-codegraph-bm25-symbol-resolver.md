---
title: "Changelog: 009-codegraph-bm25-symbol-resolver"
description: "Code graph subject resolution gained default-off BM25 symbol suggestions for unresolved subjects without changing exact structural matching."
trigger_phrases:
  - "003/002 009 codegraph BM25 symbol changelog"
  - "BM25 fuzzy symbol lookup"
  - "code graph symbol resolver"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph`

### Summary

Code graph subject resolution gained an opt-in escape hatch for unresolved symbol names. Exact `symbol_id`, `fq_name`, and `name` resolution still runs first; BM25 only returns disambiguation candidates after exact matching misses.

### Added

- `symbol-bm25-resolver.ts`, a packed BM25F resolver over symbol metadata.
- Tests for field weighting, near-miss scoring, packed postings, flag parsing, exact-match byte identity, and fallback-only behavior.

### Changed

- `code-graph-db.ts` gained an additive read-only accessor for symbol fields.
- `handlers/query.ts` emits BM25 suggestions only when `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER` is enabled and exact resolution fails.

### Fixed

- Unresolved-subject callers can receive disambiguation-only suggestions without weakening structural matching.

### Verification

| Check | Result |
|-------|--------|
| Resolver/query tests | PASS: 2 files, 43 tests |
| Query/classifier suites | PASS: 3 files, 54 tests |
| Typecheck | PASS |
| Build | PASS |
| Comment hygiene and alignment drift | PASS |
| Strict validation | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/symbol-bm25-resolver.ts` | Created | Default-off BM25F symbol suggestions |
| `lib/code-graph-db.ts` | Modified | Read-only symbol field accessor |
| `handlers/query.ts` | Modified | Fallback suggestions after exact miss |
| `tests/symbol-bm25-resolver.vitest.ts` | Created | Resolver coverage |
| `tests/code-graph-query-handler.vitest.ts` | Modified | Exact-match and fallback coverage |

### Follow-Ups

- `code_graph_context` was not wired because its implementation files were outside the approved write scope.
