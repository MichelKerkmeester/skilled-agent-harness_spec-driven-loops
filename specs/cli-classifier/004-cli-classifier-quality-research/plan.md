---
title: "Implementation Plan: Deep research: cli-classifier quality audit"
description: "Runs /deep:research in fan-out mode with a DeepSeek lineage on cli-devin and a Luna lineage on cli-codex, five iterations each, then merges both into one synthesis."
trigger_phrases:
  - "cli-classifier research plan"
  - "fan-out deep research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep research: cli-classifier quality audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node `.mjs`/`.cjs`, Python and Markdown under research |
| **Framework** | system-deep-loop `/deep:research` auto workflow, fan-out path |
| **Storage** | JSONL state, iteration Markdown and registries under `research/` |
| **Testing** | `verify-iteration` per iteration, runner artifact checks, orchestrator spot-checks |

### Overview
The orchestrator binds the research topic and the fan-out config, then `fanout-run.cjs` runs two detached lineages concurrently. Each lineage runs the full research loop in its own directory under `research/lineages/`. `fanout-merge.cjs` then merges their registries and the workflow writes `research/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out research: independent lineages, one merge.

### Key Components
- **`fanout-run.cjs`**: spawns both lineages in a capped pool, enforces write containment and checks each lineage's artifacts.
- **`fanout-merge.cjs`**: merges the lineage registries for the synthesis.

### Data Flow
Topic and config go into each lineage prompt. Each lineage writes iterations, deltas and state into its own directory. The merge reads those directories and the synthesis step writes the combined report.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The orchestrator opens the cited `file:line` of the top findings and records whether each holds.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `devin` and `codex` binaries, logged in. No Jev or Pi key is needed because the research makes no classifier calls.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The run writes only under `research/`. Rollback is removing that directory or reverting the commit that adds it.
<!-- /ANCHOR:rollback -->

---

