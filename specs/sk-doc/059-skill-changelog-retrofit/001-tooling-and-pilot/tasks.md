---
title: "Tasks: Phase 1: tooling and pilot"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "changelog retrofit tasks"
  - "changelog pilot tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: tooling and pilot

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

- [x] T001 Enumerate the skill changelogs and split the failing ones into per-skill lists (`../scratch/lists/`)
- [x] T002 Write the shape checker and calibrate it on the exemplar, the 25 compliant files and legacy files (`../scratch/check_changelog_shape.py`)
- [x] T003 [P] Write the rewrite and fact-check briefs (`../scratch/brief-rewrite.md`, `../scratch/brief-verify.md`)
- [x] T004 Write the driver (`../scratch/rewrite-driver.cjs`)
- [x] T005 Smoke-test GPT-6 Luna on cli-pi and cli-codex
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Pilot run 1, stopped once its flaws showed (`../scratch/attempt-1/`)
- [x] T007 Fix empty sections, the major-bump rule and filler in the briefs, the checker and the driver
- [x] T008 Pilot run 2 over the ten files (`../scratch/pilot-state.jsonl`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the checker, the HVR scan and the frontmatter comparison on the six passes
- [x] T010 Confirm the four failures equal their originals and their drafts are kept (`../scratch/failed/`)
- [x] T011 Read all ten old beside new and report the style to the operator
- [x] T012 Record the operator's style approval: approve with fixes, 2026-09-24
- [x] T013 Settle the retry policy: three attempts per file (`../scratch/rewrite-driver.cjs`)
- [x] T014 Apply the approved fixes: one-sentence H4 and repeated-sentence checks in the checker, both briefs tightened
- [x] T015 Check run over the four restored files and sk-design v2.0.0.0 (`../scratch/check-list.txt`, `../scratch/state.jsonl`): mcp-tooling kept, four restored
- [x] T016 Fix what the check run exposed: whole-file writes in the rewrite brief, and a retry that resumes from the kept draft (`../scratch/rewrite-driver.cjs`)
- [x] T017 Remove the two design-bundle files from the sk-design list, and accept only version-named files in the driver
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every row of `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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
- [x] CHK-003 [P1] Dependencies identified and available: both CLIs replied to a GPT-6 Luna smoke test
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The checker and the driver run to completion without errors: pilot run 2 finished with `finished: true`
- [x] CHK-011 [P1] The driver refuses the exemplar and any path that is not a skill changelog
- [x] CHK-012 [P1] No code comment carries a spec path or packet id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Checker calibration: the exemplar exits 0 and 25 of 25 compliant files pass
- [x] CHK-021 [P0] The six pilot passes rerun clean: checker exit 0, 0 HVR hard blockers, frontmatter unchanged
- [x] CHK-022 [P0] The four pilot failures show no `git diff` and each has a draft in `../scratch/failed/`
- [x] CHK-023 [P0] Every pilot file read old beside new by the orchestrator
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Each pilot-run-1 flaw traced to its producer: the briefs for empty sections and the major-bump rule, the checker for empty sections, the driver for padding feedback
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in the briefs, the driver or the run logs
- [x] CHK-031 [P1] Fact-check dispatches run without write access
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary files live in `../scratch/` only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-24
<!-- /ANCHOR:summary -->
