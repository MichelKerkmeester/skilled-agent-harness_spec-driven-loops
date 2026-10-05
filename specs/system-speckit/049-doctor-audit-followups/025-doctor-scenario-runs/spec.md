---
title: "Feature Specification: Phase 25: doctor-scenario-runs"
description: "The 36 doctor scenarios had been written and checked for structure but never run. DeepSeek v4.1 flash ran each one in its environment: 35 pass, and the one failure traces to 14 skills whose derived metadata predates the advisor's current schema."
trigger_phrases:
  - "doctor scenario runs"
  - "doctor playbook results"
  - "doctor manual testing results"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 25: doctor-scenario-runs

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
| **Phase** | 25 of 25 |
| **Predecessor** | 024-doctor-docs-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every doctor scenario has a recorded verdict with evidence, and each environment ended clean after every run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of the doctor audit follow-ups. Phases 021 and 022 built the environments and moved the scenarios onto them. The operator asked for every scenario to be run with DeepSeek.

**Scope Boundary**: Running the scenarios, fixing what the runs proved was broken on main within one generated file, and one guide note. The scenario files themselves are unchanged.

**Dependencies**:
- Both environments from `021-doctor-test-environments`
- The migrated scenarios from `022-doctor-playbook-environment-migration`
- DeepSeek v4.1 flash through opencode-go

**Deliverables**:
- A verdict and evidence for each of the 36 scenarios
- The sk-doc leaf manifest regenerated on main
- An advisor-state note in the environment guide

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nothing confirmed that the doctor commands behave the way their scenarios say, because no scenario had ever been run end to end.

### Purpose
Evidence for each doctor command from a real run in a known environment.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One Pi session per scenario, acting as runtime and tester, reading the command file the way Pi's own doctor prompt templates do
- A clean-status check of the environment after every run
- Reruns after fixing an environment or main-branch cause

### Out of Scope
- Adding `sanitizer_version` to 14 skills' derived metadata - a data change across tracked files that waits for the operator
- Changing the tune verification contract

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/leaf-manifest.json` | Modify | Regenerated to list the frontmatter value file |
| `system-spec-kit/.../doctor-commands/README.md` | Modify | Advisor-state note before DOC-364 |
| `025-doctor-scenario-runs/` | Create | This phase's record and the results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every scenario runs | 36 verdicts recorded, each with the evidence its scenario asks for |
| REQ-002 | Environments stay clean | `git status --porcelain` is empty after every run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Non-passes are traced | Each FAIL or SKIP names its cause and whether it is the command, the environment or main |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each doctor command has at least one passing scenario.
- **SC-002**: No verdict depends on a cause left unnamed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The model grades its own run | Med | Every result lists each pass and fail criterion with the observed output, and the fixture numbers matched an independent run |
| Risk | Main moves during the runs | Med | Each scenario fast-forwards first, so a regression on main shows up, as the sk-doc manifest did |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

