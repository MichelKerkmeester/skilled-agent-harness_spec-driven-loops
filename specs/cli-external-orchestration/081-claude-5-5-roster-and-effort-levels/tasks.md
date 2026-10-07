---
title: "Tasks: Claude 5.5 roster and effort levels for cli-claude-code and Claude Code settings"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "claude 5 5 roster and effort levels tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Claude 5.5 roster and effort levels for cli-claude-code and Claude Code settings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the mode's `SKILL.md` and census every stale id in the mode (`.skilled/skills/cli-external-orchestration/cli-claude-code/`)
- [x] T002 Capture baselines for the doc tests, drift test, dispatch rules, card guard and mirror checks
- [x] T003 Probe the four Claude 5.5 ids once each at `--effort low`, plus the `fable` alias
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Audit settings, hooks and env for effort or model limits (`.claude/settings.json`, `.skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs`)
- [x] T005 Rewrite the roster, default and effort sections (`references/providers-and-models.md`)
- [x] T006 Carry the roster into `SKILL.md`, `README.md`, `references/cli-reference.md`, `references/integration-patterns.md`, `references/agent-delegation.md`, `assets/prompt-quality-card.md` and `assets/prompt-templates.md`
- [x] T007 Update model ids in the playbook index and five scenarios, and fix CC-008's index entry, which named Sonnet for the Opus scenario (`manual-testing-playbook/`)
- [x] T008 Regenerate the Hermes copy with the generator's own renderer (`.hermes/skills/cli-claude-code/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun every baseline check and compare
- [x] T010 Rescan the mode for stale ids and explain each remaining hit
- [x] T011 Validate each edited doc with `validate_document.py`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
