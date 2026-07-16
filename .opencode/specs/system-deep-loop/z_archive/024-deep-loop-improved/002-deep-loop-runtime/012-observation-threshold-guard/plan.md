---
title: "Implementation Plan: Phase 12: Observation Threshold Guard"
description: "Plan for the shipped min_observations convergence guard that records weak evidence without acting on it prematurely."
trigger_phrases:
  - "observation threshold guard"
  - "convergence min observations"
  - "single-observation premature stop"
  - "convergence actionability boundary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/012-observation-threshold-guard"
    last_updated_at: "2026-07-01T21:42:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped observation-threshold guard content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed convergence actionability guard"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/coverage-graph-signals.ts"
    session_dedup:
      fingerprint: "sha256:012a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5e0d"
      session_id: "scaffold-content-remediation-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: Observation Threshold Guard

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
| **Language/Stack** | CommonJS convergence script plus TypeScript graph-signal reader |
| **Framework** | Deep-loop convergence actionability gating |
| **Storage** | Convergence state records with `subThreshold: true` for weak evidence |
| **Testing** | Spec acceptance requires blocked STOP at N-1 observations, STOP at N observations, default/backward-compatible thresholds, and sub-threshold state persistence; no dedicated test file is named in spec.md |

### Overview
This phase shipped a configurable `min_observations` guard in `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`. STOP decisions and promotion triggers are blocked until a finding has enough confirming observations, while below-threshold findings remain visible in state with `subThreshold: true`; `coverage-graph-signals.ts` surfaces the threshold in graph signal output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: single-observation findings could prematurely trigger STOP or promotion.
- [x] Success criteria measurable: config `min_observations: 3` blocks at two observations and allows at the third.
- [x] Dependencies identified: existing deep-loop config schema provides the config read path; phase 011 is logically prior but independent.

### Definition of Done
- [x] `convergence.cjs` reads `min_observations` with default 2 and clamps range 1-10.
- [x] STOP and promotion triggers are blocked below the threshold.
- [x] Sub-threshold findings are recorded with `subThreshold: true` instead of being discarded.
- [x] `coverage-graph-signals.ts` surfaces `min_observations` in signal output.
- [x] `min_observations: 1` restores the previous single-observation behavior.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Actionability threshold guard around convergence decisions with non-destructive weak-evidence recording.

### Key Components
- **`min_observations` config**: Integer threshold, default 2, clamped 1-10.
- **STOP/promotion gate**: Blocks actions until the leading finding reaches the threshold.
- **`subThreshold` marker**: Persists weak evidence below threshold so operators can see it without acting on it.
- **Coverage graph signal read path**: Surfaces threshold settings alongside graph signal output.

### Data Flow
Convergence loads the configured `min_observations` value, counts confirming observations for the leading finding, and checks the count before emitting STOP or promotion actions. If the count is below threshold, the finding is written to convergence state with `subThreshold: true`; when the count reaches the threshold, the normal action path can proceed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Emits STOP/promotion convergence actions | Add `min_observations` guard and sub-threshold persistence | Spec acceptance covers blocked/allowed STOP and state marker |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/coverage-graph-signals.ts` | Reads/surfaces graph signal config | Add threshold field to signal read path | Signal output includes `min_observations` |
| Bayesian scoring, lock, fanout modules | Related runtime systems | Unchanged | Spec explicitly excludes them |

Required inventories:
- Same-class producers: inspect STOP and promotion trigger paths before adding the guard.
- Consumers of changed symbols: graph signal readers surface the threshold; downstream action logic observes blocked actions.
- Matrix axes: threshold 1, default 2, threshold 3 with 2 observations, threshold reached, short run warning, and sub-threshold persistence.
- Algorithm invariant: findings below threshold are visible but cannot trigger STOP or promotion unless `min_observations` is configured to 1.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm implementation scope is `convergence.cjs` plus `coverage-graph-signals.ts`.
- [x] Confirm per-finding full lifecycle tracking and cross-mode parity are out of scope.
- [x] Define `min_observations` default 2 and clamp range 1-10.

### Phase 2: Core Implementation
- [x] Add config read/clamping for `min_observations` in `convergence.cjs`.
- [x] Block STOP decisions when confirming observations are below threshold.
- [x] Block promotion triggers when confirming observations are below threshold.
- [x] Record blocked findings with `subThreshold: true` in convergence state.
- [x] Surface `min_observations` in `coverage-graph-signals.ts` signal output.

### Phase 3: Verification
- [x] Verify threshold 3 blocks STOP at two observations and allows at the third.
- [x] Verify default threshold 2 blocks single-observation STOP but allows a second confirmation.
- [x] Verify threshold 1 restores prior single-observation STOP behavior.
- [x] Verify blocked findings remain in state with `subThreshold: true`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/behavior | `min_observations: 3` blocks STOP at 2 observations and emits at 3 | Spec acceptance criteria; no dedicated test file named |
| Compatibility | `min_observations: 1` restores previous single-observation STOP | Unit/config test |
| State readback | Below-threshold finding remains in state with `subThreshold: true` | Convergence state file review |
| Signal output | `coverage-graph-signals.ts` surfaces threshold | Graph signal output review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing deep-loop config schema | Internal | Available | `convergence.cjs` needs a place to read `min_observations` |
| Phase 011 score-delta output | Logical predecessor | Complete | Shares convergence output path but not a hard code dependency |
| Persistent finding identity store | Future design | Deferred | Needed for full backlog lifecycle tracking beyond this quick-win guard |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Guard blocks legitimate convergence, drops weak findings, or fails to preserve backward-compatible threshold 1 behavior.
- **Procedure**: Revert `min_observations` guard logic in `convergence.cjs` and the graph-signal field; convergence returns to previous single-observation actionability while the threshold behavior is corrected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
