---
title: "Feature Specification: stopping clocks (006 phase 008 child 003)"
description: "Plan independent budget, novelty-decay, coverage, wall-time, and cycle clocks whose deterministic earliest firing terminates the loop and records a replayable, typed termination cause."
trigger_phrases:
  - "deep-loop stopping clocks"
  - "earliest-fire termination arbitration"
  - "budget novelty coverage wall-time stop"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
    last_updated_at: "2026-07-15T15:24:30Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned independent stopping-clock arbitration contract"
    next_safe_action: "Implement clock adapters, arbiter ordering, and termination-cause events"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Stopping Clocks

> Phase adjacency under the 008 parent (grouping order, not a runtime dependency): predecessor `002-cycle-detection`; successor `004-value-of-computation-allocation`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Third child of phase 008; the program manifest assigns independent stopping-clock arbitration to convergence, termination, and health |
| **Child depends_on** | `[]` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped council convergence evaluator makes one synchronous decision from fixed agreement, dissent, evidence-depth,
critical-disagreement, and confidence thresholds. It returns `STOP_BLOCKED`, `STOP_ALLOWED`, or `CONTINUE` from one snapshot
and can persist that snapshot, but it has no common representation for a resource ceiling, a decaying evidence tail, proven
path coverage, elapsed wall time, or a confirmed longitudinal cycle
(`.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs`). Callers therefore compose termination ad hoc: a
limit may end execution without the convergence record naming it, while a threshold-based stop can obscure whether the loop
actually covered its declared search space or merely ran out of resources.

The inputs now have independent owners. Phase 004 defines atomic, hierarchical token, cost, iteration, and wall-time budget
exhaustion without relabeling exhaustion as convergence
(`.opencode/specs/system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md`).
Phase 007 defines replayable concept-level novelty and evidence novelty, plus deterministic `noveltyDecayBps` inputs
(`.opencode/specs/system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities/spec.md`
and `.opencode/specs/system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics/spec.md`).
Sibling `001-path-covering-termination` defines a coverage certificate that distinguishes `STOP_ALLOWED` from
`INCOMPLETE_LIMIT`, while sibling `002-cycle-detection` emits typed suspected, confirmed, and cleared cycle events. The program
manifest places all of these inputs after durable fan-in and novelty/claims projections and before shared mode contracts
(`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`).

This phase plans the missing composition boundary: five independently evaluated clocks—budget exhaustion, novelty decay,
coverage reached, wall-time deadline, and cycle detection—publish typed candidates to one deterministic arbiter. The first
authorized firing stops new loop work. The arbiter records the primary firing clock, every same-boundary co-firing clock, the
input watermarks and policy versions, and a termination class that preserves whether the run converged, stagnated, cycled, or
ended incomplete from resource or time exhaustion. No aggregate score may mask an individual firing condition.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A common `StoppingClockObservation` contract with run lineage, clock kind, policy version, evaluation boundary, ledger cursor, monotonic elapsed duration, projection watermark, input fingerprint, state (`armed`, `fired`, `cleared`, or `not_evaluable`), condition trace, and candidate termination class.
- A **budget-exhaustion clock** that fires on the phase-004 budget authority's typed exhaustion or reservation-denial event for the next required operation. Inputs include governing scope chain, exhausted dimension, requested/reserved/committed/remaining values, receipt/reconciliation state, and budget-policy version. Token, cost, iteration, and budgeted wall-time remain distinct subcauses.
- A **novelty-decay clock** that applies a versioned deterministic exponential-tail fold to phase-007 concept novelty and independent-evidence yield. It fires only after the configured warm-up, observation window, patience count, and both per-mode floors are satisfied at one fresh projection watermark; paraphrases and duplicate evidence cannot reset it.
- A **coverage clock** that fires from sibling 001's replay-stable `STOP_ALLOWED` coverage certificate. It requires a frozen valid universe, fresh projections, all mandatory paths dispositioned, zero unresolved critical contradictions, and zero STOP blockers; a partial or `INCOMPLETE_LIMIT` certificate cannot fire this clock.
- A **wall-time clock** that fires when monotonic elapsed run time reaches an explicit per-mode hard deadline. It is independent of budget accounting: `wall_time_deadline` remains distinct from `budget_exhausted:wall_time`, even when both fire at one boundary.
- A **cycle clock** that consumes sibling 002's confirmed-cycle event at the configured severity/persistence policy. Suspected, stale, cleared, incomplete-history, or progress-broken cycles do not fire it.
- Deterministic earliest-fire composition over an authorized ledger prefix. The smallest effective elapsed time wins; candidates committed in the same evaluation batch use a versioned rank `budget > wall_time > cycle > novelty_decay > coverage`, while all co-firing causes remain recorded.
- A `LoopTerminationDeclared` ledger event containing primary cause, co-firing causes, termination class, mode/profile version, clock traces, source event IDs, ledger/projection watermarks, replay fingerprint, final coverage gaps, unresolved blockers, and last authorized dispatch/iteration identity.
- Per-mode `StoppingClockProfile` configuration for required clocks, shadow/authoritative state, novelty decay parameters, coverage-profile reference, cycle severity/persistence, hard deadline, evaluation boundaries, unknown/stale-input behavior, and tie-rank version. Missing or unknown configuration fails closed.
- Pre-dispatch evaluation for budget and wall-time clocks, committed-iteration evaluation for novelty, coverage, and cycle clocks, and post-receipt reevaluation when actual spend or elapsed time changes. A fired clock prevents new dispatch; in-flight work follows phase-006 salvage/cancellation policy rather than being silently discarded.
- Additive, dark integration beside the current council bridge. Shadow clock decisions and termination-cause events remain non-authoritative until the program's staged cutover phase.

### Out of Scope
- Reimplementing typed budget accounting, semantic-community novelty, path coverage, or cycle fingerprint detection; this phase consumes their versioned events and certificates.
- Value-of-computation scoring or adaptive compute allocation, owned by successor `004-value-of-computation-allocation`; the allocator may spend only while every required clock remains armed.
- The generic degeneration presentation and health policy owned by `005-health-and-degeneration-harness`.
- Calibrating production thresholds from live traffic, changing mode authority, migrating in-flight packets, or retiring the shipped council thresholds.
- Treating budget, wall-time, novelty, or cycle termination as proof of convergence. Only a valid coverage firing may use the `converged` termination class.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Represent each stop source as an independent typed clock | Budget, novelty, coverage, wall-time, and cycle adapters emit separate observations; no composite score or clock may suppress another clock's fired state |
| REQ-002 | Define each firing condition from versioned source inputs | Every fired observation carries the exact source events/certificate, policy version, cursor/watermark, effective elapsed time, input fingerprint, and condition trace |
| REQ-003 | Compose clocks by deterministic earliest firing | Ordered and concurrent fixtures always choose the smallest effective elapsed time; same-batch ties use the versioned rank and preserve every co-firing cause |
| REQ-004 | Preserve termination semantics | Coverage yields `converged`; budget and wall time yield `incomplete`; novelty yields `diminishing_returns`; cycle yields `cycle_detected`; no adapter may relabel one class as another |
| REQ-005 | Consume hierarchical typed budgets without unit collapse | Exhaustion records the governing scope and exact token, cost, iteration, or budgeted-wall-time dimension; cross-unit comparisons and implicit unlimited capacity are rejected |
| REQ-006 | Make novelty decay replayable and resistant to superficial churn | A deterministic exponential-tail fold over concept novelty and independent-evidence yield respects warm-up/window/patience settings; paraphrases, duplicate sources, and stale projections do not reset the clock |
| REQ-007 | Require a valid coverage certificate | Only sibling 001 `STOP_ALLOWED` with fresh replayable projections and zero required gaps, critical contradictions, or STOP blockers fires coverage |
| REQ-008 | Keep the hard wall-time deadline independent | Monotonic elapsed time fires against an explicit deadline even when budget state has capacity; simultaneous budgeted-time exhaustion is recorded as a co-cause |
| REQ-009 | Consume cycle evidence without stealing detector authority | Only a fresh confirmed-cycle event meeting the mode profile fires; suspected, cleared, progress-broken, or not-evaluable observations remain armed or fail closed |
| REQ-010 | Configure behavior per mode through a versioned profile | Every supported mode declares source adapters, thresholds, windows, deadline, evaluation boundaries, tie-rank version, and shadow/authority state; missing or unknown fields reject evaluation |
| REQ-011 | Record the firing clock as the termination cause | One idempotent termination event stores primary and co-firing causes, all traces and source identities, final gaps/blockers, and the replay fingerprint; replay reproduces the same event hash |
| REQ-012 | Stop new work without losing in-flight evidence | Once fired, admission rejects new dispatch; already-started work is settled, salvaged, or cancelled through the durable orchestration contract and remains linked to the termination event |
| REQ-013 | Fail closed on stale, inconsistent, or missing clock state | Mixed watermarks, non-monotonic elapsed time, unknown versions, missing required clocks, conflicting terminal events, or unreconciled budget state cannot produce `no_stop` or `converged` |
| REQ-014 | Preserve additive-dark migration discipline | Shadow results are observable beside `convergence.cjs`, but current stop authority and legacy outputs remain unchanged until compatibility, parity, rollback, and cutover gates pass |

### Clock conditions and arbitration contract

| Clock | Fires when | Required inputs | Termination class |
|-------|------------|-----------------|-------------------|
| `budget` | Any governing typed budget cannot authorize the next required operation | Scope chain, dimension, balances, request, reservation/settlement state, budget policy | `incomplete` |
| `novelty_decay` | Decayed concept novelty and independent-evidence yield remain below configured floors for the configured patience window | Community/evidence projections, fixed-point tail state, watermark, decay policy | `diminishing_returns` |
| `coverage` | A valid fresh sibling-001 certificate returns `STOP_ALLOWED` | Frozen universe, path states, contradictions, blockers, certificate/replay fingerprint | `converged` |
| `wall_time` | Monotonic elapsed duration reaches the explicit hard deadline | Run start identity, elapsed duration, deadline, clock source/version | `incomplete` |
| `cycle` | A fresh sibling-002 confirmed cycle meets mode severity and persistence policy | Cycle event, period/occurrences, progress verdict, cursors, detector policy | `cycle_detected` |

The arbiter evaluates one immutable ledger prefix and never recomputes source semantics. Each adapter converts its owner's
committed output into a clock observation. The earliest effective elapsed duration is authoritative; ledger cursor orders
observations with distinct commits, and the fixed rank resolves candidates emitted atomically at the same duration and cursor.
The winner cannot erase other fired observations: the terminal event lists them as co-causes and stores the complete comparator
trace. Reapplying the same terminal identity is idempotent; a different winner or payload at that identity is a conflicting
replay and fails closed.

Per-mode profiles may vary deterministic thresholds, windows, deadlines, and cycle persistence, but they must name all five
clock adapters and an explicit shadow/authoritative state. A mode may mark a semantic clock observe-only during calibration;
it may not omit budget admission, invent unlimited time, accept stale projections, or report a non-coverage stop as convergence.
Profile changes mint a new version and never rewrite a recorded termination decision.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five clock adapters have explicit, versioned conditions and input contracts, and each can fire independently in deterministic fixtures.
- **SC-002**: Ordered, concurrent, resume, and replay fixtures select the same earliest primary cause, retain the same co-causes, and reproduce the termination-event hash.
- **SC-003**: Every supported mode has a complete stopping-clock profile; missing clocks, stale inputs, mixed watermarks, or unknown versions fail closed.
- **SC-004**: Budget and wall-time exhaustion remain typed incomplete outcomes, novelty and cycle remain non-convergence outcomes, and only a valid coverage certificate reports convergence.
- **SC-005**: A fired clock blocks new dispatch while preserving receipt settlement, in-flight salvage/cancellation evidence, final coverage gaps, and unresolved blockers.
- **SC-006**: Shadow integration preserves the shipped council decision bridge and current authority until the staged cutover contract authorizes the new arbiter.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has no hard sibling planning dependency (`depends_on: []`); predecessor `002-cycle-detection` and successor
`004-value-of-computation-allocation` are navigation and contract-order references. Runtime implementation consumes the
phase-003 authorized ledger, phase-004 typed budgets, phase-006 durable dispatch/settlement boundaries, phase-007 novelty
projections, and sibling 001/002 certificates/events. The parent manifest requires those program inputs before convergence
activation, but each phase-008 child remains an independently authored planning contract.

The principal risk is semantic collapse: if exhaustion, stagnation, cycling, and convergence share one Boolean, operators lose
the cause and downstream policy may certify an incomplete run. Other risks are clock races, wall-time drift, budget-time and
deadline double counting, stale projection watermarks, novelty resets from paraphrases, coverage certificates invalidated after
late universe expansion, cycles cleared at the same boundary they fire, profile drift across resume, and termination while
effects remain unsettled. Mitigations are typed causes, monotonic elapsed time, co-cause recording, immutable evaluation
prefixes, fixed-point folds, versioned profiles, idempotent terminal events, fail-closed source adapters, and explicit in-flight
settlement links.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must freeze each mode's novelty floors, decay factor, warm-up/window/patience values,
wall-time deadline, cycle severity/persistence mapping, and any observe-only semantic clocks against pinned shadow fixtures.
Those calibrations may mint new profile versions; they cannot remove a clock adapter, alter the earliest-fire rule, hide
co-firing causes, accept stale state, or classify a non-coverage stop as convergence.
<!-- /ANCHOR:questions -->
