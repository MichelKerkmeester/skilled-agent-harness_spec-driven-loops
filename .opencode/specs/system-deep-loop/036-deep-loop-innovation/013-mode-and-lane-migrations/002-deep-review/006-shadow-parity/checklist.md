---
title: "Checklist: Deep Review shadow parity"
description: "Blocking Level 2 verifier checklist for Deep Review shadow parity: event-for-event ledger comparison, projection parity, replay/resume parity, and fail-closed pre-cutover evidence."
trigger_phrases:
  - "Deep Review shadow parity checklist"
  - "deep-review parity gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/006-shadow-parity"
    last_updated_at: "2026-07-28T05:08:36Z"
    last_updated_by: "codex"
    recent_action: "Verified shadow parity gates"
    next_safe_action: "Consume parity evidence in the mode gate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-shadow-parity.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Review Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for Deep Review shadow parity. Every item is checked against a
candidate SHA, the pinned baseline, the phase-012 and phase-014 contract fingerprints, the comparator version, and the
fixture-corpus digest. The verifier records commands, exit codes, event counts, projection hashes, discrepancy classes,
and authority assertions. A missing fixture, zero-event result, unexplained diff, non-deterministic certificate, or
unexpected publication mutation fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The phase-012 shared review-loop contract and phase-014 shadow framework are frozen and their fingerprints are recorded [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`]
- [x] CHK-002 [P0] The pinned legacy Deep Review lifecycle and all scope, dimension, finding, convergence, and report boundaries are inventoried [Evidence: `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-shadow-parity.vitest.ts`]
- [x] CHK-003 [P1] The paired-run envelope records identical source, scope, dimensions, execution, budget, replay, and contract fingerprints [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/types.ts`]
- [x] CHK-004 [P1] The closed volatility allowlist is exactly `occurred_at`, `recorded_at`, and `correlation_id`; each field is checked for presence, type, and non-interference, while event identity, causal order, lineage, evidence, severity, disposition, receipts, and report order remain protected [Test: focused Vitest suite, 8/8 passed]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] The shadow path is non-authoritative and cannot publish a review report, mutate the legacy projection, or authorize a transition [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-006 [P1] Deep Review consumes the shared review-loop contract and does not fork the deep-alignment lifecycle or add an unowned mode-local state machine [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts`]
- [x] CHK-007 [P1] P0/P1/P2 remains an impact axis; confidence, reachability, exploitability, evidence strength, evidence scope, and validation disposition remain separate [Evidence: `.opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/types.ts`]
- [x] CHK-008 [P2] Raw legacy and ledger evidence is retained for every normalized comparison value and every discrepancy [File: .opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] The clean lifecycle fixture covers scope -> dimension pass -> candidate -> validation -> impact -> convergence -> review-report with matching causal order [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-010 [P0] Event-stream comparison reports zero unexplained semantic differences; only the closed volatility fields are normalized with presence, type, and non-interference checks, and every other difference blocks parity [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-011 [P0] Projection comparison matches stable finding identity, introduced/fixed/pre-existing lineage, impact, evidence attributes, disposition, and report ordering [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-012 [P0] Duplicate-candidate and cross-pass fixtures preserve one stable finding identity without losing source evidence or validation history [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-013 [P0] Moved, renamed, updated, fixed, and pre-existing finding fixtures use versioned semantic fingerprints rather than absolute lines alone [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-014 [P0] Replay and every supported checkpoint-resume fixture reproduce the original normalized event stream, projection, and replay fingerprint [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-015 [P0] Invalid-transition, stale-receipt, incomplete-validation, and fault injections traverse the real paired execution, authorization, ledger, reducer, projection, receipt, and mode-gate evidence pipeline and assert the exact typed failure class [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-016 [P0] The legacy path remains the only publication authority in every fixture; a shadow mismatch cannot publish or authorize [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-017 [P1] Repeated execution with identical inputs produces identical event comparison output, projection hashes, discrepancy ordering, and certificate bytes [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-018 [P1] The fixture corpus includes normal, duplicate, update, resume, replay, invalid-transition, and fault-injection cases with no missing class [Test: focused Vitest suite, 8/8 passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-019 [P0] Every required Deep Review lifecycle event and projection is listed in the adapter mapping and comparator manifest, and every named cross-artifact reference resolves to the declared kind with applicable epoch, lifecycle, freshness, real-state, visibility, role-redaction, and authority-liveness checks [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-020 [P0] Every discrepancy is classified, retained with raw evidence, and either resolved or keeps the result at `PARITY_BLOCKED` [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-021 [P1] The manifest-bound parity receipt binds fixture digest, contract fingerprints, comparator version, candidate SHA, and all four verdicts as evidence; the authenticated mode gate re-verifies that binding and does not self-trust the computed parity status [Test: focused Vitest suite, 8/8 passed]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P0] A shadow result cannot bypass transition authorization, expose unblinded evaluator state, or replace a legacy report [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-023 [P1] Comparator and certificate inputs are content-addressed; stale fingerprints or changed normalization rules invalidate the result [Test: focused Vitest suite, 8/8 passed]
- [x] CHK-024 [P2] Shadow artifacts contain no credentials or unbounded copied source material beyond the declared evidence references [File: .opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P1] The adapter mapping, normalization allowlist, discrepancy taxonomy, fixture manifest, and certificate schema are documented in the implementation packet [Evidence: `implementation-summary.md`]
- [x] CHK-026 [P2] The phase outcome and handoff to `007-rollback-and-mode-gate` are reflected in the packet docs without claiming authority cutover [File: implementation-summary.md]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-027 [P1] Changes are scoped to the Deep Review shadow-parity implementation and its evidence; no sibling mode or shared contract is silently modified [Evidence: scoped git diff review]
- [x] CHK-028 [P2] The parity report and certificate are written to the declared shadow artifact boundary and verification leaves no unexpected tracked mutation [Test: focused Vitest suite, 8/8 passed]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 check passes, event-stream and projection parity are green, replay/resume and
safety parity are green, the receipt is reproducible and manifest-bound, and the legacy path remains authoritative.
Any unexplained diff, missing fixture, or stale contract changes the result to `PARITY_BLOCKED` and prevents the next mode
gate from treating this phase as evidence of cutover readiness.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 parity contract, the certificate binds the exact fixture and contract
inputs, and the authority assertion proves that shadow execution did not publish or authorize any Deep Review result.
<!-- /ANCHOR:sign-off -->
