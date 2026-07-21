---
title: "Tasks: Transactional Projections & Gauges"
description: "Tasks for implementing and verifying atomic ledger-derived projection bundles, gauges, resume, and deterministic generation rebuilds."
trigger_phrases:
  - "transactional projections tasks"
  - "atomic gauges tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges"
    last_updated_at: "2026-07-21T09:42:29Z"
    last_updated_by: "codex"
    recent_action: "Completed the transactional projection implementation and verifier matrix"
    next_safe_action: "Monitor additive-dark evidence while legacy surfaces remain authoritative"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/transactional-projections/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/transactional-projections.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Transactional Projections & Gauges

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

- [x] T001 Pin the baseline and confirm the verified phase-006 reader, phase-007 gauge registry, phase-010 event contracts, storage transaction features, and legacy observability authority. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T002 Freeze a projection manifest mapping each dashboard, registry, claim table, index, and gauge to source events, reducer versions, consistency bundles, schemas, and consumers. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T003 Specify the canonical transaction boundary, generation lifecycle, fencing model, watermark provenance, apply-receipt identity, and external publication boundary. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement the versioned projection-bundle registry and reject duplicate IDs, missing schemas, digest ambiguity, and dependency cycles. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T005 Implement generation-scoped canonical schemas for views, gauge accumulators, receipts, watermarks, snapshots, and the active-generation pointer. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T006 Implement deterministic prepare over one verified ledger event without wall time, randomness, locale, network reads, process globals, or mutable exports. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T007 Implement fenced expected-watermark apply so all affected views, phase-007 gauges, the receipt, and watermark commit in one transaction or roll back together. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T008 Implement exact duplicate no-op and changed-content/version conflict behavior using the ledger/generation/bundle/sequence/event-hash identity tuple. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T009 Implement consistent snapshot reads that bind every requested view to one active generation, bundle version, and inclusive ledger sequence/hash. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T010 Implement restart verification and resume at the next sequence; route stale, corrupt, or definition-mismatched watermarks to deterministic rebuild. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T011 Implement isolated generation replay, canonical hash validation, atomic active-pointer publication, bounded previous-generation retention, and fenced pointer rollback. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T012 Implement committed-snapshot publication for remote dashboards/sinks; retries must not mutate canonical projection progress. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T013 Add additive-dark adapters and comparison evidence for `runtime/lib/deep-loop/observability-events.cjs`, legacy views, and phase-007 gauge outputs. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify every transaction fault point exposes the complete old or complete new projection bundle, never a half-applied event. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T015 Verify duplicates, conflicting duplicates, concurrent workers, stale fences, crash-before-commit, crash-after-commit, and restart produce one trusted advance or a typed refusal. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T016 Verify snapshot readers never mix generation IDs, bundle versions, ledger cutoffs, or partially rebuilt view sets during live apply and generation publication. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T017 Verify genesis replay and every tested verified-watermark resume produce byte-identical canonical view and gauge hashes at the same ledger head. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T018 Verify corrupt rows, receipts, watermarks, sequence/hash linkage, schemas, dependencies, and canonical values fail closed without moving the trusted watermark. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T019 Verify phase-007 gauge golden outputs remain byte-identical when composed into the transactional projection bundle. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T020 Verify remote publication failure/retry cannot change canonical rows, receipts, generation visibility, or watermark. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] T021 Verify additive-dark comparison records mismatches without changing legacy observability schemas, decisions, outputs, or error behavior. Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] All requirements in spec.md met with evidence Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
- [x] Phase gate green (validate/build/test as applicable) Evidence: see `implementation-summary.md` Verification and Automated Requirement Evidence.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
