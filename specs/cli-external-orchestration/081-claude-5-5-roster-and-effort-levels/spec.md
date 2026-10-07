---
title: "Feature Specification: Claude 5.5 roster and effort levels for cli-claude-code and Claude Code settings"
description: "The cli-claude-code mode still named a prior-generation Sonnet as its default, listed stale Sonnet, Fable and Haiku ids, and documented only two of the five effort levels."
trigger_phrases:
  - "claude 5 5 roster and effort levels"
  - "cli claude code model roster"
  - "claude code effort levels low medium high xhigh max"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Claude 5.5 roster and effort levels for cli-claude-code and Claude Code settings

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-07 |
| **Branch** | `scaffold/081-claude-5-5-roster-and-effort-levels` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-claude-code mode, which agents in other terminals use to shell out to the `claude` CLI, named `claude-sonnet-4-6` as its default and listed `claude-sonnet-5`, `claude-fable-5-1` and `claude-haiku-4-5-20251001` beside Opus 5.5. Its effort tables documented only `high` and `low`, although the CLI takes five levels. The operator also wanted Claude Code settings in this repo to reach every effort level for every Claude 5.5 model.

### Purpose
The mode carries a verified Claude 5.5 roster in which every model takes all five efforts, and the repo's settings are confirmed not to restrict any effort level.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Probe the four Claude 5.5 ids live and record which answer.
- Audit `.claude/settings.json`, its hooks and `.skilled/hooks` for anything that limits an effort level or model.
- Update the roster, default model and effort guidance everywhere the mode states them, including examples and playbook scenarios.
- Regenerate the Hermes copy of the mode's `SKILL.md` with the repo's own generator.

### Out of Scope
- The deep-loop runner's unpinned Claude fallback (`claude-opus-4-8` in `fanout-run.cjs`) - a different owner, and its drift test only binds the family.
- Dated changelog files and benchmark reports in the mode - they record what was true when written.
- Other keys in `.claude/settings.json` and the user-global settings file - outside the ask.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-claude-code/references/providers-and-models.md` | Modify | Roster, default, Fable 5.5 note, five-effort table |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md` | Modify | Default model, override table, model selection, rule 5 |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/README.md` | Modify | Default dispatch, roster sentence, FAQ answer |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/references/cli-reference.md` | Modify | Flag example, effort table, models table, model-selection examples |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/references/integration-patterns.md` | Modify | Model tier matrix and examples |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md` | Modify | Fast codebase scan model |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/assets/prompt-quality-card.md` | Modify | Model defaults table |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/assets/prompt-templates.md` | Modify | Flag table and examples |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/` (index plus five scenarios) | Modify | Model ids in scenario commands |
| `.hermes/skills/cli-claude-code/SKILL.md` | Regenerate | Generated copy of the mode's `SKILL.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The roster names each Claude 5.5 model with its role and all five efforts | `providers-and-models.md` §2 and §4 list the ids and `low`, `medium`, `high`, `xhigh`, `max` |
| REQ-002 | One default model, stated the same everywhere | `rg` over the mode finds no other default id |
| REQ-003 | Model ids carry live evidence | Probe output recorded for each id |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Effort restrictions in settings and hooks are reported, and changed only if one blocks a level | Audit result recorded in the implementation summary |
| REQ-005 | Mirrors stay in sync the way the repo regenerates them | Hermes check shows no `cli-claude-code` drift |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No stale id remains in the mode's live docs except the deliberate current-Fable id and one migration note.
- **SC-002**: The doc tests, the fan-out drift test, the dispatch-rule tests, the card-sync guard and the mirror checks pass as they did before the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed Claude Code 2.1.293 and its OAuth login | The probes need both | Auth status checked first; it was logged in |
| Risk | Fable 5.5 ships after this change | Med | The roster names the recheck command, and `--model fable` follows the newest Fable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `.claude/settings.json` keep the `claude-fable-5-5` entry under `modelSettings` while that id does not exist? It does nothing today and was left unchanged.
<!-- /ANCHOR:questions -->

---
