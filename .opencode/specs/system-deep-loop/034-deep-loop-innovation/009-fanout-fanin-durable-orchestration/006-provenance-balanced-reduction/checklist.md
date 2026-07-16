---
title: "Checklist: Provenance-Balanced Reduction"
description: "Blocking verification checklist for deterministic provenance-balanced reduction, retained lineage, contested merges, and additive-dark fan-in integration."
trigger_phrases:
  - "provenance-balanced reduction checklist"
  - "source-balanced fan-in checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking verifier contract for balanced provenance reduction"
    next_safe_action: "Run source-dominance, contested-merge, and replay fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Provenance-Balanced Reduction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for provenance-balanced reduction. The verifier pins the candidate
SHA, BASE SHA, reducer version, normalization registry digest, balance-policy digest, canonical input corpus, and
replay fingerprint. Every fixture records commands, exit codes, input/disposition counts, effective-source counts,
output digest, and receipt digest; zero discovered fixtures or unexpected tracked mutation fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The approved BASE, additive-dark authority boundary, reducer/normalizer/balance policy versions, and canonical corpus are pinned
- [ ] CHK-002 [P0] Ledger, result-envelope, logical-branch, fan-in, partial-failure, and blinded-adjudication boundary fields are mapped without inventing a hard sibling planning dependency
- [ ] CHK-003 [P1] The run-2 prototype, blinded-adjudication phase, and phase-tree manifest are recorded as design inputs
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Reducer code is pure over canonical inputs and pinned policy; no wall clock, arrival order, worker order, mutable global state, or filesystem enumeration affects output
- [ ] CHK-005 [P1] Changes stay within this phase's reducer/evidence boundary; adjacent orchestration, novelty, convergence, and authority logic is not reimplemented
- [ ] CHK-006 [P2] Canonicalization and weighting code documents durable policy invariants without embedding packet or requirement labels in production comments
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Complete provenance is accepted; missing, malformed, mismatched, empty-key, or unsupported provenance fails closed before reduction
- [ ] CHK-008 [P0] Golden canonicalization vectors cover URL/name, case, path, serialization, and item-type rules under the pinned normalizer version
- [ ] CHK-009 [P0] Exact duplicates produce one canonical item while retaining every distinct contributor, payload digest, leaf rank, branch lineage, and evidence locator
- [ ] CHK-010 [P0] Contradictory exact-key payloads form conflict sets and uncertain equivalence stays separate without a stable blinded merge verdict
- [ ] CHK-011 [P0] Unequal-volume fleets allocate every eligible source/model-family bucket its rational policy share before any bucket receives an extra slot
- [ ] CHK-012 [P0] Duplicate floods, retries, same-model multi-branch fleets, and cloned sources cannot exceed occupancy caps or increment effective support more than once per source unit
- [ ] CHK-013 [P0] Completion, enumeration, worker, resume, and salvage permutations produce byte-identical canonical outputs and receipt digests
- [ ] CHK-014 [P0] Stable blinded adjudication permits only the adjudicated merge; unstable, inconclusive, missing, self-source, or identity-leaking cases fail closed
- [ ] CHK-015 [P0] Every input is accounted for exactly once as selected, merged, conflicted, deferred, invalid, or excluded, with a provenance-linked disposition
- [ ] CHK-016 [P0] Minority-source and unique valid items survive or receive an explicit quota/capacity deferral; no item disappears due to low source volume
- [ ] CHK-017 [P0] Partial-survivor matrices expose expected, admitted, failed, timed-out, cancelled, invalid, and excluded sources and never report full-fleet consensus
- [ ] CHK-018 [P0] Ledger replay reconstructs bucket assignments, dedup groups, contributor sets, conflicts, adjudication, schedule, output, and receipt without non-ledger state
- [ ] CHK-019 [P0] Shadow integration emits complete evidence, compares legacy behavior, and cannot change fan-in authority; disabling it requires no ledger rewrite
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-020 [P1] Requirement-to-test traceability covers REQ-001 through REQ-014 with positive, negative, and replay evidence where applicable
- [ ] CHK-021 [P1] The reducer emits an auditable disposition for every admitted and rejected item and a complete partial-survivor manifest
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P1] Adjudication requests contain no producer/model/position identity, and canary identity fields prove the judge boundary rejects leakage
- [ ] CHK-023 [P2] Untrusted leaf payloads cannot inject balance keys, policy versions, ledger identities, contributor provenance, or canonical serialization fields
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P2] Reducer, normalizer, balance policy, provenance/disposition schema, replay contract, and rollback switch are documented for mode consumers
- [ ] CHK-025 [P2] The prototype, blinded-adjudication phase, and phase manifest citations remain attached to the invariants they support
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Reducer, policy, fixtures, and evidence changes land in dependency-closed, path-scoped commits on the pinned worktree branch
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, all inputs have exactly one provenance-linked disposition, cloned or
prolific sources cannot dominate, contested merges fail closed, every ordering permutation reproduces canonical bytes
and receipt digests, shadow execution leaves authority unchanged, and the applicable validate/build/test/replay gates
are green on the pinned candidate SHA.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier binds its report to the candidate SHA, BASE SHA, reducer and policy digests, canonical
corpus, replay fingerprint, command exits, fixture counts, effective-source counts, output/receipt digests, and a clean
`git diff-index --quiet HEAD --` result after verification.
<!-- /ANCHOR:sign-off -->
