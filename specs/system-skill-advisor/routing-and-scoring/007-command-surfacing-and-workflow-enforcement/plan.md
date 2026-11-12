---
title: "Implementation Plan: Research how the skill advisor should surface slash commands and how native chat reaches the proper command workflow without the user typing a command"
description: "Run a three-executor deep-research fan-out over ten angles and merge the lineages into one synthesis. No runtime code changes."
trigger_phrases:
  - "command surfacing and workflow enforcement plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Research how the skill advisor should surface slash commands and how native chat reaches the proper command workflow without the user typing a command

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSONL research artifacts |
| **Framework** | `/deep:research` workflow, `fanout-run.cjs` and `fanout-merge.cjs` |
| **Storage** | `research/` inside this packet |
| **Testing** | `validate.sh --strict` and artifact checks |

### Overview
The packet changes no runtime code. It runs the `/deep:research:auto` workflow as a fan-out of three lineages, 10 iterations each, over the ten angles in `spec.md`. The proof is three lineage directories with iteration files and one merged `research/research.md`.
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
- [ ] `ls research/research.md` prints the path and `ls research/lineages | wc -l` prints 3
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Fan-out research loop

### Key Components
- **Lineage `codex-luna`**: `cli-codex`, `gpt-6-luna`, reasoning `max`, service tier `fast`
- **Lineage `pi-deepseek`**: `cli-pi`, `deepseek-v4.1-flash-1017` through LLM Gateway, thinking `max`
- **Lineage `opencode-deepseek`**: `cli-opencode`, `opencode-go/deepseek-v4.1-flash`, variant `max`

### Data Flow
Each lineage runs its own loop and writes only under `research/lineages/<label>/`. The merge step reads the three lineages and writes the shared registry, and synthesis writes `research/research.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup fills the packet and passes the provider pre-flight. Implementation runs the three-lineage fan-out and the merge. Verification checks the lineage artifacts and `research/research.md`. Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`ls research/lineages | wc -l` prints 3 and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`codex` 0.167.2, `pi` and `opencode1` 1.19.4 with live credentials. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a lineage writes outside its lineage directory. Remove the packet's `research/` folder, which holds every file this run creates.
<!-- /ANCHOR:rollback -->

---

