---
title: "Tasks: Deep Improvement Common Services - Shadow Parity"
description: "Tasks for the shadow-parity child of the Deep Improvement Common Services migration: define paired legacy and typed execution, event-for-event projection comparison, phase-014 health shadow integration, and cutover-blocking acceptance evidence."
trigger_phrases:
  - "deep improvement shadow parity tasks"
  - "common service parity tasks"
  - "legacy typed projection diff tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
    last_updated_at: "2026-07-28T06:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed the shared parity implementation and verification"
    next_safe_action: "Consume the contract in downstream lane migrations"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm the sibling event, reducer, sealed-artifact, certificate, and resume contracts and record their versions and ownership boundaries [EVIDENCE: real substrate imports in `harness-adapter.ts`]
- [x] T002 Confirm the phase-014 health and degeneration shadow contract, including cursors, watermarks, policy digests, data-gap states, and non-authoritative action requests [EVIDENCE: `telemetry-gap` fault class and non-authoritative mode-gate output]
- [x] T003 Inventory legacy and typed boundaries for candidate generation, evaluator observations, normalization, canary analysis, promotion, rollback, and terminal events [EVIDENCE: `DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP`]
- [x] T004 Freeze the paired-context schema, event matching key, protected projection fields, normalization manifest, mismatch taxonomy, and parity verdict states [EVIDENCE: `types.ts` frozen input, projection, diff, and receipt contracts]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define the immutable shadow-run context shared by both paths, including run, candidate, lineage, profile, evaluator epoch, fixture, baseline, budget, policy, and input digests [EVIDENCE: `DeepImprovementCommonFrozenParityInput`]
- [x] T006 Define the legacy-to-typed event adapter and one-to-one event matcher with source bytes, hashes, cursors, schema paths, and fail-closed ambiguity handling [EVIDENCE: `canonicalizeDeepImprovementCommonEventStream` logical-identity pairing]
- [x] T007 Define event comparison for identity, causal links, event family, order, payload meaning, policy/version references, authorization intent, receipt references, and terminal disposition [EVIDENCE: `compareDeepImprovementCommonEventStreams`]
- [x] T008 Define projection snapshots and boundary diffs for lineage, evaluator epoch, raw trials, score normalization, uncertainty, canary lifecycle, promotion state, vetoes, receipts, budgets, rollback, and terminal facts [EVIDENCE: `legacyProjection` and `ledgerProjection`]
- [x] T009 Define evaluator, canary, and promotion probes that preserve raw evidence, sealed references, order-swapped outcomes, integrity failures, and external authorization without shadow authority [EVIDENCE: `DeepImprovementCommonParityProjection` and `FAULT_CASES`]
- [x] T010 Define phase-014 health observation ingestion, coherent watermark checks, `telemetry_gap` and `not_evaluable` handling, recovery comparison, and observation-only action requests [EVIDENCE: fail-closed telemetry-gap classification and authority-false output]
- [x] T011 Define mismatch evidence receipts, replay fingerprints, idempotency keys, retention limits, parity report schema, and the explicit zero-authority-write assertion [EVIDENCE: `parseDeepImprovementCommonParityReceipt` and manifest-bound mode-gate input]
- [x] T012 Define shared fixture inputs and namespaced extension rules for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` [EVIDENCE: `DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify: The same immutable context drives both paths - paired fixtures show identical run, lineage, evaluator, fixture, baseline, budget, policy, and input digests [EVIDENCE: `validateFrozenInputAgainstCapsule`]
- [x] T014 Verify: Event-for-event parity holds - accepted fixtures have one match per eligible boundary with zero missing, extra, reordered, unauthorized, unknown-version, or unexplained protected-field events [EVIDENCE: focused `Vitest` zero-diff and fault-class tests]
- [x] T015 Verify: Projection parity holds at every boundary - intermediate state hashes and protected fields match even when terminal states also converge [EVIDENCE: `replayState` per-prefix projection fingerprints]
- [x] T016 Verify: Raw evidence survives later policy changes - score replay retains observation, evaluator, fixture, normalization, cost, and latency references [EVIDENCE: `sealedArtifacts` certificate scenario and raw-observation projection]
- [x] T017 Verify: Canary and promotion parity is guarded - leak, drift, invariant, veto, pause, abort, restore, denial, inconclusive, and authorization fixtures agree without shadow mutation [EVIDENCE: focused `Vitest` canary, promotion, evaluator-integrity, and authorization faults]
- [x] T018 Verify: Phase-014 health parity is observation-only - healthy, degeneration, recovery, stale, missing, and unsupported inputs preserve cursors and never change stop or dispatch authority [EVIDENCE: focused `Vitest` telemetry-gap, stale, missing, and unsupported faults]
- [x] T019 Verify: Replay, resume, duplicate delivery, and three-variant fixtures are deterministic - match IDs, projection fingerprints, mismatch classes, and verdicts are stable [EVIDENCE: `deterministicRuns: 2` and exact shared scenario closure]
- [x] T020 Verify: The cutover report is blocking and explicit - only a fully green report is `PASS`; `MISMATCH`, `INCONCLUSIVE`, and `TELEMETRY_GAP` cannot authorize later cutover [EVIDENCE: manifest-bound receipt parser and mode-gate assertions]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: T001-T020]
- [x] All requirements in spec.md met with evidence [EVIDENCE: `implementation-summary.md`]
- [x] Event and projection parity gate green for the shared corpus and all three downstream variant fixture sets [EVIDENCE: 27 focused tests and frozen shared consumer closure]
- [x] Phase-014 shadow observations remain non-authoritative and fail closed on data gaps [EVIDENCE: telemetry-gap fault and authority-false receipt fields]
- [x] Phase gate green (validate/build/test as applicable) [EVIDENCE: focused Vitest and whole-runtime TypeScript]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `005-resume-adapter/` for resume and replay input boundaries
- **Successor**: See `007-rollback-and-mode-gate/` for cutover-blocking consumption and rollback ownership
- **Shared framework**: See `007-convergence-termination-and-health/005-health-and-degeneration-harness/` for non-authoritative health shadow semantics
<!-- /ANCHOR:cross-refs -->
