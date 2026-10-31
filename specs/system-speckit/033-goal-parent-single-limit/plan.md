---
title: "Implementation Plan: Make 4000 characters the one limit for a parent goal durable slice"
description: "Drop the 3000 warning tier from the goal budget manifest, the validator and the runtime goal-slice module, so a parent goal passes up to 4000 durable characters and fails only past it, and restate that one limit everywhere it is described."
trigger_phrases:
  - "parent goal limit"
  - "goal durable budget"
  - "goal warning tier"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Make 4000 characters the one limit for a parent goal durable slice

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (validator), CommonJS and ESM (goal hook and OpenCode plugin) |
| **Framework** | None |
| **Storage** | `templates/spec-kit-docs.json` holds the limit |
| **Testing** | Vitest (`root` and `cli` projects) and `node --test` for the goal hook and plugin |

### Overview
The manifest's `goalDurableBudget` loses `warnChars` and keeps `errorChars: 4000`. The validator's resolver and the runtime's resolver read only that number, the validator's warning branch goes, and the runtime budget state is `ok` up to the limit and `over` past it. Every document that quoted the pair now quotes the one limit.
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
One number in one manifest, read by two resolvers.

### Key Components
- **`resolveGoalDurableBudget`** (validator): returns `{ errorChars }`, and throws only when that number is not a positive integer
- **`resolveGoalBudget`** (runtime): returns `{ errorChars }` or null, ignoring any leftover `warnChars`
- **`budgetState`**: `unknown` with no budget, `over` past the limit, otherwise `ok`

### Data Flow
`validate.sh` measures the durable slice and fails past the limit. `goal.cjs packet` and `bind` and the OpenCode plugin measure the same slice from the same manifest and report `ok` or `over`; `bind` adds a warning line only when over.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Synthetic copies of a real phase parent under `$TMPDIR`, padded to 3500, 4000 and 4001 durable characters, run through `goal.cjs packet`, `goal.cjs bind`, the OpenCode `bind` and `validate.sh` before and after the change. The goal-slice boundary test runs against the previous module to show it catches the old tier.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The runtime dist must be rebuilt after the TypeScript change, because `validate.sh` runs the compiled orchestrator.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the change and rebuild the runtime dist. No persisted goal state records a budget state, so nothing needs migrating.
<!-- /ANCHOR:rollback -->

---
