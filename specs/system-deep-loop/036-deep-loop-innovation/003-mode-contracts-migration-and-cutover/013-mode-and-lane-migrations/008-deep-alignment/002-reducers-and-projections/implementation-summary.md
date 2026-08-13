---
title: "Implementation Summary: Deep Alignment Reducers and Projections"
description: "The additive-dark Deep Alignment ledger now folds through the shared review-loop backbone into deterministic authority, lane, conformance, evidence, artifact, convergence, and status projections."
trigger_phrases:
  - "deep alignment reducer implementation"
  - "deep alignment projection contract"
  - "deep alignment shared review loop reuse"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
    last_updated_at: "2026-07-23T20:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the public reducer surface and adversarial typed-event verification"
    next_safe_action: "Consume the closed additive-dark projection surface downstream"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-reducers/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-reducers.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-alignment-reducers-finish"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The public barrel mirrors Deep Review but does not re-export its shared backbone"
      - "Deep Alignment consumes the shared backbone with mode alignment"
      - "Typed input order is causal across opaque stream names"
      - "References are validated by owner rather than ledger-wide membership"
      - "Candidate and finding identities cannot collide or silently rename"
      - "Completed terminals re-derive current blockers and cite the latest convergence on the established run stream"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-reducers-and-projections |
| **Completed** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; the legacy Deep Alignment path remains unchanged and authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

`runtime/lib/deep-alignment-reducers/` folds the landed Deep Alignment typed
ledger into closed, recursively frozen projections for run identity, the shared
review loop, authority alignment, lane plans, applicability, conformance,
proof witnesses, artifacts, and lifecycle status. The fold is deterministic,
checkpointable, registry-validated, and free of clocks, randomness, filesystem,
network, logging, adapter, or mutable-singleton inputs.

The public `index.ts` mirrors the converged Deep Review reducer surface with
Deep Alignment names. It exports the mode's versions, routing, field ownership,
reducer set and surface, initial state, verified-event reducer, surface verifier,
integrity digest, full fold, legacy projection, projection assertions, immutable
clone helpers, error class, and projection types. It deliberately does not
re-export `reduceSharedReviewLoopBackbone`: Deep Review owns that shared
primitive, while Deep Alignment imports and consumes it.

The mode-specific reducer passes `mode: 'alignment'` through
`DEEP_ALIGNMENT_SHARED_REVIEW_LOOP_CONFIGURATION` and calls the imported
`reduceSharedReviewLoopBackbone` for coverage, obligation, finding, hard-veto,
graph, and stop-eligibility semantics. No local copy or divergent convergence
implementation was added.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module imports the landed `deep-alignment-ledger-schema`, Deep Review's
shared backbone, and the real frozen envelope, authorized-ledger, and
mode-contract substrate. The Vitest fixtures construct events through
`prepareDeepAlignmentEvent` and the real registry, build real
`VerifiedLedgerEvent` frames, and compare full verified-event reduction with
the pure-fold oracle. `substrateImportsReal` is therefore true; no mock event
union, mock reducer surface, or copied backbone stands in for the substrate.

The inherited hardened patterns are exercised through the real fold:

- Causal input ordering is independent of whether an auxiliary stream name
  sorts before or after the established run stream.
- Per-stream sequence gaps fail closed with `cursor-gap`.
- Phantom producers and borrowed references reject by subject ownership, not
  global event membership.
- Candidate collisions and finding renames reject rather than aliasing two
  owners onto one logical identity.
- Open hard vetoes block convergence even when scalar signals are clean.
- Completed terminals re-derive blockers from current state and require the
  latest convergence on the run's initialization-established stream.
- The verified mode-contract reducer and declared surface match the full fold
  oracle over the complete successful history.
- The imported shared backbone produces the same eligibility, outcome, and
  blocker projection for the alignment configuration.

No writer, sealing path, certificate, rollback switch, mode gate, cutover, or
legacy mutation was added.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve causal input order | Stream identifiers are opaque labels and cannot define cross-stream chronology. |
| Validate references by owner | Ledger-wide membership would let one lane, subject, observation, or finding spend another owner's valid evidence. |
| Keep identities stable | Candidate and finding collisions or renames would corrupt lineage and artifact grouping. |
| Recompute completion from current state | Cached convergence eligibility describes an earlier state and cannot override late blockers. |
| Bind completion to the established stream | Auxiliary convergence and output events cannot author the run-level terminal decision. |
| Consume the shared backbone from Deep Review | Coverage, obligation, finding, veto, and convergence semantics remain one contract instead of two mode-local copies. |
| Keep the path additive-dark | Later migration leaves own sealing, parity execution, rollback, gating, and authority cutover. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 17 tests |
| Cross-mode reuse | PASS: imported `reduceSharedReviewLoopBackbone` matches the projected alignment review-loop result with `mode: 'alignment'` |
| Causal ordering | PASS: earlier- and later-sorting auxiliary stream names preserve the same review-loop and conformance projection |
| Ownership and identity | PASS: phantom pass, borrowed receipt, candidate collision, and silent finding rename reject through the real fold |
| Terminal freshness | PASS: late current-state blockers and stale established-stream convergence citations reject; auxiliary convergence does not supersede the run stream |
| Verified reducer surface | PASS: the full real `VerifiedLedgerEvent` history equals the pure-fold oracle |
| Runtime TypeScript project | PASS for this leaf: whole-runtime `tsc --noEmit` own-module diagnostics = 0; nine unrelated `deep-improvement-common-sealed-artifacts` diagnostics remain outside this scope |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

The legacy comparison view remains shadow-only and non-authoritative. This leaf
does not execute a dual-path shadow harness, seal artifacts, issue certificates,
write projections, switch authority, or activate the mode gate. Those actions
remain owned by later migration leaves.
<!-- /ANCHOR:limitations -->
