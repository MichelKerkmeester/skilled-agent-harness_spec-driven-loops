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
    packet_pointer: "deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode"
    last_updated_at: "2026-07-01T21:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from ADR-001 (decision-record.md) sliding-window convergence design"
    next_safe_action: "Author plan.md and tasks.md, then implement per ADR-001's follow-up build target"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-signals.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Sliding-Window Convergence Mode

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Not Started |
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
`ADR-001: Sliding-Window Convergence Mode For Long Loops` (`.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/009-convergence-design-and-hardening/decision-record.md`) proved via generation-2 forced-depth research — two real 35-iteration lineages run under `stopPolicy=max-iterations` — that the current full-history convergence-novelty calculation suffers "denominator drag" on 30+ iteration loops. `computeGraphNoveltyDelta` in `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` (lines 711-726) computes `denominator = eligibleNodes.length + eligibleEdges.length` over ALL nodes/edges ever accumulated in the namespace (no windowing), anchored to only the single `latestPriorSnapshot` (line 716, via `priorSnapshot` at line 716). Because this denominator grows monotonically across a long loop, a genuinely novel late-iteration finding gets divided by an ever-larger base, making fixed convergence thresholds harder to exceed even when real novelty remains. The ADR's own evidence: convergence telemetry averaged ~0.75 early and ~0.6 late; a convergence-mode loop would have legally stopped around iteration 22-25, while forced depth surfaced 13 net-new findings that would have been missed.

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
## 7. OPEN QUESTIONS

- None. Scope bounded by ADR-001's own follow-up build target (`decision-record.md` Implementation section), independently re-verified against current code before this phase was scaffolded.
<!-- /ANCHOR:questions -->
