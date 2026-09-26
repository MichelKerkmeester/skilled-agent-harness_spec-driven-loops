---
title: "Tasks: Phase 16: system-spec-kit changelogs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "system-spec-kit changelog rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: system-spec-kit changelogs

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
- [x] T002 Confirm the system-spec-kit files are clean in git before the run (`../scratch/lists/system-spec-kit.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the driver over the list: 108 of 108 kept, 52 of them in their first run with no send-back
- [x] T004 Retry every failed or overturned file until each is kept or recorded: 108 of 108 kept, 21 of them restarted fresh on the Opus agent lane after their gateway drafts failed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun the checker with `--old` and `hvr_scan.py` over every kept file: `wave-verify.cjs` reports 108 kept, 0 problems
- [x] T006 Read every kept file old beside new in an Opus review, and send each confirmed finding back for a retry: 108 of 108 clean, 34 send-backs across 30 files
- [x] T007 Commit the kept system-spec-kit files only, then run `compiled-route-guard.cjs` and each mirror generator's `--check`: `7f7e8f1242` holds them, and the guard and all nine mirror checks exit 0 after the last skill commit
- [x] T008 Push to main and run `validate.sh --strict` on this phase: `7f7e8f1242` is on `origin/main`, and the phase reports `RESULT: PASSED`
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
