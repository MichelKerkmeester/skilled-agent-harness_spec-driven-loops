---
title: "Implementation Plan: Phase 28: ci-red-checks-after-vibe-and-loop-counters"
description: "Fix each of the five inputs behind the red checks, then run the CLI vitest project, the Vibe mirror checks, the router check and the deep-loop convergence suites."
trigger_phrases:
  - "ci red checks after vibe and loop counters plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 28: ci-red-checks-after-vibe-and-loop-counters

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, TypeScript tests, JSON, Markdown |
| **Framework** | vitest, `node:test` |
| **Storage** | None |
| **Testing** | The CLI vitest project, the Vibe mirror checks, `generate-command-routers.cjs --check` |

### Overview
Each failure has one input to fix. The CI-only conditions, a missing private command and a missing tsx, are reproduced locally by moving the file away.
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
- [x] The CLI vitest project passes
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix the input, not the gate.

### Key Components
- **Vibe prompt sync**: compares `.vibe/prompts/` with every command source on disk
- **Command contract**: names each family's per-command asset paths for the router check
- **`convergence.cjs`**: exports loop helpers and also runs as a script under a tsx child

### Data Flow
A module that only imports the helpers never enters the script branch, so tsx resolves only on that branch.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run each failing check before and after, and reproduce each CI-only condition locally.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: either workflow fails after merge. Revert the commit.
<!-- /ANCHOR:rollback -->

---
