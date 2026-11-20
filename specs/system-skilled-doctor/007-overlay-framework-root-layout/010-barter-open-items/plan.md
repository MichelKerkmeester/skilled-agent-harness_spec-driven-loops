---
title: "Implementation Plan: Phase 10: close the Barter-side open items of the overlay layout"
description: "Record the Barter-side open-item fixes that a parallel ai-speckit session makes and records in ai-speckit's spec record 039."
trigger_phrases:
  - "barter open items plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: close the Barter-side open items of the overlay layout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Barter's ai-speckit repository: Node scripts, shell hooks and Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Barter's own gates, as record 039 names them |

### Overview
A parallel ai-speckit session fixes the Barter-side open items and records them in ai-speckit's record 039. A later session copies the commit ids and gate results here. Nothing in Skilled changes in this phase except its own docs.
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
- [ ] `git -C <ai-speckit> show --stat <id>` lists each fixing commit named in record 039
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Recorded external work.

### Key Components
- **ai-speckit record 039**: `specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/`, the authoritative record of the fixes.
- **This phase**: a summary of that record, written after it lands.

### Data Flow
The ai-speckit session fixes and commits; record 039 names the commits; a later session copies them here.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup reads record 039's Known Limitations. Implementation is the ai-speckit session's fixes. Verification copies the commit ids and gate results here and strict-validates this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The ai-speckit session runs Barter's gates; this phase quotes their output from record 039.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

The parallel ai-speckit session and its record 039.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a fix breaks a Barter gate. The ai-speckit session reverts its own commit; this phase records the revert.
<!-- /ANCHOR:rollback -->

---

