---
title: "Implementation Plan: Fix: fan-out runner, merge and lineage prompt"
description: "Widen the merge's finding-text fields, make the runner fail fast on a projection refusal, and add three lines to the deep-research iteration prompt pack.."
trigger_phrases:
  - "fanout runner and prompt fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fix: fan-out runner, merge and lineage prompt

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
| -------- | ------- |
| **Language/Stack** | Node.js (CommonJS) and a Markdown prompt template |
| **Framework** | None |
| **Storage** | Ledger frames and JSONL state projections |
| **Testing** | Vitest |

### Overview
Widen the merge's finding-text fields, make the runner fail fast on a projection refusal, and add three lines to the deep-research iteration prompt pack.
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
Other: a workflow step plus the deep-loop runtime

### Key Components
- **Merge**: reads `claim` and `summary`, warns on unreadable rows
- **Runner**: projection refusal is non-retryable
- **Prompt pack**: field name, contradiction rule, verbatim lineage-path rule
- **Runner**: absolute lineage directory in the lineage prompt

### Data Flow
A lineage writes findings and events, the runner classifies its exit, and the merge reads every finding into the registry.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each fix gets a case in the existing suite, and one real run checks the end-to-end path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- the deviations table in `048-jev-feature-improvement-research/goal.md`
- Packet `system-deep-loop/038-review-and-cli-lineage/002-review-state-init-and-dispatch` as the pattern
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commit. Runs opened under the change keep their ledger; a restart reopens them under the old path.
<!-- /ANCHOR:rollback -->

---

