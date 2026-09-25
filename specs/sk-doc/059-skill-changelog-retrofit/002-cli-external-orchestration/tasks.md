---
title: "Tasks: Phase 2: cli-external-orchestration changelogs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-external-orchestration changelog rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: cli-external-orchestration changelogs

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
- [x] T002 Confirm the cli-external-orchestration files are clean in git before the run (`../scratch/lists/cli-external-orchestration.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the driver over the list on the Luna lanes: 101 of 112 kept in the main run
- [ ] T004 Retry every failure from its kept draft with `--retry-failed` until each is kept or recorded: in progress, 55 of 112 kept under the current fact check
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Rerun the checker with `--old` and `hvr_scan.py` over every kept file
- [ ] T006 Read every kept file old beside new in an Opus review, and send each confirmed finding back for a retry: 44 of 55 kept files clean so far, 31 passes overturned
- [ ] T007 Commit the kept cli-external-orchestration files only, then run `compiled-route-guard.cjs` and each mirror generator's `--check`
- [ ] T008 Push to main and run `validate.sh --strict` on this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every listed file has a pass or a recorded failure in `../scratch/state.jsonl`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tooling**: See `../001-tooling-and-pilot/`
<!-- /ANCHOR:cross-refs -->
