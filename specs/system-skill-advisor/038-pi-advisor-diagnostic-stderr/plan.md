---
title: "Implementation Plan: Pi advisor diagnostic on stderr"
description: "The Pi bridge passes a no-op diagnostic writer to the in-process advisor hook, so the hook stops writing its diagnostic record onto Pi's terminal."
trigger_phrases:
  - "pi advisor diagnostic stderr plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi advisor diagnostic on stderr

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Pi loads the bridge source directly) |
| **Framework** | Pi extension API |
| **Storage** | None (the hook persists diagnostics itself) |
| **Testing** | Vitest |

### Overview
The advisor hook accepts a `writeDiagnostic` dependency and defaults it to stderr. The Pi bridge runs the hook in Pi's own process, so it now passes a no-op writer. The hook's separate persist step keeps the record on disk.
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
Dependency injection at the existing hook seam

### Key Components
- **`hooks/pi/prompt-advisor.ts`**: the Pi input handler that calls the hook in-process
- **`hooks/claude/user-prompt-submit.ts`**: the shared hook, whose `emitDiagnostic` writes through the injected writer

### Data Flow
Pi input event, then the bridge, then `handleClaudeUserPromptSubmit`, then `emitDiagnostic`, which calls the no-op writer and persists the record.
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

Revert the two-file change. Nothing else depends on it.
<!-- /ANCHOR:rollback -->

---

