---
title: "Checklist: Model Benchmark typed ledger schema"
description: "Completed verification checklist for the additive-dark Model Benchmark typed ledger schema and its closed extension of deep-improvement-common."
trigger_phrases:
  - "Model Benchmark typed ledger schema checklist"
  - "model-benchmark event schema verification"
  - "typed ledger model benchmark gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T22:59:00Z"
    last_updated_by: "opencode"
    recent_action: "Verified the combined registry, adversarial guards, compatibility, and reducer boundary"
    next_safe_action: "Consume the immutable event union in 002-reducers-and-projections"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Model Benchmark Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist records the blocking verifier evidence for the Model Benchmark typed-ledger-schema phase. The
implementation summary pins the shared extension boundary, 67-stem union, targeted test result, skipped batched
typecheck, strict validation result, and additive-dark scope audit.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase-006 transition authorization and phase-012 shared event contracts are identified with frozen version references [Evidence: real substrate usage is recorded in `implementation-summary.md`]
- [x] CHK-002 [P0] The mode-004 deep-improvement-common ownership boundary is recorded for evaluator, canary, calibration, receipt, budget, and promotion services [Evidence: the common extension contract is recorded in `implementation-summary.md`]
- [x] CHK-003 [P1] The exact phase adjacency line names predecessor `none` and successor `002-reducers-and-projections` [Evidence: adjacency is recorded in `spec.md`]
- [x] CHK-004 [P1] The implementation remains limited to the new schema module, its unit test, and this leaf's docs [Evidence: scope audit is recorded in `implementation-summary.md`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] The Model Benchmark envelope preserves every shared authorization, sequence, causal, correlation, hash-chain, schema-version, and replay-fingerprint field [Evidence: the 67/67 authorized append/read test passed]
- [x] CHK-006 [P1] Every mode-specific payload has a named discriminant, stable aggregate identity, and explicit required-versus-optional field treatment [Evidence: closed field rules are recorded in `implementation-summary.md`]
- [x] CHK-007 [P1] No event definition duplicates shared evaluator, canary, calibration, promotion, receipt, budget, lock, or adjudication authority [Evidence: shared definitions are imported unchanged in `model-benchmark-ledger-schema.ts`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] The closed event union covers run declaration, capsule/workload sealing, design, trial admission, dispatch, completion, failure, unknown, invalidation, and run lifecycle facts [Evidence: all 32/32 mode-specific stems passed]
- [x] CHK-009 [P0] Scoring-matrix identity includes candidate, model/build, execution path, task instance/family, paired block, protocol, seed, perturbation, and workload profile [Evidence: matrix-drift rejection test passed in `model-benchmark-ledger-schema.vitest.ts`]
- [x] CHK-010 [P0] Trial evidence retains raw output and input digests, score vectors, evaluator contract hash, normalized usage, latency, receipt references, and explicit failure or unknown status [Evidence: all-stem fixtures passed in `model-benchmark-ledger-schema.vitest.ts`]
- [x] CHK-011 [P0] Task and canary lineage records source cutoff, proposer/oracle visibility, first exposure, contamination evidence, disclosure, retirement, replacement, and oracle correction [Evidence: lineage fixtures passed in `model-benchmark-ledger-schema.vitest.ts`]
- [x] CHK-012 [P0] Judge evidence records blinded identity, model family/build, prompt/context/tool hashes, calibration slice, order/style probes, uncertainty, abstention, and disagreement state [Evidence: judge fixtures passed in `model-benchmark-ledger-schema.vitest.ts`]
- [x] CHK-013 [P0] Validity events distinguish plan, derived card, required unknown, invalid, and valid states without silently converting uncertainty into a score [Evidence: validity fixtures passed in `model-benchmark-ledger-schema.vitest.ts`]
- [x] CHK-014 [P0] Parallel trial completion, retry, late evidence, and invalidation preserve stable IDs and append-only sequence semantics independent of completion order [Evidence: targeted Vitest passed 15/15, including matrix identity drift rejection]
- [x] CHK-015 [P0] Version fixtures cover exact, compatible, migrate, pin-old-runtime, and blocked outcomes; upcasters preserve source payload hashes and emit transformation provenance [Evidence: targeted Vitest passed 15/15, including compatibility and legacy upcast checks]
- [x] CHK-016 [P0] Canonical serialization and event ordering are deterministic for the same sealed evidence set and replay fingerprint [Evidence: targeted Vitest passed 15/15, including identical canonical and payload digests]
- [x] CHK-017 [P0] The final event boundary is `selection_evidence_sealed` plus `selection_reduction_requested`; no reducer state, projection, policy result, or gauge is defined here [Evidence: terminal stems are exported in `model-benchmark-ledger-types.ts`]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-018 [P1] The specification requirements map to event types, field types, compatibility rules, and verification evidence [Evidence: mapping is summarized in `implementation-summary.md`]
- [x] CHK-019 [P1] The research obligations from the model-benchmark registry are traceable to the implemented vocabulary: paired trials, private workload, sealed lineage, calibration, validity, cost/latency, and task-conditional policy inputs [Evidence: the 32-stem coverage is recorded in `implementation-summary.md`]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-020 [P1] Raw outputs, prompts, provider credentials, and sensitive workload contents are referenced by controlled artifact digests or approved refs rather than copied into event payloads [Evidence: mutable-body rejection tests passed in `model-benchmark-ledger-schema.vitest.ts`]
- [x] CHK-021 [P2] Unknown, contaminated, invalid, or judge-disagreement states cannot be coerced into a promotable success or silently erased by an upcaster
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-022 [P1] spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md use the leaf mold's frontmatter and marker conventions [Evidence: strict `validate.sh` result is recorded in `implementation-summary.md`]
- [x] CHK-023 [P2] The phase documents name `002-reducers-and-projections` as the next sibling and keep reducer ownership out of this phase
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-024 [P1] Authored changes are limited to this leaf's canonical docs; description.json and graph-metadata.json remain tooling-generated [Evidence: final scope audit is recorded in `implementation-summary.md`]
- [x] CHK-025 [P2] No research input, parent program document, or sibling phase was modified; generated metadata is refreshed only by the required tooling
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 contract check passes, the event vocabulary and field matrix are closed, version and
upcaster behavior is explicit, immutable evidence is sufficient for the next sibling's reducers, shared service ownership
has no duplicate authority, and strict spec validation reports no blocking authored-file errors.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the shared-envelope and Model Benchmark event contract, the reducer handoff is
scope-clean, the target-folder file ledger is clean, and the pinned validation report records the final result.
<!-- /ANCHOR:sign-off -->
