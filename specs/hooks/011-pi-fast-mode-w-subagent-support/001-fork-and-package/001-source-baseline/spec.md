---
title: "Feature Specification: Phase 1: source-baseline"
description: "Establish the pinned upstream source baseline and package location before behavior or identity changes are introduced."
trigger_phrases:
  - "source-baseline"
  - "fast-mode source snapshot"
  - "upstream package baseline"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/001-source-baseline"
    last_updated_at: "2026-08-16T12:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Source baseline complete: 16-file copy verified, reference unchanged"
    next_safe_action: "Hand off to 002-identity-config-compat"
    blockers: []
    key_files:
      - "../../context/pi-openai-fast-mode/"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Working package location resolved to packages/pi-fast-mode-w-subagent-support (root has no npm workspaces)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 1: source-baseline

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-identity-config-compat |
| **Handoff Criteria** | Pinned source inventory and package location are recorded; the reference snapshot remains unchanged |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child fixes the source boundary for the fork-and-package workstream. It deliberately does not change behavior, package identity, config paths, handoff, or installation.

**Dependencies**:
- `../../context/pi-openai-fast-mode/` at commit `9b28456`, v0.3.0.

**Deliverables**:
- A documented working package location.
- A source inventory showing which upstream files are copied and which reference-only files stay in `context/`.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Later phases need a stable source boundary so package identity, compatibility, and handoff changes can be reviewed independently. Copying or editing the reference snapshot in place would destroy the evidence needed to compare behavior.

### Purpose
Create a clean, reproducible source baseline for the new extension without making implementation changes.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Decide the working package location using the repository layout and install constraints.
- Copy the upstream source, tests, TypeScript configuration, package metadata, README, license, and ignore rules into the working package.
- Record the source inventory and verify that the pinned context snapshot is unchanged.

### Out of Scope
- Package identity or config-path changes; those belong to `002-identity-config-compat/`.
- Handoff code, installation, or live verification.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Working package directory | Create | Copy the implementation baseline |
| `context/pi-openai-fast-mode/` | Verify only | Preserve the pinned reference snapshot |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The working package is separate from the pinned source snapshot | A source inventory and clean reference diff are recorded |
| REQ-002 | The copied tree includes all upstream runtime and test inputs | Required source, tests, manifest, config, README, license, and ignore files exist |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The package location supports the later local/git install decision | The chosen path and rollback deletion procedure are documented |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The pinned reference tree has no task-created changes.
- **SC-002**: The working package has a complete, reviewable source inventory.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Upstream snapshot | Missing files would invalidate later comparisons | Inventory the source before copying |
| Risk | Copying generated or local install files | Pollutes the baseline | Exclude `.git`, node_modules, and local artifacts |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED: the working package lives at `packages/pi-fast-mode-w-subagent-support/` (root has no npm workspaces; smallest rollback surface).

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Research handoff:** `../../research/research.md`
- **Source provenance:** `../../context/README.md`
