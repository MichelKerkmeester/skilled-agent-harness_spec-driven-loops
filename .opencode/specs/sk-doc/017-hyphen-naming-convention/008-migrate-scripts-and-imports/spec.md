---
title: "Feature Specification: migrate script filenames and imports (019 phase 008)"
description: "Snake_case script filenames (`.ts`/`.js`/`.cjs`/`.mjs`/`.sh`) must be renamed to hyphens AND every `import`/`require`/`source`/registry path reference fixed in lockstep. This is the highest-risk phase — a missed reference breaks the runtime."
trigger_phrases:
  - "migrate script filenames and imports"
  - "hyphen naming phase 008"
  - "kebab-case migrate scripts"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-migrate-scripts-and-imports"
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

# Feature Specification: Migrate script filenames and imports

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `007-migrate-references-and-assets`; successor `009-migrate-specs-and-docs`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-migrate-scripts-and-imports |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 008 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Snake_case script filenames (`.ts`/`.js`/`.cjs`/`.mjs`/`.sh`) must be renamed to hyphens AND every `import`/`require`/`source`/registry path reference fixed in lockstep. This is the highest-risk phase — a missed reference breaks the runtime.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename in-scope snake_case script filenames to hyphens.
- Fix every `import`/`require`/`source`/registry/config path reference to the renamed files in the same pass.
- Rebuild affected dist and confirm resolution.

### Out of Scope
- Data/config filenames (010).
- Doc/spec names (009).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero in-scope underscore script filenames remain (excl `.py`/vendored/generated) | `git ls-files` finds 0 in-scope underscore `.ts/.js/.cjs/.mjs/.sh` names |
| REQ-002 | Every import/require/source/registry reference resolves after the rename | Whole-repo import resolution reports 0 broken references |
| REQ-003 | Affected builds pass after the rename | `tsc`/build and test suites for touched packages pass |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Script filenames are hyphenated.
- **SC-002**: 0 broken imports; builds green.
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
