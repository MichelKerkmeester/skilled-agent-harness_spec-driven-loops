---
title: "Feature Specification: validate, build, test, re-benchmark (019 phase 011)"
description: "After the surface-by-surface migration, the whole repo must be proven green: recursive strict validation, all build/test/typecheck gates, whole-repo import + link resolution, and a Lane C benchmark re-baseline with no regression, plus proof the guard fires."
trigger_phrases:
  - "validate, build, test, re-benchmark"
  - "hyphen naming phase 011"
  - "kebab-case validate build"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/011-validate-build-test-rebenchmark"
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

# Feature Specification: Validate, build, test, re-benchmark

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `010-migrate-config-and-data`; successor `012-supersede-027-and-closeout`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/011-validate-build-test-rebenchmark |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 011 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After the surface-by-surface migration, the whole repo must be proven green: recursive strict validation, all build/test/typecheck gates, whole-repo import + link resolution, and a Lane C benchmark re-baseline with no regression, plus proof the guard fires.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recursive `validate.sh --strict` on touched skills.
- Full build/test/typecheck gates.
- Whole-repo import + markdown-link resolution (target 0 broken).
- Lane C re-baseline vs the pre-migration snapshot.
- Prove the no-new-snake guard fires.

### Out of Scope
- Any further renaming.
- Close-out/merge (012).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Recursive strict validation is Errors 0 across touched skills | `validate.sh --recursive --strict` Errors 0 |
| REQ-002 | All build/test/typecheck gates pass and imports resolve | 0 broken imports; build + tests green |
| REQ-003 | Lane C shows no scoring regression vs baseline | Scenario count unchanged; scores within tolerance |
| REQ-004 | The no-new-snake guard fires on a synthetic violation | A planted snake_case name fails the guard |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Whole repo is green post-migration.
- **SC-002**: No benchmark or import regression.
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
