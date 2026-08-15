---
title: "Feature Specification: Onboarding and Root README"
description: "Plans realigning the Pi Remote root README to the sk-create-readme general template and authoring an install and onboarding guide to the install-guide template."
trigger_phrases:
  - "pi remote onboarding and root readme"
  - "pi mobile phase 14"
  - "onboarding and root readme"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/014-onboarding-and-root-readme"
    last_updated_at: "2026-08-13T17:52:43Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Realigned root README and authored the install and onboarding guide"
    next_safe_action: "Proceed to phase 015 doc quality and catalog"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---

# Feature Specification: Onboarding and Root README

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-08-13 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 14 of 15 |
| **Predecessor** | `../013-code-standards-alignment/spec.md` |
| **Successor** | `../015-doc-quality-and-catalog/spec.md` |
| **Handoff Criteria** | The root `README.md` is realigned to the `sk-create-readme` general template and an install and onboarding guide is authored to the install-guide template, both validated by `sk-doc` and linked into the phase 015 quality gate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The root `Apps/Pi Mobile/README.md` is informative but does not follow the `sk-create-readme` general README shape (no numbered ALL-CAPS H2 sections, no blockquote tagline, no install-guide separation). A new operator must read the setup runbook in full before they can deploy, because the README mixes quick commands with deployment prose and there is no standalone folded install and onboarding guide. Without a bounded phase, the entry point stays ad hoc and the six-phase documentation uplift lacks its front door.

### Purpose

Deliver the app front door: a realigned root README in the `sk-create-readme` general template and a standalone install and onboarding guide in the folded install-guide template with validation checkpoints.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Realigning `Apps/Pi Mobile/README.md` to the `sk-create-readme` general README template (`assets/readme-template.md`): blockquote tagline, numbered ALL-CAPS H2 sections, tables for file maps, no table of contents, no anchor-comment navigation.
- Authoring a new install and onboarding guide at `Apps/Pi Mobile/docs/install-and-onboarding.md` in the `sk-create-readme` install-guide template shape: folded five phases, validation checkpoints named `phase_N_complete`, STOP blocks, expected output, and a troubleshooting table.
- Keeping verified commands and the operator-only boundaries from the current README and `docs/setup.md`.

### Out of Scope
- Code-folder READMEs (owned by phase `010-code-readme-coverage`).
- Converting `docs/setup.md` and the other runbooks (owned by phase `012-docs-as-skill-references`).
- The doc-quality scoring gate and feature catalog (owned by phase `015`).
- Any change to app source code, tests, or configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `Apps/Pi Mobile/README.md` | Realigned | Root project README in the `sk-create-readme` general template shape |
| `Apps/Pi Mobile/docs/install-and-onboarding.md` | Planned | Install and onboarding guide in the folded install-guide template with `phase_N_complete` checkpoints |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The root README follows the general template. | `README.md` has a plain H1, a one-sentence blockquote tagline, numbered ALL-CAPS H2 sections, and no table of contents or anchor-comment navigation. |
| REQ-002 | The install guide is folded and checkable. | `docs/install-and-onboarding.md` has the AI-first intro, prerequisites, installation, initialization, configuration, and verification phases with `phase_1_complete` through `phase_5_complete` validation checkpoints. |
| REQ-003 | Every install step is verifiable. | Each validation checkpoint shows a command and its expected output, with a STOP block where the checkpoint can fail. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The README and guide stay current-state. | Both documents cite current files and commands under `Apps/Pi Mobile/`, not packet or phase numbers. |
| REQ-005 | Onboarding is complete. | The guide covers build, deploy, enrollment, PWA install, and first-use verification using existing verified commands. |
| REQ-006 | The deliverables feed the quality gate. | Both files are included in the phase 015 doc-quality gate scope. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new operator can move from the README to the install guide and complete a first verified deployment without consulting other runbooks.
- **SC-002**: A reviewer can validate both documents with `sk-doc` tools and trace every command to an existing script or runbook.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Verified setup commands | Guide can drift from `docs/setup.md` | Diff the guide commands against `docs/setup.md` and the root scripts |
| Risk | Duplicated content between README and guide | Maintenance burden | README links to the guide instead of restating it |
| Risk | Install-guide location deviation | Skill default expects `.opencode/install-guides/` | Record the `docs/` placement rationale in the spec and plan |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- The install guide stays copy-pasteable with one command per purpose.

### Security
- The guide never includes enrollment payloads, Serve anchors, or credential values.

### Reliability
- Unverified target-host steps are marked operator-verification pending.

---

## L2: EDGE CASES

### Data Boundaries
- Platform-specific configuration appears only where the app supports it (macOS containment, iOS Home Screen push limits).

### Error Scenarios
- A checkpoint fails: the STOP block routes to the troubleshooting section.
- The guide command differs from `docs/setup.md`: flag the diff and preserve the verified command.

### State Transitions
- The deliverables are Draft; implementation starts after this phase is approved.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Two documents, one general README and one install guide |
| Risk | 7/25 | Documentation-only surface |
| Research | 10/20 | README and setup runbook read; templates confirmed |
| Multi-Agent | 5/15 | Single owner by default |
| Coordination | 10/15 | Depends on phases 010-013; feeds phase 015 |
| **Total** | **42/100** | **Level 2** |

---

## 10. OPEN QUESTIONS

- Which current README sections does the realignment consolidate into the install guide versus keep in the root README?
- Does the operator accept the `docs/` placement for the install guide instead of the skill's `.opencode/install-guides/` default?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent phase map**: [../spec.md](../spec.md)
- **Implementation plan**: [plan.md](plan.md)
- **Task ledger**: [tasks.md](tasks.md)
- **Verification checklist**: [checklist.md](checklist.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
