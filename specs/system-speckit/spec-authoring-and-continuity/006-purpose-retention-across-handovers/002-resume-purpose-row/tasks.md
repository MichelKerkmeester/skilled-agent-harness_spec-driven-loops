---
title: "Tasks: Phase 2: resume-purpose-row"
description: "Ordered tasks to add a Purpose row to the /speckit:resume brief: baseline checks, ten literal edits to three command assets, then the same checks plus two live resumes."
trigger_phrases:
  - "resume purpose row tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: resume-purpose-row

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

Run every command from the repository root. `A` is `.skilled/commands/speckit/assets`. `M` is `.skilled/skills/system-spec-kit/runtime/cli`. Edits E1 to E10 are in `plan.md` section 4, with the exact current and replacement text.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Record the goal-offer test baseline (`.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`). Verify: `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints `pass 5` and `fail 0` and exits 0.
- [ ] T002 Record the phase workflow test baseline (`$M/tests/test-phase-command-workflows.js`). Verify: `node $M/tests/test-phase-command-workflows.js` prints `Result: passed=148 failed=0` and exits 0.
- [ ] T003 Record the mirror and command check baselines (`$M/runtime-mirrors/sync-runtime-mirrors.cjs`). Verify: the four mirror checks in `plan.md` section 5 print PASS with 256, 45, 45 and 45, `command-catalog-mirror-check.cjs` prints `STATUS=OK` and `validate-command-references.cjs` prints `FAIL  4 unresolved command reference(s)`.
- [ ] T004 Confirm every current text in plan section 4 matches once and the assets are clean (`$A/`). Verify: `rg -F -c` on each current text prints 1 in its file and `git status --short $A` prints nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T005 Apply E1, add `spec` to the order line (`$A/speckit-resume-auto.yaml`). Verify: `rg -c 'spec/tasks/plan' $A/speckit-resume-auto.yaml` prints 1.
- [ ] T006 Apply E2, add the Purpose field and the `purpose_row` rule (`$A/speckit-resume-auto.yaml`). Verify: `rg -c 'reply_format: \["Purpose \(omit when none\)"' $A/speckit-resume-auto.yaml` prints 1 and `rg -c '^  purpose_row: ' $A/speckit-resume-auto.yaml` prints 1.
- [ ] T007 Apply E3, add `spec.md` to step 2 and the always-read line (`$A/speckit-resume-auto.yaml`). Verify: `rg -c '.spec\.md., .tasks\.md' $A/speckit-resume-auto.yaml` prints 1 and `rg -c 'Always read the Purpose for the brief' $A/speckit-resume-auto.yaml` prints 1.
- [ ] T008 Apply E4, show the row in step 4 (`$A/speckit-resume-auto.yaml`). Verify: `rg -c 'Show Purpose/Now/Last confirmed' $A/speckit-resume-auto.yaml` prints 1.
- [ ] T009 Apply E5, add `spec` to the order line (`$A/speckit-resume-confirm.yaml`). Verify: `rg -c 'spec/tasks/plan' $A/speckit-resume-confirm.yaml` prints 1.
- [ ] T010 Apply E6, add the Purpose field and the `purpose_row` rule (`$A/speckit-resume-confirm.yaml`). Verify: `rg -c 'reply_format: \["Purpose \(omit when none\)"' $A/speckit-resume-confirm.yaml` prints 1 and `rg -c '^  purpose_row: ' $A/speckit-resume-confirm.yaml` prints 1.
- [ ] T011 Apply E7, add the always-read line after the ladder walk (`$A/speckit-resume-confirm.yaml`). Verify: `rg -c 'Always read the Purpose for the brief' $A/speckit-resume-confirm.yaml` prints 1.
- [ ] T012 Apply E8, show the row in step 5 (`$A/speckit-resume-confirm.yaml`). Verify: `rg -c 'Show Purpose/Now/Last confirmed' $A/speckit-resume-confirm.yaml` prints 1.
- [ ] T013 Apply E9, add the Purpose line to the Resume Brief (`$A/speckit-resume-presentation.txt`). Verify: `rg -n -A1 '^Spec: \[path\]$' $A/speckit-resume-presentation.txt` prints the `Purpose: [one sentence quoted from spec.md ### Purpose, omitted when none]` line as the next line.
- [ ] T014 Apply E10, add the label note after the brief (`$A/speckit-resume-presentation.txt`). Verify: `rg -c -i 'purpose' $A/speckit-resume-presentation.txt` prints 2.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T015 Load both workflow assets as YAML (`$A/speckit-resume-auto.yaml`). Verify: `python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]; print('yaml ok')" $A/speckit-resume-auto.yaml $A/speckit-resume-confirm.yaml` prints `yaml ok` and exits 0.
- [ ] T016 Rerun both command tests (`.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`). Verify: the goal-offer test prints `pass 5` and `fail 0`. `node $M/tests/test-phase-command-workflows.js` prints `Result: passed=148 failed=0`.
- [ ] T017 Rerun the mirror and command checks (`$M/runtime-mirrors/sync-runtime-mirrors.cjs`). Verify: the same output as T003, including the same 4 unresolved references and no new one.
- [ ] T018 Rerun the Measured Behavior command from `spec.md` (`$A/`). Verify: both `reply_format` lines start with `"Purpose (omit when none)"`, both order lines read `(spec/tasks/plan/decision-record/resource-map)` and the last `rg -c` prints 2 with exit 0.
- [ ] T019 Run a live resume on a packet with a filled Purpose (`specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/002-resume-purpose-row/spec.md`). Verify: `/speckit:resume specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/002-resume-purpose-row :auto` prints a brief whose line after `Spec:` is `Purpose:` followed by this phase's Purpose sentence word for word.
- [ ] T020 Run a live resume on a phase child whose Purpose is a placeholder (`spec.md` of a child found with `rg -n -A1 '^### Purpose$' specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/0*/spec.md`, where the next line starts with `[`). Verify: the brief prints `Purpose (parent 006-purpose-retention-across-handovers):` followed by the parent's Purpose sentence and never prints `None`. If no sibling still holds a placeholder, mark this task `[B]` and name the reason.
- [ ] T021 Confirm nothing changed outside the three assets and this phase folder (`git status`). Verify: `git status --short` lists only the three files under `$A/` and this phase folder, next to whatever was already modified before T001.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: T019 and T020 each show the expected Purpose row
- [ ] `implementation-summary.md` names the three changed files and quotes the T016 and T019 output
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 4 for edits E1 to E10 and section 5 for the baseline numbers
- **Research**: `../research/research.md` sections 5 and 10
<!-- /ANCHOR:cross-refs -->

---
