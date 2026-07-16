---
title: "Checklist: Agent Improvement certificates and receipts"
description: "Blocking verification checklist for the Agent Improvement certificates and receipts phase, including replay-fingerprint integrity, offline verification, common-service reuse, and shadow-only mode-gate evidence."
trigger_phrases:
  - "agent improvement certificates and receipts checklist"
  - "agent-improvement verifier gate"
  - "certificate replay verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined blocking checks for Agent Improvement certificate and receipt integrity"
    next_safe_action: "Run the transition matrix and offline verifier against pinned fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Agent Improvement Certificates & Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Agent Improvement certificates and receipts phase. Every report pins the candidate SHA, BASE SHA, phase-015 contract digest, certificate/receipt schema digest, fingerprint algorithm version, and fixture manifest hash. The verifier records commands, exit codes, accepted and rejected fixture counts, and fails on missing evidence, unexpected authority changes, or unscoped tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] Phase-015 shared contracts and write-set ownership are pinned before any Agent Improvement evidence writer changes
- [ ] CHK-007 [P2] BASE SHA, phase-006 primitive digest, sealed-artifact schema digest, common-service epoch digests, and fixture manifest hash are recorded in the candidate report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Changes are limited to Agent Improvement certificate, receipt, fingerprint, verifier, fixture, and mode-gate bindings; no sibling cleanup is included
- [ ] CHK-009 [P0] Common evaluator, canary, promotion, threshold, budget, and effect-recovery behavior remains owned by `004-deep-improvement-common` and is referenced by stable typed dependencies
- [ ] CHK-010 [P1] Canonical encoding, field ordering, digest inputs, and protected-evidence commitments are explicit and deterministic
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] A complete Agent Improvement run emits one `CERTIFICATE` binding run identity, candidate lineage, AgentIR/target digest, sealed artifacts, common-service epochs, terminal transition, receipt root, and final disposition
- [ ] CHK-002 [P0] Every in-scope proposal, execution, evaluator observation, reduction, canary, promotion, rollback, and closure transition has exactly one typed `RECEIPT` with ordered parents and evidence digests
- [ ] CHK-003 [P0] The replay fingerprint covers event/schema versions, ordered parents, candidate/target/operator lineage, common-service epochs, fixture commitments, executor/model/tools, budgets, normalization, reducers, and prior state
- [ ] CHK-004 [P0] The offline verifier accepts valid fixtures with no network, live evaluator, canary, promotion, or mutable-workspace access
- [ ] CHK-011 [P0] Mutating each fingerprint input changes the digest; semantically equivalent canonical inputs remain stable
- [ ] CHK-012 [P0] Missing, duplicate, orphaned, reordered, altered, stale, schema-incompatible, and unauthorized evidence fails with a typed refusal rather than a generic pass/fail collapse
- [ ] CHK-013 [P0] Phase-006 receipt/certificate primitives and `003-sealed-artifacts` references validate across compatible versions and reject silent coercion on incompatible versions
- [ ] CHK-014 [P1] Raw evaluator observations remain available for replay while normalization and score-policy changes produce distinct evidence from candidate execution
- [ ] CHK-015 [P1] Candidate-visible views expose commitments and typed verdicts without protected fixture identity or exact hidden scores before the disclosure transition
- [ ] CHK-016 [P0] Shadow parity compares certificate/verifier output with the legacy Agent Improvement result while legacy authority remains unchanged
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P0] The transition matrix enumerates every Agent Improvement state-changing event and identifies its certificate, receipt, fingerprint, verifier, and fixture obligations
- [ ] CHK-017 [P0] Consumer inventory covers the ledger writer, receipt reducer, certificate builder, offline verifier, shadow adapter, mode gate, and successor resume adapter without assigning resume implementation to this phase
- [ ] CHK-018 [P1] Verifier refusal cases are mapped to stable actionable codes and each code has at least one named negative fixture
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-019 [P0] No secrets, protected evaluator inputs, hidden fixture identities, or mutable live responses are copied into certificate or receipt payloads
- [ ] CHK-020 [P0] Certificate and receipt inputs are schema-validated and unauthorized transitions cannot be accepted by the offline verifier
- [ ] CHK-021 [P1] Evaluator integrity, authority/side-effect invariants, and nominal task scores remain separate evidence channels in the mode gate
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-022 [P1] Spec, plan, tasks, and checklist use the same certificate fields, receipt transition matrix, fingerprint vector, and verifier refusal vocabulary
- [ ] CHK-023 [P1] The predecessor `003-sealed-artifacts`, common mode `004-deep-improvement-common`, and successor `005-resume-adapter` boundaries are documented without turning adjacency into a runtime dependency
- [ ] CHK-024 [P2] The phase outcome and any approved deferrals are reflected in the parent mode documentation where applicable
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-025 [P1] Authored planning changes are limited to `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` in this phase folder; deterministic metadata files are left to tooling
- [ ] CHK-026 [P1] Runtime implementation and fixture changes land in dependency-closed, path-scoped commits after the certificate and receipt contract is frozen
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the contract and fixture digests, valid certificates and receipt chains replay offline, every negative fixture fails closed with an actionable code, common services remain reused rather than reimplemented, and the mode gate proves shadow parity without an authority flip.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the offline verifier has no live-service dependency, and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
