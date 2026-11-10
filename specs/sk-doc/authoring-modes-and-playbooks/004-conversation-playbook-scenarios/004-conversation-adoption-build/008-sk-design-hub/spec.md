---
title: "Feature Specification: Phase 8: sk-design-hub"
description: "Give the sk-design hub conversation coverage for the behavior its playbook stops short of: 1 scenario(s) on claude-code."
trigger_phrases:
  - "sk design hub conversation scenarios"
  - "phase 8 sk design hub"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: sk-design-hub

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Dropped |
| **Created** | 2026-11-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 18 |
| **Predecessor** | 007-sk-code-hub |
| **Successor** | 009-sk-create-changelog |
| **Handoff Criteria** | Every scenario below passes the package validator and one live runner pass on claude-code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the conversation adoption build: one phase per skill or mode that the adoption research ranked.

**Dropped by the operator on 2026-11-03.** The SD-007 companion `ambiguous-multi-intent-conversation.md` failed its live runs, because the compiled router sends "turn this into a clear visual" to `sk-design-fundamentals`, so no CHART or FLOWCHART choice is asked. The operator chose to drop it, so the companion was deleted, the playbook index is back at its committed state and the tasks below stay open by design.

**Scope Boundary**: The playbook package `.skilled/skills/sk-design/manual-testing-playbook/` only. No skill code, hook or runner change.

**Dependencies**:
- The conversation snippet template `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`
- The runner `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` and the style rule in the playbook mode's `SKILL.md` §6
- The ranking in `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`

**Deliverables**:
- SD-007: `.skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
SD-007 lets the router ask the user to pick between two intents, and no turn scripts that pick.

### Purpose
Add the missing turns as `json conversation` scenarios the shared runner can replay on claude-code, so the behavior is checked by shell commands after each turn instead of by hand.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c '```json conversation' .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md
.skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md:0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a companion for SD-007: send the ambiguous request, answer with one intent, check CHART or FLOWCHART resources load (Q2 answer-dependent)
- Index each changed or new scenario in the package root playbook

### Out of Scope
- The skill's own code, hooks and commands - a scenario that finds a bug records it as a finding
- Replacing the existing command-level scenarios - companions sit beside them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent-conversation.md` | Create | Conversation companion for SD-007 |
| `.skilled/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index the new or changed scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SD-007 has a conversation companion | The `json conversation` block plays: send the ambiguous request, answer with one intent, check CHART or FLOWCHART resources load. A live run on claude-code writes `result.json` with every turn PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The package stays valid | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-design/manual-testing-playbook` prints PASS with 0 violations, and the root index lists every scenario file |
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
| Risk | SD-007 feeds the typed-gold routing gate; leave it unchanged and add a companion. | Med | Named in the mitigation of the item itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
