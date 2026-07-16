---
title: "Feature Specification: Value-of-Computation Allocation"
description: "Plan replay-stable value-of-computation scoring and adaptive allocation that directs remaining typed budget toward regions and modes with the highest expected marginal evidence value."
trigger_phrases:
  - "value of computation allocation"
  - "adaptive deep-loop allocation"
  - "marginal evidence value"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
    last_updated_at: "2026-07-15T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned VOC scoring, adaptive allocation, fairness, and decision evidence"
    next_safe_action: "Implement replay-stable VOC allocation behind typed budget admission"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Value-of-Computation Allocation

> Phase adjacency under the convergence-termination-and-health parent (navigation order, not a runtime dependency): predecessor `003-stopping-clocks`; successor `005-health-and-degeneration-harness`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Fourth child of the phase-011 convergence, termination, and health parent |
| **Depends on** | None (`[]`) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The convergence program can know that work remains without knowing where the next unit of computation is most likely
to pay off. Uniform iteration limits and flat fan-out spend the same opportunity on a nearly saturated region as on an
uncovered path, an unresolved contradiction, or a mode whose next result could remove a stopping blocker. Static
allocation therefore wastes scarce computation, while a naive highest-score rule can starve uncertain or newly opened
regions before they have enough observations to demonstrate value.

This phase plans a value-of-computation (VOC) allocator that estimates the expected marginal evidence gain of one
additional allocation quantum for each eligible region and mode. Benefit is expressed as expected new weighted
coverage, expected contradiction resolution, expected blocker reduction, and uncertainty reduction. Cost remains a
typed envelope of tokens, fixed-precision money, iteration attempts, and monotonic wall time. The allocator derives a
dimensionless pressure for each cost dimension relative to that dimension's authorized remainder, ranks benefit
against the greatest governing pressure, and never adds or substitutes unlike budget units. Scores carry uncertainty,
calibration provenance, an evidence cut, and a policy digest; they are estimates for scheduling, not claims of
convergence.

The run-2 findings motivate this control loop directly: research-plan nodes carry budgets, draft-to-gap passes enqueue
the highest-value gap, evaluation work spends budget on maximally informative items, real usage and cost flow through
selection, and successive halving eliminates weak candidates before expensive scoring. This phase generalizes those
mode-level findings into a shared, replay-stable allocation contract. The phase-007 hierarchical budget authority
remains the sole admission and settlement authority. The phase-009 conditional fan-in contract consumes the resulting
usefulness assessment when deciding whether another result is worth awaiting; the allocator cannot bypass admission,
change fan-in stop taxonomy, or rewrite a frozen reducer input.

Sources: `.opencode/specs/system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md`;
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin/spec.md`;
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`;
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned `VocAssessment` for one region/mode and allocation quantum, bound to stable candidate identity, event-sequence cut, evidence snapshot, estimator version, and policy digest.
- A marginal-benefit model covering expected weighted coverage gain, contradiction-resolution probability and impact, stopping-blocker reduction, uncertainty reduction, and diminishing returns.
- A typed marginal-cost envelope for tokens, fixed-precision monetary cost with pricing digest, iteration attempts, and monotonic wall time, obtained from the phase-007 budget and receipt contracts.
- Dimensionless per-type pressure ratios derived within each budget dimension; the governing pressure is selected without cross-unit arithmetic or implicit conversion.
- Explicit confidence and calibration fields, including sample count, uncertainty interval or band, prior source, observed-versus-predicted value, and stale-estimate handling.
- Versioned greedy and proportional allocation policies with deterministic tie-breaking, allocation quanta, mode/region ceilings, and a recorded policy choice.
- Fairness and starvation controls: bounded exploration reserve, minimum eligible-service floor, capped aging credit, maximum consecutive skips, and per-mode/region share ceilings.
- A fail-closed eligibility gate that excludes candidates lacking a complete typed-budget reservation, durable identity, valid estimate, current policy, or conditional-fan-in eligibility.
- Re-estimation after durable evidence, contradiction, coverage, fan-in, budget-settlement, or health events; mutable arrival order and current wall-clock time are never replay inputs.
- Ledgered assessment and allocation-decision events that record every candidate, exclusion reason, score component, fairness adjustment, selected quantum, budget reference, and fan-in handoff.
- Additive-dark shadow comparison against uniform/static allocation before any authority cutover.

### Out of Scope
- Implementing or changing the phase-007 budget hierarchy, unit types, reservation, settlement, pricing, exhaustion, ancestor, or reconciliation rules.
- Implementing the phase-009 fan-in state machine, sufficiency thresholds, partial-failure policy, cancellation, salvage, or reducer-input finalization.
- Defining path coverage, novelty communities, contradiction identity, stopping clocks, or health/degeneration signals owned by the other phase-011 and upstream children.
- Treating a high VOC score as permission to dispatch, treating a low score as proof of convergence, or treating budget denial as successful termination.
- Collapsing typed costs into an untyped currency, learning policy from unledgered outcomes, or allowing fairness credits to create capacity.
- Moving runtime authority, migrating in-flight packets, or retiring uniform/static scheduling before later shadow-parity and cutover gates.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Assess one explicit marginal allocation quantum | Every score identifies the candidate region/mode, proposed quantum, event cut, evidence inputs, estimator version, and expiry/staleness rule |
| REQ-002 | Estimate evidence value rather than raw output volume | Benefit separately records expected weighted coverage, contradiction resolution, blocker reduction, uncertainty reduction, and diminishing-return adjustment |
| REQ-003 | Preserve typed cost semantics | Token, money, attempt, and monotonic-time estimates stay distinct; only same-dimension pressure ratios are formed and no unit substitutes for another |
| REQ-004 | Gate allocation through the budget authority | Selection becomes dispatchable only after one complete atomic reservation succeeds across every required dimension and ancestor; denial leaves no partial allocation |
| REQ-005 | Make estimates uncertainty- and calibration-aware | Scores retain confidence, sample count, prior source, calibration version, and observed-versus-predicted feedback; stale or malformed estimates are excluded or explicitly exploratory |
| REQ-006 | Support deterministic greedy allocation | Greedy policy selects the highest eligible adjusted VOC with a stable tie-break and recorded candidate ordering |
| REQ-007 | Support deterministic proportional allocation | Proportional policy distributes integer quanta from normalized eligible weights with deterministic rounding and an exact remainder rule |
| REQ-008 | Bound fairness without defeating value or safety | Exploration reserve, aging, minimum service, skip limits, and share caps are policy-bounded; none bypasses positive-value, health, fan-in, or typed-budget eligibility |
| REQ-009 | Prevent starvation of uncertain but eligible work | A cold-start prior and capped exploration path give unseen regions a bounded chance to produce calibration evidence; repeated selection remains subject to share ceilings |
| REQ-010 | Reallocate from durable state transitions | Coverage, contradiction, blocker, result, fan-in, budget-settlement, and health events may trigger a new decision; wall-clock arrival order alone does not |
| REQ-011 | Record complete allocation evidence | One decision event retains candidate assessments, exclusions, raw and adjusted scores, fairness interventions, policy digest, budget snapshot/reservation, selected quanta, and replay fingerprint |
| REQ-012 | Integrate with conditional fan-in without changing its authority | VOC populates the versioned usefulness slot for future eligible work; finalized fan-in decisions and frozen reducer-input digests remain immutable |
| REQ-013 | Keep budget exhaustion semantically distinct | Reservation denial or exhaustion records incomplete/budget-exhausted; it never records convergence, zero-cost success, or a synthetic low-VOC result |
| REQ-014 | Replay allocation deterministically | Replaying the same ordered events, policy, estimator/calibration versions, and budget snapshot produces identical eligibility, scores, ordering, quanta, and decision digest |
| REQ-015 | Preserve additive-dark migration discipline | VOC decisions first emit as non-authoritative shadow events with parity/value comparisons against the current allocation path |
| REQ-016 | Preserve source traceability | The implementation and verifier contract cite the typed-budget spec, conditional-fan-in spec, run-2 research synthesis, and program phase manifest |

### VOC assessment contract

| Component | Required representation | Fail-closed condition |
|-----------|-------------------------|-----------------------|
| Candidate | Stable run, mode, lineage/region, focus, and allocation-quantum identity | Identity is missing, ambiguous, superseded without linkage, or outside the active decision cut |
| Marginal benefit | Expected weighted coverage, contradiction resolution, blocker reduction, uncertainty reduction, diminishing-return factor | Required upstream signal is contradictory, non-replayable, or lacks the policy-declared fallback |
| Marginal cost | Typed token, monetary, attempt, and monotonic-time estimates plus pricing/estimator digests | A required type is absent, stale, negative, unit-invalid, or unreconciled |
| Budget pressure | One dimensionless ratio per required type, derived only against that type's authorized remainder; maximum ratio governs | Any ancestor snapshot is missing or a ratio cannot be derived without cross-unit conversion |
| Uncertainty | Confidence band, sample count, prior provenance, calibration epoch, and staleness bound | Confidence metadata is missing or the calibration epoch is incompatible with policy |
| Score | Expected benefit divided by governing dimensionless pressure, followed by bounded policy adjustments | Non-finite result, non-positive required benefit, or adjustment outside policy bounds |

### Allocation policy contract

| Policy | Selection rule | Fairness behavior |
|--------|----------------|-------------------|
| Greedy | Select the highest adjusted VOC one quantum at a time; re-evaluate after each durable state change | Capped aging and exploration credits enter before stable tie-breaking; per-candidate and per-mode ceilings prevent monopolization |
| Proportional | Allocate integer quanta from eligible adjusted-VOC weights; use deterministic largest-remainder rounding | A policy-bounded exploration share and minimum-service floor protect eligible cold-start work; ceilings redistribute excess deterministically |
| No eligible value | Select no work and record every exclusion or non-positive assessment | Fairness cannot manufacture positive value; the caller evaluates stopping, health, or incomplete status separately |
| Budget denial | Select no dispatchable work after the typed authority denies the complete reservation | Record incomplete/budget-exhausted and preserve the denied candidate assessment without relabeling it convergence |

### Allocation decision evidence

Each ledgered decision contains schema, policy, estimator, calibration, and pricing versions; decision, run, mode, region,
lineage, wave, and fan-in identities; the ordered event-sequence cut; candidate and excluded sets; raw benefit components;
typed cost estimates; per-type pressure ratios; raw and fairness-adjusted VOC; uncertainty and staleness; greedy or
proportional policy choice; deterministic tie-break or rounding trace; exploration, aging, skip, floor, and ceiling
effects; selected integer quanta; typed-budget snapshot, reservation, or denial references; conditional-fan-in
usefulness handoff; transition authorization; replay fingerprint; and observed-value links used for later calibration.
No assessment or decision mutates after finalization; a new event supersedes it explicitly.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every allocation is backed by a complete, uncertainty-aware VOC assessment for one explicit marginal quantum.
- **SC-002**: Greedy and proportional policies produce deterministic allocations and decision digests from the same replay inputs.
- **SC-003**: Higher expected evidence value receives more compute under equal typed pressure, while diminishing returns can redirect the next quantum.
- **SC-004**: Cold-start and minority regions receive bounded exploration opportunities without bypassing positive-value, health, fan-in, or budget gates.
- **SC-005**: No candidate is dispatched without phase-007 atomic admission across all required dimensions and ancestors.
- **SC-006**: Conditional fan-in consumes VOC usefulness for future work without changing stop taxonomy or any finalized reducer-input set.
- **SC-007**: Replay reconstructs candidate eligibility, score components, fairness adjustments, chosen quanta, and allocation digest exactly.
- **SC-008**: Shadow fixtures compare adaptive and uniform/static allocation by realized evidence gain, contradiction resolution, spend, and starvation outcomes without moving authority.

**Given** two eligible regions with equal typed pressure and one has greater expected weighted coverage gain, **When**
greedy allocation selects one quantum, **Then** it selects the higher-VOC region and records both assessments and the
stable tie-break inputs.

**Given** one repeatedly selected region and one eligible cold-start region, **When** the configured exploration and
share limits apply, **Then** the cold-start region receives at most the bounded exploratory quantum without allowing
fairness to bypass admission or a non-positive-value exclusion.

**Given** the highest-scoring candidate lacks capacity in any required budget dimension or ancestor, **When** the
allocator requests admission, **Then** no partial reservation or dispatch occurs and the decision records
incomplete/budget-exhausted rather than convergence.

**Given** a fan-in decision has frozen its reducer input, **When** a later VOC assessment favors an outstanding or
salvaged branch, **Then** the new assessment may influence a future authorized decision but cannot alter the frozen
input or its digest.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has `depends_on: []` as an independently authored sibling planning contract. Runtime integration consumes
the program phase-007 typed-budget authority, phase-009 durable result and conditional-fan-in contracts, phase-010
coverage/contradiction/continuity signals, and the phase-011 stopping and health siblings once their interfaces are
frozen. The predecessor and successor in the adjacency line are navigation references, not hard runtime dependencies.
The program manifest still places convergence and allocation after fan-in, novelty, and claims because those systems
supply the stable identities and evidence signals used by VOC.

The highest risk is Goodharting the score: a proxy such as raw novelty or output count can reward verbose, correlated,
or low-impact work. Other risks are false precision from sparse samples, starvation under greedy ranking, excessive
exploration under fairness rules, oscillation when estimates update after every result, incomparable costs disguised
as one scalar, stale budget or pricing snapshots, concurrent allocators selecting the same remainder, and a VOC result
silently changing fan-in or stop semantics. Verification therefore uses adversarial proxy fixtures, calibrated priors,
capped fairness, hysteresis/allocation quanta, typed pressure ratios, atomic reservations, event-cut concurrency tests,
and immutable fan-in decision assertions.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for this planning contract. Implementation may choose benefit weights, prior families, confidence-band
method, pressure aggregation, allocation quantum, greedy-versus-proportional default, exploration share, aging cap,
skip limit, share ceiling, hysteresis, and calibration window after upstream event and budget schemas are frozen.
Those choices may not merge budget units, dispatch without complete admission, let fairness manufacture value, classify
exhaustion as convergence, use unledgered wall-clock ordering, or mutate a finalized fan-in decision.
<!-- /ANCHOR:questions -->
