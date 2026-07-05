---
title: "Implementation Plan: Phase 13: Coverage Graph Time Decay"
description: "Plan for the shipped time-decay weighting in coverage graph signal ranking."
trigger_phrases:
  - "coverage-graph time-decay"
  - "signal decay weighting"
  - "stale convergence signal"
  - "decay-days configuration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/002-deep-loop-runtime/013-coverage-graph-time-decay"
    last_updated_at: "2026-07-01T21:44:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped coverage graph time-decay content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed coverage signal decay weighting"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts"
    session_dedup:
      fingerprint: "sha256:013a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5e0e"
      session_id: "scaffold-content-remediation-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: Coverage Graph Time Decay

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
| **Language/Stack** | TypeScript coverage graph signal ranking |
| **Framework** | Deep-loop coverage graph actionability scoring |
| **Storage** | Existing coverage graph raw counts remain unchanged |
| **Testing** | Spec acceptance requires decay math at 0/30/60 days, ranking integration, default no-regression with `decayDays=0`, and raw-count preservation; no dedicated test file is named in spec.md |

### Overview
This phase shipped `timeDecayWeight(createdAt, decayDays, now)` in `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` and wired it into existing signal ranking math. The default `decayDays=0` preserves pre-patch rankings, while enabled decay reduces stale evidence actionability without deleting historical coverage counts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: stale FINDING/SOURCE nodes retained full convergence force indefinitely.
- [x] Success criteria measurable: `decayDays=30` halves a 30-day-old node and quarters a 60-day-old node.
- [x] Dependencies identified: coverage graph signal-ranking path must be readable before implementation.

### Definition of Done
- [x] `timeDecayWeight(createdAt, decayDays, now)` returns `0.5^(ageDays/decayDays)`.
- [x] `decayDays=0` returns `1.0` and preserves default ranking output.
- [x] Decay weight is applied in existing signal ranking math.
- [x] Historical/raw coverage counts are not mutated by decay.
- [x] Config validation enforces a safe minimum when decay is enabled.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Derived time-decay multiplier applied at ranking time, not a persisted-data rewrite.

### Key Components
- **`timeDecayWeight`**: Computes exponential half-life weighting from node age and configured decay days.
- **Signal ranking integration**: Multiplies actionability/ranking contribution by the decay weight.
- **No-decay default**: `decayDays=0` returns `1.0` to keep existing behavior unchanged.
- **Raw count preservation**: Historical coverage fields remain intact for audit/history.

### Data Flow
Signal ranking reads a node's `createdAt`, computes age relative to `now`, derives a decay multiplier from `decayDays`, and applies it to the node's actionability contribution. Stored raw counts and historical graph data are left unchanged so the graph keeps its full audit trail.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Computes coverage graph signal ranking | Add `timeDecayWeight` and ranking multiplier | Spec acceptance covers math and call-site integration |
| Persisted coverage graph counts | Historical evidence storage | Unchanged | Raw counts unchanged before/after decay-enabled run |

Required inventories:
- Same-class producers: inspect signal ranking call-site before adding the helper.
- Consumers of changed symbols: ranking consumers receive decayed actionability when enabled; storage consumers still see raw counts.
- Matrix axes: `decayDays=0`, 30-day age at 30-day half-life, 60-day age at 30-day half-life, same-day nodes, invalid/too-short decay config, and raw-count preservation.
- Algorithm invariant: decay can change actionability/ranking weight, but must never erase or mutate historical coverage records.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm implementation scope is only `coverage-graph-signals.ts`.
- [x] Read the existing signal-ranking path before adding decay.
- [x] Confirm no persisted state schema changes are required.

### Phase 2: Core Implementation
- [x] Add `timeDecayWeight(createdAt, decayDays, now)` with exponential half-life math.
- [x] Return `1.0` when `decayDays=0` to preserve default behavior.
- [x] Wire the decay multiplier into signal ranking math.
- [x] Keep raw coverage count fields unchanged.
- [x] Enforce a minimum decay window when decay is enabled.

### Phase 3: Verification
- [x] Verify `decayDays=0` returns `1.0` and default ranking output is unchanged.
- [x] Verify `decayDays=30`, age 30 days returns `0.5`.
- [x] Verify `decayDays=30`, age 60 days returns `0.25`.
- [x] Verify ranking call-site references `timeDecayWeight` and raw counts remain untouched.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/math | `timeDecayWeight` for no-decay, 30-day, and 60-day cases | Spec acceptance criteria; no dedicated test file named |
| Regression | `decayDays=0` produces identical rankings to pre-patch behavior | Ranking output comparison |
| Integration/code review | Ranking call-site uses `timeDecayWeight` | Review `coverage-graph-signals.ts` |
| Persistence | Raw coverage counts unchanged before/after decay-enabled run | State comparison |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing coverage graph signal ranking path | Internal | Available | Decay must be wired into ranking, not left as unused helper |
| Config validation for decay window | Internal | Complete | Prevents overly short decay windows from suppressing convergence evidence too quickly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Default rankings change when `decayDays=0`, raw counts mutate, or enabled decay suppresses actionability incorrectly.
- **Procedure**: Remove the decay multiplier from `coverage-graph-signals.ts` and revert to raw actionability ranking; keep historical coverage data unchanged.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
