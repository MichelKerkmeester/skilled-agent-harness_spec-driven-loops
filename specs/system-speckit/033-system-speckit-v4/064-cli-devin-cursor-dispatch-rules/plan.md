---
title: "Implementation Plan: Phase 64: cli-devin and cli-cursor dispatch rules"
description: "Rewrite the fan-out rule and Execution Ownership text in cli-devin and cli-cursor to cover only research and review lineages, and version both changes."
trigger_phrases:
  - "cli devin cursor dispatch rules plan"
  - "cli devin cursor fanout scope plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 64: cli-devin and cli-cursor dispatch rules

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | Two skill packets inside the cli-external-orchestration hub |
| **Storage** | Each packet's `SKILL.md` and changelog folder |
| **Testing** | sk-doc document validation; the compiled-route guard; the Hermes copy check |

### Overview
Three literal text replacements and a version bump in each `SKILL.md`, plus a changelog entry each. The new text is cli-codex's version 1.9.4.0 wording with the executor kind changed, and each pointer names a section confirmed to hold that packet's child envelope.
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

sk-doc's `validate_document.py` on both `SKILL.md` and both changelogs, a search for the old wording, `compiled-route-guard.cjs` for every hub, and `sync-skills-hermes.cjs --check`.

### Delivery
A MiMo v2.6 Pro executor applies the replacements from a literal brief whose old texts the orchestrator matched against each file, each exactly once. The orchestrator reviews the diff and runs the checks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 63, whose cli-codex wording this phase reuses.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit.
<!-- /ANCHOR:rollback -->

---
