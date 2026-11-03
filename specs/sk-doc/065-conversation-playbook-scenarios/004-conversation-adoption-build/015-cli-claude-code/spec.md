---
title: "Feature Specification: Phase 15: cli-claude-code"
description: "Give cli-claude-code conversation coverage for the behavior its playbook stops short of: 2 scenario(s) on claude-code."
trigger_phrases:
  - "cli claude code conversation scenarios"
  - "phase 15 cli claude code"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: cli-claude-code

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P3 |
| **Status** | Draft |
| **Created** | 2026-11-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 18 |
| **Predecessor** | 014-system-skill-advisor |
| **Successor** | 016-cli-codex |
| **Handoff Criteria** | Every scenario below passes the package validator and one live runner pass on claude-code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the conversation adoption build: one phase per skill or mode that the adoption research ranked.

**Scope Boundary**: The playbook package `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/` only. No skill code, hook or runner change.

**Dependencies**:
- The conversation snippet template `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`
- The runner `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` and the style rule in the playbook mode's `SKILL.md` §6
- The ranking in `specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`

**Deliverables**:
- CC-016: `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id.md`
- CC-015: `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/continue-previous-conversation.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
CC-016 and CC-015 check the headless resume flags, not that the resumed session answers from its earlier turn.

### Purpose
Add the missing turns as `json conversation` scenarios the shared runner can replay on claude-code, so the behavior is checked by shell commands after each turn instead of by hand.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c '```json conversation' .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id.md .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/continue-previous-conversation.md
.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id.md:0
.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/continue-previous-conversation.md:0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a companion for CC-016: plant a fact, `restart`, ask for it, check it returns (Q2 restart)
- Add a companion for CC-015: plant a fact, send a follow-up, check the answer uses it (Q2 later turn)
- Index each changed or new scenario in the package root playbook

### Out of Scope
- The skill's own code, hooks and commands - a scenario that finds a bug records it as a finding
- Replacing the existing command-level scenarios - companions sit beside them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id-conversation.md` | Create | Conversation companion for CC-016 |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/continue-previous-conversation-conversation.md` | Create | Conversation companion for CC-015 |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index the new or changed scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CC-016 has a conversation companion | The `json conversation` block plays: plant a fact, `restart`, ask for it, check it returns. A live run on claude-code writes `result.json` with every turn PASS |
| REQ-002 | CC-015 has a conversation companion | The `json conversation` block plays: plant a fact, send a follow-up, check the answer uses it. A live run on claude-code writes `result.json` with every turn PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The package stays valid | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook` prints PASS with 0 violations, and the root index lists every scenario file |
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
| Risk | The runner resumes through its own adapter, so the existing flag scenarios stay primary. | Med | Named in the mitigation of the item itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
