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
    last_updated_at: "2026-07-01T21:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan"
    next_safe_action: "Author tasks.md, then begin Phase 1 setup reads"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Sliding-Window Convergence Mode

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

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
- [ ] Windowed `computeGraphNoveltyDelta` variant added, anchored to an N-iterations-back snapshot.
- [ ] `convergenceMode`/`slidingWindowSize` threaded through `convergence.cjs`'s `main()`/`computeCompositeScore`.
- [ ] `slidingWindowSize` validation added (positive integer, documented default/range).
- [ ] Dual telemetry (full-history + windowed `newInfoRatio`) recorded.
- [ ] New denominator-drag fixture passes; full `deep-loop-runtime` vitest suite shows 0 new failures.
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
- [ ] Read `convergence.cjs`'s `main()`/`computeCompositeScore` and `coverage-graph-signals.ts`'s `computeGraphNoveltyDelta`/`latestPriorSnapshot` in full.
- [ ] Read existing `coverage-graph-signals.vitest.ts` fixture conventions for the novelty-delta tests.

### Phase 2: Implementation
- [ ] Add the windowed novelty-delta function in `coverage-graph-signals.ts`, anchored to an N-iterations-back snapshot.
- [ ] Add `convergenceMode`/`slidingWindowSize` param handling and validation in `convergence.cjs`.
- [ ] Thread mode selection through `main()`/`computeCompositeScore` without changing the `default`/`off` code paths.
- [ ] Record full-history and windowed `newInfoRatio` in telemetry output.

### Phase 3: Verification
- [ ] Add the new denominator-drag fixture (late novelty suppressed by the full-history denominator, visible under the windowed calc).
- [ ] Add `slidingWindowSize` validation tests (0, negative, non-integer -> clear error).
- [ ] Run the full `deep-loop-runtime` vitest suite; confirm 0 new failures.
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
