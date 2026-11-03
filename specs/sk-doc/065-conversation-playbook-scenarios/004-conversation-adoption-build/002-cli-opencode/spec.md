---
title: "Feature Specification: Phase 2: cli-opencode"
description: "Give cli-opencode conversation coverage for the behavior its playbook stops short of: 4 scenario(s) on opencode."
trigger_phrases:
  - "cli opencode conversation scenarios"
  - "phase 2 cli opencode"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: cli-opencode

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 18 |
| **Predecessor** | 001-cli-pi |
| **Successor** | 003-system-spec-kit |
| **Handoff Criteria** | Every scenario below passes the package validator and one live runner pass on opencode |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the conversation adoption build: one phase per skill or mode that the adoption research ranked.

**Scope Boundary**: The playbook package `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/` only. No skill code, hook or runner change.

**Dependencies**:
- The conversation snippet template `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`
- The runner `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` and the style rule in the playbook mode's `SKILL.md` §6
- The ranking in `specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`

**Deliverables**:
- CO-046: `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md`
- CO-019: `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md`
- CO-018: `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md`
- OpenCode goal hook: `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `[session-relaunch]` nudge appears on a later request, so one prompt cannot see it, and the OpenCode continuity and goal scenarios check flags but not the next turn.

### Purpose
Add the missing turns as `json conversation` scenarios the shared runner can replay on opencode, so the behavior is checked by shell commands after each turn instead of by hand.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c '```json conversation' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md
.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md:0
.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md:0
.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md:0
.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md:0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert CO-046: send the shell-command request, then a second request, and check the captured second request carries `[session-relaunch]` (Q2 later turn)
- Add a companion for CO-019: plant a fact, `restart`, ask for the fact, check it comes back (Q2 restart)
- Add a companion for CO-018: plant a fact, send a follow-up in the same session, check the answer uses it (Q2 later turn)
- Add a companion for OpenCode goal hook: bind a goal, send a later task, check the goal is model-visible on that turn (Q2 later turn)
- Index each changed or new scenario in the package root playbook

### Out of Scope
- The skill's own code, hooks and commands - a scenario that finds a bug records it as a finding
- Replacing the existing command-level scenarios - companions sit beside them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md` | Modify | Convert CO-046 to a conversation scenario |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id-conversation.md` | Create | Conversation companion for CO-019 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session-conversation.md` | Create | Conversation companion for CO-018 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook-conversation.md` | Create | Conversation companion for OpenCode goal hook |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index the new or changed scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CO-046 is a conversation scenario | The `json conversation` block plays: send the shell-command request, then a second request, and check the captured second request carries `[session-relaunch]`. A live run on opencode writes `result.json` with every turn PASS |
| REQ-002 | CO-019 has a conversation companion | The `json conversation` block plays: plant a fact, `restart`, ask for the fact, check it comes back. A live run on opencode writes `result.json` with every turn PASS |
| REQ-003 | CO-018 has a conversation companion | The `json conversation` block plays: plant a fact, send a follow-up in the same session, check the answer uses it. A live run on opencode writes `result.json` with every turn PASS |
| REQ-004 | OpenCode goal hook has a conversation companion | The `json conversation` block plays: bind a goal, send a later task, check the goal is model-visible on that turn. A live run on opencode writes `result.json` with every turn PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The package stays valid | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook` prints PASS with 0 violations, and the root index lists every scenario file |
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
| Risk | A live run can leave a tmux session or touch the repository. Mitigation: the runner's cleanup and content-hash snapshot; require `repo.changed` false and no session on the run socket. | Med | Named in the mitigation of the item itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
