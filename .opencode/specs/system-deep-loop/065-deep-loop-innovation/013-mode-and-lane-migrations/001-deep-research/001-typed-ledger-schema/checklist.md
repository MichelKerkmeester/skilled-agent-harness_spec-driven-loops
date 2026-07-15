---
title: "Checklist: Deep Research - Typed Ledger Schema"
description: "Checklist for the planned Deep Research typed event vocabulary, append-only provenance contract, and versioned upcaster hooks."
trigger_phrases:
  - "deep research typed ledger schema checklist"
  - "deep-research event contract checklist"
  - "deep research append-only schema verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T17:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Research event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-009 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope field names and transition tokens does phase 009 freeze?"
    answered_questions:
      - "This planned phase defines vocabulary and compatibility hooks only"
---
# Checklist: Deep Research - Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the planned Deep Research schema phase. The verifier pins the
candidate SHA, phase-003 and phase-009 contract revisions, event-vocabulary revision, fixture manifest hash, commands, and
exit codes. It fails on an unauthorized append, an unknown event/version that does not block, mutable evidence replacement,
missing raw observations, reducer-owned scope, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 003 publishes the transition-authorized envelope and append boundary; phase 009 publishes the shared event and replay contracts
- [ ] CHK-002 [P0] Current Deep Research lifecycle and JSONL obligations are inventoried from `SKILL.md:261-323`
- [ ] CHK-003 [P1] The event ownership matrix names one owner for every shared, mode, reducer, projection, artifact, and certificate concern
- [ ] CHK-004 [P2] The candidate report records the phase-003 and phase-009 contract revisions plus the event-vocabulary manifest hash
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The Deep Research envelope reuses shared identity, causation, integrity, authorization, and replay fields without mode-local duplicates
- [ ] CHK-006 [P0] Every event stem has a stable name, independent event version, typed payload, requiredness rule, and causal or predecessor reference
- [ ] CHK-007 [P1] Payloads contain references and digests for large artifacts; no mutable source body, report body, or in-place claim update is encoded
- [ ] CHK-008 [P1] Raw observations remain separate from trusted or derived decisions, including raw novelty and confidence values
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] A complete fixture validates `run_initialized` through `run_completed` across init, iteration, convergence, synthesis, and memory-save handoff
- [ ] CHK-010 [P0] Question, branch, source version, evidence, claim version, relation, gap, and focus references validate across multiple iterations
- [ ] CHK-011 [P0] Event identity, `prevEventHash`, causal links, payload digests, producer fingerprints, and append positions are deterministic and immutable
- [ ] CHK-012 [P0] Source admission fixtures record `admit`, `degrade`, and `quarantine` with exact locators, source identity, contamination status, and typed reasons
- [ ] CHK-013 [P0] Claim fixtures preserve support, contradiction, qualification, contextualization, contested, unresolved, and supersession states without overwriting evidence
- [ ] CHK-014 [P0] Convergence fixtures distinguish continue, recover, converged, incomplete, and blocked outcomes and retain raw signals plus policy fingerprints
- [ ] CHK-015 [P0] Synthesis fixtures retain selected claim-version digests, citation event references, unresolved claims, and synthesis receipts
- [ ] CHK-016 [P0] Memory-save fixtures distinguish requested, completed, and failed handoffs with continuity fingerprints and retryability
- [ ] CHK-017 [P0] Compatibility fixtures pass exact, compatible, migrate, pin-old-runtime, and blocked outcomes; unknown event types and versions fail closed
- [ ] CHK-018 [P0] Every event append is rejected when phase-003 authorization metadata is absent, stale, or inconsistent with the transition
- [ ] CHK-019 [P1] A replay fixture produces stable event identities and fingerprints after resume, restart, retry, source mutation, and late judgment attachment
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-020 [P0] The vocabulary matrix covers every in-scope Deep Research lifecycle and recommendation boundary listed in `findings-registry-modes.json:4984-5125`
- [ ] CHK-021 [P1] The handoff matrix gives `002-reducers-and-projections` event names, fields, and references without prescribing reducer algorithms
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P0] Retrieved content is treated as untrusted evidence; instruction-scan and admission outcomes are typed before trusted claim use
- [ ] CHK-023 [P1] Source, prompt, executor, and artifact digests do not expose credentials or place secret-bearing content in the ledger envelope
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P1] `spec.md`, `plan.md`, `tasks.md`, and this checklist agree on the event ownership boundary and planned status
- [ ] CHK-025 [P2] The phase adjacency line names predecessor none and successor `002-reducers-and-projections` verbatim
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Only the four authored documents are created in this target folder; `description.json` and `graph-metadata.json` are generated by deterministic tooling
- [ ] CHK-027 [P1] Schema, upcaster, and fixture implementation changes land in dependency-closed, path-scoped commits after this planning phase
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 schema, provenance, authorization, compatibility, and scope check passes, the shared
contract revisions are pinned, the event manifest and fixture hashes are recorded, and the handoff to
`002-reducers-and-projections` is complete without moving reducer or authority ownership into this phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the typed Deep Research event vocabulary, phase-003 authorization coverage,
phase-009 contract alignment, fail-closed upcaster behavior, and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
