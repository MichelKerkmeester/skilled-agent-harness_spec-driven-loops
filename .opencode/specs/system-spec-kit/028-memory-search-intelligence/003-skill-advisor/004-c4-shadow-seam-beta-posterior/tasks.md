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

> **Candidate status (vs 030 Wave-0 shipped record):** ALL nine candidates in this sub-phase are PENDING. `030/spec.md §14` ships none of them — its 13 shipped rows are Q6-anchor, C9, ANN tie-stable, C5-B, C-X1/C6-A, two-primitive-content-id, gauges, skip-closed, Constitutional-CAS, Deep-Loop trio, Code-Graph Q4-C1 (and DEFERRED C4-A, M-system-kind). No advisor lane-scorer reliability candidate shipped. Therefore no task below is pre-checked `[x]` with a commit; every task is `[ ]` PENDING.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- (Phase 0 in plan.md — Baseline + Foundation; REQ-001, REQ-002) -->

- [ ] T001 Capture the estimator/proposal baseline (before any delta-shape change) into `scratch/` — record the live `laneSignals`/`proposal` output; NEVER quote the unsourced "~13%" skew (grep=0, iter-17) (`scratch/`)
- [ ] T002 Build the per-lane runtime score-presence (lane-health) signal in `laneSignals` — distinguish runtime-degraded-empty from matched-nothing-empty (`feedback-calibration.ts:167-189`)
- [ ] T003 [P] Add the NEW asymmetric-deltas helper (SA-asymmetric-deltas) at the sign-locked threshold seam `:200-201` — down≥up, gain→0, never-ratcheted sink-only cap; do NOT mutate the shared `clamp` at `:176` (`feedback-calibration.ts:200-201`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### C4-seam (REQ-003, REQ-004)
- [ ] T004 Build the out-of-process promoter that reads the `ReadOnlyScorerCalibrationProposal` from the feedback-calibration JSONL (`feedback-calibration.ts:222-238,241-251`) (new promoter script)
- [ ] T005 Write the shadow-weight channel from the promoter — `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` → `RESOLVED_SHADOW_WEIGHTS` (`lane-registry.ts:71-74`)
- [ ] T006 [B] Wire the daemon reload trigger (resolve Q-002: does `advisor_rebuild` reload the shadow env, or only full restart?) — blocked on Q-002 confirmation (new promoter script + advisor daemon)
- [ ] T007 Run the promoter as cron/maintenance only — never a prompt-time hook (NFR-P01)

### Beta posterior (REQ-005)
- [ ] T008 Build the shared f64 Beta primitive `(α₀+s)/(α₀+β₀+s+f)` — cold-start neutral 0.5, count floor, commuting folds (new `beta-reliability.ts`)
- [ ] T009 Build the thin advisor adapter — consume the posterior as a weight-delta, NOT a multiplier; do NOT reuse `deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` `computeScore` (throws `RangeError` on non-integer inputs, `:14-15`) (new adapter)
- [ ] T010 [P] Coordinate the shared module location/signature with Deep-Loop D2 (028/004) — one module + per-consumer adapters (synthesis 04 RC6)

### Promotion-gate family (REQ-006..010)
- [ ] T011 SA-two-gate-promotion — k≥2 distinct attesters AND posterior≥threshold, non-trading conjunction; REFUSE a policy whose kMin can't reach the threshold (reachability validation); EXTEND the existing `minSamples`→`low_sample_excluded` + concentration guards (`feedback-calibration.ts:193-197,222-238`)
- [ ] T012 SA-cold-start-neutral-prior — Beta(1,1)→0.5 replacing the EXCLUDE-on-low-sample path; NEEDS-BENCHMARK: prove the continuous prior beats the cliff (`feedback-calibration.ts:193-197`)
- [ ] T013 SA-heldout-attestation-gate — distinct-source corroboration, one-vote-per-source, distinct-author guard; back the dangling `heldOutValidationRequired` flag using the held-out partition of the MAX_RECORDS=50 ring (`feedback-calibration.ts:235,251`)
- [ ] T014 SA-decay-un-promotion — reversible shadow demotion on decayed support; stable lane id re-promotes; audit tags separate "support went bad" from "lost support"; stays shadow (no live-write path enabled) (`lane-registry.ts:8-13`)
- [ ] T015 SA-content-addressed-fold — append-only JSONL as source of truth; content-address events so replay/double-delivery folds identically; order-independent (Beta increments commute) (`feedback-calibration.ts:241-251`)

### Guardrail enforcement (REQ-004)
- [ ] T016 Keep `defaultOff/shadowOnly/liveWeightsFrozen/autoPromotion/heldOutValidationRequired` TRUE through the whole build (`feedback-calibration.ts:230-237`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Unit-test the Beta math: commutativity, cold-start 0.5, anti-flood (8-vs-10k samples NOT identical), replay/double-delivery idempotence (new test dir)
- [ ] T018 Unit-test the gate: k-floor (k=1 does NOT promote), reachability-refusal of an unreachable policy, held-out distinct-author rejection (new test dir)
- [ ] T019 Unit-test the guardrail: the C4-seam can NEVER write a live lane weight; shadow-only invariant holds (new test dir)
- [ ] T020 Run `tsc`/build + the existing advisor scorer suite green; capture the after-baseline and diff vs T001
- [ ] T021 Record the promotion-to-live NO-GO gate (micro-benchmark required to beat the `minSamples` cliff) in `decision-record.md` (REQ-011)
- [ ] T022 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and fix until clean
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (T006 unblocked by Q-002)
- [ ] Beta math + gate + fold + guardrail unit tests passing
- [ ] Shadow-only guardrails proven intact; no live weight movement
- [ ] Promotion-to-live NO-GO gate recorded; baseline captured (no unsourced number quoted)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: `../research/iterations/iteration-007.md` (gate family seams), `iteration-010.md` (C4-seam GO), `iteration-014.md` (zero Beta math), `iteration-016.md` (build sequence + D2 sharing).
- **Shipped record (none of these shipped):** `../../../030-memory-search-intelligence-impl/spec.md` §14.
<!-- /ANCHOR:cross-refs -->
