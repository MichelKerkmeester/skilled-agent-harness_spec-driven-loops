---
title: "Implementation Plan: Fix: deep-research run open"
description: "Mirror packet 039 for deep-research: the run-open step records `run_initialized` through the append gateway, the census marks it spoken, and fan-out lineages take the same path.."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fix: deep-research run open

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
| -------- | ------- |
| **Language/Stack** | YAML workflow assets and TypeScript |
| **Framework** | None |
| **Storage** | Ledger frames and JSONL state projections |
| **Testing** | Vitest |

### Overview
Mirror packet 039 for deep-research: the run-open step records `run_initialized` through the append gateway, the census marks it spoken, and fan-out lineages take the same path.
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
- **Init step**: records `run_initialized` through `append-mode-event.cjs`
- **Census**: `run_initialized` spoken by both workflows

### Data Flow
The workflow records `run_initialized`, the gateway projects a config row from it, and each later append projects config then iterations.
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
- Packet `system-deep-loop/039-review-state-init-and-dispatch` as the pattern
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commit. Runs opened under the change keep their ledger; a restart reopens them under the old path.
<!-- /ANCHOR:rollback -->

---

