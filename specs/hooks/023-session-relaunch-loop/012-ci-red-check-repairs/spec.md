---
title: "Feature Specification: Phase 12: ci-red-check-repairs"
description: "Two CI checks fail on main: the Rule Canary Sync reports AGENTS.md past the 16384-byte delivery prefix, and sk-doc Script Tests flags the SESSION_RELAUNCH_REPO_ROOT example line. The causes are the phase 007 exemption commit b3655ed3de and the switch-form example line from commit d001d69fee."
trigger_phrases:
  - "ci red check repairs"
  - "phase 8 ci red check repairs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: ci-red-check-repairs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `scaffold/012-ci-red-check-repairs` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-handoff-gate-exemptions |
| **Successor** | None |
| **Handoff Criteria** | Rule Canary Sync and sk-doc Script Tests both pass, with before and after evidence under scratch/. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Repair the two CI checks the relaunch work turned red specification.

**Scope Boundary**: The repairs touch only the repository AGENTS.md and .skilled/hooks/hook-flags.env.example; the ~/.claude/CLAUDE.md mirror is not edited.

**Dependencies**:
- Commit b3655ed3de (phase 007 handoff gate exemptions) added the .skilled/skills/.state/ exemption that moved the AGENTS.md section end from byte 16377 to 16626.
- Commit d001d69fee added the SESSION_RELAUNCH_REPO_ROOT line to hook-flags.env.example in switch form, though the file is never read and the value must be exported in the shell.

**Deliverables**:
- AGENTS.md wording tightened with no rule removed or weakened, section end back inside the 16384-byte delivery prefix.
- The hook-flags.env.example SESSION_RELAUNCH_REPO_ROOT line rewritten as the export its heading describes.
- Before and after evidence for both CI checks recorded under scratch/.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two CI checks fail on main. Rule Canary Sync reports that AGENTS.md "#### Blast-Radius Management" ends at byte 16626, past the 16384-byte delivery prefix Devin delivers, because commit b3655ed3de added the .skilled/skills/.state/ runtime-state exemption to Gates 2 and 3. sk-doc Script Tests reports SESSION_RELAUNCH_REPO_ROOT because commit d001d69fee added that flag to hook-flags.env.example in switch-line form, and the validation-switch test reads every `# NAME=value` line as a switch that must take effect once uncommented.

### Purpose
Both checks that main turned red pass again locally, with no rule removed or weakened and the delivery-prefix margin restored; their CI runs on main have not been checked yet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tighten AGENTS.md wording so Blast-Radius Management ends inside the 16384-byte delivery prefix.
- Rewrite the SESSION_RELAUNCH_REPO_ROOT line in .skilled/hooks/hook-flags.env.example as the export its heading describes.
- Record before and after evidence for both CI checks under scratch/.

### Out of Scope
- ~/.claude/CLAUDE.md - it mirrors AGENTS.md outside the repository, is not edited here, and now differs from AGENTS.md by the 11 tightenings.
- Other rule copies - the canary checks only the repository's AGENTS.md for the delivery prefix, so no further copy is measured.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| AGENTS.md | Modify | 11 wording tightenings, no rule removed or weakened; section end moves from byte 16626 to 16323 and the file from 27505 to 27202 bytes |
| .skilled/hooks/hook-flags.env.example | Modify | The SESSION_RELAUNCH_REPO_ROOT line becomes the export its heading describes instead of a switch line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Tighten AGENTS.md wording so Blast-Radius Management ends inside the 16384-byte delivery prefix, with no rule removed or weakened | Rule canary check-rule-copies.js exits 0; scratch/after/canary.txt shows the section end at byte 16323 with a 61-byte margin |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Write the SESSION_RELAUNCH_REPO_ROOT line in hook-flags.env.example as the export its heading describes | test_validation_switch.py no longer reports it; scratch/after/validation-switch.txt shows 8 passed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: check-rule-copies.js exits 0 with the AGENTS.md section end at byte 16323, a 61-byte margin inside the 16384-byte delivery prefix.
- **SC-002**: test_validation_switch.py passes with 8 tests, and the full sk-doc script suite (run-script-tests.sh) passes (scratch/after/sk-doc-script-tests.txt).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007 handoff gate exemptions, commit b3655ed3de | Its .skilled/skills/.state/ exemption keeps the AGENTS.md section end at byte 16626, so Rule Canary Sync stays red on main | Tighten wording without removing or weakening any rule until the end sits inside the prefix |
| Risk | A tightening weakens or removes a load-bearing rule | Med | Restate-only edits: ten rewordings keep each rule in fewer words, and Gate 2 refers to the gitignored runtime state Gate 3 exempts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Both repairs are fixed and verified by the evidence in scratch/after.
<!-- /ANCHOR:questions -->

---


