---
title: "Checklist: Deep Alignment - Sealed Reference Artifacts"
description: "Blocking verification checklist for Deep Alignment authority-capsule sealing, lane and target integrity, verify-first evidence, witness replay, governed exceptions, convergence reproducibility, alignment-report synthesis, and resume handoff references."
trigger_phrases:
  - "deep alignment sealed artifacts checklist"
  - "deep-alignment tamper-evident artifact checklist"
  - "deep alignment authority capsule checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
    last_updated_at: "2026-07-24T03:11:05Z"
    last_updated_by: "codex"
    recent_action: "Reconciled adapter evidence with the accepted plain cross-digest boundary"
    next_safe_action: "Leaf 004 must verify deferred applicability and target digest closure"
    blockers: []
    key_files: []
    completion_pct: 14
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Alignment - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep Alignment sealed-artifact child. Execution evidence must pin
the candidate SHA, shared phase-006 descriptor and canonicalization versions, digest algorithm, authority-capsule identity,
mode artifact-kind matrix, lane and witness fixture corpus, ordered reference sets, commands and exit codes, and
dark-versus-legacy results. Verification fails on zero fixtures, unverified byte release, invalid authority accepted as a
pass, blanket exception suppression, mixed reference watermarks, changed legacy behavior, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-012 shared review-loop contracts and the executable write-set conflict graph are frozen for Deep Alignment
- [ ] CHK-002 [P0] The lifecycle artifact matrix covers init/scope, discover, iterate/check, witness/exception, convergence/report, and resume/save boundaries
- [x] CHK-003 [P0] The mode consumes the shared phase-007 sealing primitives and names no alternate digest, descriptor, store, or verifier. [evidence: the adapter and its real-store fixture use `SealedArtifactStore` for seal and verified-read paths; verification receipt: targeted Vitest 17/17 passed.]
- [ ] CHK-004 [P1] Predecessor `002-reducers-and-projections` owns findings, coverage, exception, lane-verdict, and report projection semantics, while this phase owns only artifact binding
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P1] Changes stay inside the Deep Alignment mode binding and integration surfaces with no shared-service cleanup, remediation, or authority transfer. [evidence: the implementation summary lists only mode-specific adapter and fixture surfaces; the shared sealer remains the authority; verification receipt: targeted Vitest 17/17 passed.]
- [x] CHK-006 [P1] Artifact-kind registration, authority-capsule fields, descriptor references, canonicalization versions, media types, expiry rules, rollback state, and reference ordering are explicit. [evidence: the registered kind matrix, closed material validators, and authority-liveness reads are exercised by the lifecycle registration, deterministic-seal, rolled-back, and live-authority tests; verification receipt: targeted Vitest 17/17 passed.]
- [x] CHK-007 [P1] Failure paths are typed, bounded, non-destructive, and never return fallback, nearest-match, repaired, partially verified, expired, rolled-back, or authority-unverified content. [evidence: missing, unsealed, tampered, truncated, stale-epoch, rolled-back, and wrong-kind paths fail closed before verified bytes are released; verification receipt: targeted Vitest 17/17 passed.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Equivalent authority capsules, lane scopes, adapter contracts, rule manifests, applicability policies, target snapshots, witness inputs, and exception records produce shared byte-identical canonical artifacts and digest references
- [ ] CHK-009 [P0] Init and scope seal one verified authority and lane reference set before discovery and reject live-only, path-only, alias-only, tag-only, expired, rolled-back, mixed-version, unsigned, and `latest` inputs
- [ ] CHK-010 [P0] Discovery fixtures preserve selected targets, omitted and unresolved scope, not-applicable results, adapter output, corpus partitions, and watermarks; mutation or corruption releases zero bytes
- [ ] CHK-011 [P0] Applicability and check fixtures preserve raw detector observations, rule identity, subject digest, verifier inputs, and typed unresolved outcomes before finding activation
- [ ] CHK-012 [P0] Verify-first finding fixtures require a live re-probe receipt and preserve evidence class, verified level, verifier identity, orthogonal confidence/severity, counterevidence, and append-only revisions
- [ ] CHK-013 [P0] Witness fixtures cover conforming, violating, boundary, relational, and stateful cases, retain shrink results, and detect deleted or weakened obligations across authority epochs
- [ ] CHK-014 [P0] Exception fixtures preserve the original failure and expose a scoped, owned, justified, authority-bound, expiring disposition that invalidates on authority, subject, verifier, scope, or time drift
- [ ] CHK-015 [P0] Convergence reads one verified state and findings snapshot and rejects mixed watermarks, missing references, changed inputs, invalid authority, expired exceptions, and unregistered policy material
- [ ] CHK-016 [P0] Report synthesis seals findings and exception views, per-lane `alignment-report.md`, worst-verdict rollup, unresolved obligations, and metadata whose bytes reproduce from identical verified inputs and reducer versions
- [ ] CHK-017 [P0] Resume and continuity-save fixtures classify unchanged, changed, missing, expired, and unverifiable references, identify affected lanes and findings, preserve old artifacts, and refuse trusted output on failure
- [ ] CHK-018 [P0] Missing, changed, truncated, substituted, wrong-kind, wrong-size, descriptor-drifted, corrupted, expired, mixed-epoch, and unsupported artifacts return typed failures before consumer release
- [ ] CHK-019 [P0] Replay and shadow parity bind the same ordered verified reference set and report input-equivalence failure before comparing different sets
- [ ] CHK-020 [P0] Identical sealed inputs plus registered review-loop, replay, reducer, and projection contracts reproduce byte-identical events, findings views, witness results, convergence evidence, lane reports, and verdict metadata
- [ ] CHK-021 [P0] Seal or verification failure blocks dark evidence and trusted synthesis while leaving legacy results, state, schema, report behavior, read-only posture, remediation posture, and authority unchanged
- [ ] CHK-022 [P0] The Deep Alignment mode gate and rollback switch pass without invoking certificate, receipt, remediation, or authority semantics owned by later phases
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P1] Every lifecycle row has positive, negative, corruption, expired, and unsupported-version fixtures with a named shared artifact kind
- [ ] CHK-024 [P1] Every authority-drift, target-drift, exception-expiry, and artifact-supersession path preserves the original digest and names affected lane, finding, witness, or report dependencies
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-025 [P1] Authority authenticity, publisher and epoch checks, target verification, verifier evidence, exception authorization, and access checks remain separate; diagnostics do not leak protected bytes
- [ ] CHK-026 [P1] Canonicalization rejects traversal, symlink escape, unsafe archives, ambiguous encodings, decompression abuse, unbounded rule or witness artifacts, and mutable authority references before sealing
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P2] The authority-capsule matrix, lane artifact boundaries, seal/read failure behavior, verify-first evidence rules, witness replay, exception lifecycle, report reproducibility, and resume drift rules are documented for successor consumers
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Mode binding, fixture, and evidence changes remain path-scoped; shared seal primitives, the phase-012 review-loop contract, and unrelated Deep Alignment siblings are not modified
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The adapter slice has evidence for CHK-003, CHK-005, CHK-006, and CHK-007, including direct and provenance-bound
authority-liveness reads. This checklist is not a full phase sign-off:
the remaining P0 lifecycle, witness, convergence, replay, parity, mode-gate, and cross-leaf integration checks remain
unclaimed. Plain applicability-decision and subject-snapshot digest closure is intentionally deferred to leaf 004 and
must be verified there before any authority cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The adapter documentation is reconciled, but the phase is not signed off. Later sign-off requires the mode verifier to
bind the authority-capsule and artifact-kind matrices, shared descriptor and canonicalization versions, digest references,
lane and witness results, exception dispositions, replay/parity evidence, deferred plain-digest closure, drift result,
handoff result, candidate SHA, and clean post-gate worktree state into one mode receipt for the later certificate phase.
<!-- /ANCHOR:sign-off -->
