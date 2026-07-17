---
title: "Checklist: Canonical Dispatch Receipts"
description: "Blocking verifier contract for canonical pre-spawn dispatch receipts and resume-safe duplicate detection."
trigger_phrases:
  - "canonical dispatch receipts checklist"
  - "pre-spawn receipt verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined P0 gates for pre-spawn durability and resume safety"
    next_safe_action: "Run the crash-cut and duplicate-dispatch verifier matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Canonical Dispatch Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the canonical-dispatch-receipts phase. The verifier pins the candidate and baseline revisions, records the phase-005 adapter/fingerprint and phase-006/004 interface versions, captures commands plus exit codes and discovered-test counts, and fails on zero tests, unexpected tracked mutation, any spawn before durable receipt append, any blind respawn of an unresolved receipt, or any unverified completion claim.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-005 adapter/fingerprint behavior and legacy dispatch baselines are pinned before integration
- [ ] CHK-002 [P0] Phase-006 envelope, authorization, ledger append, and append-receipt interfaces are versioned and available
- [ ] CHK-003 [P0] Phase-007 receipt/effect-recovery trust and unresolved-effect contracts are versioned and available
- [ ] CHK-004 [P1] The fan-out path inventory names the final pre-pool and pre-spawn boundaries where the durability barrier applies
- [ ] CHK-005 [P2] Candidate SHA, baseline SHA, event schema version, and interface versions are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] One registered event builder owns canonical `lineage_dispatch_resolved` construction; callers cannot bypass validation or authorization
- [ ] CHK-007 [P0] Dispatch/idempotency identities are stable across restart and same-identity/different-facts paths return typed conflicts
- [ ] CHK-008 [P1] Receipt and projection code uses exhaustive typed states for absent, resolved, result-recorded, unresolved, conflict, and corrupt evidence
- [ ] CHK-009 [P1] No receipt path mutates, truncates, repairs, re-signs, or silently rebaselines committed ledger evidence
- [ ] CHK-010 [P2] Changes remain inside this phase's runtime contract; no adjacent result, lease, wave, fan-in, or convergence implementation lands
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] Every executor-kind fixture records one durable authorized receipt before the pool worker or subprocess spawn sentinel fires
- [ ] CHK-012 [P0] Receipt schema fixtures bind executor kind, model, effort, effective search policy, adapter/executable versions, safe digests, and the exact adapter fingerprint
- [ ] CHK-013 [P0] Unsupported capability, denied authorization, append failure, expected-head conflict, and fsync failure all produce zero spawn calls
- [ ] CHK-014 [P0] Concurrent exact retries return the original ledger sequence/hash receipt and append no duplicate event
- [ ] CHK-015 [P0] Reusing a dispatch/idempotency identity with changed model, effort, policy, version, prompt digest, config digest, or fingerprint fails before spawn
- [ ] CHK-016 [P0] Crash before append leaves no receipt and permits one later first dispatch after normal validation
- [ ] CHK-017 [P0] Crash after append but before spawn yields `unresolved`; resume neither marks completion nor starts a blind duplicate
- [ ] CHK-018 [P0] Crash during spawn and after exit/before result persistence route through recovery/salvage coordination with bounded typed evidence
- [ ] CHK-019 [P0] Verified receipt plus terminal successor result resolves the leaf exactly once; receipt absence cannot be repaired from mutable checkpoint guesses
- [ ] CHK-020 [P0] Malformed envelope, unknown event version, invalid authorization link, broken ledger hash, and invalid MAC evidence fail closed
- [ ] CHK-021 [P0] `receipt-crypto.ts` canonical JSON vectors are byte-stable, array order is preserved, `mac` is excluded symmetrically, and fixed-length comparison rejects malformed digests
- [ ] CHK-022 [P0] Restart without a registered durable key provider does not promote a process-local HMAC to restart-verifiable authority
- [ ] CHK-023 [P0] Credential, raw-prompt, environment-secret, and run-master-secret canaries are absent from event payloads, canonicalization diagnostics, and logs
- [ ] CHK-024 [P0] Replaying the same verified ledger range rebuilds byte-identical dispatch projections and detects fingerprint conflicts deterministically
- [ ] CHK-025 [P0] Phase-005 command argv, manifest expansion, capped-pool behavior, retries, budgets, checkpoints, and persisted artifacts retain baseline parity in dark mode
- [ ] CHK-026 [P1] Targeted tests assert non-zero discovery counts and cover every receipt/spawn/result crash cut
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-027 [P0] Every fan-out leaf launch path, including retries and resumed runs, passes through the canonical receipt barrier
- [ ] CHK-028 [P0] Result, salvage, lease, and fan-in consumers receive stable typed receipt evidence without parsing legacy logs or checkpoints
- [ ] CHK-029 [P1] The implementation matches all fourteen spec requirements and no out-of-scope authority cutover is introduced
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Receipt payloads persist digests and bounded identifiers only; credentials, raw prompts, unrestricted environment values, and run-master secrets remain excluded
- [ ] CHK-031 [P0] MAC scheme, key-provider identity, verifier version, and restart trust level are explicit; advisory evidence cannot authorize resume
- [ ] CHK-032 [P1] Timing-safe verification, malformed-MAC handling, event authorization, and ledger-integrity failures expose no secret material
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-033 [P1] Event schema, pre-spawn ordering, idempotency semantics, crash states, and resume classifications are documented with source references
- [ ] CHK-034 [P2] Phase outcome and successor handoff boundaries are reflected in packet docs after implementation without claiming result-envelope work here
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-035 [P1] Runtime changes follow existing system-deep-loop module and test placement; no duplicate receipt-crypto implementation is added
- [ ] CHK-036 [P1] Verification mutates no tracked runtime artifact beyond the candidate change set and generated temporary evidence remains outside source paths
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 check has evidence, each subprocess launch is gated by a durable authorized receipt containing the exact phase-005 invocation fingerprint, exact retries are idempotent, conflicting retries fail before spawn, receipt-only crashes remain unresolved, secret and verifier-trust boundaries hold, legacy dispatch stays authoritative and behaviorally unchanged, and strict validation plus targeted runtime gates are green with non-zero discovery.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier confirms the P0 contract against the pinned candidate, the crash-cut matrix has no unreceipted or duplicate spawn, and repository status shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
