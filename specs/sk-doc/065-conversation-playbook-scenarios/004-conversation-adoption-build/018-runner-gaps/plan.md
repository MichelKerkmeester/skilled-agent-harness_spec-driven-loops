---
title: "Implementation Plan: Phase 18: runner-gaps"
description: "Probe each missing runtime and session action, then write a costed build-or-skip design note for the operator."
trigger_phrases:
  - "runner gaps plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: runner-gaps

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Design note |
| **Framework** | The conversation runner's adapter and action contract |
| **Storage** | None |
| **Testing** | Live screen probes, read only |

### Overview
Probe Cursor, Hermes and Aside interactive screens, sketch the fork and product-restart actions, then write `scratch/runner-gaps-design.md` with a recommendation per gap.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The six gaps are named
- [ ] The other phases have recorded any new gap they hit

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/runner-gaps-design.md` covers all six gaps
- [ ] The operator's decisions are in `decision-record.md`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Design note only

### Key Components
- **Adapters**: one per runtime in `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs`
- **Session actions**: send, restart and compact today

### Data Flow
Probe evidence goes into the design note; the operator's decision goes into the decision record.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Read-only probes: launch each runtime in a scratch project in a private tmux socket, capture its screens, and kill the socket afterwards.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Cursor, Hermes and Aside CLIs, tmux.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The phase writes only a design note in its own folder. Delete it by exact path to revert.
<!-- /ANCHOR:rollback -->

---
