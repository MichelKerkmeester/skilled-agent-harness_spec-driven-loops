---
title: "Feature Specification: migrate scripts and imports (017 phase 011)"
description: "Snake_case script filenames (`.ts`/`.js`/`.cjs`/`.mjs`/`.sh`) must be renamed to hyphens AND every `import`/`require`/`source`/registry reference fixed in lockstep, in dependency-closed per-skill/package batches, with shared dispatch/runtime scripts as their own cross-cutting batch. A missed reference — including a dyn"
trigger_phrases:
  - "migrate scripts and imports"
  - "hyphen naming phase 011"
  - "kebab-case migrate scripts"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/011-migrate-scripts-and-imports"
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

# Feature Specification: Migrate scripts and imports

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `010-migrate-references-and-assets`; successor `012-migrate-specs-and-docs`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/011-migrate-scripts-and-imports |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 011 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Snake_case script filenames (`.ts`/`.js`/`.cjs`/`.mjs`/`.sh`) must be renamed to hyphens AND every `import`/`require`/`source`/registry reference fixed in lockstep, in dependency-closed per-skill/package batches, with shared dispatch/runtime scripts as their own cross-cutting batch. A missed reference — including a dynamic one — breaks the runtime.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename in-scope snake_case script filenames to hyphens, in dependency-closed batches.
- Fix every `import`/`require`/`source`/registry/config reference to the renamed files in the same pass.
- Shared dispatch/runtime scripts form their own cross-cutting batch.
- Rebuild affected dist and confirm resolution; disposition every dynamic site.

### Out of Scope
- Data/config filenames (013).
- Doc/spec names (012).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero in-scope underscore script filenames remain (excl .py/vendored/generated) | `git ls-files` finds 0 in-scope underscore `.ts/.js/.cjs/.mjs/.sh` names |
| REQ-002 | Every import/require/source/registry reference resolves after the rename | Whole-repo import resolution reports 0 broken references |
| REQ-003 | Every dynamic require/source/glob site is dispositioned | The disposition ledger has no un-handled dynamic site in the touched batch |
| REQ-004 | Affected builds pass and syntax checks are clean | `node --check`, `bash -n`, `tsc`/build, and tests for touched packages pass |
| REQ-005 | Test discovery counts equal the 000 baseline | Discovered test files + cases match the baseline after the rename |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Script filenames are hyphenated.
- **SC-002**: 0 broken imports; builds green; discovery parity.
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
