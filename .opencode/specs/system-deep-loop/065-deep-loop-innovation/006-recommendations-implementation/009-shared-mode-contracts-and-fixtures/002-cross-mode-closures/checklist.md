---
title: "Checklist: Cross-Mode Closures (009 phase 002)"
description: "Checklist for phase 002 of the 009 shared-mode-contracts-and-fixtures parent: verify one reusable closure layer, explicit mode overrides, and additive-dark parity before phase 010."
trigger_phrases:
  - "cross-mode closures checklist"
  - "deep-loop closure verification"
  - "phase 009 shared behavior conformance"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/009-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/009-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the planned P0 closure reuse, override, and parity checks"
    next_safe_action: "Run the recurrence matrix and closure bypass fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Cross-Mode Closures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 002. The verifier derives the eight mode rows from `manifest/phase-tree.json`, binds each row to the frozen phase-001 interface version, records the shared closure owner and override strategy, and fails on duplicate implementations, bypassed safety ports, nondeterministic output, hidden writes, or evidence that changes legacy authority before phase 011.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The parent outcome, `depends_on: []`, phase adjacency, and `mode_workstreams_phase_010` list are pinned to `manifest/phase-tree.json`
- [ ] CHK-002 [P0] `001-shared-mode-interfaces/spec.md`, the phase-004 service contracts, and the shipped runtime/council shared libraries are reconciled in the recurrence-to-port matrix
- [ ] CHK-003 [P0] The five closure families have one proposed owner, one result envelope, one write-set declaration, and one allowed override boundary
- [ ] CHK-004 [P1] The handoff boundary with `003-mixed-version-fixtures` and `004-write-set-conflict-graph` is explicit; neither successor artifact is duplicated here
- [ ] CHK-005 [P2] Intentional deep-improvement parser divergence and mode-local convergence policy are recorded as preserved exceptions
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Evidence normalization, sealed-reference verification, raw evidence retention, and provenance use one shared closure path
- [ ] CHK-007 [P0] Receipt/effect intent, completion, recovery, and boundary emission use one phase-004-backed closure with idempotency and fail-closed ambiguity
- [ ] CHK-008 [P0] Blinded/counterfactual adjudication, raw-score retention, independence evidence, and verdict classification use one shared closure without local re-reduction
- [ ] CHK-009 [P0] Budget admission, reservation, settlement, exhaustion, and uncertain-accounting denial use one typed closure rather than council or fan-out local authority
- [ ] CHK-010 [P0] Projection updates, stream-fold gauges, replay provenance, continuity identity, and fencing use one deterministic closure while mode reducers own declared fields
- [ ] CHK-011 [P1] Every override names typed inputs, outputs, policy owner, and invariants; no override bypasses authorization, sealing, receipts, budgets, raw evidence, or fencing
- [ ] CHK-012 [P1] The call-path inventory proves phase-010 adapters invoke shared closures and contain no copied second implementation
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-013 [P0] Evidence fixtures prove equivalent inputs yield equivalent sealed references, provenance, raw payload retention, and typed validation outcomes
- [ ] CHK-014 [P0] Receipt fixtures cover crash before intent, after intent, after effect, duplicate retry, recovery, and ambiguous target outcomes with one receipt result
- [ ] CHK-015 [P0] Adjudication fixtures cover identity masking, A/B and B/A order, configured counterfactuals, ties/cycles, raw scores, and stable/unstable/inconclusive results
- [ ] CHK-016 [P0] Budget fixtures cover atomic multi-dimensional reservation, contention, receipt-backed settlement, exhaustion, stale pricing, missing usage, and no-dispatch denial
- [ ] CHK-017 [P0] Projection fixtures prove full replay equals incremental replay, fence loss rejects stale writes, and output includes exact ledger/configuration provenance
- [ ] CHK-018 [P0] The adapter matrix covers all eight rows: `001-deep-research`, `002-deep-review`, `003-deep-ai-council`, `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, and `008-deep-alignment`
- [ ] CHK-019 [P0] `004-deep-improvement-common` is reused before `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`, with no variant-local copy of common evaluator or promotion closures
- [ ] CHK-020 [P0] Review/alignment shared-loop fixtures prove only declared behavior is reused and mode-specific findings or conformance decisions remain separate
- [ ] CHK-021 [P0] Negative override fixtures reject bypass attempts for transition authorization, sealed reads, receipt ordering, blinding, budget admission, projection fencing, and additive-dark authority
- [ ] CHK-022 [P1] Shadow-parity fixtures compare closure outputs with shipped council/deep-loop evidence, convergence, cost, dispatch, and projection behavior without changing legacy decisions
- [ ] CHK-023 [P1] Repeated closure calls with identical inputs and fixed service responses produce deterministic output bytes, error classes, and provenance
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-024 [P1] The closure catalog, recurrence matrix, override matrix, and call-path inventory cover every requirement without an unreviewed mode exception
- [ ] CHK-025 [P1] The phase-010 handoff names the closure version, adapter rows, fixture identifiers, service-port assumptions, and write-set inputs
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-026 [P0] No mode override can emit an effect or receipt before authorized durable intent/result facts, and ambiguous recovery never auto-replays
- [ ] CHK-027 [P0] No mode can consume unverified artifact bytes, bypass adjudication blinding, dispatch after typed budget denial, or mutate a projection with a stale fence
- [ ] CHK-028 [P1] Closure failure remains observable and additive-dark; it cannot silently transfer authority, erase raw evidence, or weaken legacy protections
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-029 [P1] `spec.md`, `plan.md`, `tasks.md`, and this checklist cross-reference the parent, manifest, sibling interface, phase-004 service contracts, shipped runtime libraries, and successor fixture handoff
- [ ] CHK-030 [P2] The phase-010 handoff states which behavior is shared, which behavior is mode-specific, and how each override is tested
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-031 [P1] Authored changes are limited to the four phase-002 documents; `description.json` and `graph-metadata.json` are left to deterministic tooling
- [ ] CHK-032 [P2] Closure fixtures and handoff inputs remain scoped to this phase and do not mutate phase-001, phase-003, phase-004, research inputs, or shipped runtime files during planning
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 closure and bypass check passes, one implementation serves each repeated behavior across all eight phase-010 rows, mode overrides remain explicit and bounded, common-before-variant ordering is proven, parity is observable, and the additive-dark authority boundary remains intact until phase 011.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier records the closure version, recurrence and override matrices, adapter coverage, fixture outcomes, and confirms that no closure or mode override changes runtime authority or bypasses a phase-003/004 safety port.
<!-- /ANCHOR:sign-off -->
