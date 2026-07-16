---
title: "Implementation Plan: Phase 10: Fixed-Rate Overrun Accounting"
description: "Plan for the shipped fixed-rate cadence measurement and skipped-slot persistence."
trigger_phrases:
  - "fixed-rate overrun accounting"
  - "loop cadence overrun"
  - "skipped slot count"
  - "fanout overrun skippedCount"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/010-fixed-rate-overrun-accounting"
    last_updated_at: "2026-07-01T21:38:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped fixed-rate overrun content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed overrun accounting"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:010a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5e0b"
      session_id: "scaffold-content-remediation-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: Fixed-Rate Overrun Accounting

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
| **Language/Stack** | CommonJS fanout runner plus YAML schema |
| **Framework** | Node.js fixed-rate loop cadence using monotonic `process.hrtime` |
| **Storage** | Iteration state metadata fields `skippedCount` and `slotDurationMs` |
| **Testing** | Spec acceptance requires simulated 3x overrun, fast-iteration zero skip, no backlog catch-up, and no `Date.now()` elapsed measurement; no dedicated test file is named in spec.md |

### Overview
This phase shipped fixed-rate overrun accounting in `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`. Each iteration measures elapsed slot duration with `process.hrtime`, persists `slotDurationMs`, computes `skippedCount` for missed fixed-rate slots, and deliberately counts overruns without launching catch-up backlog work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: overruns were silently dropped with no persisted `skippedCount`.
- [x] Success criteria measurable: a 3x interval overrun records `skippedCount: 2` and no catch-up iterations.
- [x] Dependencies identified: Node `process.hrtime` is available; no external dependency needed.

### Definition of Done
- [x] `fanout-run.cjs` captures run-start time with `process.hrtime`.
- [x] `slotDurationMs` is persisted for each completed iteration.
- [x] `skippedCount` is computed as missed fixed-rate slots, clamped to 0 for non-overruns.
- [x] No missed-slot catch-up or replay backlog is introduced.
- [x] `deep_research_auto.yaml` includes optional `skippedCount` and `slotDurationMs` fields.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fixed-rate cadence observability without backlog replay.

### Key Components
- **`fanout-run.cjs` cadence measurement**: Captures monotonic start/end elapsed time for each iteration slot.
- **`slotDurationMs`**: Persisted duration for the completed iteration.
- **`skippedCount`**: Persisted count of missed fixed-rate slots, not a queue of work to replay.
- **`deep_research_auto.yaml` schema fields**: Optional metadata definitions for persisted state.

### Data Flow
At the start of each iteration slot, the runner records `process.hrtime`. After the iteration completes, it computes elapsed milliseconds, records `slotDurationMs`, derives `skippedCount = max(0, floor(elapsedMs / intervalMs) - 1)`, persists those values to state metadata, and advances without launching catch-up iterations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Runs fixed-rate fanout iterations | Add monotonic slot timing and skipped-slot metadata | Spec acceptance covers overrun count and no catch-up logic |
| `.opencode/skills/deep-loop-runtime/deep_research_auto.yaml` | Runtime/schema metadata | Add optional field definitions | Schema review verifies fields |
| Convergence/lock/post-dispatch modules | Related loop surfaces | Unchanged | Spec explicitly excludes them |

Required inventories:
- Same-class producers: inspect cadence scheduling in `fanout-run.cjs` before adding metrics.
- Consumers of changed symbols: state readers tolerate optional fields; no convergence/lock changes.
- Matrix axes: fast iteration, exact interval, 2x/3x overrun, missing interval, no catch-up backlog, and monotonic vs wall-clock timing.
- Algorithm invariant: `skippedCount` is diagnostic accounting only and must not trigger concurrent or immediate backlog replay.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm implementation scope is `fanout-run.cjs` plus schema fields.
- [x] Confirm elapsed slot duration must use `process.hrtime`, not `Date.now()`.
- [x] Confirm backlog catch-up is explicitly out of scope.

### Phase 2: Core Implementation
- [x] Capture `hrStart = process.hrtime()` at iteration slot start.
- [x] Compute elapsed milliseconds from `process.hrtime(hrStart)` at iteration completion.
- [x] Compute and persist `slotDurationMs` and clamped `skippedCount`.
- [x] Update `deep_research_auto.yaml` with optional `skippedCount` and `slotDurationMs` definitions.

### Phase 3: Verification
- [x] Verify simulated 3x overrun produces `skippedCount: 2`.
- [x] Verify fast iterations produce `skippedCount: 0`.
- [x] Verify no catch-up iteration queue/backlog is introduced.
- [x] Verify changed elapsed-measurement block does not use `Date.now()`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/behavior | Simulated overrun and fast iteration persist expected `skippedCount`/`slotDurationMs` | Spec acceptance criteria; no dedicated test file named |
| Code review | No catch-up/backlog queue introduced | Review `fanout-run.cjs` |
| Static grep | Changed timing block uses `process.hrtime`, not `Date.now()` | Grep per spec SC-002 |
| Schema | Optional fields documented | Review `deep_research_auto.yaml` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node `process.hrtime` | Runtime | Available | Required for monotonic elapsed measurement |
| Single-flight semantics | Runtime invariant | Preserved | Catch-up backlog is intentionally omitted to avoid concurrent double-dispatch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Overrun accounting miscomputes skipped slots, uses wall-clock timing, or introduces catch-up dispatch.
- **Procedure**: Revert `fanout-run.cjs` elapsed/skipped metadata changes and remove schema fields from `deep_research_auto.yaml`; cadence returns to pre-phase behavior without overrun metadata.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
