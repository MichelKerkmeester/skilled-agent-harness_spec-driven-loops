---
title: "Implementation Plan: Phase 8: authored-classifier-fixture"
description: "One cli-pi build copies the served fixture over the authored one; the orchestrator compares every traced file and runs the canaries over both trees."
trigger_phrases:
  - "authored classifier fixture plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: authored-classifier-fixture

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON fixtures |
| **Framework** | compiled-routing canary harness |
| **Storage** | None |
| **Testing** | cmp and the canary runners |

### Overview
One cli-pi build copies the served fixture over the authored one; the orchestrator compares every traced file and runs the canaries over both trees.
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
Other: a single-file change dispatched to a cli-pi builder, verified by the orchestrator.

### Key Components
- **Authored fixture**: what a rebuild copies
- **Authored canary runner**: the all-canaries script with its base set to the authored tree

### Data Flow
The orchestrator writes a one-change brief, the builder edits the named file, and the orchestrator reruns the proving command.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the authored canary runner before (throws GOLD_MISMATCH, exit 1) and after (0 failures), cmp every traced file, then rerun `--check`, the guard and the served canaries.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `pi` binary with the llmgateway credential, or cline-pass as the fallback route.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's single commit with `git revert`.
<!-- /ANCHOR:rollback -->

---
