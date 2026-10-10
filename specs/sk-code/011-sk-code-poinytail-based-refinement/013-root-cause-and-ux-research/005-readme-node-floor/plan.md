---
title: "Implementation Plan: Phase 5: readme-node-floor"
description: "One cli-pi build replaces one README line; the orchestrator rechecks the lockfile floors and validates the README."
trigger_phrases:
  - "readme node floor plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: readme-node-floor

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc README rules |
| **Storage** | None |
| **Testing** | validate_document.py |

### Overview
One cli-pi build replaces one README line; the orchestrator rechecks the lockfile floors and validates the README.
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
- **Root README prerequisites**: the first thing an adopter reads
- **Advisor runtime lockfile**: the source of the 20.19 floor

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

Read the engines of every non-optional package in the advisor runtime and spec-kit lockfiles, then validate the README.
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
