---
title: "Implementation Plan: Skill Benchmark - Rollback & Mode Gate"
description: "Implementation Plan for the Skill Benchmark rollback switch and independent mode gate over the deep-improvement-common migration backbone."
trigger_phrases:
  - "skill benchmark rollback mode gate implementation plan"
  - "skill-benchmark authority cutover implementation plan"
  - "skill benchmark migration gate plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Bounded Skill Benchmark rollback and gate architecture to shared services"
    next_safe_action: "Freeze mode fingerprints and verifier evidence fields"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Benchmark - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Skill Benchmark mode 007 |
| **Change class** | Mode contract, safety control, verifier fixtures, and certificate planning |
| **Execution** | Isolated worktree pinned to the phase BASE; implementation follows the phase-013 write-set conflict graph |

### Overview
This phase adds the Skill Benchmark-specific scenario and scoring boundary on top of deep-improvement-common. The design
keeps scenario treatment, observation, scoring, certificate, rollback, and gate evidence typed and content-addressed,
while shared ledger, receipt, artifact, budget, lock, parity, and authorization behavior remains delegated to the common
services. The ROLLBACK SWITCH is a fail-closed guard around any future authority decision. The independent mode gate is a
readiness certificate, not a production authority flip.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 012 shared mode contracts and the phase-013 write-set conflict graph are frozen
- [ ] Deep-improvement-common mode 004 service interfaces and ownership boundaries are available
- [ ] Predecessor `006-shadow-parity` has a reproducible green/failed result contract
- [ ] Scenario treatment arms, benchmark signature, environment metadata, and scoring-policy fingerprint are specified
- [ ] The ROLLBACK SWITCH default, rollback window, stable legacy target, and refusal events are specified
- [ ] The independent mode-gate inputs, certificate fields, and phase-014 handoff are specified
- [ ] No task re-implements shared ledger, receipt, sealing, budget, gauge, lock, continuity, or parity services

### Definition of Done
- [ ] Paired scenario and scoring evidence replays under the pinned Skill Benchmark fingerprint
- [ ] The ROLLBACK SWITCH refuses unsafe authority decisions and restores the stable legacy path within the declared window
- [ ] The Skill Benchmark GATE accepts only green parity, sealed artifacts, and a verified mode certificate
- [ ] Phase-014 handoff evidence is emitted without changing production authority ownership
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared backbone boundary:** consume deep-improvement-common typed event, receipt, artifact, budget, gauge, lock,
  continuity, replay, and shadow-parity services through their frozen interfaces. Skill Benchmark contributes adapters,
  scenario schemas, scoring reducers, and gate policy only.
- **Scenario contract:** represent task, executor, skill treatment, registry context, environment/dependency compatibility,
  recipe, seed, and benchmark signature as immutable inputs. Treat off/auto/forced/placebo as causal arms when supported;
  use paired within-task and within-executor contrasts as the primary comparison.
- **Observation contract:** append stage-specific events for availability, discovery, loading, invocation, instruction
  adherence, trajectory compliance, deterministic final-state checks, dynamic reference checks, constraint coverage,
  cost, latency, failure, and abstention. Preserve raw observations before reduction.
- **Scoring contract:** separate intention-to-treat lift from diagnostic mediation metrics. Require near-neighbor and noise
  controls, compatibility metadata, worst-family retention, and constraint coverage. Reject score reuse after a recipe,
  skill, environment, evaluator, or policy fingerprint changes.
- **Effect certificate:** derive one content-addressed certificate from sealed scenario and scoring artifacts. Include paired
  deltas, confidence or uncertainty, coverage, validity domain, provenance, policy fingerprints, cost, latency, and limits.
- **ROLLBACK SWITCH:** default to legacy authority. Accept a cutover request only when the transition-authorization receipt,
  mode certificate, artifact manifest, parity receipt, and unexpired rollback window agree. Any absent, stale, conflicting,
  or unverifiable input emits a refusal and keeps the legacy path active.
- **Mode GATE:** independently evaluate parity, artifact sealing, certificate integrity, rollback readiness, fingerprint
  compatibility, scope, and handoff completeness. The gate can emit a mode-readiness certificate but cannot flip authority.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-015 shared contracts, mode-004 common services, predecessor `006-shadow-parity`, and phase-013
  write-set conflict graph are present at the pinned BASE.
- Record the legacy behavior baseline, current benchmark recipe, existing scenario identifiers, and the stable legacy
  rollback target without modifying research inputs.
- Define the Skill Benchmark ownership map: mode-specific scenario/scoring code here; shared infrastructure elsewhere.

### Phase 2: Implementation
- Define the typed scenario-run schema, treatment matrix, compatibility metadata, benchmark signature, and logical branch
  identity over the shared event envelope.
- Implement scenario adapters for paired treatments, negative controls, progressive-disclosure stages, executable dynamic
  references, and constraint coverage while retaining raw execution receipts.
- Implement the Skill Benchmark scoring reducer and validity checks. Keep deterministic hard checks separate from diagnostic
  milestone and dynamic evaluator signals; preserve raw component scores and evaluator identity.
- Build the content-addressed effect certificate from sealed artifacts. Bind it to the scenario recipe, skill digest,
  environment/dependency digest, executor descriptor, evaluator/scoring versions, and validity domain.
- Define the ROLLBACK SWITCH state machine: `legacy_stable`, `cutover_pending`, `ledger_active`, `rollback_requested`,
  `legacy_restored`, `quarantined`, and `expired`. Require typed transition receipts and fail closed on invalid transitions.
- Define the bounded rollback window, expiry handling, recovery evidence, unknown-effect quarantine, and stable-target
  verification using shared effect-recovery and transition-authorization services.
- Define the independent Skill Benchmark GATE and its certificate. Require shadow parity, sealed artifact manifest,
  verified effect certificate, rollback readiness, clean scope, compatible fingerprints, and phase-014 handoff fields.

### Phase 3: Verification
- Replay paired scenario runs and scoring from sealed inputs and compare raw events, reducer outputs, and certificates.
- Exercise off/auto/forced/placebo or approved treatment arms, near-neighbor and noise controls, incompatible environments,
  stale skills, missing canaries, missing constraints, and partial trajectories.
- Exercise switch refusals for missing authorization, stale or mismatched fingerprints, expired windows, missing artifacts,
  certificate invalidity, conflicting decisions, and unknown external effects.
- Drill cutover-window rollback to the stable legacy path, verify recovery receipts, and prove no duplicate logical commits.
- Run the independent gate against green, failed, partial, stale, unsealed, and mixed-version fixtures. Confirm only the
  green case emits a mode certificate and phase-014 handoff.
- Confirm the gate cannot authorize production cutover and that all implementation changes remain within the phase write set.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Contract-level ownership test proves Skill Benchmark calls shared services and has no duplicate common implementation |
| REQ-002 | Typed event fixture and replay test preserve scenario identity, treatment, environment, recipe, seed, and benchmark signature |
| REQ-003 | Paired treatment matrix proves within-task/within-executor contrasts, stage separation, and negative-control behavior |
| REQ-004 | Reducer golden replay retains raw observations and rejects stale or changed scoring fingerprints |
| REQ-005 | Certificate verifier checks content-addressed artifact manifest, validity domain, provenance, coverage, uncertainty, and limitations |
| REQ-006 | Fail-closed switch matrix covers missing, stale, conflicting, unauthorized, expired, and unverifiable cutover inputs |
| REQ-007 | Rollback drill covers each window boundary, stable-target restoration, unknown effect quarantine, and receipt reconciliation |
| REQ-008 | Mode-gate matrix accepts only green parity plus sealed artifacts plus valid certificate plus rollback readiness |
| REQ-009 | Handoff fixture includes phase-014 certificate evidence and demonstrates no phase-017 authority mutation |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase depends on the parent 065 contracts and phase 012 shared mode interfaces; deep-improvement-common mode 004;
the typed ledger and transition gateway; shared evidence/control services; compatibility and shadow parity; durable
fan-out/fan-in, projections, and convergence/health services; predecessor `006-shadow-parity`; and the phase-013
write-set conflict graph. It consumes the packet-033 behavior benchmark harness as an extended baseline and does not
rewrite either research registry. The phase-013 sequencing rule places mode 004 before this benchmark variant.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation lands in path-scoped commits. If a code or fixture change fails verification, revert the phase commit or
discard the isolated worktree before any authority action. If a future cutover request fails the switch, keep the legacy
path authoritative and append the typed refusal. If a cutover has started inside the declared window, the switch restores
the pinned legacy target only through a transition-authorized rollback event, then verifies receipts, state compatibility,
and no duplicate commits. After window expiry, the mode enters `quarantined` or `expired`; it must not silently reopen or
retry an unknown effect. This phase defines and tests the switch, but phase 017 owns live authority movement.
<!-- /ANCHOR:rollback -->
