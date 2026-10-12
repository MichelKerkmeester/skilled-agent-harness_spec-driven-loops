---
title: "Implementation Plan: Phase 25: external-surface-priority-research"
description: "Run /deep:research as two ten-iteration lineages, cli-devin DeepSeek V4.1 Flash max and cli-codex GPT-6 Luna max fast, then check every cited line and write the merged synthesis."
trigger_phrases:
  - "external surface priority research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 25: external-surface-priority-research

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
| **Testing** | Spot-checks of cited lines, a rerun of the delete experiment, strict spec validation |

### Overview
The `/deep:research` workflow runs two lineages of ten iterations on the questions in `spec.md`: lineage A on `cli-devin` with `deepseek-v4-1-flash-max`, lineage B on `cli-codex` with `gpt-6-luna` at `max` effort on the `fast` tier. Each iteration is a fresh foreground dispatch, A then B. The orchestrator then checks the cited lines, reruns the delete experiment, and writes `research/research.md` with the shape `spec.md` REQ-002 to REQ-005 define.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a two-lineage deep-research fan-out with orchestrator-side merge and synthesis.

### Key Components
- **`/deep:research`**: runs the iterations and keeps each lineage's state log.
- **`cli-devin` and `cli-codex`**: one executor per lineage.
- **Orchestrator synthesis**: checks claims, compares the lineages and writes the ranked recommendation.

### Data Flow
Each lineage's iterations append to `research/lineages/<label>/deep-research-state.jsonl`; the orchestrator reads both lineages into `research/research.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each cited path:line is read before it reaches the synthesis, each quoted command is rerun, and the delete experiment is rerun by the orchestrator in its own throwaway copy. The criteria in `goal.md` check the synthesis shape.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`devin`, `codex` and `node` on the PATH.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `research/`. No skill, script or README changes.
<!-- /ANCHOR:rollback -->

---
