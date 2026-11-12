---
title: "Implementation Plan: Phase 7: test-and-ci-bloat-research"
description: "Run a two-lineage deep-research fan-out over the repository's tests, CI workflows and git hooks. One lineage runs on cli-opencode and one on cli-pi, both on DeepSeek V4.1 Flash at max, ten iterations each. The orchestrator merges both into one ranked research.md and checks the top findings by command."
trigger_phrases:
  - "test and ci bloat research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: test-and-ci-bloat-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts. The subjects are TypeScript, JavaScript, Python and shell tests plus GitHub Actions YAML |
| **Framework** | `/deep:research` fan-out through `fanout-run.cjs` |
| **Storage** | None |
| **Testing** | None added. The research reads vitest, node:test, pytest and shell suites |

### Overview
Run a two-lineage deep-research fan-out over the repository's tests, CI workflows and git hooks. One lineage runs on cli-opencode and one on cli-pi, both on DeepSeek V4.1 Flash at max, ten iterations each. The orchestrator merges both into one ranked `research.md` and checks the top findings by command.
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
- [x] `ls research/lineages/*/iterations/iteration-*.md | wc -l` prints 20 and `research/research.md` exists
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Parallel research lineages

### Key Components
- **Lineage `opencode-go`**: cli-opencode on `opencode-go/deepseek-v4.1-flash` at max, ten iterations
- **Lineage `pi-llmgateway`**: cli-pi on `deepseek-v4.1-flash-1017` at max, ten iterations

### Data Flow
Each lineage writes iteration files and a findings registry in its own folder under `research/`. `fanout-merge.cjs` merges the registries. The orchestrator reads every iteration file and writes `research.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup scaffolds this folder and checks both providers list the model. Implementation runs the fan-out and the merge. Verification counts the iteration files, checks the top findings by command and runs strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

No test is added. The check is `ls research/lineages/*/iterations/iteration-*.md | wc -l`, which must print 20.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`opencode` 2.2.5 with the OpenCode Go provider, `pi` 1.5.0 with the LLM Gateway provider, and `gh` for CI run history. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: the research is abandoned. Remove the `007-test-and-ci-bloat-research` folder and revert the phase 7 rows in the parent `spec.md` and `graph-metadata.json`. Nothing outside this packet changes.
<!-- /ANCHOR:rollback -->

---

