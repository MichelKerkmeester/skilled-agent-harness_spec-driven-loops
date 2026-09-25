---
title: "Tasks: Phase 4: cli-orca changelogs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-orca changelog rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: cli-orca changelogs

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
- [x] T002 Confirm the cli-orca files are clean in git before the run (`../scratch/lists/cli-orca.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the driver over the list (`../scratch/rewrite-driver.cjs --list ../scratch/lists/cli-orca.txt --state ../scratch/state.jsonl`): failed after three attempts on cli-pi
- [x] T004 Retry the failures once with `--retry-failed`, and record the reason for any that still fail: kept on cli-codex at attempt 2, then passed the strengthened fact check on a `--reverify` pass
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun the checker with `--old` and `hvr_scan.py` over every kept file: `wave-verify.cjs` reports 1 kept, 0 problems
- [x] T006 Read a sample of the kept files old beside new: the one file read in full, every change present
- [x] T007 Commit the kept cli-orca files only, then run `compiled-route-guard.cjs` and each mirror generator's `--check`: commit `d62d7a3a1a` holds the one rewrite, and the guard and all nine `sync-*.cjs --check` runs exit 0
- [x] T008 Push to main and run `validate.sh --strict` on this phase: `git branch -r --contains d62d7a3a1a` lists `origin/main`, and validation reports `RESULT: PASSED`
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
