---
title: "Implementation Plan: Phase 11: restore-pinned-value-when-json-entry-set-leaves-overlay"
description: "Record each set the overlay engine applies, and restore the pin's value when the operation leaves the entry set. One engine file, one test file and one reference change, proved by the engine test folder."
trigger_phrases:
  - "restore pinned value when json entry set leaves overlay plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: restore-pinned-value-when-json-entry-set-leaves-overlay

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS |
| **Framework** | None |
| **Storage** | `sync-state.json` in the overlay folder |
| **Testing** | `node --test` |

### Overview
The engine gains a `sets` record beside `items` in `sync-state.json`. The `set` branch of `planOperation` reports what it wrote, and a new step before the entry set runs restores each recorded `set` the entry set no longer names. The engine test folder proves it, with the failing test written first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The operator answered the two open questions in `spec.md` on 2026-11-16
- [x] The operator has said to start the build, through DeepSeek on the Vibe CLI, on 2026-11-16

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` and a pass count above 1175. It printed `pass 1183`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Record, then retract.

### Key Components
- **`planOperation`, the `set` branch**: reports each applied `set` through a new `onSet` callback, the way an added item is reported through `onListed`.
- **`restoreDroppedSets`, a new function beside `removeDroppedItems`**: restores or deletes at each recorded path the entry set no longer names. Extending `removeDroppedItems` in place fails, because its records are array items found by identity, and a `set` is a path to one value with a different refusal message and a different upstream read.
- **`loadState` and `writeStateIfChanged`**: read and write the `sets` key under the rule `items` follows, so a tree with no `set` keeps its state bytes.

### Data Flow
`apply` plans each overlay. `planJsonOverlay` passes the recorded sets for its destination into `applyJsonOperations`. That function restores the dropped ones, then runs the entry set, and each `set` it runs is reported back. After the writes, `apply` stores the reported sets in `sync-state.json`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup captures the test baseline and writes the failing test. Implementation adds the report, the record and the restore to `overlay-engine.cjs`. Verification runs the whole engine test folder and the sk-code setup check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`node --test .skilled/commands/doctor/scripts/tests` must print `fail 0`. Each engine change starts with a test that fails first, and is paired with a test that the nearest person-edit case still refuses, as phase 10 decided.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None new. The change uses `node:test` and the git read the engine already makes for the pinned copy.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a restore writes a value the pin does not hold, or the engine test folder fails. Revert the one commit. T004 confirms that an engine without this change still loads a state file that carries `sets`.
<!-- /ANCHOR:rollback -->

---

