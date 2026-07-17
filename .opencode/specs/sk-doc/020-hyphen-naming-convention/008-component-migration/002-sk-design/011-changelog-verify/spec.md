---
title: "Feature Specification: Changelog verification (032 phase 011)"
description: "The rename program needs an auditable sk-design release-note entry that identifies the completed subtree and records the resulting version bump, but this phase is verification-only."
trigger_phrases:
  - "changelog-verify naming phase"
  - "sk-design changelog verification phase"
  - "032 changelog-verify"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/011-changelog-verify"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verification spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/changelog/v1.4.3.0.md"
      - ".opencode/skills/sk-design/changelog/"
      - ".opencode/skills/sk-design/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Changelog verification (032 phase 011)

> Phase 011 of the sk-design component migration under `sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/011-changelog-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 11 of the sk-design subtree in the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The rename program needs an auditable sk-design release-note entry that identifies the completed subtree and records the resulting version bump, but this phase is verification-only.

**Purpose:** Verify that the sk-design changelog contains a matching kebab-case migration entry and a version greater than the current v1.4.3.0 without performing any rename.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inspect the changelog history and identify the entry that records the completed 032 sk-design naming work.
- Verify the entry's version is greater than v1.4.3.0 and is consistent across filename, heading, and body.
- Verify the entry names the affected phases and states that Python scripts/package dirs and tool-mandated names were preserved.
- Return evidence and fail the phase if the required entry is absent or mismatched; do not create a substitute migration.

### Live candidate boundary
- Current release history includes `changelog/v1.4.3.0.md`; the next migration entry must use a greater version and an exact release-note filename
- The verification target is an append-only entry naming packet 032, the sk-design subtree, the component/catalog/playbook/benchmark scope, and the exemption boundary
- The changelog directory currently has no underscore-bearing filenames; this phase performs no filesystem rename

### Out of Scope
- Renaming changelog files, editing release history as part of this verify phase, changing version policy, or executing the migration.
- Changing component, catalog, playbook, benchmark, or tool files.
- Treating a generic release note as proof without packet, surface, version, and exemption evidence.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | A matching migration entry exists. | The changelog contains an entry that explicitly identifies packet 032 and the sk-design subtree. |
| REQ-002 | The version bump is real and internally consistent. | The migration entry's version is greater than v1.4.3.0 and agrees across filename, heading, and body. |
| REQ-003 | The scope statement matches the migration map. | The entry covers component phases 001–007, catalog 008, playbook 009, benchmark 010, and the no-rename verify/gate phases. |
| REQ-004 | The exemption boundary is recorded. | The entry states Python scripts/package directories and tool-mandated names were not renamed. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The verifier produces a pass/fail report with the exact changelog path, version, and matching scope phrases.
- **SC-002**: No changelog filesystem rename occurs in this phase.
- **SC-003**: A missing or inconsistent entry blocks the rollup gate rather than being silently inferred.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | A later release note is mistaken for the migration entry. | Medium | Require packet number, sk-design surface, version comparison, and exemption language in the same record. |
| Risk | The verify phase repairs the changelog and hides missing release evidence. | High | Keep this phase read-only; report the missing evidence to the coordinator. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The release owner must choose the final bumped version before execution; the verifier only checks that the chosen version is greater than v1.4.3.0 and internally consistent.
<!-- /ANCHOR:questions -->
