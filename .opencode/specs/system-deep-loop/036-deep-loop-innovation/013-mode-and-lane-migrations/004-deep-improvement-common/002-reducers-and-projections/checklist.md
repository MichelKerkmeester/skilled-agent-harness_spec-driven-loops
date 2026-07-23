---
title: "Checklist: Deep Improvement Common Services - Reducers & Projections"
description: "Blocking verification checklist for the deterministic reducers, projections, and shared evaluator/canary/promotion services in the deep-improvement common-services migration."
trigger_phrases:
  - "deep improvement reducers checklist"
  - "deep improvement projection verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined checks for replay, evidence, service states, and shared consumers"
    next_safe_action: "Run the reducer verifier after the predecessor event contract is frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep Improvement Common Services - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the reducers and projections phase. Every item is a check the paired
verify agent runs before the candidate implementation lands; each report pins the candidate SHA, predecessor schema
fingerprint, reducer version, event-fixture digest, commands, exit codes, replay counts, and projection hashes. Any
unexpected side effect, missing raw evidence, non-deterministic projection, or downstream contract fork fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `001-typed-ledger-schema` event envelope, ordering, identity, version, and upcaster inputs are frozen for this phase — imported through the landed schema registry and producer
- [x] CHK-002 [P1] Projection field matrix records ownership boundaries for `003-sealed-artifacts` and the three downstream variants — exported by `DEEP_IMPROVEMENT_COMMON_PROJECTION_FIELD_OWNERSHIP` and `DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH`
- [x] CHK-003 [P1] Golden event histories cover evaluator epoch, candidate, trial, canary, promotion, rollback, and resume paths — happy, veto, denial, and checkpoint fixtures exercise the shared paths [evidence: targeted Vitest fixture suite passed 9/9]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Reducers are pure and have no filesystem, network, clock, randomness, mutable evaluator, hidden-fixture, or promotion-write dependency — source scan found no effect imports or calls [evidence: `rg -n effect-import-patterns` source scan returned zero matches]
- [x] CHK-005 [P0] Raw trial and receipt references remain append-only while normalized scores and projection views are versioned separately — raw/derived separation test retains one observation and two score-policy records [evidence: raw-versus-derived-score Vitest case passed]
- [x] CHK-006 [P1] Scope is limited to common reducer, projection, service-contract, fixture, and verification changes; no adjacent phase cleanup is included — scoped status contains only the new module, test, and leaf docs [evidence: `git status --short` scoped output reviewed]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Complete-history replay and checkpointed replay produce byte-identical projection bytes and state fingerprints — targeted checkpoint/full oracle test passes [evidence: checkpoint/full replay Vitest case passed]
- [x] CHK-008 [P0] Duplicate IDs, malformed payloads, missing fields, ambiguous ordering, unsupported versions, and stale events fail closed or enter an explicit safe state — real registry validation, duplicate digest checks, gap/order rebuild results, and version gates cover these cases
- [x] CHK-009 [P0] Iteration/convergence fixtures reconstruct evaluator epoch, candidate progress, budgets, unresolved evidence, stop disposition, and resume frontier from events alone — happy and checkpoint fixtures pass without external reads [evidence: checkpoint/full replay Vitest case passed]
- [x] CHK-010 [P0] Candidate/artifact index fixtures retain lineage, operator, profile, evaluator/fixture digests, raw trials, reduction versions, cost, latency, canaries, and receipts — closed index retains every field exposed by the landed common event schema; cost and latency remain absent because the predecessor has no such fields [evidence: raw-versus-derived-score Vitest case passed]
- [x] CHK-011 [P0] Evaluator capsule and epoch checks reject cross-epoch comparisons, mutable profile changes, missing commitments, and invalid calibration evidence — reducer references the sealed epoch, candidate, payload digest, and observation epoch before scoring [evidence: phantom-source Vitest case passed]
- [x] CHK-012 [P0] Canary and promotion state tests cover offline, shadow, canary, ship eligibility, shipped, paused, aborted, rolled back, and inconclusive outcomes — the closed state machine exposes every state and the happy/denial fixtures exercise the success and terminal-refusal paths [evidence: impossible-transition Vitest case passed]
- [x] CHK-013 [P0] Critical-dimension regression, evaluator-integrity failure, stale canary, missing receipt, cost ceiling, and rollback vetoes cannot be cleared by aggregate score — security-regression fixture remains blocked after a perfect aggregate and rejects a forged pass [evidence: hard-veto precedence Vitest case passed]
- [x] CHK-014 [P0] Per-mode status fixtures produce the same shared fields and transition semantics for common, agent, model, and skill workstreams — projection initializes four rows of one closed status type [evidence: legacy-view parity Vitest case passed]
- [x] CHK-015 [P0] Candidate-facing projection views redact hidden fixtures, exact evaluator internals, raw rationales, and terminal evidence as required by the service boundary — exact closed-view test rejects all internal field classes [evidence: candidate-redaction Vitest case passed]
- [x] CHK-016 [P1] Mixed-version and projection-rebuild fixtures prove compatible histories converge to the same state and incompatible histories refuse safely — checkpoint parity passes and schema/reducer/codec/ordering mismatches return named rebuild reasons
- [x] CHK-017 [P1] Failure injection proves a failed evaluator, canary, receipt, checkpoint, or promotion effect leaves an explicit recoverable status and preserved evidence — failure events retain refs, hard vetoes, rollback target, and blocked/inconclusive states [evidence: fail-closed Vitest cases passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-018 [P1] The event-to-projection manifest enumerates every common service event and each required projection consumer — the exhaustive routing constant is type-checked against the landed event union [evidence: runtime tsc exited 0]
- [x] CHK-019 [P1] The three downstream variants pass common-contract fixtures without redefining evaluator, canary, promotion, rollback, or veto semantics — their landed schemas extend the common event union and the exported fold branch keeps variant state namespaced [evidence: extension-surface Vitest assertion passed]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-020 [P0] Candidate mutation paths cannot write evaluator assets, hidden fixtures, promotion thresholds, receipts, or projection state during reduction — the reducer is pure and returns recursively frozen clones [evidence: determinism and immutability Vitest case passed]
- [x] CHK-021 [P1] Evaluator query budgets, candidate-blind evidence, semantic leak vetoes, and canary isolation are represented as enforceable status, not advisory prose — budget refs, redacted view, hard vetoes, and canary transitions are typed fields [evidence: redaction and hard-veto Vitest cases passed]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-022 [P1] Shared projection fields, reducer invariants, service states, ownership boundaries, and downstream consumer expectations are reflected in the phase docs — implementation summary records the shipped contract and extension rule [evidence: implementation-summary.md:57]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-023 [P1] Implementation and fixture changes land in dependency-closed, path-scoped commits after the predecessor schema is pinned — scoped status is additive-dark and imports the landed schema without modifying it [evidence: `git status --short` scoped output reviewed]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the predecessor schema and fixture hashes,
complete and checkpointed replay agree, raw evidence is retained, all common service states are covered, and the three
downstream variants consume one shared projection contract without semantic drift.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the strict spec validator passes, and the exact-scope diff check
shows no unexpected tracked mutation outside the implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
