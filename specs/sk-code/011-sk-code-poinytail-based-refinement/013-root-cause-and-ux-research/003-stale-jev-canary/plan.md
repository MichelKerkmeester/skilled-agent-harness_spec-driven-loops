---
title: "Implementation Plan: Phase 3: stale-jev-canary"
description: "One cli-pi build deletes the stale case from both fixture copies; the orchestrator reruns every hub canary and the guard."
trigger_phrases:
  - "stale jev canary plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: stale-jev-canary

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
| **Testing** | all-canaries script |

### Overview
One cli-pi build deletes the stale case from both fixture copies; the orchestrator reruns every hub canary and the guard.
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
- **Live fixture**: read by the served canary harness
- **Authored fixture**: the source the rebuild copies

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

Run the all-canaries script from round four's phase 003, the guard and `compiled-route-sync.cjs --check` before and after.
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
