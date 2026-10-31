---
title: "Feature Specification: Phase 20: doctor-contract-fixes"
description: "/doctor:speckit could never report OK because phrase quality counted as staleness, and /doctor:mcp had no error for an unknown flag. Phrase quality is now an advisory outside the status, the status list matches the presentation, and an unknown flag gets its own error."
trigger_phrases:
  - "doctor contract fixes"
  - "doctor speckit phrase quality advisory"
  - "doctor mcp unknown flag"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 20: doctor-contract-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-doctor-test-environment-research |
| **Successor** | None |
| **Handoff Criteria** | Both contract tests pass, fail against the old contracts, and DOC-349, DOC-350 and DOC-380 validate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the doctor audit follow-ups. Phase 019 researched both gaps. This phase applies its recommendations to the two command contracts and their scenarios.

**Scope Boundary**: The `/doctor:speckit` retrieval workflow and presentation, the `/doctor:mcp` router and presentation, two contract tests, and DOC-349, DOC-350 and DOC-380.

**Dependencies**:
- The research in `019-doctor-test-environment-research/research/research.md`

**Deliverables**:
- Phrase quality reported as an advisory, and a status list the presentation can render
- An `unknown_flag` error for `/doctor:mcp`
- Two contract tests and three updated or new scenarios

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The retrieval doctor treated any low-quality trigger phrase as staleness, and the committed corpus always has some, so a fresh index never reported OK. Its YAML status list also used `DEGRADED`, which the presentation cannot render. The mcp doctor refused a flag owned by the other sub-action but defined nothing for a flag neither accepts.

### Purpose
A fresh index reports OK with its phrase-quality counts shown as information, and every unknown mcp flag gets a defined refusal.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `doctor-speckit-retrieval.yaml` and `doctor-speckit-presentation.txt`
- `mcp.md` and `doctor-mcp-presentation.txt`
- Contract tests for both commands
- DOC-349 and DOC-350 updated, DOC-380 created and indexed

### Out of Scope
- Cleaning up the flagged phrases - the research found no measured retrieval harm
- The test environments - phase 021

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modify | Phrase quality as an advisory, explicit status rules, aligned status list |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modify | Advisories line in the summary |
| `.skilled/commands/doctor/mcp.md` | Modify | Refuse an unknown flag before YAML load |
| `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt` | Modify | The `unknown_flag` error for each sub-action |
| `.skilled/commands/doctor/scripts/tests/doctor-speckit-contract.test.cjs` | Create | Advisory and status-list checks |
| `.skilled/commands/doctor/scripts/tests/doctor-mcp-contract.test.cjs` | Create | Unknown-flag and cross-sub-action checks |
| `.skilled/commands/doctor/scripts/tests/README.md` | Modify | List the two suites |
| system-spec-kit DOC-349, DOC-350 and the doctor README | Modify | Expect OK with advisories, and keep stale-only-from-freshness |
| mcp-code-mode DOC-380, root playbook and doctor README | Create/Modify | The unknown-flag scenario and its index rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A fresh index can report OK | The workflow keeps phrase quality out of `staleness_classes` and `severity_max`, and the contract test passes |
| REQ-002 | An unknown mcp flag is refused before YAML load | The presentation defines `unknown_flag` for both sub-actions and the contract test passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The scenarios match the contracts | DOC-349 expects OK, DOC-350 checks the advisories add no severity, DOC-380 validates |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new test fails against the old contract and passes against the new one.
- **SC-002**: Every workflow status is one the presentation renders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Phrase-quality problems go unnoticed once they stop affecting status | Low | The advisories stay in every report, and a measured lookup can still justify a corpus fix |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

