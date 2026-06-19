---
title: "Implementation Plan: Eval Benchmark Fidelity Remediation"
description: "Fix approach for the flag-eval driver routing and trigger-ablation no-op, then re-run criterion-4."
trigger_phrases:
  - "028 eval benchmark fidelity plan"
  - "flag eval driver fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation/001-eval-benchmark-fidelity"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING eval-benchmark-fidelity plan"
    next_safe_action: "Reproduce the prior benchmark before changing the driver"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-plan-006-001-eval-benchmark-fidelity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Eval Benchmark Fidelity Remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js eval harness (`.mjs`), TypeScript search lib |
| **Framework** | Spec Kit Memory retrieval eval |
| **Storage** | Vector shard backups, ground-truth golden set |
| **Testing** | Benchmark re-run, recall computation, strict spec validation |

### Overview
This phase corrects two measurement defects in the per-flag benchmark driver, then re-runs criterion-4. The driver must route through the production default path and must genuinely disable the trigger lane during ablation. The runtime routing code is not changed; only the eval driver and the resulting benchmark doc change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The prior criterion-4 run is reproduced as a baseline for comparison.
- [ ] The default routing contract (`routeQuery()` vs `forceAllChannels`) is confirmed in `hybrid-search.ts:1394-1396`.
- [ ] The trigger call site at `hybrid-search.ts:1504` is confirmed to lack an `activeChannels.has('trigger')` guard.

### Definition of Done
- [ ] Driver routes via the default path for the per-flag pass.
- [ ] Trigger ablation produces a non-noise delta.
- [ ] Criterion-4 is re-run and `benchmark-status.md` updated with a supersession note.
- [ ] Strict validation exits 0 for this child phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Eval-harness fidelity fix plus benchmark re-run.

### Key Components
- **Driver routing**: replace the forced all-channels path with the default `routeQuery()` selection.
- **Trigger gating**: add the missing channel guard so the trigger lane can be ablated.
- **Benchmark re-run**: regenerate the per-flag deltas on the corrected driver.
- **Doc update**: record the new deltas and supersede the prior measurement.

### Data Flow
A benchmark query is routed by `routeQuery()` to its default channel subset, scored per flag off/on, aggregated into a Recall@20 delta, and written to `benchmark-status.md`. The trigger ablation removes the trigger lane and re-scores so its delta reflects a real channel removal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `run-retrieval-flag-eval.mjs:355` | Forces `forceAllChannels: true` | Route via default path | Per-flag deltas measured on `routeQuery()` channels |
| `run-retrieval-flag-eval.mjs:371` | No-op trigger ablation | Gate the trigger lane | Trigger row delta differs from baseline |
| `hybrid-search.ts:1504` | Calls `exactTriggerSearch` unconditionally | Investigate guard | `activeChannels.has('trigger')` controls the call |
| `benchmark-status.md` | Criterion-4 evidence | Re-measure and supersede | New deltas plus supersession note recorded |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Reproduce the prior criterion-4 run and capture its per-flag deltas as the comparison baseline.
- [ ] Confirm the default routing and trigger call-site facts cited in the review.
- [ ] Confirm embedding coverage is healthy before trusting any re-run.

### Phase 2: Core Implementation
- [ ] Replace the forced all-channels measurement with the default `routeQuery()` path in the driver.
- [ ] Add the trigger-channel guard so the ablation genuinely removes the trigger lane.
- [ ] Keep production routing code unchanged.

### Phase 3: Verification
- [ ] Re-run the criterion-4 per-flag benchmark on the corrected driver.
- [ ] Re-derive the flip verdict from the new deltas.
- [ ] Update `benchmark-status.md` with the new deltas and a supersession note.
- [ ] Run strict validation for this child folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Routing parity | Default-path channel selection | `routeQuery()` trace, recall comparison |
| Ablation validity | Trigger lane removal | Baseline vs trigger-ablated delta |
| Benchmark re-run | Per-flag Recall@20 | `run-retrieval-flag-eval.mjs` |
| Spec validation | Child phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Aligned golden set | Internal | Green | Cannot re-run criterion-4 without it |
| Embedder availability | Internal | Unknown | A degraded vector lane invalidates the re-run |
| Spec-kit validator | Internal | Green | Cannot claim phase validation without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The corrected driver produces unexplained or unstable deltas.
- **Procedure**: Revert the driver change, retain the prior benchmark, and record the blocker before re-attempting.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| 001 | `../spec.md` | Parent roster orders the remediation phases |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Driver routing fix | Small | Replace one option path |
| Trigger gating | Medium | Requires runtime call-site investigation |
| Benchmark re-run | Medium | Depends on embedder availability and golden set |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Keep the prior benchmark output before re-running.
- Revert the driver change if the re-run cannot be trusted.
- Re-run `validate.sh --strict` after rollback.
<!-- /ANCHOR:enhanced-rollback -->
