---
title: "Implementation Plan: Build-readiness review of the 003 build plan"
description: "One expansive /deep:research fan-out of four lineages over the eleven 003 phase packets, then five fresh review rounds, ending in a ranked repair order."
trigger_phrases:
  - "plan review research plan"
  - "build readiness review plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Build-readiness review of the 003 build plan

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research only. The plans and runtime read are TypeScript, JavaScript, Rust and Markdown |
| **Framework** | `/deep:research` workflow, `fanout-run.cjs` lineage pool |
| **Storage** | `research/` folder of this packet |
| **Testing** | Iteration-record counts, citation resolution and `validate.sh --strict` |

### Overview
The run reads the eleven 003 phase packets, the built runtime, the 001 parity synthesis and the reference repos under `specs/system-skilled-bots/context/`. It runs as four lineages in expansive depth mode: two on Devin `deepseek-v4-1-flash-max` and two on Vibe `deepseek-flash`, 13 iterations each, with the stop policy set to max iterations [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/fanout-config.json:1]. The proof is 51 iteration records [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/research.md:37], a synthesis that dedupes 301 registry findings to 98 [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/research.md:39], and five review rounds that close every P0.
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
- [x] `find research/lineages -name 'iteration-*.md' | wc -l` prints 51, and `validate.sh --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Fan-out review loop.

### Key Components
- **`/deep:research` workflow**: seeds the frontier, dispatches each iteration, merges the lineages and writes the synthesis.
- **The eleven 003 phase packets**: read-only inputs, each with `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`.
- **The built runtime**: the evidence each plan is checked against, read-only.

### Data Flow
The topic seeds six depth-1 questions. The pool deals them across the four lineages, each lineage writes its own iteration records and synthesis, and the merge step folds them into `research/research.md` and `research/resource-map.md`. Five fresh review rounds then read the fixed 003 docs and record their findings beside the synthesis.
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

`find research/lineages -name 'iteration-*.md' | wc -l` prints 51, and every P0 and P1 citation in `research/research.md` resolves to an existing file and an in-range line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`devin` and `vibe` on PATH, with daily usage left. No Codex fallback was configured, so the Devin quota stop was absorbed by the other three lineages.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a broken or abandoned run. Move `research/` aside, or rerun with `--restart`, which archives the prior `research/` folder. Nothing outside this packet changes.
<!-- /ANCHOR:rollback -->

---

