---
title: "Implementation Plan: create.sh adds a row to an un-anchored parent phase map"
description: "Before the anchored append branch runs, create.sh wraps an un-anchored map in the phase-map anchor and orders the new rows by that table's header."
trigger_phrases:
  - "phase map unanchored append plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: create.sh adds a row to an un-anchored parent phase map

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and POSIX awk |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `test-phase-system.sh` shell suite |

### Overview
One branch in `create.sh` runs before the anchored append. It finds the map heading, wraps the section in the anchor pair and reorders the new rows to match the table header. The existing anchored awk then inserts the rows, so that path keeps its behavior. A new case in `test-phase-system.sh` proves the fix.
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
- [x] `bash tests/test-phase-system.sh` prints `Results: 15 passed, 0 failed (of 15)`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Single script branch

### Key Components
- **`create.sh` phase-map block**: wraps an un-anchored map, then hands it to the unchanged anchored append

### Data Flow
The parent `spec.md` is read once for the table header and rewritten once with the anchor pair. The anchored awk then inserts the reordered rows where the table ends.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup reproduces the duplicate map with a failing case. Implementation changes `create.sh`. Verification reruns the suite and validates the parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` prints `Results: 15 passed, 0 failed (of 15)`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`bash` and `awk`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: an append damages a parent map. Revert the fix commit with `git revert`.
<!-- /ANCHOR:rollback -->

---
