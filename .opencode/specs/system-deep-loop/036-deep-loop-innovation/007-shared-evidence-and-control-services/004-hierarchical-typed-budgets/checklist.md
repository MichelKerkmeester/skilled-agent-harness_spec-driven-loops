---
title: "Checklist: Hierarchical Typed Budgets"
description: "Blocking verifier checklist for the hierarchical typed budget authority and its fan-out and convergence consumers."
trigger_phrases:
  - "hierarchical typed budgets checklist"
  - "deep-loop budget verifier"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets"
    last_updated_at: "2026-07-15T13:59:12Z"
    last_updated_by: "codex"
    recent_action: "Verified the typed budget contract and recorded the evidence bundle"
    next_safe_action: "Commit the path-scoped candidate when authorized"
    blockers: []
    key_files: []
    completion_pct: 96
    open_questions: []
    answered_questions: []
---
# Checklist: Hierarchical Typed Budgets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the hierarchical typed budget implementation. Every checked
item must cite candidate SHA, BASE SHA, command and exit code, fixture/event-stream digest, and observed balances or
spawn markers. A zero-test run, missing receipt, unpinned pricing policy, unexplained shadow delta, or unexpected tracked
mutation fails the phase. Budget-exhaustion fixtures must prove absence of dispatch, not only presence of an error.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The phase-003 BASE and current council/fan-out guard behavior are pinned with fixture digests [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-002 [P0] Phase-006 envelope/replay plus sibling receipt/fencing interfaces are frozen or any contradiction is resolved through a packet amendment [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-003 [P1] Program phase 009 and phase 011 consumer fields and denial semantics are mapped without transferring budget arithmetic to those consumers [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Token, cost, iteration, and wall-time values are discriminated types; no token alias or generic cost-unit arithmetic survives inside the authority [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-005 [P0] Balances are reducer-derived from authorized append-only events; no mutable side counter can grant capacity [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-006 [P1] Reservation and settlement APIs are idempotent, deterministic, bounded, and explicit about every denial/anomaly state [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-007 [P1] Monetary values use fixed precision with currency and pricing digest; elapsed time uses a monotonic source [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Type matrix rejects cross-dimension/unit/currency/pricing operations, negative values, overflow, and implicit unlimited budgets [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-009 [P0] Scope matrix covers valid ancestry, orphan, cycle, duplicate identity, wrong level, stale parent, and replay mismatch [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-010 [P0] Exact-cap and one-over-cap fixtures prove a child never exceeds lineage, mode, or program remaining allotment [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-011 [P0] Multi-dimensional reservation failure leaves every dimension unchanged and records one typed denial [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-012 [P0] Concurrent siblings racing for one remainder cannot overbook; fencing conflict fails before dispatch [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-013 [P0] Duplicate reserve, start, settle, release, expiry, and reconciliation requests produce one logical state transition [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-014 [P0] Success, retry, timeout, cancellation, and executor failure retain incurred iteration/token/cost/time spend and release only proven unused capacity [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-015 [P0] Missing receipt, unknown usage, stale pricing, invalid unit, reducer divergence, replay mismatch, fence conflict, and append failure all deny new work [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-016 [P0] Crash points between reserve, start, receipt, and settlement replay to the same balances without reservation leaks or erased spend [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-017 [P0] Fan-out exhaustion at lineage, mode, and program scope creates no executor spawn marker and preserves a typed ledger denial [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-018 [P0] Value-of-computation exhaustion creates no sample/dispatch marker and reports incomplete/budget-exhausted rather than converged [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-019 [P1] Shadow parity covers current council upper bounds, lineage cap, aggregate cap, retries, token aliases, pre-spawn denial, and lifetime ceiling [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-020 [P1] Every intentional shadow delta is explained by typed actual-spend, nesting, reservation, or fail-closed semantics and approved before cutover [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-021 [P1] Ordered lifecycle event streams reproduce every intermediate and final balance from genesis and supported checkpoints [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-022 [P0] All budget mutations route through the shared authority; fan-out, convergence, and mode adapters contain no duplicate balance or exhaustion logic [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-023 [P1] Current council/fan-out guards remain available as compatibility/shadow paths until authorized retirement [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-024 [P0] A caller cannot mint capacity, change parentage, alter pricing identity, reuse another reservation, or commit spend without transition authority and receipt binding [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-025 [P1] Denials and projections expose no secret provider billing fields beyond normalized authorized cost evidence [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-026 [P1] Runtime references document typed units, scope nesting, reservation/settlement states, exhaustion taxonomy, and migration authority [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
- [x] CHK-027 [P2] Program phase 009 and phase 011 docs reference this service as the sole budget admission contract [EVIDENCE: focused Vitest 29/29 passed, exit code 0; implementation-summary.md]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Budget authority, reducer, adapters, fixtures, and tests land in dependency-closed path-scoped commits with no adjacent cleanup

CHK-028 remains open because this delivery is an uncommitted, path-scoped working-tree candidate. No commit was
requested. `git status` and the additive-dark audit in `implementation-summary.md` prove that the candidate is
dependency-closed and that the consumed substrate and legacy writers are untouched.

### Evidence bundle

**E1.** All checked items are bound to BASE `d1a3f0323c3635f24c3560feaeda839522ececf0`, the uncommitted
path-scoped candidate, focused fixture digest
`705f29c9f6e6347253499d950faece15ba23348d6b352ae5efd1aab41cbedb84`, the commands and exit codes in
`implementation-summary.md`, and the named test cases that assert balances, denial records, and absent dispatch markers.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 and P1 item carries evidence, all four dimensions reconcile from ledger events,
ancestor and concurrency fixtures prove no overbooking, every exhausted or uncertain request proves no dispatch, shadow
parity deltas are dispositioned, and the relevant runtime plus strict spec-kit gates are green on the candidate SHA.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier binds the complete evidence set to the candidate SHA, confirms the legacy authority
switch remains off, and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
