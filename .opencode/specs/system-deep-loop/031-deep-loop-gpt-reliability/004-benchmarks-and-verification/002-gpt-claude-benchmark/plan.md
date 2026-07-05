---
title: "Implementation Plan: External Smoke + GPT-vs-Claude Behavioral Benchmark"
description: "Confirm the external-shell precondition FIRST, before any other work. Run the Claude/native leg early as a partial check. Design and run the full 8-cell matrix with a failure-classification schema that separates Mode-D from generic route-mismatch/latency, only after phases 008-011 land."
trigger_phrases:
  - "implementation"
  - "plan"
  - "gpt vs claude benchmark"
  - "external smoke test"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/004-benchmarks-and-verification/002-gpt-claude-benchmark"
    last_updated_at: "2026-07-01T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Benchmark complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 013"
    blockers: []
    key_files:
      - "../005-gpt-verification-smoke/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-012-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: External Smoke + GPT-vs-Claude Behavioral Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `cli-opencode`/`cli-claude-code` executor dispatch, shell environment probing |
| **Framework** | deep-loop-runtime fan-out (for actual dispatch), ad hoc harness for the 8-cell matrix |
| **Storage** | `benchmark-results.md`, possibly a structured JSON alongside it |
| **Testing** | Live dispatch runs (this phase IS the test) |

### Overview

This phase's plan is dominated by ONE precondition check that must happen before anything else: does a genuine external, `OPENCODE_PID`-free shell exist in this environment? Phase 005 already discovered this gap once and could not complete because of it. Everything else in this plan — the 8-cell matrix, the failure-classification schema, the Claude/native partial leg — is designed around that check's outcome, not in parallel with it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] External-shell precondition check completed FIRST, with an explicit PASS/FAIL/UNKNOWN result recorded before any other phase work begins.
- [x] Phases 008-011 confirmed complete (for the full 8-cell run; the Claude/native partial leg does not need to wait).
- [x] Failure-classification schema (`phase0_self_check`/Mode-D, `route_mismatch`, `missing_artifact`, `timeout_latency`) drafted and reviewed before the first live run.

### Definition of Done
- [x] External-shell precondition result is explicitly PASS or FAIL, with evidence, not silently assumed either way.
- [x] If PASS: all 8 cells produce classified results. If FAIL: phase halted and reported honestly, with the Claude/native partial leg still delivered as a standalone result.
- [x] Every failure in the results is tagged into exactly one of the 4 classification buckets — none left as generic "failed."
- [x] ai-council cell results, if collected, are explicitly marked as meaningful only because phase 008 already landed.
- [x] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Precondition-gated, two-tier benchmark: an early, unconditional Claude/native partial leg, followed by a full 8-cell matrix conditional on the external-shell precondition passing.

### Key Components

- **External-shell precondition check**: the single highest-priority gate in this whole phase; must run first and be reported honestly regardless of outcome.
- **Claude/native partial leg**: does not need the external shell (per `cli-opencode`'s self-invocation guard applying only to the GPT leg); can run as soon as phases 008-011 land, independent of the precondition's outcome.
- **8-cell matrix (4 modes x 2 models)**: the full benchmark, gated on the precondition.
- **Failure-classification schema**: a fixed 4-bucket taxonomy applied consistently across every cell.

### Data Flow

Precondition check runs first, standalone → if it fails, this phase and phase 013 halt here, reported honestly → if it passes (or regardless, for the Claude/native leg), phases 008-011's landed state is confirmed → dispatch runs per cell → each result is classified into exactly one failure bucket (or marked pass) → `benchmark-results.md` is produced.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| External shell environment | Unconfirmed | Precondition check | Explicit PASS/FAIL/UNKNOWN result |
| `cli-opencode`/`cli-claude-code` dispatch | Existing executors | Used as-is for the benchmark's dispatch mechanism | Live dispatch runs |
| `benchmark-results.md` | Does not exist yet | Create | Manual review against the 4-bucket schema |

Required inventories:
- Same-class producers: phase 005 already attempted this precondition check once and hit the same gap — its evidence is the starting point, not re-derived from scratch.
- Consumers: phase 013's FIX-5 gate evaluation is the sole consumer of this phase's results.
- Matrix axes: 4 modes x 2 models x 4 failure-classification buckets (or pass).
- Algorithm invariant: no result may be counted as "GPT unreliability" if it's actually a `phase0_self_check`/Mode-D failure already fixed in phase 008 — this is the exact conflation research found in round 1's own `gpt-fast-high` lineage.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (precondition check — do this before anything else)
- [x] Check whether a genuine external, `OPENCODE_PID`-free shell exists in this environment. Report PASS/FAIL/UNKNOWN explicitly.
- [x] If FAIL/UNKNOWN: stop here, report honestly, and do not proceed to the full 8-cell matrix. The Claude/native partial leg (Phase 2 below) may still proceed independent of this result.
- [x] If PASS: confirm phases 008-011 are complete before proceeding to the full matrix.
- [x] Draft the failure-classification schema (4 buckets) and review it for completeness against research's cited conflation risk.

### Phase 2: Core Implementation
- [x] Run the Claude/native partial leg (4 modes x 1 model) as soon as phases 008-011 land, independent of the precondition's outcome.
- [x] If the precondition passed: run the full 8-cell matrix (4 modes x 2 models) via `cli-opencode`/`cli-claude-code` dispatch.
- [x] Classify every result (pass, or one of the 4 failure buckets) as it's produced, not retroactively.

### Phase 3: Verification
- [x] Confirm no result is left unclassified or lumped into a generic "failed" bucket.
- [x] Confirm the ai-council cell (if run) is explicitly annotated as meaningful only because phase 008 landed first.
- [x] Write `benchmark-results.md` with the full classified results table.
- [x] Run `validate.sh --strict` for this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Environmental probe | External-shell precondition | Direct shell inspection (`$OPENCODE_PID` presence/absence, process tree) |
| Live dispatch | Claude/native partial leg | `cli-claude-code` executor (or native) |
| Live dispatch | Full 8-cell matrix (if precondition passes) | `cli-opencode` + `cli-claude-code` executors |
| Spec | Phase documentation and metadata integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| External-shell precondition | Environmental | Unconfirmed | Blocks the full 8-cell matrix and phase 013; does not block the Claude/native partial leg |
| Phases 008-011 | Predecessor | Not yet complete | Full benchmark would re-measure already-diagnosed, already-fixed failure modes if run early |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable in the usual sense — this phase produces a report, not a code change. If the precondition check itself turns out to be wrong (e.g., a shell thought to be external turns out to still be `OPENCODE_PID`-tainted), correct the report and re-run.
- **Procedure**: No file reversal needed; correct and re-publish `benchmark-results.md` if a methodology error is found.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 011 (enforcement plugin) -> Phase 012 (this phase) -> Phase 013 (FIX-5 checkpoint)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (precondition check) | None (can run independent of 008-011) | Core |
| Core | Setup + Phases 008-011 (for full matrix) | Verify |
| Verify | Core | Phase 013 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Medium | Small-Medium (precondition check + schema draft) |
| Core Implementation | High | Large (8 live dispatch runs, each a real research/review/context/council cycle) |
| Verification | Low-Medium | Small |
| **Total** | | **Large** (dominated by live dispatch time, not design complexity) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Precondition check result recorded BEFORE any dispatch is attempted.
- [x] Failure-classification schema reviewed before the first live run, not improvised mid-benchmark.

### Rollback Procedure
1. No code to roll back — `benchmark-results.md` can be corrected and republished if needed.
2. If the precondition check was wrong, re-run Phase 1 and re-evaluate whether the full matrix should proceed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable (report-only phase).
<!-- /ANCHOR:enhanced-rollback -->

---
