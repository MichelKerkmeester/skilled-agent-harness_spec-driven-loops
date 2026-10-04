---
title: "Feature Specification: Phase 13: doctor-docs-and-ci-fix"
description: "The doctor-scripts CI job fails because the advisor route-contract test needs the yaml package and the job never installs it. The root README misstates the hook settings, and the skills the doctor commands check never name them."
trigger_phrases:
  - "doctor docs and ci fix"
  - "doctor-scripts yaml dependency"
  - "doctor command pointers in skill readmes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: doctor-docs-and-ci-fix

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
| **Phase** | 13 of 13 |
| **Predecessor** | 012-changelog-v4003-update |
| **Successor** | None |
| **Handoff Criteria** | The doctor suite passes from a clean install and every edited doc validates |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the doctor audit follow-ups. It fixes the failing doctor CI job and makes the root README and the targeted skills point at the doctor commands.

**Scope Boundary**: the doctor-scripts CI install step, the `.skilled` package manifest and lock, the root README and the READMEs of the skills a doctor command checks.

**Dependencies**:
- The doctor commands as shipped by phases 008 to 010
- The v4.0.0.3 entry from phase 012, rechecked here

**Deliverables**:
- A doctor-scripts job that installs the yaml package it needs
- Root README hook text that matches the shipped hooks
- A doctor command pointer in each targeted skill's docs

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec-Kit Check doctor-scripts job fails 212 of 213 tests: `skill-advisor-route-contract.test.cjs` requires `yaml`, which `.skilled` only pulls in as a transitive dependency, and the job never installs `.skilled`. The root README says per-gate bypasses cover one command only, with no word on saved gate settings or `.sk-git/` rule changes. None of the skills the doctor commands check names its doctor command.

### Purpose
CI runs the doctor suite green, and a reader of the root README or of a targeted skill finds the doctor command that checks it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Declare `yaml` 2.9.0 as a `.skilled` devDependency and install `.skilled` in the doctor-scripts job
- Root README: saved gate settings, `.sk-git/` rule changes, the crash and unreadable-file blocks, the Off Switches line
- Doctor pointers in the system-skill-advisor, system-deep-loop, system-spec-kit, sk-git and mcp-code-mode READMEs and in `ENV-REFERENCE.md`
- Recheck the v4.0.0.3 entry against the code

### Out of Scope
- The other Spec-Kit Check jobs - they fail for unrelated reasons and belong to their own packets
- Closed phase docs - they keep the position they were written with

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/package.json`, `.skilled/package-lock.json` | Modify | Declare `yaml` 2.9.0 |
| `.github/workflows/spec-kit-check.yml` | Modify | Install `.skilled` in the doctor-scripts job |
| `README.md` | Modify | Hook settings and rule changes |
| `.skilled/skills/{system-skill-advisor,system-deep-loop,system-spec-kit,sk-git,mcp-code-mode}/README.md` | Modify | Doctor command pointers |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | `/doctor:env` pointer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The doctor suite can find `yaml` on a clean runner | A clean `npm ci` of `.skilled` installs yaml 2.9.0 and `run-all.sh` passes every suite |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The root README and each targeted skill name the doctor command that checks it | Each edited doc passes `validate_document.py` with no new Human Voice hard blockers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The doctor-scripts job passes on the push that carries this phase.
- **SC-002**: Every doctor command a doc names exists with the arguments the doc shows.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The npm registry during `npm ci` | The job cannot install | The lock pins the exact version already resolved |
| Risk | A doc names a command argument that does not exist | Low | Each pointer was checked against the command's argument hint |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

