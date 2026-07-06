---
title: "Changelog: Skill Advisor RRF Determinism Spine"
description: "Chronological changelog for the Skill Advisor RRF determinism spine phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/001-rrf-determinism-spine` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

The Skill Advisor now has a default-off RRF fusion path. The live weighted-sum scorer stays byte-stable unless `SPECKIT_ADVISOR_RRF_FUSION=true`. When enabled, the advisor imports the shared Memory RRF primitive, adapts scorer lanes into fixed-order ranked lists, uses `ADVISOR_RRF_K = 8` and applies the shared RRF order as the final post-bonus tiebreak. Graph conflict mass is preserved outside RRF as a comparator demotion, so the import does not erase signed conflict suppression when conflict data later exists.

### Added

- Added the opt-in advisor RRF lane adapter around the shared `fuseResultsMulti` primitive.
- Added an advisor-specific RRF rank map for deterministic post-bonus tie handling.
- Added a conflict demotion carrier so signed graph conflict mass survives the rank-fusion path.

### Changed

- Kept the default scorer path unchanged while routing the flagged path through shared RRF.
- Split graph causal output into positive and conflict-aware views so RRF receives only positive ranked evidence.
- Updated the phase docs to record that the live flip still needs a routing-agreement benchmark.

### Fixed

- Replaced fragile weighted-sum tie behavior in the flagged path with fixed-order rank fusion.
- Proved repeated inputs return the same recommendation order.
- Preserved conflict demotion as an order change, not a drop from the candidate set.

### Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS, 0 errors |
| Focused scorer test | PASS, `rrf-determinism-spine.vitest.ts` |
| Broad scorer suite | PASS, 11 files, 72 passed, 2 skipped |
| Phase validation | PASS after structure fixes |
| Live/default flip | NOT RUN, benchmark gate remains pending |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Updated | Final default-off status and benchmark gate |
| `plan.md` | Updated | Shared-RRF import path and conflict-demotion carrier |
| `tasks.md` | Updated | Implemented work and remaining live gate |
| `checklist.md` | Updated | Verification evidence |
| `implementation-summary.md` | Updated | Closeout narrative |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | Opt-in RRF fusion and deterministic tiebreak |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` | Modified | Positive and conflict-aware graph outputs |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/rrf-determinism-spine.vitest.ts` | Created | Determinism and conflict-demotion coverage |

### Follow-Ups

- Capture the routing-agreement benchmark before any live/default RRF flip.
- Re-check live conflict data before treating the conflict carrier as behaviorally active.
- Keep downstream query-class routing and exact semantic rerank work in their sibling phases.
