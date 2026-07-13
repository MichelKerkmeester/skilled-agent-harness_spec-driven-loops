---
title: "Feature Specification: migrate config and data filenames (019 phase 010)"
description: "Remaining in-scope `.json`/`.yaml`/`.yml` DATA/CONFIG filenames (not keys) and any stragglers must be hyphenated, honoring lockfile/generated and tool-mandated exemptions."
trigger_phrases:
  - "migrate config and data filenames"
  - "hyphen naming phase 010"
  - "kebab-case migrate config"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/010-migrate-config-and-data"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec scaffolded from the 019 decomposition"
    next_safe_action: "Plan this phase when it is picked up for execution"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Migrate config and data filenames

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `009-migrate-specs-and-docs`; successor `011-validate-build-test-rebenchmark`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/010-migrate-config-and-data |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 010 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Remaining in-scope `.json`/`.yaml`/`.yml` DATA/CONFIG filenames (not keys) and any stragglers must be hyphenated, honoring lockfile/generated and tool-mandated exemptions.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hyphenate in-scope snake_case `.json`/`.yaml`/`.yml` data/config filenames.
- Fix references/loaders that point at the renamed files.
- Final exemption reconciliation for stragglers.

### Out of Scope
- JSON/YAML KEYS (out of scope entirely).
- Lockfiles/generated/tool-mandated filenames (exempt).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero in-scope underscore data/config filenames remain (excl exempt) | `git ls-files` finds 0 in-scope underscore `.json/.yaml/.yml` names |
| REQ-002 | No JSON/YAML key was altered | Key diffs show 0 changed keys; only filenames moved |
| REQ-003 | Loaders/config references resolve after the rename | Config-loading tests pass |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Data/config filenames are hyphenated.
- **SC-002**: Keys and exemptions untouched.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 019 parent spec (import breakage, validator downgrade, over-broad sweep,
exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md when it is planned.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking at scaffold time; resolved during this phase's planning.
<!-- /ANCHOR:questions -->
