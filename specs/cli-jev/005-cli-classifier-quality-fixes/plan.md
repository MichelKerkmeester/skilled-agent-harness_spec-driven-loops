---
title: "Implementation Plan: cli-classifier quality fixes"
description: "Fixes the required findings from the cli-classifier quality research: five cli-jev docs without an Overview, a backwards transport sentence, a caller that records Pi answers as Jev, two transport edge cases and three stale doc lines."
trigger_phrases:
  - "cli-classifier fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-classifier quality fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node `.mjs`/`.cjs`, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, `validate_document.py` |

### Overview
DeepSeek V4.1 Flash max on cli-pi through OpenCode Go writes the three code fixes, one change per brief, each with a failing-first test. The orchestrator makes the doc edits, checks every diff, reruns the suites against the baseline and sends the code diff to Luna for a read-only review.
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
Targeted fixes, no new modules.

### Key Components
- **`jev-transport.mjs`**: the shared route switch the scorers call.
- **`score-clarify-default.cjs`**: the one caller that did not record the route.

### Data Flow
A scorer calls `spawnClassifierCall`, which answers through Pi or the jev CLI and returns `transport`. The scorer writes that value into each call record.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each code fix adds one test that fails before the change. The full suite set from the baseline is rerun after all fixes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `pi` binary with the OpenCode Go provider, and `codex` for the review.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the fix commit. No data or generated state changes.
<!-- /ANCHOR:rollback -->

---

