---
title: "Changelog: B3 Retrieval-Learning Feedback Edge [005-spec-data-quality/013-b3-retrieval-feedback-edge]"
description: "Chronological changelog for the B3 Retrieval-Learning Feedback Edge phase."
trigger_phrases:
 - "phase changelog"
 - "nested changelog"
 - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-21

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/013-b3-retrieval-feedback-edge` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Nothing is built yet. This phase is a PLANNED scaffold. The spec, plan, tasks, and checklist describe the intended impression-signal feedback edge, and no code is written. The detector module, the seam capture, and the refinement_queue table do not exist yet.

### Added

- No new additions recorded.

### Changed

- Nothing is built yet. This phase is a PLANNED scaffold. The spec, plan, tasks, and checklist describe the intended impression-signal feedback edge, and no code is written. The detector module, the seam capture, and the refinement_queue table do not exist yet.

### Fixed

- No fixes recorded.

### Verification

- Vitest detector suite - Not run, tests not written yet
- Flag-off no-op assertion - Not run, capture not written yet
- spec.md validate strict - PASS for the scaffold doc set

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Planned Modify | Add aggregate impression capture behind the default-off flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/detect-retrieval-gaps.ts` | Planned Create | Classify never-retrieved docs into recall-gap versus below-floor edges |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts` | Planned Modify | Add the refinement_queue table DDL |
| `.opencode/skills/system-spec-kit/mcp_server/tests/detect-retrieval-gaps.vitest.ts` | Planned Create | Edge-discriminator and report-only governance tests |

### Follow-Ups

- Build this retroactive automation per plan.md on the shared safe-fix engine in `026-shared-safe-fix-engine`.
- CI stays report-only. Safe-class fixes apply only under an operator-local flag and are never auto-committed.
