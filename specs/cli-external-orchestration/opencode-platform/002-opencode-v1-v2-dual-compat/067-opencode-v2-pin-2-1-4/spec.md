---
title: "Feature Specification: Phase 67: opencode-v2-pin-2-1-4"
description: "The skill pinned OpenCode 2 at 2.0.32 while 2.1.4 is the npm latest and the installed version, so running the setup helper here would downgrade it and CI checked a release nobody runs. The pin moves to 2.1.4 in the setup helper, the dual-version CI workflow and the baseline statements, and the claim that the v1 channel is frozen at 1.19.3 is corrected."
trigger_phrases:
  - "opencode v2 pin 2.1.4"
  - "phase 67 opencode v2 pin"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 67: opencode-v2-pin-2-1-4

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-24 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 67 of 67 |
| **Predecessor** | 066-opencode-v2-default-name |
| **Successor** | None |
| **Handoff Criteria** | `opencode-setup.sh` and `opencode-dual-version.yml` install and expect `@opencode/cli@2.1.4`, the baseline statements name 2.1.4, the v2 version battery passes on the installed 2.1.4, and the unit and hook suites pass. CI on the pushed commit is the remaining proof. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 67** of the OpenCode v1/v2 dual-compatibility specification. Phase 066 found the pin drift and left it for the operator, who asked for it to be fixed.

**Scope Boundary**: the executable pins (`opencode-setup.sh`, `opencode-dual-version.yml`), the statements of the pin or baseline in cli-opencode `SKILL.md`, `README.md`, `cli-reference.md` and `install-and-versions.md`, the workflows README and `CROSS-CLI.md`. Lines that record what 2.0.32 printed, and test fixtures that use 2.0.32 as a sample version string, stay unchanged.

**Dependencies**:
- `npm view @opencode/cli dist-tags` reporting `latest: 2.1.4` on 2026-10-24.
- The v2 version battery passing on the installed 2.1.4.

**Deliverables**:
- The v2 pin at 2.1.4 everywhere it is installed, checked or stated as the baseline.
- A corrected v1 channel statement: the pin stays 1.19.3 while `latest` is 1.19.4.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill pinned OpenCode 2 at 2.0.32, but 2.1.4 is the npm `latest` and the installed version. Running `opencode-setup.sh both` here would install the older pin over it, and CI verified a release nobody runs.

### Purpose
The pin, CI and the stated baseline all name the version that is installed and verified.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `V2_PKG` in the setup helper and the CI install and exact-version check.
- Baseline and verified-version statements in the skill docs, the workflows README and `CROSS-CLI.md`.
- The v1 channel statement, which claimed `latest` was still 1.19.3.

### Out of Scope
- Observations recorded on 2.0.32, such as its `run --help` flags and provider list - they were read on that release and are labelled so.
- Moving the v1 pin to 1.19.4 - 1.19.3 is the installed and verified v1.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modify | `V2_PKG` to `@opencode/cli@2.1.4` |
| `.github/workflows/opencode-dual-version.yml` | Modify | Install and expect 2.1.4 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/{SKILL.md,README.md,references/cli-reference.md,references/install-and-versions.md}` | Modify | Baseline statements |
| `.github/workflows/README.md`, `.skilled/CROSS-CLI.md` | Modify | Version named in one sentence each |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The executable pins name 2.1.4 | No `2.0.32` left in `opencode-setup.sh` or `opencode-dual-version.yml` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | 2.1.4 is verified before it is stated as verified | The v2 version battery passes on 2.1.4 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The OpenCode Dual-Version Battery passes in CI on the pushed commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A 2.0.32 flag or provider observation no longer holds on 2.1.4 | Med | The verified-versions note says those observations were read on 2.0.32 and not re-read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
