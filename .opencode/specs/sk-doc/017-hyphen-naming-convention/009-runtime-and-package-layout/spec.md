---
title: "Feature Specification: runtime and package layout (017 phase 009)"
description: "Runtime and package-layout directories (mcp_server, install_scripts, plugin_bridges, matrix_runners, behavior_benchmark, stress_test, level_1/2/3 templates, and __fixtures__/__tests__/_support where safe) interact with workspace manifests, tsconfigs, test discovery, launchers, and registries. They cannot be deferred to"
trigger_phrases:
  - "runtime and package layout"
  - "hyphen naming phase 009"
  - "kebab-case runtime and"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/009-runtime-and-package-layout"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored from the 16-phase decomposition"
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

# Feature Specification: Runtime and package layout

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `008-remove-transition-aliases`; successor `010-migrate-references-and-assets`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/009-runtime-and-package-layout |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 009 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Runtime and package-layout directories (mcp_server, install_scripts, plugin_bridges, matrix_runners, behavior_benchmark, stress_test, level_1/2/3 templates, and __fixtures__/__tests__/_support where safe) interact with workspace manifests, tsconfigs, test discovery, launchers, and registries. They cannot be deferred to "stragglers"; each must move with its full dependency closure so the build stays reproducible.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename in-scope runtime/package-layout directories WITH their manifests, lockfiles, tsconfigs, launchers, imports, tests, and registries, each in one dependency-closed batch.
- Update canonical `package.json` workspaces + regenerate lockfiles when a package path moves.
- Prove deps + build resolve inside the worktree after each batch (`realpath`, fresh install).

### Out of Scope
- General non-runtime references/assets (010).
- General script filenames outside these dirs (011).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each runtime/package-layout dir moves with its complete manifest/launcher/import/test/registry closure | No dangling reference to the old path after the batch |
| REQ-002 | Canonical workspace manifests + lockfiles are updated when a package path moves | `package.json` workspaces and the lockfile reference the new path; a clean install succeeds |
| REQ-003 | Deps and build resolve inside the worktree after each batch | `realpath` on resolved packages + build output stays inside the worktree |
| REQ-004 | Affected builds/typechecks/tests pass after each batch | `tsc`/build and tests for the moved packages are green |
| REQ-005 | Symlink modes and executable bits are preserved on moved launchers | Mode 120000 and +x survive the move |
| REQ-006 | Python import-package directories are NOT renamed | No `_`->`-` on a directory that is imported as a Python package |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Runtime/package-layout dirs are hyphenated with reproducible builds.
- **SC-002**: No dangling manifest/registry/import references.
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
