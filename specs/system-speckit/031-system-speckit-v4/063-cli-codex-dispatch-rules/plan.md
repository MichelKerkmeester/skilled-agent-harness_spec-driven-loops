---
title: "Implementation Plan: Phase 63: cli-codex dispatch rules"
description: "Rewrite cli-codex's fan-out rule and Execution Ownership text to cover only research and review lineages, add the sandbox IPC limit as a dispatch gotcha, and version the change."
trigger_phrases:
  - "cli codex dispatch rules plan"
  - "cli codex fanout scope plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 63: cli-codex dispatch rules

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | A skill packet inside the cli-external-orchestration hub |
| **Storage** | `cli-codex/SKILL.md` and its changelog folder |
| **Testing** | sk-doc document validation; the compiled-route guard |

### Overview
Four literal text replacements and one new bullet in `SKILL.md`, plus a changelog entry. Each statement is checked against its source: the runner's loop-type constant, the child envelope in the providers reference, and the EPERM observed in phase 060.
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
A document edit.

### Key Components
- **Execution Ownership**: which dispatches the shared runtime handles.
- **Dispatch-Critical Gotchas**: failures to honor at routing time.
- **ALWAYS rule 2**: the rule an orchestrator follows.

### Data Flow
None.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

sk-doc's `validate_document.py` on `SKILL.md`, a search for the old wording, and `compiled-route-guard.cjs` for every hub.

### Delivery
A MiMo v2.6 Pro executor applied the replacements from a literal brief whose old texts the orchestrator had matched against the file. The orchestrator reviewed the diff and ran the checks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit.
<!-- /ANCHOR:rollback -->

---
