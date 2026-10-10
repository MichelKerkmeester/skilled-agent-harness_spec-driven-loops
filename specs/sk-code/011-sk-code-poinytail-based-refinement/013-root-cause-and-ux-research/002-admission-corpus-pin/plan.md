---
title: "Implementation Plan: Phase 2: admission-corpus-pin"
description: "One cli-pi build changes the pinned number; the orchestrator reruns the admission report into this phase's evidence folder."
trigger_phrases:
  - "admission corpus pin plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: admission-corpus-pin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | node:test |
| **Storage** | None |
| **Testing** | node --test |

### Overview
One cli-pi build changes the pinned number; the orchestrator reruns the admission report into this phase's evidence folder.
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
- **Admission test**: pins the live gold corpus size
- **Admission CLI**: writes the report the pin guards

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

Run the admission suite before and after, and rerun `compiled-route-admission.cjs --all --warn-only --out evidence`.
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
