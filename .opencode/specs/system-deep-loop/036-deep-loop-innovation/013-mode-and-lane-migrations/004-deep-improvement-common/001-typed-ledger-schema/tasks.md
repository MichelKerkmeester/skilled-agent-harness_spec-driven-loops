---
title: "Tasks: Deep Improvement Common Services — Typed Ledger Schema"
description: "Tasks for planning the first Deep Improvement Common Services child: typed append-only envelope, evaluator/canary/promotion event vocabulary, field-level types, and versioned upcaster boundary."
trigger_phrases:
  - "deep improvement typed ledger schema tasks"
  - "common evaluator event vocabulary tasks"
  - "deep improvement upcaster tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Captured the common-service event vocabulary boundary and sibling ordering"
    next_safe_action: "Define envelope fields and versioned event payloads for shared service runs"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Common Services — Typed Ledger Schema

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

- [ ] T001 Confirm the phase-006 transition-authorized ledger core and phase-012 shared event contracts are the authoritative inputs
- [ ] T002 Inventory the shared evaluator, canary, and promotion service boundaries and the common fields reused by all three downstream variants
- [ ] T003 Record the hard scope fence: event vocabulary only; reducers and projections remain with `002-reducers-and-projections`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define `DeepImprovementEventEnvelope<TType, TPayload>`, typed identity aliases, causal and sequence fields, artifact references, authorization references, and replay-fingerprint inputs
- [ ] T005 Define run lifecycle and candidate lineage/generation event payloads, including operator provenance and explicit rejection, pause, resume, abort, and quarantine outcomes
- [ ] T006 Define evaluator event payloads for epoch sealing, fixture execution, raw observations, normalization, uncertainty, verification escalation, insufficient evidence, and evaluator failure
- [ ] T007 Define canary event payloads for suite sealing, execution, leakage, drift, metamorphic failure, cross-domain veto, inconclusive analysis, and canary-gate completion
- [ ] T008 Define promotion event payloads for proposal, external authorization reference, shadow/canary rollout, pause, abort, baseline restoration, denial, and completion without embedding reducer state
- [ ] T009 Define field-level required/optional rules, event namespace, compatibility classes, envelope/payload versioning, pure upcaster hooks, and fail-closed unknown-version behavior
- [ ] T010 Define the common-service extension rule and verify that `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` reuse these event types
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify: The envelope specialization is complete — every shared event has typed identity, causal, sequence, provenance, authorization, and replay fields
- [ ] T012 Verify: The vocabulary covers the shared run — run, candidate, evaluator, score, canary, promotion, abstention, veto, quarantine, and terminal families are enumerated
- [ ] T013 Verify: Raw evidence is immutable — observations, normalized scores, evaluator capsule, canary evidence, and promotion references remain separately addressable
- [ ] T014 Verify: Guarded promotion is fail-closed — canary failures and missing or denied authorization cannot produce an authorized promotion event
- [ ] T015 Verify: Upcasting is replay-safe — supported conversions are deterministic and version-recorded; unsupported, ambiguous, or lossy conversions fail closed
- [ ] T016 Verify: The sibling handoff is clean — reducers, projections, frontiers, gauges, and read models are not specified as part of this event vocabulary
- [ ] T017 Verify: Downstream reuse is singular — the three variants consume common evaluator, canary, and promotion contracts without duplicated shared definitions
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (strict validation and schema contract review as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next sibling**: See `../002-reducers-and-projections/` for reducers and projections
- **Parent program**: See `../../../spec.md` for phase 013 sequencing and common-service ownership
<!-- /ANCHOR:cross-refs -->
