---
title: "Feature Specification: Phase 9: sk-create-changelog"
description: "Give sk-create-changelog conversation coverage for the behavior its playbook stops short of: 1 scenario(s) on claude-code."
trigger_phrases:
  - "sk create changelog conversation scenarios"
  - "phase 9 sk create changelog"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: sk-create-changelog

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 18 |
| **Predecessor** | 008-sk-design-hub |
| **Successor** | 010-sk-create-goal |
| **Handoff Criteria** | Every scenario below passes the package validator and one live runner pass on claude-code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the conversation adoption build: one phase per skill or mode that the adoption research ranked.

**Scope Boundary**: The playbook package `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/` only. No skill code, hook or runner change.

**Dependencies**:
- The conversation snippet template `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`
- The runner `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` and the style rule in the playbook mode's `SKILL.md` §6
- The ranking in `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`

**Deliverables**:
- CHG-007: `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
CHG-007 asks for a component when the evidence is ambiguous, and the answer-dependent write is unchecked.

### Purpose
Add the missing turns as `json conversation` scenarios the shared runner can replay on claude-code, so the behavior is checked by shell commands after each turn instead of by hand.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c '```json conversation' .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component.md
.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component.md:0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a companion for CHG-007: send the mixed-change request, name one component, check the proposed write path is that component's changelog folder (Q2 answer-dependent)
- Index each changed or new scenario in the package root playbook

### Out of Scope
- The skill's own code, hooks and commands - a scenario that finds a bug records it as a finding
- Replacing the existing command-level scenarios - companions sit beside them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component-conversation.md` | Create | Conversation companion for CHG-007 |
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index the new or changed scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CHG-007 has a conversation companion | The `json conversation` block plays: send the mixed-change request, name one component, check the proposed write path is that component's changelog folder. A live run on claude-code writes `result.json` with every turn PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The package stays valid | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook` prints PASS with 0 violations, and the root index lists every scenario file |
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
