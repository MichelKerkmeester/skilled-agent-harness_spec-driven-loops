---
title: "Checklist: partial-failure policy"
description: "Blocking verifier checklist for failure classification, quorum arithmetic, degraded-result evidence, ledger replay, and fan-in abort isolation."
trigger_phrases:
  - "partial-failure policy checklist"
  - "durable fan-in failure checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking partial-failure verifier contract"
    next_safe_action: "Execute the threshold and replay matrices after implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Partial-Failure Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the partial-failure policy. The verifier binds evidence to the
candidate SHA, BASE SHA, policy schema version, decision epoch, and replay fingerprint. It records the admitted leaf
set, ordered success/failure event IDs, exact threshold arithmetic, verdict receipt, reduction invocation count, test
commands, and exit codes. Zero discovered fixtures, a mutable denominator, or an unreceipted `partial` result fails.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE is pinned and phase 003 classifies current `fanout-run.cjs` partial-summary behavior as protected contract or known defect
- [ ] CHK-002 [P0] Child 004's await-set/decision-boundary and child 006's reduction-input boundaries are frozen without overlapping ownership
- [ ] CHK-003 [P1] The canonical dispatch, result-envelope, ledger, authorization, and replay-version inputs are available
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Policy evaluation is pure and uses typed fields; free-form executor messages never determine class, threshold, or verdict
- [ ] CHK-005 [P0] One logical branch contributes at most one terminal success or failure per decision epoch after retries
- [ ] CHK-006 [P1] Error diagnostics are bounded and sanitized; durable records use artifact/receipt references for full evidence
- [ ] CHK-007 [P1] Child 005 contains no budget-selection or provenance-weighting logic owned by siblings 004 and 006
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Classifier fixtures cover executor exit, signal, timeout, missing artifact, artifact parse, salvage exhaustion, leaf policy violation, post-admission budget rejection, and orchestration integrity
- [ ] CHK-009 [P0] Threshold tests for admitted sizes 1-2 tolerate zero failures, 3-5 tolerate one, 6-8 tolerate two, and the complete 0-12 matrix matches `ceil(2N/3)` plus `floor(N/3)`
- [ ] CHK-010 [P0] Strict, quorum, deadline, and progressive modes exercise `await`, `proceed`, `proceed_degraded`, and `abort`; only terminal/deadline evaluations finalize
- [ ] CHK-011 [P0] Every orchestration-integrity fixture aborts despite a passing numeric quorum and records zero reduction invocations
- [ ] CHK-012 [P0] Retryable attempts do not affect quorum before exhaustion; the terminal failure links every prior attempt without double counting
- [ ] CHK-013 [P0] Pre-admission `not_awaited` leaves remain outside the denominator; admitted pending leaves become typed deadline failures when the boundary closes
- [ ] CHK-014 [P0] Degraded envelopes include policy ID/version, counts, fraction, ceiling, failed branch IDs, reason codes, finality, and the evaluation receipt
- [ ] CHK-015 [P0] `proceed|proceed_degraded` pass only validated successful envelopes to the reduction spy; `abort|await` invoke it zero times
- [ ] CHK-016 [P0] Crash injection around failure append, evaluation append, final verdict, and reduction dispatch replays to one authorized verdict and one reduction request at most
- [ ] CHK-017 [P0] Duplicate and late terminal results append deterministic evidence but cannot alter a closed decision epoch
- [ ] CHK-018 [P1] Explicit `empty_tick` yields `not_applicable`; an unexplained zero admitted set aborts as invalid input
- [ ] CHK-019 [P1] Dark comparison records legacy `ok|partial` and exit `0|2|3` beside typed verdicts; each difference is resolved through phase 003's classification
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-020 [P0] Every spec requirement maps to a named fixture and no failure path falls back to generic `partial` without a policy receipt
- [ ] CHK-021 [P1] Current executor, timeout, artifact, salvage, retry, summary, and stop-policy paths in `fanout-run.cjs` remain covered
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P0] Ledger events contain no credentials, prompts, raw unbounded stderr, host paths, or unsanitized executor output
- [ ] CHK-023 [P1] Transition authorization rejects forged, duplicate-conflicting, or schema-incompatible policy verdicts fail closed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P1] Policy modes, default arithmetic, fatal overrides, degradation fields, and rollback behavior match `spec.md` and `plan.md`
- [ ] CHK-025 [P2] Operator-facing runtime documentation explains the degraded verdict and preserves legacy status compatibility during dark rollout
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Failure policy schemas, evaluator, ledger adapter, compatibility projection, and tests follow existing runtime module boundaries
- [ ] CHK-027 [P2] No generated metadata, runtime artifact, ledger fixture output, or test scratch file is committed outside its owned location
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, all P1 checks pass or carry approved deferral evidence, the two-thirds
matrix and fatal overrides are exact, every final verdict has one authorized receipt, degraded results expose failed
branch provenance, aborts invoke no reducer, and crash/replay produces the same closed decision on the pinned SHA.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier binds the candidate and BASE SHAs, policy version, replay fingerprint, threshold matrix,
failure-class coverage, verdict receipt IDs, and reduction-call counts to a green targeted test run and strict packet
validation, with no unexpected tracked mutation from verification.
<!-- /ANCHOR:sign-off -->
