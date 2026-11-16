---
title: "Implementation Plan: Find why a command routing baseline capture run straight after a skill graph scan reads the state from before the scan"
description: "Reproduce a stale baseline capture after a skill graph scan, compare the capture's inputs at both moments and fix the producer of the stale value. The files to change are not known until the cause is."
trigger_phrases:
  - "baseline capture after graph scan plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Find why a command routing baseline capture run straight after a skill graph scan reads the state from before the scan

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, an ES module script and a TypeScript handler |
| **Framework** | None |
| **Storage** | `graph-metadata.json` files, the advisor's generated state and the skill graph database |
| **Testing** | A reproduction script, then the advisor's vitest suite |

### Overview
This is an investigation before it is a change. A script runs the scan and the capture together and compares the rows with a later capture. If a row differs, the inputs the capture read are hashed at both moments, and the input that changed names the producer. The fix and its test follow only from that.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [ ] The operator has read this plan

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/repro-results.txt` holds ten result lines or more, and `goal.md` section 4 records the outcome
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Reproduce, then compare.

### Key Components
- **`scratch/repro-capture-after-scan.sh`**: runs the scan and the capture in one command, waits a minute, captures again and compares the rows. It is a new file because no existing script runs the two together.
- **The capture's inputs**: every `graph-metadata.json`, the generated command bridges, the hub closures and the generation file. Nothing is added here. They are hashed at both moments.
- **The producer**: UNKNOWN. Two things to look at first, both inferred from reading and neither confirmed. The advisor daemon watches `graph-metadata.json` and reindexes after a change, which may rewrite a file the capture is reading. The capture asks `compiled-route.cjs` for each hub's route in a separate process, which may serve a closure published before the scan.

### Data Flow
The scan indexes the skill metadata, refreshes the embeddings and publishes a generation. The capture then builds its projection from files, scores each corpus row and asks each hub for its route. A stale row means one of those reads saw a file from before the scan.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup writes the reproduction and runs it ten times. Implementation compares the capture's inputs, names the cause and fixes its producer. Verification reruns the reproduction and the advisor suite. When nothing differs in ten runs, Implementation is skipped and the outcome is recorded.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`scratch/repro-capture-after-scan.sh` must print `same` for ten runs after a fix. A fix also needs one test in the advisor's vitest suite that fails without it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

The advisor daemon and a local embedder, for the scan to take the path the report describes. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: the fix changes a row of `command-routing-baseline.json` that the reproduction did not name. Revert the one commit. The reproduction script lives in `scratch/` and changes nothing it does not restore.
<!-- /ANCHOR:rollback -->

---

