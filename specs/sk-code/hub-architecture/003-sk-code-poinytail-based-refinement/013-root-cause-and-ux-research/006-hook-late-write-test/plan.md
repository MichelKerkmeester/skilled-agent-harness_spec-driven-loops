---
title: "Implementation Plan: Phase 6: hook-late-write-test"
description: "Three one-change cli-pi builds: the test, the changelog, the version line. The orchestrator ran a mutant of the test that must fail, then regenerated the Hermes copy and the trigger index."
trigger_phrases:
  - "hook late write test plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: hook-late-write-test

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM |
| **Framework** | node:test |
| **Storage** | None |
| **Testing** | node --test |

### Overview
Three one-change cli-pi builds: the test, the changelog, the version line. The orchestrator ran a mutant of the test that must fail, then regenerated the Hermes copy and the trigger index.
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
- **Spawn helper `runHook`**: gains a write delay
- **Prompt-submit shim**: the short-deadline entry under test

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

Run the suite before and after. Then run a mutant copy with the delay at 100 ms, which must fail on the `{}` assertion because the payload arrives in time.
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
