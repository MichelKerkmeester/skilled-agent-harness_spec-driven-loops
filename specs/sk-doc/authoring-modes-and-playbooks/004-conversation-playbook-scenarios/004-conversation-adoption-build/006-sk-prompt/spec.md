---
title: "Feature Specification: Phase 6: sk-prompt"
description: "Give sk-prompt conversation coverage for the behavior its playbook stops short of: 1 scenario(s) on claude-code."
trigger_phrases:
  - "sk prompt conversation scenarios"
  - "phase 6 sk prompt"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: sk-prompt

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
| **Phase** | 6 of 18 |
| **Predecessor** | 005-sk-design-diagram |
| **Successor** | 007-sk-code-hub |
| **Handoff Criteria** | Every scenario below passes the package validator and one live runner pass on claude-code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the conversation adoption build: one phase per skill or mode that the adoption research ranked.

**Dropped by the operator on 2026-11-03.** The SP-008 conversion failed its live run on OpenCode, because sk-prompt wrote the enhanced brief straight away without asking the checklist question the script expects. The operator chose to revert it, so `unknown-fallback-checklist.md` and the playbook index are back at their committed state and the tasks below stay open by design.

**Scope Boundary**: The playbook package `.skilled/skills/sk-prompt/manual-testing-playbook/` only. No skill code, hook or runner change.

**Dependencies**:
- The conversation snippet template `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`
- The runner `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` and the style rule in the playbook mode's `SKILL.md` §6
- The ranking in `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`

**Deliverables**:
- SP-008: `.skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
SP-008 prints a four-item checklist and sets `needs_disambiguation`, but never answers it, so the effect of the answer is untested.

### Purpose
Add the missing turns as `json conversation` scenarios the shared runner can replay on claude-code, so the behavior is checked by shell commands after each turn instead of by hand.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c '```json conversation' .skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md
.skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md:0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert SP-008: send a plain draft, answer the four checklist items, check the chosen intent drives the enhancement (Q2 answer-dependent)
- Index each changed or new scenario in the package root playbook

### Out of Scope
- The skill's own code, hooks and commands - a scenario that finds a bug records it as a finding
- Replacing the existing command-level scenarios - companions sit beside them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md` | Modify | Convert SP-008 to a conversation scenario |
| `.skilled/skills/sk-prompt/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index the new or changed scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SP-008 is a conversation scenario | The `json conversation` block plays: send a plain draft, answer the four checklist items, check the chosen intent drives the enhancement. A live run on claude-code writes `result.json` with every turn PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The package stays valid | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-prompt/manual-testing-playbook` prints PASS with 0 violations, and the root index lists every scenario file |
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
| Risk | Keep SP-012 single prompt: it forbids a clarifying question. | Med | Named in the mitigation of the item itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
