---
title: "Implementation Plan: Phase 11: push the open-item fixes and re-pin Barter onto them"
description: "The operator pushes Skilled main with phase 009's fixes; an ai-speckit session then re-pins Barter onto the pushed commit and records its base with record-base."
trigger_phrases:
  - "push and repin open items plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: push the open-item fixes and re-pin Barter onto them

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Git, the doctor overlay engine and the doctor update engine |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The overlay engine's status, and Barter's gates after the re-pin |

### Overview
The operator pushes Skilled main, which carries phase 009's merge. An ai-speckit session then re-pins Barter onto the pushed commit with `/doctor:overlay repin` and records the base with `/doctor:update record-base --pin`. Both steps record their output here.
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
- [ ] `overlay-engine.cjs status --json` in ai-speckit `skilled/` reports `PASSED` on the new pin
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Push, then re-pin.

### Key Components
- **Skilled main on origin**: carries phase 009's merge.
- **Barter's vendored tree**: re-pinned onto the pushed commit, with `base.json` recording it.

### Data Flow
Operator push, then the re-pin reads the pushed id from this phase's `Target Skilled commit:` line, then record-base writes `base.json`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup records the pushed id. Implementation runs the re-pin and record-base in ai-speckit. Verification reads the overlay status and `base.json` and strict-validates this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`overlay-engine.cjs status --json` reports `PASSED`, and `base.json` names the pushed commit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

The operator's push of Skilled, then an ai-speckit session.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: the re-pin breaks a Barter gate. `/doctor:overlay repin --rollback` restores the earlier pin.
<!-- /ANCHOR:rollback -->

---

