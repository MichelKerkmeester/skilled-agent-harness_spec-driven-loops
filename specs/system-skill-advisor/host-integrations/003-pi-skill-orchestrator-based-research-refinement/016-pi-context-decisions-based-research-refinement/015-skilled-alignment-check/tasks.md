---
title: "Tasks: Phase 15: skilled-alignment-check"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skilled alignment check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: skilled-alignment-check

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`$OUT` is the run folder `~/.local/state/local-skilled-alignment/Skilled/20261119T054734Z`. `A` is `.skilled/commands/assets/local-skilled-alignment`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the scope over the merged branch (`$OUT/scope.json`). Verify: `node $A/resolve-scope.cjs worktrees/474-advisor-pasted-context-and-crash-fallback --kind branch --base 4bf79332378 --first-parent --out $OUT/scope.json` prints `STATUS=OK` with `files=220 commits=20`.
- [x] T002 Build the battery plan (`$OUT/plan.txt`). Verify: `node $A/run-battery.cjs --scope $OUT/scope.json --plan` exits 0 and lists S1 to S8, S13 and S14 as FIRES.
- [x] T003 Show the scope checkpoint and record the operator's answer (`implementation-summary.md`). Verify: `rg -n 'Scope checkpoint' implementation-summary.md` prints one line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the battery (`$OUT/battery.json`). Verify: `run-battery.cjs` exits 0 or 1 and `$OUT/battery.json` exists.
- [x] T005 Show the lane checkpoint and record the chosen preset (`implementation-summary.md`). Verify: `rg -n 'Lane preset' implementation-summary.md` prints one line.
- [x] T006 Run the lanes, the probes and the critic (`$OUT/lanes/`). Verify: each lane has a `<id>.json` or an `<id>.error.txt`, and `$OUT/critic.json` or `$OUT/critic.error.txt` exists.
- [x] T007 Aggregate the report (`$OUT/report.md`). Verify: `node $A/aggregate-findings.cjs --run-dir $OUT` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Copy the report files into this phase (`evidence/`). Verify: `ls evidence` prints `findings.json`, `fix-plan.md`, `report.md` and `scope-summary.json`.
- [x] T009 Triage every finding (`implementation-summary.md`). Verify: every finding id in `evidence/findings.json` appears in the triage table.
- [x] T010 Validate this folder (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `evidence/report.md` exists and the triage covers every finding
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
