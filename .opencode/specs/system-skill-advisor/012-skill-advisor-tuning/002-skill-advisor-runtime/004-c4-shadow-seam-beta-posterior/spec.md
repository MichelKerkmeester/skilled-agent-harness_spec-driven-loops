---
title: "Feature Specification: Skill Advisor C4 Shadow Seam + Beta Posterior"
description: "Build the disconnected estimator->registry C4 seam, a shared Beta-posterior reliability primitive and the aionforge promotion-gate family (two-gate, cold-start neutral, held-out attestation, decay un-promotion, content-fold, asymmetric deltas) for the Skill Advisor lane scorer, shadow-only behind liveWeightsFrozen."
trigger_phrases:
  - "advisor c4 shadow seam"
  - "advisor beta posterior lane tune"
  - "advisor two-gate promotion"
  - "skill advisor reliability weighted learning"
  - "advisor held-out attestation gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime/004-c4-shadow-seam-beta-posterior"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built C4 shadow seam + Beta-reliability module + 33 unit tests, scorer 142 pass"
    next_safe_action: "Resolve Q-002 to unblock T006, coordinate D2 shared module (T010)"
    blockers:
      - "T006: daemon shadow-weight reload semantics unconfirmed (Q-002), needs a live warm-daemon probe"
      - "T010: Deep-Loop D2 shared-module coordination is cross-subsystem (028/004)"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-004-c4-shadow-seam"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Q-002: does advisor_rebuild reload SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON or only full restart? (gates T006)"
    answered_questions: []
---
# Feature Specification: Skill Advisor C4 Shadow Seam + Beta Posterior

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The Skill Advisor ships an end-to-end *shadow* feedback pipeline, durable outcome capture, a bounded delta estimator and a parallel shadow-weight channel, but the estimator's proposal is written to a JSONL log that **no consumer ever reads back**, so the loop never closes. This sub-phase builds the missing seam: an out-of-process promoter that reads the estimator's proposals, plus the reliability math that turns raw acceptance frequency into a flood-immune posterior, plus the aionforge attestation-and-promotion gate family that decides, conservatively and shadow-only, whether a lane weight should ever move. Net-new throughout: 027 shipped no lane attribution and the live estimator carries zero Beta math, so this is a BUILD, not a graduation.

**Key Decisions**: C4 stays SHADOW-ONLY behind `liveWeightsFrozen` (a bad shadow weight cannot corrupt routing). The Beta posterior is a shared f64 primitive co-built with Deep-Loop D2 (one math module, thin per-consumer adapters). Promotion to live is NO-GO until a micro-benchmark proves the posterior beats today's `minSamples` cliff.

**Critical Dependencies**: Phase-0 lane-health signal (C5's prerequisite, built here as `SA-asymmetric-deltas`' sibling). The shared Beta primitive (Deep-Loop D2 co-owner). A captured baseline (no benefit number exists anywhere in the campaign).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | complete (pending P0 CHK-120 rollback) |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Skill Advisor's shadow learning pipeline is structurally half-built and disconnected. The estimator `reduceAdvisorFeedbackCalibration` emits a `ReadOnlyScorerCalibrationProposal` carrying weight/threshold deltas (`feedback-calibration.ts:222-238`), but **no out-of-process consumer reads that proposal back** into the shadow-weight registry (`RESOLVED_SHADOW_WEIGHTS`, `lane-registry.ts:71-74`), so the loop never closes (C4-seam, [CONFIRMED] iter-10 GO). The estimator itself is **raw-frequency**, not Bayesian: the live proposed delta is `clamp((acceptancePressure − correctionPressure) × MAX_WEIGHT_DELTA)` (`feedback-calibration.ts:176`), a symmetric single clamp with a binary `minSamples` cliff (8 all-accepted samples maxes the delta, identical to a 10,000-sample signal at `:158,:197`). There is **no Beta prior/posterior/reliability math anywhere** in the scorer (grep `posterior|prior|alpha|beta` = 0, [CONFIRMED] iter-14 G3). So the so-called "C4 graduation" is materially false, there is nothing to graduate. The Beta layer must be built from scratch. And because 027 shipped no per-lane outcome attribution (`laneAttributionBySkill` collapses to identical workspace totals when empty, `:163-169`), even a correct posterior would have no per-lane signal to tune until attribution exists.

### Purpose
Close the estimator→registry seam, build a shared flood-immune Beta-posterior reliability primitive and add the aionforge two-gate promotion machinery (with reachability validation, cold-start neutrality, held-out attestation, reversible decay, content-addressed folding and asymmetric deltas), all shadow-only, never auto-promoting, until a micro-benchmark earns the live flip.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The C4-seam: an out-of-process (cron/maintenance, never prompt-time) promoter that reads estimator proposals (the feedback-calibration JSONL) and writes the shadow-weight var/file the advisor daemon resolves on load.
- A shared Beta-posterior f64 primitive `(α₀+s)/(α₀+β₀+s+f)` + a thin advisor-side adapter (the posterior consumed as a weight-delta, not a multiplier), co-owned with Deep-Loop D2.
- The aionforge promotion-gate family: two-gate promotion (k≥2 distinct AND posterior≥threshold, non-trading, policy-reachability refusal), cold-start neutral prior (Beta(1,1)→0.5), held-out attestation gate (distinct-source corroboration backing the dangling `heldOutValidationRequired` flag), decay-driven un-promotion (reversible demotion + audit tags), content-addressed order-independent fold (append-only log as source of truth, commuting Beta increments, replay-safe), asymmetric promote/demote deltas (corrections sink harder than acceptances raise, sign-locked).
- Phase-0 foundation: a per-lane runtime score-presence (lane-health) signal `laneSignals` lacks, `SA-asymmetric-deltas` as the clean off-path FIX, a captured C5/estimator baseline before any leverage claim.
- Unit tests for the Beta math (commutativity, cold-start, anti-flood), the gate (reachability refusal, k-floor), the fold (replay/double-delivery) and shadow-only guardrail preservation.

### Out of Scope
- Any LIVE weight change. `liveWeightsFrozen:true / autoPromotion:false` (`feedback-calibration.ts:233-234`) stay intact, nothing in this sub-phase can move a live lane weight. Promotion to live requires the micro-benchmark gate, which is itself out of scope here.
- C1 split-conflict re-rank and QCR query-class router, DEFERRED (C1 fixes a non-problem: all `conflicts_with` arrays empty in production, iter-10. QCR is benchmark-overfit-speculative, synthesis 04). Different candidates, off this critical path.
- C5 runtime-empty lane elision and C5a degraded-lane flag, the consuming candidates of the Phase-0 health signal. Sequenced after this sub-phase, only the health *signal* is built here.
- C3 RRF import, the determinism spine. Off-path parallel track owned elsewhere (028/003/001).
- The Deep-Loop D2 consumer wiring of the shared Beta primitive. Co-owned but lands in the Deep-Loop subsystem (028/004), this sub-phase owns only the shared primitive + the advisor adapter.
- `aionforge-procedural` outcome-weighted ranking (`SA-outcome-weighted-ranking`), proxy-only, needs a net-new execution-success emitter. Follow-on packet (roadmap §7, synthesis 04).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts` | Modify | Add Beta-posterior lane signal + asymmetric/sign-locked deltas (`:176`, `:200-201`), content-addressed fold over the JSONL (`:241-251`), cold-start neutral prior replacing the exclude-on-low-sample path (`:193-197`) |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/` (new `beta-reliability.ts` or shared module) | Create | Shared f64 Beta-posterior primitive + advisor adapter |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts` | Modify | Decay/un-promotion revert path + audit tags on the shadow-weight channel (`:71-74`, `:8-13`) |
| `.opencode/skills/system-skill-advisor/mcp_server/` (new promoter script, out-of-process) | Create | The C4-seam: read estimator JSONL proposal → two-gate + held-out validation → write `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` var/file → daemon reload trigger, cron/maintenance only |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/__tests__/` (or sibling test dir) | Create | Beta math + gate + fold + guardrail unit tests, baseline-capture harness |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **Phase-0 baseline + lane-health signal** (`SA-asymmetric-deltas` sibling foundation) | A per-lane runtime score-presence signal exists in `laneSignals` (distinguishes runtime-degraded-empty from matched-nothing-empty), a captured before-state baseline of the estimator/proposal output is recorded in `scratch/` BEFORE any delta-shape change (no leverage number quoted without it, the asserted "~13%" is unsourced, grep=0, [CONFIRMED] iter-17 J7) |
| REQ-002 | **SA-asymmetric-deltas** (the clean off-path FIX) | A NEW asymmetric helper is added at the sign-locked threshold-delta seam `feedback-calibration.ts:200-201` (NOT the symmetric weight `clamp` at `:176`, which is provably symmetric, corrected iter-17/16), corrections sink weight ≥ acceptances raise it (down≥up), gain settable to 0 (decay-only), never-ratcheted sink-only cap, the shared `clamp()` is NOT mutated |
| REQ-003 | **C4-seam** (estimator proposal → shadow-weight registry) | An out-of-process promoter reads the estimator's `ReadOnlyScorerCalibrationProposal` from the feedback-calibration JSONL (`feedback-calibration.ts:222-238,241-251`) and writes the shadow-weight channel (`SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` → `RESOLVED_SHADOW_WEIGHTS`, `lane-registry.ts:71-74`), it runs cron/maintenance only (NEVER a prompt-time hook), a daemon reload trigger is wired (module-load resolution implies restart-only, open question Q-002) |
| REQ-004 | **Shadow-only guardrails preserved** | `defaultOff:true, shadowOnly:true, liveWeightsFrozen:true, autoPromotion:false, heldOutValidationRequired:true` (`feedback-calibration.ts:230-237`) remain TRUE through the whole build, a unit test asserts the C4-seam physically cannot write a LIVE lane weight |
| REQ-005 | **Beta-posterior primitive (shared with Deep-Loop D2)** | A shared f64 primitive computes `(α₀+s)/(α₀+β₀+s+f)` with cold-start neutral 0.5 and a count floor, it is built as one math module + a thin advisor adapter (the advisor consumes the posterior as a weight-delta, NOT a multiplier), it does NOT reuse the live integer scorer `deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` (`computeScore`, `:13-25`) which `throw`s `RangeError` on non-integer inputs (`:14-15`) the fractional posterior needs ([CONFIRMED], read live, the file is 44 lines, the synthesis `:182-191` citation is stale) |
| REQ-006 | **SA-two-gate-promotion** | Promotion requires k≥2 distinct attesters AND posterior≥threshold, as a non-trading conjunction (neither gate compensates the other), the substrate REFUSES a policy whose `kMin` can never reach `stopThreshold` (reachability validation), refusal leaves the lane at frozen defaults, it EXTENDS the existing `minSamples`→`low_sample_excluded` + concentration guards (`feedback-calibration.ts:193-197`) rather than replacing them |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | **SA-heldout-attestation-gate** | Distinct-source corroboration before any (shadow) flip: one vote per source, the posterior cannot be pushed to certainty by count, a distinct-author guard prevents a producer voting up its own reliability, this finally backs the dangling `heldOutValidationRequired` flag (`feedback-calibration.ts:235`) using the held-out partition of the MAX_RECORDS=50 ring buffer (`:251`) as the validation data already collected |
| REQ-008 | **SA-content-addressed-fold** | The append-only feedback JSONL is the source of truth and the cache is derived, folding is order-independent (Beta α/β increments commute, already true for `countOutcomes`, iter-13), events are content-addressed so replay/double-delivery folds to the same number with no read-modify-write race, this is the determinism hardening C4 needs before any live consideration (`feedback-calibration.ts:241-251`) |
| REQ-009 | **SA-cold-start-neutral-prior** | An unscored contributor emits the uninformative 0.5 (moves the posterior toward neither pole) so cold start promotes nothing, prior default Beta(1,1), this replaces the EXCLUDE-on-low-sample behavior (`feedback-calibration.ts:193-197` excludes rather than feeding a neutral prior). NEEDS-BENCHMARK: must show the continuous prior beats the existing `low_sample_excluded` cliff before it is preferred (iter-10) |
| REQ-010 | **SA-decay-un-promotion** | Promotion is reversible: decayed support demotes a (shadow-) promoted lane weight, the stable lane id re-promotes on regained support, audit tags keep "support went bad" distinct from "lost support". Gated on the C4-seam apply-path existing first (no revert path today, `lane-registry.ts:8-13`, `liveWeightsFrozen:true`), presupposes a live-write path it must NOT itself enable (stays shadow). |
| REQ-011 | **Promotion-to-live NO-GO gate** | The whole build ships SHADOW-ONLY, a documented promotion gate states that no live flip happens until a micro-benchmark proves the Beta posterior out-earns the `minSamples` cliff, the NO-GO is recorded in `decision-record.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The estimator→registry loop closes, a promoter reads the proposal and writes the shadow-weight channel, while `liveWeightsFrozen`/`autoPromotion`/`shadowOnly` stay TRUE and a test proves no live weight can move.
- **SC-002**: A shared Beta-posterior f64 primitive (cold-start 0.5, anti-flood, commuting folds) exists with passing unit tests for commutativity, cold-start neutrality, count-flooding immunity and replay/double-delivery idempotence. It is independent of the integer scorer that throws on fractional inputs.
- **SC-003**: The two-gate promotion (k≥2 AND posterior, non-trading, reachability-refusal) + held-out attestation + asymmetric/sign-locked deltas are implemented and unit-tested, a captured baseline exists and a documented promotion-to-live NO-GO gate (micro-benchmark required) is recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase-0 lane-health signal (REQ-001) | A naive elision/attribution over-credits non-matching skills (skew OPPOSITE the bug) without it, [CONFIRMED] iter-14 G14-03, iter-16 J16-01 | Build the per-lane runtime score-presence signal first, elide/attribute only runtime-degraded lanes, not zero-match |
| Dependency | Shared Beta primitive co-owned with Deep-Loop D2 | Divergent forks if built twice | Build ONE f64 primitive + thin per-consumer adapters (synthesis 04 RC6), the advisor adapter consumes a weight-delta, D2 a posterior |
| Dependency | `laneAttributionBySkill` is empty in production | Even a correct posterior has no per-lane signal to tune | 027 shipped no lane attribution, net-new attribution is required before live tuning, keep shadow-only until it exists |
| Dependency | Daemon shadow-weight reload | Module-load resolution implies restart-only, promoter writes may not take effect | Open question Q-002: confirm `advisor_rebuild` reloads `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` or wire an explicit reload trigger |
| Risk | Quoting the unsourced "~13% confidence skew" | Fails the regression-baseline rule (grep=0, [CONFIRMED] iter-17) | Capture a real baseline in `scratch/` first, never cite the 13% |
| Risk | Treating C4 as a "graduation" | Ships nothing (no Beta math exists) | This is a BUILD from scratch (prior + volume-discount + posterior-gate), the live estimator is raw-frequency (`feedback-calibration.ts:176`) |
| Risk | A shadow bug leaking to live routing | Corrupts skill recommendations | The shadow lane is non-live (`liveWeightsFrozen:true`), a guardrail test (REQ-004) asserts no live write is reachable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The C4-seam promoter runs out-of-process on a cron/maintenance cadence, it MUST NOT add latency to the prompt-time advisor recommend path (never a prompt-time hook).

### Security
- **NFR-S01**: The promoter cannot write a LIVE lane weight, it may only write the shadow-weight channel. A distinct-author guard prevents a producer attesting up its own reliability (held-out gate, REQ-007).

### Reliability
- **NFR-R01**: Folding the feedback JSONL is replay-safe and order-independent (REQ-008): replay or double-delivery of an event folds to the same posterior with no read-modify-write race.

---

## 8. EDGE CASES

### Data Boundaries
- Empty feedback log: cold-start neutral prior (0.5) yields no proposed delta, promotes nothing (REQ-009).
- Below `minSamples` / concentrated samples: the existing exclude path holds, two-gate refuses, lane stays at frozen defaults.
- `laneAttributionBySkill` empty (production today): per-lane signal collapses to workspace totals, no per-lane tuning, stays shadow.

### Error Scenarios
- Unreachable policy (`kMin` can never reach `stopThreshold`): the substrate REFUSES the policy (reachability validation, REQ-006) rather than silently never-promoting.
- Decayed support after a shadow promotion: reversible demotion via stable lane id, audit tag separates "support went bad" from "lost support" (REQ-010).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: ~5 (estimator, new primitive, lane-registry, new promoter, tests), net-new math + out-of-process seam + gate family |
| Risk | 18/25 | Auth: N, API: N, Breaking: N (shadow-only), but a shadow→live leak risk and a shared-infra coupling with Deep-Loop D2 |
| Research | 16/20 | Heavy external mining (aionforge attestation-and-promotion + trust-model), Beta math design, baseline capture |
| Multi-Agent | 8/15 | Co-owned shared primitive (D2), otherwise single-stream |
| Coordination | 10/15 | Phase-0 → seam → posterior → gate sequencing, D2 co-build |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Shadow weight bug leaks into live routing | H | L | `liveWeightsFrozen:true` + guardrail test (REQ-004), shadow lane non-live |
| R-002 | Beta primitive forks from Deep-Loop D2's | M | M | One f64 module + thin adapters, co-own the build (synthesis 04 RC6) |
| R-003 | Cold-start prior never beats the `minSamples` cliff | M | M | NEEDS-BENCHMARK gate (REQ-009), keep the cliff until measured |
| R-004 | Quoting the unsourced 13% skew | M | M | Capture baseline first, the number is asserted, grep=0 (iter-17) |
| R-005 | Daemon never reloads the new shadow weights | M | M | Q-002: confirm reload path or wire explicit trigger |

---

## 11. USER STORIES

### US-001: Close the disconnected learning loop (Priority: P0)

**As a** Skill Advisor maintainer, **I want** the estimator's calibration proposal to actually reach the shadow-weight registry, **so that** the shadow learning pipeline is a real loop instead of a write-only log.

**Acceptance Criteria**:
1. Given the estimator has written a `ReadOnlyScorerCalibrationProposal` to the feedback-calibration JSONL, When the out-of-process promoter runs on its cron cadence, Then it reads the proposal and writes the shadow-weight channel, and no live lane weight changes.

### US-002: Flood-immune reliability (Priority: P0)

**As a** Skill Advisor maintainer, **I want** lane reliability computed as a bounded Beta posterior, **so that** a lane can never be pushed to certainty by sheer sample count and a cold-start lane promotes nothing.

**Acceptance Criteria**:
1. Given 8 all-accepted samples vs 10,000 all-accepted samples, When the posterior is computed, Then the high-volume case is NOT identical to the low-volume case (unlike today's `minSamples` cliff), and an unscored lane returns the neutral 0.5.

### US-003: Conservative, reversible, shadow-only promotion (Priority: P1)

**As a** Skill Advisor maintainer, **I want** a two-gate promotion with held-out attestation and reversible decay, **so that** a shadow weight only ever moves under distinct-source corroboration and can be demoted when support decays, with a hard NO-GO on going live until a benchmark earns it.

**Acceptance Criteria**:
1. Given a proposal that passes posterior≥threshold but has only k=1 attester, When the two-gate evaluates it, Then it does NOT promote (non-trading conjunction), and given a policy whose kMin can't reach the threshold, the substrate refuses the policy.

---

## 12. OPEN QUESTIONS

- Q-001: Does the shadow-delta sink already partition records by query-class (could QCR buckets be reused as the distinct-source dimension for held-out attestation)? (iter-7)
- Q-002: Does the warm advisor daemon reload `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` on `advisor_rebuild`, or only on full restart? Module-load resolution (`lane-registry.ts:67-74`) implies restart-only → the promoter needs an explicit reload trigger. (iter-10)
- Q-003: Should un-promotion gate on the same posterior as promotion (aionforge mirrors promotion/demotion), or use a separate decay threshold? (iter-7)
- Q-004: What exact Beta prior (α₀, β₀) and held-out thresholds does the advisor adapter use, vs the Deep-Loop D2 adapter? (roadmap Provenance open item)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent research**: `../research/research.md`, `../research/iterations/iteration-007.md` (the gate family), `iteration-010.md` (C4-seam GO), `iteration-014.md` (no Beta math), `iteration-016.md` (build sequence + D2 sharing), `iteration-017.md` (13% unsourced).
- **Roadmap**: `../../research/roadmap.md` (spine 5 Bounded Reliability-Weighted Learning + BROADENING §2/§4), synthesis `../../research/synthesis/{01,03,04}`.

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
