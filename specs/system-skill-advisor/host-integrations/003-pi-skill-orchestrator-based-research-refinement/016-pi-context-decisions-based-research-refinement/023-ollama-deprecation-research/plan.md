---
title: "Implementation Plan: Phase 23: ollama-deprecation-research"
description: "A five-iteration deep-research run maps every Ollama and embedding remnant and designs the removal order, the user-machine cleanup and the residue check. Nothing outside this folder changes."
trigger_phrases:
  - "ollama deprecation research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 23: ollama-deprecation-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, YAML and Markdown in `.skilled/` (read only) |
| **Framework** | `/deep:research` workflow, `deep-research.yaml` |
| **Storage** | The run's JSONL state, ledger and iteration files under `research/` |
| **Testing** | `verify-iteration.cjs` per iteration and `validate.sh --strict` on this phase |

### Overview
Five deep-research iterations, each a fresh Fable 5.2 high session on the claude2 account, answer five questions about removing the lane. The workflow's reducer, append gateway and convergence script own the state. The synthesis lands in `research/research.md`.
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
- [x] `verify-iteration.cjs` prints `OK iteration N complete` for N from 1 to 5, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized iterative research loop.

### Key Components
- **`research/` state**: config, ledger-backed state log, strategy, registry and dashboard, written only by the workflow's scripts.
- **Iteration leaf**: one claude2 session per iteration that writes its narrative, its delta and one gateway record.

### Data Flow
Each iteration reads the strategy and earlier iterations, writes its own three artifacts, and the reducer folds them into the strategy, registry and dashboard before the next prompt renders.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup scaffolds the packet and initializes the run, Implementation runs the five iterations, Verification synthesizes and validates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`verify-iteration.cjs --loop-type research --iteration N` must exit 0 for each iteration, and `validate.sh --strict` on this phase must print `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `claude2` account (`~/.claude-account2` and its OAuth token) and the `claude-fable-5-2` model id.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing outside this folder changes, so rollback is deleting this phase folder and its parent phase-map row.
<!-- /ANCHOR:rollback -->

---
