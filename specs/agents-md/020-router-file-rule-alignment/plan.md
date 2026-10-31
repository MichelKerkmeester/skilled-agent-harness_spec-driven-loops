---
title: "Implementation Plan: Align the hub routing repo rule with the per-skill ROUTER.md layout"
description: "Edit the hub routing rule and its trigger row so both name a mode packet's own ROUTER.md, and point the rule at the sk-doc reference that defines the layout."
trigger_phrases:
  - "router file rule alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Align the hub routing repo rule with the per-skill ROUTER.md layout

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | Repo rules routed by `REPO RULES.md` |
| **Storage** | None |
| **Testing** | `grep`, `check-repo-rules.cjs`, `validate.sh --strict` |

### Overview
Three sentence-level edits to `skill-hub-routing.md` and one to the `REPO RULES.md` trigger row. The layout itself is defined in `parent-skills-nested-packets.md` §1, so the rule cites it instead of restating it.
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
- [x] `check-repo-rules.cjs` prints `RESULT: PASSED (11/11 checks)`, and `validate.sh --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a router document (`REPO RULES.md`) sends an action to one rule file.

### Key Components
- **`REPO RULES.md` trigger row**: decides when an agent loads the rule.
- **`skill-hub-routing.md`**: holds the discipline for hub and mode routing.

### Data Flow
An agent matches its next action against the trigger row, then loads the rule, which points it at the sk-doc reference for the mechanics.
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
