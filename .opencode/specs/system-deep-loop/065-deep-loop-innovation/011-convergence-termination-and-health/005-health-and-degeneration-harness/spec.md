---
title: "Feature Specification: Health & Degeneration Harness (008 phase 005)"
description: "Plan a generic, mode-agnostic health and degeneration harness that turns mode collapse, repetition, novelty starvation, quality decay, budget thrash, and unusable telemetry into typed signals and bounded pause, re-seed, or stop requests without taking stop authority."
trigger_phrases:
  - "deep-loop health degeneration harness"
  - "mode collapse health signals"
  - "generic loop degeneration monitor"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
    last_updated_at: "2026-07-15T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the generic health and degeneration signal contract"
    next_safe_action: "Implement shadow health observations and action-request fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Health & Degeneration Harness

> Phase adjacency under the convergence-termination-and-health parent (navigation order, not a runtime dependency): predecessor `004-value-of-computation-allocation`; successor none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Fifth and final child of phase 008; the phase parent assigns the generic cross-mode degeneration safety net here |
| **Child depends_on** | `[]` |
| **Inputs** | Sibling cycle detection, phase-007 transactional gauges, run-2 mode research, and the phase-008 manifest |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped convergence anchor is council-specific and evaluates a point-in-time snapshot. It can report agreement,
dissent, evidence depth, disagreement, confidence, and explicit blockers, but it does not provide a shared answer to the
more basic operational question: is the loop still producing healthy, decision-relevant work? A loop can satisfy a local
threshold while its outputs collapse onto one semantic region, revisit the same state, stop finding independent evidence,
lose quality across successive attempts, or spend its budget on retries and reallocations that do not improve the durable
evidence state.

The phase-008 parent therefore assigns a generic health and degeneration harness to the final child. The harness must work
across deep-research, deep-review, deep-ai-council, deep-improvement and its benchmark variants, and deep-alignment without
embedding any mode's prose, evaluator, or stop policy. It consumes typed observations at an authorized ledger boundary,
including phase-007 semantic-community, novelty, claim, continuity, projection, and gauge outputs; sibling 002 cycle
events; durable fan-in and result receipts; value-of-computation decisions; and typed budget settlement. It converts those
inputs into replayable health observations and typed signals for the shared control plane.

Run-2 found that the defensible moat is longitudinal and falsifiable evidence rather than more output per pass. The research
contract describes living claim-evidence ledgers, proof-carrying findings, measured independence, frozen rulers, causal
trials, and receipts/certificates rather than terminal prose or aggregate scores
(`.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`).
That finding makes degeneration a cross-mode concern: repeated or low-quality output must be identified against durable
claims, coverage, evidence, and cost, not against text similarity or an iteration counter alone.

This phase plans a non-authoritative monitor. It does not reimplement cycle detection, redefine phase-007 gauges, authorize
dispatch, mutate claims, or unconditionally stop a run. Sibling 002 owns repeated-state detection and emits
`cycle_suspected`, `cycle_confirmed`, and `cycle_cleared`; the harness normalizes those events into health state. The
stopping-clock child owns stop arbitration. The harness can raise a typed pause, re-seed, or stop-request signal, while the
transition gateway and the stopping contract decide whether an action is authorized.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned `HealthObservation` at each eligible completed-attempt or durable state boundary, bound to run, mode,
  lineage/region, ledger cursor, projection watermark, input digests, and observation policy.
- A typed health-signal vocabulary covering `mode_collapse`, `repetition`, `novelty_starvation`, `quality_decay`,
  `budget_thrash`, `telemetry_gap`, `health_recovered`, and `not_evaluable` outcomes.
- Mode-neutral input adapters for semantic-community concentration, novelty and independent-evidence yield, path/community
  coverage, claim lifecycle progress, quality scores with calibration provenance, cycle events, allocation outcomes, typed
  budget receipts, retry/cancellation/lease activity, fan-in results, projection freshness, and reducer/version integrity.
- A policy-defined threshold set with observation windows, minimum sample counts, severity bands, hysteresis, cooldown,
  signal deduplication, and per-signal evidence requirements. Initial shadow defaults are explicit and versioned; calibration
  may mint a policy version but cannot turn missing data into healthy data.
- Mode-collapse detection that combines semantic-community concentration or output fingerprint concentration with a low
  novelty/progress gauge, rather than treating repeated words or a single similar answer as collapse.
- Repetition ingestion from sibling `002-cycle-detection`: suspected cycles remain warnings, confirmed cycles become a
  stronger degeneration input, and clearing evidence removes only the active contribution without deleting history.
- Novelty-starvation detection that distinguishes no new independent evidence from a legitimately exhausted or blocked
  frontier, using eligible-work and phase-007 coverage/novelty evidence.
- Quality-decay detection over normalized, mode-adapted quality observations with evaluator, rubric, judge, or verifier
  digests; the shared harness compares typed quality evidence and never invents a quality score.
- Budget-thrash detection over typed reservation, settlement, retry, cancellation, lease, and reallocation events, tied to
  realized evidence yield and preserving the distinction between budget exhaustion and convergence.
- A typed response-action vocabulary for `observe`, `pause_region`, `pause_mode`, `reseed_frontier`, `quarantine_candidate`,
  `request_stop`, and `repair_telemetry`, with reason, severity, evidence, policy, and authorization state.
- Additive-dark shadow comparison beside legacy convergence and allocation behavior; no current mode stop or dispatch
  decision changes in this phase.
- Fixtures for healthy progress, productive revisitation, fixed points, semantic collapse, novelty starvation, quality decay,
  budget thrash, simultaneous signals, recovery with hysteresis, stale inputs, version mismatch, resume, replay, and action
  idempotency.

### Out of Scope
- Reimplementing focus, claim-frontier, or composite cycle detection owned by
  `011-convergence-termination-and-health/002-cycle-detection`; the harness consumes its typed events.
- Defining path-covering termination, stopping-clock arbitration, or the value-of-computation scoring/allocation policy
  owned by the other phase-008 children.
- Redefining phase-007 semantic communities, claim continuity, novelty arithmetic, transactional projection boundaries, or
  gauge reducer ownership. The phase-007 gauges contract remains the source of those values
  (`010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges/spec.md`).
- Supplying a universal model-based quality judge, comparing raw scores across modes, or promoting a mode because a scalar
  quality value improved.
- Treating output count, iteration count, provider count, seat count, text overlap, or budget denial as sufficient evidence
  of health or convergence.
- Mutating or deleting ledger events, claims, projections, receipts, budget records, cycle history, or completed artifacts.
- Making a health signal an unconditional stop, silently canceling work, bypassing typed-budget admission, or moving
  authority before shadow parity and the later cutover contract.
- Migrating historical packets or selecting mode-specific threshold values outside the shared policy and adapter contracts.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Health observations are canonical and replayable | Each observation names run/mode/lineage, ledger cursor, projection watermark, input digests, policy version, adapter versions, and an idempotency identity; incremental execution and replay produce the same observation hash |
| REQ-002 | The signal vocabulary is typed and mode-agnostic | Signals use the shared kinds `mode_collapse`, `repetition`, `novelty_starvation`, `quality_decay`, `budget_thrash`, `telemetry_gap`, `health_recovered`, and `not_evaluable` with severity, status, evidence, and source provenance |
| REQ-003 | Mode collapse requires concentration plus absent progress | A collapse candidate needs policy-qualified semantic/fingerprint concentration and a novelty, independent-evidence, coverage, or claim-progress floor violation; text similarity alone cannot emit a confirmed signal |
| REQ-004 | Cycle evidence remains owned by sibling 002 | `cycle_suspected`, `cycle_confirmed`, and `cycle_cleared` are consumed with their cursors, fingerprints, periods, progress verdicts, and policy versions; the harness does not create a second cycle detector |
| REQ-005 | Novelty starvation is distinct from an exhausted frontier | The detector requires repeated low independent-evidence yield while eligible work remains, or emits `not_evaluable` when the frontier/eligibility state is unavailable; no empty result is treated as healthy |
| REQ-006 | Quality decay is evidence-backed and calibrated | A mode adapter supplies normalized quality observations plus evaluator/rubric/verifier provenance; the harness detects a policy-defined rolling decline against a sealed or declared baseline and rejects incomparable or stale values |
| REQ-007 | Budget thrash uses typed cost and realized yield | Retry, cancellation, lease, denial, and reallocation pressure is evaluated per cost dimension and against settled evidence yield; budget exhaustion remains `budget_exhausted` or incomplete, never convergence |
| REQ-008 | Thresholds are explicit, bounded, and versioned | Observation windows, minimum samples, floors, concentration limits, decay deltas, thrash ratios, severity mapping, hysteresis, cooldown, and policy digest are recorded; unsupported policy versions fail closed |
| REQ-009 | Signals include sufficient audit evidence | Every signal carries source event IDs/cursors, input gauges, threshold comparisons, missing-data verdicts, policy and adapter digests, prior active signal, and a deterministic trace of the decision |
| REQ-010 | Responses are typed requests, not hidden authority | Pause, re-seed, quarantine, telemetry-repair, and stop requests include requested scope and authorization state; a request cannot dispatch, cancel, or stop without the shared gateway/control contract |
| REQ-011 | Recovery has hysteresis and preserves history | Qualifying progress can clear an active signal only after the configured healthy window; clearing is a new event and does not rewrite the signal that caused the degradation |
| REQ-012 | Health remains additive-dark and cross-mode neutral | Shadow outputs are observable beside legacy behavior, no current stop/dispatch decision changes, and all mode-specific fields arrive through registered adapters |
| REQ-013 | Insufficient or inconsistent inputs fail closed | Missing gauges, stale watermarks, sequence gaps, conflicting event hashes, unknown reducer/adapter versions, non-monotonic cursors, or mixed baselines emit `telemetry_gap`/`not_evaluable` or a typed error, never `healthy` |
| REQ-014 | Simultaneous signals have deterministic aggregation | Multiple active signals retain individual evidence and resolve to a versioned aggregate health state using severity ordering, scope precedence, and stable tie-breaking |
| REQ-015 | The harness is bounded and idempotent | History, active-signal state, trace payloads, and deduplication records have explicit retention/size limits; duplicate boundary delivery produces one observation and one signal identity |
| REQ-016 | Source traceability is preserved | The implementation and verifier contract cite sibling 002, the phase-007 gauges spec, `research-modes.md`, the phase-008 parent, and `manifest/phase-tree.json` |

### Health signal, threshold, and response contract

The harness reads one authorized prefix and one coherent projection watermark for each observation. The initial shadow policy
uses an eight-observation health window and requires at least four comparable observations before a quality or concentration
classification. A provisional collapse candidate requires at least six of the latest eight outputs in one registered
semantic community or canonical output fingerprint plus a below-floor novelty/progress result. Novelty starvation requires at
least four low-independent-evidence results in the latest six eligible attempts while the eligible frontier remains non-empty.
Quality decay requires a normalized quality lower-confidence bound to fall by at least 0.10 from the declared baseline across
three comparable observations. Budget thrash requires at least three retry/cancel/reallocation events in eight decisions or
at least 30 percent of attempts consumed by retry pressure, and also requires evidence yield to remain below the policy floor.
These values are shadow defaults, not hidden constants: every comparison records them in the policy digest, and calibration may
replace them only by minting a new policy version with fixture evidence.

The detector applies two consecutive healthy windows before clearing a warning or degraded state. A confirmed repetition from
sibling 002, a simultaneous quality-decay and novelty-starvation signal, or a telemetry gap at the required watermark may
escalate immediately to the higher configured severity. A data gap never clears through elapsed time. The policy records
cooldown and deduplication keys so a persistent fault does not flood the ledger while each materially new evidence boundary
remains auditable.

| Signal | Required evidence | Default severity | Allowed request |
|--------|-------------------|------------------|-----------------|
| `mode_collapse` | Concentration threshold plus novelty/progress floor violation | `degraded`, then `critical` if persistent | `pause_region`, `reseed_frontier`, or `request_stop` after aggregate arbitration |
| `repetition` | Sibling 002 cycle event with period, fingerprints, cursors, and progress verdict | `warning` for suspected, `degraded` for confirmed | `pause_region` or `reseed_frontier`; stop only through stopping clocks |
| `novelty_starvation` | Low independent-evidence yield plus eligible frontier evidence | `degraded` | `reseed_frontier`, `pause_mode`, or `request_stop` after arbitration |
| `quality_decay` | Comparable normalized quality decline with evaluator/verifier provenance | `degraded` | `quarantine_candidate`, `pause_mode`, or `reseed_frontier` |
| `budget_thrash` | Typed retry/cancel/reallocation pressure plus low realized yield | `degraded` | `pause_mode`, `repair_telemetry`, or `request_stop` after budget settlement |
| `telemetry_gap` | Missing, stale, conflicting, or unsupported required input | `critical` for required control input | `repair_telemetry` and `pause_mode`; never `healthy` |
| `health_recovered` | Two healthy windows with coherent inputs and qualifying progress | `info` | `observe` and release a bounded pause request through authorization |
| `not_evaluable` | Insufficient sample, frontier, baseline, or version compatibility | `warning` | `observe` or `repair_telemetry`; no positive health claim |

An action request carries the aggregate health state, signal IDs, requested scope, safe-point requirement, re-seed source or
frontier reference where applicable, budget/lease handling instruction, and a transition-authorization result. `request_stop`
is a typed candidate for the stopping-clock contract, not a direct stop. `reseed_frontier` must point to a durable uncovered
path, unresolved claim/contradiction, or policy-authorized alternative region; it may not synthesize a text prompt or erase the
current lineage. `pause_mode` and `pause_region` preserve in-flight state and wait for an authorized safe point.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Healthy progress, productive revisitation, and independent evidence do not trigger confirmed collapse,
  starvation, or repetition, while the corresponding degeneration fixtures produce the expected typed signals.
- **SC-002**: Fixed points and repeated sequences are represented by sibling 002 cycle events; the harness consumes their
  evidence and does not produce a competing cycle interpretation.
- **SC-003**: Every signal and aggregate health state is replay-stable, idempotent, bounded, and traceable to one coherent
  ledger/projection watermark, versioned policy, adapter digest, and threshold comparison.
- **SC-004**: Quality decay and budget thrash are detected only from typed, comparable evidence; budget exhaustion and missing
  telemetry are never relabeled as convergence or health.
- **SC-005**: Pause, re-seed, quarantine, repair, and stop requests are explicit non-authoritative events that preserve the
  append-only history and require the shared authorization or stopping-clock contract before action.
- **SC-006**: Two healthy windows clear an active signal deterministically, while persistent or simultaneous degeneration
  escalates according to a versioned severity policy without event flooding.
- **SC-007**: Shadow comparison shows the harness can observe degeneration across every registered mode adapter without changing
  legacy stop, fan-in, allocation, budget, or dispatch behavior.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has `depends_on: []` as an independent planning contract; implementation composes the authorized event ledger,
receipts and typed budgets, durable fan-in, phase-007 projections/gauges, sibling 002 cycle events, sibling 003 stopping
clocks, and sibling 004 value-of-computation decisions. The phase manifest places the child after fan-in and novelty/claims
because those systems supply stable identities and durable evidence, even though the planning packet itself carries no hard
sibling dependency.

The principal risk is false collapse: a mode may legitimately revisit one community while resolving a contradiction or
strengthening a claim. The mitigation is the phase-007 progress and independent-evidence input, the sibling cycle progress
gate, explicit minimum samples, and healthy-window hysteresis. The opposite risk is false health caused by output volume,
provider/seat count, or an unvalidated mode adapter; only registered typed evidence and coherent watermarks are admissible.

Additional risks are incomparable quality scales, threshold gaming against visible policy, budget thrash caused by allocator
oscillation, action storms from persistent signals, stale projections, partial replay, and accidental authority creep. The
mitigations are normalized adapter contracts with provenance, versioned policy digests, bounded cooldown and deduplication,
typed budget settlement, fail-closed data-gap states, deterministic aggregation, additive-dark operation, and a separate
authorization boundary for every response action. A rollback disables the health consumer and action requests while retaining
the append-only evidence for diagnosis.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must freeze the semantic-community concentration basis, the normalized quality
adapter contract, the exact independent-evidence and progress floors, the retry/cancellation cost ratio, severity escalation,
cooldown, retention, and the stopping-clock weight for `request_stop` against shadow fixtures. Those choices may mint a new
health-policy version; they cannot make missing data healthy, merge unlike budget units, duplicate sibling cycle detection, or
turn a health event into direct stop or dispatch authority.
<!-- /ANCHOR:questions -->
