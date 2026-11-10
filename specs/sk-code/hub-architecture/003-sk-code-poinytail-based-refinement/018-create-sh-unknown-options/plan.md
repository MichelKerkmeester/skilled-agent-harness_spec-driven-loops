---
title: "Implementation Plan: Phase 18: create-sh-unknown-options"
description: "Add one unknown-option branch above the catch-all in create.sh's argument loop, cover it with a vitest that fails on the old script, and fix the callers that passed a flag the parser never had."
trigger_phrases:
  - "create sh unknown options plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 18: create-sh-unknown-options

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and TypeScript (vitest) |
| **Framework** | The system-spec-kit runtime CLI |
| **Storage** | None |
| **Testing** | The create-*.vitest.ts set and strict spec validation |

### Overview
Sweep every caller of create.sh for the flags it passes, then add a `-?*)` branch above the catch-all that prints the error and exits 1. A temporary workspace test proves `--with-goal` still writes goal.md and `--goal` now fails without writing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All goal.md criteria pass on the orchestrator's rerun
- [x] The edge test fails on the pre-fix script
- [x] Strict validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend the existing argument loop in place. No new option, alias or helper.

### Key Components
- **Unknown-option branch**: matches any argument that starts with a dash and has at least one more character, after every known option has had its chance to match.
- **Test**: copies create.sh, its libraries and templates into a temporary git repository, as the other create tests do.

### Data Flow
Arguments, then the case match, then either a known option, the new error or the title words.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The goal.md criteria are the tests. The create test set runs on the pre-fix script first as a baseline, then on the fixed one.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the files named in spec.md.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commit. No other phase depends on its files.
<!-- /ANCHOR:rollback -->

---
