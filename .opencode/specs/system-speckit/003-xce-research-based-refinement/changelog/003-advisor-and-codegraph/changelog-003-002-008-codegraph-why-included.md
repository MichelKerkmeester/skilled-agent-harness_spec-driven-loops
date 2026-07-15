---
title: "Changelog: 008-codegraph-why-included"
description: "Code graph blast_radius and context output gained includeTrace-gated why_included breadcrumbs while compact defaults remain unchanged."
trigger_phrases:
  - "003/002 008 codegraph why included changelog"
  - "blast radius breadcrumbs"
  - "code_graph_context includeTrace"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph`

### Summary

Code graph callers can now opt into concrete edge-chain breadcrumbs explaining why a file or context section was included. Breadcrumbs are debug-only and remain hidden from default compact payloads unless `includeTrace` is true.

### Added

- `why_included` edge-chain breadcrumbs for `blast_radius` with depth, edge chain, confidence, ambiguity state, and truncation reason.
- `graphContext[].why_included` breadcrumbs for traced context output.

### Changed

- The BFS helper retains path and truncated frontier data for trace consumers.
- Context and query handlers emit trace fields only when requested.

### Fixed

- Debug users can inspect actual traversal reasons instead of inferring inclusion from affected-file lists alone.

### Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS |
| Build | PASS |
| BFS/query/context tests | PASS: 3 files, 47 tests |
| Default-off behavior | PASS: tests verify default payloads omit `why_included` |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/graph/bfs-traversal.ts` | Modified | Path and frontier retention |
| `handlers/query.ts` | Modified | Trace-gated `why_included` for blast radius |
| `lib/code-graph-context.ts` | Modified | Trace-gated context breadcrumbs |
| `tests/*` | Modified | Trace-on and default-off coverage |

### Follow-Ups

- Public query schema exposure was outside this phase's approved write list.
