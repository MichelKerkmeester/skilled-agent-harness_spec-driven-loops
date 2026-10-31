---
title: "Feature Specification: Phase 10: doctor-router-gates"
description: "Two doctor routers declare a required target but had no mandatory input gate, and the structure extractor flagged the comma-form allowed-tools list the command template prescribes. This phase adds both gates and exempts commands from that rule."
trigger_phrases:
  - "doctor router input gate"
  - "extract structure allowed-tools commands"
  - "doctor router gates"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: doctor-router-gates

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-doctor-git |
| **Successor** | None |
| **Handoff Criteria** | Both routers validate with 0 issues and the extractor regression suite passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the doctor audit follow-ups. Holding `/doctor:git` to the sk-create-command templates in phase 009 left two items open: the other doctor routers with a required target lacked the input gate, and the structure extractor contradicted the command template.

**Scope Boundary**: `skill-advisor.md` and `mcp.md` in the doctor command folder, the sk-doc structure extractor and its regression test.

**Dependencies**:
- The sk-create-command router template, which defines the gate

**Deliverables**:
- A mandatory input gate in `/doctor:skill-advisor` and `/doctor:mcp`
- No array-format `allowed-tools` issue for a command

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-create-command template requires a mandatory input gate before the router contract whenever the argument hint declares a required `<argument>`. `/doctor:skill-advisor` and `/doctor:mcp` both declare one and had none. The structure extractor reported every command's comma-separated `allowed-tools` as needing array format. The command template and all 38 commands use the comma form, so the report was always wrong for commands.

### Purpose
Every doctor router with a required target stops for it, and the extractor agrees with the command template.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The input gate in `skill-advisor.md` and `mcp.md`, with each router's target-binding step pointing at it
- A `doc_type` argument to `parse_frontmatter` that skips the array-format rule for commands
- A regression test for both document types

### Out of Scope
- `/doctor:env` and `/doctor:update` - their angle-bracket values sit inside optional brackets, so the template requires no gate
- Changing the array rule for skills - skill frontmatter uses the array form

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/skill-advisor.md` | Modify | Input gate before the router contract |
| `.skilled/commands/doctor/mcp.md` | Modify | Input gate before the router contract |
| `.skilled/skills/sk-doc/shared/scripts/extract_structure.py` | Modify | Commands exempt from the array-format rule |
| `.skilled/skills/sk-doc/scripts/tests/test_extract_structure_regressions.py` | Modify | Skill and command cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each doctor router whose argument hint declares a required target has the mandatory input gate before its router contract | `skill-advisor.md` and `mcp.md` carry the gate; `validate_document.py --type command` reports 0 issues for each |
| REQ-002 | The extractor reports no array-format issue for a command and still reports it for a skill | The new regression case passes, and fails with the exemption removed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Routing still works for both commands | `route-validate.sh` exits 0, the router generator reports every router clean, and the doctor suite passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every doctor router with a required `<argument>` carries the gate.
- **SC-002**: `extract_structure.py` on a command reports no frontmatter issue for a comma-form `allowed-tools`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The advisor route contract test reads `skill-advisor.md` | Low | The doctor suite runs it |
| Risk | A skill with comma-form tools loses its warning | Low | The rule still applies to skills; only commands are exempt |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
