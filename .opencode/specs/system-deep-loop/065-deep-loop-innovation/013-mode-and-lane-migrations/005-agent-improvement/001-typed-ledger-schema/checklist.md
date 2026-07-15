---
title: "Checklist: Agent Improvement — Typed Ledger Schema"
description: "Blocking planning checklist for the Agent Improvement typed ledger schema: AgentIR and behavioral-change envelope, causal experiment vocabulary, shared evaluator/canary/promotion reuse, versioned upcasters, and the reducer handoff."
trigger_phrases:
  - "agent improvement typed ledger schema checklist"
  - "typed AgentIR event contract checklist"
  - "agent improvement causal event verification"
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
# Verification Checklist: Agent Improvement — Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking planning verifier contract for the Agent Improvement event vocabulary. The
implementation verifier must bind its report to the phase-003, phase-009, and mode-004 contract revisions, record the
event-catalog and AgentIR schema versions, list schema and replay-fixture results, and fail on untyped fields, missing
variant event families, duplicated common-service events, reducer/projection scope leakage, or any promotion path that
can self-authorize.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-003 transition-authorized ledger core is identified with its envelope, authorization, receipt, sequence, and replay obligations
- [ ] CHK-002 [P0] The phase-009 shared event contracts are identified with their naming, identity, causation, sequence, and versioning obligations
- [ ] CHK-003 [P0] Mode 004 common evaluator, canary, promotion, receipt, and authorization ownership is mapped without variant reimplementation
- [ ] CHK-004 [P1] The child adjacency is recorded: predecessor none (first sibling) and successor `002-reducers-and-projections`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Every Agent Improvement event has a typed payload, stable event name, producer owner, version policy, and explicit required/optional field rule
- [ ] CHK-006 [P0] AgentIR, definition, change-contract, mutation, trace, intervention, behavior-family, manifest, executor, and transfer identities are separate typed references
- [ ] CHK-007 [P0] Raw traces, failures, interventions, evaluator observations, normalized scores, judgments, and promotion decisions are separate immutable event concepts
- [ ] CHK-008 [P1] No reducer, projection, frontier, coverage view, gauge, read-model, or materialized-state behavior is hidden in schema definitions
- [ ] CHK-009 [P1] Large traces, manifests, and evaluator artifacts are digest-bound references and do not force unbounded raw content into every ledger event
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Serialize and validate the envelope for every AgentIR, change, mutation, causal, behavior, manifest, transfer, classification, reused evaluation, promotion, quarantine, and terminal event family
- [ ] CHK-011 [P0] Replay a complete definition lineage from base snapshot through AgentIR compilation, change contract, mutation, candidate execution, causal evidence, and common promotion or quarantine
- [ ] CHK-012 [P0] Preserve raw candidate traces and evaluator observations while applying a second normalization or attribution version; no prior evidence is overwritten
- [ ] CHK-013 [P0] Verify known-locus defect, authority-conflict, negative-capability, side-effect, semantic-variant, and executor-transfer fixtures retain typed outcomes and uncertainty
- [ ] CHK-014 [P0] Reject promotion when required family evidence, verifier isolation, sealed manifest or canary evidence, or external authorization is missing or denied
- [ ] CHK-015 [P0] Verify mode-004 evaluator, canary, promotion, receipt, and authorization events are reused and namespaced variant extensions cannot masquerade as common-service events
- [ ] CHK-016 [P0] Verify upcaster fixtures for current, supported historical, unknown, missing-field, ambiguous, and lossy payload versions
- [ ] CHK-017 [P1] Verify the upcaster path, AgentIR digest, evaluator epoch, manifest exposure epoch, executor/verifier references, and target schema version contribute deterministically to the replay fingerprint
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-018 [P0] The reviewed event catalog enumerates every Agent Improvement event and identifies its producer, common-service owner, and next-sibling consumer boundary
- [ ] CHK-019 [P1] Every requirement in spec.md maps to one plan step, task, checklist item, and planned evidence artifact
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-020 [P0] AgentIR capability, verifier, tool, routing, memory, and inheritance references cannot broaden authority through a schema extension
- [ ] CHK-021 [P0] Canary contents, hidden fixture details, evaluator rationales, and protected evidence are represented only through authorized sealed references or leak-veto outcomes
- [ ] CHK-022 [P0] Promotion events reference external transition authorization and cannot derive authorization from their own score, trace, causal attribution, or canary payload
- [ ] CHK-023 [P1] Mutation workers receive bounded diagnostic outcomes rather than protected evaluator material or exact hidden fixture identities
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P1] The four phase documents agree on Agent Improvement event ownership, mode-004 common-service reuse, and the reducer handoff to `002-reducers-and-projections`
- [ ] CHK-025 [P2] The phase outcome is reflected in the Agent Improvement parent map and the later sealed-artifact, certificate, resume, shadow-parity, and mode-gate plans
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] This planning child writes only `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`; generated metadata is handled by deterministic tooling
- [ ] CHK-027 [P2] Any later implementation lands in path-scoped commits with additive-dark, compatibility, authorization, and rollback constraints preserved
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 contract check passes, the typed Agent Improvement envelope and event catalog are
reviewed against the imported phase-003, phase-009, and mode-004 contracts, raw evidence and causal uncertainty are
preserved, upcaster behavior is deterministic and fail-closed, common services are reused without duplication, and
strict validation reports no blocking error. Reducer and projection behavior is intentionally verified by the next
sibling rather than this child.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off remains pending for this Planned phase. The implementation verifier may sign only after the event catalog,
AgentIR and change-contract schema, compatibility matrix, replay fixtures, common-service reuse review, and reducer
handoff evidence are recorded in the phase evidence report.
<!-- /ANCHOR:sign-off -->
