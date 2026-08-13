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
    last_updated_at: "2026-07-21T08:06:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the blocking verifier checklist"
    next_safe_action: "Keep the typed policy dark until compatibility activation"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] CHK-001 [P0] BASE and phase 003's defect-versus-contract ledger were read before implementation [Source: `003-baseline-taxonomy-and-state-census/contract-defect-ledger.json`]
- [x] CHK-002 [P0] Child 004's await-set/decision-boundary and child 006's reduction-input boundaries remain separate [File: `.opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/policy.ts`]
- [x] CHK-003 [P1] Canonical dispatch, result-envelope, ledger, authorization, and replay inputs are consumed through typed sibling APIs [File: `.opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/types.ts`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Policy evaluation is pure and typed; free-form executor text cannot determine thresholds or verdicts [File: `.opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/evaluator.ts`]
- [x] CHK-005 [P0] One logical branch contributes at most one terminal success or failure per epoch [Test: partial-failure-policy.vitest.ts retry and collision cases]
- [x] CHK-006 [P1] Diagnostics are sanitized, capped at 512 characters, and backed by bounded references [Test: partial-failure-policy.vitest.ts bounded-diagnostics case]
- [x] CHK-007 [P1] The module contains neither budget selection nor provenance weighting [File: `.opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Fixtures cover every leaf-local class plus run-fatal orchestration integrity [Test: partial-failure-policy.vitest.ts taxonomy matrix]
- [x] CHK-009 [P0] Sizes 0-12 plus 30 and 100 match exact integer quorum arithmetic [Test: partial-failure-policy.vitest.ts threshold matrices]
- [x] CHK-010 [P0] All four modes and all four verdicts are exercised; progressive output stays provisional until closure [Test: partial-failure-policy.vitest.ts state-machine cases]
- [x] CHK-011 [P0] One integrity record aborts a passing 99-of-100 quorum with no reduction request [Test: partial-failure-policy.vitest.ts fatal-override case]
- [x] CHK-012 [P0] Retry attempts remain diagnostic while duplicate terminal failure identity counts once [Test: partial-failure-policy.vitest.ts retry-exhaustion case]
- [x] CHK-013 [P0] `not_awaited` stays separate and deadline expiry synthesizes one terminal failure per pending admitted branch [Test: partial-failure-policy.vitest.ts denominator and deadline cases]
- [x] CHK-014 [P0] The degraded marker contains every required policy, count, fraction, failure, reason, finality, and receipt field [Test: partial-failure-policy.vitest.ts degraded-marker case]
- [x] CHK-015 [P0] Reduction handoff contains only sorted validated success envelopes and the policy receipt; abort and provisional outcomes return no request [Test: partial-failure-policy.vitest.ts reduction cases]
- [x] CHK-016 [P0] Restarting the ledger reader reproduces the same authorized final receipt and never duplicates reduction handoff state [Test: partial-failure-policy.vitest.ts crash/restart replay case]
- [x] CHK-017 [P0] Duplicate terminal identity collapses and a late result is appended against the closed epoch without changing its receipt [Test: partial-failure-policy.vitest.ts duplicate and late cases]
- [x] CHK-018 [P1] Declared `empty_tick` yields `not_applicable`; unexplained zero admission aborts [Test: partial-failure-policy.vitest.ts zero-leaf cases]
- [x] CHK-019 [P1] Dark comparison receipts retain exact legacy status/exit authority and classify typed abort versus legacy partial/2 as a known-defect difference [Test: partial-failure-policy.vitest.ts additive-dark case]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P0] Every requirement maps to named unit evidence and no typed path emits generic unreceipted `partial` [Test: partial-failure-policy.vitest.ts, 39 passing tests]
- [x] CHK-021 [P1] Existing fanout execution and pool behavior remains green without source changes [Test: fanout-run.vitest.ts and fanout-pool.vitest.ts, 99 passing tests]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P0] Ledger diagnostics redact secret-shaped material, enforce fixed bounds, and persist references instead of raw executor streams [Test: partial-failure-policy.vitest.ts bounded-diagnostics case]
- [x] CHK-023 [P1] Closed schemas, deterministic identities, and the authorized writer fail closed for incompatible or conflicting evidence [File: `.opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/ledger-events.ts`]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-024 [P1] Policy modes, exact arithmetic, fatal overrides, degradation fields, and rollback behavior match the canonical docs [File: `spec.md`, `plan.md`, and `implementation-summary.md`]
- [x] CHK-025 [P2] The implementation summary documents degraded handoff and legacy authority during dark rollout [File: `implementation-summary.md`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] Schemas, evaluator, event adapter, replay, compatibility projection, and tests follow the existing runtime module boundary [File: `.opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/`]
- [x] CHK-027 [P2] Verification left no ledger fixtures, scratch output, or runtime artifacts outside owned paths [Test: scoped `git status --short` review]
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
