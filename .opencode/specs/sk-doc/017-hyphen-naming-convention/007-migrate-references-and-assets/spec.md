---
title: "Feature Specification: migrate references and assets (019 phase 007)"
description: "Snake_case folders and files exist under `references/`, `assets/`, and `benchmark/` across skills (non-catalog). These must be hyphenated with their cross-references rewritten in lockstep."
trigger_phrases:
  - "migrate references and assets"
  - "hyphen naming phase 007"
  - "kebab-case migrate references"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/007-migrate-references-and-assets"
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

# Feature Specification: Migrate references and assets

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `006-migrate-catalog-and-playbook`; successor `008-migrate-scripts-and-imports`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/007-migrate-references-and-assets |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 007 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Snake_case folders and files exist under `references/`, `assets/`, and `benchmark/` across skills (non-catalog). These must be hyphenated with their cross-references rewritten in lockstep.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hyphenate snake_case folders/files under `references/`, `assets/`, `benchmark/` across all skills.
- Rewrite all cross-references and nav links to the renamed paths.

### Out of Scope
- Catalog/playbook content (006).
- Script filenames + imports (008).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero in-scope underscore names remain under references/assets/benchmark (excl frozen/exempt) | `git ls-files` finds 0 in-scope underscore names in those surfaces |
| REQ-002 | All references to the renamed paths resolve | Markdown-link guard is clean over the touched surfaces |
| REQ-003 | Exemptions are honored in these surfaces | No `.py`/vendored/generated asset name is renamed |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Reference/asset trees are hyphenated.
- **SC-002**: No broken links in the touched surfaces.
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
