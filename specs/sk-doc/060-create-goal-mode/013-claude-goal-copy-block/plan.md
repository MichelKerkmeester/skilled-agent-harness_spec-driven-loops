---
title: "Implementation Plan: Phase 13: claude-goal-copy-block"
description: "Add one presentation rule to the goal docs: on Claude Code the chat slice is sent as one fenced code block. The full rule lives in budget-and-handoff section 4 and every send surface points to it or repeats the one sentence."
trigger_phrases:
  - "claude goal copy block plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: claude-goal-copy-block

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML and plain text |
| **Framework** | sk-create-goal, system-spec-kit and speckit workflow assets |
| **Storage** | None |
| **Testing** | YAML parse, `validate_document.py`, `validate-playbook-package.cjs` |

### Overview
Put the full Claude Code fence rule in `budget-and-handoff.md` section 4, repeat one sentence where a surface tells the agent to send the slice, and leave every other surface as a pointer. Cover the rule in the two Claude send playbook scenarios. No code changes.
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
Documentation only: one home for the rule, short repeats at the send points.

### Key Components
- **`budget-and-handoff.md` section 4**: the full rule and the fence choice.
- **Send points**: `AGENTS.md`, the set-string playbook and the workflow YAMLs, each with the one sentence.

### Data Flow
`goal.cjs packet` prints the `chat_slice`, the agent wraps it in one fence on Claude Code and the operator copies it into `/goal`.
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

