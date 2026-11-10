---
title: "Tasks: v4.0.0.3 release deep review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "v4.0.0.3 review tasks"
  - "deep review fan-out tasks"
  - "review synthesis tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: v4.0.0.3 release deep review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author spec, acceptance criteria and goal (`spec.md`, `acceptance-criteria.md`, `goal.md`)
- [x] T002 Write the review scope manifest from `v4.0.0.2..v4.0.0.3` (`goal-file-manifest.txt`)
- [x] T003 [P] Smoke-test the three executor routes and validate the fan-out config
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Launch `fanout-run.cjs` with three lineages at concurrency 3 (`review/orchestration-status.log`)
- [x] T005 [P] Write each lineage's focus steer (`review/lineages/*/steer.md`)
- [x] T006 Run `luna-max` (3 of 10 iterations before the early stop) (`review/lineages/luna-max/`)
- [x] T007 [P] Run `deepseek-flash-max` to 15 iterations (`review/lineages/deepseek-flash-max/`)
- [x] T008 [P] Run `swe2-max` to 10 iterations (`review/lineages/swe2-max/`)
- [x] T008a [P] Run `luna-codex` and `luna-opencode` (2 and 0 iterations before the early stop) (`review/luna-wave/lineages/`)
- [x] T009 Merge lineage registries with `fanout-merge.cjs` (both fan-outs, exit 0)
- [x] T010 Fresh Opus 5.5 high agent writes the report (`review/review-report.md`)
- [x] T010a Fresh Opus 5.5 medium agent writes the Luna stop analysis (`review/luna-halt-analysis.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Count iteration files per lineage (15, 10, 3, 2, 0)
- [x] T012 Confirm no change outside the packet (`git status --short`)
- [x] T013 Fill `implementation-summary.md`, run `validate.sh --strict`, commit and push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row in `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (route smokes replied PONG)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code is changed by this phase
- [x] CHK-011 [P0] The fan-out run ends with only lead-attributed containment advisories (packet docs and the reverted `.opencode` pin)
- [x] CHK-012 [P1] Lineage failures are retried or resumed and recorded (`review/orchestration-status.log`)
- [x] CHK-013 [P1] The run uses the official workflow scripts, not a hand-rolled loop
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Iteration counts on disk match the early stop (15, 10, 3, 2, 0)
- [x] CHK-022 [P1] Merged registry produced by `fanout-merge.cjs`
- [x] CHK-023 [P1] Report states a verdict (`review/review-report.md:13`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Findings-only phase: these items apply to the remediation packet planned from the report.

- [x] CHK-FIX-001 [P2] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-007 [P2] Evidence is pinned to the explicit range `v4.0.0.2..v4.0.0.3`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or `.env` value appears in any review artifact
- [x] CHK-031 [P0] Executors write only inside their lineage folder (runner write-containment guard)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Goal log records progress and deviations
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad, outside the repo
- [x] CHK-051 [P1] No stray files left in the packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-10-06
<!-- /ANCHOR:summary -->

---
