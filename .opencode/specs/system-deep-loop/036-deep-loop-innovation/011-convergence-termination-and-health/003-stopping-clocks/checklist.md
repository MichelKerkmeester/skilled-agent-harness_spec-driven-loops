---
title: "Checklist: stopping clocks"
description: "Blocking verification checklist for independent stopping-clock conditions, deterministic arbitration, per-mode configuration, and termination-cause recording."
trigger_phrases:
  - "stopping clocks checklist"
  - "termination clock verifier"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
    last_updated_at: "2026-07-21T11:37:00Z"
    last_updated_by: "codex"
    recent_action: "Strict verification complete"
    next_safe_action: "Keep the module shadow-only until the separate program cutover gates pass"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Stopping Clocks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 011 child 003. Every item is a check the paired verifier runs
before authority can move. The report pins candidate and BASE SHAs, source-interface and mode-profile versions, replay
fingerprints, fixture manifests, commands, exit codes, and discovery counts; zero discovered tests or clock cases fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Budget, novelty, coverage, cycle, ledger, and durable-dispatch source interfaces are versioned and pinned [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; adapters import the shipped owner types/constructors/validators and profiles pin their versions.]
- [x] CHK-002 [P0] The supported-mode inventory, five clock kinds, termination taxonomy, evaluation boundaries, same-batch rank, and event namespace are frozen [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; closed constants and seven exact profiles reject altered bytes.]
- [x] CHK-003 [P1] The candidate baseline is captured and the path-scoped delta, additive-dark authority boundary, and rollback are recorded [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; a dirty shared-worktree baseline was captured before implementation; leaf status contains only allowed paths and `plan.md` keeps rollback on legacy authority.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] Source adapters validate and translate owner outputs without duplicating budget, coverage, or cycle business logic [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; budget uses typed decisions, coverage uses owner universe validation, cycle remints through the owner constructor, and novelty folds owner-projected yield only.]
- [x] CHK-005 [P1] Clock/profile/event schemas use canonical serialization, stable identities, fixed-point numeric inputs, explicit versions, and no wall-clock comparison in replay [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; canonical SHA-256 identities and integer basis-point tails pass replay hashes.]
- [x] CHK-006 [P1] The arbiter contains no mode-specific thresholds or aggregate score that can suppress an independently fired clock [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; thresholds live in profiles/adapters; arbitration compares elapsed time, cursor, and tie rank only.]
- [x] CHK-007 [P2] Changes remain scoped to stopping-clock composition, terminal cause recording, admission evidence, and shadow compatibility [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; path-scoped status lists only the new module, test, and this leaf's docs.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Budget fixtures fire independently for token, fixed-precision cost, iteration, and budgeted-wall-time exhaustion at every governing scope; missing or unreconciled state fails closed [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; 16 unit/scope combinations fire with exact causes; unreconciled and unknown versions are not evaluable.]
- [x] CHK-009 [P0] Novelty fixtures cover warm-up, decay, both floors, patience, paraphrases, duplicate sources, new communities, new independent evidence, stale watermarks, resume, and replay [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; complete/incomplete window, churn, duplicate, stale, reverse-order, resume, and replay assertions pass.]
- [x] CHK-010 [P0] Coverage fires only for a fresh sibling `STOP_ALLOWED`; partial, blocked, stale, expanded-universe, score-only, and `INCOMPLETE_LIMIT` certificates do not fire [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; dedicated owner-certificate fixtures cover every named state.]
- [x] CHK-011 [P0] Wall time fires from monotonic elapsed duration at the explicit mode deadline and remains a distinct cause from `budget_exhausted:wall_time` [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; the simultaneous boundary records both exact causes and ranks budget first.]
- [x] CHK-012 [P0] Cycle fires only for a fresh confirmed sibling event meeting severity/persistence; suspected, cleared, progress-broken, stale, forged, and not-evaluable cases do not fire [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; owner-remint and freshness fixtures cover all named states.]
- [x] CHK-013 [P0] Every single-clock case and all ordered clock pairs choose the smallest effective elapsed time regardless of adapter evaluation order [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; seven profiles execute 35 single-clock and 70 ordered-pair cases, with reversed observation order hashes equal.]
- [x] CHK-014 [P0] Every same-boundary pair and all-clock tie use `budget > wall_time > cycle > novelty_decay > coverage` and record all non-primary co-causes [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; 70 pair ties and seven all-clock ties assert the rank and complete co-cause set.]
- [x] CHK-015 [P0] Resume and full replay reproduce observation hashes, primary cause, co-causes, comparator trace, and terminal event [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; JSON resume/replay produces the identical event hash for all seven profiles.]
- [x] CHK-016 [P0] Duplicate terminal delivery is idempotent; a conflicting winner, profile, source, watermark, class, or trace at one terminal identity fails closed [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; exact retry returns the first receipt, changed payload bytes conflict, and event validation binds causes/traces to the self-hash.]
- [x] CHK-017 [P0] Mixed watermarks, non-monotonic elapsed time, unknown source/profile versions, missing required clocks, and stale projections never produce `no_stop` or `converged` [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; adapter and seven-profile fail-closed rows pass.]
- [x] CHK-018 [P0] The termination taxonomy is exact: coverage=`converged`, budget/wall-time=`incomplete`, novelty=`diminishing_returns`, cycle=`cycle_detected` [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; every single-clock row asserts the closed class mapping.]
- [x] CHK-019 [P0] A fired clock denies every new dispatch while preserving receipt-linked settlement, salvage/cancellation, final coverage gaps, blockers, and last-authorized-work identity [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; terminal events retain settle, salvage, cancel, gaps, blockers, and last work while admission is `reject_new_dispatch`.]
- [x] CHK-020 [P0] A profile-driven matrix proves every supported mode has all five adapters, explicit deterministic parameters, deadline, cycle action, evaluation points, and shadow/authority state [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; all seven registered profiles execute the complete 32-test suite matrix.]
- [x] CHK-021 [P0] Legacy council fixtures prove `decision`, `trace`, blockers, score, and bridge payload remain unchanged while shadow artifacts are emitted [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; the bridge preserves the complete legacy fixture by object identity and the council file has no delta.]
- [x] CHK-022 [P1] Crash-before-terminal-write, crash-after-write, source-event duplication, late coverage expansion, cycle clearing, and unsettled-effect recovery preserve one durable outcome [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; empty pre-write ledger, append/retry, duplicate novelty source, stale successor universe, cleared cycle, and pending disposition evidence fixtures pass.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-023 [P1] The implementation record maps every requirement to code, positive and negative fixtures, replay evidence, and named verifier commands [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; `implementation-summary.md`, this checklist, and `tasks.md` record files, cases, commands, counts, and exits.]
- [x] CHK-024 [P1] All supported modes use the shared arbiter contract; no dark integration adds an unrecorded alternate stop path or relabels exhaustion as convergence [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; one profile registry and arbiter serve all modes, while no existing consumer is modified before cutover.]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-025 [P1] Every clock observation validates run lineage, source identity, and watermark; terminal events pass transition authorization and reject forged or cross-run state [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; source remint/hash checks, common snapshot validation, and the real authorization gateway fixture pass.]
- [x] CHK-026 [P2] Termination logs retain evidence references and typed balances without leaking prompt bodies, credentials, provider secrets, or unrestricted raw executor output [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; payload schemas contain typed causes, hashes, IDs, balances, gaps, blockers, and dispositions only.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-027 [P1] The per-mode profile reference documents each condition, threshold/window/deadline, evaluation boundary, termination class, tie rank, and versioning rule [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; `stopping-clock-profiles.ts`, exported types, and `implementation-summary.md` record the exact contract.]
- [x] CHK-028 [P2] Operator-facing diagnostics distinguish primary cause, co-causes, convergence, incomplete exhaustion, diminishing returns, cycling, blockers, and in-flight settlement state [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; `LoopTerminationDeclared` carries each field as a separate typed value.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-029 [P1] Clock adapters, arbiter, profiles, immutable snapshots, events, tests, and fixtures follow existing system-deep-loop runtime ownership without duplicate mode-local arbiters [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; one `runtime/lib/stopping-clocks/` module owns the complete composition boundary.]
- [x] CHK-030 [P1] The path-scoped delta keeps source adapters separable from authority/cutover work and preserves rollback to the legacy council path [EVIDENCE: `stopping-clocks.vitest.ts` 32/32; existing consumers and `convergence.cjs` remain read-only; removing the additive module restores the prior path.]
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
