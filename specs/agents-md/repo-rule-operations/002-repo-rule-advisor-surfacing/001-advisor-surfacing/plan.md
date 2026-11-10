---
title: "Implementation Plan: Repo rule surfacing through the advisor"
description: "Run a four-iteration, two-lineage cli-devin deep-research loop on whether any surface should suggest repo rules, then synthesize, verify citations and write the findings back."
trigger_phrases:
  - "repo rule advisor research plan"
  - "two lineage devin research"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Repo rule surfacing through the advisor

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts; Node runtime scripts for the loop |
| **Framework** | `/deep:research:auto` fan-out through `fanout-run.cjs` |
| **Storage** | `research/` JSONL state, iteration files and deltas |
| **Testing** | Targeted strict `validate.sh`; manual citation check |

### Overview
Two `cli-devin` lineages, `swe-2-max` and `deepseek-v4-1-flash-max`, each run four forced iterations against the same evidence-carrying brief. The orchestrator merges them, checks the citations their verdicts rest on, and writes one synthesis that reports their disagreement instead of averaging it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Devin CLI installed and logged in)

### Definition of Done
- [x] Four iterations per lineage on disk
- [x] Load-bearing citations checked against the working tree
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out research: one supervisor process, two isolated lineages, one merge.

### Key Components
- **`fanout-run.cjs`**: spawns each lineage as a `devin -p` process with its own artifact directory and write containment.
- **`fanout-merge.cjs`**: merges the lineage registries and writes `fanout-attribution.md`.
- **`reduce-state.cjs`**: emits `research/resource-map.md` from the lineage deltas.

### Data Flow
Brief and config go to both lineages; each writes iterations, deltas and its own synthesis under `research/lineages/<label>/`; the merge and the orchestrator's synthesis read those in place and write `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Targeted strict validation of the spec docs, plus a manual check that each load-bearing citation in the synthesis resolves.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Devin CLI 3000.11.3 with account OAuth; the `swe-2-max` and `deepseek-v4-1-flash-max` models on the enforced allowlist.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The packet is new and untracked: deleting this phase folder undoes it.
<!-- /ANCHOR:rollback -->

---
