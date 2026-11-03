---
title: "Feature Specification: Phase 4: doctor-playbook"
description: "Give the root `/doctor` playbook conversation coverage for the behavior its playbook stops short of: 5 scenario(s) on claude-code."
trigger_phrases:
  - "doctor playbook conversation scenarios"
  - "phase 4 doctor playbook"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: doctor-playbook

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
| **Phase** | 4 of 18 |
| **Predecessor** | 003-system-spec-kit |
| **Successor** | 005-sk-design-diagram |
| **Handoff Criteria** | Every scenario below passes the package validator and one live runner pass on claude-code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the conversation adoption build: one phase per skill or mode that the adoption research ranked.

**Scope Boundary**: The playbook package `.skilled/manual-testing-playbook/` only. No skill code, hook or runner change.

**Dependencies**:
- The conversation snippet template `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`
- The runner `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` and the style rule in the playbook mode's `SKILL.md` §6
- The ranking in `specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`

**Deliverables**:
- DOC-367: `.skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md`
- DOC-370: `.skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md`
- DOC-372: `.skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule.md`
- DOC-359: `.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md`
- DOC-394: `.skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/doctor` menu and four approval flows branch on the operator's answer, and no scenario proves that a no writes nothing while a yes applies exactly one change.

### Purpose
Add the missing turns as `json conversation` scenarios the shared runner can replay on claude-code, so the behavior is checked by shell commands after each turn instead of by hand.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c '```json conversation' .skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md .skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md .skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule.md .skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md .skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle.md
.skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md:0
.skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md:0
.skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule.md:0
.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md:0
.skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle.md:0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert DOC-367: answer X, an invalid answer twice, H, then a test-only number, checking the status line after each (Q2 answer-dependent)
- Add a companion for DOC-370: decline one change and check git config is unchanged, then approve `cardSync off` and check the one key changed; run in a disposable checkout (Q2 answer-dependent)
- Add a companion for DOC-372: decline then approve a standards edit, checking `.sk-git/` prose after each answer (Q2 answer-dependent)
- Add a companion for DOC-359: decline then approve the release update in a fixture, checking writes and the rollback path (Q2 answer-dependent)
- Add a companion for DOC-394: the declined branch only: answer no and check the tree and the remote are unchanged (Q2 answer-dependent)
- Index each changed or new scenario in the package root playbook

### Out of Scope
- The skill's own code, hooks and commands - a scenario that finds a bug records it as a finding
- Replacing the existing command-level scenarios - companions sit beside them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md` | Modify | Convert DOC-367 to a conversation scenario |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate-conversation.md` | Create | Conversation companion for DOC-370 |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule-conversation.md` | Create | Conversation companion for DOC-372 |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md` | Create | Conversation companion for DOC-359 |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle-conversation.md` | Create | Conversation companion for DOC-394 |
| `.skilled/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index the new or changed scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | DOC-367 is a conversation scenario | The `json conversation` block plays: answer X, an invalid answer twice, H, then a test-only number, checking the status line after each. A live run on claude-code writes `result.json` with every turn PASS |
| REQ-002 | DOC-370 has a conversation companion | The `json conversation` block plays: decline one change and check git config is unchanged, then approve `cardSync off` and check the one key changed; run in a disposable checkout. A live run on claude-code writes `result.json` with every turn PASS |
| REQ-003 | DOC-372 has a conversation companion | The `json conversation` block plays: decline then approve a standards edit, checking `.sk-git/` prose after each answer. A live run on claude-code writes `result.json` with every turn PASS |
| REQ-004 | DOC-359 has a conversation companion | The `json conversation` block plays: decline then approve the release update in a fixture, checking writes and the rollback path. A live run on claude-code writes `result.json` with every turn PASS |
| REQ-005 | DOC-394 has a conversation companion | The `json conversation` block plays: the declined branch only: answer no and check the tree and the remote are unchanged. A live run on claude-code writes `result.json` with every turn PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The package stays valid | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook` prints PASS with 0 violations, and the root index lists every scenario file |
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
| Risk | DOC-370, DOC-372 and DOC-359 write files: run them only against a disposable checkout through `--scratch` setup, never the main checkout. DOC-394's approve branch changes the GitHub remote and stays manual. | Med | Named in the mitigation of the item itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
