---
title: "Implementation Plan: Phase 1: research"
description: "Run a ten-iteration /deep:research loop on cli-opencode with hy4-flash-free at high reasoning, then check its synthesis against the eight key questions."
trigger_phrases:
  - "research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSONL research artifacts |
| **Framework** | `/deep:research` workflow (`.skilled/commands/deep/assets/deep-research.yaml`) |
| **Storage** | `research/` in this folder |
| **Testing** | `rg` counts over the state log and synthesis headings |

### Overview
The phase runs one deep-research lineage on the `cli-opencode` executor for exactly ten iterations. The single-executor state lands in `research/deep-research-state.jsonl` and `research/iterations/iteration-NNN.md` (`deep-research.yaml` lines 215 and 225). The orchestrator then checks `research/research.md` against KQ1-KQ8 in `spec.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met: accepted by operator with known closeout gap
- [x] `rg -c '"type":"iteration"' research/deep-research-state.jsonl` prints 10 (printed 12 after the operator-approved extension)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage research loop

### Key Components
- **`/deep:research:auto`**: owns the loop, convergence telemetry and synthesis.
- **`cli-opencode` executor**: runs each iteration as `opencode run --standalone -m opencode-go/hy4-flash-free#high` (`.skilled/commands/deep/assets/deep-research-presentation.txt` line 194).

### Data Flow
The charter in `spec.md` seeds the topic. Each iteration reads local files and the Bladebro repository, appends a state record and writes one iteration file. Synthesis folds the ten iterations into `research/research.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the executor model resolves and the run has a clean repository. Implementation runs `/deep:research:auto` for ten iterations with `--stop-policy=max-iterations`. Verification counts the iteration records and checks `research/research.md` for all eight key questions and five downstream sections. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`rg -c '"type":"iteration"' research/deep-research-state.jsonl` must print 10, and `rg -o 'KQ[1-8]' research/research.md | sort -u | wc -l` must print 8, with each of 002-006 named in the synthesis.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`opencode` with an opencode-go login, `node` for the deep-loop runtime scripts, and network access to github.com/dondai44423/bladebro.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the lineage fails or answers fewer than eight questions. Archive `research/` with `--restart` on the next `/deep:research:auto` run; nothing outside this folder changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
