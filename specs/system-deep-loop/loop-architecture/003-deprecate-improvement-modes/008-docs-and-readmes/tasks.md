---
title: "Tasks: Phase 8: docs-and-readmes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "docs and readmes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: docs-and-readmes

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

- [x] T001 Fix the file list (`scratch/files.txt`)
- [x] T002 Write the work-unit briefs (`scratch/brief-*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 WU1: Root README, env examples, benchmark READMEs, changelog and hub version (`scratch/brief-wu1.md`)
- [x] T004 WU2: `BARTER.md` on main: backup, then remove the retired command row (orchestrator, on main)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 No live run instruction for either command
- [x] T006 No link into the deleted packet
- [x] T007 Changelog file present
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Checks match or beat the baseline
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 and REQ-002 in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` WU1 and the orchestrator BARTER step
- [x] CHK-003 [P1] Dependencies identified and available — Phase 007 complete
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — Docs only; changelog frontmatter parses
- [x] CHK-011 [P0] No console errors or warnings — N/A: docs only
- [x] CHK-012 [P1] Error handling implemented — N/A: no code
- [x] CHK-013 [P1] Code follows project patterns — Changelog follows the `v1.5.3.0.md` shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 and AC-002 Met
- [x] CHK-021 [P0] Manual testing complete — Orchestrator reran every search
- [x] CHK-022 [P1] Edge cases tested — Live env variable with a stale comment kept and corrected
- [x] CHK-023 [P1] Error scenarios validated — N/A: no error path
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — instance-only: doc mentions
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — Repo-wide link search finds no link into deleted paths
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — Env variable consumers checked before deletion
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A: no security, path or parser fix
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — N/A: no matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A: no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Tree `2c1452142` to tree `334ecd39c`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — No secrets
- [x] CHK-031 [P0] Input validation implemented — N/A
- [x] CHK-032 [P1] Auth/authz working correctly — N/A
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec, plan, tasks and summary agree
- [x] CHK-041 [P1] Code comments adequate — N/A: no code comments
- [x] CHK-042 [P2] README updated (if applicable) — Root and benchmark READMEs updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — Brief and file list kept in `scratch/`
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds only the brief and file list
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-10
<!-- /ANCHOR:summary -->

---



