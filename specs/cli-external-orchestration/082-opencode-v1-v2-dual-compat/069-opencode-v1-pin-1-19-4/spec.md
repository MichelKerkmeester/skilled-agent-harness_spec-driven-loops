---
title: "Feature Specification: Phase 69: opencode-v1-pin-1-19-4"
description: "The skill pinned OpenCode 1 at 1.19.3 while 1.19.4 is the npm latest and the installed version, so the setup helper would downgrade it and CI checked a release this machine no longer runs. The pin moves to 1.19.4 in the setup helper, the dual-version CI workflow and the baseline statements."
trigger_phrases:
  - "opencode v1 pin 1.19.4"
  - "phase 69 opencode v1 pin"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 69: opencode-v1-pin-1-19-4

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
| **Phase** | 69 of 69 |
| **Predecessor** | 068-retire-opencode2-name |
| **Successor** | None |
| **Handoff Criteria** | `opencode-setup.sh` and `opencode-dual-version.yml` install and expect `opencode-ai@1.19.4`, the baseline statements name 1.19.4, the v1 version battery passes on the installed 1.19.4, and the unit and hook suites pass. CI on a pushed commit is the remaining proof. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 69** of the OpenCode v1/v2 dual-compatibility specification. Phase 068 found that OpenCode 1 had updated itself to 1.19.4 and left the pin at 1.19.3 for the operator, who asked for the pin to move to 1.19.4.

**Scope Boundary**: the executable pins (`opencode-setup.sh`, `opencode-dual-version.yml`), the statements of the pin or baseline in cli-opencode `SKILL.md`, `README.md`, `cli-reference.md` and `install-and-versions.md`, the workflows README, `CROSS-CLI.md` and the Hermes mirror of `SKILL.md`. Lines that record what 1.19.3 printed, and test fixtures that use 1.19.3 as a sample version string, stay unchanged.

**Dependencies**:
- `npm view opencode-ai dist-tags` reporting `latest: 1.19.4` on 2026-10-24.
- The v1 version battery passing on the installed 1.19.4.

**Deliverables**:
- The v1 pin at 1.19.4 everywhere it is installed, checked or stated as the baseline.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill pinned OpenCode 1 at 1.19.3, but 1.19.4 is the npm `latest` and the installed version. Running `opencode-setup.sh both` here would install the older pin over it, and CI verified a release this machine no longer runs.

### Purpose
The pin, CI and the stated baseline all name the version that is installed and verified.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `V1_PKG` in the setup helper and the CI install and exact-version check.
- Baseline and verified-version statements in the skill docs, the workflows README and `CROSS-CLI.md`.
- The v1 channel statements in `install-and-versions.md`, which said the pin trailed `latest`.
- The two `cli-reference.md` lines that still named 2.0.32 as the v2 baseline next to the v1 baseline.

### Out of Scope
- Observations recorded on 1.19.3, such as its `--share` behaviour, model listing and `opencode upgrade --help` text. They were read on that release and are labelled so.
- Command-form labels in playbooks and prompt templates that name the release a form was read on.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modify | `V1_PKG` to `opencode-ai@1.19.4` |
| `.github/workflows/opencode-dual-version.yml` | Modify | Install and expect 1.19.4 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/{SKILL.md,README.md,references/cli-reference.md,references/install-and-versions.md}` | Modify | Baseline statements |
| `.hermes/skills/cli-opencode/SKILL.md` | Modify | Regenerated mirror |
| `.github/workflows/README.md`, `.skilled/CROSS-CLI.md` | Modify | Version named in one sentence each |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The executable pins name 1.19.4 | No `1.19.3` left in `opencode-setup.sh` or `opencode-dual-version.yml` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | 1.19.4 is verified before it is stated as verified | The v1 version battery passes on 1.19.4 |
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
| Risk | A 1.19.3 flag or provider observation no longer holds on 1.19.4 | Low | The verified-versions note says those observations were read on 1.19.3 and not re-read; `run --help` on 1.19.4 still lists `--dir`, `--variant`, `--agent` and `--format` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
