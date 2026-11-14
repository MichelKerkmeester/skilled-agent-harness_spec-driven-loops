---
title: "Implementation Plan: Phase 1: deep-research"
description: "Run a /deep:research loop over the eight angles in research-angles.md, then merge the lineages into a synthesis with a cli-opencode parity table and a ranked phase plan."
trigger_phrases:
  - "mistral vibe deep research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: deep-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research markdown and JSONL state |
| **Framework** | `/deep:research` loop |
| **Storage** | `research/` in this phase folder |
| **Testing** | `validate.sh --strict` and the synthesis's citation check |

### Overview
The `/deep:research` command runs the angles in `research-angles.md`, one per iteration, across two lineages on different model families so each angle gets two independent readings. A synthesis step merges them and writes the phase plan.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `research-angles.md` names the angles, evidence rules and bounds
- [x] The operator approved installing `mistral-vibe` and chose the executors

### Definition of Done
- [x] `research/research.md` and `research/phase-plan.md` exist
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Iterative research loop.

### Key Components
- **`research-angles.md`**: the brief every iteration reads first.
- **`/deep:research`**: the loop, its state files and convergence check.

### Data Flow
Each iteration reads the brief and prior state, writes one iteration file, and the synthesis reads all of them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup installs Vibe after the operator's yes and captures `vibe --help` and `vibe --version`. Implementation runs `/deep:research` over the angles. Verification checks every angle has cited answers and the phase plan names the build phases. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The synthesis is checked by sampling citations against their sources, and the phase plan by scaffolding its first phase without a new question.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`mistral-vibe` from PyPI via `uv tool install mistral-vibe`, after the operator's yes. Rollback: `uv tool uninstall mistral-vibe`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research writes only under `research/`. Trigger: the run is abandoned. Delete `research/` and uninstall Vibe.
<!-- /ANCHOR:rollback -->

---
