---
title: "Tasks: Phase 4: citation-drift-detection"
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
# Tasks: Phase 4: citation-drift-detection

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

- [x] T001 Capture the scanner test baseline (`.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`). 39/39, exit 0
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Derive prefix redirect rules from the git rename record (`.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json`). 701 rules from 455,348 rename records, at least 50 records and 95% agreement each
- [x] T003 Add `moved` and `basename_only` results to `resolveCitation` (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`). `moved_in_range`, `moved_past_end`, `basename_only`; `dead` unchanged
- [x] T004 Add `--corpus skills|specs|all` and per-family counts (`cite-drift-scan.mjs`). `family` and `track` lines in `census.txt`
- [x] T005 Document the option and classes (`.skilled/skills/sk-doc/shared/scripts/README.md`)
- [x] T006 Add the read-only summary to `/doctor:speckit` (`.skilled/commands/doctor/_routes.yaml`, `doctor-speckit-retrieval.yaml`). opt-in step with an all, skills or skip gate; `route-validate.sh` passes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Fixture tests for each new class and the corpus filter. 45/45, exit 0
- [x] T008 Run the census with `--corpus all` twice on one commit and record it. four identical runs at `5285608745fe`, sha256 `dec373f6…` (`census.txt`)
- [x] T009 Write the phase 006 threshold proposal before reading the final census. Superseded: phase 006 was removed, so the proposal was retired (decision-record.md ADR-001)
- [x] T010 Write `implementation-summary.md` and run `validate.sh --strict`
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-007 in spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md: plan.md
- [x] CHK-003 [P1] Dependencies identified and available: the phase 002 decisions, approved by the operator
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `node --check` on `cite-drift-scan.mjs` and its test file
- [x] CHK-011 [P0] No console errors or warnings: scanner tests 45/45, exit 0 (implementation-summary.md:115)
- [x] CHK-012 [P1] Error handling implemented: an unreadable or malformed redirect table throws a named error, and a test covers it (`test-cite-drift-scan.mjs:462`)
- [x] CHK-013 [P1] Code follows project patterns: new options follow the existing `parseArgs` pattern; the default output is unchanged (implementation-summary.md:117)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: six met and AC-006 superseded by ADR-001 (acceptance-criteria.md:62)
- [x] CHK-021 [P0] Manual testing complete: eight moved entries drawn at random were checked by hand (implementation-summary.md:121)
- [x] CHK-022 [P1] Edge cases tested: basename-only, ambiguous and past-end classes each have a test
- [x] CHK-023 [P1] Error scenarios validated: a `.env` target is refused and makes no call (implementation-summary.md:119)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: not applicable: this phase builds a feature and fixes no review finding
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.: not applicable: no defect class was fixed
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.: consumers are the phase 005 helper, which imports the resolver, and the speckit-retrieval doctor step
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.: not applicable: no security fix; the resolver keeps its refused check for ignored and `.env` paths
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.: three corpora, four identical runs (implementation-summary.md:116)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.: not applicable: the default scan reads no environment variable
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.: census pinned to `5285608745fe` (implementation-summary.md:116); evidence is the uncommitted diff on `5285608745fe`; the commit is held by root D4
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: a pattern scan of the whole program diff found none
- [x] CHK-031 [P0] Input validation implemented: the redirect table is shape-checked before use
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: spec, plan and tasks describe the same build
- [x] CHK-041 [P1] Code comments adequate: comments state the why and carry no packet labels
- [x] CHK-042 [P2] README updated (if applicable): `shared/scripts/README.md` documents `--corpus` and `--moved`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: the doctor summary sample is in `scratch/`; the census file is a deliverable
- [x] CHK-051 [P1] scratch/ cleaned before completion: kept on purpose: `scratch/doctor-citation-summary.md` is cited as evidence
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



