---
title: "Tasks: Phase 16: doc-alignment-check"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doc alignment check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: doc-alignment-check

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

`$OUT` is the run folder `~/.local/state/local-doc-alignment/Skilled/20261119T055032Z`. `D` is `.skilled/commands/assets/local-doc-alignment`. `S` is `.skilled/commands/assets/local-skilled-alignment`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Add the `advisor-pasted-reply` topic (`$D/topics.json`). Verify: `python3 -m json.tool $D/topics.json` exits 0 and every code root exists on disk.
- [x] T002 Run the scope step (`$OUT/scope.json`). Verify: `node $D/doc-alignment.cjs scope --topic advisor-pasted-reply --out $OUT` prints `STATUS=OK` with `docs=15 lanes=4 checks=1`.
- [x] T003 Show the scope checkpoint and record the operator's answer (`implementation-summary.md`). Verify: `rg -n 'Scope checkpoint' implementation-summary.md` prints one line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the topic's check (`$OUT/battery.json`). Verify: `node $D/doc-alignment.cjs checks --run-dir $OUT` exits 0.
- [x] T005 Show the lane checkpoint and record the chosen preset (`implementation-summary.md`). Verify: `rg -n 'Lane preset' implementation-summary.md` prints one line.
- [x] T006 Run the lanes and the critic (`$OUT/lanes/`). Verify: each lane has a `<id>.json` or an `<id>.error.txt`, and `$OUT/critic.json` or `$OUT/critic.error.txt` exists.
- [x] T007 Aggregate the report (`$OUT/report.md`). Verify: `node $S/aggregate-findings.cjs --run-dir $OUT --map $D/doc-map.yaml` exits 0.
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
