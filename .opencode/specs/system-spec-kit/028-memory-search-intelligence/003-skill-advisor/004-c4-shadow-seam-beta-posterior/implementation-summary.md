---
title: "Implementation Summary: Skill Advisor C4 Shadow Seam + Beta Posterior"
description: "Closeout for the advisor C4 shadow-seam + Beta-posterior sub-phase. The 9-candidate reliability-weighted-learning build shipped shadow-only and default-off (shared Beta posterior, shadow-weight promoter, two-gate, held-out attestation, cold-start prior, decay un-promotion, content-addressed fold, asymmetric deltas). Two integration tasks stay pending (daemon reload T006, D2 coordination T010) and the live flip is NO-GO until a micro-benchmark."
trigger_phrases:
  - "implementation summary advisor c4 shadow seam"
  - "skill advisor beta posterior closeout"
  - "advisor reliability weighted learning pending candidates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/004-c4-shadow-seam-beta-posterior"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped Beta posterior + shadow-weight promoter + gate family, shadow-only"
    next_safe_action: "Resolve Q-002 to unblock T006, coordinate D2 shared module (T010)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-004-c4-shadow-seam"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/028-memory-search-intelligence/003-skill-advisor/004-c4-shadow-seam-beta-posterior |
| **Authored** | 2026-06-19 |
| **Level** | 3 |
| **Status** | complete |
| **Scope** | Advisor reliability-weighted learning: C4-seam + Beta posterior + aionforge promotion-gate family + Phase-0 foundation, shipped shadow-only and default-off |
| **Branch** | system-speckit/027-xce-research-based-refinement |
| **Shipped via** | Commit `10c5b61493` (default-off shadow). T006 daemon reload and T010 D2 coordination remain pending |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This sub-phase shipped the advisor reliability-weighted-learning build shadow-only and default-off. The Skill Advisor already ships an end-to-end *shadow* feedback pipeline (durable outcome capture, a bounded delta estimator, a parallel shadow-weight channel), but the estimator's proposal was written to a JSONL that no out-of-process consumer ever read back, so the loop never closed. This sub-phase built the missing seam (a cron/maintenance promoter), the reliability math (a shared Beta posterior that turns raw acceptance frequency into a flood-immune number) and the aionforge attestation-and-promotion gate family that decides, conservatively and shadow-only, whether a lane weight should ever move. It is net-new throughout: 027 shipped no lane attribution and the live estimator carried zero Beta math, so this was a BUILD, not a graduation.

**The candidate logic shipped shadow-only.** Commit `10c5b61493` added `beta-reliability.ts` and `shadow-weight-promoter.ts` plus the integration points in `feedback-calibration.ts` and `lane-registry.ts`, all default-off with a byte-identical live recommend path proven by test. Two integration tasks stay pending: T006 (daemon shadow-weight reload, blocked on Q-002) and T010 (Deep-Loop D2 cross-subsystem coordination). Live promotion is NO-GO until a micro-benchmark out-earns the `minSamples` cliff.

### Candidate set

| # | Candidate | Status | Notes |
|---|-----------|--------|------|
| 1 | SA-asymmetric-deltas | **SHIPPED shadow-only** | New sign-locked asymmetric helper at the threshold seam `feedback-calibration.ts:200-201` (down≥up, gain→0) with the symmetric weight `clamp` at `:176` untouched (T003) |
| 2 | C4-seam | **SHIPPED shadow-only** | Out-of-process promoter reads the `ReadOnlyScorerCalibrationProposal` JSONL and writes only `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON`, cron-only (T004/T005/T007). Daemon reload T006 stays pending on Q-002 |
| 3 | C4-advisor-beta-build | **SHIPPED shadow-only** | Thin advisor adapter consuming the posterior as a weight-delta, built on the shared primitive (#4) and the seam (#2) (T009) |
| 4 | C4-beta (shared Beta posterior) | **SHIPPED shadow-only** | One f64 `(α₀+s)/(α₀+β₀+s+f)` in `beta-reliability.ts`, dependency-free so Deep-Loop D2 can adapt it, not the integer scorer that throws on non-integer inputs (T008) |
| 5 | SA-two-gate-promotion | **SHIPPED shadow-only** | k≥2 distinct AND posterior≥threshold, non-trading, with reachability refusal. Extends the existing `minSamples`/concentration guards (T011) |
| 6 | SA-cold-start-neutral-prior | **SHIPPED shadow-only (primitive)** | Beta(1,1)→0.5 primitive built and consumed by the promoter (T012). The live-cliff replacement of `low_sample_excluded` stays NO-GO/benchmark-gated. The live path is unchanged |
| 7 | SA-heldout-attestation-gate | **SHIPPED shadow-only** | Distinct-source corroboration, one-vote-per-source, distinct-author guard backing the `heldOutValidationRequired` flag over the held-out ring partition (T013) |
| 8 | SA-decay-un-promotion | **SHIPPED shadow-only** | Reversible shadow demotion + audit tags, no live-write path enabled, stays shadow (T014) |
| 9 | SA-content-addressed-fold | **SHIPPED shadow-only** | Content-addressed append-only events so replay/double-delivery folds identically, order-independent (T015) |

The umbrella **C4-seam** label in the task brief maps to candidate #2, **C4-beta** to #4 and **C4-advisor-beta-build** to #3. All nine candidate behaviours shipped shadow-only. The remaining pending work is the two integration tasks (T006 daemon reload, T010 D2 coordination), not candidate logic.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build landed as scoped commits on the 028 branch following the task order. The asymmetric helper went in at the threshold seam `feedback-calibration.ts:200-201` without touching the symmetric `clamp` at `:176`. The shared Beta posterior was built dependency-free in `beta-reliability.ts` so Deep-Loop D2 can adapt it rather than fork it. The out-of-process promoter reads the `ReadOnlyScorerCalibrationProposal` JSONL and writes only the shadow-weight env key, never the live key, and runs cron-only. The two-gate, held-out attestation, decay un-promotion and content-addressed fold are pure-policy helpers over the posterior. Every guardrail (`liveWeightsFrozen`, `autoPromotion:false`, `heldOutValidationRequired`) stays true through the build. The daemon reload wiring (T006) and the D2 module coordination (T010) were left pending with reasons.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **C4 is a shadow-only BUILD, not a graduation.** The live estimator is raw-frequency (`:176`) and the scorer has zero Beta math (grep=0, iter-14), there is nothing to graduate, so the posterior + seam + gate family are built from scratch behind `liveWeightsFrozen` (ADR-001).
- **One shared Beta f64 primitive, thin per-consumer adapters.** The posterior is co-owned with Deep-Loop D2, it is NOT "one module, three identical callers" (RC6), the advisor consumes a weight-delta and D2 a posterior mean, so the math is built once and adapted per consumer (ADR-002).
- **The asymmetry lands at the threshold seam, not the weight clamp.** `:176` is provably symmetric, the NEW asymmetric helper (down≥up, gain→0) goes at `:200-201`, and the shared `clamp()` is never mutated (corrected iter-17/16).
- **Capture a baseline before any leverage claim.** The asserted "~13% confidence skew" is unsourced (grep=0, iter-17), a real estimator/proposal baseline is recorded in `scratch/` first and the 13% is never quoted.
- **Promotion to live is a hard NO-GO.** The whole build ships shadow-only, no live lane weight moves until a micro-benchmark proves the Beta posterior out-earns the `minSamples` cliff (recorded in `decision-record.md`).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Typecheck**: PASS, 0 errors.
- **Scorer suite**: PASS, 142 tests (109 baseline plus 33 new for the posterior math, the gate policy and the promoter seam).
- **Handlers + shadow-sink**: PASS, 76 tests, 0 new failures.
- **Shadow-only guardrail**: PASS, the asymmetric-wiring test proves the live recommend path is byte-identical and the promoter never writes a live lane weight.
- **Alignment drift**: PASS.
- **Strict validation**: PASS, `validate.sh --strict` 0 errors, 0 warnings.
- **Pending**: the promotion-to-live micro-benchmark stays NO-GO and is not run here. The live flip waits on real per-lane attribution plus a benchmark that out-earns the `minSamples` cliff.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shadow-only build.** All nine candidate behaviours shipped default-off. Nothing affects the live recommend path or any live lane weight until a micro-benchmark promotes it.
2. **No measured benefit number.** The asserted "~13% confidence skew" is unsourced (grep=0, iter-17). Every leverage rating is structural inference, the cold-start prior and any live flip are NEEDS-BENCHMARK.
3. **No per-lane attribution in production.** `laneAttributionBySkill` is empty (027 shipped none), even a correct posterior has no per-lane signal to tune until attribution exists, so the build stays shadow-only.
4. **Daemon reload is unconfirmed (Q-002).** `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` resolves once at module load (`lane-registry.ts:71-74`), implying restart-only, the promoter needs an explicit reload trigger unless `advisor_rebuild` reloads it.
5. **The shared Beta primitive is cross-subsystem.** Its module location and signature must be coordinated with Deep-Loop D2 (028/004) before both adapters are written, or the primitive forks.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md` (REQ-001..011, §13 candidate status via §3 scope).
- **Plan**: `plan.md` (Phases 0-4, FIX ADDENDUM affected surfaces, L3 ADRs).
- **Tasks**: `tasks.md` (T001-T022, all shipped shadow-only except T006 and T010).
- **Checklist**: `checklist.md`.
- **Decision Record**: `decision-record.md` (ADR-001 shadow-only BUILD, ADR-002 shared Beta primitive).
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/{01,04}-*`, deltas `iter-010.jsonl` / `iter-013.jsonl` / `iter-014.jsonl` / `iter-016.jsonl` / `iter-017.jsonl`.

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
