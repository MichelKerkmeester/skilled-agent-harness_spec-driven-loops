---
title: "Implementation Summary: Deep Improvement Common Shadow Parity"
description: "Delivered the additive-dark shared shadow-parity harness with logical event pairing, independent projections, real-substrate fault injection, and manifest-bound evidence."
trigger_phrases:
  - "deep improvement common shadow parity implementation"
  - "deep improvement common shared parity contract"
  - "deep improvement common parity receipt"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
    last_updated_at: "2026-07-28T06:08:19Z"
    last_updated_by: "opencode"
    recent_action: "Verified the shared shadow parity contract"
    next_safe_action: "Consume the contract in downstream lane migrations"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-shadow-parity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-shadow-parity/harness-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-shadow-parity/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-shadow-parity.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Logical identities pair independently emitted transport events"
      - "Only three closed envelope fields are volatile"
      - "Legacy and typed paths use distinct projection implementations"
      - "Every semantic fault remains unexplained and blocks the mode gate"
      - "The parity receipt is bound to the trusted manifest and offline certificate"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-shadow-parity |
| **Completed** | 2026-07-28 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark with legacy authority unchanged |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The runtime now exposes one shared shadow-parity contract over the landed Deep Improvement Common ledger, reducer,
sealed-artifact, certificate, resume, replay-fingerprint, legacy-projection, and generic shadow-parity substrates. Both paths
consume the same frozen input, but the legacy path uses a modeled legacy projection oracle while the typed path uses the real
common reducer. Their transport identities may differ because pairing uses logical event identity and sequence.

The comparator validates the exact three-field volatility allowlist, compares protected semantics and projection fingerprints
at every event boundary, and emits only unexplained typed diffs. Real-substrate executors traverse authorization, append-only
ledger writes, replay, projection, attestation, sealed references, certificate verification, receipt construction, and the
non-authoritative successor mode-gate input. Manifest and certificate bindings prevent a receipt from self-declaring parity.

### Shared Successor Contract

The exported reuse identity for the agent-improvement, model-benchmark, and skill-benchmark lanes is
`DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT`. The public module also exports:

- `DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST`
- `DEEP_IMPROVEMENT_COMMON_REQUIRED_FIXTURE_SCENARIOS`
- `DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP`
- `canonicalizeDeepImprovementCommonEventStream`
- `compareDeepImprovementCommonEventStreams`
- `compileDeepImprovementCommonParityManifest`
- `createDeepImprovementCommonParityExecutors`
- `createDeepImprovementCommonLegacyResumeOracle`
- `driveDeepImprovementCommonResumeParity`
- `runDeepImprovementCommonParityCase`
- `runDeepImprovementCommonParitySuite`
- `createDeepImprovementCommonModeGateInput`
- `parseDeepImprovementCommonParityReceipt`
- `parseDeepImprovementCommonModeGateInput`
- all closed public types from `types.ts`

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-improvement-common-shadow-parity/harness-adapter.ts` | Created | Comparator, independent projections, executors, receipts, and mode-gate handoff |
| `runtime/lib/deep-improvement-common-shadow-parity/types.ts` | Created | Closed fixture, projection, diff, receipt, fault, and gate contracts |
| `runtime/lib/deep-improvement-common-shadow-parity/index.ts` | Created | Stable public exports for downstream reuse |
| `runtime/tests/unit/deep-improvement-common-shadow-parity.vitest.ts` | Created | Real zero-diff, closure, tamper, and exact fault-class verification |
| Leaf packet docs | Updated | Implemented status, completion evidence, and downstream handoff |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The harness builds on the shipped runtime boundaries rather than reproducing them. It authorizes and appends fixture events
through the real ledger gateway, folds each prefix through either the independent legacy oracle or typed reducer, records
replay attestations, verifies the common certificate offline, and binds the resulting stream evidence into the generic parity
certificate and closed receipt. Fault injection occurs after real replay and before comparison so each negative case exercises
the same receipt and mode-gate path as the green case.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Pair by logical identity rather than raw event ID | Independent emitters must compare without sharing transport identity |
| Close volatility to three envelope fields | Unknown normalization can hide a semantic divergence |
| Keep a distinct legacy projection oracle | Reusing the typed reducer on both paths would make parity vacuous |
| Classify every semantic difference as unexplained | This leaf has no authority to tolerate a behavior change |
| Drive faults through the real substrate | Stub-only mismatch tests cannot prove authorization, replay, receipt, or gate behavior |
| Bind receipts to manifest and offline certificate evidence | A computed green status cannot authenticate itself |
| Export one shared parity identity | Downstream lanes reuse the frozen common contract rather than forking semantics |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest | PASS, 1 file and 27 tests in 298.67 seconds |
| Green execution | PASS, real zero-diff run emits a verified certificate-bound green receipt |
| Fault injection | PASS, 20 fault kinds traverse the real pipeline and produce exact typed classes |
| Semantic-diff discipline | PASS, tolerated-diff laundering is rejected by the closed parser |
| Logical pairing | PASS, independently rewritten event IDs pair with zero differences |
| Closed volatility | PASS, only `occurred_at`, `recorded_at`, and `correlation_id` are excluded from identity |
| Manifest binding | PASS, tampered certificates and mismatched manifests fail closed |
| Whole-runtime TypeScript | PASS, exit 0 with zero diagnostics |
| Comment hygiene | PASS, all four TypeScript files report zero violations |
| Strict packet validation | PASS, zero errors and zero warnings |
| Scope audit | PASS, only the shared module, focused test, and leaf docs are in scope |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Target | Result | Status |
|--------|--------|--------|
| No authority mutation | Receipt and mode-gate fields remain false | Pass |
| Deterministic replay | Two runs bind identical stream and projection digests | Pass |
| Fail-closed evidence | Missing, stale, malformed, unsupported, and tampered inputs block | Pass |
| Downstream reuse | One frozen consumer contract names all three lanes | Pass |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## Known Limitations

The harness remains additive-dark. Its green receipt is evidence for the successor gate, not authority to cut over, promote,
retire a legacy writer, or mutate a baseline. Each downstream lane may add namespaced fixtures but cannot weaken the common
logical identity, volatility, diff, certificate, receipt, or mode-gate contracts.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

No semantic deviations were accepted. The implementation uses typed blocking reason codes instead of allowing free-form
terminal labels, and every fault remains an unexplained blocker.
<!-- /ANCHOR:deviations -->
