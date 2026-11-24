---
title: "Implementation Plan: OpenBot parity research for skilled bots"
description: "One expansive /deep:research fan-out of four lineages over eight reference repos and the bots runtime, ending in a ranked build recommendation."
trigger_phrases:
  - "openbot parity research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: OpenBot parity research for skilled bots

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research only. The repos read are TypeScript, Rust, Python and Go |
| **Framework** | `/deep:research` workflow, `fanout-run.cjs` lineage pool |
| **Storage** | `research/` folder of this packet |
| **Testing** | Iteration-record counts, route-proof fields and `validate.sh --strict` |

### Overview
The run reads eight repos under `specs/system-skilled-bots/context/` and the bots runtime under `.skilled/skills/system-skilled-bots/`. It runs as four lineages in expansive depth mode: two on Devin `deepseek-v4-1-flash-max` and two on Vibe `deepseek-flash`, 13 iterations each, with the stop policy set to max iterations. The proof is 52 iteration records with route-proof fields and a synthesis that covers all eight OpenBot bot parts.
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
- [ ] `find research -name 'iteration-*.md' | wc -l` prints at least 50, and `validate.sh --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Fan-out research loop.

### Key Components
- **`/deep:research` workflow**: runs setup, dispatches each iteration, merges the lineages and writes the synthesis.
- **Context repos**: read-only inputs, linked into this worktree from the primary checkout.

### Data Flow
The topic seeds depth-1 frontier questions. The pool deals them across the four lineages, each lineage writes its own iteration records, and the merge step folds them into `research/research.md` and `research/resource-map.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

A `--dry-run` before the real run must print four lineages with the expected models and 13 iterations each.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`devin`, `vibe` and `codex` on PATH, with Devin and Vibe daily usage left. Codex `gpt-6-luna` at `xhigh` and the `fast` tier is the fallback executor.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a broken or abandoned run. Move `research/` aside, or rerun with `--restart`, which archives the prior `research/` folder. Nothing outside this packet changes.
<!-- /ANCHOR:rollback -->

---

