---
title: "Checklist: Result Envelopes & Resume/Salvage"
description: "Verification contract for typed leaf results, deterministic no-rerun resume, and provenance-preserving salvage."
trigger_phrases:
  - "result envelope resume checklist"
  - "fanout salvage verification checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
    last_updated_at: "2026-07-21T05:09:43Z"
    last_updated_by: "codex"
    recent_action: "Verified the result-envelope, no-rerun, recovery, salvage, and shadow contracts"
    next_safe_action: "Keep legacy fan-out authoritative until later cutover authorization"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Result Envelopes & Resume/Salvage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verification contract for phase 009's `002-result-envelopes-and-resume-salvage` child. Implementation evidence must pin the candidate SHA, ledger/reducer/event-schema versions, replay head, fixture corpus digest, and commands with exit codes. Repeated resume runs must report execution counts per leaf, and every checked item must carry machine-detectable evidence before phase completion is claimed.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Sibling-001 dispatch-receipt identity and phase-006 envelope/ledger interfaces are frozen for this implementation [Evidence: `event-contracts.ts:1`; result recorder resolves and validates the verified dispatch receipt]
- [x] CHK-002 [P0] Phase-007 effect-recovery outcomes and stable idempotency inputs are available to the recovery coordinator [Evidence: verified `deep-loop.effect.reconciled` source plus receipt-bound recovery event]
- [x] CHK-003 [P1] Legacy fixtures cover result, retry, artifact, salvage, merge-reconstruction, attribution, and exit-classification paths while untouched wait/orphan/signal paths retain shipped authority [Evidence: `result-envelopes.vitest.ts`; scoped status]
- [x] CHK-004 [P2] Candidate base SHA, fixture digest, registry version, reducer version, and replay-head binding are recorded [Evidence: base `012652b479dee08455de574574c5e7a8971a8b0b`; fixture `f47841798bebfd75d03f9922dcb75275b18f9669b633ac4c1b3d28593bed1ad7`; registry `4a91f98466577639d7cd2c188d315dcad7c6a91c640b8d9a2ef34172db8a5844`; reducer `result-resume-reducer@1`; reducer snapshot binds the verified frame sequence/hash]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Result and salvage events append only through validated phase-006 envelope, authorization, and typed-ledger boundaries [Evidence: `event-contracts.ts`; `AuthorizedEvidenceWriter` only]
- [x] CHK-006 [P1] Resume reduction is pure, deterministic, side-effect-free, and rebuildable from a verified ledger [Evidence: byte-identical repeated fold test; no checkpoint input]
- [x] CHK-007 [P1] Recovery orchestration separates observation/reconciliation from dispatch, binds the source and target receipt to the same expected correlation key, and cannot retry an in-doubt, conflicted, or cross-leaf effect [Evidence: `result-envelopes.vitest.ts:1`; four-verdict matrix and mismatched-leaf rejection]
- [x] CHK-008 [P1] Large/raw output and credentials remain outside ledger payloads; bounded references carry content digests [Evidence: `event-contracts.ts:1`; closed schemas, 16 KiB inline bound, and secret-canary tests]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Every result joins to exactly one canonical dispatch receipt; dangling results and missing terminal outcomes remain explicit [Evidence: `result-envelopes.vitest.ts:1`; missing-receipt and one-pair fixtures]
- [x] CHK-010 [P0] Exact receipt/result repeats return the original append receipt; changed status, result, evidence, artifact, usage, cost, or salvage facts conflict [Evidence: `result-envelopes.vitest.ts:1`; exact-repeat and changed-fact matrix]
- [x] CHK-011 [P0] Success requires a valid parsed result and all required evidence/artifact digests; exit zero and file presence alone fail the success gate [Evidence: unresolved digest fixture classifies `unreadable`]
- [x] CHK-012 [P0] Repeated crash-and-resume cycles never execute a durably completed leaf more than once [Evidence: completed dispatch absent from `eligible_dispatch_ids` on repeated folds]
- [x] CHK-013 [P0] Resume refolds identical verified input into byte-identical progress, completed exclusions, unresolved attempts, and retry-eligible sets [Evidence: `result-envelopes.vitest.ts:1`; canonical byte and digest equality]
- [x] CHK-014 [P0] Not-applied effects may follow retry policy, applied effects reconcile without re-execution, and in-doubt/conflict outcomes stop automatically [Evidence: `result-envelopes.vitest.ts:1`; four-verdict plus policy-denied fixtures]
- [x] CHK-015 [P0] Crash fixtures use the ledger's after-frame-fsync fault hook, verify the torn append fails closed, call `recoverTornTail()`, and prove byte-identical reconstruction from the committed prefix [Evidence: `result-envelopes.vitest.ts:1`; targeted torn-tail test]
- [x] CHK-016 [P0] Salvaged fragments bind source, digest, parser/schema, recovered scope, completeness, confidence, and recovery verdict [Evidence: `result-envelopes.vitest.ts:1`; provenance payload assertion]
- [x] CHK-017 [P0] Partial or mixed salvage cannot silently become success, and unrecoverable required evidence preserves the failed/partial outcome [Evidence: failed result remains `salvaged` with terminal status `failed`]
- [x] CHK-018 [P0] Hash failure, unknown versions, present-but-wrong resolved digests, missing receipts, pair conflicts, and malformed costs fail closed [Evidence: `result-envelopes.vitest.ts:1`; corruption, missing receipt, changed pair, mismatched resolver, and unknown-cost fixtures]
- [x] CHK-019 [P1] Legacy shadow parity covers salvage counts, failed markers, registry reconstruction, attribution, and failure classifications; untouched scripts preserve wait, orphan, signal-summary, stdout-save, and exit behavior [Evidence: `legacy-shadow.ts:1`; direct comparisons with exported legacy helpers]
- [x] CHK-020 [P1] Measured, estimated, and unknown usage/cost remain distinguishable; absent cost is not normalized to zero [Evidence: `types.ts:1`; accounting schema and unknown-cost fixtures]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-021 [P1] Every supported leaf result declares a versioned schema, explicit required digest set, terminal status, and salvage references [Evidence: `LeafResultPayload` and `DigestReference`]
- [x] CHK-022 [P1] Every shipped fan-out recovery path is represented by a typed salvage source kind or the explicit non-authoritative compatibility projection [Evidence: source-kind union and `legacy-shadow.ts`]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-023 [P0] Result, error, evidence, usage, and salvage payloads contain no credentials, unrestricted prompts, tokens, or secret environment values [Evidence: `event-contracts.ts:1`; closed validators and secret canary]
- [x] CHK-024 [P1] Artifact references are scheme-scoped and digest-verified before a result can become successful [Evidence: `resume-reducer.ts:1`; exact resolver equality rejects a present-but-wrong digest]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P1] Event schemas, reducer versions, recovery classifications, no-rerun invariant, and compatibility limits are documented with implementation evidence [Evidence: `spec.md` and `implementation-summary.md`]
- [x] CHK-026 [P2] This leaf records the final result/recovery projection and successor handoff boundary without modifying parent or successor packets outside the frozen write set [Evidence: `implementation-summary.md` limitations and scoped status]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-027 [P1] Runtime changes stay within the approved phase write set and preserve legacy artifact layouts during the dark period [Evidence: `git status --short`; shipped scripts untouched]
- [x] CHK-028 [P1] Test fixtures isolate ledger, artifact, executor, and effect-target state per case and leave no tracked mutation [Evidence: `result-envelopes.vitest.ts:1`; per-test temporary roots and cleanup]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

All P0 and P1 items carry implementation evidence. The targeted suite proves deterministic no-rerun resume, recovery ambiguity blocking, provenance-honest salvage, and legacy/dark shadow parity while the shipped fan-out path remains authoritative.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off against the uncommitted candidate delta on base SHA `012652b479dee08455de574574c5e7a8971a8b0b`, event schema version 1, reducer `result-resume-reducer@1`, registry digest `4a91f98466577639d7cd2c188d315dcad7c6a91c640b8d9a2ef34172db8a5844`, fixture digest `f47841798bebfd75d03f9922dcb75275b18f9669b633ac4c1b3d28593bed1ad7`, verified ledger-head assertions, 30/30 tests, and the scoped status recorded in `implementation-summary.md`.
<!-- /ANCHOR:sign-off -->
