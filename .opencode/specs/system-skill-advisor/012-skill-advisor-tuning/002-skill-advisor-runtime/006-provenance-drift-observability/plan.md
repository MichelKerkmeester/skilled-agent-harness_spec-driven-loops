---
title: "Implementation Plan: Skill Advisor - Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate"
description: "Substrate-first sequencing for three observability/integrity refinements. SA-author-self-boost-guard is implemented default-off behind SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD. SA-skip-never-fabricate and SA-attested-baseline-drift-sweep remain PENDING behind the durable calibration substrate co-owned with Deep-Loop 028/004."
trigger_phrases:
  - "advisor provenance drift plan"
  - "SA self boost guard sequencing"
  - "SA attested baseline drift shadow plan"
  - "SA skip never fabricate enum plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime/006-provenance-drift-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented default-off self-boost guard"
    next_safe_action: "Await durable calibration substrate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-006-provenance-drift-observability"
      parent_session_id: null
    completion_pct: 34
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Skill Advisor - Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, MCP server) |
| **Framework** | Skill Advisor calibration + 5-lane fusion scorer (`lib/scorer/feedback-calibration.ts`, `fusion.ts`, `lanes/explicit.ts`) |
| **Storage** | Today: ephemeral tmpdir JSONL 50-record window (`feedback-calibration.ts:25-26`). Target: durable cross-session calibration substrate (co-owned with Deep-Loop 028/004) |
| **Testing** | vitest |

### Overview
Three refinements opened by the iter-8 mining of aionforge `cross-family-guard.md` + `drift.md`, two orthogonal NET-NEW families (provenance-contamination, temporal-drift) the fusion-math roadmap never touches, plus a skip-reason taxonomy enrich. Round-E verification (iter-012) softened all three to PARTIAL/CAUTION and confirmed the scope. **SA-author-self-boost-guard** is now implemented as a default-off scorer change: it threads producer identity through explicit-author matches only when `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` is enabled, centralizes the advisor self-recommendation guard and leaves non-advisor `explicit_author` behavior byte-identical. **SA-attested-baseline-drift-sweep** remains gated on moving the record root off `tmpdir()` onto a durable substrate. **SA-skip-never-fabricate** remains gated because the named drift-skip reasons only have meaning once an attested-baseline path exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (the 3 candidates + the shared substrate blocker + each gate)
- [x] Success criteria measurable (per-candidate invariants, default-inert/shadow-only when gate unmet)
- [x] Dependencies identified (durable substrate shared with 028/004 for drift + skip, scope-correction for the self-boost guard)
- [x] SA-author-self-boost-guard gate materialized and implemented default-off
- [ ] Durable substrate gate materialized for drift + skip

### Definition of Done
- [x] SA-author-self-boost-guard implemented under its invariant once unblocked
- [ ] Drift + skip stay PENDING until the durable substrate gate materializes
- [ ] Tests passing (self-boost fixtures pass, broad suite has pre-existing parity failures)
- [x] Docs updated for implemented/pending candidate status. REFUTED items stay recorded as out-of-scope
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive calibration/scorer-seam refinements layered on the durable substrate (when it lands), mirroring aionforge's union-with-authoring-model contamination guard (`cross-family-guard.md`) and baseline-is-the-asset drift sweep (`drift.md`), but scoped tightly: the self-boost guard never neuters the by-design `explicit_author` symmetry, the drift sweep never auto-rebaselines and the skip taxonomy never fabricates. Each refinement is default-inert / shadow-only when its gate is unmet.

### Key Components
- **SA-author-self-boost-guard, generalized self-recommendation guard (`fusion.ts:173,464`, reading producer identity from `explicit.ts:318-320,327`)**: replace the two ad-hoc penalties, `readOnlyExplainerFloor` for `skill-advisor` (`fusion.ts:134`) and `auditRecsAdvisorPenalty` (`fusion.ts:313`), with ONE principled producer-vs-scored-skill rule that fires only on the self-recommendation vector. Every other skill's `author:${phrase}` self-scoring is unchanged (the by-design symmetry). A blanket guard is explicitly rejected [CONFIRMED: iter-012 E12-01].
- **SA-attested-baseline-drift-sweep, shadow-path drift sweep (`feedback-calibration.ts:193-203`, behind the `:230-237` guardrails)**: read an ATTESTED (versioned/committed) baseline and score `drift = clamp01(cos(baseline,anchor) − cos(current,anchor))`. NEVER auto-rebaseline. Emit a content-addressed drift gauge so a stable drift state does not re-flap. Default-off, shadow-only, live weights frozen. Gated on moving the record root off `tmpdir()` (`:25`) onto the durable substrate [CONFIRMED: iter-008 delta, iter-012 E12-03].
- **SA-skip-never-fabricate, enriched skip taxonomy (`feedback-calibration.ts:125-130`)**: extend `signalReason()` with `baselines_needed` / `stale_model` (stale-embedder-space) / `awaiting_first_behavior` / `thin`. A non-calibratable lane reports the specific named reason and is excluded, never forced to a max score nor a fabricated alarm [CONFIRMED: iter-008 delta].

### Data Flow
Outcome records → (durable substrate, once it lands) attested baseline + cross-session window → calibration reduce (`reduceAdvisorFeedbackCalibration`) → (SA-skip-never-fabricate) `signalReason()` names a non-calibratable lane → (SA-attested-baseline-drift-sweep, shadow-only) drift sweep vs the attested baseline → content-addressed anti-flap gauge → shadow report (live weights frozen). Independently, on the live scoring path: prompt → lanes → optional producer identity on explicit-author matches → default-off self-recommendation guard → ranked recommendations. With the guard flag unset, behavior is exactly today's. Drift/skip remain absent until the substrate exists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

These touch the calibration estimator (a shadow-path, confidence-bearing surface) and the live dedup/rank seam, so the affected-surface inventory applies. All rows are conditional on the candidate being promoted past its gate.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `feedback-calibration.ts:25-26` `RECORD_ROOT=tmpdir()` + `MAX_RECORDS=50` | Ephemeral 50-record tmpdir window (no cross-session state) | SA-attested-baseline-drift-sweep: move the record root onto the durable substrate (co-owned 028/004) | The baseline survives a session restart, tmpdir path no longer the store of record |
| `feedback-calibration.ts:125-130` `signalReason()` | Returns `low_sample_excluded`/`sample_concentration_excluded`/`no_lane_attribution_excluded`/`supported_shadow_candidate` | SA-skip-never-fabricate: add `baselines_needed`/`stale_model`/`awaiting_first_behavior`/`thin` | A non-calibratable lane reports the named reason, never a max score or a fabricated alarm |
| `feedback-calibration.ts:193-203` `thresholdSignals` recompute | Recomputed live every call, NO persisted baseline | SA-attested-baseline-drift-sweep: add the attested-baseline read + `clamp01(cos(base,anchor)−cos(cur,anchor))` drift sweep beside it | NEVER auto-rebaselines, runs shadow-only, baseline updated only by explicit re-attestation |
| `feedback-calibration.ts:230-237` `guardrails` | `{defaultOff, shadowOnly, liveWeightsFrozen, autoPromotion:false, heldOutValidationRequired}` | SA-attested-baseline-drift-sweep: PRESERVE these, the drift gauge is shadow-only | Live weights stay frozen, the drift sweep changes no live routing |
| `explicit.ts:318-320,327` `author:${phrase}` push + lane score | Pushes self-authored evidence, returns it as the `explicit_author` lane score (by-design symmetry) | SA-author-self-boost-guard: thread producer identity so the guard can read producer-vs-scored, do NOT change the symmetry for non-self skills | A fixture proves only the self-recommendation vector is affected, all other skills byte-identical |
| `fusion.ts:134,313` `readOnlyExplainerFloor` + `auditRecsAdvisorPenalty` | Two hardcoded self-recommendation penalties (scoped to `skill-advisor` / audit-recommendation prompts) | SA-author-self-boost-guard: GENERALIZE both into one producer-vs-scored guard at the dedup/rank seam (`:173,464`) | The generalized guard reproduces both existing penalty behaviors AND fires on the broader self-rec vector, blanket-guard rejected |

Required invariant: when a candidate's gate is unmet it is ABSENT (drift/skip need the substrate, the self-boost guard leaves the existing penalties in place). The drift sweep is default-off + shadow-only with frozen live weights. SA-anti-flap is NOT built standalone (only its dedup discipline rides the new gauge).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the durable calibration substrate status under the sibling `004-c4-shadow-seam-beta-posterior`, SA-attested-baseline-drift-sweep + SA-skip-never-fabricate both ride it. Do not start the drift sweep before the substrate moves the record root off `tmpdir()` (`feedback-calibration.ts:25`)
- [ ] Re-confirm the self-boost scope-correction: the two penalties to generalize are `readOnlyExplainerFloor` (`fusion.ts:134`) + `auditRecsAdvisorPenalty` (`fusion.ts:313`), a blanket guard is rejected (REQ-002)

### Phase 2: Core Implementation
- [x] SA-author-self-boost-guard (scope-correction ready, no substrate needed, low-priority): generalize the two penalties into one producer-vs-scored guard at the dedup/rank seam, leaving the by-design `explicit_author` symmetry intact for non-self skills (REQ-002/REQ-007)
- [ ] SA-skip-never-fabricate (only once the durable substrate exists): extend `signalReason()` with the named drift-skip reasons, a non-calibratable lane is named-skipped, never fabricated (REQ-004)
- [ ] SA-attested-baseline-drift-sweep (only once the durable substrate exists): attested baseline + shadow-path drift sweep that never auto-rebaselines, with a content-addressed anti-flap drift gauge (REQ-003/REQ-006)

### Phase 3: Verification
- [x] SA-author-self-boost-guard fixtures (guard fires only on advisor self-recommendation aliases + byte-identical for non-advisor skills)
- [ ] Drift/skip fixtures deferred until durable substrate exists
- [ ] `tsc` + advisor test suite green, independent adversarial review (typecheck passed, broad suite has pre-existing parity failures)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | SA-author-self-boost-guard: fires only on the self-recommendation vector, reproduces both prior penalties, byte-identical for every non-self skill's `explicit_author` contribution | vitest |
| Unit | SA-attested-baseline-drift-sweep: `clamp01(cos(base,anchor)−cos(cur,anchor))` against an attested baseline, NEVER auto-rebaselines, shadow-only with live weights frozen | vitest |
| Unit | SA-attested-baseline-drift-sweep anti-flap: the content-addressed drift gauge no-ops on a stable drift state, only decile/threshold escalation re-emits | vitest |
| Unit | SA-skip-never-fabricate: every named reason (`baselines_needed`/`stale_model`/`awaiting_first_behavior`/`thin`) excludes the lane, NEVER a max score or a fabricated alarm | vitest |
| Regression | With each gate unmet, calibration + scorer output matches today's baseline exactly, no default-on behavior, the drift sweep is default-off | vitest |
| Integration | Substrate-backed: the attested baseline survives a session restart (no longer in tmpdir), the enriched skip reasons persist across sessions | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Durable cross-session calibration substrate (co-owned with Deep-Loop 028/004) | Sibling 028/003 sub-phase (`004-c4-shadow-seam-beta-posterior`) | Pending (the live store is the ephemeral tmpdir window) | HARD for SA-attested-baseline-drift-sweep + SA-skip-never-fabricate, no attested baseline or persisted skip reason is possible in tmpdir [CONFIRMED: iter-008, iter-012 E12-03] |
| The two existing self-recommendation penalties (`fusion.ts:134,313`) | Internal code to generalize | Present | SOFT for SA-author-self-boost-guard, it refactors existing code, least-blocked of the three but low-priority (the real self-rec vector is already mitigated) [CONFIRMED: iter-012 E12-01] |
| aionforge `cross-family-guard.md` + `drift.md` reference | External doc | Green | Reference pattern only (union-with-authoring-model, baseline-is-the-asset), not a code dep [CONFIRMED: iter-008 mining source] |
| SA-anti-flap-warning-dedup (standalone) | Refuted candidate | NO-GO | None, do NOT build standalone (no emitter), reuse only its dedup discipline on the new drift gauge [CONFIRMED: iter-012 E12-04] |
| C4 Beta-posterior + SA-two-gate-promotion chain | Sibling 028/003 sub-phase (`004`) | Co-located (same substrate) | None directly, the drift/skip families are orthogonal to the Beta tune but share the durable store [CONFIRMED: iter-008 edge E8-newfamilies "orthogonal_drift_family"] |
| Fusion-math routing (C1/QCR/C6/C3/C5) | Sibling 028/003 sub-phases (`001`,`002`,`005`) | Independent | None, zero overlap with provenance/drift [CONFIRMED: iter-008 "zero overlap with these 6"] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A promoted candidate regresses, the generalized self-boost guard fires on a non-self skill (neutering by-design symmetry), the drift sweep auto-rebaselines or its gauge flaps or a skip reason fabricates a max/alarm.
- **Procedure**: Revert the per-candidate commit (branch-only, never pushed to main or deployed without explicit go). Each candidate is a self-contained, additive change. Reverting restores today's calibration + scorer behavior exactly. The drift sweep is default-off, so its revert is doubly safe.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup / gate-verify) ──┐
                                ├──► Phase 2 (Core: self-boost | skip | drift) ──► Phase 3 (Verify)
durable substrate (028/004) ────┘   (drift + skip ride it; self-boost is independent)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (gate-verify) | durable-substrate status (028/004), the 2 penalties to generalize | Core |
| Core: SA-author-self-boost-guard | Setup (scope-correction) | Verify (self-boost) |
| Core: SA-skip-never-fabricate | Setup + the durable substrate landed | Verify (skip) |
| Core: SA-attested-baseline-drift-sweep | Setup + the durable substrate landed | Verify (drift) |
| Verify | Whichever Core candidate was promoted | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (gate-verify) | Low | ~30m (substrate status + confirm the 2 penalties) |
| SA-author-self-boost-guard | Done | Implemented default-off with producer-vs-scored fixtures |
| SA-skip-never-fabricate (when promoted) | Low | ~1-2h (enum enrich + named-skip fixtures), research effort S |
| SA-attested-baseline-drift-sweep (when promoted) | Large | ~1-2d incl. the attested-baseline schema + drift sweep + anti-flap gauge (on top of the substrate), research effort L |
| Verification | Med | ~2-3h per promoted candidate (fixtures + adversarial review) |
| **Total** | | **Deferred, 0h until a gate materializes, per-candidate estimates above when unblocked** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The promoted candidate's gate is confirmed materialized (durable substrate landed for drift/skip, scope-correction confirmed for the self-boost guard)
- [ ] Drift sweep stays default-off + shadow-only on first ship (no live weight change)
- [ ] Default-inert / byte-identical assertion green for the still-deferred candidates and for non-self skills (self-boost guard)

### Rollback Procedure
1. Revert the per-candidate commit (branch-only), the change is additive and self-contained
2. Confirm calibration + scorer output returns to today's baseline (the drift sweep is default-off, so disabling the flag is also sufficient)
3. Re-run the default-inert / byte-identical regression fixture to verify the revert restored prior behavior
4. No stakeholder notification needed (branch-only, nothing deployed)

### Data Reversal
- **Has data migrations?** The attested-baseline storage is owned by the durable substrate (028/004). This sub-phase WRITES an attested baseline into it but does not own the migration. The self-boost guard and the skip-enum enrich touch no persisted data.
- **Reversal procedure**: For the drift sweep, drop the attested-baseline record(s) this sub-phase wrote. The substrate itself (028/004) is reverted separately.
<!-- /ANCHOR:enhanced-rollback -->
