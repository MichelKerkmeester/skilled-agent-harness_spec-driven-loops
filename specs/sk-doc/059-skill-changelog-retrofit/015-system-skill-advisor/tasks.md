---
title: "Tasks: Phase 15: system-skill-advisor changelogs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "system-skill-advisor changelog rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: system-skill-advisor changelogs

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm phase 001 records the operator's style approval: approved with fixes, 2026-09-24
- [x] T002 Confirm the system-skill-advisor files are clean in git before the run (`../scratch/lists/system-skill-advisor.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the driver over the list: 12 of 12 kept, 3 of them in their first run with no send-back
- [x] T004 Retry every failed or overturned file from its kept draft until each is kept or recorded: 12 of 12 kept
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun the checker with `--old` and `hvr_scan.py` over every kept file: `wave-verify.cjs` reports 12 kept, 0 problems
- [x] T006 Read every kept file old beside new in an Opus review, and send each confirmed finding back for a retry: 12 of 12 clean, 8 send-backs across 8 files
- [x] T007 Commit the kept system-skill-advisor files only, then run `compiled-route-guard.cjs` and each mirror generator's `--check`: `d8ff1d3bc4` holds them, and the guard and all nine mirror checks exit 0 after the last skill commit
- [x] T008 Push to main and run `validate.sh --strict` on this phase: `d8ff1d3bc4` is on `origin/main`, and the phase reports `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every listed file has a pass or a recorded failure in `../scratch/state.jsonl`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tooling**: See `../001-tooling-and-pilot/`
<!-- /ANCHOR:cross-refs -->
