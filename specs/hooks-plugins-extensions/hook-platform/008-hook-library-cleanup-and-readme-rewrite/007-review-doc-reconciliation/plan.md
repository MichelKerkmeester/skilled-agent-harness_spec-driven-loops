---
title: "Implementation Plan: Phase 7: review-doc-reconciliation"
description: "Six text edits across the packet docs and the hooks README fix the deep review's findings. Greps and counts prove each edit, then the packet validates and the review reruns."
trigger_phrases:
  - "review doc reconciliation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: review-doc-reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `grep`, `find`, `validate.sh`, `validate_document.py`, `hvr_scan.py` |

### Overview
Six text edits change five packet documents and the hooks root README. Each edit has a grep or count that printed the defect before and must print the fix after. The packet then validates recursively, and a deep review rerun checks the coverage gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `validate.sh --recursive --strict` on the packet prints `RESULT: PASSED` eight times
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: documentation edits only.

### Key Components
- **Packet completion records**: the parent spec and goal, and phase 4's spec, tasks and summary.
- **Hooks root README**: the switch table target and the directory tree.

### Data Flow
None. No code reads the edited text, apart from the validators that check it.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup records the six greps and counts in `spec.md`'s Measured Behavior. Implementation makes the six edits. Verification reruns the greps, the README checkers, recursive strict validation and the deep review. `tasks.md` owns the ordered tasks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

No test code. Each requirement's grep printed the defect in Measured Behavior and must print the fixed value afterwards. `validate.sh --recursive --strict` must print `RESULT: PASSED` for all eight documents.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None beyond the repository's own validators and `dsh` for the review rerun.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a validator fails on an edited file. Revert that file with `git checkout -- <file>` before the commit, or revert the commit after it.
<!-- /ANCHOR:rollback -->

---
