---
title: "Implementation Plan: Phase 28: surface-setup-hardening-research"
description: "Run /deep:research as two five-iteration cli-devin lineages, DeepSeek V4.1 Flash max and SWE-2 max, then check every load-bearing claim against the tree and write the synthesis with ranked recommendations and build phases."
trigger_phrases:
  - "surface setup hardening research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 28: surface-setup-hardening-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts; JSONL state |
| **Framework** | `/deep:research` auto workflow, fan-out of two CLI lineages |
| **Storage** | None |
| **Testing** | Rereads of cited lines, experiments in throwaway copies, strict spec validation |

### Overview
The `/deep:research` workflow runs two lineages of five iterations on the questions in `spec.md`: `deepseek-max` on `cli-devin` with `deepseek-v4-1-flash-max` and `swe-max` on `cli-devin` with `swe-2-max`. Each iteration is one foreground dispatch per lineage, both lineages at once. The orchestrator then checks every load-bearing claim and writes `research/research.md` in the shape `spec.md` REQ-002 to REQ-007 define.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a two-lineage deep-research fan-out with orchestrator-side merge, verification and synthesis.

### Key Components
- **`/deep:research`**: runs the iterations and keeps each lineage's state log.
- **`cli-devin`**: the executor for both lineages, with a named `pi` fallback for a lineage that hits a usage limit.
- **Orchestrator synthesis**: checks claims, compares the lineages and writes the ranked recommendation.

### Data Flow
Each lineage's iterations append to `research/lineages/<label>/deep-research-state.jsonl`; `fanout-merge.cjs` merges the registries and the orchestrator reads both lineages into `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each load-bearing citation is reread before it reaches the synthesis, each quoted command is rerun, and every experiment a lineage reports is rerun in the orchestrator's own throwaway copy. The criteria in `goal.md` check the synthesis shape.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`devin`, `node` and `git` on the PATH; `pi` only as the named fallback.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `research/` and revert the epic's phase rows. No skill, script or README changes.
<!-- /ANCHOR:rollback -->

---
