---
title: "Checklist: Agent Improvement — Typed Ledger Schema"
description: "Completed verification checklist for the additive-dark Agent Improvement typed ledger schema, adversarial tests, shared-common reuse, and reducer handoff."
trigger_phrases:
  - "agent improvement typed ledger schema checklist"
  - "typed AgentIR event contract checklist"
  - "agent improvement causal event verification"
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
# Verification Checklist: Agent Improvement — Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist records the blocking implementation verification for the Agent Improvement event vocabulary. The
implementation is bound to the phase-006, phase-012, and mode-004 contracts, and records the
event-catalog and AgentIR schema versions, list schema and replay-fixture results, and fail on untyped fields, missing
variant event families, duplicated common-service events, reducer/projection scope leakage, or any promotion path that
can self-authorize.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The phase-006 transition-authorized ledger core is identified with its envelope, authorization, receipt, sequence, and replay obligations [Evidence: targeted Vitest uses the real gateway, ledger, envelope, and replay substrate]
- [x] CHK-002 [P0] The phase-012 shared event contracts are identified with their naming, identity, causation, sequence, and versioning obligations [Evidence: targeted Vitest 14/14; shared types and event registry imports are exercised by the 50-stem matrix]
- [x] CHK-003 [P0] Mode 004 common evaluator, canary, promotion, receipt, and authorization ownership is mapped without variant reimplementation [Evidence: targeted Vitest 14/14; 35 common definitions retain shared validation beneath the lane guard]
- [x] CHK-004 [P1] The child adjacency is recorded: predecessor none (first sibling) and successor `002-reducers-and-projections` [Evidence: `spec.md` adjacency line]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Every Agent Improvement event has a typed payload, stable event name, producer owner, version policy, and explicit required/optional field rule [Evidence: targeted Vitest 14/14; closed payload and scope maps plus exact-key validators]
- [x] CHK-006 [P0] AgentIR, definition, change-contract, mutation, trace, intervention, behavior-family, manifest, executor, and transfer identities are separate typed references [Evidence: targeted Vitest 14/14; typed identity aliases and occurrence-specific scopes]
- [x] CHK-007 [P0] Raw traces, failures, interventions, evaluator observations, normalized scores, judgments, and promotion decisions are separate immutable event concepts [Evidence: targeted Vitest 14/14; raw/derived separation and typed-adjudication tests]
- [x] CHK-008 [P1] No reducer, projection, frontier, coverage view, gauge, read-model, or materialized-state behavior is hidden in schema definitions [Evidence: targeted Vitest 14/14; scoped source and public-export audit]
- [x] CHK-009 [P1] Large traces, manifests, and evaluator artifacts are digest-bound references and do not force unbounded raw content into every ledger event [Evidence: targeted Vitest 14/14; mutable-body and protected-fixture rejection tests]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Serialize and validate the envelope for every AgentIR, change, mutation, causal, behavior, manifest, transfer, classification, reused evaluation, promotion, quarantine, and terminal event family [Evidence: 50/50 authorized append/readback matrix]
- [x] CHK-011 [P0] Replay a complete definition lineage from base snapshot through AgentIR compilation, change contract, mutation, candidate execution, causal evidence, and common promotion or quarantine [Evidence: targeted Vitest 14/14; ordered all-stem fixture retains tail links and typed scopes]
- [x] CHK-012 [P0] Preserve raw candidate traces and evaluator observations while applying a second normalization or attribution version; no prior evidence is overwritten [Evidence: targeted Vitest 14/14; append-only and post-prepare mutation tests]
- [x] CHK-013 [P0] Verify known-locus defect, authority-conflict, negative-capability, side-effect, semantic-variant, and executor-transfer fixtures retain typed outcomes and uncertainty [Evidence: targeted Vitest 14/14; closed occurrence-specific payload validation across all 15 extension stems]
- [x] CHK-014 [P0] Reject promotion when required family evidence, verifier isolation, sealed manifest or canary evidence, or external authorization is missing or denied [Evidence: targeted Vitest 14/14; typed scoring/verification/canary preflight and unauthorized zero-append tests]
- [x] CHK-015 [P0] Verify mode-004 evaluator, canary, promotion, receipt, and authorization events are reused and namespaced variant extensions cannot masquerade as common-service events [Evidence: targeted Vitest 14/14; foreign common variant is rejected by the lane registry and durable append boundary]
- [x] CHK-016 [P0] Verify upcaster fixtures for current, supported historical, unknown, missing-field, ambiguous, and lossy payload versions [Evidence: targeted Vitest 14/14; fail-closed compatibility and legacy-upcast tests]
- [x] CHK-017 [P1] Verify the upcaster path, AgentIR digest, evaluator epoch, manifest exposure epoch, executor/verifier references, and target schema version contribute deterministically to the replay fingerprint [Evidence: targeted Vitest 14/14; deterministic payload identity and retained upcaster-fingerprint tests]
- [x] CHK-028 [P0] Verify a shared common event with a foreign lane variant cannot pass `prepareEventWrite` or append durably, while the same common event with `variant: "agent-improvement"` appends [Evidence: real gateway and `AppendOnlyLedger.appendAuthorized` test leaves the foreign ledger at sequence 0 and appends the positive control at sequence 1]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-018 [P0] The reviewed event catalog enumerates every Agent Improvement event and identifies its producer, common-service owner, and next-sibling consumer boundary [Evidence: 35 common plus 15 extension stems in `implementation-summary.md`]
- [x] CHK-019 [P1] Every requirement in spec.md maps to one plan step, task, checklist item, and evidence artifact [Evidence: targeted Vitest 14/14; completed T001-T018 and this checklist]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-020 [P0] AgentIR capability, verifier, tool, routing, memory, and inheritance references cannot broaden authority through a schema extension [Evidence: targeted Vitest 14/14; exact closed AgentIR component, edge, and locus validators]
- [x] CHK-021 [P0] Canary contents, hidden fixture details, evaluator rationales, and protected evidence are represented only through authorized sealed references or leak-veto outcomes [Evidence: targeted Vitest 14/14; mutable-body and hidden-fixture rejection tests]
- [x] CHK-022 [P0] Promotion events reference external transition authorization and cannot derive authorization from their own score, trace, causal attribution, or canary payload [Evidence: targeted Vitest 14/14; real gateway denial and caller-unoverridable score-backend test]
- [x] CHK-023 [P1] Mutation workers receive bounded diagnostic outcomes rather than protected evaluator material or exact hidden fixture identities [Evidence: targeted Vitest 14/14; closed rejection payload and protected-field adversarial test]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-024 [P1] The leaf documents agree on Agent Improvement event ownership, mode-004 common-service reuse, and the reducer handoff to `002-reducers-and-projections` [Evidence: reconciled spec, plan, tasks, checklist, and implementation summary]
- [x] CHK-025 [P2] Existing parent and later-sibling ownership boundaries remain unchanged; this leaf introduces no conflicting reducer, artifact, certificate, resume, shadow-parity, or mode-gate ownership [Evidence: leaf-scoped status and schema-only source audit]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] This child writes only its schema module, unit test, leaf documentation, and deterministically generated metadata [Evidence: targeted Vitest 14/14; scoped git status audit]
- [x] CHK-027 [P2] The implementation is path-scoped and preserves additive-dark, compatibility, authorization, and rollback constraints [Evidence: no writer integration, common module, golden module, or frozen substrate mutation]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Every P0 contract check passes. The typed Agent Improvement envelope and 50-stem event catalog were verified against
the imported phase-006, phase-012, and mode-004 contracts; raw evidence and causal uncertainty remain immutable,
upcasting is deterministic and fail-closed, and common services are reused without duplication. Reducer and
projection behavior remains with the next sibling.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off on 2026-07-23 after the event catalog, AgentIR and change-contract schema, compatibility matrix, replay
fixtures, common-service reuse review, targeted unit suite, strict packet validation, and reducer handoff evidence
were recorded in `implementation-summary.md`.
<!-- /ANCHOR:sign-off -->
