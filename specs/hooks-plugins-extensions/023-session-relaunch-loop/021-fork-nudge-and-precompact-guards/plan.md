---
title: "Implementation Plan: Phase 21: fork-nudge-and-precompact-guards"
description: "Skip the context nudge and the PreCompact cache write when a payload carries agent_id, built tests first by DeepSeek."
trigger_phrases:
  - "fork nudge and precompact guards plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 21: fork-nudge-and-precompact-guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (`.mjs` hook), TypeScript (spec-kit runtime) |
| **Framework** | Claude Code PostToolUse and PreCompact hooks |
| **Storage** | None |
| **Testing** | node:test, Vitest |

### Overview
A probe showed a fork's PostToolUse payload carries `agent_id`. Both hooks now return early on a non-empty `agent_id`.
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
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guard clauses in hooks

### Key Components
- **`context-nudge.mjs`**: returns before measuring fill when `agent_id` is present.
- **`isSubagentPayload` in `compact-inject.ts`**: gates the cache write and boundary signal.

### Data Flow
Payload to the hook, then an early exit for a sub-agent, else the existing path.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Tests first for both. An end-to-end run fed a fork payload to the built PreCompact hook.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit and rebuild the spec-kit runtime.
<!-- /ANCHOR:rollback -->

---

