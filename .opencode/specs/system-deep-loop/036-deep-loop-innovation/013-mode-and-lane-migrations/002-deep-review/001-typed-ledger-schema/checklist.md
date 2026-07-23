---
title: "Checklist: Deep Review - Typed Ledger Schema"
description: "Checklist for the planned Deep Review typed event vocabulary, append-only evidence contract, candidate adjudication, and versioned upcaster hooks."
trigger_phrases:
  - "deep review typed ledger schema checklist"
  - "deep-review event contract checklist"
  - "deep review append-only schema verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T10:00:00Z"
    last_updated_by: "codex"
    recent_action: "Verified the Deep Review typed ledger schema"
    next_safe_action: "Fold the exported union in 002-reducers-and-projections"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase defines vocabulary and compatibility hooks only"
      - "Severity-bearing state binds a typed adjudication event and digest"
---
# Checklist: Deep Review - Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the planned Deep Review schema phase. The verifier pins the
candidate SHA, phase-006 and phase-012 contract revisions, event-vocabulary revision, fixture manifest hash, commands,
and exit codes. It fails on an unauthorized append, an unknown event/version that does not block, mutable evidence
replacement, missing raw observations, unadjudicated P0/P1 activation, reducer-owned scope, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 006 publishes the transition-authorized envelope and append boundary; phase 012 publishes the shared review-loop, event, lineage, and replay contracts [Evidence: real envelope and gateway imports at `deep-review-ledger-schema.ts:5`; authorized append matrix at `deep-review-ledger-schema.vitest.ts:582`]
- [x] CHK-002 [P0] Current Deep Review lifecycle and JSONL obligations are inventoried from `deep-review/SKILL.md:287-356` and `deep-review/references/state/state-jsonl.md:45-344` [Evidence: 26-stem map at `deep-review-ledger-types.ts:449` and registered legacy table at `legacy-compatibility.ts:30`]
- [x] CHK-003 [P1] The event ownership matrix names one owner for every shared, mode, reducer, projection, report, artifact, and certificate concern [Evidence: ownership and limitations recorded in `implementation-summary.md`]
- [x] CHK-004 [P2] The candidate report records phase-006 and phase-012 contract revisions plus the event-vocabulary manifest hash [Evidence: baseline revision and five SHA-256 contract pins recorded in `implementation-summary.md`]
- [x] CHK-005 [P1] The Deep Review and deep-alignment shared-backbone boundary is recorded and no mode-local duplicate event family is accepted [Evidence: `DeepReviewEventEnvelope` specializes the shared envelope at `deep-review-ledger-types.ts:582`; no shared module changed]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] The Deep Review envelope reuses shared identity, causation, lineage, integrity, authorization, and replay fields without mode-local duplicates [Evidence: shared field inventory at `deep-review-ledger-schema.ts:50` and duplicate authority-field rejection at `deep-review-ledger-schema.vitest.ts:621`]
- [x] CHK-007 [P0] Every event stem has a stable name, independent event version, typed payload, requiredness rule, and causal or predecessor reference [Evidence: 26 stems, wire map, payload map, and scope map at `deep-review-ledger-types.ts:449-568`]
- [x] CHK-008 [P1] Payloads contain references and digests for large artifacts; no mutable source body, code body, transcript, strategy, dashboard, or report body is encoded [Evidence: exact nested validators and mutable-body rejection test at `deep-review-ledger-schema.vitest.ts:672`]
- [x] CHK-009 [P1] Raw observations remain separate from candidate confidence, impact, evidence strength, adjudicated severity, convergence, and verdict decisions [Evidence: raw-versus-derived contracts and test at `deep-review-ledger-schema.vitest.ts:826`]
- [x] CHK-010 [P1] Finding identity uses versioned semantic anchors, normalized context, program-slice references, rename mapping, and explicit introduced/fixed/preexisting lineage [Evidence: `SemanticFingerprintParts` and full lineage vocabulary test at `deep-review-ledger-schema.vitest.ts:847`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-011 [P0] A complete fixture validates `run_initialized` and `scope_resolved` through dimension passes, convergence, synthesis, `review_report_committed`, and `run_completed` [Evidence: 26/26 all-stem matrix at `deep-review-ledger-schema.vitest.ts:582`]
- [x] CHK-012 [P0] Target, dimension, protocol, iteration, candidate, finding, evidence, adjudication, fingerprint, gate, report, and continuity references validate across multiple passes [Evidence: typed scope factory and complete data fixture map in `deep-review-ledger-schema.vitest.ts`]
- [x] CHK-013 [P0] Event identity, `prevEventHash`, causal links, payload digests, producer fingerprints, append positions, and lineage fields are deterministic and immutable [Evidence: determinism and missing-hash tests at `deep-review-ledger-schema.vitest.ts:610` and `deep-review-ledger-schema.vitest.ts:653`]
- [x] CHK-014 [P0] Candidate fixtures preserve analyzer/test/runtime observations, evidence locators, independent evidence classes, stability, causal proximity, relevance, and raw scores [Evidence: candidate/evidence fixtures and mutable-body rejection at `deep-review-ledger-schema.vitest.ts:672`]
- [x] CHK-015 [P0] Claim-adjudication fixtures preserve claim, evidence refs, counterevidence sought, alternative explanation, confidence, downgrade trigger, severity, and transitions [Evidence: accepted and rejected adjudication paths at `deep-review-ledger-schema.vitest.ts:771`]
- [x] CHK-016 [P0] Finding-lineage fixtures distinguish new, updated, unchanged, fixed, preexisting, absent, and disproved states without overwriting prior evidence [Evidence: full semantic-fingerprint lineage vocabulary at `deep-review-ledger-schema.vitest.ts:847`]
- [x] CHK-017 [P0] Review-depth fixtures preserve target selection, required bug classes, covered/ruled-out/deferred/blocked rows, and graph/semantic-search status [Evidence: closed `ReviewDepthRecordedData` fixture participates in the 26-stem append matrix]
- [x] CHK-018 [P0] Convergence fixtures distinguish continue, recover, converged, incomplete, and blocked outcomes and retain raw signals plus all gate results [Evidence: exact convergence signal rules at `deep-review-ledger-schema.ts:286` and blocked gate objects at line 322]
- [x] CHK-019 [P0] Blocked-stop, pause, and recovery fixtures preserve normalized stop reasons, failed gates, recovery strategy, target dimension, and causal references [Evidence: three distinct event payloads pass the 26/26 authorized append matrix at `deep-review-ledger-schema.vitest.ts:582`]
- [x] CHK-020 [P0] Review-report fixtures retain final event range, finding input digest, verdict inputs, report revision/digest, unresolved and deferred IDs, and report receipt [Evidence: closed report payload at `deep-review-ledger-types.ts:397` passes Vitest; injected report body is rejected at `deep-review-ledger-schema.vitest.ts:672`]
- [x] CHK-021 [P0] Compatibility fixtures pass exact, compatible, migrate, pin-old-runtime, and blocked outcomes; unknown event types and versions fail closed [Evidence: compatibility matrix at `deep-review-ledger-schema.vitest.ts:916`]
- [x] CHK-022 [P0] Every event append is rejected when phase-006 authorization metadata is absent, stale, or inconsistent with the transition [Evidence: denied capability and missing proof commit zero events at `deep-review-ledger-schema.vitest.ts:749`; all accepted stems retain durable decision references]
- [x] CHK-023 [P1] A replay fixture produces stable event identities and fingerprints after resume, restart, retry, moved lines, renamed symbols, finding movement, and late evidence [Evidence: deterministic current event test at `deep-review-ledger-schema.vitest.ts:610`, semantic fingerprint parts, and pure legacy upcast at line 954]
- [x] CHK-024 [P0] A candidate with high impact but weak evidence cannot activate P0/P1/P2 without a valid typed adjudication packet [Evidence: candidate-severity and deferred-adjudication rejection at `deep-review-ledger-schema.vitest.ts:771`; mutation falsifier went red when the candidate guard was removed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] The vocabulary matrix covers every in-scope Deep Review lifecycle and recommendation boundary listed in `findings-registry-modes.json:2619-2876` [Evidence: all 26 required stems appear at `deep-review-ledger-types.ts:449`]
- [x] CHK-026 [P1] The handoff matrix gives `002-reducers-and-projections` event names, fields, lineage, and references without prescribing reducer algorithms [Evidence: public union and compatibility surface documented in `implementation-summary.md`]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-027 [P0] Evidence, code, analyzer output, runtime witnesses, and report references are treated as untrusted inputs; no instruction-bearing body is trusted through a ledger row [Evidence: source, analyzer, and report-body probes fail before append at `deep-review-ledger-schema.vitest.ts:672`]
- [x] CHK-028 [P1] Source, prompt, executor, analyzer, and artifact digests do not expose credentials or place secret-bearing content in the ledger envelope [Evidence: strict digest and closed locator validation at `deep-review-ledger-schema.ts:571`; targeted Vitest 14/14 passed]
- [x] CHK-029 [P1] Authorization, lineage, and replay references cannot be supplied by an untrusted payload in place of the phase-006 gateway result [Evidence: extra payload `authorizationRef` is rejected; durable `authorization_ref` comes only from `appendAuthorized`]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P1] `spec.md`, `plan.md`, `tasks.md`, this checklist, and `implementation-summary.md` agree on the event ownership boundary and complete status [Evidence: strict status and template validation exit 0]
- [x] CHK-031 [P2] The phase adjacency line names predecessor: none (first sibling) and successor `002-reducers-and-projections` verbatim [Evidence: `spec.md` phase adjacency line]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-032 [P1] The four planning docs, implementation summary, and boundary decision record are authored in this target folder; `description.json` and `graph-metadata.json` are generated by deterministic tooling [Evidence: metadata refresh commands completed after authored docs]
- [x] CHK-033 [P1] Schema, upcaster, and fixture implementation changes are dependency-closed and path-scoped to this leaf [Evidence: scoped status audit lists only `deep-review-ledger-schema/`, its Vitest file, and this leaf's docs]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 schema, provenance, authorization, candidate-admission, adjudication, compatibility,
and scope check passes, the shared contract revisions are pinned, the event manifest and fixture hashes are recorded, and
the handoff to `002-reducers-and-projections` is complete without moving reducer, report, or authority ownership into
this phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the typed Deep Review event vocabulary, phase-006 authorization coverage,
phase-012 shared review-loop alignment, fail-closed upcaster behavior, candidate adjudication boundary, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
