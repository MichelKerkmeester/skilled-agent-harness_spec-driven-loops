---
title: "Feature Specification: Spec-kit goal contract"
description: "Update goal.md.tmpl, the set-string playbook and spec-kit-docs.json so frontmatter is stripped deterministically, the parent durable budget is 4000 characters, and restore the goal shape and budget validator as native rules."
trigger_phrases:
  - "goal template frontmatter strip"
  - "goal durable budget 4000"
  - "goal shape validator restore"
  - "set string playbook update"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Spec-kit goal contract

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-decisions-and-contract-freeze |
| **Successor** | 004-goal-core-packet-backed |
| **Handoff Criteria** | See the parent Phase Handoff Criteria row for this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Goal unification: packet goal.md as the single goal surface across runtimes specification.

**Scope Boundary**: One contract across template, playbook, contract JSON and validator: a machine-strippable frontmatter boundary, a 4000-character parent budget, unbounded children, and rules that fail a bad parent goal.

**Dependencies**:
- 002-decisions-and-contract-freeze Complete

**Deliverables**:
- `templates/addons/goal.md.tmpl` operator-copy wording and strip boundary
- `references/workflows/goal-set-string-playbook.md` sections 4, 5, 7, 8
- `templates/spec-kit-docs.json` if sections change

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The template and playbook tell an agent to resend the full text of goal.md, which includes frontmatter. The doc budget says 3000 while the runtime caps at 4000. The validator that checked binding-child existence and the durable budget was deleted, and the playbook still links to it.

### Purpose
One contract across template, playbook, contract JSON and validator: a machine-strippable frontmatter boundary, a 4000-character parent budget, unbounded children, and rules that fail a bad parent goal.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `templates/addons/goal.md.tmpl` operator-copy wording and strip boundary
- `references/workflows/goal-set-string-playbook.md` sections 4, 5, 7, 8
- `templates/spec-kit-docs.json` if sections change
- Native goal rules in `runtime/lib/validation/spec-doc-structure.ts` beside the anchor gate
- `references/validation/validation-rules.md` goal section and trigger index regeneration

### Out of Scope
- Hook or plugin code
- Resurrecting the deleted shell script

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` | Modify | Strip boundary, 4000 budget, resend wording |
| `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modify | Budget, cut order, dangling link |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Modify | Binding-child existence, parent budget, heading separability |
| `.opencode/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | Restored goal rule docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template and playbook say the durable slice is resent without frontmatter | Both files contain the strip rule; no 'full text' wording remains |
| REQ-002 | A parent goal over 4000 durable characters fails validation | Negative test with a 4001-character slice |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A binding row naming a missing child goal fails validation | Negative test with one missing child |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict` on a fixture packet fails on both negatives and passes on the good case
- **SC-002**: Template staleness check passes for goal.md
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 156 existing goal.md files fail the new rules | Fleet churn | Rules are warnings on legacy packets and errors on new scaffolds, per ADR-6 enforcement site |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the strip boundary is a YAML parse or an explicit marker (ADR-3 decides)
<!-- /ANCHOR:questions -->

---


