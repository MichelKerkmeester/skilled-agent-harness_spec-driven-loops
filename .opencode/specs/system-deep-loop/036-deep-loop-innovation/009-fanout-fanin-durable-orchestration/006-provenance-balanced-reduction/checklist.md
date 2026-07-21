---
title: "Checklist: Provenance-Balanced Reduction"
description: "Blocking verification checklist for deterministic provenance-balanced reduction, retained lineage, contested merges, and additive-dark fan-in integration."
trigger_phrases:
  - "provenance-balanced reduction checklist"
  - "source-balanced fan-in checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
    last_updated_at: "2026-07-21T08:45:00Z"
    last_updated_by: "codex"
    recent_action: "Completed source-dominance, contested-merge, replay, and scope verification"
    next_safe_action: "Preserve shadow-only authority until a later activation gate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/provenance-reduction/"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/provenance-reduction.vitest.ts"
    completion_pct: 100
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

- [x] CHK-001 [P0] The approved BASE, additive-dark authority boundary, reducer/normalizer/balance policy versions, and canonical corpus are pinned [File: `runtime/lib/provenance-reduction/types.ts`]
- [x] CHK-002 [P0] Ledger, result-envelope, logical-branch, fan-in, partial-failure, and blinded-adjudication boundary fields are mapped without inventing a hard sibling planning dependency [File: `runtime/lib/provenance-reduction/reducer.ts`]
- [x] CHK-003 [P1] The run-2 prototype, blinded-adjudication phase, and phase-tree manifest are recorded as design inputs [File: `spec.md`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] Reducer code is pure over canonical inputs and pinned policy; no wall clock, arrival order, worker order, mutable global state, or filesystem enumeration affects output [Test: `provenance-reduction.vitest.ts`, permutation case]
- [x] CHK-005 [P1] Changes stay within this phase's reducer/evidence boundary; adjacent orchestration, novelty, convergence, and authority logic is not reimplemented [Evidence: scoped `git status --short`]
- [x] CHK-006 [P2] Canonicalization and weighting code documents durable policy invariants without embedding packet or requirement labels in production comments [Evidence: comment-hygiene checker exit 0]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Complete provenance is accepted; missing, malformed, mismatched, empty-key, or unsupported provenance fails closed before reduction [Test: `provenance-reduction.vitest.ts`, malformed and forged provenance cases]
- [x] CHK-008 [P0] Golden canonicalization vectors cover URL/name, case, path, serialization, and item-type rules under the pinned normalizer version [Test: `provenance-reduction.vitest.ts`, repository URL/name case]
- [x] CHK-009 [P0] Exact duplicates produce one canonical item while retaining every distinct contributor, payload digest, leaf rank, branch lineage, and evidence locator [Test: `provenance-reduction.vitest.ts`, 20-copy duplicate flood]
- [x] CHK-010 [P0] Contradictory exact-key payloads form conflict sets and uncertain equivalence stays separate without a stable blinded merge verdict [Test: `provenance-reduction.vitest.ts`, conflict and fail-closed cases]
- [x] CHK-011 [P0] Unequal-volume fleets allocate every eligible source/model-family bucket its rational policy share before any bucket receives an extra slot [Test: `provenance-reduction.vitest.ts`, 9:1 rational weight]
- [x] CHK-012 [P0] Duplicate floods, retries, same-model multi-branch fleets, and cloned sources cannot exceed occupancy caps or increment effective support more than once per source unit [Test: `provenance-reduction.vitest.ts`, clone and cap cases]
- [x] CHK-013 [P0] Completion, enumeration, worker, resume, and salvage permutations produce byte-identical canonical outputs and receipt digests [Test: `provenance-reduction.vitest.ts`, three permutations]
- [x] CHK-014 [P0] Stable blinded adjudication permits only the adjudicated merge; unstable, inconclusive, missing, self-source, or identity-leaking cases fail closed [Evidence: `provenance-reduction.vitest.ts` plus blinded-adjudication verdict safeguards]
- [x] CHK-015 [P0] Every input is accounted for exactly once as selected, merged, conflicted, deferred, invalid, or excluded, with a provenance-linked disposition [Test: `provenance-reduction.vitest.ts`, disposition cardinality]
- [x] CHK-016 [P0] Minority-source and unique valid items survive or receive an explicit quota/capacity deferral; no item disappears due to low source volume [Test: `provenance-reduction.vitest.ts`, minority and deferral cases]
- [x] CHK-017 [P0] Partial-survivor matrices expose expected, admitted, failed, timed-out, cancelled, invalid, and excluded sources and never report full-fleet consensus [Test: `provenance-reduction.vitest.ts`, degraded survivor]
- [x] CHK-018 [P0] Ledger replay reconstructs bucket assignments, dedup groups, contributor sets, conflicts, adjudication, schedule, output, and receipt without non-ledger state [Test: `provenance-reduction.vitest.ts`, `replayProvenanceLedger`]
- [x] CHK-019 [P0] Shadow integration emits complete evidence, compares legacy behavior, and cannot change fan-in authority; disabling it requires no ledger rewrite [Test: `provenance-reduction.vitest.ts`, parity and authority]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P1] Requirement-to-test traceability covers REQ-001 through REQ-014 with positive, negative, and replay evidence where applicable [Evidence: `tasks.md` and provenance-reduction.vitest.ts]
- [x] CHK-021 [P1] The reducer emits an auditable disposition for every admitted and rejected item and a complete partial-survivor manifest [File: `runtime/lib/provenance-reduction/types.ts`]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P1] Adjudication requests contain no producer/model/position identity, and canary identity fields prove the judge boundary rejects leakage [Test: `provenance-reduction.vitest.ts`, judge request deny-list]
- [x] CHK-023 [P2] Untrusted leaf payloads cannot inject balance keys, policy versions, ledger identities, contributor provenance, or canonical serialization fields [Test: `provenance-reduction.vitest.ts`, source relabeling]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-024 [P2] Reducer, normalizer, balance policy, provenance/disposition schema, replay contract, and rollback switch are documented for mode consumers [File: `implementation-summary.md` and exported contracts]
- [x] CHK-025 [P2] The prototype, blinded-adjudication phase, and phase manifest citations remain attached to the invariants they support [File: `spec.md` and `plan.md`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] Reducer, policy, fixtures, and evidence changes remain dependency-closed and path-scoped on the pinned worktree branch [Evidence: scoped `git status --short` includes only owned paths]
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

Signed off when the verifier binds reducer and policy digests, canonical corpus, replay fingerprint, command exits,
fixture counts, effective-source counts, output/receipt digests, and a scoped status delta to the final evidence.
<!-- /ANCHOR:sign-off -->
