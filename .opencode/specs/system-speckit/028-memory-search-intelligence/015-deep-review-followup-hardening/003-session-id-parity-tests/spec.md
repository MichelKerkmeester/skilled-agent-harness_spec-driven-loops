---
title: "Feature Specification: Session-Id Parity Tests"
description: "Pin the review/context/research workflow YAMLs' session-id resolve contract with structural parity tests so the three modes cannot silently drift apart again."
trigger_phrases:
  - "session id parity tests"
  - "cross mode parity"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/003-session-id-parity-tests"
    last_updated_at: "2026-07-02T17:16:50Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Implemented parity tests"
    next_safe_action: "Use parity suite during future YAML edits"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/unit/workflow-session-id-parity.vitest.ts"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
      - ".opencode/commands/deep/assets/deep_context_auto.yaml"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-003-parity-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Session-Id Parity Tests

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

The fan-out session-id propagation bug was fixed twice: once for review (packet 030, phase 011 child 001) and again for context/research (2026-07-02 remediation of review finding GPT-F004), because nothing enforced that the three loop-mode workflow YAMLs stay aligned. The review explicitly recommended cross-mode parity tests. This child adds them: structural vitest assertions that each of the three YAMLs resolves a caller-supplied session id through the same contract (`step_resolve_session_id` with an `if_present` bind of `{session_id}` and config consumption of `{session_id_init}`), plus a runtime-side assertion that the fan-out prompt builder emits the session id for all three loop types. Drift becomes a failing test instead of a future review finding.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | A parity vitest suite fails when any of the three YAMLs loses the resolve step, the if_present bind, the if_absent fallback, or the session_id_init consumption, and passes on the current aligned state; fan-out prompt emission covered for all three loop types; full deep-loop-runtime suite has 0 new failures over the known two-failure baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Cross-mode workflow parity is maintained by discipline, not tests. The session-id contract has three coordinated pieces — the runner supplies `session_id` in the lineage prompt (`fanout-run.cjs` `buildLoopPrompt`), each mode's init YAML resolves it (`step_resolve_session_id`, falling back to the mode's default when absent), and the config creation consumes `{session_id_init}` — and history shows the pieces drift: review got the resolve step in packet 030 while context/research silently kept `{AUTO_SESSION_ID}` until a deep-review caught it (GPT-F004). The identical regression can reoccur with any future YAML edit.

### Purpose
Encode the three-mode contract as executable assertions so any single-mode edit that breaks parity fails fast in the test suite.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new vitest file that loads the three `deep_*_auto.yaml` assets and asserts, per mode: the resolve step exists; `if_present` binds `session_id_init` from `{session_id}`; `if_absent` binds the mode's documented fallback; config creation consumes `{session_id_init}` for the lineage/session id field.
- Assertions on `buildLoopPrompt` (or its exported equivalent) that the rendered lineage prompt contains the `session_id:` line for loop types review, context, and research.

### Out of Scope
- Changing any YAML behavior (the contract is already aligned; this pins it).
- End-to-end lineage dispatch tests.
- Parity dimensions beyond session-id (a future generalization can extend the file).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/tests/unit/workflow-session-id-parity.vitest.ts` | Create | Structural parity assertions across the three YAMLs + prompt emission |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Drift detection | Removing or renaming the resolve step, the if_present bind, or the session_id_init consumption in ANY one YAML makes the suite fail with a mode-naming message |
| REQ-002 | Current state passes | The suite is green against the aligned 2026-07-02 state without modifying any YAML |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Prompt emission coverage | The session_id line is asserted present in rendered lineage prompts for all three loop types |
| REQ-004 | Fallback preservation | Each mode's if_absent fallback is asserted (review: timestamp; context/research: AUTO_SESSION_ID) so the fix's behavior-preserving design is pinned too |

### P2 — Traceability & Hygiene

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Test-only delivery | Final production diffs are empty for the three workflow YAML assets and `fanout-run.cjs`; only the new test file and this spec folder are modified |
| REQ-006 | Symmetric mode coverage | The same structural assertion path runs for review, context, and research; no mode gets a weaker check |
| REQ-007 | Diagnostic failure messages | Every drift failure message names the affected mode and missing or mismatched contract piece |
| REQ-008 | Quality-gate evidence | Comment hygiene, OpenCode alignment drift, targeted vitest, drift-red checks, and full-suite baseline evidence are recorded in the checklist and implementation summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Suite green on current state; red (with clear message) under each injected drift class.
- **SC-002**: Full deep-loop-runtime vitest suite: 0 new failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-tight string matching breaks on cosmetic YAML edits | M | Parse YAML structurally; assert on parsed nodes, not raw text, except where the contract IS a literal token |
| Dependency | YAML parser availability in the runtime test env | L | Use whatever the package already depends on; a minimal structural walk suffices |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-001 | Hermeticity | Tests read repo files only; no dispatch, no network | Pure file + function tests |
| NFR-002 | Diagnosability | Failures name the mode and the missing contract piece | Assertion messages include mode + piece |

## 8. EDGE CASES

| # | Edge Case | Expected Behavior |
|---|-----------|-------------------|
| 1 | YAML file missing entirely | Test fails loudly (missing asset is itself a regression) |
| 2 | Resolve step present but binds a wrong variable name | Fails: the bind target is part of the contract |
| 3 | Config consumes session_id directly (skipping session_id_init) | Fails: bypassing the resolve step breaks the fallback path |
| 4 | A fourth mode YAML appears later | Out of scope; test enumerates the three known modes explicitly |

## 9. COMPLEXITY ASSESSMENT

| Factor | Assessment | Notes |
|--------|------------|-------|
| Code | Small | One test file, no production changes |
| Risk | Minimal | Read-only over assets + pure function |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Brittle assertions cause noise | Medium | Low | Structural parsing; literal matching only for contract tokens |
| False confidence (tests pass, runtime still broken) | Low | Medium | Prompt-emission assertions cover the runtime half of the contract |

## 11. USER STORIES

- **US-001**: As a maintainer editing one mode's YAML, a broken session-id contract fails CI-grade tests immediately with the mode named. Acceptance: injected drift produces a naming failure.
- **US-002**: As the program owner, the GPT-F004 recommendation is closed with executable enforcement, not documentation. Acceptance: suite exists and is green.

## 12. OPEN QUESTIONS

- None. The contract shape is fixed and live in all three YAMLs.
<!-- /ANCHOR:questions -->

---

## 13. ACCEPTANCE SCENARIOS

### Scenario 1: Current Aligned State Passes

**Given** the three auto workflow YAML assets are in their aligned current state
**When** the parity suite runs
**Then** it passes all YAML contract and fan-out prompt-emission assertions.

### Scenario 2: Missing Resolve Step Fails Loudly

**Given** one mode's `step_resolve_session_id` is renamed or removed
**When** the parity suite runs
**Then** it fails with a message naming that mode and the missing resolve step.

### Scenario 3: Wrong Caller Bind Fails Loudly

**Given** one mode's `if_present.bind.session_id_init` no longer consumes `{session_id}`
**When** the parity suite runs
**Then** it fails with a message naming that mode and the caller bind mismatch.

### Scenario 4: Wrong Fallback Fails Loudly

**Given** one mode's `if_absent.bind.session_id_init` changes away from its documented fallback
**When** the parity suite runs
**Then** it fails with a message naming that mode and expected fallback token.

### Scenario 5: Bypassed Init Value Fails Loudly

**Given** config creation consumes `{session_id}` directly instead of `{session_id_init}`
**When** the parity suite runs
**Then** it fails with a message naming that mode and the config-consumption field.

### Scenario 6: Prompt Emission Stays Covered

**Given** `buildLoopPrompt` renders review, context, and research fan-out lineages
**When** the parity suite inspects each rendered prompt
**Then** every prompt contains the `session_id:` line for its supplied lineage session id.

---

## RELATED DOCUMENTS

- **Origin finding**: GPT-F004 in `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/gpt/review-report.md` (recommendation: "add cross-mode parity tests")
- **The contract under test**: `step_resolve_session_id` in the three `deep_*_auto.yaml` assets; `buildLoopPrompt` in `fanout-run.cjs`
- **Local decisions**: `decision-record.md` — **Plan**: `plan.md` — **Tasks**: `tasks.md` — **Checklist**: `checklist.md`
- **Parent**: `../spec.md`

---

## 16. VALIDATION MANIFEST COVERAGE

This appendix maps the compact child packet back to the Level 3 manifest sections without expanding the implementation scope.

## 17. PLAN SUMMARY COVERAGE

Covered by `plan.md` summary and the zero-production-change overview.

## 18. PLAN QUALITY GATES COVERAGE

Covered by targeted parity tests, drift-red checks, restoration checks, and full-suite baseline evidence.

## 19. PLAN ARCHITECTURE COVERAGE

Covered by the contract-test architecture: structural YAML reads plus pure prompt-builder assertions.

## 20. PLAN PHASE COVERAGE

Covered by the setup, implementation, and verification task phases.

## 21. PLAN TESTING COVERAGE

Covered by vitest, manual drift injection, comment hygiene, alignment drift, and strict spec validation.

## 22. PLAN DEPENDENCIES COVERAGE

Covered by the dependency table: no external runtime dependencies were added.

## 23. PLAN ROLLBACK COVERAGE

Covered by the test-only rollback path: delete the parity suite.

## 24. PLAN PHASE DEPENDENCIES COVERAGE

Covered by setup before assertions, assertions before drift verification, and docs after verification.

## 25. PLAN EFFORT COVERAGE

Covered by the small-effort estimate: one test file plus spec documentation.

## 26. PLAN ENHANCED ROLLBACK COVERAGE

Covered by fallback handling for parser unavailability and prompt-builder import failure.

## 27. PLAN AI EXECUTION COVERAGE

Covered by the execution protocol that constrained scope, parsing style, messages, and verification.

## 28. PLAN ARCHITECTURE OVERVIEW COVERAGE

Covered by the data-flow and dependency-graph sections in `plan.md`.

## 29. PLAN RISK MITIGATION COVERAGE

Covered by structural parsing and behavior-preserving fallback assertions.

## 30. TASK NOTATION COVERAGE

Covered by the task notation table in `tasks.md`.

## 31. TASK SETUP COVERAGE

Covered by locating YAML contract paths and prompt-builder import shape.

## 32. TASK IMPLEMENTATION COVERAGE

Covered by structural assertions and prompt-emission assertions.

## 33. TASK VERIFICATION COVERAGE

Covered by green-on-truth, red-on-drift, restoration, and full-suite checks.

## 34. TASK COMPLETION COVERAGE

Covered by all task items being checked with validation evidence.

## 35. TASK CROSS-REFERENCES COVERAGE

Covered by links to the spec, plan, decisions, checklist, and implementation summary.

## 36. TASK ARCHITECTURE COVERAGE

Covered by keeping the architectural task surface limited to contract tests.

## 37. SUMMARY METADATA COVERAGE

Covered by the implementation-summary metadata table.

## 38. SUMMARY BUILD COVERAGE

Covered by the implementation-summary build narrative.

## 39. SUMMARY DELIVERY COVERAGE

Covered by the implementation-summary delivery narrative.

## 40. SUMMARY DECISIONS COVERAGE

Covered by the implementation-summary decision table.

## 41. SUMMARY VERIFICATION COVERAGE

Covered by the implementation-summary verification table.

## 42. SUMMARY LIMITATIONS COVERAGE

Covered by the recorded known runtime-suite baseline limitation.

## 43. SUMMARY ARCHITECTURE COVERAGE

Covered by the test-only contract-test architecture summary.

## 44. CHECKLIST PROTOCOL COVERAGE

Covered by P0, P1, and P2 verification handling.

## 45. CHECKLIST PRE-IMPLEMENTATION COVERAGE

Covered by requirements, approach, and decision-record evidence.

## 46. CHECKLIST CODE QUALITY COVERAGE

Covered by comment hygiene and structural assertion evidence.

## 47. CHECKLIST TESTING COVERAGE

Covered by targeted, drift-red, prompt-emission, fallback, and full-suite evidence.

## 48. CHECKLIST SECURITY COVERAGE

Covered by hermetic file and function tests with no secrets, dispatch, or network.

## 49. CHECKLIST DOCUMENTATION COVERAGE

Covered by implementation-summary drift-injection evidence.

## 50. CHECKLIST FILE ORGANIZATION COVERAGE

Covered by one new test file, scoped spec docs, and restored production assets.

## 51. CHECKLIST ARCHITECTURE VERIFICATION COVERAGE

Covered by ADR-aligned no-dispatch contract testing.

## 52. CHECKLIST PERFORMANCE COVERAGE

Covered by the 103ms targeted parity-suite runtime.

## 53. CHECKLIST DEPLOYMENT COVERAGE

Covered by the no-production-surface rollback model.

## 54. CHECKLIST COMPLIANCE COVERAGE

Covered by the internal-test-only compliance assessment.

## 55. CHECKLIST DOCUMENTATION VERIFICATION COVERAGE

Covered by final-state agreement across the spec folder docs.

## 56. CHECKLIST SIGN-OFF COVERAGE

Covered by orchestrator reruns of targeted, drift-red, isolated, and full-suite checks.

## 57. DECISION RECORD CONTEXT COVERAGE

Covered by the ADR context explaining why parity tests are needed.

## 58. DECISION RECORD ALTERNATIVES COVERAGE

Covered by rejected end-to-end and raw-text-only alternatives.

## 59. DECISION RECORD CONSEQUENCES COVERAGE

Covered by the accepted tradeoff: lightweight structural tests over broad dispatch coverage.
