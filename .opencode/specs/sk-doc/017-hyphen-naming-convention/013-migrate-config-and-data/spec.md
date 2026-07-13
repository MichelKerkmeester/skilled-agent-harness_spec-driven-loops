---
title: "Feature Specification: migrate config and data (017 phase 013)"
description: "Remaining in-scope `.json`/`.yaml`/`.yml`/`.toml` DATA/CONFIG filenames (not keys) and stragglers must be hyphenated, honoring lockfile/generated and tool-mandated exemptions. A tracked SQLite DB holds old catalog/playbook paths and must be classified and handled schema-aware, never by raw byte replacement."
trigger_phrases:
  - "migrate config and data"
  - "hyphen naming phase 013"
  - "kebab-case migrate config"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/013-migrate-config-and-data"
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

# Feature Specification: Migrate config and data

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `012-migrate-specs-and-docs`; successor `014-validate-build-test-rebenchmark`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/013-migrate-config-and-data |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 013 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Remaining in-scope `.json`/`.yaml`/`.yml`/`.toml` DATA/CONFIG filenames (not keys) and stragglers must be hyphenated, honoring lockfile/generated and tool-mandated exemptions. A tracked SQLite DB holds old catalog/playbook paths and must be classified and handled schema-aware, never by raw byte replacement.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hyphenate in-scope snake_case `.json`/`.yaml`/`.yml`/`.toml` data/config filenames.
- Fix references/loaders that point at the renamed files.
- Classify the tracked SQLite DB (active/regenerable/historical) and handle it schema-aware or by regeneration.
- Final exemption reconciliation for stragglers; symlink + magic-name preservation.

### Out of Scope
- JSON/YAML/TOML KEYS (out of scope entirely).
- Lockfiles/generated/tool-mandated filenames (exempt).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero in-scope underscore data/config filenames remain (excl exempt) | `git ls-files` finds 0 in-scope underscore `.json/.yaml/.yml/.toml` names |
| REQ-002 | No JSON/YAML/TOML key was altered | Before/after key sets are identical; only filenames moved |
| REQ-003 | Loaders/config references resolve after the rename | Config-loading tests pass; changed path values resolve |
| REQ-004 | The tracked SQLite DB is classified and handled without raw byte replacement | The DB is migrated schema-aware or regenerated; no raw byte edit |
| REQ-005 | Symlinks and tool-magic name sets are preserved | All symlinks resolve; protected magic-name paths are unchanged |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Data/config filenames are hyphenated.
- **SC-002**: Keys, DB integrity, and exemptions preserved.
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
