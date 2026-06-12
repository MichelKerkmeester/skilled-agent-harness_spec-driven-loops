---
title: "Changelog: 007-codegraph-bfs-consolidation"
description: "Code-graph transitive traversal and blast-radius traversal now share a local BFS helper while preserving query-handler behavior."
trigger_phrases:
  - "018 007 codegraph BFS changelog"
  - "code graph BFS helper"
  - "blast radius traversal helper"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/007-codegraph-bfs-consolidation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph`

### Summary

Code graph now has one local BFS helper for both transitive symbol traversal and blast-radius traversal. The query handler still owns response mapping, warning text, truncation fields, grouping, hot-file breadcrumbs, and affected-file ordering.

### Added

- `traverseGraphBfs` helper for breadth-first queueing, visit timing, caps, dangling-neighbor collection, and depth-boundary truncation.
- Helper tests for cap, dangling, truncation, and non-result traversal behavior.

### Changed

- Transitive `calls_*` and `imports_*` queries plus blast radius now adapt graph DB data through the helper.

### Fixed

- Removed duplicated traversal mechanics while preserving public query-handler behavior.

### Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS in system-code-graph |
| Build | PASS in system-code-graph |
| BFS and query-handler tests | PASS: 2 files, 38 tests |
| Comment hygiene | PASS |
| Alignment drift | PASS: 153 files, 0 findings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/graph/bfs-traversal.ts` | Created | Shared code-graph-local BFS helper |
| `handlers/query.ts` | Modified | Transitive and blast-radius cutover |
| `tests/bfs-traversal.vitest.ts` | Created | Helper coverage |
| `007-codegraph-bfs-consolidation/*` | Updated | Phase docs and metadata |

### Follow-Ups

- No live code-graph DB or host daemon verification was run; tests used mocked/fixture data.
