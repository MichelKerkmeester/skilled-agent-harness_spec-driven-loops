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
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Captured the common-service event vocabulary boundary and sibling ordering"
    next_safe_action: "Define envelope fields and versioned event payloads for shared service runs"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

- [ ] CHK-001 [P0] The phase-006 transition-authorized ledger core is identified with its envelope, authorization, receipt, and replay obligations
- [ ] CHK-002 [P0] The phase-012 shared event contracts are identified with their naming, identity, causation, sequence, and versioning obligations
- [ ] CHK-003 [P1] The common evaluator, canary, and promotion service boundaries are mapped to all three downstream variants
- [ ] CHK-004 [P1] The child adjacency is recorded: predecessor none (first sibling) and successor `002-reducers-and-projections`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Every event in the catalog has a typed payload, stable event name, owner, version policy, and explicit required/optional field rule
- [ ] CHK-006 [P0] Raw observations, normalized scores, canary evidence, and promotion decisions are separate immutable event concepts
- [ ] CHK-007 [P1] No reducer, projection, frontier, gauge, read-model, or materialized-state behavior is hidden in the schema definitions
- [ ] CHK-008 [P1] Large artifacts are digest-bound references and do not force unbounded raw traces into every ledger event
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Serialize and validate the envelope for every run, candidate, evaluator, score, canary, promotion, quarantine, abstention, and terminal event family
- [ ] CHK-010 [P0] Replay a complete candidate lineage from run start through evaluator observations, score events, canary outcomes, and promotion or quarantine
- [ ] CHK-011 [P0] Preserve raw evaluator observations while applying a second normalization version; no prior observation or score is overwritten
- [ ] CHK-012 [P0] Reject promotion when canary leakage, drift, metamorphic failure, insufficient evidence, or external authorization is missing or denied
- [ ] CHK-013 [P0] Verify upcaster fixtures for current, supported historical, unknown, missing-field, ambiguous, and lossy payload versions
- [ ] CHK-014 [P1] Verify the upcaster path and target schema version contribute deterministically to the replay fingerprint
- [ ] CHK-015 [P1] Verify all three downstream variants consume the common evaluator, canary, and promotion event types without copied definitions
- [ ] CHK-016 [P1] Verify unsupported variant extensions fail closed and cannot masquerade as common-service events
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-017 [P0] The reviewed event catalog enumerates every shared Deep Improvement Common Services event and identifies its producer and consumer boundary
- [ ] CHK-018 [P1] Every requirement in spec.md maps to one plan step, task, checklist item, and planned evidence artifact
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-019 [P0] Canary contents and hidden evaluator details are represented only through authorized sealed references or leak-veto outcomes
- [ ] CHK-020 [P0] Promotion events reference external transition authorization and cannot derive authorization from their own score or canary payload
- [ ] CHK-021 [P1] Evaluator feedback, candidate aliases, and evidence references do not expose protected canary material to candidate generation
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-022 [P1] The four phase documents agree on the common-service ownership boundary and the reducer handoff to `002-reducers-and-projections`
- [ ] CHK-023 [P2] The phase outcome is reflected in the parent mode-and-lane migration map and the three downstream variant plans
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-024 [P1] This planning child writes only `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`; generated metadata is handled by deterministic tooling
- [ ] CHK-025 [P2] Any later implementation lands in path-scoped commits with the additive-dark and rollback constraints preserved
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

Sign-off remains pending for this Planned phase. The implementation verifier may sign only after the schema catalog,
compatibility matrix, replay fixtures, and downstream reuse review are recorded in the phase evidence report.
<!-- /ANCHOR:sign-off -->
