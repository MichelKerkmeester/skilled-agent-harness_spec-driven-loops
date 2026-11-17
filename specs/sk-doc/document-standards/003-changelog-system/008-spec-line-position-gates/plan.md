---
title: "Implementation Plan: Spec-Line Position Gates"
description: "Adds a spec-position rule to the changelog shape check and names the spec-folder line position in the three changelog checklists and PUBLIC-RELEASE.md."
trigger_phrases:
  - "spec line position gates plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Spec-Line Position Gates

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 and Markdown/YAML docs |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest |

### Overview
One rule is added to `check_changelog_shape.py`: a spec-folder line must close the entry, after an `&nbsp;` line. Three checklist lines and one `PUBLIC-RELEASE.md` sentence are reworded to name that position. The measured probe and the shape-check tests prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` reports only the model-entry failure that predates this phase
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: one rule function beside the existing rules in a single-file checker

### Key Components
- **`check_spec_position`**: reads the body lines after and before each spec-folder block
- **Checklist lines**: tell an author and a reviewer where the line sits

### Data Flow
`check_entry` reads the entry, `read_shape` records each spec-folder line outside code fences, and the new rule reads the lines around each one.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup reads the checker, its tests and the three checklists. Implementation adds the rule, moves the fixture's spec line and rewords the four docs. Verification runs the measured probe and the shape-check tests. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py <probe>` exits 1 with a `[spec-position]` line for the measured probe, and the pytest suite reports only the pre-existing model-entry failure.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: the rule fails an entry the template allows. Revert the one commit.
<!-- /ANCHOR:rollback -->

---

