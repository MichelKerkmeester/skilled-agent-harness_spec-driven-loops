---
title: "Implementation Plan: Runtime surfaces"
description: "Adapt each runtime surface to the packet-backed core, one runtime at a time, each with its command template and hook contract honored."
trigger_phrases:
  - "goal command every runtime"
  - "goal-pi goal-opencode goal-cursor goal-devin"
  - "claude code goal nesting"
  - "codex goal nesting"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Runtime surfaces

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS/ESM/TS, Markdown commands |
| **Framework** | Per-runtime hook APIs |
| **Storage** | Packet goal.md |
| **Testing** | node:test, manual playbooks |

### Overview
Adapt each runtime surface to the packet-backed core, one runtime at a time, each with its command template and hook contract honored.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential phase inside a phased packet; surgical edits over existing files

### Key Components
- **goal-opencode.md + opencode-goal.js**: OpenCode surface
- **goal-context.ts**: Pi surface
- **goal-inject.mjs + goal-cursor.md**: Cursor surface
- **devin hook**: Devin surface
- **claude/codex entries**: Nesting reach without /goal

### Data Flow
runtime event → adapter → goal-core packet resolver → stripped brief
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

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---

