---
title: "Tasks: Playbook coverage, feature catalogs and alignment for the expansive-depth program"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "docs playbooks alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Playbook coverage, feature catalogs and alignment for the expansive-depth program

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`D` is `.skilled/skills/system-deep-loop`. `S` is this phase folder's `scratch/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 001-013 are complete (`../0*/goal.md`). Verify: `rg -c '^- \[ \]' ../0*/goal.md` lists no file except this phase's own `goal.md`. **Open 2026-11-18.** Not closed: 010 goal.md line 64 (target-2 pilot) and 011 goal.md lines 58 (golden case, operator waiver pending) and 64 (target-1 pilot) are still open. The brief said 010 also holds a golden criterion; its goal.md does not show one (recorded in goal.md section 4).
- [x] T002 Rerun the two Measured Behavior commands from `spec.md` and record their output (`goal.md` §4). Verify: the output is in the log. **Done 2026-11-18.** Evidence: goal.md section 4, the unpiped rerun, 8 files and 3 files, both exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Check playbook coverage for each row of the Feature to Playbook Map: `rg -l` for that row's flag or behavior over its category folder (`D/deep-research/manual-testing-playbook/`, `D/deep-review/manual-testing-playbook/`, `D/runtime/manual-testing-playbook/`). Verify: the coverage table in `goal.md` §4 names one scenario file per 001-013 row, and every file is reachable from its package index and the hub index `D/manual-testing-playbook/manual-testing-playbook.md`. **Done 2026-11-18.** Evidence: coverage table in goal.md section 4, 13 rows and 18 files, each indexed and reachable through the hub section 9.
- [x] T004 Route each coverage gap to its owning phase, which adds the scenario through `/create:manual-testing-playbook system-deep-loop update --path <playbook dir>`, then recheck (`goal.md` §4). Verify: the coverage table has no empty row. **Done 2026-11-18, no gap.** Every map row had a scenario, so none was added and none was written on a phase's behalf.
- [x] T005 Update the four feature catalogs (`D/deep-research/feature-catalog/`, `D/deep-review/feature-catalog/`, `D/runtime/feature-catalog/`, `D/feature-catalog/feature-catalog.md`). Verify: `/create:feature-catalog system-deep-loop update --path <catalog dir>` completes for each, `rg -l -- "--depth-mode"` and `rg -l -- "--extend="` print a file in the research and review catalogs, and `rg -il "custom review dimension" D/deep-review/feature-catalog` prints a file. **Done 2026-11-18.** Evidence: 15 new leaves across the three packet catalogs and the hub, 4 root catalogs updated, strict catalog validator PASS, goal.md section 4 greps exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run `/local-doc-alignment "expansive depth" --out=S/doc-alignment-run-1` (`S/`). Verify: `report.md` exists there and its findings are recorded in `goal.md` §4. **Done 2026-11-18 (second pass).** Ran `/local-doc-alignment expansive-depth :auto --out=S/doc-alignment-run-1` with lanes: `report.md` shows 28 findings (P1 10, P2 18); lane L3 was killed at 20 minutes. Findings recorded in goal.md section 4, Alignment runs with lanes.
- [x] T007 Run `/local-skilled-alignment` over the 001-013 change with `--out=S/skilled-alignment-run-1` (`S/`). Verify: `report.md` exists there and its findings are recorded in `goal.md` §4. **Done 2026-11-18 (second pass).** Ran `/local-skilled-alignment :auto --base=21c4b325b5a --out=S/skilled-alignment-run-3` with lanes (runs 1 and 2 were battery-only): `report.md` shows 10 findings (P1 2, P2 8) and 1 outside the scope; lanes A and B and the critic were killed at 20 minutes. Findings recorded in goal.md section 4.
- [x] T008 Fix each doc finding: catalog findings through `/create:feature-catalog`, playbook gaps through the owning phase, other live docs (`references/`, `README.md`, `SKILL.md`, command docs) by a direct edit tied to the finding id. Hand each code finding to its owning phase (`goal.md` §4). Verify: every finding has a fix, a named owner or an operator waiver in the log. **Done 2026-11-18 (second pass).** Every live `.md` finding is fixed by a direct edit tied to its id (catalog and playbook edits follow each package's template and pass its strict validator, not the full create workflow, the same D2 deviation the first pass recorded) or carries a rebuttal; every code, YAML, JSON, agent and `.txt` finding is listed with its file and line under Handed to the coordinator in goal.md section 4.
- [x] T009 Regenerate each compiled contract whose digested document a fix changed (`node D/runtime/scripts/compile-command-contracts.cjs --command deep/research --write`, and `deep/review`). Verify: `npm test -- tests/unit/check-contract-drift.vitest.ts` run from `D/runtime` exits 0. **Done 2026-11-18 (second pass).** Digested docs changed, so both contracts were regenerated with `--write` after each fix batch. Evidence: `check-contract-drift.cjs` prints `OK commands=2`, and `npx vitest run check-contract-drift.vitest` from `D/runtime` passes (goal.md section 4, VERIFY lanes pass).
- [ ] T010 Rerun both checks into new numbered `--out` folders until each `report.md` shows zero open findings, at most three runs each (`S/`). Verify: the last report of each command shows zero open findings. **Limit reached 2026-11-18, not met.** Doc runs 1 to 3 counted 28, 15 and 23 findings; skilled runs 3 to 5 counted 10, 18 and 28 (P1 5, P2 23), 3 outside the scope, 1 overturned. The last reports still count handed-off code, YAML, agent and `.txt` findings and rebuttals as open, because the aggregator has no such status. **Second allowance 2026-11-18, not met.** Doc runs 4 to 6 ended 38, 14 and 18 open; skilled runs 6 to 8 ended 16, 8 and 12 open, after handed-off and rebutted dispositions the aggregator now reads. The last reports are `scratch/doc-alignment-run-6/report.md` (25 findings, 18 open) and `scratch/skilled-alignment-run-8/report.md` (20 findings, 12 open). A first attempt at that final pair, kept as `scratch/doc-alignment-run-6-aborted` and `scratch/skilled-alignment-run-8-aborted`, was stopped before any report when the empty-share ruling changed the code under it, and does not count as a run.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every Feature to Playbook Map row has a scenario its phase wrote
- [ ] Both alignment checks report zero open findings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md` Phase Documentation Map
<!-- /ANCHOR:cross-refs -->

---
