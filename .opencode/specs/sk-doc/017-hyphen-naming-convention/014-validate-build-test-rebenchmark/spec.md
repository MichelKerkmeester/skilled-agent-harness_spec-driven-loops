---
title: "Feature Specification: validate, build, test, re-benchmark (017 phase 014)"
description: "After the surface-by-surface migration, the whole repo must be proven green against the 000 baseline: the `--all` naming guard, all build/test/typecheck gates with discovery-count parity, whole-repo import + path + link resolution, recursive strict validation, and a fixed-seed Lane C re-baseline with no regression — al"
trigger_phrases:
  - "validate, build, test, re-benchmark"
  - "hyphen naming phase 014"
  - "kebab-case validate build"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/014-validate-build-test-rebenchmark"
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

# Feature Specification: Validate, build, test, re-benchmark

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `013-migrate-config-and-data`; successor `015-integrate-and-closeout`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/014-validate-build-test-rebenchmark |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 014 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After the surface-by-surface migration, the whole repo must be proven green against the 000 baseline: the `--all` naming guard, all build/test/typecheck gates with discovery-count parity, whole-repo import + path + link resolution, recursive strict validation, and a fixed-seed Lane C re-baseline with no regression — all without mutating any tracked file.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the `--all` naming guard (0 in-scope snake_case remain, scope-aware).
- Every affected build/typecheck/test suite, with test-discovery-count parity vs baseline.
- Whole-repo import + path-value + markdown-link resolution (target 0 broken).
- Recursive `validate.sh --strict` across touched skills.
- A fixed-seed Lane C re-baseline (semantic + score, compared by ID) vs the 000 snapshot.

### Out of Scope
- Any further renaming.
- Integration/closeout (015).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `--all` guard reports zero in-scope snake_case names (scope-aware) | The whole-tree guard passes and rejects a planted violation |
| REQ-002 | All build/test/typecheck gates pass with discovery-count parity | Discovered test files + cases equal the 000 baseline; suites green |
| REQ-003 | Whole-repo import/path/link resolution shows 0 broken references | The rename-map-driven checker + link resolver report 0 broken |
| REQ-004 | Recursive strict validation is Errors 0 across touched skills | `validate.sh --recursive --strict` Errors 0 |
| REQ-005 | Lane C shows no scoring regression vs the pinned baseline | Scenario IDs + semantics + scores match the 000 snapshot within tolerance |
| REQ-006 | Verification mutates no tracked file | `git diff-index --quiet HEAD --` after the gate |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Whole repo is green post-migration.
- **SC-002**: No benchmark, import, or discovery regression.
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
