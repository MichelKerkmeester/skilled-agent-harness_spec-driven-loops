---
title: "Implementation Plan: Phase 1: hook-stdin-deadlines"
description: "Write one failing-before test per hook family, then replace each local for-await reader with the shared deadline reader the hooks tree already exports, using the import style each file already uses for that tree."
trigger_phrases:
  - "hook stdin deadlines plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: hook-stdin-deadlines

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM hooks, node:test |
| **Framework** | None |
| **Storage** | None |
| **Testing** | node:test spawn tests with stdin held open |

### Overview
Write one failing-before test per hook family, then replace each local for-await reader with the shared deadline reader the hooks tree already exports, using the import style each file already uses for that tree.
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
Reuse of an existing shared helper

### Key Components
- **`readStdin` in `.skilled/hooks/shared/hook-adapter-shared.cjs`**: settles on end, error or a 3000 ms deadline, then releases its listeners and pauses stdin
- **Spawn tests**: hold the child's stdin open, SIGKILL at 6000 ms as a net, and require exit 0 in under 4500 ms

### Data Flow
The host writes a JSON payload to the hook's stdin. The shared reader returns it at end of stream, or returns what has arrived at 3000 ms. The hook parses it and fails open on an empty or partial payload.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new test ran once against the unedited hooks and failed: both sk-git cases were SIGKILLed at about 6000 ms with code null, and the sk-vision case failed at 6006 ms. After the fix all three pass in about 3.05 s.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the components named in the architecture.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. No state, data or generated file outlives it.
<!-- /ANCHOR:rollback -->

---
