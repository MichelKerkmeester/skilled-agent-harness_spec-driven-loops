---
title: "Feature Specification: no-new-snake_case guard (017 phase 004)"
description: "Nothing prevents snake_case from re-entering in-scope filesystem names. The program needs an exemption-aware guard with a debt-tolerant changed-only mode during migration and a whole-tree mode after, so intermediate commits stay green while the end state is enforced."
trigger_phrases:
  - "no-new-snake_case guard"
  - "hyphen naming phase 004"
  - "kebab-case no new"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/004-no-new-snake-guard"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored for the 017 phased tree"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: No-new-snake_case guard

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `003-create-generators-and-templates`; successor `005-rename-and-reference-tooling`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/004-no-new-snake-guard |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 004 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Nothing prevents snake_case from re-entering in-scope filesystem names. The program needs an exemption-aware guard with a debt-tolerant changed-only mode during migration and a whole-tree mode after, so intermediate commits stay green while the end state is enforced.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An exemption-aware no-new-snake_case guard honoring every exemption class.
- A `--changed-since $BASE` mode (fails only on newly-introduced in-scope snake_case) for use during migration.
- An `--all` mode (whole-tree) enabled after migration completes.
- Positive + negative fixtures proving both modes.

### Out of Scope
- Running the migration (006+).
- The rename engine (005).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The guard rejects a fresh in-scope snake_case name and accepts a hyphenated one | A synthetic snake_case file fails the guard; a hyphenated one passes |
| REQ-002 | The guard honors every exemption class | A .py, package dir, vendored, generated, and tool-mandated name never trips the guard |
| REQ-003 | The `--changed-since $BASE` mode only flags newly-introduced names | Pre-existing debt does not fail the changed-only mode |
| REQ-004 | The `--all` mode flags the full in-scope debt | Running `--all` at BASE reports the census count |
| REQ-005 | Positive and negative fixtures cover both modes | Fixture tests pass for changed-only and whole-tree modes |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The guard prevents regressions during migration.
- **SC-002**: The `--all` mode enforces the end state.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 017 parent spec (import breakage, validator downgrade, non-reproducible builds,
over-broad sweep, exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; resolved during this phase's execution against the pinned baseline.
<!-- /ANCHOR:questions -->
