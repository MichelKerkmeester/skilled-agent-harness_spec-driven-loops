---
title: "Tasks: Skill Advisor C4 Shadow Seam + Beta Posterior"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "advisor c4 seam tasks"
  - "advisor beta posterior tasks"
  - "skill advisor promotion gate tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/004-c4-shadow-seam-beta-posterior"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author task breakdown for the C4 shadow-seam + Beta-posterior sub-phase"
    next_safe_action: "Begin T001 baseline capture"
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-004-c4-shadow-seam"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Advisor C4 Shadow Seam + Beta Posterior

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

> **Candidate status (vs 030 Wave-0 shipped record):** the nine candidates were all PENDING at packet authoring, `030/spec.md §14` ships none of them. This sub-phase now BUILDS the shadow-only machinery: the shared Beta primitive + adapter, asymmetric helper, two-gate + reachability, held-out attestation, content-addressed fold, decay un-promotion and the C4-seam promoter (all default-off / shadow-only by construction, live recommend path byte-identical). **Still PENDING:** T006 (daemon reload, blocked on Q-002, needs a live warm-daemon probe) and T010 (Deep-Loop D2 shared-module coordination, cross-subsystem, lands in 028/004). The live-cliff replacement portion of T012 stays NO-GO/benchmark-gated (the live estimator path is unchanged).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- (Phase 0 in plan.md, Baseline + Foundation; REQ-001, REQ-002) -->

- [x] T001 Capture the estimator/proposal baseline (before any delta-shape change) into `scratch/`, record the live `laneSignals`/`proposal` output, NEVER quote the unsourced "~13%" skew (grep=0, iter-17) (`scratch/`)
- [x] T002 Build the per-lane runtime score-presence (lane-health) signal in `laneSignals`, distinguish runtime-degraded-empty from matched-nothing-empty (`feedback-calibration.ts:167-189`)
- [x] T003 [P] Add the NEW asymmetric-deltas helper (SA-asymmetric-deltas) at the sign-locked threshold seam `:200-201`, down≥up, gain→0, never-ratcheted sink-only cap, do NOT mutate the shared `clamp` at `:176` (`feedback-calibration.ts:200-201`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### C4-seam (REQ-003, REQ-004)
- [x] T004 Build the out-of-process promoter that reads the `ReadOnlyScorerCalibrationProposal` from the feedback-calibration JSONL (`feedback-calibration.ts:222-238,241-251`) (new promoter script)
- [x] T005 Write the shadow-weight channel from the promoter, `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` → `RESOLVED_SHADOW_WEIGHTS` (`lane-registry.ts:71-74`)
- [ ] T006 [B] Wire the daemon reload trigger (resolve Q-002: does `advisor_rebuild` reload the shadow env, or only full restart?), blocked on Q-002 confirmation (new promoter script + advisor daemon). **LEFT-PENDING**: needs a live warm-daemon probe (cross-daemon reload semantics), not resolvable with deterministic unit tests. The promoter writes the artifact an operator/restart picks up.
- [x] T007 Run the promoter as cron/maintenance only, never a prompt-time hook (NFR-P01)

### Beta posterior (REQ-005)
- [x] T008 Build the shared f64 Beta primitive `(α₀+s)/(α₀+β₀+s+f)`, cold-start neutral 0.5, count floor, commuting folds (new `beta-reliability.ts`)
- [x] T009 Build the thin advisor adapter, consume the posterior as a weight-delta, NOT a multiplier, do NOT reuse `deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` `computeScore` (throws `RangeError` on non-integer inputs, `:14-15`) (new adapter)
- [ ] T010 [P] Coordinate the shared module location/signature with Deep-Loop D2 (028/004), one module + per-consumer adapters (synthesis 04 RC6). **LEFT-PENDING**: cross-subsystem coordination, not a code deliverable in this sub-phase. `beta-reliability.ts` is built dependency-free (pure f64 math, no advisor-only imports in the primitive) so D2 can consume it via its own adapter when 028/004 lands.

### Promotion-gate family (REQ-006..010)
- [x] T011 SA-two-gate-promotion, k≥2 distinct attesters AND posterior≥threshold, non-trading conjunction, REFUSE a policy whose kMin can't reach the threshold (reachability validation), EXTEND the existing `minSamples`→`low_sample_excluded` + concentration guards (`feedback-calibration.ts:193-197,222-238`)
- [x] T012 SA-cold-start-neutral-prior, Beta(1,1)→0.5 primitive built (`beta-reliability.ts` `coldStartPosterior`/`laneReliabilityPosterior`) and consumed by the shadow promoter (default-off by construction). **Live-cliff replacement stays NO-GO/benchmark-gated**: the live estimator's `low_sample_excluded` path (`feedback-calibration.ts:193-197`) is left UNCHANGED, preferring the continuous prior over the cliff in the live path requires the micro-benchmark (REQ-011).
- [x] T013 SA-heldout-attestation-gate, distinct-source corroboration, one-vote-per-source, distinct-author guard, back the dangling `heldOutValidationRequired` flag using the held-out partition of the MAX_RECORDS=50 ring (`feedback-calibration.ts:235,251`)
- [x] T014 SA-decay-un-promotion, reversible shadow demotion on decayed support, stable lane id re-promotes, audit tags separate "support went bad" from "lost support", stays shadow (no live-write path enabled) (`lane-registry.ts:8-13`)
- [x] T015 SA-content-addressed-fold, append-only JSONL as source of truth, content-address events so replay/double-delivery folds identically, order-independent (Beta increments commute) (`feedback-calibration.ts:241-251`)

### Guardrail enforcement (REQ-004)
- [x] T016 Keep `defaultOff/shadowOnly/liveWeightsFrozen/autoPromotion/heldOutValidationRequired` TRUE through the whole build (`feedback-calibration.ts:230-237`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Unit-test the Beta math: commutativity, cold-start 0.5, anti-flood (8-vs-10k samples NOT identical), replay/double-delivery idempotence (new test dir)
- [x] T018 Unit-test the gate: k-floor (k=1 does NOT promote), reachability-refusal of an unreachable policy, held-out distinct-author rejection (new test dir)
- [x] T019 Unit-test the guardrail: the C4-seam can NEVER write a live lane weight, shadow-only invariant holds (new test dir)
- [x] T020 Run `tsc`/build + the existing advisor scorer suite green, capture the after-baseline and diff vs T001 (typecheck 0 errors, `tests/scorer/` 142 pass = 109 baseline + 33 new, 0 new failures, default-off byte-identical proven by the asymmetric-wiring test)
- [x] T021 Record the promotion-to-live NO-GO gate (micro-benchmark required to beat the `minSamples` cliff) in `decision-record.md` (REQ-011)
- [x] T022 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and fix until clean
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [~] All implementable tasks marked `[x]`, T006 (daemon reload, blocked on Q-002) and T010 (Deep-Loop D2 coordination, cross-subsystem) remain `[ ]` PENDING with reasons
- [ ] No `[B]` blocked tasks remaining (T006 still blocked on Q-002, needs a live warm-daemon probe)
- [x] Beta math + gate + fold + guardrail unit tests passing (33 new tests, `tests/scorer/` 142 pass, 0 new failures)
- [x] Shadow-only guardrails proven intact, no live weight movement (promoter targets only `SHADOW_LANE_WEIGHTS_ENV_KEY`, live key never emitted, guardrail test asserts it)
- [x] Promotion-to-live NO-GO gate recorded, baseline captured (no unsourced number quoted), `decision-record.md` NO-GO + `scratch/estimator-baseline.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: `../research/iterations/iteration-007.md` (gate family seams), `iteration-010.md` (C4-seam GO), `iteration-014.md` (zero Beta math), `iteration-016.md` (build sequence + D2 sharing).
<!-- /ANCHOR:cross-refs -->
