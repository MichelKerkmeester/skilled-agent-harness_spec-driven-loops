---
title: "Implementation Plan: cycle detection (008 phase 002)"
description: "Implementation plan for deterministic ledger-window cycle detection across repeated states, claim frontiers, and next-foci, including sensitivity, progress gating, health events, and stopping-clock handoff."
trigger_phrases:
  - "cycle detection implementation plan"
  - "deep-loop repeated-state detector plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/008-convergence-termination-and-health/002-cycle-detection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/008-convergence-termination-and-health/002-cycle-detection"
    last_updated_at: "2026-07-15T15:19:57Z"
    last_updated_by: "codex"
    recent_action: "Defined the ledger-window detector, threshold policy, and stopping-clock handoff"
    next_safe_action: "Implement canonical observations and replay fixtures before enabling shadow signals"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Cycle Detection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime + typed ledger projections (phase 008 child 002) |
| **Change class** | Additive dark health/termination logic |
| **Execution** | Implement after phase-006 durable boundaries and phase-007 claim/focus projections are available; preserve legacy stop authority |

### Overview
Build a versioned observation projector at authorized iteration boundaries, retain a deterministic bounded fingerprint history,
detect fixed points and short repeated sequences, gate them on material progress, and append typed cycle-health events. The
initial policy tests periods `1..4` over 12 observations with three traversals, plus repeated focus/claim suspicion at three
occurrences within eight observations. Confirmed events feed the sibling stopping-clock input but remain non-authoritative.
Design and fixtures are grounded in phase-007 claim continuity and next-focus semantics, the phase manifest, and the shipped
snapshot-only council convergence path.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The ledger exposes an authorized, committed iteration boundary with monotonic cursor and replay fingerprint
- [ ] Phase-007 claim-continuity projections expose stable claim IDs, lifecycle/epistemic state, fold version, and unresolved work
- [ ] Phase-007 next-focus events expose stable candidate/region identity, policy version, projection watermark, and candidate-set fingerprint
- [ ] Coverage, blocker, contradiction, and independent-evidence progress inputs are typed at the same projection watermark
- [ ] Sibling `003-stopping-clocks` accepts a typed cycle contribution without granting this detector direct stop authority

### Definition of Done
- [ ] Period-one-to-four cycles and repeated focus/claim degeneration satisfy deterministic replay fixtures
- [ ] Productive revisitation fixtures clear or suppress cycle confirmation through the progress gate
- [ ] History gaps, stale watermarks, cursor drift, fingerprint conflicts, and unknown versions fail closed
- [ ] Suspected, confirmed, and cleared health events are idempotent, traceable, and transition-authorized
- [ ] Shadow integration changes no legacy convergence decision before the staged authority cutover
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Observation projector**: folds one committed ledger prefix into canonical focus, claim-frontier, composite-state, and progress-vector payloads, with every source bound to one watermark.
- **Canonical fingerprinting**: sorts stable typed identities, excludes presentation text and collection order, includes schema/reducer/policy versions, and verifies stored fingerprints on replay.
- **Bounded history**: retains the latest 12 completed observations plus an eviction-chain hash; incremental fold and full replay must produce identical order and boundary identity.
- **Sequence detector**: evaluates periods one through four, confirms after three complete identical traversals, and separately counts focus/claim signature occurrences in the latest eight observations.
- **Progress gate**: treats independent evidence, material claim changes, contradiction/blocker resolution, and versioned coverage gain as cycle-breaking; missing progress data makes evaluation unknown.
- **Health-event emitter**: appends idempotent suspected/confirmed/cleared events with the repeated-period trace, source cursors, fingerprints, progress verdict, and policy version.
- **Stopping-clock adapter**: projects confirmed severity into sibling 003's typed input while preventing direct `STOP_ALLOWED` authority in this phase.
- **Legacy bridge**: compares dark cycle output beside `.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs` without changing its threshold decisions or snapshot persistence.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the exact ledger envelope, iteration-boundary, claim-continuity, next-focus, coverage, and stopping-clock interface versions.
- Capture legacy council convergence fixtures and construct shadow histories for fixed points, oscillations, and productive revisitation.

### Phase 2: Implementation
- Implement canonical observation serialization and focus, claim-frontier, composite-state, and progress fingerprints.
- Implement bounded history folding, eviction-chain identity, resume restoration, and replay verification.
- Implement period `1..4` sequence matching, focus/claim occurrence detection, and the versioned progress gate.
- Implement transition-authorized health events and the non-authoritative stopping-clock contribution adapter.
- Wire shadow observability beside the legacy convergence result without changing current stop authority.

### Phase 3: Verification
- Prove byte-stable fingerprints and identical detector output under input reordering, crash/retry, resume, and full replay.
- Prove periods one through four confirm only on the third traversal and report exact cycle boundaries.
- Prove repeated focus/claim signatures suspect degeneration only after three occurrences within eight observations without progress.
- Prove every material-progress category prevents or clears a confirmed cycle and missing progress remains `not_evaluable`.
- Prove malformed history and version drift fail closed, events remain idempotent, and legacy convergence decisions stay unchanged.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Canonicalization matrix reorders claims/evidence and varies display text while preserving semantic state; mixed-watermark and unknown-version cases fail |
| REQ-002 | Incremental, resumed, and full-replay histories match entry-for-entry, including 12-entry eviction and chain hash |
| REQ-003 | Table-driven fixed-point and period-two-to-four fixtures assert no confirmation before three traversals and exact confirmation afterward |
| REQ-004 | Focus-only and claim-frontier-only repetition fixtures exercise the three-in-eight suspicion threshold with composite-state churn |
| REQ-005 | Independent evidence, claim transition, contradiction/blocker resolution, and coverage-gain fixtures each break the same candidate cycle |
| REQ-006 | Policy-schema fixtures pin all initial thresholds and reject silent threshold changes under an existing policy version |
| REQ-007 | Event fixtures verify authorization, idempotent retry, conflicting replay refusal, trace completeness, and clearing behavior |
| REQ-008 | Integration fixture proves confirmed health reaches the clock input while direct stop authority is rejected |
| REQ-009 | Gap, stale watermark, non-monotonic cursor, conflicting fingerprint, incomplete period, and insufficient-history fixtures return typed unknown/errors |
| REQ-010 | Shadow parity fixture records detector output while the legacy council decision and current authority path remain byte-for-byte unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The child planning contract declares `depends_on: []`; adjacency to `001-path-covering-termination` and
`003-stopping-clocks` is navigation and interface ordering, not a sibling implementation prerequisite. Runtime execution
consumes the program's phase-003 authorized ledger, phase-004 shared identity/control services, phase-006 durable iteration
boundaries, and phase-007 claim-continuity and next-focus projections. Required source contracts are
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/007-novelty-claims-continuity-and-projections/003-claim-continuity/spec.md`,
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/007-novelty-claims-continuity-and-projections/004-next-focus-semantics/spec.md`,
`.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs`, and
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/manifest/phase-tree.json`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The detector lands additive and dark behind a mode-neutral feature boundary. Disable cycle observation/event emission and the
clock adapter to restore the prior authoritative behavior; retain typed ledger history and rebuildable derived projections for
audit. If a policy or reducer is defective, pin readers to the prior version and rebuild the bounded history from the last
compatible ledger cursor. No rollback deletes claim, focus, progress, or cycle events, and no direct state migration is required.
<!-- /ANCHOR:rollback -->
