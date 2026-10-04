---
title: "Tasks: Phase 8: context-type-hardening"
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
# Tasks: Phase 8: context-type-hardening

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

- [x] T001 Write `measurement-protocol.md`: matrix axes, off-list set, model brief, docs per model, seed and thresholds (`measurement-protocol.md`): fixed at 12:22Z, sha256 `9dde5cd11e235d2b…`
- [x] T002 Enumerate every generator that seeds `contextType` or `importance_tier`: 90 seeds in `scratch/generator-seeds.json`
- [x] T003 [P] Confirm each CLI executor answers before dispatch: cli-devin, cli-codex, cli-opencode: codex OAuth logged in, `opencode providers list` shows OpenCode Go, `devin` on PATH
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build the planted matrix from the protocol seed (`scratch/matrix/`): 1,188 rows, built in `$TMPDIR` by `scratch/matrix.py`
- [x] T005 Run both warnings over the matrix and the corpus, and record recall, precision and false alarms: matrix 100%/100% both; corpus 0 warnings over 22,754 docs
- [x] T006 Run the three model writers on the fixed brief and record off-list rates with intervals: 30 docs, `scratch/model-writers-result.json`
- [x] T007 Fix each measured defect at its source with a regression test: no defect measured, so nothing to fix
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the D1 comparison so no packet changes its validation result: not triggered: the protocol reruns D1 only after a fix
- [x] T009 Rerun the affected test suites: `vitest --project cli` 160 files, 1,670 passed, 0 failed
- [x] T010 Write the implementation summary, with the command behind every number: every number names its script
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (no code changed)
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented (no code changed)
- [x] CHK-013 [P1] Code follows project patterns (no code changed)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (7/7 Met)
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested (27 axis combinations per value)
- [x] CHK-023 [P1] Error scenarios validated (failed Devin runs kept and rerun)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (no finding)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (no finding)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (no changed helper)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (no parser change)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (44 values x 3 x 3 x 3 = 1,188)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (not applicable: no code change)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (no fix commit)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (no code changed)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (no code changed)
- [x] CHK-042 [P2] README updated (if applicable) (not applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion (scratch holds the measurement evidence, kept on purpose; the matrix fixtures lived in $TMPDIR)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---



