---
title: "Implementation Plan: Phase 9: rename-rule-and-test-root-fixes"
description: "Update the historical-document path rule and correct two shell test root paths. Record the supplied test results and changelog shape check for the completed follow-up."
trigger_phrases:
  - "rename rule and test root fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: rename-rule-and-test-root-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and Bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The two shell test scripts and `check_changelog_shape.py` |

### Overview
Update section 2 of `rename-pattern.md` so historical content stays preserved while a moved live locator can be updated when the link check would otherwise fail. Add one `/..` to the `REPO` line in each affected shell test. Record the release changelog and version bump, then use the supplied test results and changelog shape check as evidence.
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
- [x] All acceptance criteria met
- [x] The supplied results record both shell tests as passing and `check_changelog_shape.py` as `PASS`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Single-source path correction

### Key Components
- **`rename-pattern.md` section 2**: Defines when a historical spec path can follow a move.
- **The two shell test `REPO` lines**: Resolve the repository root used to build validator and parser paths.

### Data Flow
Each shell test derives its repository path from `BASH_SOURCE`. The corrected `REPO` line reaches the repository root before the test builds its validator or parser path. The rename rule keeps historical content unchanged while allowing live locators to follow moved packets when the link check requires it.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Setup records the approved follow-up scope and existing result facts.
Implementation updates the rename rule, both `REPO` lines and the release files.
Verification records the supplied shell-test results, changelog shape result and strict packet validation in `tasks.md`.
The ordered work and task state are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The supplied facts do not include the exact shell-test invocations or full stdout. `tasks.md` records the supplied results for both scripts and the `PASS` result from `check_changelog_shape.py`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None outside the repository. The change uses the existing rule, shell tests and changelog shape checker.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

N/A: the supplied facts do not name a rollback command. The change is limited to the five files listed in `spec.md`.
<!-- /ANCHOR:rollback -->

---

