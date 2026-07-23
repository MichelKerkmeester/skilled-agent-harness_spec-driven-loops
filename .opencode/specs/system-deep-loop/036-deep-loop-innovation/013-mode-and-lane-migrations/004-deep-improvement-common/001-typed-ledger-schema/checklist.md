---
title: "Checklist: Deep Improvement Common Services — Typed Ledger Schema"
description: "Blocking planning checklist for the Deep Improvement Common Services typed ledger schema: common event envelope, evaluator/canary/promotion vocabulary, versioned upcasters, and downstream ownership boundaries."
trigger_phrases:
  - "deep improvement typed ledger schema checklist"
  - "common service event contract checklist"
  - "evaluator canary promotion schema verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T09:11:00Z"
    last_updated_by: "codex"
    recent_action: "Verified terminal facts and non-vacuous schema proofs"
    next_safe_action: "Fold the exported union in 002-reducers-and-projections"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The common schema is additive-dark and schema-only"
      - "The deep-improvement score backend reference is closed and mandatory"
---
# Verification Checklist: Deep Improvement Common Services — Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking planning verifier contract for the typed Deep Improvement Common Services event
vocabulary. The implementation verifier must bind its report to the phase-006 and phase-012 contract revisions,
record the event-catalog version, list schema and replay-fixture results, and fail on untyped fields, missing event
families, reducer/projection scope leakage, or any promotion path that can self-authorize.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The phase-006 transition-authorized ledger core is identified with its envelope, authorization, receipt, and replay obligations [Evidence: real shared imports and gateway/ledger append matrix] [Test: Vitest 15/15 passed]
- [x] CHK-002 [P0] The phase-012 shared event contracts are identified with their naming, identity, causation, sequence, and versioning obligations [Evidence: shared 14-field envelope inventory and independent event/payload version tests] [Test: Vitest 15/15 passed]
- [x] CHK-003 [P1] The common evaluator, canary, and promotion service boundaries are mapped to all three downstream variants [Evidence: closed variant scope and common payload maps] [Test: Vitest 15/15 passed]
- [x] CHK-004 [P1] The child adjacency is recorded: predecessor none (first sibling) and successor `002-reducers-and-projections` [Evidence: `spec.md` adjacency line] [Test: Vitest 15/15 passed]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Every event in the catalog has a typed payload, stable event name, owner, version policy, and explicit field rule [Evidence: 35 stems, wire map, payload map, scope map, and exhaustive data-rule table] [Test: Vitest 15/15 passed]
- [x] CHK-006 [P0] Raw observations, normalized scores, canary evidence, and promotion decisions are separate immutable event concepts [Evidence: separation, predecessor-reference, and post-prepare mutation tests] [Test: Vitest 15/15 passed]
- [x] CHK-007 [P1] No reducer, projection, frontier, gauge, read-model, or materialized-state behavior is hidden in the schema definitions [Evidence: import/export and scope audit] [Test: Vitest 15/15 passed]
- [x] CHK-008 [P1] Large artifacts are digest-bound references and do not force unbounded raw traces into ledger events [Evidence: under-limit prose rejects in observation and protected-canary reference fields while valid tokens prepare] [Test: Vitest 15/15 passed]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Serialize and validate the envelope for every run, candidate, evaluator, score, canary, promotion, quarantine, abstention, and terminal event family [Evidence: 35/35 authorized append/readback matrix plus coherent terminal-fact pairs] [Test: Vitest 15/15 passed]
- [x] CHK-010 [P0] Replay a complete candidate lineage from run start through evaluator observations, score events, canary outcomes, and promotion or quarantine [Evidence: ordered all-stem ledger fixture retains previous-tail and authorization links] [Test: Vitest 15/15 passed]
- [x] CHK-011 [P0] Preserve raw evaluator observations independently from normalization; no prior observation or score is overwritten [Evidence: registered successor events reference predecessor identity and digest without mutating original payloads] [Test: Vitest 15/15 passed]
- [x] CHK-012 [P0] Reject promotion when canary or external authorization evidence is absent or self-issued [Evidence: external transition-reference and missing-proof tests] [Test: Vitest 15/15 passed]
- [x] CHK-013 [P0] Verify upcaster fixtures for current, supported historical, unknown, missing-identity, and lossy payload versions [Evidence: exact/compatible/migrate/pin-old-runtime/blocked matrix] [Test: Vitest 15/15 passed]
- [x] CHK-014 [P1] Verify the upcaster path and target schema version contribute deterministically to replay identity [Evidence: source digest, upcaster fingerprint, replay metadata, and independent version-boundary tests] [Test: Vitest 15/15 passed]
- [x] CHK-015 [P1] Verify one exported common evaluator, canary, and promotion contract is available to all three downstream variants [Evidence: variant attribution matrix accepts the three registered variants] [Test: Vitest 15/15 passed]
- [x] CHK-016 [P1] Verify unsupported variant extensions fail closed and cannot masquerade as common-service events [Evidence: unknown variant and unnamespaced payload extension rejection] [Test: Vitest 15/15 passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-017 [P0] The reviewed event catalog enumerates every shared Deep Improvement Common Services event and identifies its producer and consumer boundary [Evidence: 35-stem union and implementation-summary ownership matrix] [Test: Vitest 15/15 passed]
- [x] CHK-018 [P1] Every requirement in spec.md maps to implementation, task, checklist, and verification evidence [Evidence: tasks T001-T017 and this completed checklist] [Test: Vitest 15/15 passed]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-019 [P0] Canary contents and hidden evaluator details are represented only through references plus digests or leak-veto outcomes [Evidence: closed canary payloads reject prose in protected reference fields and accept system-token references] [Test: Vitest 15/15 passed]
- [x] CHK-020 [P0] Promotion events reference external transition authorization and cannot derive authorization from their own score or canary payload [Evidence: `transition-authorization:` reference rule plus real gateway proof; phase-014 authenticity obligation documented] [Test: Vitest 15/15 passed]
- [x] CHK-021 [P1] Evaluator feedback, candidate aliases, and evidence references do not expose protected canary material to candidate generation [Evidence: closed candidate/evaluator/canary families reject cross-family and mutable fields] [Test: Vitest 15/15 passed]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-022 [P1] The phase documents, decision record, and implementation summary agree on the common-service ownership boundary and reducer handoff [Evidence: strict packet validation] [Test: Vitest 15/15 passed]
- [x] CHK-023 [P2] The leaf records the contract surface the parent map and three downstream variant plans must consume without widening it [Evidence: implementation-summary sibling contract; downstream edits remain outside this lane] [Test: Vitest 15/15 passed]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-024 [P1] This implementation writes only the new schema module, its unit suite, and this leaf's docs; generated metadata is handled by deterministic tooling [Evidence: scoped status audit] [Test: Vitest 15/15 passed]
- [x] CHK-025 [P2] The implementation preserves additive-dark and path-scoped rollback constraints [Evidence: no writer integration, golden module, or frozen substrate mutation] [Test: Vitest 15/15 passed]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 contract check passes, the typed envelope and event catalog are reviewed against
the imported phase-006 and phase-012 contracts, upcaster behavior is deterministic and fail-closed, all three variants
reuse the shared service vocabulary, and strict validation reports no blocking error. Reducer and projection behavior
is intentionally verified by the next sibling rather than this child.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off after the 35-stem schema catalog, compatibility matrix, replay fixtures, authorization path, and downstream
reuse boundary passed the recorded verification gates.
<!-- /ANCHOR:sign-off -->
