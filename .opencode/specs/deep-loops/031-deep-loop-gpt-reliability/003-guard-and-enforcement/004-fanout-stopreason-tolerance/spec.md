---
title: "Feature Specification: Phase 18: fanout-stopreason-tolerance"
description: "The fan-out max-iterations policy validator fails a fully-completed review lineage when its synthesis stopReason string is a non-canonical variant of maxIterationsReached, even though the iteration count already proves the lineage ran every iteration; loosen the string check to tolerate the max-iterations family while still rejecting genuinely different stop reasons."
trigger_phrases:
  - "fanout stopreason tolerance"
  - "isMaxIterationsStopReason"
  - "fanout max-iterations policy validation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/004-fanout-stopreason-tolerance"
    last_updated_at: "2026-07-04T10:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored spec from the 032 review fan-out false-failure observation"
    next_safe_action: "Implement the tolerant stop-reason check and test"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-phase-018-fanout-stopreason-tolerance-20260704"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 18: fanout-stopreason-tolerance

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-04 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 |
| **Predecessor** | 017-loop-guard-implementation |
| **Successor** | none |
| **Handoff Criteria** | The tolerant stop-reason check lands with a RED/GREEN unit test proving a `max-iterations (10/10)`-style lineage passes and genuinely-different reasons still fail; the runtime vitest suite is green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the deep-loop GPT/OpenCode orchestration packet: a fan-out runtime robustness fix surfaced by the 2026-07-04 dual-model deep review of the goal plugin. That review ran two parallel `cli-opencode` review lineages; the MiniMax lineage completed all 10 iterations and wrote a full `review-report.md`, but `fanout-run.cjs` classified it as `failed` solely because its `synthesis_complete` event carried `"stopReason":"max-iterations (10/10)"` instead of the canonical literal `"maxIterationsReached"`. The sibling Kimi lineage wrote the canonical value and passed. The false failure is a formatting-strictness bug, not a review defect.

**Scope Boundary**: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` and its unit test only. No change to what synthesis writes, to the iteration-count check, or to any other validator.

**Dependencies**: none.

**Deliverables**:
- A small pure `isMaxIterationsStopReason()` helper that normalizes a stop-reason string and matches the max-iterations family
- `findMaxIterationsPolicyViolation` uses the helper instead of a strict equality check
- Unit-test coverage pinning both the tolerated variants and the rejected reasons

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`findMaxIterationsPolicyViolation` (fanout-run.cjs:~619) rejects a lineage whenever `synthesis.stopReason !== 'maxIterationsReached'`. The synthesis event is written by the lineage's model, whose formatting cannot be perfectly controlled; a semantically-correct value like `max-iterations (10/10)` fails the exact-string check. Crucially, the same function has already verified `totalIterations === lineage.iterations` two lines earlier, so the lineage is proven to have run every iteration before the string check runs. The strict check therefore adds no safety the count check does not already provide, but it does convert a complete, valid review into a spurious `failed` lineage in fan-out orchestration.

### Purpose
A fan-out lineage that ran every iteration is judged on that fact, not on the exact spelling of its stop-reason string. The validator tolerates the max-iterations family of stop reasons while still rejecting stop reasons that indicate a genuinely different outcome (convergence, manual stop, error).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `isMaxIterationsStopReason(stopReason)`: returns true when the normalized (lowercased, non-alphabetic characters stripped) string starts with `maxiteration`
- Replace the strict `!== 'maxIterationsReached'` check in `findMaxIterationsPolicyViolation` with `!isMaxIterationsStopReason(...)`
- Export the helper for direct unit testing
- Add unit tests for the tolerated variants and the rejected reasons

### Out of Scope
- Changing what any synthesis step writes as `stopReason` (the native/YAML path already writes the canonical value; this fix makes the consumer tolerant, not the producer stricter)
- The iteration-count check, the missing-synthesis check, or any other lineage validator
- Pinning the canonical stop-reason string into the lineage prompt (fragile; the model already ignored the stop-policy wording once — consumer tolerance is the robust fix)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Add `isMaxIterationsStopReason`, use it in `findMaxIterationsPolicyViolation`, export it |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modify | Add a describe block asserting tolerated variants pass and different reasons fail |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The max-iterations policy validator accepts a completed lineage whose stopReason is any formatting variant of the max-iterations family | Unit test: `maxIterationsReached`, `max-iterations (10/10)`, `maxIterations`, and `max_iterations_reached` all yield no violation (with the iteration count matching); the sibling canonical case is unchanged |
| REQ-002 | The validator still rejects stop reasons that indicate a genuinely different outcome | Unit test: `converged`, `manualStop`, `error`, `userPaused`, empty string, and non-string values all yield the violation message |

### P2 - Suggested

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The helper is a pure, exported function with no side effects | `isMaxIterationsStopReason` is added to `module.exports` and is importable via `requireCjs(fanoutRunScript)` in the vitest, matching the existing helper-import pattern |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime vitest suite (`npm --prefix .opencode/skills/deep-loop-runtime test`) is green, including the new cases
- **SC-002**: The new test is proven RED against the pre-fix strict check for the `max-iterations (10/10)` case
- **SC-003**: `node --check` passes on the modified `fanout-run.cjs`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An over-broad normalizer could accept a genuinely-wrong stop reason | Low - the iteration-count check already gates this path | Anchor the match with `startsWith('maxiteration')` after stripping non-alphabetic chars, so only the max-iterations family matches; REQ-002 pins the rejected set |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The design (consumer-side tolerance via an anchored normalized match) is settled.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Source observation**: `../../032-goal-opencode-plugin/review/review-report.md` section 2 (the fan-out process note recording the false failure)
- **Predecessor**: `../017-loop-guard-implementation/`
<!-- /ANCHOR:cross-refs -->
