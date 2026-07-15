---
title: "Tasks: Health & Degeneration Harness (008 phase 005)"
description: "Tasks for phase 005 of the convergence-termination-and-health program: a generic health and degeneration harness for cross-mode safety signals and bounded response requests."
trigger_phrases:
  - "health and degeneration harness tasks"
  - "deep-loop health signal tasks"
  - "mode collapse detector tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
    last_updated_at: "2026-07-15T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Decomposed the health harness into adapter, detector, response, and gate tasks"
    next_safe_action: "Freeze source schemas and write the shadow fixture matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Health & Degeneration Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the pinned baseline, clean worktree, and path scope for the additive-dark health surface
- [ ] T002 Inventory and pin the authorized ledger/projection watermark, phase-007 gauge schemas, reducer versions, and replay digests
- [ ] T003 Register sibling `002-cycle-detection` event kinds and preserve its fingerprints, periods, progress verdicts, and clearing semantics
- [ ] T004 Build the eight-workstream mode-adapter matrix for novelty, independent evidence, coverage, quality, frontier eligibility, and typed cost/yield
- [ ] T005 Freeze the initial health-policy schema, threshold defaults, severity mapping, hysteresis, cooldown, dedupe identity, and bounded retention rules
- [ ] T006 Create the healthy-progress and degeneration fixture matrix before wiring any legacy control path
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Implement canonical `HealthObservation` creation at one completed-attempt or durable state boundary with idempotent replay identity
- [ ] T008 Implement fail-closed validation for ledger cursor, projection watermark, input hashes, reducer/adapter versions, sample counts, and baseline compatibility
- [ ] T009 Implement mode-neutral adapters for semantic-community/fingerprint concentration, novelty, independent evidence, coverage, claim progress, frontier state, quality, and cost/yield
- [ ] T010 Implement mode-collapse detection using concentration plus a typed novelty/progress floor; reject text-only similarity as confirmation evidence
- [ ] T011 Implement repetition ingestion from sibling 002 without duplicating cycle detection or changing cycle event authority
- [ ] T012 Implement novelty-starvation detection with distinct eligible-frontier, exhausted-frontier, empty-frontier, and unknown-frontier outcomes
- [ ] T013 Implement calibrated quality-decay detection with comparable normalized values and evaluator/rubric/verifier provenance
- [ ] T014 Implement budget-thrash detection from typed retries, cancellations, leases, denials, reallocations, settlements, and realized evidence yield
- [ ] T015 Implement `telemetry_gap` and `not_evaluable` handling that never emits a positive `healthy` verdict for missing or inconsistent inputs
- [ ] T016 Implement versioned threshold evaluation, severity mapping, deterministic simultaneous-signal aggregation, cooldown, hysteresis, and bounded deduplication
- [ ] T017 Implement append-only signal, aggregate-state, recovery, and typed response-request projections
- [ ] T018 Implement `observe`, pause, re-seed, quarantine, repair, and stop-request mappings with safe-point and authorization fields
- [ ] T019 Wire shadow outputs beside legacy convergence, fan-in, allocation, budget, and dispatch paths without changing their decisions
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Verify: Health observations are canonical and replayable - incremental and genesis replay produce identical observation hashes and watermarks
- [ ] T021 Verify: The signal vocabulary is typed and mode-agnostic - every signal kind has schema, severity, provenance, and action fixtures
- [ ] T022 Verify: Mode collapse requires concentration plus absent progress - productive revisitation and evidence progress prevent confirmation
- [ ] T023 Verify: Cycle evidence remains owned by sibling 002 - period, fingerprints, progress, and clearing evidence are preserved without duplicate detection
- [ ] T024 Verify: Novelty starvation is distinct from an exhausted frontier - eligible, exhausted, empty, and unknown frontier cases do not collapse into one state
- [ ] T025 Verify: Quality decay is evidence-backed and calibrated - incompatible evaluator or baseline digests fail closed
- [ ] T026 Verify: Budget thrash uses typed cost and realized yield - retry pressure is detected without relabeling budget exhaustion as convergence
- [ ] T027 Verify: Thresholds are explicit and versioned - boundary, policy-change, hysteresis, cooldown, and unsupported-version fixtures pass
- [ ] T028 Verify: Signals include sufficient audit evidence - traces contain source cursors, gauges, policy/adapter digests, and deterministic comparisons
- [ ] T029 Verify: Responses are typed requests, not hidden authority - no request dispatches, cancels, or stops without the shared gateway or stopping-clock contract
- [ ] T030 Verify: Recovery has hysteresis and preserves history - two healthy windows clear active state without rewriting prior signals
- [ ] T031 Verify: Health remains additive-dark and cross-mode neutral - legacy outputs and decisions remain unchanged across all registered adapters
- [ ] T032 Verify: Insufficient or inconsistent inputs fail closed - gaps, stale watermarks, conflicts, and missing baselines never return `healthy`
- [ ] T033 Verify: Simultaneous signals have deterministic aggregation - input ordering does not change individual evidence or aggregate state
- [ ] T034 Verify: The harness is bounded and idempotent - retention limits hold and duplicate delivery creates no duplicate records
- [ ] T035 Verify: Source traceability is preserved - the report cites sibling 002, phase-007 gauges, `research-modes.md`, and `manifest/phase-tree.json`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/replay/shadow parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
