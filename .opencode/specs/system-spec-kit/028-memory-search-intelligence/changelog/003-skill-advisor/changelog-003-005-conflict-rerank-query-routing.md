---
title: "Changelog: Skill Advisor Conflict Rerank, Query-Class Routing and Semantic Exact Rerank"
description: "Chronological changelog for the Skill Advisor conflict rerank, query-class routing and semantic exact-rerank phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

Three routing refinements shipped as default-off scorer seams. Conflict demotion is preserved outside the RRF lane sum, query-class routing can apply class-specific lane multipliers only under its flag and exact semantic rerank can reorder a bounded fused head only when both RRF and the exact-rerank flag are enabled. With flags disabled, the live scorer stays byte-identical and packet 030 was not touched. Live promotion still needs conflict data, held-out routing evidence and recall or benchmark acceptance.

### Added

- Added a conflict-demotion counter and deterministic post-fusion conflict demotion path.
- Added a default-off query-class router that feeds class multipliers through effective scorer weights.
- Added a default-off exact semantic rerank for the fused top set.
- Added scorer tests covering default-inert behavior, bounded rerank behavior and explicit-author dominance.

### Changed

- Kept every ranking refinement behind a flag, with no default or live routing flip.
- Reused the RRF spine instead of creating a parallel semantic rerank path.
- Updated docs and verification tables to distinguish implemented seams from pending live-promotion gates.

### Fixed

- Conflict mass is now retained as a comparator demotion rather than being lost in the RRF path.
- Query-class routing preserves explicit-author dominance after multipliers are applied.
- Exact semantic rerank bypasses the normal cutoff only for requested top-set skills and only inside a bounded score window.

### Verification

| Check | Result |
|-------|--------|
| Baseline typecheck | PASS, 0 errors |
| Baseline broad Vitest | PASS, 17 files, 123 passed, 2 skipped |
| Patched typecheck | PASS, 0 errors |
| Patched broad Vitest | PASS, 18 files, 127 passed, 2 skipped |
| Comment hygiene | PASS |
| Alignment drift | PASS, 291 files scanned |
| Live MCP benchmark, reindex, scan or schema migration | NOT RUN, explicitly out of scope |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Updated | Default-off implementation state and live gates |
| `plan.md` | Updated | Gate-first promotion plan |
| `tasks.md` | Updated | Implemented seams checked, live evidence gates left open |
| `checklist.md` | Updated | Verification evidence |
| `implementation-summary.md` | Updated | Final closeout |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | Conflict demotion, query-class multipliers and exact-rerank comparator |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Modified | Exact subset cosine scoring |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts` | Modified | Conflict demotion counter |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/conflict-query-rerank.vitest.ts` | Created | Deterministic unit coverage for the three seams |

### Follow-Ups

- Re-check live conflict-edge data before promoting conflict demotion.
- Run the held-out routing-quality benchmark before enabling query-class routing by default.
- Capture benchmark and recall evidence before any exact semantic rerank default flip.
