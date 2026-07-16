---
title: "Tasks: Agent Improvement — Typed Ledger Schema"
description: "Tasks for planning the first Agent Improvement child: typed append-only envelope, AgentIR and behavioral-change event vocabulary, causal experiment fields, shared evaluator/canary/promotion reuse, and versioned upcaster boundary."
trigger_phrases:
  - "agent improvement typed ledger schema tasks"
  - "typed AgentIR event vocabulary tasks"
  - "agent improvement causal experiment tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T20:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Captured Agent Improvement event ownership and sibling handoff boundary"
    next_safe_action: "Define AgentIR fields and versioned event payloads for the variant run"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Agent Improvement — Typed Ledger Schema

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

- [ ] T001 Confirm the phase-006 transition-authorized ledger core, phase-012 shared event contracts, and mode-004 common-service vocabulary are the authoritative inputs
- [ ] T002 Inventory Agent Improvement run boundaries, AgentIR identities, behavior families, causal evidence, manifests, and transfer fields that are variant-owned
- [ ] T003 Record the hard scope fence: event vocabulary only; common evaluator/canary/promotion services are reused and reducers and projections remain with `002-reducers-and-projections`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define `AgentImprovementEventEnvelope<TType, TPayload>`, typed event and identity aliases, causal and sequence fields, artifact references, authorization references, and replay-fingerprint inputs
- [ ] T005 Define AgentIR, definition snapshot, inheritance graph, mutable-locus, component, clause, and content-digest field types with immutable versus mutable boundaries
- [ ] T006 Define change-contract, mutation proposal/rejection, candidate lineage, affected-obligation, and behavioral change-classification event payloads
- [ ] T007 Define trace-slice, behavior-experiment, known-defect injection, counterfactual replay, ablation, attribution uncertainty, and causal-evidence payloads
- [ ] T008 Define behavior-family coverage, four-ring evaluation manifest, fixture exposure/retirement, executor transfer, verifier, and trial-reference payloads
- [ ] T009 Define the mode-004 reuse boundary for evaluator observations, normalization, canary, promotion, receipt, and external authorization events without copied common definitions
- [ ] T010 Define required/optional rules, event namespace, compatibility classes, independent envelope/payload versions, pure upcaster hooks, replay-fingerprint paths, and fail-closed unknown-version behavior
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify: The envelope specialization is complete — every variant event has typed identity, causal, sequence, provenance, authorization, and replay fields
- [ ] T012 Verify: AgentIR and change lineage are complete — base/candidate definitions, inheritance, loci, clauses, operators, patches, and parent candidates correlate through stable references
- [ ] T013 Verify: Raw evidence is immutable — traces, failures, interventions, executor/verifier metadata, evaluator observations, manifests, and transfer trials remain separately addressable
- [ ] T014 Verify: Causal events are honest — textual gradients and attribution judgments do not masquerade as proof, and changed candidates still require fresh paired execution
- [ ] T015 Verify: Shared-service reuse is singular — evaluator, canary, promotion, receipt, and authorization events come from mode 004 and variant extensions cannot weaken their fields
- [ ] T016 Verify: Upcasting is replay-safe — supported conversions are deterministic and version-recorded; unsupported, ambiguous, or lossy conversions fail closed
- [ ] T017 Verify: The sibling handoff is clean — reducers, projections, frontiers, coverage views, gauges, and read models are not specified as part of this event vocabulary
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
- **Parent mode**: See `../../spec.md` for Agent Improvement migration sequencing and common-service ownership
- **Parent program**: See `../../../spec.md` for phase 013 sequencing and shared typed-ledger invariants
<!-- /ANCHOR:cross-refs -->
