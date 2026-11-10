---
title: "Implementation Plan: Claude 5.5 roster and effort levels for cli-claude-code and Claude Code settings"
description: "Probe the Claude 5.5 ids live, audit settings and hooks for effort limits, then update every stale roster copy in the cli-claude-code mode and regenerate its Hermes copy."
trigger_phrases:
  - "claude 5 5 roster and effort levels plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Claude 5.5 roster and effort levels for cli-claude-code and Claude Code settings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, JSON settings |
| **Framework** | Claude Code CLI 2.1.293 |
| **Storage** | None |
| **Testing** | vitest doc and drift tests, `node --test` dispatch rules, shell guards, mirror checkers |

### Overview
Establish which Claude 5.5 ids the installed CLI accepts with one live call each, read the CLI's own model catalog for effort capabilities, and audit the repo for anything that limits effort. Then rewrite the roster in `providers-and-models.md` and carry the same ids and effort guidance into every other copy in the mode.
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
Single-source catalog: `references/providers-and-models.md` owns the roster, and the other docs point to it.

### Key Components
- **`providers-and-models.md`**: the roster, default, and when to use each effort.
- **`sync-skills-hermes.cjs`**: renders the Hermes copy of each skill's `SKILL.md`.

### Data Flow
The canonical `SKILL.md` under `.skilled/skills/` is rendered by the generator into `.hermes/skills/cli-claude-code/SKILL.md`. Every other runtime reaches the skill through a `skills` symlink to `.skilled/skills`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Capture baselines before editing, then rerun the same checks: the native-dispatch and handback doc tests, the fan-out fallback drift test, the dispatch-rule tests, the prompt-quality-card guard, the runtime-mirror and Hermes checks, and `validate_document.py` on each edited doc.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The installed `claude` CLI, logged in through Claude subscription OAuth, for the live probes.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the edited files in `.skilled/skills/cli-external-orchestration/cli-claude-code/` and `.hermes/skills/cli-claude-code/SKILL.md`. No settings key was changed.
<!-- /ANCHOR:rollback -->

---
