---
title: "Implementation Plan: stopping clocks"
description: "Implementation plan for independent budget, novelty-decay, coverage, wall-time, and cycle clocks with deterministic earliest-fire arbitration and typed termination-cause logging."
trigger_phrases:
  - "stopping clocks implementation plan"
  - "earliest-fire clock arbiter plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
    last_updated_at: "2026-07-15T15:24:30Z"
    last_updated_by: "codex"
    recent_action: "Planned clock inputs, composition, mode profiles, and verification gates"
    next_safe_action: "Implement versioned mode profiles and deterministic earliest-fire arbitration"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Stopping Clocks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime + phase-011 termination contracts |
| **Change class** | Additive control logic, typed ledger events, projections, and shadow bridge |
| **Execution** | Dark, non-authoritative implementation behind compatibility and replay gates |

### Overview
Replace ad hoc single-stop composition with five independent source adapters and one deterministic arbiter. Budget exhaustion
comes from the phase-007 typed budget authority; novelty decay from phase-010 concept/evidence projections; coverage from
sibling 001; cycle evidence from sibling 002; and wall time from an independent monotonic deadline. The first firing prevents
new dispatch, while one ledger event records the primary cause, same-boundary co-causes, full comparator trace, and final
run state. Detailed thresholds remain per-mode, versioned configuration rather than constants in the arbiter.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-007 budget event/projection boundary exposes typed exhaustion, scope ancestry, balances, and reconciliation state
- [ ] Phase-010 novelty inputs distinguish concept novelty from evidence novelty at one committed watermark
- [ ] Sibling 001 exposes a replay-stable coverage certificate and sibling 002 exposes confirmed/cleared cycle events
- [ ] The mode inventory and authoritative evaluation boundaries are frozen from the phase-003 baseline and phase-012 contract inputs
- [ ] Clock/profile schemas, termination classes, event namespace, and replay fingerprint policy are frozen against the phase-006 ledger contract

### Definition of Done
- [ ] All five clocks evaluate independently and publish versioned observations without sharing mutable source logic
- [ ] Earliest-fire and same-boundary tie fixtures reproduce the primary cause, co-causes, comparator trace, and event hash
- [ ] Every supported mode has a complete profile and fail-closed unknown/stale-input behavior
- [ ] New dispatch is denied after firing while in-flight effects remain receipt-linked and recoverable
- [ ] Shadow parity preserves current `convergence.cjs` authority and bridge outputs until staged cutover
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Source adapters** convert committed owner outputs into `StoppingClockObservation` records. They validate versions and watermarks but do not reimplement budget, novelty, coverage, or cycle semantics.
- **Clock projection** retains the latest state and complete firing history per `(runLineage, clockKind, profileVersion)`, rebuilt deterministically from authorized ledger events.
- **Mode profile registry** supplies all five adapter bindings, novelty-tail parameters, coverage-profile reference, cycle action policy, hard deadline, evaluation boundaries, shadow/authority state, and tie-rank version.
- **Earliest-fire arbiter** reads one immutable ledger prefix. It orders by effective monotonic elapsed time, then ledger cursor, then the same-batch rank `budget > wall_time > cycle > novelty_decay > coverage`; it records every tied fired candidate.
- **Termination writer** appends one idempotent `LoopTerminationDeclared` event through the phase-006 transition gateway. The event stores primary/co-causes, class, traces, source IDs, watermarks, fingerprint, remaining coverage/blockers, and in-flight settlement references.
- **Admission bridge** checks terminal state before new fan-out or next-iteration dispatch. A fired result denies admission; it does not delete or ignore already-authorized effects.
- **Legacy bridge** emits shadow comparison data beside the existing council `decision`, `trace`, blockers, and score without changing their authority in this phase.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the five source-interface versions, the supported-mode inventory, clock/profile schema, termination taxonomy, event names, and same-boundary rank against the pinned baseline.
- Build fixture adapters for budget, phase-010 novelty, sibling-001 coverage, monotonic wall time, and sibling-002 cycles before wiring runtime authority.

### Phase 2: Implementation
- Implement validation and canonical serialization for clock observations and per-mode profiles; reject missing clocks, unknown versions, mixed watermarks, and non-monotonic elapsed time.
- Implement the budget adapter over typed exhaustion/denial events, retaining dimension, ancestor scope, balances, request, and reconciliation evidence.
- Implement the deterministic fixed-point novelty-tail fold with per-mode warm-up, window, floors, decay factor, and patience settings.
- Implement coverage and cycle adapters that accept only fresh authoritative source certificates/events and preserve their traces without reinterpretation.
- Implement the independent monotonic wall-time deadline and preserve distinct `wall_time_deadline` and `budget_exhausted:wall_time` causes.
- Implement earliest-fire arbitration, stable same-batch ties, co-cause retention, idempotent terminal writing, and conflicting-replay refusal.
- Gate new dispatch on terminal state and connect in-flight settlement/salvage identities from durable fan-in.
- Add the additive shadow bridge around `.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs` without moving authority.

### Phase 3: Verification
- Exercise each clock alone, every ordered pair, all-clock concurrency, same-boundary ties, and cleared/stale/not-evaluable source states.
- Replay profile-version, resume, crash-before-write, crash-after-write, duplicate delivery, conflicting terminal, late coverage expansion, and unsettled-effect fixtures.
- Verify every supported mode profile and termination-class mapping; prove only coverage can emit `converged`.
- Compare legacy council outputs before/after shadow wiring and verify no current stop decision changes.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001/REQ-002 | Schema and adapter suites prove five separate observations, complete traces, stable serialization, and source-version rejection |
| REQ-003 | Permutation matrix covers distinct elapsed times, distinct cursors, and all same-batch combinations; primary and co-causes remain byte-stable |
| REQ-004 | Taxonomy fixtures prove coverage=`converged`, budget/wall-time=`incomplete`, novelty=`diminishing_returns`, and cycle=`cycle_detected` |
| REQ-005 | Token, fixed-precision cost, iteration, and budgeted-wall-time exhaustion fixtures retain units and full ancestor scope without cross-unit comparison |
| REQ-006 | Paraphrase, duplicate-source, new-community, new-independent-evidence, stale-watermark, warm-up, patience, and replay fixtures verify the novelty tail |
| REQ-007 | Complete, partial, blocked, stale, expanded-universe, and `INCOMPLETE_LIMIT` certificates prove only fresh `STOP_ALLOWED` fires coverage |
| REQ-008 | Monotonic deadline and budgeted-time fixtures prove independent firing and deterministic co-cause recording |
| REQ-009 | Suspected, confirmed, cleared, progress-broken, stale, incomplete-history, and policy-version cycle fixtures verify the configured action boundary |
| REQ-010 | A manifest-driven mode matrix validates every required field, adapter, threshold/window/deadline, and shadow/authority state |
| REQ-011/REQ-013 | Incremental, resume, full replay, duplicate, mixed-watermark, unknown-version, and conflict suites reproduce or fail closed on the terminal event |
| REQ-012 | Pre-dispatch denial plus in-flight settle/salvage/cancel fixtures retain all receipts and last-authorized-work identity |
| REQ-014 | Baseline council fixtures and bridge payload snapshots remain unchanged while shadow clock artifacts are added |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child declares `depends_on: []`; sibling adjacency is navigational. Implementation consumes the phase-006 authorized
ledger and replay fingerprint, the phase-007 hierarchical typed-budget contract, phase-009 dispatch/receipt boundaries,
phase-010 semantic-community and next-focus novelty projections, sibling 001 coverage certificates, and sibling 002 cycle
events. The outer sequencing and additive-dark authority constraint are fixed by
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation lands additive and shadow-only. Rollback disables the new clock profile/bridge, stops emitting shadow
observations, and replays from the prior compatible ledger cursor while leaving the shipped council evaluator authoritative.
Typed events already appended remain immutable and readable; rollback never deletes a termination observation. If terminal
writing, replay, or source-version validation diverges, fail closed, keep new dispatch disabled for the affected run, and route
authority through the program's compatibility/rollback bridge until the profile or adapter version is repaired.
<!-- /ANCHOR:rollback -->
