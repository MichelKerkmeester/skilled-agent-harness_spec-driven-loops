---
title: "Implementation Plan: Phase 6: research-lineage-reducer-path"
description: "Copy the deep-review reducer artifact-folder pattern into deep-research: a reducer flag, then workflow wiring, each delivered by its own delegate."
trigger_phrases:
  - "research lineage reducer path plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: research-lineage-reducer-path

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, workflow YAML |
| **Framework** | Deep-loop runtime |
| **Storage** | Research artifact folders on disk |
| **Testing** | Vitest (`runtime/tests/unit`) |

### Overview
Two sequential changes, each dispatched to a fresh Claude Haiku 5.5 agent at max effort. The first adds `--artifact-dir` to the deep-research reducer with a unit test. The second binds `reducer_artifact_arg` in both research workflows, passes it on the five per-iteration reducer calls and regenerates the compiled contract. Baseline before either change: 8 test files, 84 tests passing, and the compiled contract matching its sources.
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
Copy an existing precedent, the deep-review `step_bind_reducer_artifact_arg`

### Key Components
- **Research reducer**: resolves its output folder, now from an explicit folder when given.
- **Research workflows**: bind the lineage folder during fan-out and pass it to the reducer.

### Data Flow
A lineage binds `artifact_dir` to `research/lineages/<label>/`. The bind step turns that into `--artifact-dir <folder>`, and each per-iteration reducer call carries it, so the registry, dashboard and strategy refresh inside the lineage.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---

