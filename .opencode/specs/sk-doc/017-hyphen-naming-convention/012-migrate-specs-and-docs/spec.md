---
title: "Feature Specification: migrate specs and docs (017 phase 012)"
description: "Remaining in-scope snake_case names exist across spec docs and other `.md` filesystem names. These must be hyphenated while honoring frozen surfaces (z_archive, changelogs, completed history) and the identifier/key exemption, with markdown links resolved across active specs/docs."
trigger_phrases:
  - "migrate specs and docs"
  - "hyphen naming phase 012"
  - "kebab-case migrate specs"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/012-migrate-specs-and-docs"
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

# Feature Specification: Migrate specs and docs

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `011-migrate-scripts-and-imports`; successor `013-migrate-config-and-data`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/012-migrate-specs-and-docs |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 012 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Remaining in-scope snake_case names exist across spec docs and other `.md` filesystem names. These must be hyphenated while honoring frozen surfaces (z_archive, changelogs, completed history) and the identifier/key exemption, with markdown links resolved across active specs/docs.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hyphenate in-scope snake_case `.md` and doc filesystem names outside frozen surfaces.
- Rewrite doc cross-references to the renamed paths.
- Resolve markdown links across all active specs/docs (not just current checker roots).

### Out of Scope
- Frozen z_archive/changelog/history.
- Config/data filenames (013).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero in-scope underscore doc filenames remain outside frozen surfaces | `git ls-files` finds 0 in-scope underscore doc names (excl frozen) |
| REQ-002 | Frozen surfaces are untouched except an approved supersession note | No content change under `z_archive/`, changelogs, or completed history beyond the approved note |
| REQ-003 | Doc cross-references and markdown links resolve after the rename | Markdown-link resolution across active specs/docs is clean |
| REQ-004 | Every touched packet/skill strict-validates | `validate.sh --strict` Errors 0 on touched packets |
| REQ-005 | Identifier/key content is not altered by the doc rename | Only filesystem names + path references changed; prose identifiers untouched |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Doc filesystem names are hyphenated.
- **SC-002**: Frozen history preserved; links resolve.
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
