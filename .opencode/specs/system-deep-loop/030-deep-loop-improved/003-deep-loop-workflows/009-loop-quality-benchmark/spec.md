---
title: "Loop-Quality Benchmark from Score-Delta"
description: "The deep-improvement benchmark gates on benchmark-pass only; there is no before/after outcomeScoreDelta fixture matrix. Adding score-delta-based promotion gates makes the benchmark an actual quality signal — improvement-over-baseline — rather than a pass/fail toggle."
trigger_phrases:
  - "loop quality benchmark score delta"
  - "outcomeScoreDelta benchmark"
  - "fixtureDeltas helped hurt"
  - "improvement over baseline gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/009-loop-quality-benchmark"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iter 39)"
    next_safe_action: "Add outcomeScoreDelta + fixtureDeltas to run-benchmark.cjs and wire promotion gate"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Loop-Quality Benchmark from Score-Delta

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 11 active phases |
| **Predecessor** | 008-code-graph-coverage-bridge |
| **Successor** | 010-deep-improvement-accepted-vs-shipped |
| **Handoff Criteria** | `outcomeScoreDelta` and `fixtureDeltas[]` emitted per benchmark run; reducer summarizes helped/hurt counts; promotion gate checks `outcomeScoreDelta >= 0` before approving |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the deep-loop-workflows recommendations.

**Scope Boundary**: Score-delta in the benchmark harness only. Causal score-delta in `convergence.cjs` is a runtime concern (a separate §5.1 item). Runtime-change profiling is the deep-rewrite variant, out of scope.

**Dependencies**:
- No hard predecessors for this leaf; can run independently

**Deliverables**:
- `run-benchmark.cjs`: emits `outcomeScoreDelta` (after − before) and `fixtureDeltas[]` per fixture run
- `shared/reduce-state.cjs` (deep-improvement): reducer summarizes helped/hurt counts from `fixtureDeltas[]`
- `promote-candidate.cjs`: promotion gate checks `outcomeScoreDelta >= 0`; hurt fixtures block promotion unless explicitly overridden
- `deep_model-benchmark_auto.yaml`, `skill-benchmark.md`, `model-benchmark.md` updated with score-delta fields

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-improvement benchmark currently gates on benchmark-pass (did the run succeed?) rather than improvement-over-baseline (is the candidate better than what was there before?). There is no `outcomeScoreDelta` field, no `fixtureDeltas[]` helped/hurt breakdown, and promotion is not contingent on actual quality improvement. A candidate can pass the benchmark while regressing quality on existing fixtures.

### Purpose
Add `outcomeScoreDelta` (after − before score) and `fixtureDeltas[]` (per-fixture helped/hurt breakdown) to the benchmark harness; the reducer summarizes outcome delta; the promotion gate requires `outcomeScoreDelta >= 0` (no regression) and blocks on hurt fixtures unless explicitly overridden.

> **Reference evidence**: `external/kasper/src/types.ts:229,237` (outcome score delta type); `external/kasper/src/evaluate.ts:33,49,53` (before/after fixture scoring); `external/kasper/src/handlers.ts:283-292` (delta-based promotion gate). Research.md §5.2 + (iter 39).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `run-benchmark.cjs`: emits `outcomeScoreDelta` (after score − before score) and `fixtureDeltas[]{helped, hurt, delta}` per fixture matrix run
- `shared/reduce-state.cjs` (deep-improvement variant): reducer summarizes helped/hurt counts from `fixtureDeltas[]`
- `promote-candidate.cjs`: promotion gate checks `outcomeScoreDelta >= 0`; hurt fixtures block promotion (configurable override)
- `deep_model-benchmark_auto.yaml`, `skill-benchmark.md`, `model-benchmark.md`: updated with score-delta output fields

### Out of Scope
- Causal score-delta in `convergence.cjs` (runtime concern; §5.1 item)
- Full runtime-change profiling (rated as deep-rewrite variant; separate follow-up)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Modify | Emit `outcomeScoreDelta` and `fixtureDeltas[]` per fixture run |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs` | Modify | Summarize helped/hurt counts from `fixtureDeltas[]`; include in benchmark report |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs` | Modify | Add `outcomeScoreDelta >= 0` gate; hurt-fixture block with explicit override path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Benchmark emits `outcomeScoreDelta` and `fixtureDeltas[]{helped, hurt, delta}` per fixture run; reducer summarizes helped/hurt counts | Benchmark JSONL output contains `outcomeScoreDelta` and `fixtureDeltas[]`; benchmark report shows helped/hurt summary |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Promotion gate blocks when `outcomeScoreDelta < 0` (regression); hurt fixtures block promotion unless explicitly overridden with a flag; missing baseline produces an undefined delta and blocks promotion (safe default) | A benchmark run where `outcomeScoreDelta < 0` does not promote the candidate; `--allow-hurt-fixtures` flag required to override hurt-fixture block |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A benchmark run where the after-score is lower than the before-score produces a negative `outcomeScoreDelta`; promotion is blocked; the reason `regression: outcomeScoreDelta < 0` appears in the promotion rejection record
- **SC-002**: `fixtureDeltas[]` contains `helped`, `hurt`, and `delta` per fixture; the benchmark report summary shows total helped/hurt counts
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missing baseline fixture makes delta undefined; promotion must block (safe default) | High | Treat undefined delta as a hard block; require explicit `--no-baseline-ok` flag to override |
| Risk | `outcomeScoreDelta` can be noisy across runs if scoring is non-deterministic | Med | Use averaged scores over N fixture runs; document the averaging strategy in the benchmark config |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the minimum `outcomeScoreDelta` threshold for promotion — exactly 0 (no regression), or a small positive epsilon to require genuine improvement?
- Should hurt fixtures be overridable per-fixture (granular) or only globally via a single override flag?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


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
