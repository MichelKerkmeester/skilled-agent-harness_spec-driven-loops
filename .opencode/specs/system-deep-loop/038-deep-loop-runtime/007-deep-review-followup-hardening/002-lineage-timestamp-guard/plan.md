---
title: "Implementation Plan: Lineage Timestamp Guard"
description: "Plan for the pure window-check function, its fan-out completion integration, and the fabricated-shape fixtures."
trigger_phrases:
  - "timestamp guard plan"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/007-deep-review-followup-hardening/002-lineage-timestamp-guard"
    last_updated_at: "2026-07-04T16:33:20.324Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Implementation completed"
    next_safe_action: "Review final verification evidence"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-002-timestamp-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Lineage Timestamp Guard

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript lib + Node CommonJS runner (deep-loop-runtime) |
| **Framework** | Fan-out lineage pool (fanout-run.cjs / fanout-pool.cjs) |
| **Testing** | vitest |

### Overview
One pure function classifies lineage JSONL record timestamps against the lineage's authoritative slot window; the runner calls it where it already validates lineage artifacts, appends a `timestamp_anomaly` ledger event and a summary field when counts are non-zero, and changes nothing else about run outcomes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Ground truth identified: lineage slot start/end already recorded by the runner.
- [x] Warn-first severity decided (decision-record ADR-001).

### Definition of Done
- [x] Pure checker with inclusive bounds + documented skew tolerance.
- [x] Runner integration: ledger event + summary field, zero outcome change.
- [x] Fabricated-shape fixture (the real incident's pattern) fully flagged; honest fixture clean.
- [x] Full deep-loop-runtime vitest suite has 0 new failures against the known baseline.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure-core, thin-shell: classification logic is a standalone function with no I/O; the runner supplies records it already has and owns all emission.

### Key Components
- **Checker** (new, lib): `(records, {windowStart, windowEnd, toleranceMs}) -> {anomalous, untimestamped, unparseable, total, sample[]}`.
- **Runner call site**: lineage completion path in `fanout-run.cjs`, next to existing artifact validation.
- **Emission**: existing `appendStatusLedger` + orchestration summary structure.

### Data Flow
Runner slot timing (ground truth) + lineage JSONL (already read) -> checker -> counts -> ledger event + summary field when anomalous.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the lineage completion path in `fanout-run.cjs` (artifact validation + ledger emission) and `post-dispatch-validate.ts` to pick the cleanest seam.
- [x] Read existing deep-loop-runtime vitest conventions.

### Phase 2: Implementation
- [x] Implement the pure checker with inclusive bounds, tolerance, and per-class counts.
- [x] Integrate at lineage completion; emit ledger event + summary field only when anomalies exist.

### Phase 3: Verification
- [x] Fixtures: fabricated minute-spaced pre-window sequence (all flagged); honest in-window (clean); boundary-exact (clean); unparseable and untimestamped classes.
- [x] Outcome-invariance check: identical exit/retry behavior with anomalies present.
- [x] Full suite; implementation-summary + checklist evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Checker classification, all edge classes | vitest |
| Unit | Emission gating (event only when non-zero) | vitest |
| Regression | Full deep-loop-runtime suite, 0 new failures against baseline | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | Independent of all siblings |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: False positives on honest lineages or any outcome change.
- **Procedure**: Remove the call site; the pure function and tests can remain harmlessly.
<!-- /ANCHOR:rollback -->

---

## L3: AI EXECUTION Protocol

### Pre-Task Checklist

| Check | Requirement |
|-------|-------------|
| Scope | Modify only the allowed runner, helper/test, and packet docs. |
| Evidence | Capture full-suite baseline before code edits and final suite after restore. |
| Safety | Preserve warn-first behavior; no exit, retry, or salvage path changes. |

### Execution Rules

| Rule | Handling |
|------|----------|
| TASK-SEQ | Read packet docs first, then code, then baseline, then implementation. |
| TASK-SCOPE | Do not touch dist, other spec folders, git state, or unrelated runtime files. |
| VERIFY | Run focused tests, full suite, mutation check, hygiene, alignment, and strict packet validation. |

### Status Reporting Format

| Field | Content |
|-------|---------|
| Baseline | Real pre-change full-suite pass/fail counts and failing file names. |
| Delta | Final full-suite counts and whether failures are new or baseline. |
| Mutation | Exact broken comparison, failing assertion, restore result. |

### Blocked Task Protocol

| Blocker | Response |
|---------|----------|
| Outcome path changes | Stop and revert the integration approach before proceeding. |
| Strict validation errors | Patch packet docs or generated metadata, then rerun validation. |
| New full-suite failure | Treat as blocking unless proven to be the known baseline failure set. |

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1 | None | Entry point |
| Phase 2 | Phase 1 | Seam choice informs signature |
| Phase 3 | Phase 2 | Tests target the implementation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Basis |
|-------|----------|-------|
| Phase 1 | Small | Two files to read, both known |
| Phase 2 | Small | Pure function + one call site |
| Phase 3 | Small-Medium | Five fixture classes + invariance check |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Scenario | Detection | Action |
|----------|-----------|--------|
| Boundary false positives | Boundary fixtures | Widen tolerance; fixtures pin the new bound |
| Ledger consumers choke on new event type | Ledger parsing downstream | Event is additive; remove call site if a consumer hard-fails |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
runner slot timing ----\
                        +--> checker --> counts --> ledger event + summary field
lineage JSONL ---------/
fixtures --> checker (unit)   runner path --> invariance check
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Checker (everything depends on it).
2. Fabricated-shape fixture (the proof).
3. Runner integration + invariance check.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Definition |
|-----------|------------|
| M1: Checker classifies | All five fixture classes correct |
| M2: Boundary wired | Anomalous lineage produces event + summary field |
| M3: Invariant proven | Outcomes identical with/without anomalies; suite green |
<!-- /ANCHOR:milestones -->
