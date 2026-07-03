---
title: "Implementation Plan: Sliding-Window Convergence Mode"
description: "Plan to add ADR-001's opt-in convergenceMode: sliding-window path to convergence.cjs and coverage-graph-signals.ts."
trigger_phrases:
  - "sliding window convergence mode"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode"
    last_updated_at: "2026-07-02T15:45:24Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Plan executed in full; completion verified by the orchestrator"
    next_safe_action: "None for this child"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Sliding-Window Convergence Mode

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`coverage-graph-signals.ts`) + Node.js CommonJS (`convergence.cjs`) |
| **Framework** | deep-loop-runtime convergence scoring |
| **Testing** | vitest (`coverage-graph-signals.vitest.ts`) |

### Overview
Add an opt-in `convergenceMode: "sliding-window"` value with a validated `slidingWindowSize`, add a windowed novelty-delta function anchored to an N-iterations-back snapshot, thread the mode selection through `convergence.cjs`'s `main()`/`computeCompositeScore`, and record dual (full-history + windowed) telemetry — all while keeping `default`/`off` behavior byte-identical to today.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] ADR-001 (`decision-record.md`) read in full; Problem/Purpose grounded in its Context and Constraints sections.
- [x] Fix scoped to the opt-in mode only; `default`/`off` behavior must not change (ADR Constraints).

### Definition of Done
- [x] Windowed `computeGraphNoveltyDelta` variant added, anchored to an N-iterations-back snapshot.
- [x] `convergenceMode`/`slidingWindowSize` threaded through `convergence.cjs`'s `main()`/`computeCompositeScore`.
- [x] `slidingWindowSize` validation added (positive integer, documented default/range).
- [x] Dual telemetry (full-history + windowed `newInfoRatio`) recorded.
- [x] New denominator-drag fixture passes and the full `deep-loop-runtime` vitest suite shows 0 new failures (578/580 final vs 574/576 baseline; the 2 failures proven pre-existing by stash re-run).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Opt-in parallel-path fix: the new windowed calculation lives alongside the existing full-history calculation, selected only when `convergenceMode === "sliding-window"` is explicitly set. The `default`/`off` paths call the exact same code as today.

### Key Components
- **`computeGraphNoveltyDelta`** (existing, full-history) — `coverage-graph-signals.ts:711-726`.
- **New windowed variant** — anchors to an N-iterations-back snapshot instead of `latestPriorSnapshot` (`coverage-graph-signals.ts:275`).
- **`computeCompositeScore`** (`convergence.cjs:239-273`) — scoring function shared across loop types; must remain unchanged for `default`/`off`.
- **`main()`** (`convergence.cjs:571`) — graph/snapshot fetch (lines ~605-609) and mode dispatch.

### Data Flow
Loop config supplies `convergenceMode`/`slidingWindowSize` -> `main()` validates and selects the full-history or windowed novelty function -> `computeCompositeScore` scores using the selected signal -> telemetry records both full-history and windowed `newInfoRatio` when sliding-window mode is active.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `convergence.cjs`'s `main()`/`computeCompositeScore` and `coverage-graph-signals.ts`'s `computeGraphNoveltyDelta`/`latestPriorSnapshot` in full.
- [x] Read existing `coverage-graph-signals.vitest.ts` fixture conventions for the novelty-delta tests.

### Phase 2: Implementation
- [x] Add the windowed novelty-delta function in `coverage-graph-signals.ts`, anchored to an N-iterations-back snapshot.
- [x] Add `convergenceMode`/`slidingWindowSize` param handling and validation in `convergence.cjs`.
- [x] Thread mode selection through `main()`/`computeCompositeScore` without changing the `default`/`off` code paths.
- [x] Record full-history and windowed `newInfoRatio` in telemetry output.

### Phase 3: Verification
- [x] Add the new denominator-drag fixture (late novelty suppressed by the full-history denominator, visible under the windowed calc).
- [x] Add `slidingWindowSize` validation tests (0, negative, non-integer -> clear error).
- [x] Run the full `deep-loop-runtime` vitest suite; confirm 0 new failures. Baseline: 574/576 tests passed, 2 failed. Final: 578/580 tests passed, 2 failed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New windowed novelty-delta function + denominator-drag fixture | vitest |
| Unit | `slidingWindowSize` validation (invalid values) | vitest |
| Regression | Full existing `deep-loop-runtime` vitest suite | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | This child has no dependency on any other child in this phase (per parent `spec.md` Phase Transition Rules) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New test fails to pass, the denominator-drag fixture fails to demonstrate the fix, or the existing suite regresses.
- **Procedure**: `git checkout -- <the 3 modified files>`; per ADR-001's own rollback guidance, the decision record remains valid historical rationale even if this follow-up implementation is rolled back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1 (Setup reads) | None | Entry point |
| Phase 2 (Implementation) | Phase 1 | Anchor and fixture conventions must be read before writing code |
| Phase 3 (Verification) | Phase 2 | Fixtures test the implemented path |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Basis |
|-------|----------|-------|
| Phase 1 | Small | Three targeted reads, files already located with line references |
| Phase 2 | Medium | One new function, config validation, mode dispatch, telemetry fields |
| Phase 3 | Medium | Three fixture groups plus a full-suite regression run and mutation check |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Scenario | Detection | Action |
|----------|-----------|--------|
| Existing suite regresses | Full vitest run in Phase 3 | Revert all three files; the parallel-path design means no partial-state cleanup exists |
| Drag fixture cannot demonstrate the fix | Fixture assertions fail on the visibility side | Treat as design falsification: stop, re-read the parent ADR evidence, escalate rather than weaken the fixture |
| Validation rejects valid operator configs | Validation tests | Fix validation only; calculation path unaffected |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
coverage-graph-signals.ts (windowed novelty fn)
        ^
        |
convergence.cjs main() mode dispatch --> computeCompositeScore (selected signal)
        ^
        |
loop config (convergenceMode, slidingWindowSize) --> validation
        |
        v
telemetry (windowed + full-history ratio, in-mode only)
```

Tests depend on all of the above; nothing outside deep-loop-runtime depends on the new path until an operator opts in.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Windowed novelty function (everything else consumes it).
2. Config validation + mode dispatch (gates the new path).
3. Denominator-drag fixture (the proof; failure here falsifies the design).
4. Full-suite regression run (the REQ-001 gate).

Telemetry fields and the early-clamp fixture can land in parallel with 3.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Definition |
|-----------|------------|
| M1: Windowed path computes | New function returns windowed ratios on synthetic snapshots |
| M2: Mode reachable | Config validation + dispatch select the windowed path end to end |
| M3: Proof lands | Drag fixture demonstrates suppression under full-history AND visibility under the window |
| M4: Regression-clean | Full deep-loop-runtime suite passes with 0 new failures; mutation check recorded |
<!-- /ANCHOR:milestones -->

<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
