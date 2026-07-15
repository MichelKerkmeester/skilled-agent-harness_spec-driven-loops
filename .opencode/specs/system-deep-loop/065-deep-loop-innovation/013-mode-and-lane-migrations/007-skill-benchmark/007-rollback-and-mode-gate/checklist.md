---
title: "Checklist: Skill Benchmark - Rollback & Mode Gate (013 phase 007)"
description: "Checklist for the Skill Benchmark rollback switch and independent mode gate over the deep-improvement-common migration backbone."
trigger_phrases:
  - "skill benchmark rollback mode gate checklist"
  - "skill-benchmark authority cutover checklist"
  - "skill benchmark migration gate checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Added P0 checks for Skill Benchmark rollback and independent mode gate"
    next_safe_action: "Run the gate matrix after scenario and certificate fixtures exist"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] CHK-001 [P0] Phase 012 shared contracts, mode 004 common services, predecessor `006-shadow-parity`, and the phase-013 write-set conflict graph are pinned at BASE
- [ ] CHK-002 [P1] The Skill Benchmark legacy recipe, stable legacy target, scenario IDs, and baseline fingerprint are recorded in the candidate report
- [ ] CHK-003 [P2] Mode-specific ownership is separated from shared ledger, receipt, sealing, budget, gauge, lock, continuity, and parity ownership
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Skill Benchmark adds only scenario, scoring, rollback, and gate logic; no deep-improvement-common service is reimplemented
- [ ] CHK-005 [P1] Every scenario, treatment, evaluator, environment, and certificate input has a stable fingerprint or explicit unsupported disposition
- [ ] CHK-006 [P2] Scope remains limited to this mode concern; sibling concerns and phase-014 authority movement are not absorbed
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Paired within-task and within-executor treatment fixtures preserve off/auto/forced/placebo or approved equivalent arms and report intention-to-treat lift separately from mediation metrics
- [ ] CHK-008 [P0] Near-neighbor, noise-skill, incompatible-environment, stale-skill, and composition-path controls execute and remain identifiable in the evidence ledger
- [ ] CHK-009 [P0] Discovery, loading, invocation, instruction adherence, trajectory compliance, deterministic outcome, dynamic reference, constraint coverage, cost, and latency observations remain separate raw events
- [ ] CHK-010 [P0] Scoring replay retains raw component values, deterministic hard checks, diagnostic milestone results, evaluator identity, and scoring-policy fingerprint
- [ ] CHK-011 [P0] The effect certificate verifies its content-addressed scenario and scoring artifacts, benchmark signature, validity domain, paired evidence, uncertainty, coverage, provenance, and limitations
- [ ] CHK-012 [P0] The ROLLBACK SWITCH defaults fail closed and retains the stable legacy path for missing, stale, conflicting, unauthorized, expired, or unverifiable cutover evidence
- [ ] CHK-013 [P0] The bounded rollback window records start, expiry, stable target, cutover fingerprint, trigger, recovery action, receipts, and verification result
- [ ] CHK-014 [P0] Unknown or irreversible effects enter quarantine; no automatic retry or silent authority selection occurs without a typed recovery decision
- [ ] CHK-015 [P0] Rollback drill restores the stable legacy path within the declared window with no duplicate logical commits and reconciled receipts
- [ ] CHK-016 [P0] The independent Skill Benchmark GATE refuses failed shadow parity, missing or unsealed artifacts, invalid certificates, fingerprint drift, incomplete evidence, and rollback unreadiness
- [ ] CHK-017 [P0] The green mode gate emits a mode certificate only after parity, artifact, certificate, rollback, scope, and handoff checks pass
- [ ] CHK-018 [P0] The phase-011 handoff contains the certificate, artifact manifest, parity receipt, rollback decision record, and residual-risk disposition
- [ ] CHK-019 [P0] Mixed-version fixtures prove the gate cannot authorize production authority movement owned by phase 014
- [ ] CHK-020 [P1] Exact-SHA replay, fault injection, build, type, unit, and benchmark verification reports non-zero evidence and no unexpected tracked mutation
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-021 [P1] The verifier report maps every REQ-001 through REQ-009 to a named fixture, command, result, and artifact digest
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P0] The fail-closed switch rejects unauthorized or stale cutover inputs before ledger authority is selected
- [ ] CHK-023 [P1] Skill composition and capability-flow fixtures cover safety regressions that isolated per-skill scores cannot expose
- [ ] CHK-024 [P2] Certificate provenance, signer or verifier identity, and artifact access boundaries remain bound to shared sealed-artifact policy
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-025 [P1] The mode certificate, rollback decision record, phase-011 handoff, and residual-risk disposition are reflected in the packet docs
- [ ] CHK-026 [P2] The implementation report names the shared services consumed and records every intentionally deferred question
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-027 [P1] Implementation lands in dependency-closed, path-scoped commits on the pinned worktree branch
- [ ] CHK-028 [P2] Verification mutates no tracked file outside the approved phase write set and generated evidence is content-addressed
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report binds the exact SHAs and artifact hashes,
shadow parity is green, the Skill Benchmark effect certificate is valid, the rollback drill restores the stable legacy
target within the bounded window, and the independent mode gate emits the phase-011 handoff without authorizing production
authority. Phase 014 remains the sole owner of staged authority cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the mode certificate and handoff are digest-bound, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
