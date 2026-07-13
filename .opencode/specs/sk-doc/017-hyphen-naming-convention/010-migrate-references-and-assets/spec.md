---
title: "Feature Specification: migrate references and assets (017 phase 010)"
description: "Snake_case folders and files exist under `references/`, `assets/`, and `benchmark/` across skills (non-catalog). These must be hyphenated in dependency-closed batches with their cross-references rewritten in lockstep."
trigger_phrases:
  - "migrate references and assets"
  - "hyphen naming phase 010"
  - "kebab-case migrate references"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/010-migrate-references-and-assets"
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

# Feature Specification: Migrate references and assets

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `009-runtime-and-package-layout`; successor `011-migrate-scripts-and-imports`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/010-migrate-references-and-assets |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 010 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Snake_case folders and files exist under `references/`, `assets/`, and `benchmark/` across skills (non-catalog). These must be hyphenated in dependency-closed batches with their cross-references rewritten in lockstep.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hyphenate snake_case folders/files under `references/`, `assets/`, `benchmark/` across all skills, in dependency-closed batches.
- Rewrite all cross-references and nav links to the renamed paths.

### Out of Scope
- Catalog/playbook content (007).
- Runtime/package layout (009).
- Script filenames + imports (011).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero in-scope underscore names remain under references/assets/benchmark (excl frozen/exempt) | `git ls-files` finds 0 in-scope underscore names in those surfaces |
| REQ-002 | All references to the renamed paths resolve | Markdown-link + path-value resolution is clean over the touched surfaces |
| REQ-003 | Exemptions are honored in these surfaces | No .py/vendored/generated asset name is renamed |
| REQ-004 | Batches are dependency-closed | Each batch lands green without referencing an un-landed rename |
| REQ-005 | Touched packets strict-validate after each batch | `validate.sh --strict` Errors 0 on touched skills |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Reference/asset trees are hyphenated.
- **SC-002**: No broken links in the touched surfaces.
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
