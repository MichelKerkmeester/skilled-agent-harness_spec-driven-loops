---
title: "Tasks: Phase 9: sk-design changelogs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design changelog rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: sk-design changelogs

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

- [ ] T001 [B] Confirm phase 001 records the operator's style approval
- [ ] T002 Confirm the sk-design files are clean in git before the run (`../scratch/lists/sk-design.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Run the driver over the list (`../scratch/rewrite-driver.cjs --list ../scratch/lists/sk-design.txt --state ../scratch/state.jsonl`)
- [ ] T004 Retry the failures once with `--retry-failed`, and record the reason for any that still fail
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Rerun the checker with `--old` and `hvr_scan.py` over every kept file
- [ ] T006 Read a sample of the kept files old beside new
- [ ] T007 Commit the kept sk-design files only, then run `compiled-route-guard.cjs` and each mirror generator's `--check`
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
