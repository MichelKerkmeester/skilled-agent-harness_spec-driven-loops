---
title: "Implementation Plan: Phase 9: pi-guard-classification"
description: "Seven short cli-pi builds, each one change: negative tests, the command-position rule, wrapper tests, the inspector unwrap, the resolver unwrap, the deny-text test and text, then the two docs."
trigger_phrases:
  - "pi guard classification plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: pi-guard-classification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM and TypeScript |
| **Framework** | vitest and node:test |
| **Storage** | None |
| **Testing** | The inspector, Pi lint and rule-checks suites |

### Overview
Seven short cli-pi builds, each one change: negative tests, the command-position rule, wrapper tests, the inspector unwrap, the resolver unwrap, the deny-text test and text, then the two docs.
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
- **inspectDispatch**: the shared classifier every dispatch hook calls
- **resolveSegment**: the hook resolver that maps a segment to a skill
- **Pi tool_call guard**: turns the classification into allow or deny

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

Each new test ran red before its fix. After the inspector unwrap, the rule-checks suite failed its `bash -c` jev case, which drove the resolver fix; the whole dispatch tree then passed.
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
