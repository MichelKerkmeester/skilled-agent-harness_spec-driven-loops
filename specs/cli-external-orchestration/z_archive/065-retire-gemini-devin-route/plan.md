---
title: "Implementation Plan: Retire the Gemini 3.8 Flash route from cli-devin"
description: "Drop one uid from two runtime allowlists and one test, and remove the family from two cli-devin documents with a note that records the cost reason."
trigger_phrases:
  - "devin allowlist edit plan"
  - "retire gemini devin route"
  - "fanout allowlist test update"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Retire the Gemini 3.8 Flash route from cli-devin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS |
| **Framework** | system-deep-loop runtime |
| **Storage** | None |
| **Testing** | vitest |

### Overview
Drop one uid from two runtime allowlists and one test, and remove the family from two cli-devin documents with a note that records the cost reason. The cursor allowlist keeps the model.
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
Enforced allowlist edit

### Key Components
- **DEVIN_SUPPORTED_MODELS**: the typed roster in executor-config.ts
- **DEVIN_ALLOWED_MODELS**: the enforced set the fan-out checks before building a command

### Data Flow
A lineage config names a model; the fan-out checks it against the enforced set and fails closed with the allowlist in the error when it is absent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The fan-out allowlist test moves the uid from the accepted list to the rejected list; both deep-loop unit files run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single commit; the uid returns to both allowlists and the docs.
<!-- /ANCHOR:rollback -->

---
