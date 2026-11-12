---
title: "Implementation Plan: Phase 17: specs-artifact-tracking-decision"
description: "Measure the tracked file count and bytes per loop-state folder under specs/ with git ls-files, then write three options for the operator in a decision record. The phase changes no test, workflow, hook or source file and deletes, moves and untracks nothing."
trigger_phrases:
  - "specs artifact tracking decision plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: specs-artifact-tracking-decision

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, with read-only shell measurement through `git ls-files` and `git cat-file` |
| **Framework** | None |
| **Storage** | The git index, read only, plus the packet's `scratch/` folder |
| **Testing** | `validate.sh --strict` and `rg` checks on the two new documents |

### Overview
Two documents are written in this packet: an inventory of the tracked footprint under `specs/` and a decision record of three options. The inventory is produced from `git ls-files`, one row per category with a file count and a byte count, plus the union across the four categories. The proof is the inventory's table and three `Status: Proposed` lines in the decision record; no tracked file changes and no option is executed. It stops catching no regression: the phase changes no test, workflow, hook or source file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict --quiet` prints `RESULT: PASSED`
- [ ] `rg -c '^### Option' <packet>/decision-record.md` prints 3 and `rg -c '\*\*Status\*\*: Proposed' <packet>/decision-record.md` prints 3
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure, record, defer.

### Key Components
- **`scratch/artifact-inventory.md`**: the measurement. One row each for all tracked files, `specs/`, `research/`, `review/`, `scratch/` and `z_archive/`, plus the union of the four categories, the overlap note and the command that produced them.
- **`decision-record.md`**: the options. Three entries — keep everything tracked, stop tracking new loop state, or move archives out of the repository — each `Proposed`, with what it changes, what it costs and the operator as decider.

### Data Flow
`git ls-files` selects the tracked paths, a `git cat-file` batch check sums each path's blob size, and an `awk` sum groups the four categories. The numbers land in the inventory table. The decision record restates no number; it points at the inventory and names the three options. Nothing is written outside this packet and nothing leaves the index.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the branch, HEAD and date, then writes the measurement command into `scratch/artifact-inventory.md`. Implementation fills the six category rows, the union row and the overlap note in that file, then writes the three Proposed options and the no-action clause in `decision-record.md`. Verification reruns the measurement, checks the three `Status: Proposed` lines and runs strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No test is added, because the phase changes no code. The checks are the two `rg` counts on `decision-record.md`, which must print 3 and 3, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict --quiet`, which must print `RESULT: PASSED`. The measurement is checked by rerunning it and comparing the file counts.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`git` 2.x with `ls-files` and `cat-file`, `bash` and `ripgrep`. No new package and no framework.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the operator rejects the packet or asks for the options to be restated. Remove `scratch/artifact-inventory.md` and `decision-record.md`, then revert the three packet documents. No tracked file, workflow, hook or test changed, so nothing else needs restoring.
<!-- /ANCHOR:rollback -->

---
