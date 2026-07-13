---
title: "Feature Specification: migrate catalog and playbook (017 phase 007)"
description: "Packet 027 renamed catalog/playbook content to underscore. This phase reverses it against the 002 hyphen-aware logic: rename the two roots and all underscore content back to hyphens across all skills, rewriting index tables + `category:` frontmatter VALUES + cross-refs, with zero silent `readme` downgrade."
trigger_phrases:
  - "migrate catalog and playbook"
  - "hyphen naming phase 007"
  - "kebab-case migrate catalog"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/007-migrate-catalog-and-playbook"
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

# Feature Specification: Migrate catalog and playbook

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `006-inventory-and-frozen-map`; successor `008-remove-transition-aliases`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/007-migrate-catalog-and-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 007 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 027 renamed catalog/playbook content to underscore. This phase reverses it against the 002 hyphen-aware logic: rename the two roots and all underscore content back to hyphens across all skills, rewriting index tables + `category:` frontmatter VALUES + cross-refs, with zero silent `readme` downgrade.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename `feature_catalog`->`feature-catalog`, `manual_testing_playbook`->`manual-testing-playbook`, and all underscore content back to hyphens, all skills.
- Rewrite index tables + `category:` frontmatter VALUES + cross-references in lockstep.
- Validate each family against the 002 classifier before commit; enumerate every leaf type.

### Out of Scope
- Removing the dual-name alias (008).
- Non-catalog references/assets (010).
- Scripts/imports (011).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero underscore catalog/playbook filesystem names remain (excl frozen) | `git ls-files` finds 0 underscore names under the two roots |
| REQ-002 | The catalog roots are hyphenated and still classify correctly | Every leaf under `feature-catalog` types correctly under the 002 logic — zero `readme` downgrade |
| REQ-003 | All catalog/playbook references resolve after the rename | Index tables + frontmatter values + cross-refs point at hyphenated paths |
| REQ-004 | Only frontmatter VALUES that are paths/slugs change; keys are untouched | Frontmatter key diff is empty; only path-valued fields moved |
| REQ-005 | Lane C scenario IDs and semantics are unchanged vs baseline | Scenario IDs, prompts, expectations, and scores match the 000 snapshot |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 027 is reversed for catalog/playbook content.
- **SC-002**: Classification survives the root rename with zero downgrade.
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
