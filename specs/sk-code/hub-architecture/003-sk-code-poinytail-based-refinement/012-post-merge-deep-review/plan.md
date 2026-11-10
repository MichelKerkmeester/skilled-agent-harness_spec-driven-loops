---
title: "Implementation Plan: Post-merge deep review"
description: "Run the deep-review auto workflow for ten iterations on cli-pi DeepSeek V4.1 Flash, then confirm each finding by rerun or read before it reaches the report."
trigger_phrases:
  - "post merge deep review plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Post-merge deep review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js runtime scripts, Markdown and JSON spec docs |
| **Framework** | `/deep:review:auto` single-executor workflow |
| **Storage** | `review/` state: ledger, state log, registry, iterations, deltas |
| **Testing** | Reruns of the existing guards, test files and canaries named in the report |

### Overview
The orchestrator runs the auto workflow YAML step by step: it renders each iteration prompt, dispatches it through the shared cli-pi command builder, verifies the outputs, records claim adjudication and reduces state. Each iteration gets one assigned focus from the strategy plan. The orchestrator then reruns or reads every finding and writes the confirmed ones into the review report.
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
Externalized-state review loop with one fresh executor process per iteration.

### Key Components
- **`deep-review-auto.yaml`**: Owns the per-iteration steps the orchestrator executes
- **`buildLineageCommand` in `fanout-run.cjs`**: Builds the `pi -p --offline` dispatch with the enforced model allowlist and effort pin
- **`reduce-state.cjs`**: Rebuilds the findings registry, dashboard and strategy after each iteration

### Data Flow
Rendered prompt, then the pi executor writes the iteration narrative, delta and gateway record, then verification and reduction update the registry, then the next prompt reads it.
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

Revert the single packet commit. No product file changes.
<!-- /ANCHOR:rollback -->

---

