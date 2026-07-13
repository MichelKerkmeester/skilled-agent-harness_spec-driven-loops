---
title: "Feature Specification: migrate specs and docs (019 phase 009)"
description: "Remaining in-scope snake_case names exist across spec docs and other `.md` filesystem names. These must be hyphenated while honoring frozen surfaces (z_archive, changelogs, completed history) and the identifier/key exemption."
trigger_phrases:
  - "migrate specs and docs"
  - "hyphen naming phase 009"
  - "kebab-case migrate specs"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/009-migrate-specs-and-docs"
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

# Feature Specification: Migrate specs and docs

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `008-migrate-scripts-and-imports`; successor `010-migrate-config-and-data`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/009-migrate-specs-and-docs |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 009 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Remaining in-scope snake_case names exist across spec docs and other `.md` filesystem names. These must be hyphenated while honoring frozen surfaces (z_archive, changelogs, completed history) and the identifier/key exemption.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hyphenate in-scope snake_case `.md` and doc filesystem names outside frozen surfaces.
- Rewrite doc cross-references to the renamed paths.

### Out of Scope
- Frozen z_archive/changelog/history.
- Config/data filenames (010).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero in-scope underscore doc filenames remain outside frozen surfaces | `git ls-files` finds 0 in-scope underscore doc names (excl frozen) |
| REQ-002 | Frozen surfaces are untouched | No change under `z_archive/`, changelogs, or completed history |
| REQ-003 | Doc cross-references resolve after the rename | Markdown-link guard is clean |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Doc filesystem names are hyphenated.
- **SC-002**: Frozen history preserved.
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
