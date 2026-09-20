---
title: "Tasks: Phase 43: v4-root-readme"
description: "Task breakdown and verification checklist for root README.md improvements and bloat removal."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "readme tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 43: v4-root-readme

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
## Phase 1: Setup & Structural Fixes

- [x] T001 Audit current `README.md` structure against `sk-create-readme` general shape (`README.md`)
- [x] T002 Fix header hierarchy: single H1 with blockquote tagline and clean badge layout (`README.md` lines 1-3)
- [x] T003 Remove invisible Unicode wide spaces from summary table (`README.md` lines 9-16)
- [x] T004 Re-home Git Worktree & Live Sync out of Code Mode MCP to its own feature section (`README.md` line 912)
- [x] T005 Move misplaced `stress-test/` paragraph from `/create:*` commands to runtime verification notes (`README.md` line 253)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Factual Content & Inventory Reconciliations

- [x] T006 Populate answers for the two empty FAQ entries: MCP tools and feature catalog (`README.md` lines 1013-1019)
- [x] T007 Correct agent network section: list exactly the 12 agents, eliminating the duplicate context entry (`README.md` lines 637-692)
- [x] T008 Add `sk-vision` and `sk-communication` to the skills library and stack customization tables (`README.md` lines 628-636 and 937-938)
- [x] T009 Purge stale v3 migration notes, outdated cutoff dates, and legacy `/doctor:mcp_install` references (`README.md` lines 856, 865, 1076)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Linguistic Polish & Verification

- [x] T010 Perform Human Voice Rules pass: replace semicolons in prose with periods/conjunctions (`README.md`, hvr_scan.py 0 hard blockers)
- [x] T011 Remove Oxford commas and replace blocked terms like "harness" in prose (`README.md`, hvr_scan.py exit 0)
- [x] T012 Validate `README.md` with `validate_document.py` (0 issues, exit 0)
- [x] T013 Verify with `hvr_scan.py` and document delta (`README.md`, 90/100 ceiling, 0 hard blockers)
- [x] T014 Update parent `specs/system-speckit/033-system-speckit-v4/spec.md` Phase 43 map row (`specs/system-speckit/033-system-speckit-v4/spec.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T014 marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Document validation and spec validation passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in `spec.md` (spec.md lines 118-135)
- [x] CHK-002 [P0] Technical approach defined in `plan.md` (plan.md lines 32-34)
- [x] CHK-003 [P1] Dependencies identified and available (plan.md lines 110-114)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Content & Formatting Quality

- [x] CHK-010 [P0] Single H1 with blockquote tagline present in `README.md` (README.md lines 1-3)
- [x] CHK-011 [P0] Zero empty FAQ questions remaining in `README.md` (README.md lines 979-1021)
- [x] CHK-012 [P0] Exactly 12 agents listed with zero duplicate context entries (README.md lines 637-692; `.skilled/agents/` holds 12 .md files)
- [x] CHK-013 [P0] All 13 skills represented in library and customization tables (README.md lines 543-634 and 925-940)
- [x] CHK-014 [P1] Git Worktree section unnested from Code Mode MCP (README.md line 912, own `###` section)
- [x] CHK-015 [P1] Zero stale v3 migration notes or legacy cutoff dates (README.md doctor section line 856; only remaining `v3.x` string is the current changelog filename at line 1076)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing & Validation Checklist

- [x] CHK-020 [P0] `validate_document.py README.md` exits 0 with 0 issues (`python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py README.md` -> `VALID`, `Total issues: 0`)
- [x] CHK-021 [P0] `hvr_scan.py README.md` reports 0 hard semicolons in prose (`python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py README.md` -> 0 hard blockers, 90/100 ceiling, exit 0)
- [x] CHK-022 [P0] `validate.sh specs/system-speckit/033-system-speckit-v4/043-v4-root-readme --strict` passes (`validate.sh --strict`)
- [x] CHK-023 [P1] Parent phase map updated in `specs/system-speckit/033-system-speckit-v4/spec.md` (`specs/system-speckit/033-system-speckit-v4/spec.md`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: class-of-bug across documentation structure, currency, and voice.
- [x] CHK-FIX-002 [P0] Scope isolated to `README.md` and spec packet documentation.
- [x] CHK-FIX-003 [P0] Verified no runtime scripts or commands are broken or altered.
- [x] CHK-FIX-004 [P1] Verification commands pinned to local python tools and validate.sh.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, tokens, or credentials in `README.md`
- [x] CHK-031 [P0] Links use verified public or relative paths
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, and acceptance criteria synchronized across packet
- [x] CHK-041 [P1] Parent `spec.md` Phase Documentation Map updated for Phase 43
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary files contained in `scratch/` only
- [x] CHK-051 [P1] Scratch folder clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-20
<!-- /ANCHOR:summary -->

---
