---
title: "Implementation Plan: Phase 65: cli-hermes and cli-pi dispatch rules"
description: "Scope the five rule sites in cli-hermes and cli-pi that send every dispatch to the shared runtime to research and review lineages, and version both changes."
trigger_phrases:
  - "cli hermes pi dispatch rules plan"
  - "cli hermes pi runtime delegation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 65: cli-hermes and cli-pi dispatch rules

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
Five literal text replacements and a version bump in each `SKILL.md`, plus a changelog entry each. The wording follows phases 63 and 64. cli-pi points one-shot dispatches at its child envelope, and cli-hermes points them at the dispatch shape in its own `SKILL.md`, because it has no envelope section.
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
- **Core principle**: the one-line summary of the packet's role.
- **Execution Ownership** and **Dispatch Lifecycle**: which dispatches the shared runtime handles, and the steps of a dispatch.
- **ALWAYS rule 2** and the **success criteria**: the rule an orchestrator follows and the check it is held to.

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

Phases 63 and 64, whose wording this phase follows.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit.
<!-- /ANCHOR:rollback -->

---
