---
title: "Implementation Plan: Fan-out review focus input for deep-review"
description: "Adds an optional review focus that fanout-run.cjs normalizes and binds into every review lineage, and that both review workflows store in the config and render into every iteration prompt."
trigger_phrases:
  - "fanout review focus plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Fan-out review focus input for deep-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, workflow YAML, Markdown command contracts |
| **Framework** | system-deep-loop runtime |
| **Storage** | `deep-review-config.json` per lineage |
| **Testing** | Vitest from `.skilled/skills/system-deep-loop/runtime` |

### Overview
The focus enters as `--review-focus` or a pre-bound `review_focus` answer. `fanout-run.cjs` normalizes it and adds it to each lineage prompt. Each lineage, and the single-executor run, stores it as `reviewFocus` and renders it into every iteration prompt through a new prompt-pack token.
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
Additive setup binding.

### Key Components
- **`fanout-run.cjs`**: normalizes the focus once and writes it into each CLI lineage prompt and each native lineage command input.
- **Review workflows**: normalize the focus at init, store `reviewFocus`, bind `review_focus_block` for each iteration and list the focus in the report.
- **Iteration prompt pack**: renders `{review_focus_block}` under the dimensions.

### Data Flow
Flag or pre-bound answer, then `step_fanout_spawn_cli` passes the raw text to `fanout-run.cjs`, which adds `review_focus:` to each lineage's setup bindings. The lineage runs the workflow, which writes `reviewFocus` to its config, reads it back each iteration as `review_focus_block` and renders it into the iteration prompt. A single-executor run takes the same path from the init step onward.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `npx vitest run --no-coverage tests/fanout-review-focus.vitest.ts` from the runtime root, then the fan-out, deep-review, contract and prompt-pack suites, then the contract drift check and the three mirror checks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the existing runtime. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped files listed in `spec.md`, then regenerate the compiled contract with `compile-command-contracts.cjs --command deep/review --write`.
<!-- /ANCHOR:rollback -->

---
