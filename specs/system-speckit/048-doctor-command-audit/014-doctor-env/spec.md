---
title: "Feature Specification: Phase 14: doctor-env"
description: "Every switch that turns a hook, gate or runtime feature off, or changes its default, is an environment variable or git config key documented in `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, a 472-line reference."
trigger_phrases:
  - "doctor env command"
  - "guided env setup"
  - "/doctor:env"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 14: doctor-env

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-speckit-retrieval |
| **Successor** | None |
| **Handoff Criteria** | `acceptance-criteria.md` shows every row Met, Waived or Superseded and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the doctor command audit. It covers `/doctor:env` alone.

**Scope Boundary**: `/doctor:env`, its route entry and `.skilled/commands/doctor/assets/doctor-env.yaml`. Mutability today: writes only after confirmation.

**Dependencies**:
- A provisioned worktree, so the scripts the doctor calls can run.
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` as the switch source.

**Deliverables**:
- A new `/doctor:env` router, workflow and presentation asset.
- Reading the switch list from ENV-REFERENCE.md at run time.
- Showing current values and writing confirmed choices to a destination the operator picks.
- The `.claude` symlink and the command catalog entries.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every switch that turns a hook, gate or runtime feature off, or changes its default, is an environment variable or git config key documented in `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, a 472-line reference. There is no guided way to choose them: an operator reads the reference and edits a shell profile by hand, and has no view of which values are set now.

### Purpose
Give operators a `/doctor:env` command that walks them through the switches by group, shows what each is set to now, asks what they prefer and writes the chosen values where they choose.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `/doctor:env` router, workflow and presentation asset.
- Reading the switch list from ENV-REFERENCE.md at run time.
- Showing current values and writing confirmed choices to a destination the operator picks.
- The `.claude` symlink and the command catalog entries.

### Out of Scope
- Changing what any switch does; the command only sets them.
- Storing or rotating secrets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/env.md` | Create | Thin router, built with sk-create-command |
| `.skilled/commands/doctor/assets/doctor-env.yaml` | Create | Guided workflow |
| `.skilled/commands/doctor/assets/doctor-env-presentation.txt` | Create | Prompts and summaries |
| `.claude/commands/doctor/env.md` | Create | Symlink to the router |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `.skilled/commands/doctor/env.md` and `.skilled/commands/doctor/assets/doctor-env.yaml` exist and follow sk-create-command's split between a thin router and its workflow and presentation assets. |
| REQ-002 | The command reads its list of switches from `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` when it runs, so a row added there appears without editing the command. |
| REQ-003 | For each switch the operator picks, the command shows the current value, the default and what the switch does, then writes only after showing the exact lines and getting a yes. |
| REQ-004 | The command never asks for or writes the value of a secret such as an API key or token. It names the variable and says where it is set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `.claude/commands/doctor/env.md` is a symlink to `../../../.skilled/commands/doctor/env.md`, as the other doctor commands are, and `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator sets a switch through `/doctor:env` without opening ENV-REFERENCE.md.
- **SC-002**: A switch added to ENV-REFERENCE.md appears in the command with no edit to it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A written value breaks a hook | Med | Show the exact lines and the switch's effect before writing |
| Risk | A secret is captured | High | Secret variables are named, never asked for |
| Dependency | ENV-REFERENCE.md table format | The command cannot read switches | Fail with the line it could not parse |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The command finishes its checks without a network call it did not already make.

### Security
- **NFR-S01**: No secret value is printed to the run log or the report.

### Reliability
- **NFR-R01**: A missing script or database is reported by name, never as a pass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A runtime database that a fresh worktree has not built yet: reported as not built, not as missing code.

### Error Scenarios
- A script the workflow calls has moved: recorded in `scratch/reality-check.md` with its new path.

### State Transitions
- The phase stops part way: `scratch/reality-check.md` and the run log let the next session resume.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One command, its workflow and route |
| Risk | 10/25 | A doctor run can touch runtime state |
| Research | 8/20 | Every named path is checked |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Where `/doctor:env` writes: the command asks the operator each run; the phase decides the offered destinations.
<!-- /ANCHOR:questions -->

---


