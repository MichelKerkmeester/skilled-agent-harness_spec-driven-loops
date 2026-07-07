# Iteration 5: Adversarial Verification — Is C4's Shadow Pipeline ONE Wired Path? (REFUTED)

## Focus
Round A (broadening) adversarial verification of the roadmap's **[INFERRED]** claim that Skill Advisor candidate **C4** (bounded Beta-posterior lane auto-tune) merely GRADUATES an already-shipped end-to-end shadow pipeline (outcome capture → bounded delta estimator → shadow-weight registry → shadow recommendation). Trace the actual data flow across the three cited files. Read-only.

## Actions Taken
1. Read outcome capture in `handlers/advisor-validate.ts` (`:31` import, `:502-511` capture/persist `AdvisorHookOutcomeRecord`, `:529-541` build `calibrationRecords` → estimator).
2. Read the delta estimator `lib/scorer/feedback-calibration.ts` (`:11` imports, `:154` estimator, `:230-237` guardrails, `:241-253` JSONL persist).
3. Read shadow recommendation `handlers/advisor-recommend.ts` (`:14`, `:271-292` shadowScore) + the shadow weights in `lib/scorer/lane-registry.ts` (`:71-74`, `:100`).
4. Mapped the three seam edges.

## Findings (file:line)

**The "pipeline" is TWO disconnected wired segments — [REFUTED].**
- **Edge 1 (outcome→estimator): WIRED.** `advisor-validate.ts:31` imports `recordAdvisorFeedbackCalibrationIfEnabled`; `:502-511` captures/persists outcome records; `:529-541` feeds `calibrationRecords` to the estimator. [CONFIRMED]
- **Edge 2 (estimator→shadow-weight registry): MISSING.** `feedback-calibration.ts:11` imports only `isLiveScorerLane` (a boolean gate, `:175`); its proposal/report is persisted to a tmpdir JSONL (`:241-253`) and consumed **only by tests** (`tests/scorer/advisor-feedback-calibration.vitest.ts`). Self-declared guardrails: `liveWeightsFrozen:true, autoPromotion:false, shadowOnly:true, defaultOff:true` (`:230-237`). [CONFIRMED MISSING]
- **Edge 3 (registry→shadow-rec): WIRED but STATIC.** `advisor-recommend.ts:277` computes `shadowScore = lane.rawScore * DEFAULT_SHADOW_SCORER_LANE_WEIGHTS` — fixed defaults, untouched by any calibration delta. [CONFIRMED]

The estimator computes bounded deltas nothing applies; the shadow rec uses weights nothing updates. **C4 cannot "graduate" a flow whose load-bearing middle seam does not exist.**

**Build-cost correction:** C4 is **moderate, not low** — the components are real and tested, but the estimator→registry→shadow-rec datapath plus promotion gating past `shadowOnly`/`defaultOff` must be **authored**. It is a seam-build, not a flag-flip graduation.

**Roadmap impact:** roadmap §(5) + §Provenance tag C4 as a "graduation of an end-to-end shadow pipeline that already ships … lower-build than it first appears" and ask to "re-confirm the C4 shadow linkage is ONE live pipeline." → **REFUTED.** The "outcome → shadow-weight → shadow-recommendation" being ONE wired path is FALSE; C4 effort rises from "L (shadow-first graduation)" to "L+ (build the deltas→shadow-weights seam + promotion gate)".

## Questions Answered
- Is C4's shadow pipeline ONE live wired path? **NO — REFUTED.** Two wired half-pipelines (capture→estimator; registry→shadow-rec) with a MISSING middle seam (estimator deltas dead-end in a test-only JSONL).

## Questions Remaining
- (new) Is there any cron/promotion job OUTSIDE this `mcp_server` tree (`scripts/` or hook configs) that reads the calibration JSONL and rewrites `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON`? If so the seam is operator-mediated (out-of-process), not absent — a one-grep check before final C4 sizing.

## Next Focus
C4 downgraded from graduation to seam-build. Round-A follow-up (or Round C feasibility): the one-grep check for an out-of-process promotion job; re-rank C4's effort column. The connective seam (apply bounded deltas to the shadow weights `advisor-recommend.ts:271-292` consumes) is the new candidate.
