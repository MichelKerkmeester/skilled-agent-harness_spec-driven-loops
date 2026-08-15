---
title: "Checklist: Skill Benchmark - Rollback & Mode Gate"
description: "Checklist for the Skill Benchmark rollback switch and independent mode gate over the deep-improvement-common migration backbone."
trigger_phrases:
  - "skill benchmark rollback mode gate checklist"
  - "skill-benchmark authority cutover checklist"
  - "skill benchmark migration gate checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-15T15:50:59Z"
    last_updated_by: "codex"
    recent_action: "Verified HEAD suite and reconciled rollback-gate completion evidence"
    next_safe_action: "Use this completed additive-dark leaf as phase-014 gate evidence"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Skill Benchmark - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Skill Benchmark rollback and mode gate phase. Every item is
run against the exact candidate SHA and pinned BASE; the report records commands, exit codes, event and scenario counts,
certificate digests, parity results, rollback-window timestamps, and artifact-manifest hashes. The verifier fails on zero
scenarios, zero evidence, missing raw observations, unsealed artifacts, unsafe fallback, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 012 shared contracts, mode 004 common services, LANDED additive-dark siblings `001` through `003`, planned evidence siblings `004` through `006`, and the phase-013 write-set conflict graph are pinned at BASE [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-002 [P1] The Skill Benchmark legacy recipe, stable legacy target, scenario IDs, and baseline fingerprint are recorded in the candidate report [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-003 [P2] Mode-specific ownership is separated from shared ledger, receipt, sealing, budget, gauge, lock, continuity, and parity ownership [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Skill Benchmark adds only scenario, scoring, rollback, and gate logic; no deep-improvement-common service is reimplemented [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-005 [P0] Every caller-input digest and validator is guarded; circular, non-finite, forbidden-prototype, non-plain, wrong-shape, stale, or absent evidence returns a typed denial and legacy authority without throwing [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-006 [P0] A closed request schema authenticates every field, rejects unknown or inert fields, snapshots validated values, and cannot bypass the real gateway or accept a certificate for another mode [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Paired within-task and within-executor treatment fixtures preserve off/auto/forced/placebo or approved equivalent arms and report intention-to-treat lift separately from mediation metrics [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-008 [P0] Near-neighbor, noise-skill, incompatible-environment, stale-skill, and composition-path controls execute and remain identifiable in the evidence ledger [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-009 [P0] Discovery, loading, invocation, instruction adherence, trajectory compliance, deterministic outcome, dynamic reference, constraint coverage, cost, and latency observations remain separate raw events [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-010 [P0] Scoring replay retains raw component values, deterministic hard checks, diagnostic milestone results, evaluator identity, and scoring-policy fingerprint [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-011 [P0] The effect certificate verifies its content-addressed scenario and scoring artifacts, benchmark signature, validity domain, paired evidence, uncertainty, coverage, provenance, and limitations [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-012 [P0] The ROLLBACK SWITCH defaults fail closed and retains the stable legacy path for missing, stale, conflicting, unauthorized, expired, or unverifiable cutover evidence [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-013 [P0] The bounded rollback window records start, expiry, stable target, cutover fingerprint, trigger, recovery action, receipts, and verification result [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-014 [P0] Unknown or irreversible effects enter quarantine; no automatic retry or silent authority selection occurs without a typed recovery decision [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-015 [P0] Rollback drill restores the stable legacy path within the declared window with no duplicate logical commits and reconciled receipts [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-016 [P0] The required phase-009 parity receipt verifies integrity and mode/frontier/manifest binding, but its `exitStatus` is never adopted; readiness is independently re-derived through the real `TransitionAuthorizationGateway` and deterministic ledger replay without re-running the harness [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-017 [P0] Every required scenario, scoring, effect-certificate, receipt, rollback, and handoff reference resolves through the real substrate with expected kind, epoch/lifecycle/freshness/state, visibility/redaction, authority-liveness, seal, and content digest before the mode certificate can pass [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-018 [P0] The phase-014 handoff contains the certificate, artifact manifest, parity receipt, rollback decision record, and residual-risk disposition [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-019 [P0] Rollback drills require a predecessor token strictly below the canonical writer's durable coordinator high-water mark and new rollback token, cross-check the request anchor against the re-verified migration certificate, restore legacy, preserve history, and emit a receipt without authorizing phase-014 authority movement [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-020 [P1] Exact-SHA replay, fault injection, build, type, unit, and benchmark verification reports non-zero evidence and no unexpected tracked mutation [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-021 [P1] The verifier report maps every requirement to a named fixture, command, result, and artifact digest [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P0] The fail-closed switch rejects unauthorized or stale cutover inputs before ledger authority is selected [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-023 [P1] Skill composition and capability-flow fixtures cover safety regressions that isolated per-skill scores cannot expose [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-024 [P2] Certificate provenance, signer or verifier identity, and artifact access boundaries remain bound to shared sealed-artifact policy [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P1] The mode certificate, rollback decision record, phase-014 handoff, LANDED additive-dark predecessors, residual-risk disposition, and provenance limits cited from the golden 007 decision record are reflected in the packet docs [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-026 [P2] The implementation report names the shared services consumed and records every intentionally deferred question [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-027 [P1] Implementation lands in dependency-closed, path-scoped commits on the pinned worktree branch [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
- [x] CHK-028 [P2] Verification mutates no tracked file outside the approved phase write set and generated evidence is content-addressed [Evidence: fresh focused Vitest 80/80; tests/unit/skill-benchmark-rollback-gate.vitest.ts:202; lib/skill-benchmark-rollback-gate/mode-gate.ts:384]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report binds the exact SHAs and artifact hashes,
shadow parity is green, the Skill Benchmark effect certificate is valid, the rollback drill restores the stable legacy
target within the bounded window, and the independent mode gate emits the phase-014 handoff without authorizing production
authority. Phase 014 remains the sole owner of staged authority cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the mode certificate and handoff are digest-bound, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
