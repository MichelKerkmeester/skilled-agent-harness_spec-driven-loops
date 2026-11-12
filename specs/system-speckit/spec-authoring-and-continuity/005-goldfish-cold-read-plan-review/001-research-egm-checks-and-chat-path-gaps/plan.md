---
title: "Implementation Plan: Research whether spec-kit planning should adopt fresh-context cold-read and decision-free readiness checks from the Elephant-Goldfish Model"
description: "Run a five-iteration deep-research lineage on DeepSeek V4.1 Flash through the shared fan-out runner. The lineage writes its iterations and synthesis under research/. A resolving file and line behind each placement claim proves the result."
trigger_phrases:
  - "goldfish cold read plan review plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Research whether spec-kit planning should adopt fresh-context cold-read and decision-free readiness checks from the Elephant-Goldfish Model

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts, written by a Node runner |
| **Framework** | `fanout-run.cjs` from system-deep-loop, executor `cli-pi` |
| **Storage** | Files under `research/` |
| **Testing** | `validate.sh --strict` and a count of iteration files |

### Overview
Run a five-iteration deep-research lineage on DeepSeek V4.1 Flash through the shared fan-out runner. The lineage writes its iterations and synthesis under `research/`. A resolving file and line behind each placement claim proves the result.
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
- [ ] `ls research/lineages/deepseek-flash/iterations | wc -l` prints 5
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Single research lineage

### Key Components
- **`research/lineages/deepseek-flash/`**: holds the five iterations, the state log and the lineage synthesis
- **`research/research.md`**: holds the merged findings and the recommendation

### Data Flow
The runner starts one fresh `pi` process per iteration. Each iteration reads the prior state from files and appends its findings. The merge step copies the lineage synthesis into `research/research.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Setup creates the packet and confirms the `pi` route. Implementation runs the five iterations and merges the synthesis. Verification counts the iterations and checks the cited lines. Follow the ordered tasks in `tasks.md`, which owns the task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`ls research/lineages/deepseek-flash/iterations | wc -l` prints 5, and `validate.sh --strict --quiet` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

The `pi` CLI, the LLM Gateway route for `deepseek-v4.1-flash-1017` and `node`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: the lineage fails or writes outside this folder. Remove this packet folder and its entry in the track's `graph-metadata.json`. No workflow file changes, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---

