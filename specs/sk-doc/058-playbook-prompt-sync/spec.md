---
title: "Feature Specification: Warn when a playbook scenario's prompt fields disagree"
description: "The Prompt Synchronization Gate tells authors not to ship a scenario whose prompt copies disagree, but the operator validator never compared them. This packet adds an advisory warning that does."
trigger_phrases:
  - "playbook prompt sync warning"
  - "PROMPT_UNSYNCED"
  - "playbook prompt fields disagree"
  - "turn 1 prompt out of sync"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Warn when a playbook scenario's prompt fields disagree

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Implemented |
| **Created** | 2026-09-23 |
| **Branch** | None. Work on `main`, packet folder only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-create-manual-testing-playbook` says a scenario's prompt must read the same in its contract, its execution table and the root summary, and "Do not ship unsynchronized prompt fields." `validate-playbook-package.cjs` checked that a prompt exists but never compared the copies, so a playbook whose Turn 1 prompt had drifted from its root entry passed clean. A scan of the corpus found 60 disagreeing copies across 12 packages.

### Purpose
The operator validator reports every prompt copy that disagrees with the scenario contract, as a warning, so the corpus can be brought into line without turning CI red first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `PROMPT_UNSYNCED` warning comparing the contract prompt with the table's Exact Prompt, a conversation chain's Turn 1 input and the root summary prompt
- Suite assertions pinning both directions: a real difference is reported, a presentation-only difference is not
- The Prompt Synchronization Gate text, the validator scope paragraph, the README and a v1.0.2.0 changelog entry

### Out of Scope
- Fixing the 60 existing disagreements - each belongs to its own package owner
- Making the check fail closed - every package is fail-closed, so a hard check would fail CI for 12 packages at once

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modify | The comparison and the root summary index |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` | Modify | Eight prompt sync assertions |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` | Modify | Gate text, validator scope, version 1.0.2.0 |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/README.md` | Modify | Drop prompt sync from the manual spot-checks |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/changelog/v1.0.2.0.md` | Create | Release entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A copy whose words differ from the contract prompt is reported at its own file and line | Planted table, Turn 1 and root differences each raise one warning |
| REQ-002 | The finding never changes a package's status or the exit code | Fleet run before and after: identical statuses, violation counts and exit code |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Quotes, backticks, emphasis and spacing do not count as a difference | The presentation-only assertion raises nothing |
| REQ-004 | A root section linking several scenarios is never read as one scenario's summary | The index-section assertion raises nothing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The suite passes, and disabling the check, the index guard or the backtick normalization each fails it
- **SC-002**: A fleet run exits 0 with the same package statuses as before and reports the corpus's disagreements as warnings
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A root layout the summary walk misreads attributes the wrong prompt | Med | Only a block that links exactly one scenario and holds exactly one prompt is attributed, and the finding is a warning |
| Risk | Warnings are ignored because they never fail | Low | The changelog names the 12 packages' backlog, and a later change can graduate the check once they are clean |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- When the 60 existing disagreements are fixed, should `PROMPT_UNSYNCED` become a fail-closed violation?
<!-- /ANCHOR:questions -->

---
