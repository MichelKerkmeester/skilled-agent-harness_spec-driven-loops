---
title: "Implementation Plan: Phase 1: rename-impact-research"
description: "Run /deep:research for five iterations on DeepSeek V4.1 Flash Max through cli-devin to map every reference to the sk-code-opencode surface and plan the rename."
trigger_phrases:
  - "rename impact research plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: rename-impact-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, CommonJS, shell (read-only investigation) |
| **Framework** | Skilled framework (sk-code hub, system-skill-advisor, system-spec-kit) |
| **Storage** | Git-tracked files; advisor SQLite DB and trigger index rebuilt from them |
| **Testing** | node --test, vitest, python unittest, the hub drift guards and `validate.sh --strict` |

### Overview
The phase runs the `/deep:research:auto` workflow with executor `cli-devin` and model `deepseek-v4-1-flash-max` for five iterations with stop policy `max-iterations`. Each iteration investigates one research question read-only and writes its findings under `research/`; the workflow then synthesizes `research/research.md`.
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
Iterative research loop with externalized state

### Key Components
- **deep-research auto workflow**: owns setup, per-iteration dispatch, reducer sync and synthesis
- **cli-devin executor**: runs each iteration headless on the allowlisted DeepSeek model
- **research/research.md**: the synthesized inventory, exclusions and ordered rename plan

### Data Flow
The workflow renders a prompt per iteration from the strategy and state log, cli-devin runs it, `verify-iteration.cjs` checks the output, and `reduce-state.cjs` folds it back into the strategy before the next iteration.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each iteration passed `verify-iteration.cjs` on its first dispatch. The phase closes on `validate.sh --strict` for this folder.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `devin` CLI with model `deepseek-v4-1-flash-max` on the cli-devin allowlist.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The phase writes only under its own folder; deleting `research/` reverts it.
<!-- /ANCHOR:rollback -->

---
