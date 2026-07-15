---
title: "Checklist: stopping clocks (006 phase 008 child 003)"
description: "Blocking verification checklist for independent stopping-clock conditions, deterministic arbitration, per-mode configuration, and termination-cause recording."
trigger_phrases:
  - "stopping clocks checklist"
  - "termination clock verifier"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
    last_updated_at: "2026-07-15T15:24:30Z"
    last_updated_by: "codex"
    recent_action: "Defined P0 verification for clock conditions, ordering, and cause logging"
    next_safe_action: "Execute the five-clock permutation, replay, and mode-profile matrices"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Stopping Clocks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 008 child 003. Every item is a check the paired verifier runs
before authority can move. The report pins candidate and BASE SHAs, source-interface and mode-profile versions, replay
fingerprints, fixture manifests, commands, exit codes, and discovery counts; zero discovered tests or clock cases fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-004 budget, phase-007 novelty, sibling-001 coverage, sibling-002 cycle, ledger, and durable-dispatch source interfaces are versioned and pinned
- [ ] CHK-002 [P0] The supported-mode inventory, five clock kinds, termination taxonomy, evaluation boundaries, same-batch rank, and event namespace are frozen
- [ ] CHK-003 [P1] The candidate worktree is clean and pinned to BASE; the additive-dark authority boundary and rollback switch are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Source adapters validate and translate owner outputs without duplicating budget, novelty, coverage, or cycle business logic
- [ ] CHK-005 [P1] Clock/profile/event schemas use canonical serialization, stable identities, fixed-point numeric inputs, explicit versions, and no wall-clock comparison in replay
- [ ] CHK-006 [P1] The arbiter contains no mode-specific thresholds or aggregate score that can suppress an independently fired clock
- [ ] CHK-007 [P2] Changes remain scoped to stopping-clock composition, terminal cause recording, admission wiring, and shadow compatibility
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Budget fixtures fire independently for token, fixed-precision cost, iteration, and budgeted-wall-time exhaustion at every governing scope; missing or unreconciled state fails closed
- [ ] CHK-009 [P0] Novelty fixtures cover warm-up, decay, both floors, patience, paraphrases, duplicate sources, new communities, new independent evidence, stale watermarks, resume, and replay
- [ ] CHK-010 [P0] Coverage fires only for a fresh sibling-001 `STOP_ALLOWED`; partial, blocked, stale, expanded-universe, and `INCOMPLETE_LIMIT` certificates do not fire
- [ ] CHK-011 [P0] Wall time fires from monotonic elapsed duration at the explicit mode deadline and remains a distinct cause from `budget_exhausted:wall_time`
- [ ] CHK-012 [P0] Cycle fires only for a fresh confirmed sibling-002 event meeting severity/persistence; suspected, cleared, progress-broken, stale, and not-evaluable cases do not fire
- [ ] CHK-013 [P0] Every single-clock case and all ordered clock pairs choose the smallest effective elapsed time regardless of adapter evaluation order
- [ ] CHK-014 [P0] Every same-boundary pair and all-clock tie use `budget > wall_time > cycle > novelty_decay > coverage` and record all non-primary co-causes
- [ ] CHK-015 [P0] Incremental execution, resume, and full replay reproduce observation hashes, primary cause, co-causes, comparator trace, terminal event, and final projection
- [ ] CHK-016 [P0] Duplicate terminal delivery is idempotent; conflicting winner, profile, source, watermark, class, or trace at one terminal identity fails closed
- [ ] CHK-017 [P0] Mixed watermarks, non-monotonic elapsed time, unknown source/profile versions, missing required clocks, and stale projections never produce `no_stop` or `converged`
- [ ] CHK-018 [P0] The termination taxonomy is exact: coverage=`converged`, budget/wall-time=`incomplete`, novelty=`diminishing_returns`, cycle=`cycle_detected`
- [ ] CHK-019 [P0] A fired clock denies every new dispatch while preserving receipt-linked settlement, salvage/cancellation, final coverage gaps, blockers, and last-authorized-work identity
- [ ] CHK-020 [P0] A manifest-driven matrix proves every supported mode has all five adapters, explicit deterministic parameters, deadline, cycle action, evaluation points, and shadow/authority state
- [ ] CHK-021 [P0] Legacy council fixtures prove `decision`, `trace`, blockers, score, snapshot behavior, and bridge payload remain unchanged while shadow artifacts are emitted
- [ ] CHK-022 [P1] Crash-before-terminal-write, crash-after-write, source-event duplication, late coverage expansion, cycle clearing, and unsettled-effect recovery preserve one durable outcome
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P1] The implementation manifest maps every requirement to code, positive and negative fixtures, replay evidence, and a named verifier command
- [ ] CHK-024 [P1] All clock consumers use the shared terminal projection; no mode keeps an unrecorded alternate stop path or silently relabels exhaustion as convergence
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-025 [P1] Every clock observation and terminal event passes transition authorization, validates namespace/run lineage, and rejects forged source identities or cross-run watermarks
- [ ] CHK-026 [P2] Termination logs retain evidence references and typed balances without leaking prompt bodies, credentials, provider secrets, or unrestricted raw executor output
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P1] The per-mode profile reference documents each condition, threshold/window/deadline, evaluation boundary, termination class, tie rank, and versioning rule
- [ ] CHK-028 [P2] Operator-facing diagnostics distinguish primary cause, co-causes, convergence, incomplete exhaustion, diminishing returns, cycling, blockers, and in-flight settlement state
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-029 [P1] Clock adapters, arbiter, profiles, projections, events, tests, and fixtures follow existing system-deep-loop runtime ownership without duplicate mode-local arbiters
- [ ] CHK-030 [P1] Path-scoped commits keep source adapters separable from authority/cutover work and preserve rollback to the legacy council path
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all P0 checks are green, every supported mode has a complete versioned profile, each clock can fire
independently, all ordering and same-boundary permutations reproduce one primary cause plus complete co-cause evidence, replay
is byte-stable, terminal admission is fail-closed, and shadow wiring leaves current council authority unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier binds the report to the exact candidate SHA, source and profile versions, fixture-manifest
digest, replay fingerprint, and non-zero test discovery; every P0 check passes and no unexpected tracked mutation remains.
<!-- /ANCHOR:sign-off -->
