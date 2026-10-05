---
title: "Implementation Plan: Run the skill advisor stress suite in CI"
description: "Add one path-filtered workflow modeled on the deep-loop runtime workflow and list it in the README."
trigger_phrases:
  - "stress suite ci plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Run the skill advisor stress suite in CI

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML |
| **Framework** | Vitest stress config |
| **Storage** | None |
| **Testing** | Local run of the workflow command, gate-inputs check, first CI run |

### Overview
The job installs the `.skilled` package for the plugin, the spec-kit workspace and its shared build for the test setup, and the advisor runtime, then runs the stress script with the stress config.
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
One path-filtered job per suite, as the deep-loop runtime workflow does.

### Key Components
- **Triggers**: push and pull request on main and release lines, filtered to the advisor runtime, launcher, launcher libraries, plugin and spec-kit test support
- **Job**: install, then `npm run test:stress -- --config vitest.stress.config.ts`

### Data Flow
Push touches an advisor input, the workflow installs and runs the stress suite.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The workflow's own command passes 64 of 64 locally in about 30 seconds. `check-gate-inputs.sh` passes with 0 failures. The workflows README validates with 0 issues.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the workflow and its README rows.
<!-- /ANCHOR:rollback -->

---
