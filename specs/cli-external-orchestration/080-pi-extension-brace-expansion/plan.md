---
title: "Implementation Plan: Bump brace-expansion in two Pi extension lockfiles to close four Dependabot alerts"
description: "Remove the nested brace-expansion entry from each lockfile and let npm re-resolve it within its declared range."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Bump brace-expansion in two Pi extension lockfiles to close four Dependabot alerts

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | npm lockfiles |
| **Framework** | Pi extensions |
| **Storage** | None |
| **Testing** | `npm audit --package-lock-only` and a version diff |

### Overview
The vulnerable copy sits under `@earendil-works/pi-coding-agent/node_modules`, where `npm update` and `npm audit fix --package-lock-only` did not reach it. Deleting that one entry and running `npm install --package-lock-only --ignore-scripts` re-resolves it to 5.0.12, hoisted to the top level with its dependency `balanced-match`. Each step ran on a scratch copy first.
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
Lockfile re-resolution

### Key Components
- **`minimatch` under `pi-coding-agent`**: declares `brace-expansion ^5.0.8`, which 5.0.12 satisfies

### Data Flow
npm resolves `minimatch`'s dependency to the hoisted 5.0.12 copy.
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

Revert the commit; both lockfiles return to 5.0.9.
<!-- /ANCHOR:rollback -->

---

