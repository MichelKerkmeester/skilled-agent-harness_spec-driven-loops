---
title: "Checklist: Model Benchmark typed ledger schema"
description: "Checklist for the Model Benchmark typed ledger schema phase: verify the shared envelope specialization, event vocabulary, field-level types, immutable evidence lineage, compatibility hooks, and the reducer handoff boundary."
trigger_phrases:
  - "Model Benchmark typed ledger schema checklist"
  - "model-benchmark event schema verification"
  - "typed ledger model benchmark gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T22:59:00Z"
    last_updated_by: "opencode"
    recent_action: "Prepared the Model Benchmark schema gate with pending evidence"
    next_safe_action: "Run the shared-envelope and event-union completeness checks"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Model Benchmark Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Model Benchmark typed-ledger-schema phase. Every item is a
planned contract check before a runtime schema or writer is accepted; the eventual report must pin the shared-contract
versions, candidate SHA, event-union revision, schema hashes, commands, exit codes, and any deliberately blocked item.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-006 transition authorization and phase-012 shared event contracts are identified with frozen version references
- [ ] CHK-002 [P0] The mode-004 deep-improvement-common ownership boundary is recorded for evaluator, canary, calibration, receipt, budget, and promotion services
- [ ] CHK-003 [P1] The exact phase adjacency line names predecessor `none` and successor `002-reducers-and-projections`
- [ ] CHK-004 [P1] The authored contract remains limited to the target folder and the four requested files
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The Model Benchmark envelope preserves every shared authorization, sequence, causal, correlation, hash-chain, schema-version, and replay-fingerprint field
- [ ] CHK-006 [P1] Every mode-specific payload has a named discriminant, stable aggregate identity, and explicit required-versus-optional field treatment
- [ ] CHK-007 [P1] No event definition duplicates shared evaluator, canary, calibration, promotion, receipt, budget, lock, or adjudication authority
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] The closed event union covers run declaration, capsule/workload sealing, design, trial admission, dispatch, completion, failure, unknown, invalidation, and run lifecycle facts
- [ ] CHK-009 [P0] Scoring-matrix identity includes candidate, model/build, execution path, task instance/family, paired block, protocol, seed, perturbation, and workload profile
- [ ] CHK-010 [P0] Trial evidence retains raw output and input digests, score vectors, evaluator contract hash, normalized usage, latency, receipt references, and explicit failure or unknown status
- [ ] CHK-011 [P0] Task and canary lineage records source cutoff, proposer/oracle visibility, first exposure, contamination evidence, disclosure, retirement, replacement, and oracle correction
- [ ] CHK-012 [P0] Judge evidence records blinded identity, model family/build, prompt/context/tool hashes, calibration slice, order/style probes, uncertainty, abstention, and disagreement state
- [ ] CHK-013 [P0] Validity events distinguish plan, derived card, required unknown, invalid, and valid states without silently converting uncertainty into a score
- [ ] CHK-014 [P0] Parallel trial completion, retry, late evidence, and invalidation preserve stable IDs and append-only sequence semantics independent of completion order
- [ ] CHK-015 [P0] Version fixtures cover exact, compatible, migrate, pin-old-runtime, and blocked outcomes; upcasters preserve source payload hashes and emit transformation provenance
- [ ] CHK-016 [P0] Canonical serialization and event ordering are deterministic for the same sealed evidence set and replay fingerprint
- [ ] CHK-017 [P0] The final event boundary is `selection_evidence_sealed` plus `selection_reduction_requested`; no reducer state, projection, policy result, or gauge is defined here
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-018 [P1] A requirement-to-event matrix maps REQ-001 through REQ-010 to event types, field types, compatibility rules, and verification evidence
- [ ] CHK-019 [P1] The research obligations from the model-benchmark registry are traceable to the planned vocabulary: paired trials, private workload, sealed lineage, calibration, validity, cost/latency, and task-conditional policy inputs
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-020 [P1] Raw outputs, prompts, provider credentials, and sensitive workload contents are referenced by controlled artifact digests or approved refs rather than copied into event payloads
- [ ] CHK-021 [P2] Unknown, contaminated, invalid, or judge-disagreement states cannot be coerced into a promotable success or silently erased by an upcaster
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-022 [P1] spec.md, plan.md, tasks.md, and checklist.md use the leaf mold's frontmatter, marker comments, anchors, and section order
- [ ] CHK-023 [P2] The phase documents name `002-reducers-and-projections` as the next sibling and keep reducer ownership out of this phase
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-024 [P1] Only the four requested authored files exist in the target folder; description.json and graph-metadata.json remain tooling-generated
- [ ] CHK-025 [P2] No research input, parent program document, sibling phase, or generated metadata was modified by this authoring pass
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
