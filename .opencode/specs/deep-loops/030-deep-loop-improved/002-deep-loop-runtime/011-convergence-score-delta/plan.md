---
title: "Implementation Plan: Phase 11: Convergence Score Delta"
description: "Plan for the shipped convergence scoreDelta signal and opt-in improvementEffect trace."
trigger_phrases:
  - "convergence score delta"
  - "improvement effect signal"
  - "loop score improvement"
  - "convergence prior snapshot delta"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/011-convergence-score-delta"
    last_updated_at: "2026-07-01T21:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped convergence score-delta content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed convergence delta signal"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
    session_dedup:
      fingerprint: "sha256:011a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5e0c"
      session_id: "scaffold-content-remediation-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: Convergence Score Delta

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS convergence script |
| **Framework** | Deep-loop convergence snapshot scoring |
| **Storage** | Existing convergence snapshot output; no upstream state format rewrite |
| **Testing** | Spec acceptance requires two-snapshot delta, first-iteration null guard, plateau detection, and trace gate off by default; no dedicated test file is named in spec.md |

### Overview
This phase shipped `scoreDelta` in `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`. The script reads the prior snapshot score before creating the new snapshot, emits `scoreDelta` for iterations after the first, emits `null` when no prior snapshot exists, and optionally includes an `improvementEffect` helped/hurt trace behind an opt-in gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: convergence showed novelty but not improvement across iterations.
- [x] Success criteria measurable: two snapshots with scores 0.4 and 0.6 produce `scoreDelta === 0.2`; first iteration produces `null`.
- [x] Dependencies identified: existing `createSnapshot()` returns a numeric `score` field.

### Definition of Done
- [x] `convergence.cjs` computes `scoreDelta = score - priorSnapshot.score` for post-first iterations.
- [x] First iteration is null-guarded and emits `scoreDelta: null`.
- [x] `scoreDelta` appears in convergence output and log lines.
- [x] `improvementEffect` trace is opt-in and disabled by default.
- [x] Bayesian scoring engine and upstream state storage remain unchanged.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Derived convergence telemetry computed from adjacent snapshot scores.

### Key Components
- **Prior snapshot read**: Captures `priorSnapshot.score` before the current snapshot is created.
- **`scoreDelta`**: Numeric difference between current score and prior score, or `null` when no prior snapshot exists.
- **`improvementEffect` trace gate**: Optional helped/hurt summary that only appears when explicitly enabled.

### Data Flow
`convergence.cjs` loads the prior snapshot, computes or receives the current score for the new snapshot, calculates `scoreDelta` before output, and writes/logs the convergence result. On the first iteration, the prior snapshot is absent, so output contains `scoreDelta: null` and a no-prior-snapshot note instead of throwing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Computes convergence output | Add `scoreDelta` and opt-in trace gate | Spec acceptance covers delta, null guard, and trace default |
| Snapshot schema/source | Provides current and prior scores | Read-only in this phase | Spec explicitly excludes snapshot storage changes |
| Bayesian scoring engine | Produces scores | Unchanged | Spec explicitly excludes scoring-engine changes |

Required inventories:
- Same-class producers: inspect current convergence output and snapshot creation order before adding delta.
- Consumers of changed symbols: downstream stop conditions can read `scoreDelta`; no storage rewrite required.
- Matrix axes: first iteration, positive delta, zero plateau, negative delta, trace flag off, and trace flag on.
- Algorithm invariant: absence of a prior snapshot must produce `scoreDelta: null`, never a runtime subtraction error.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm implementation scope is limited to `convergence.cjs`.
- [x] Confirm `createSnapshot()` already returns numeric `score`.
- [x] Confirm causal per-target outcome attribution is out of scope.

### Phase 2: Core Implementation
- [x] Read `priorSnapshot.score` before creating the current snapshot.
- [x] Compute `scoreDelta` for iterations with a prior snapshot.
- [x] Emit `scoreDelta: null` and no-prior messaging for the first iteration.
- [x] Include `scoreDelta` in convergence output and log line.
- [x] Add opt-in `improvementEffect` trace gate, off by default.

### Phase 3: Verification
- [x] Verify two consecutive snapshots with scores 0.4 and 0.6 output `scoreDelta === 0.2`.
- [x] Verify first iteration emits `scoreDelta: null` without throwing.
- [x] Verify plateau iterations output `scoreDelta: 0`.
- [x] Verify `improvementEffect` is absent when the trace gate is disabled.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/behavior | Two consecutive snapshots compute numeric delta | Spec acceptance criteria; no dedicated test file named |
| Null guard | No prior snapshot produces `scoreDelta: null` | Spec acceptance criteria |
| Plateau | Stable score across iterations produces `scoreDelta: 0` | Simulated convergence output |
| Trace gate | `improvementEffect` absent by default and present only when enabled | Integration/flag check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing snapshot score field | Internal | Available | Delta cannot be computed without numeric prior/current scores |
| Target-level attribution model | Future design | Deferred | Needed only for causal per-target `outcome_score_delta`, which is out of scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Delta computation throws on first iteration, reports incorrect values, or leaks opt-in trace output by default.
- **Procedure**: Revert `scoreDelta` and `improvementEffect` additions from `convergence.cjs`; convergence output returns to current-score-only behavior until the null guard and trace gate are corrected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
