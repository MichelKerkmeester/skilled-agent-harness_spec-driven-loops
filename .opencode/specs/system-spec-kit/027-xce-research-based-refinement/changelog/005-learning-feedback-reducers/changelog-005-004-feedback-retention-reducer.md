---
title: "Learning Feedback Reducers 004: Feedback Retention Reducer and Narrow Edge Floor"
description: "Added a triple-gated feedback retention reducer (default-off, dry-run, shadow, active) and a narrow edge-floor helper. Shadow mode writes governance audit rows without changing retention state. Active mode requires the master flag, active mode enum, and external shadow-evaluation evidence."
trigger_phrases:
  - "005 retention reducer changelog"
  - "feedback retention reducer"
  - "SPECKIT_FEEDBACK_RETENTION_LEARNING"
  - "edge-tier-basement"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/004-retention-reducer` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers`

### Summary

This leaf added `feedback-retention-reducer.ts` and `edge-tier-basement.ts`. The retention reducer issues `delete`, `extend`, and `protect` decisions from aggregated feedback summaries under a three-gate safety model: the master `SPECKIT_FEEDBACK_RETENTION_LEARNING` flag must be on, the mode must be `active`, and the caller must supply shadow-evaluation evidence before any retention row is mutated. Shadow mode writes `feedback_retention_learning` audit rows to the existing `governance_audit` table without touching retention state. Dry-run mode returns decisions without any writes. Auto-derived edges are excluded from the edge floor helper.

### Added

- `mcp_server/lib/feedback/feedback-retention-reducer.ts` with `delete`, `extend`, and `protect` decision paths under the triple-gate model.
- `mcp_server/lib/feedback/edge-tier-basement.ts` with a narrow edge-floor helper that imports `STATE_LIMITS` and excludes auto-derived edges.
- `SPECKIT_FEEDBACK_RETENTION_LEARNING` master flag and `SPECKIT_FEEDBACK_RETENTION_MODE` mode enum in `ENV_REFERENCE.md`.
- `mcp_server/tests/feedback-retention-reducer.vitest.ts` and `mcp_server/tests/memory-retention-feedback-learning.vitest.ts` covering all gating permutations, dry-run immutability, shadow audit-only behavior, constitutional immunity, and narrow edge-floor scope.

### Changed

- `mcp_server/ENV_REFERENCE.md`: added two new flag rows for the retention reducer. No existing rows were modified.

### Fixed

- None.

### Verification

- `npx vitest run tests/feedback-retention-reducer.vitest.ts tests/memory-retention-feedback-learning.vitest.ts`: 2 files, 12 tests passed.
- `npx vitest run tests/memory-retention-sweep.vitest.ts tests/batch-learning.vitest.ts`: 2 files, 82 tests passed.
- `npm run build`: exited 0.
- `validate.sh --strict` on the child spec folder: exited 0.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-retention-reducer.ts` | New file: triple-gated feedback retention reducer. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/edge-tier-basement.ts` | New file: narrow edge-floor helper (manual and constitutional edges only). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/feedback-retention-reducer.vitest.ts` | New file: gating, dry-run, shadow, and active apply tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-feedback-learning.vitest.ts` | New file: retention sweep integration and constitutional immunity tests. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Added `SPECKIT_FEEDBACK_RETENTION_LEARNING` and `SPECKIT_FEEDBACK_RETENTION_MODE` rows. |

### Follow-Ups

- Active retention changes require external shadow-evaluation evidence to be supplied by callers; this gate has no automated bypass path.
- Shadow audits should be reviewed before considering any transition to active mode in production.
