---
title: "Tasks: Agent Improvement — Typed Ledger Schema"
description: "Completed implementation tasks for the additive-dark Agent Improvement typed ledger schema and its shared-common extension boundary."
trigger_phrases:
  - "agent improvement typed ledger schema tasks"
  - "typed AgentIR event vocabulary tasks"
  - "agent improvement causal experiment tasks"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark Agent Improvement typed ledger schema"
    next_safe_action: "Consume the exported event union in 002-reducers-and-projections"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-ledger-schema.vitest.ts"
    completion_pct: 100
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

- [x] T001 Confirm the phase-006 transition-authorized ledger core, phase-012 shared event contracts, and mode-004 common-service vocabulary are the authoritative inputs [Evidence: real substrate imports are exercised by targeted Vitest]
- [x] T002 Inventory Agent Improvement run boundaries, AgentIR identities, behavior families, causal evidence, manifests, and transfer fields that are variant-owned [Evidence: targeted Vitest 14/14; 15 extension stems and their closed payload/scope maps]
- [x] T003 Record the hard scope fence: event vocabulary only; common evaluator/canary/promotion services are reused and reducers and projections remain with `002-reducers-and-projections` [Evidence: scoped source and export audit]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define `AgentImprovementEventEnvelope<TType, TPayload>`, typed event and identity aliases, causal and sequence fields, artifact references, authorization references, and replay-fingerprint inputs [Evidence: combined envelope and all-stem append/readback test]
- [x] T005 Define AgentIR, definition snapshot, inheritance graph, mutable-locus, component, clause, and content-digest field types with immutable versus mutable boundaries [Evidence: targeted Vitest 14/14; closed nested AgentIR validators and in-place-update rejection test]
- [x] T006 Define change-contract, mutation proposal/rejection, candidate lineage, affected-obligation, and behavioral change-classification event payloads [Evidence: targeted Vitest 14/14; change and mutation fixtures plus typed-adjudication guard]
- [x] T007 Define trace-slice, behavior-experiment, known-defect injection, counterfactual replay, ablation, attribution uncertainty, and causal-evidence payloads [Evidence: targeted Vitest 14/14; all causal stems prepare, authorize, append, and read back]
- [x] T008 Define behavior-family coverage, four-ring evaluation manifest, fixture exposure/retirement, executor transfer, verifier, and trial-reference payloads [Evidence: targeted Vitest 14/14; closed four-ring and protected-fixture adversarial tests]
- [x] T009 Define the mode-004 reuse boundary for evaluator observations, normalization, canary, promotion, receipt, and external authorization events without copied common definitions [Evidence: targeted Vitest 14/14; 35 imported definitions retain common validation and add the lane-variant registry guard]
- [x] T010 Define required/optional rules, event namespace, compatibility classes, independent envelope/payload versions, pure upcaster hooks, replay-fingerprint paths, and fail-closed unknown-version behavior [Evidence: targeted Vitest 14/14; exact-key, version, digest, and legacy-upcast tests]
- [x] T018 Narrow imported common-stem registry validators to `variant: "agent-improvement"` without changing the shared definitions [Evidence: foreign common variant is denied and rejected by `appendAuthorized` with zero durable events; the correct variant appends]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify: The envelope specialization is complete — every variant event has typed identity, causal, sequence, provenance, authorization, and replay fields [Evidence: 50/50 authorized append/readback matrix]
- [x] T012 Verify: AgentIR and change lineage are complete — base/candidate definitions, inheritance, loci, clauses, operators, patches, and parent candidates correlate through stable references [Evidence: targeted Vitest 14/14; stable identity and in-place-revision tests]
- [x] T013 Verify: Raw evidence is immutable — traces, failures, interventions, executor/verifier metadata, evaluator observations, manifests, and transfer trials remain separately addressable [Evidence: targeted Vitest 14/14; mutable-body rejection and post-prepare mutation tests]
- [x] T014 Verify: Causal events are honest — textual gradients and attribution judgments do not masquerade as proof, and changed candidates still require fresh paired execution [Evidence: targeted Vitest 14/14; raw/derived separation and typed-adjudication preflight tests]
- [x] T015 Verify: Shared-service reuse is singular — evaluator, canary, promotion, receipt, and authorization events come from mode 004 and variant extensions cannot weaken their fields [Evidence: targeted Vitest 14/14; imported common validation plus lane-narrowed registry specialization]
- [x] T016 Verify: Upcasting is replay-safe — supported conversions are deterministic and version-recorded; unsupported, ambiguous, or lossy conversions fail closed [Evidence: targeted Vitest 14/14; compatibility matrix and source-digest/upcaster-fingerprint test]
- [x] T017 Verify: The sibling handoff is clean — reducers, projections, frontiers, coverage views, gauges, and read models are not specified as part of this event vocabulary [Evidence: targeted Vitest 14/14; schema-only source audit]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: T001-T018 checked above]
- [x] All requirements in spec.md met with evidence [Evidence: targeted Vitest passes 14/14]
- [x] Phase gate green (targeted Vitest, scope audit, comment hygiene, and strict leaf validation) [Evidence: `implementation-summary.md` verification table]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next sibling**: See `../002-reducers-and-projections/` for reducers and projections
- **Parent mode**: See `../../spec.md` for Agent Improvement migration sequencing and common-service ownership
- **Parent program**: See `../../../spec.md` for phase 013 sequencing and shared typed-ledger invariants
<!-- /ANCHOR:cross-refs -->
