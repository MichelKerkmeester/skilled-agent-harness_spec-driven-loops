---
title: "Causal Traversal BFS: One Shared App-Level Walk Replaces Two Recursive CTEs"
description: "Two recursive-CTE graph traversals whose join condition defeated SQLite index use were replaced by a single shared app-level BFS helper. Same traversal results, fewer full scans, no behavior-facing change."
trigger_phrases:
  - "012 causal traversal bfs changelog"
  - "recursive cte replaced bfs"
  - "graph traversal index regression"
  - "027 012 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

Two recursive-CTE graph traversals in the causal-boost and memo read paths shared a join shape that defeated index use, so each walk fell back to repeated full scans as the graph grew. Both call sites now route through a single shared app-level BFS helper that walks the same edges with the same visit semantics. Traversal results are identical to the recursive-CTE output, including multi-root fan-in, and the walk no longer depends on the planner choosing an index it was never going to choose. This is an internal performance refactor with no caller-visible change to ranking, ordering, or response shape.

### Added

- `lib/graph/bfs-traversal.ts` — shared breadth-first traversal helper used by the causal-boost and memo read paths

### Changed

- `lib/search/causal-boost.ts` — causal-edge expansion calls the shared BFS helper instead of an inline recursive CTE
- `lib/storage/memo.ts` — memo dependency walk calls the shared BFS helper instead of an inline recursive CTE

### Fixed

- Deep-review remediation restored multi-root CTE parity in the shared helper and de-flaked the latency regression test that compared BFS against the old CTE timing.

### Verification

| Check | Result |
|-------|--------|
| Deep review | CONDITIONAL on first pass, resolved after remediation |
| Traversal parity | PASS: BFS output byte-identical to recursive-CTE output, including multi-root fan-in |
| Latency regression | PASS after de-flake |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memo.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts` | Created |

### Follow-Ups

- None. The shared BFS helper is the single traversal path for both read sites.
