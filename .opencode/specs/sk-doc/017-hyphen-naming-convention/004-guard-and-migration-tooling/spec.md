---
title: "Feature Specification: guard and migration tooling (019 phase 004)"
description: "Nothing prevents snake_case from re-entering in-scope names, and there is no engine to perform the repo-wide rename safely. The program needs an exemption-aware no-new-snake_case guard and a deterministic, dry-run-default rename engine with collision hard-abort and an in-lockstep reference + import sweep."
trigger_phrases:
  - "guard and migration tooling"
  - "hyphen naming phase 004"
  - "kebab-case guard and"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/004-guard-and-migration-tooling"
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

# Feature Specification: Guard and migration tooling

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `003-create-generators-and-templates`; successor `005-inventory-and-partitioning`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/004-guard-and-migration-tooling |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 004 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Nothing prevents snake_case from re-entering in-scope names, and there is no engine to perform the repo-wide rename safely. The program needs an exemption-aware no-new-snake_case guard and a deterministic, dry-run-default rename engine with collision hard-abort and an in-lockstep reference + import sweep.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A no-new-snake_case guard that fails on a new in-scope snake_case FS name and respects every exemption.
- A deterministic rename engine: path-segment `_`->`-`, collision hard-abort, reference + import sweep, exemption deny-list, dry-run default (no mutation without an explicit apply).
- A safety/collision + exemption report emitted before any write.

### Out of Scope
- Running the migration (005+).
- The convention doc (001).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The guard rejects a fresh in-scope snake_case name and accepts a hyphenated one | A synthetic snake_case file fails the guard; a hyphenated one passes |
| REQ-002 | The rename engine is dry-run by default and hard-aborts on any collision | A synthetic colliding pair aborts before any write |
| REQ-003 | The engine rewrites references and imports in the same pass as the rename | A renamed file has all its importers updated in the dry-run diff |
| REQ-004 | Every exemption class is enforced by the engine deny-list | Vendored/`.py`/generated/tool-mandated names are never in the rename map |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The guard prevents regressions.
- **SC-002**: The engine can migrate safely with a reviewable dry-run.
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
