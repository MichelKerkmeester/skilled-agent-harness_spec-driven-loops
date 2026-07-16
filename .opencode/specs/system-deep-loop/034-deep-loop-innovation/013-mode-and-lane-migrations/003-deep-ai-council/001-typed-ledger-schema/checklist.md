---
title: "Checklist: Deep AI Council - Typed Ledger Schema"
description: "Checklist for the planned Deep AI Council typed event vocabulary, append-only deliberation contract, and versioned upcaster hooks."
trigger_phrases:
  - "deep ai council typed ledger schema checklist"
  - "deep-ai-council event contract checklist"
  - "deep ai council append-only schema verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Deep AI Council event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-012 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope fields and transition tokens does phase-012 freeze?"
    answered_questions:
      - "This planned phase defines vocabulary and compatibility hooks only"
---
# Checklist: Deep AI Council - Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the planned Deep AI Council schema phase. The verifier pins the
candidate SHA, phase-006 and phase-012 contract revisions, event-vocabulary revision, fixture manifest hash, commands, and
exit codes. It fails on an unauthorized append, an unknown event/version that does not block, mutable proposal or artifact
replacement, role-information leakage, missing raw observations, reducer-owned scope, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 006 publishes the transition-authorized envelope and append boundary; phase 012 publishes the shared event, branch, receipt, artifact, and replay contracts
- [ ] CHK-002 [P0] Current Deep AI Council state, artifact, output, seat, convergence, rollback, resume, and test-gate obligations are inventoried from the mode references
- [ ] CHK-003 [P1] The event ownership matrix names one owner for every shared, council, artifact, test-gate, reducer, projection, and certificate concern
- [ ] CHK-004 [P2] The candidate report records phase-006 and phase-012 contract revisions plus the event-vocabulary manifest hash
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The Deep AI Council envelope reuses shared identity, causation, integrity, authorization, branch, receipt, and replay fields without mode-local duplicates
- [ ] CHK-006 [P0] Every event stem has a stable name, independent event version, typed payload, requiredness rule, and causal or predecessor reference
- [ ] CHK-007 [P0] The schema records one-CLI-per-round and distinct seat lenses without treating executor mixing or nominal seat count as independence proof
- [ ] CHK-008 [P0] Payloads contain references and digests for prompts, transcripts, proposals, reports, artifacts, and test results; no mutable body or in-place judgment update is encoded
- [ ] CHK-009 [P1] Raw observations remain separate from selected plans, adjudication decisions, convergence outcomes, artifact status, and test-gate verdicts
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] A complete fixture validates `run_initialized` through `council_complete` across run setup, seats, critique, convergence, artifacts, and the council test gate
- [ ] CHK-011 [P0] Round, seat, proposal, critique, candidate, judgment, artifact, gate, receipt, calibration, independence, and continuity references validate across multiple rounds
- [ ] CHK-012 [P0] Event identity, `prevEventHash`, causal links, payload digests, producer fingerprints, visible-information declarations, and append positions are deterministic and immutable
- [ ] CHK-013 [P0] Seat and proposal fixtures preserve raw outputs, score vectors, confidence, usage/cost, executor/model/prompt/tool digests, timeout status, and artifact references
- [ ] CHK-014 [P0] Critique fixtures preserve critic identity, target proposal, visible-information policy, raw findings, severity/confidence, and causal links without mutating proposals
- [ ] CHK-015 [P0] Blinded adjudication fixtures record deterministic aliases, both order-swapped pairwise judgments, abstention/inconsistency, bias audits, and no arbitrary tie-break
- [ ] CHK-016 [P0] Independence fixtures retain calibration support, correctness-conditioned error inputs, dependence references, effective seat count, and marginal-gain evidence without reducing them here
- [ ] CHK-017 [P0] Convergence fixtures distinguish continue, recover, converged, non-converged, incomplete, and blocked outcomes and retain raw agreement, stability, minority, veto, witness, and budget signals
- [ ] CHK-018 [P0] Artifact and test-gate fixtures retain safe paths, schema versions, digests, required-section results, suite/fixture manifests, critical failures, and source event ranges without embedding bodies
- [ ] CHK-019 [P0] Legacy `ai-council-state.jsonl` and artifact-audit fixtures pass exact, compatible, migrate, pin-old-runtime, and blocked outcomes; unknown types and versions fail closed
- [ ] CHK-020 [P0] Every event append is rejected when phase-006 authorization metadata is absent, stale, or inconsistent with the transition
- [ ] CHK-021 [P1] A replay fixture produces stable event identities and fingerprints after resume, restart, retry, late seat return, artifact supersession, rollback, and test-gate failure
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P0] The vocabulary matrix covers every in-scope Deep AI Council lifecycle and recommendation boundary listed in the mode and shared findings registries
- [ ] CHK-023 [P1] The handoff matrix gives `002-reducers-and-projections` event names, fields, raw/derived boundaries, and references without prescribing reducer algorithms
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P0] Generator, detector, scorer, orchestrator, and test-gate information surfaces are typed; scorer fixtures cannot expose generator identity, rationale, peer scores, or vote counts before independent judgments commit
- [ ] CHK-025 [P0] Prompt bodies, credentials, unrestricted environment values, raw transcripts, and secret-bearing artifact content do not enter ledger envelopes, digests, or logs
- [ ] CHK-026 [P1] Bias, conformity, minority-loss, and critical-disagreement evidence remains append-only and cannot be silently discarded by a convergence event
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P1] `spec.md`, `plan.md`, `tasks.md`, and this checklist agree on the event ownership boundary, planned status, artifact-reference boundary, and reducer handoff
- [ ] CHK-028 [P2] The phase adjacency line names predecessor none and successor `002-reducers-and-projections` verbatim
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-029 [P1] Only the four authored documents are created in this target folder; `description.json` and `graph-metadata.json` are generated by deterministic tooling
- [ ] CHK-030 [P1] Schema, upcaster, and fixture implementation changes land in dependency-closed, path-scoped commits after this planning phase
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 schema, provenance, role-isolation, blinding, independence, authorization, compatibility,
artifact-reference, test-gate, and scope check passes, the shared contract revisions are pinned, the event manifest and fixture
hashes are recorded, and the handoff to `002-reducers-and-projections` is complete without moving reducer or authority ownership
into this phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the typed Deep AI Council event vocabulary, phase-006 authorization coverage,
phase-012 contract alignment, fail-closed upcaster behavior, role and blinding boundaries, and `git diff-index --quiet HEAD --`
shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
