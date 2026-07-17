---
title: "Checklist: Deep Research shadow parity"
description: "Checklist for the Deep Research shadow-parity phase: prove event-for-event and projection parity between the typed ledger path and legacy emitter across fresh, failure, resume, synthesis, and memory-save lifecycles before any authority cutover."
trigger_phrases:
  - "Deep Research shadow parity checklist"
  - "deep-research parity gate"
  - "mode 010 phase 009 checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
    last_updated_at: "2026-07-15T15:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking parity checklist for Deep Research shadow execution"
    next_safe_action: "Run the fixture matrix and attach receipts to each parity result"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Research Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking shadow-parity verifier contract for Deep Research phase 009. Every item is a check the paired
verify agent runs before the candidate can hand parity evidence to `007-rollback-and-mode-gate`; each report pins BASE,
contract and schema digests, fixture IDs, both stream digests, projection fingerprints, commands, exit codes, and diff
dispositions. A shadow result never authorizes an authority cutover. Any unexplained semantic difference, missing receipt,
nondeterministic replay, or unexpected tracked mutation fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-012 shared mode-contract digest, phase-014 shadow-framework interface, and parent compatibility-bridge contract are pinned in the candidate report
- [ ] CHK-002 [P0] The legacy Deep Research lifecycle and reducer boundaries are inventoried for init, gather/analyze, convergence, synthesis, resume, and memory-save handoff
- [ ] CHK-003 [P1] BASE, run manifest, source snapshots, model/tool fingerprints, input state, budget lease, fixture IDs, and output paths are frozen before dual execution
- [ ] CHK-004 [P1] The canonical event tuple, diff taxonomy, receipt schema, and volatility allowlist are reviewed before any difference is classified as tolerated
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Changes are scoped to the Deep Research shadow contract; no adjacent mode implementation, generic framework rewrite, authority flip, or legacy-writer removal is included
- [ ] CHK-006 [P1] The shadow adapter preserves stable logical run, branch, step, claim, receipt, and artifact identities and does not create a second authority path
- [ ] CHK-007 [P1] Unknown event fields and non-allowlisted volatility fail closed rather than being dropped from comparison
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Fresh init and single-iteration fixtures produce equal canonical event count, order, event types, identities, causal links, stable payload digests, and projection fingerprints
- [ ] CHK-009 [P0] Multi-branch plan and gather/analyze fixtures preserve branch IDs, plan dependencies, query/source records, branch lifecycle, and deterministic next-focus selection
- [ ] CHK-010 [P0] Evidence-admission fixtures match admit, degrade, quarantine, contested, and blocked dispositions; poisoned or malformed evidence never enters trusted state
- [ ] CHK-011 [P0] Claim, contradiction, supersession, source-version, and evidence-edge fixtures match event-for-event without rewriting prior observations
- [ ] CHK-012 [P0] Convergence fixtures match trusted evidence yield, blockers, terminal class, and incomplete-on-exhaustion behavior; raw novelty alone cannot produce converged
- [ ] CHK-013 [P0] Synthesis fixtures match materialized claim-ledger inputs, citation and derivation edges, artifact digest, and terminal synthesis event
- [ ] CHK-014 [P0] Crash and resume fixtures match reuse, re-execute, invalidate, reconcile, or block decisions, event tails, lease continuity, and final projections against fresh continuation
- [ ] CHK-015 [P0] Source-refresh fixtures match result-ID and content-digest deltas, affected-claim invalidation, unaffected-claim stability, and change-report projection
- [ ] CHK-016 [P0] Memory-save handoff fixtures match request, artifact references, receipt references, terminal event, and failure disposition without shadow publication
- [ ] CHK-017 [P0] Every required fixture has zero unexplained semantic differences; any tolerated transport field is typed, allowlisted, and recorded with a reason
- [ ] CHK-018 [P0] Deterministic replay of both canonical streams reproduces their event and projection fingerprints from retained frozen inputs
- [ ] CHK-019 [P0] The parity receipt is bound to BASE, schema versions, reducer/projection versions, comparator configuration, fixture ID, stream digests, projection fingerprints, and diff report
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-020 [P1] The lifecycle event map accounts for every init, branch, source, admission, claim, contradiction, reducer, next-focus, convergence, synthesis, resume, and memory-save boundary
- [ ] CHK-021 [P1] The receipt and handoff contract explicitly states that parity evidence is not a cutover certificate and that legacy remains authoritative
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P1] Shadow execution cannot publish canonical state, alter live authority, bypass transition authorization, allocate an untracked new lease, or write outside isolated output
- [ ] CHK-023 [P2] Source captures, prompts, model/tool fingerprints, receipts, and artifact digests are content-bound and do not rely on mutable live references during replay
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P1] The phase outcome, parity receipt fields, failure dispositions, and non-authoritative boundary are reflected in the packet docs and successor handoff
- [ ] CHK-025 [P2] Any accepted volatility exception has a durable reason, scope, owner, and invalidation trigger in the comparator contract
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Candidate shadow artifacts and receipts are isolated from canonical runtime state and the final diff contains only intended phase-scoped files
- [ ] CHK-027 [P2] The parity report records commands, exit codes, fixture counts, stream digests, and no unexpected tracked mutation
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, all required lifecycle fixtures have event-for-event and
projection parity, all differences are either absent or explicitly non-semantic and allowlisted, every parity receipt is
reproducible and BASE-bound, and the non-authoritative legacy path remains intact. This evidence may be consumed by the
successor mode gate; it cannot authorize authority cutover by itself.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 parity contract, the parity receipt is attached to the candidate report, and
the isolated shadow run shows no unexpected tracked mutation or canonical-state write.
<!-- /ANCHOR:sign-off -->
