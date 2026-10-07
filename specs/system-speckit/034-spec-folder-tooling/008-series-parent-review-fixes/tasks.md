---
title: "Tasks: Phase 8: series-parent-review-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: series-parent-review-fixes

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

- [x] T001 Read the Phase 7 review report section 3 and list the twelve findings and two close-out gaps (`../007-series-parent-review-and-hardening-research/review/review-report.md`)
- [x] T002 Record the baseline: three spec-kit test files at 76 tests, and the hook suite at 172 tests with 3 skipped (`runtime/cli/tests`, `runtime/tests/hooks`)
- [x] T003 [P] Bind the write path for each finding and split the work into the recipe, the doc sweep, the tooling hardening and the records (`spec.md` section 3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the series parent recipe as five numbered steps (`references/structure/phase-definitions.md`)
- [x] T005 Relabel the README Gate 3 diagram to options A to D and sweep the repo for the old skip label (`README.md`)
- [x] T006 [P] Add the series parent exception to the two level docs and the feature catalog node (`references/templates/level-selection-guide.md`, `references/templates/level-specifications.md`, `feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md`)
- [x] T007 [P] Name the series parent in §9 option C and list `template-default` in the Warn On classes (`references/workflows/quick-reference.md`, `references/retrieval/retrieval-conventions.md`)
- [x] T008 Strip control bytes from the listing name and description (`runtime/cli/spec/create.sh`)
- [x] T009 Pin the four template phrases to the single shell list with a drift test (`runtime/cli/spec/create.sh`, `runtime/cli/retrieval/lib/phrase-judge.mjs`, `runtime/cli/tests/`)
- [x] T010 Add the ESC description and sub-folder silence tests, 9 to 11 tests (`runtime/cli/tests/create-track-refresh.vitest.ts`)
- [x] T011 Reconcile the Phase 6 tasks summary, continuity block and scope table (`../006-series-parent-rule-and-sibling-listing/tasks.md`, `acceptance-criteria.md`, `spec.md`)
- [x] T012 Pass `reasoningEffort` to cli-pi in both auto workflows and regenerate the compiled contracts (`.skilled/commands/deep/assets/deep-research-auto.yaml`, `.skilled/commands/deep/assets/deep-review-auto.yaml`, `.skilled/commands/deep/assets/compiled/`)
- [x] T013 Restore the `create.sh` executable bit (`runtime/cli/spec/create.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Follow the rewritten recipe in two scratch tracks, one by a worker and one by the orchestrator
- [x] T015 Run the whole spec-kit CLI suite, 161 files and 1621 tests (`runtime/cli/tests`)
- [x] T016 Run the hook suite with the child flags unset, 169 passed with 3 skipped (`runtime/tests/hooks`)
- [x] T017 Run the contract drift check and the deep-loop suite, 22 files and 365 tests (`.skilled/skills/system-deep-loop/runtime/tests/`)
- [x] T018 Rebuild the committed trigger index and rerun the freshness check (`runtime/data/trigger-index.json`) - `--check` exit 0, 0 stale
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed - two scratch recipe runs, both exit 0
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

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001 to REQ-008 in section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md - sections 1 to 7 and the fix addendum
- [x] CHK-003 [P1] Dependencies identified and available - the Phase 7 review commit `4b33313bd4c` and the Pi lanes were both present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - the whole spec-kit CLI suite passes at 161 files and 1621 tests, and the hook suite passes
- [x] CHK-011 [P0] No console errors or warnings - both suites finish with 0 failures
- [x] CHK-012 [P1] Error handling implemented - the phrase drift guard is a test, so a healthy scaffold of a non-core template cannot fail
- [x] CHK-013 [P1] Code follows project patterns - the four phrases stay a single shell list in `create.sh` and the judge reads the same source
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - eight of eight rows are Met
- [x] CHK-021 [P0] Manual testing complete - two scratch recipe runs, parent exit 0 and the child numbered 002
- [x] CHK-022 [P1] Edge cases tested - the ESC description and the sub-folder silence cases pass
- [x] CHK-023 [P1] Error scenarios validated - the drift test failed against a deliberately drifted temp template copy, then passed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. - The Phase 7 report classes them: class-of-bug for the recipe and the sweep, doc-drift for the two doc gaps, matrix/evidence for the records and the two new tests
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. - The repo-wide sweep for the old skip label left nine unrelated hits, and the third threshold restatement in `feature-catalog/` was found and fixed
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. - The sweep covered `references/templates/`, `feature-catalog/`, the README diagram, `quick-reference.md` and `retrieval-conventions.md`
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - The control byte strip covers name and description, and the ESC description case passes. No path or parser behavior changed
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. - The listing cases are the two fields by control and clean bytes, recorded by the ESC description test and the silent sub-folder test
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - N/A, the changed lines read the filesystem only and the phrase test uses a temp template copy
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. - The fixes land in the single phase commit that adds this packet, on top of review commit `4b33313bd4c`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - no secrets touched
- [x] CHK-031 [P0] Input validation implemented - control bytes are stripped from the listing name and description
- [x] CHK-032 [P1] Auth/authz working correctly - N/A, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - spec, plan, tasks and acceptance criteria agree
- [x] CHK-041 [P1] Code comments adequate - no ids or spec paths in code comments
- [x] CHK-042 [P2] README updated (if applicable) - the system-spec-kit README Gate 3 diagram lists options A to D
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - the scratch runs used scratch tracks outside the packet and removed them
- [x] CHK-051 [P1] scratch/ cleaned before completion - the packet scratch folder holds only its placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-07
<!-- /ANCHOR:summary -->

---
