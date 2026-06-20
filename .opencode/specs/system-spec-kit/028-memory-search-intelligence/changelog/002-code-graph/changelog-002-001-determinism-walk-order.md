---
title: "Changelog: Code-Graph Determinism + Walk-Order (Structural Retrieval Intelligence) [002-code-graph/001-determinism-walk-order]"
description: "Chronological changelog for the Code-Graph Determinism + Walk-Order (Structural Retrieval Intelligence) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/001-determinism-walk-order` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

The code-graph context ranker now orders equal-trust edges from stable content-derived keys instead of database iteration order. The existing rank-time trust blend stays additive and `rankContextEdges` now derives baseline order from related node content, symbol identity, file path, edge type and endpoints before applying equal-score ties. The shared dual-channel fuser adapter and boost-magnitude tuning remain gated follow-ups.

### Added

- Content-derived baseline rank assignment for `rankContextEdges`, covering impact, dependency, callees and outline export results.
- Equal-score tie keys based on related content hash, symbol id, file path, edge type and endpoints.
- Level 2 phase documentation that records the shipped predecessor, local deterministic-order change and gated follow-ups.

### Changed

- `code-graph-context.ts` no longer lets database row order decide baseline rank for equal-trust context edges.
- The phase keeps the trust blend additive and leaves structural edge weights unchanged.
- The shared fuser work is recorded as an adapter problem rather than a code-graph-specific fork.

### Fixed

- Equal-score impact and dependency walks no longer inherit row-order drift after scan rebuilds.
- The phase docs distinguish shipped deterministic ordering from gated tuning and fuser work.

### Verification

- Rank-order stability - PASS
- Cross-rebuild reproducibility test - PASS
- Shared fuser adapter - NOT BUILT
- Boost-magnitude tuning benchmark - NOT BUILT
- Strict phase validation - PASS

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified | Content-derived baseline rank assignment and equal-score tie order in rankContextEdges |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Modified | Deterministic shifted-row-order impact test |
| `.opencode/specs/.../001-determinism-walk-order/{spec,plan,tasks,checklist,implementation-summary}.md` | Updated | Level-2 packet docs recording 2 DONE + 2 PENDING-with-gate |

### Follow-Ups

- Build the shared fuser adapter once code-graph has an isolation-compatible consume path.
- Tune the evidence-class boost magnitudes against a retrieval benchmark before claiming quality lift.
- No measured benefit number exists yet. The current ranking factors are an unbenchmarked default.
