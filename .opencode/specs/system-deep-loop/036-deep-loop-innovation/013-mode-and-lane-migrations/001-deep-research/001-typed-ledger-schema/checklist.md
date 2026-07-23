---
title: "Checklist: Deep Research - Typed Ledger Schema"
description: "Checklist for the planned Deep Research typed event vocabulary, append-only provenance contract, and versioned upcaster hooks."
trigger_phrases:
  - "deep research typed ledger schema checklist"
  - "deep-research event contract checklist"
  - "deep research append-only schema verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T17:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Research event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-012 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope field names and transition tokens does phase 012 freeze?"
    answered_questions:
      - "This planned phase defines vocabulary and compatibility hooks only"
---
# Checklist: Deep Research - Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the planned Deep Research schema phase. The verifier pins the
candidate SHA, phase-006 and phase-012 contract revisions, event-vocabulary revision, fixture manifest hash, commands, and
exit codes. It fails on an unauthorized append, an unknown event/version that does not block, mutable evidence replacement,
missing raw observations, reducer-owned scope, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 006 publishes the transition-authorized envelope and append boundary; phase 012 publishes the shared event and replay contracts [Evidence: `deep-research-ledger-schema.ts:39` and gateway test at `deep-research-ledger-schema.vitest.ts:466`]
- [x] CHK-002 [P0] Current Deep Research lifecycle and JSONL obligations are inventoried from `SKILL.md:261-323` [Evidence: compatibility inventory at `legacy-compatibility.ts:142`]
- [x] CHK-003 [P1] The event ownership matrix names one owner for every shared, mode, reducer, projection, artifact, and certificate concern [Evidence: scope boundary recorded in `implementation-summary.md`]
- [x] CHK-004 [P2] The candidate report records the phase-006 and phase-012 contract revisions plus the event-vocabulary manifest hash [Evidence: registry digest is produced by `createDeepResearchEventRegistry` at `deep-research-ledger-schema.ts:423`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] The Deep Research envelope reuses shared identity, causation, integrity, authorization, and replay fields without mode-local duplicates [Evidence: envelope specialization at `deep-research-ledger-types.ts:427`]
- [x] CHK-006 [P0] Every event stem has a stable name, independent event version, typed payload, requiredness rule, and causal or predecessor reference [Evidence: stem and payload maps at `deep-research-ledger-types.ts:306`]
- [x] CHK-007 [P1] Payloads contain references and digests for large artifacts; every DATA field has one semantic rule and no blank locator, mutable source body, report body, convergence prose alias, code/version passage, or in-place claim update is encoded [Evidence: `DATA_FIELD_RULES` plus the locator, quoted-passage, policy-version, and cross-kind rejection tests]
- [x] CHK-008 [P1] Raw observations remain separate from trusted or derived decisions, including raw novelty and confidence values [Evidence: typed fields and fixtures at `deep-research-ledger-schema.vitest.ts:229`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] A complete fixture validates `run_initialized` through `run_completed` across init, iteration, convergence, synthesis, and memory-save handoff [Evidence: all-stem test at `deep-research-ledger-schema.vitest.ts:466` passed]
- [x] CHK-010 [P0] Question, branch, source version, evidence, claim version, relation, gap, and focus references validate across multiple iterations [Evidence: typed scope fixture at `deep-research-ledger-schema.vitest.ts:132`]
- [x] CHK-011 [P0] Event identity, `prevEventHash`, causal links, payload digests, producer fingerprints, and append positions are deterministic and immutable [Evidence: determinism test at `deep-research-ledger-schema.vitest.ts:545` passed]
- [x] CHK-012 [P0] Source admission fixtures record `admit`, `degrade`, and `quarantine` with exact locators, source identity, contamination status, and typed reasons [Evidence: all dispositions pass; whitespace-only source and passage selectors plus a 2.7 KiB quoted passage in `reasonCode` are rejected before append]
- [x] CHK-013 [P0] Claim fixtures preserve support, contradiction, qualification, contextualization, contested, unresolved, and supersession states without overwriting evidence [Evidence: claim unions at `deep-research-ledger-types.ts:182` and rejection test at `deep-research-ledger-schema.vitest.ts:561`]
- [x] CHK-014 [P0] Convergence fixtures distinguish continue, recover, converged, incomplete, and blocked outcomes and retain raw signals plus policy fingerprints in exact nested shapes [Evidence: targeted Vitest 16/16 passed, including prose rejection for every top-level policy-version family member]
- [x] CHK-015 [P0] Synthesis fixtures retain selected claim-version digests, citation event references, unresolved claims, and synthesis receipts [Evidence: synthesis contracts at `deep-research-ledger-types.ts:247`; all-stem test passed]
- [x] CHK-016 [P0] Memory-save fixtures distinguish requested, completed, and failed handoffs with continuity fingerprints and retryability [Evidence: stems at `deep-research-ledger-types.ts:326`; all-stem test passed]
- [x] CHK-017 [P0] Compatibility fixtures pass exact, compatible, migrate, pin-old-runtime, and blocked outcomes; unknown event types and versions fail closed [Evidence: compatibility matrix at `deep-research-ledger-schema.vitest.ts:607` passed]
- [x] CHK-018 [P0] Every event append is rejected when phase-006 authorization metadata is absent, stale, or inconsistent with the transition [Evidence: deny-before-append fixture commits zero events; authorized-ledger substrate suite passes 20/20, including forged/replayed proof and event-ID conflict cases]
- [x] CHK-019 [P1] A replay fixture produces stable event identities and fingerprints after resume, restart, retry, source mutation, and late judgment attachment [Evidence: replay stability at `deep-research-ledger-schema.vitest.ts:500` and pure upcast at `deep-research-ledger-schema.vitest.ts:638`]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P0] The vocabulary matrix covers every in-scope Deep Research lifecycle and recommendation boundary listed in `findings-registry-modes.json:4984-5125` [Evidence: 23-stem matrix at `deep-research-ledger-types.ts:306`]
- [x] CHK-021 [P1] The handoff matrix gives `002-reducers-and-projections` event names, fields, and references without prescribing reducer algorithms [Evidence: exported union at `deep-research-ledger-types.ts:435`]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P0] Retrieved content is treated as untrusted evidence; instruction-scan and admission outcomes are typed before trusted claim use [Evidence: source and admission contracts at `deep-research-ledger-types.ts:158`]
- [x] CHK-023 [P1] Source, prompt, executor, and artifact digests do not expose credentials or place secret-bearing content in the ledger envelope [Evidence: convergence prose rejection test at `deep-research-ledger-schema.vitest.ts:579`]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-024 [P1] `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, and this checklist agree on the field-discipline and event-ownership boundaries [Evidence: strict `validate.sh` result recorded in `implementation-summary.md`]
- [x] CHK-025 [P2] The phase adjacency line names predecessor none and successor `002-reducers-and-projections` verbatim [Evidence: `spec.md:31`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] The five required Level-2 documents and the contract-backed decision record are present; `description.json` and `graph-metadata.json` are generated by deterministic tooling [Evidence: metadata refresh commands executed after the field-kind decision was recorded]
- [x] CHK-027 [P1] Schema, upcaster, and fixture implementation changes are dependency-closed and path-scoped to this leaf [Evidence: scoped status audit lists only `deep-research-ledger-schema/`, its Vitest file, and this leaf's docs]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 schema, provenance, authorization, compatibility, and scope check passes, the shared
contract revisions are pinned, the event manifest and fixture hashes are recorded, and the handoff to
`002-reducers-and-projections` is complete without moving reducer or authority ownership into this phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the typed Deep Research event vocabulary, phase-006 authorization coverage,
phase-012 contract alignment, fail-closed upcaster behavior, and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
