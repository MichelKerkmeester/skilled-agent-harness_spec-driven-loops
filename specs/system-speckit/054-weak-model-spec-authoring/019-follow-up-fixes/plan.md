---
title: "Implementation Plan: Phase 19: follow-up-fixes"
description: "Turn fsmonitor off for the two git calls in the goal-file manifest check, and make the speed loop rebuild a dirty sandbox between rounds instead of dropping the variant. A weak model made the first edit through cli-pi, Opus made the second, and a review plus one remediation pass closed the result."
trigger_phrases:
  - "follow up fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 19: follow-up-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (the loop must run on `/bin/bash` 3.2) |
| **Framework** | None |
| **Storage** | Files: sandbox `ready` and `DIRTY` markers, `sandbox-map.tsv` |
| **Testing** | Vitest (`recursive-child-manifest.vitest.ts`), `bash -n`, a `loop.sh --dry-run` |

### Overview
Change A adds `-c core.fsmonitor=false` to both git calls in `check-goal-file-manifest.sh`, so the manifest test no longer waits on the fsmonitor hook. Change B adds a round-start re-prepare to the speed loop's `loop.sh`, which rebuilds a dirty sandbox with `prepare.sh` and keeps it only when the snapshot head and leak count match the start of the run. The proof is the passing vitest file, the fail-closed probe, the clean mode in `git diff` and an exit-0 dry run that writes nothing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented: the 853305 ms line and the three main-no054 `ABORT` rows are in the spec's Measured Behavior block
- [x] Success criteria measurable: SC-001 and SC-002 each name a command and its output
- [x] Dependencies identified: `prepare.sh` and `step.sh`, unchanged

### Definition of Done
- [x] All acceptance criteria met: REQ-001 to REQ-006, evidence in `tasks.md`
- [x] `npx vitest run --project cli tests/recursive-child-manifest.vitest.ts` prints `Tests  2 passed (2)`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: two independent shell script edits.

### Key Components
- **`check-goal-file-manifest.sh`**: lists tracked files with `git ls-files` and checks the goal-file manifest against them; it fails closed with exit 2 when git is missing.
- **`loop.sh` `reprepare`**: before each round after the first, rebuilds a sandbox marked `DIRTY` and either keeps it or marks it `DIRTY` again with the refusal reason.

### Data Flow
A step that writes into a sandbox makes `step.sh` touch `DIRTY`. At the next round start, `reprepare` sees the marker, runs `prepare.sh` under the loop's lock, reads the new sandbox path from `sbx_dir`, and compares its `ready` file's `head=` and `task_term_refs=` with the values recorded after the start-of-run leak gate. A match clears the variant for the round; a mismatch leaves a `DIRTY` marker so `step.sh` aborts that variant's steps.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup records the failures and writes the brief. Implementation makes changes A and B and the review fixes. Verification reruns the vitest file, the probes and the dry run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

From `.skilled/skills/system-spec-kit`, `npx vitest run --project cli tests/recursive-child-manifest.vitest.ts` must print `Tests  2 passed (2)`. The loop is checked only with `--dry-run`, because a real run dispatches paid model runs, so the refusal and recovery paths are checked by reading the code.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`git`, `/bin/bash` 3.2 and the existing speed-loop scripts `prepare.sh`, `step.sh` and `lib.sh`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: the manifest test fails again, or a real loop run refuses every re-prepare. Revert the commit that carries the three files; neither change touches data outside its own folder.
<!-- /ANCHOR:rollback -->

---
