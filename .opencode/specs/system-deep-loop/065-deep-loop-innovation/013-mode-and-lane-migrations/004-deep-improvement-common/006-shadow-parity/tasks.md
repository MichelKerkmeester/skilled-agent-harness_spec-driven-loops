---
title: "Tasks: Deep Improvement Common Services - Shadow Parity"
description: "Tasks for the shadow-parity child of the Deep Improvement Common Services migration: define paired legacy and typed execution, event-for-event projection comparison, phase-011 health shadow integration, and cutover-blocking acceptance evidence."
trigger_phrases:
  - "deep improvement shadow parity tasks"
  - "common service parity tasks"
  - "legacy typed projection diff tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Captured event, projection, and service-level parity work"
    next_safe_action: "Build the protected-field manifest and mismatch taxonomy"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Common Services - Shadow Parity

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

- [ ] T001 Confirm the sibling event, reducer, sealed-artifact, certificate, and resume contracts and record their versions and ownership boundaries
- [ ] T002 Confirm the phase-011 health and degeneration shadow contract, including cursors, watermarks, policy digests, data-gap states, and non-authoritative action requests
- [ ] T003 Inventory legacy and typed boundaries for candidate generation, evaluator observations, normalization, canary analysis, promotion, rollback, and terminal events
- [ ] T004 Freeze the paired-context schema, event matching key, protected projection fields, normalization manifest, mismatch taxonomy, and parity verdict states
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the immutable shadow-run context shared by both paths, including run, candidate, lineage, profile, evaluator epoch, fixture, baseline, budget, policy, and input digests
- [ ] T006 Define the legacy-to-typed event adapter and one-to-one event matcher with source bytes, hashes, cursors, schema paths, and fail-closed ambiguity handling
- [ ] T007 Define event comparison for identity, causal links, event family, order, payload meaning, policy/version references, authorization intent, receipt references, and terminal disposition
- [ ] T008 Define projection snapshots and boundary diffs for lineage, evaluator epoch, raw trials, score normalization, uncertainty, canary lifecycle, promotion state, vetoes, receipts, budgets, rollback, and terminal facts
- [ ] T009 Define evaluator, canary, and promotion probes that preserve raw evidence, sealed references, order-swapped outcomes, integrity failures, and external authorization without shadow authority
- [ ] T010 Define phase-011 health observation ingestion, coherent watermark checks, `telemetry_gap` and `not_evaluable` handling, recovery comparison, and observation-only action requests
- [ ] T011 Define mismatch evidence receipts, replay fingerprints, idempotency keys, retention limits, parity report schema, and the explicit zero-authority-write assertion
- [ ] T012 Define shared fixture inputs and namespaced extension rules for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify: The same immutable context drives both paths - paired fixtures show identical run, lineage, evaluator, fixture, baseline, budget, policy, and input digests
- [ ] T014 Verify: Event-for-event parity holds - accepted fixtures have one match per eligible boundary with zero missing, extra, reordered, unauthorized, unknown-version, or unexplained protected-field events
- [ ] T015 Verify: Projection parity holds at every boundary - intermediate state hashes and protected fields match even when terminal states also converge
- [ ] T016 Verify: Raw evidence survives later policy changes - score replay retains observation, evaluator, fixture, seed, judge, rationale, normalization, cost, and latency references
- [ ] T017 Verify: Canary and promotion parity is guarded - leak, drift, invariant, veto, pause, abort, restore, denial, inconclusive, and authorization fixtures agree without shadow mutation
- [ ] T018 Verify: Phase-011 health parity is observation-only - healthy, degeneration, recovery, stale, missing, and unsupported inputs preserve cursors and never change stop or dispatch authority
- [ ] T019 Verify: Replay, resume, duplicate delivery, and three-variant fixtures are deterministic - match IDs, projection fingerprints, mismatch classes, and verdicts are stable
- [ ] T020 Verify: The cutover report is blocking and explicit - only a fully green report is `PASS`; `MISMATCH`, `INCONCLUSIVE`, and `TELEMETRY_GAP` cannot authorize later cutover
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Event and projection parity gate green for the shared corpus and all three downstream variant fixture sets
- [ ] Phase-011 shadow observations remain non-authoritative and fail closed on data gaps
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `005-resume-adapter/` for resume and replay input boundaries
- **Successor**: See `007-rollback-and-mode-gate/` for cutover-blocking consumption and rollback ownership
- **Shared framework**: See `011-convergence-termination-and-health/005-health-and-degeneration-harness/` for non-authoritative health shadow semantics
<!-- /ANCHOR:cross-refs -->
