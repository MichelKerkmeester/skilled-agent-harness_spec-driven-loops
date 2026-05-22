---
title: "Feature Specification: 116/002 - Seeded Fixture Harness"
description: "Level 2 fixture-first packet for review-depth v2 contract tests that fail today and gate phases C-G."
trigger_phrases:
  - "deep-review seeded fixtures"
  - "review-depth fixture harness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/002-seeded-fixture-harness"
    last_updated_at: "2026-05-22T11:19:32Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Populated Level 2 fixture harness docs."
    next_safe_action: "Use seeded failing fixtures to drive phases 003-007."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-convergence.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-graph.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1160020000000000000000000000000000000000000000000000000000000000"
      session_id: "116-002-seeded-fixture-harness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 002 is fixture-only and must not modify downstream production files."
      - "Seeded tests encode the frozen v2 review-depth contract before implementation phases ship."
---
# Feature Specification: 116/002 - Seeded Fixture Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 8 |
| **Predecessor** | `../001-research-synthesis/spec.md` |
| **Successor** | `../003-review-depth-schema-and-prompt-contract/spec.md` |
| **Handoff Criteria** | Four review-depth Vitest fixture files exist, load, and document today-red/todo/skip behavior for phases D-G. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 001 found that `deep-review` can validate active findings while still failing to prove enough pre-finding candidate search. Without seeded failing fixtures first, later phases could add `searchLedger` fields, graph nodes, or reducer keys without proving that shallow no-finding review records are rejected.

### Purpose

Create a fixture harness that encodes the frozen v2 review-depth contract before production changes begin. The harness must fail, skip, or remain todo against today's implementation in ways that are useful to phases 004 through 007.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Level 2 documentation for the phase 002 fixture-only packet.
- Validator fixtures for missing `searchLedger`, uncited ledger rows, broken finding links, shallow active findings, and state/delta identity mismatch.
- Reducer fixture for future `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage` registry exposure.
- Convergence fixture for graphless standard-scope records that must emit named STOP_BLOCKED blockers.
- Graph vocabulary fixture for future review node kinds: `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST`.

### Out of Scope

- Modifying the review-depth schema or prompt contract.
- Modifying `post-dispatch-validate.ts`.
- Modifying `reduce-state.cjs`.
- Modifying coverage graph convergence, upsert, database, or handler code.
- Modifying deep-review YAML command assets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts` | Create | Future Phase 004 validator contract fixtures for v2 record enforcement. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts` | Create | Future Phase 005 reducer fixture for search-debt registry exposure. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-convergence.vitest.ts` | Create | Future Phase 006 convergence fixture for graphless fallback blockers. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-graph.vitest.ts` | Create | Future Phase 007 graph vocabulary fixture for review candidate node kinds. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Encode the frozen v2 review-depth field names verbatim. | Fixtures use `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger`. |
| REQ-002 | Add validator fixture coverage for explicit v2 shallow records. | `review-depth-validator.vitest.ts` contains five named cases mapped to Phase 004 behavior. |
| REQ-003 | Add reducer fixture coverage for search-debt persistence. | `review-depth-reducer.vitest.ts` asserts registry keys that today's reducer does not expose. |
| REQ-004 | Add convergence fixture coverage for graphless fallback. | `review-depth-convergence.vitest.ts` expects `BLOCKED_STOP` and named candidate/graphless blockers. |
| REQ-005 | Add graph vocabulary fixture coverage. | `review-depth-graph.vitest.ts` documents today's unsupported-kind behavior and skipped future success cases. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Keep Phase 002 fixture-only. | No downstream production files listed in the parent prompt are modified. |
| REQ-007 | Preserve existing test style. | Tests mirror local Vitest helper patterns, temp directories, JSONL fixtures, and coverage-graph module loading. |
| REQ-008 | Refresh metadata. | `description.json` and `graph-metadata.json` are regenerated for Level 2 after docs and fixtures are authored. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four `review-depth-*.vitest.ts` files load in the targeted Vitest run.
- **SC-002**: Today-red fixtures fail or remain todo/skip with comments naming the downstream phase that will make them pass.
- **SC-003**: The graph vocabulary fixture has one passing current-state assertion for unsupported review node kinds.
- **SC-004**: Strict spec validation exits 0 with `RESULT: PASSED`.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current validator return shape | Some v2 failures cannot be expressed as reason-specific assertions yet. | Use `it.todo` for reason codes owned by Phase 004. |
| Dependency | Reducer writes expect a review artifact layout. | Direct reducer invocation can be brittle if temp fixtures omit required files. | Use the exported `reduceReviewState` helper with a minimal `review/` artifact root. |
| Risk | Intentional failing tests can look like regressions. | CI consumers may misread seeded red tests as accidental breakage. | Comments and test names include the expected future phase. |
| Risk | Fixture harness accidentally changes behavior. | Phase 002 must not implement downstream production logic. | Only new test files and spec docs are written. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Fixture records remain small enough to read inline.
- **NFR-M02**: Every future-phase expectation names the phase that owns the implementation.
- **NFR-M03**: Test helpers avoid shared global state except isolated coverage-graph DB temp dirs.

### Reliability

- **NFR-R01**: Temp directories are removed after each test.
- **NFR-R02**: Coverage-graph DB modules reset between tests to avoid namespace leakage.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Contract Boundaries

- **Legacy unversioned record**: Not enforced by this harness; Phase 004 owns warning/advisory migration behavior.
- **Trivial scope**: Not part of the strict missing-ledger failure; the seeded validator case uses `scopeClass: "standard"`.
- **Graphless mode**: Must be explicit via `searchCoverage.graphCoverageMode: "graphless_fallback"`.
- **Finding disposition**: A ledger row with `disposition: "finding"` must link to a real `findingDetails[].id`.

### Current-State Behavior

- **Unsupported graph kinds**: Today's review graph allow-list rejects `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST`.
- **Reducer search debt**: Today's registry omits the future search-debt fields.
- **Delta identity**: Today's validator accepts any delta iteration record rather than matching the appended state-log iteration.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY

| Factor | Assessment |
|--------|------------|
| Files touched | 11 authored/metadata files, including four new Vitest fixtures |
| Risk level | Medium: tests are intentionally red/todo/skip but production code is untouched |
| Validation need | High: future phases depend on these fixtures as contract gates |
| Documentation level | Level 2 because this is a multi-file verification harness with checklist evidence |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None. The frozen v2 field names and downstream phase ownership are provided by the phase prompt.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent phase map**: `../spec.md`
- **Frozen v2 source**: `../001-research-synthesis/research/research.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
