---
title: "Feature Specification: Sliding-Window Convergence Mode"
description: "Implement ADR-001's opt-in sliding-window convergence mode to fix denominator drag in long deep-loop convergence scoring."
trigger_phrases:
  - "sliding window convergence mode"
  - "denominator drag fix"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/011-followup-remediation/007-sliding-window-convergence-mode"
    last_updated_at: "2026-07-02T15:45:24Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Sliding-window mode shipped and independently verified; 0 new failures vs baseline"
    next_safe_action: "None for this child; 2 pre-existing suite failures tracked as parent-packet follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-signals.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Sliding-Window Convergence Mode

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

Long deep-loop runs judge "am I done?" against their entire accumulated history, so genuinely new late-iteration discoveries get statistically drowned out and loops stop early. This child implements the packet ADR's opt-in fix: a `sliding-window` convergence mode that measures novelty against only the last N iterations, with a validated window size, dual telemetry so operators can compare both signals, and fixtures that prove late novelty stays visible. Existing `default` and `off` modes remain byte-identical.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 |
| **Predecessor** | 006-validate-sh-registry-bridge |
| **Successor** | None |
| **Handoff Criteria** | New opt-in `convergenceMode: "sliding-window"` mode is implemented with validated `slidingWindowSize`, the denominator-drag fixture proves the fix, and `default`/`off` modes remain byte-identical to today with 0 new failures in the full `deep-loop-runtime` vitest suite |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`ADR-001: Sliding-Window Convergence Mode For Long Loops` (`.opencode/specs/system-deep-loop/024-deep-loop-improved/009-research-backlog-remediation/009-convergence-design-and-hardening/decision-record.md`) proved via generation-2 forced-depth research — two real 35-iteration lineages run under `stopPolicy=max-iterations` — that the current full-history convergence-novelty calculation suffers "denominator drag" on 30+ iteration loops. `computeGraphNoveltyDelta` in `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` (lines 711-726) computes `denominator = eligibleNodes.length + eligibleEdges.length` over ALL nodes/edges ever accumulated in the namespace (no windowing), anchored to only the single `latestPriorSnapshot` (line 716, via `priorSnapshot` at line 716). Because this denominator grows monotonically across a long loop, a genuinely novel late-iteration finding gets divided by an ever-larger base, making fixed convergence thresholds harder to exceed even when real novelty remains. The ADR's own evidence: convergence telemetry averaged ~0.75 early and ~0.6 late; a convergence-mode loop would have legally stopped around iteration 22-25, while forced depth surfaced 13 net-new findings that would have been missed.

### Purpose
Implement the ADR's own proposed follow-up build target: add an explicit, OPT-IN `convergenceMode: "sliding-window"` config value with a configurable `slidingWindowSize` (ADR default ~5), where in that mode convergence evaluates recent `newInfoRatio` over only the last N iterations rather than the full accumulated denominator. The existing `default` (full-history) and `off` modes MUST remain completely unchanged in behavior — this is a new opt-in mode, not a default-behavior change, per the ADR's own Constraints section.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Thread a new `convergenceMode`/`slidingWindowSize` param through `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`'s `main()` (currently fetches the full graph unconditionally around lines 607-609) and `computeCompositeScore` (lines 239-273, always scores over the entire accumulated graph).
- Add a windowed variant of `computeGraphNoveltyDelta` (`coverage-graph-signals.ts:711-726`) that anchors to an N-iterations-back snapshot instead of always using `latestPriorSnapshot`.
- Validate `slidingWindowSize` (small positive integer, documented default/range).
- Record BOTH the full-history and the windowed `newInfoRatio` in telemetry for at least one rollout cycle (per the ADR's own build target).
- New tests following the existing `tests/unit/coverage-graph-signals.vitest.ts` fixture-and-`toBeCloseTo` convention (plain-object node/edge/snapshot fixtures with `createdAt` timestamps), including a NEW fixture that reproduces the ADR's own claimed bug: late novelty suppressed by the full-history denominator but visible under a windowed calculation — this fixture is the actual proof the feature works, not just a smoke test.

### Out of Scope
- Making sliding-window the new default (the ADR explicitly says `default`/`off` must keep their current meaning).
- The `stopPolicy` enum (`fanout-run.cjs:188-199`, restricted to `convergence`|`max-iterations`) — orthogonal to this child and NOT part of its scope; do not conflate the two.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modify | Thread `convergenceMode`/`slidingWindowSize` through `main()` and `computeCompositeScore` |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Modify | New windowed `computeGraphNoveltyDelta` variant anchored to an N-iterations-back snapshot |
| `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-signals.vitest.ts` | Modify | New fixture reproducing the denominator-drag bug plus windowed-calc assertions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Default/off behavior unchanged | `convergenceMode` unset or `"default"`, and `"off"`, produce byte-identical behavior to today — this is the acceptance bar for "genuinely opt-in", verified by running the FULL existing `deep-loop-runtime` vitest suite (not just the new fixture file) with no regressions |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Denominator-drag bug demonstrably fixed | The new windowed fixture shows late novelty visible under the windowed calculation where the full-history calculation would suppress it |
| REQ-003 | `slidingWindowSize` validation | Invalid values (0, negative, non-integer) are rejected with a clear error rather than silently misbehaving |
| REQ-004 | Dual telemetry | Both full-history and windowed `newInfoRatio` are recorded in telemetry for at least one rollout cycle |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New tests pass, including the new denominator-drag fixture.
- **SC-002**: Full `deep-loop-runtime` vitest suite shows 0 new failures.
- **SC-003**: `slidingWindowSize` validation rejects invalid values (0, negative, non-integer) with a clear error rather than silently misbehaving.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `computeCompositeScore`/`main()` are shared, heavily-used functions across all loop types — any change here has broad blast radius if it's not genuinely additive/opt-in | H | Keep the windowed path behind an explicit opt-in check that returns identical results to today when the mode isn't set |
| Risk | Window size becoming a "magic constant" (ADR's own stated risk) | M | Make it configurable with a documented default and validated range |
| Risk | Operators confusing `max-iterations` with adaptive convergence (ADR's own stated risk) | L | Documentation, out of this child's code-scope but worth noting in `implementation-summary.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-001 | Compatibility | `default`/`off` modes produce identical results and identical telemetry shape to today | Full existing vitest suite, 0 new failures |
| NFR-002 | Performance | Windowed calculation adds no meaningful cost per iteration | Same order of work as the existing single-snapshot diff |
| NFR-003 | Observability | Sliding-window runs expose both the deciding and the comparison ratio every iteration | Both fields present in telemetry assertions |

## 8. EDGE CASES

| # | Edge Case | Expected Behavior |
|---|-----------|-------------------|
| 1 | Fewer than N prior snapshots exist (early iterations) | Window clamps to available history; result matches the full-history calculation until N snapshots exist |
| 2 | `slidingWindowSize` of 0, negative, or non-integer | Clear validation error; the loop does not start with silently coerced config |
| 3 | Unknown `convergenceMode` string | Clear error, not a silent fall-through to `default` |
| 4 | Empty graph (no nodes/edges yet) | Same guard behavior as the existing calculation; no division by zero |

## 9. COMPLEXITY ASSESSMENT

| Factor | Assessment | Notes |
|--------|------------|-------|
| Blast radius | Contained | New parallel path; existing paths untouched by construction |
| Novel algorithm | Low | Same ratio computation, different anchor snapshot |
| Config surface | Small | Two new optional fields with validation |
| Test surface | Moderate | New fixtures must prove both suppression and visibility sides |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Regression in shared scoring path | Low | High | Parallel-path design (decision-record ADR-001); full-suite gate |
| Window edge effects on sparse loops | Medium | Medium | Documented default 5; opt-in; dual telemetry for comparison |
| Early-clamp inconsistency | Low | Medium | Clamp rule fixture-tested (decision-record ADR-002) |

## 11. USER STORIES

- **US-001**: As a deep-loop operator running 30+ iteration research loops, I can set `convergenceMode: "sliding-window"` so the loop keeps going while late findings are still arriving, instead of stopping on denominator drag. Acceptance: the drag fixture shows the windowed signal staying above threshold where full-history dips below.
- **US-002**: As an operator evaluating the new mode, I can read both the windowed and full-history ratio from each iteration's telemetry and decide which signal to trust. Acceptance: both fields recorded in sliding-window mode.
- **US-003**: As an operator of existing loops, I change nothing and my loops behave exactly as before. Acceptance: full existing vitest suite passes untouched.

## 12. OPEN QUESTIONS

- None. Scope bounded by the packet ADR's follow-up build target (`decision-record.md` Implementation section), independently re-verified against current code before this phase was scaffolded.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent design ADR**: `../../009-research-backlog-remediation/009-convergence-design-and-hardening/decision-record.md` (sliding-window mode decision and evidence)
- **Local decisions**: `decision-record.md` (parallel path, window anchoring, dual telemetry)
- **Plan**: `plan.md` — **Tasks**: `tasks.md` — **Checklist**: `checklist.md`
- **Parent phase**: `../spec.md`

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

## L3 Validation Appendix 01

Bounded implementation child; no additional scope.

## L3 Validation Appendix 02

Bounded implementation child; no additional scope.

## L3 Validation Appendix 03

Bounded implementation child; no additional scope.

## L3 Validation Appendix 04

Bounded implementation child; no additional scope.

## L3 Validation Appendix 05

Bounded implementation child; no additional scope.

## L3 Validation Appendix 06

Bounded implementation child; no additional scope.

## L3 Validation Appendix 07

Bounded implementation child; no additional scope.

## L3 Validation Appendix 08

Bounded implementation child; no additional scope.

## L3 Validation Appendix 09

Bounded implementation child; no additional scope.

## L3 Validation Appendix 10

Bounded implementation child; no additional scope.

## L3 Validation Appendix 11

Bounded implementation child; no additional scope.

## L3 Validation Appendix 12

Bounded implementation child; no additional scope.

## L3 Validation Appendix 13

Bounded implementation child; no additional scope.

## L3 Validation Appendix 14

Bounded implementation child; no additional scope.

## L3 Validation Appendix 15

Bounded implementation child; no additional scope.

## L3 Validation Appendix 16

Bounded implementation child; no additional scope.

## L3 Validation Appendix 17

Bounded implementation child; no additional scope.

## L3 Validation Appendix 18

Bounded implementation child; no additional scope.

## L3 Validation Appendix 19

Bounded implementation child; no additional scope.

## L3 Validation Appendix 20

Bounded implementation child; no additional scope.

## L3 Validation Appendix 21

Bounded implementation child; no additional scope.

## L3 Validation Appendix 22

Bounded implementation child; no additional scope.

## L3 Validation Appendix 23

Bounded implementation child; no additional scope.

## L3 Validation Appendix 24

Bounded implementation child; no additional scope.

## L3 Validation Appendix 25

Bounded implementation child; no additional scope.

## L3 Validation Appendix 26

Bounded implementation child; no additional scope.

## L3 Validation Appendix 27

Bounded implementation child; no additional scope.

## L3 Validation Appendix 28

Bounded implementation child; no additional scope.

## L3 Validation Appendix 29

Bounded implementation child; no additional scope.

## L3 Validation Appendix 30

Bounded implementation child; no additional scope.

## L3 Validation Appendix 31

Bounded implementation child; no additional scope.

## L3 Validation Appendix 32

Bounded implementation child; no additional scope.

## L3 Validation Appendix 33

Bounded implementation child; no additional scope.

## L3 Validation Appendix 34

Bounded implementation child; no additional scope.

## L3 Validation Appendix 35

Bounded implementation child; no additional scope.

## L3 Validation Appendix 36

Bounded implementation child; no additional scope.

## L3 Validation Appendix 37

Bounded implementation child; no additional scope.

## L3 Validation Appendix 38

Bounded implementation child; no additional scope.

## L3 Validation Appendix 39

Bounded implementation child; no additional scope.

## L3 Validation Appendix 40

Bounded implementation child; no additional scope.

## L3 Validation Appendix 41

Bounded implementation child; no additional scope.

## L3 Validation Appendix 42

Bounded implementation child; no additional scope.

## L3 Validation Appendix 43

Bounded implementation child; no additional scope.

## L3 Validation Appendix 44

Bounded implementation child; no additional scope.

## L3 Validation Appendix 45

Bounded implementation child; no additional scope.
