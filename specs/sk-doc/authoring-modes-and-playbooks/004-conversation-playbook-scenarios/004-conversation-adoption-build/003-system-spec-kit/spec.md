---
title: "Feature Specification: Phase 3: system-spec-kit"
description: "Give system-spec-kit conversation coverage for the behavior its playbook stops short of: 4 scenario(s) on claude-code, opencode."
trigger_phrases:
  - "system spec kit conversation scenarios"
  - "phase 3 system spec kit"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 18 |
| **Predecessor** | 002-cli-opencode |
| **Successor** | 004-doctor-playbook |
| **Handoff Criteria** | Every scenario below passes the package validator and one live runner pass on claude-code, opencode |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the conversation adoption build: one phase per skill or mode that the adoption research ranked.

**Scope Boundary**: The playbook package `.skilled/skills/system-spec-kit/manual-testing-playbook/` only. No skill code, hook or runner change.

**Dependencies**:
- The conversation snippet template `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`
- The runner `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` and the style rule in the playbook mode's `SKILL.md` §6
- The ranking in `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`

**Deliverables**:
- directive-lifecycle dedup: `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md`
- goal-opencode-plugin: `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md`
- session-cleanup-plugin: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin.md`
- session-relaunch (claude, pi-opencode, command-runtimes): `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Directive delivery, the OpenCode goal plugin and the session-cleanup guard all change on a later turn or after compaction, and no scenario plays those turns.

### Purpose
Add the missing turns as `json conversation` scenarios the shared runner can replay on claude-code, opencode, so the behavior is checked by shell commands after each turn instead of by hand.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c '```json conversation' .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin.md .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md
.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md:0
.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md:0
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin.md:0
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert directive-lifecycle dedup: send a first request, repeat it in the same session, `compact`, send again, and check delivery evidence after each turn (Q2 compaction)
- Add a companion for goal-opencode-plugin: bind a goal on opencode, send a later task, check the active-goal prompt arrived (Q2 later turn)
- Add a companion for session-cleanup-plugin: first send shows the startup guard, second send proves it arrives once, `restart` checks the cleanup sweep (Q2 restart)
- Add a companion for session-relaunch (claude, pi-opencode, command-runtimes): cover only the in-session half: the handoff note appears on the later turn; keep the wrapper checks primary because the runner's `restart` does not run `skilled-loop` (Q2 later turn)
- Index each changed or new scenario in the package root playbook

### Out of Scope
- The skill's own code, hooks and commands - a scenario that finds a bug records it as a finding
- Replacing the existing command-level scenarios - companions sit beside them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md` | Modify | Convert directive-lifecycle dedup to a conversation scenario |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin-conversation.md` | Create | Conversation companion for goal-opencode-plugin |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin-conversation.md` | Create | Conversation companion for session-cleanup-plugin |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude-conversation.md` | Create | Conversation companion for session-relaunch (claude, pi-opencode, command-runtimes) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index the new or changed scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | directive-lifecycle dedup is a conversation scenario | The `json conversation` block plays: send a first request, repeat it in the same session, `compact`, send again, and check delivery evidence after each turn. A live run on claude-code, opencode writes `result.json` with every turn PASS |
| REQ-002 | goal-opencode-plugin has a conversation companion | The `json conversation` block plays: bind a goal on opencode, send a later task, check the active-goal prompt arrived. A live run on claude-code, opencode writes `result.json` with every turn PASS |
| REQ-003 | session-cleanup-plugin has a conversation companion | The `json conversation` block plays: first send shows the startup guard, second send proves it arrives once, `restart` checks the cleanup sweep. A live run on claude-code, opencode writes `result.json` with every turn PASS |
| REQ-004 | session-relaunch (claude, pi-opencode, command-runtimes) has a conversation companion | The `json conversation` block plays: cover only the in-session half: the handoff note appears on the later turn; keep the wrapper checks primary because the runner's `restart` does not run `skilled-loop`. A live run on claude-code, opencode writes `result.json` with every turn PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The package stays valid | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` prints PASS with 0 violations, and the root index lists every scenario file |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each live run's `result.json` reports every turn PASS, `repo.changed` false, and `tmux list-sessions` on the run socket fails afterwards
- **SC-002**: `validate.sh --strict` prints `RESULT: PASSED` for this phase
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The conversation snippet template | Authoring starts from the wrong shape | Start after the template split lands; check the file exists |
| Risk | The decision-capture session owns system-spec-kit playbook files. Confirm with it before editing; if it still has these files open, wait. | Med | Named in the mitigation of the item itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
