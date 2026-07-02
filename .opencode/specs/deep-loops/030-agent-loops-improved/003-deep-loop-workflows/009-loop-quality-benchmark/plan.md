---
title: "Implementation Plan: Loop-Quality Benchmark from Score-Delta"
description: "Documents the completed score-delta benchmark and promotion gate work for deep-improvement candidates."
trigger_phrases:
  - "loop quality benchmark score delta"
  - "outcomeScoreDelta benchmark"
  - "fixtureDeltas helped hurt"
  - "improvement over baseline gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/003-deep-loop-workflows/009-loop-quality-benchmark"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml"
      - ".opencode/agents/skill-benchmark.md"
      - ".opencode/agents/model-benchmark.md"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Loop-Quality Benchmark from Score-Delta

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-improvement JavaScript benchmark scripts, YAML workflow, agent markdown |
| **Framework** | `deep-loop-workflows` deep-improvement benchmark and promotion gate |
| **Storage** | Benchmark JSONL records with `outcomeScoreDelta` and `fixtureDeltas[]` |
| **Testing** | Fixture before/after scoring, reducer helped/hurt aggregation, promotion rejection checks |

### Overview
This completed work changed benchmark quality from a pass/fail toggle into an improvement-over-baseline signal. Benchmark output now includes score deltas, reducer reports summarize helped and hurt fixtures, and promotion blocks regressions unless an explicit override is used.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing benchmark-pass-only gate identified as insufficient quality signal.
- [x] Score-delta scope is limited to benchmark harness and promotion gate.
- [x] Runtime convergence score-delta remains out of scope.

### Definition of Done
- [x] Benchmark emits `outcomeScoreDelta`.
- [x] Benchmark emits per-fixture `fixtureDeltas[]` with helped, hurt, and delta fields.
- [x] Reducer summarizes helped and hurt fixture counts.
- [x] Promotion gate blocks negative deltas and hurt fixtures unless explicitly overridden.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Baseline-comparison promotion: benchmark runs compare before and after fixture scores, reduce the deltas, and promote only when candidate quality does not regress.

### Key Components
- **`run-benchmark.cjs`**: Emits `outcomeScoreDelta` and per-fixture deltas.
- **`shared/reduce-state.cjs`**: Summarizes helped/hurt counts for benchmark reporting.
- **`promote-candidate.cjs`**: Blocks candidates with negative outcome deltas or hurt fixtures unless explicitly overridden.
- **Benchmark workflow and agents**: Document and surface the score-delta fields.

### Data Flow
The benchmark records before and after scores, computes `outcomeScoreDelta` and fixture-level deltas, reducer output summarizes helped and hurt fixtures, and the promotion gate reads the aggregate result before allowing candidate promotion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Benchmark runner | Executes fixture matrix | Emit score deltas | JSONL contains `outcomeScoreDelta` and `fixtureDeltas[]` |
| Reducer | Summarizes benchmark output | Count helped and hurt fixtures | Report shows helped/hurt totals |
| Promotion gate | Approves candidate shipping | Block regressions and hurt fixtures | Negative delta rejects promotion |
| Workflow/agent docs | Explain benchmark outputs | Add score-delta fields | Docs name delta fields |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and capture score-delta fields.
- [x] Identify benchmark runner, reducer, promotion gate, workflow, and agent surfaces.
- [x] Keep runtime convergence score-delta out of scope.

### Phase 2: Core Implementation
- [x] Add `outcomeScoreDelta` to benchmark output.
- [x] Add `fixtureDeltas[]` with helped, hurt, and delta fields.
- [x] Summarize helped and hurt counts in reducer output.
- [x] Gate promotion on `outcomeScoreDelta >= 0`.
- [x] Block hurt fixtures unless an explicit override is supplied.
- [x] Update benchmark workflow and agent docs with delta fields.

### Phase 3: Verification
- [x] Verify a negative outcome delta blocks promotion.
- [x] Verify hurt fixtures block promotion without override.
- [x] Verify benchmark report includes helped/hurt counts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark fixture | Before/after scoring and fixture deltas | Benchmark fixture run |
| Reducer report | Helped/hurt count aggregation | Reducer fixture |
| Promotion gate | Negative delta and hurt-fixture rejection | Promotion gate test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Baseline fixture scores | Runtime input | Required | Missing baseline blocks promotion by default |
| Runtime score-delta work | Follow-up | Out of scope | Benchmark-only delta can ship independently |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Delta computation is unstable, missing baselines incorrectly promote, or promotion rejects valid candidates.
- **Procedure**: Revert score-delta fields, reducer aggregation, and promotion-gate changes, then restore benchmark-pass-only behavior with a documented quality-risk note.
<!-- /ANCHOR:rollback -->
