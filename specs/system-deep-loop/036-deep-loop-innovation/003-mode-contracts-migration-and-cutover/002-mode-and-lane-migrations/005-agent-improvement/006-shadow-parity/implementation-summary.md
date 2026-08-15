---
title: "Implementation Summary: Agent Improvement Shadow Parity"
description: "Delivered the additive-dark Agent Improvement parity harness with shared comparator reuse, logical event pairing, real-substrate execution, and manifest-bound evidence."
trigger_phrases:
  - "Agent Improvement shadow parity implementation"
  - "agent improvement parity receipt"
  - "agent improvement mode gate input"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity"
    last_updated_at: "2026-08-15T14:36:34Z"
    last_updated_by: "codex"
    recent_action: "Verified shadow-parity closeout with focused suite 36/36 passed at exit 0"
    next_safe_action: "Use parity evidence only through the authenticated successor gate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-shadow-parity.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Agent Improvement reuses the shared parity comparator and contract identity"
      - "Logical identities pair independently emitted transport events"
      - "The volatility allowlist stays closed to transport-only fields"
      - "Legacy and typed paths use distinct projection implementations"
      - "The successor input remains manifest-bound and non-authoritative"
---
# Implementation Summary: Agent Improvement Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 006-shadow-parity |
| **Completed** | 2026-07-28 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark with legacy authority unchanged |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The runtime now exposes an Agent Improvement shadow-parity module over the landed event schema, reducers, sealed artifacts,
certificates, resume adapter, replay fingerprint, legacy projection, and the Deep Improvement Common parity contract. It adds the
agent-improvement evaluation, proposal, scoring, canary, and promotion parity surfaces while retaining the shared comparator,
manifest, receipt, and gate identities from the common base.

The legacy executor uses a distinct modeled legacy projection oracle. The typed executor independently traverses transition
authorization, append-only ledger writes, the real Agent Improvement reducer, replay derivation, and fingerprint attestation.
Canonical pairing uses logical event identity rather than raw transport IDs, and the volatility allowlist stays closed to
transport-only fields whose presence and types remain validated.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts` | Created | Shared-contract adapter, projections, executors, receipts, and gate handoff |
| `runtime/lib/agent-improvement-shadow-parity/types.ts` | Created | Closed fixture, projection, diff, receipt, fault, and gate contracts |
| `runtime/lib/agent-improvement-shadow-parity/index.ts` | Created | Stable public exports |
| `runtime/tests/unit/agent-improvement-shadow-parity.vitest.ts` | Created | Logical pairing, real execution, fault classification, closure, and gate tests |
| Leaf packet docs | Updated | Implemented status and verification evidence |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The adapter imports the shared parity comparator and contract identity from the common base directly, then layers Agent
Improvement logical scope, projection evidence, fixture closure, and failure classes over those contracts. Both executors receive
one sealed capsule. The legacy side folds an independent modeled projection, while the ledger side authorizes and appends the
typed events before invoking the landed reducer and replay-fingerprint pipeline.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Reuse `deep-improvement-common-shadow-parity` identities | Agent Improvement extends the common lane and must not fork comparator or gate semantics |
| Pair events by logical identity | Independent emitters cannot depend on shared raw event IDs |
| Keep the volatility allowlist closed | Unknown normalization could hide evaluation or promotion drift |
| Retain a distinct legacy oracle | Running both paths through the typed reducer would make parity vacuous |
| Keep gate output non-authoritative | Parity evidence cannot authorize rollback or cutover by itself |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result |
|---|---|
| Focused Vitest closeout at HEAD | PASS with 1 file and 36 tests, exit 0, 42.63s |
| Whole-runtime TypeScript closeout | PASS, exit 0 with `--noEmit --ignoreDeprecations 6.0` |
| Strict leaf validation | PASS with zero errors and zero warnings |
| Shared-contract reuse | Confirmed by direct imports of the common parity contract |

Focused command:

`cd .opencode/skills/system-deep-loop/runtime && npx --no-install vitest run tests/unit/agent-improvement-shadow-parity.vitest.ts --configLoader runner`

TypeScript command:

`cd .opencode/skills/system-deep-loop/runtime && npx --no-install tsc --noEmit --ignoreDeprecations 6.0`
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Target | Result | Status |
|---|---|---|
| No authority mutation | Receipt and gate authority fields remain false | Pass |
| Deterministic replay | Both paths repeat with stable stream and projection fingerprints | Pass |
| Fail-closed differences | Every comparable difference is unexplained and blocking | Pass |
| Shared-service reuse | The common comparator and parity contract identities are retained | Pass |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## Known Limitations

The harness remains additive-dark. Its receipt and mode-gate input are evidence for the successor gate and cannot promote a
proposal, mutate a baseline, retire the legacy writer, or authorize cutover. The authenticated successor remains responsible for
re-verifying evidence before any authority decision.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

None. The leaf follows the common-base extension pattern established by the sibling model-benchmark lane.
<!-- /ANCHOR:deviations -->
