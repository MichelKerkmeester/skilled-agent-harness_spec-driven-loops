---
title: "Implementation Plan: Keep a packet's core purpose across handovers and compactions"
description: "Run `/deep:research` autonomously as two `cli-deepseek-harness` lineages that read system-spec-kit, its commands, system-deep-loop and real packets. The run changes no code and writes only under `research/`. The orchestrating session then opens the citations itself."
trigger_phrases:
  - "purpose retention across handovers plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Keep a packet's core purpose across handovers and compactions

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research over TypeScript hooks, command docs and spec templates |
| **Framework** | `/deep:research` from system-deep-loop |
| **Storage** | None. Findings are files under `research/` |
| **Testing** | Citation spot checks and `validate.sh --strict` |

### Overview
Run `/deep:research` autonomously as two `cli-deepseek-harness` lineages that read system-spec-kit, its commands, system-deep-loop and real packets. The run changes no code and writes only under `research/`. The orchestrating session then opens the citations itself.

| Executor setting | Value |
|------------------|-------|
| Command | `/deep:research` autonomous |
| Lineages | Fan-out of two `cli-deepseek-harness` lineages |
| Model | `deepseek-v4.1-flash-1017` at `max` |
| Iterations | 5 per lineage |
| Stop policy | `max-iterations` |
| Concurrency | 2 |
| Worktree | `371-purpose-retention-research` |
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
- [ ] `ls research/research.md research/resource-map.md` prints both paths, and `validate.sh <packet> --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Two-lineage read-only research

### Key Components
- **`research/lineages/`**: holds each lineage's iteration state so the two runs stay apart
- **`research/research.md`**: the one synthesis the later build packet reads

### Data Flow
Each lineage reads the in-scope folders and writes its iterations under `research/lineages/`. The synthesis step merges both lineages into `research/research.md` and `research/resource-map.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup confirms the five open questions in `spec.md` and the executor settings above. Implementation runs both lineages and writes their findings under `research/`. Verification opens the citations in `research/research.md` and runs `validate.sh --strict`. The ordered work and its checks live in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The orchestrating session opens a sample of the `[SOURCE: path:line]` citations in `research/research.md` and checks each one points at the cited text. Then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict` must print `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

The `cli-deepseek-harness` executor with `deepseek-v4.1-flash-1017` and `rg`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a lineage writes outside `research/`. The operator reverts that file with `git checkout -- <path>` and deletes the `research/` folder to discard the run.
<!-- /ANCHOR:rollback -->

---

