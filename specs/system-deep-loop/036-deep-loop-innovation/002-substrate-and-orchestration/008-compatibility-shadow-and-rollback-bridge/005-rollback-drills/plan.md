---
title: "Implementation Plan: Rollback Drills"
description: "Implementation plan for hermetic, mode-scoped rollback rehearsals that prove legacy authority can be restored with intact replay, projection, state, epoch, and receipt evidence before phase 014."
trigger_phrases:
  - "rollback drills implementation plan"
  - "deep-loop rollback rehearsal runner"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills"
    last_updated_at: "2026-07-21T03:37:31Z"
    last_updated_by: "codex"
    recent_action: "Completed the rollback runner, integrity checks, and certificate verifier"
    next_safe_action: "Keep the runtime dark until the later cutover phase consumes current evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/rollback-drills/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/rollback-drills.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Rollback Drills

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop migration safety bridge |
| **Change class** | Test-lane rollback orchestration, integrity verification, and evidence certification |
| **Execution** | Hermetic per-mode drill; real legacy authority remains unchanged |

### Overview
Implement one reusable rollback-drill runner driven by a versioned mode manifest. The runner preflights current parity,
classification, rollback, projection, fingerprint, and receipt inputs; forks control and cutover lanes from one sealed
capsule; performs a simulated test-lane authority flip; injects and detects a declared regression; executes the exact
phase-004 rollback sequence; resumes legacy; verifies replay components, projected legacy bytes, state/effect counts,
epochs, and receipts; then emits an immutable drill certificate. Phase 014 accepts that certificate only while every
bound input remains current.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase-004 rollback policy and `../../manifest/phase-tree.json` are pinned by digest and policy version
- [x] The mode has a current sibling-003 parity certificate with zero unresolved divergences
- [x] Every in-flight shape in the drill capsule has one predecessor-004 disposition
- [x] The rollback anchor, legacy writer, adapters, projections, fingerprint verifier, and authority epochs are available
- [x] Phase-007 receipt/effect adapters have hermetic targets or cassettes and no unresolved intent
- [x] The runner can prove its authority store, state roots, effect sinks, clock, and evidence paths are test-only

### Definition of Done
- [x] The complete forward-detect-rollback-resume sequence executes for every cutover-eligible mode
- [x] Rollback finishes within the phase-004 window and any stricter declared mode deadline
- [x] Fingerprint components and legacy projections match the control after legacy resumes
- [x] State, artifacts, events, effects, receipts, epochs, and stale-writer denials reconcile without ambiguity
- [x] A current mode-scoped drill certificate is machine-verifiable by the phase-014 cutover preflight
- [x] No drill changes real authority, live packet state, or an irreversible external effect
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Drill manifest loader** validates the mode, candidate, BASE, policy, rollback window, parity certificate, state
  classification, sealed capsule, rollback anchor, contract versions, injection fixture, declared observations, and
  evidence destination. Unknown fields affecting replay or authority are rejected rather than ignored.
- **Isolation preflight** resolves every target path and authority endpoint, proves they are drill-owned, verifies the
  synthetic clock and hermetic effect adapters, and snapshots real authority identifiers for an unchanged post-check.
- **Lane coordinator** keeps the expected reconstruction separate from the cutover store, then forks the verified
  cutover/recovery ledger tail immediately before restoration proof. The shared immutable prefix removes random
  authorization-decision noise so the comparison isolates expected versus actually persisted restoration state.
- **Test authority controller** exercises the production authority state machine against an isolated store: advance to
  `new_authoritative_reversible`, fence stale legacy authority in that lane, then restore `legacy_authoritative` at a
  new monotonic epoch during rollback. It cannot address the real authority record.
- **Fault injector and detector adapter** places one declared fault after a durable cut point and requires the named
  production-shaped detector to emit a typed trigger. Missing or mismatched detection is a drill failure.
- **Rollback executor** freezes admission, fences the spine writer, applies every declared predecessor-004 disposition
  into the reconstruction, reconciles unresolved effect intents, restores legacy authority and durable state by
  compare-and-swap plus atomic persistence, denies stale writers, and reads the state back before resume verification.
- **Integrity verifier** uses sibling-003 replay comparison semantics over the full post-divergence tail, raw persisted
  byte comparison, phase-007 receipts/effect recovery, and exact state/artifact/applied-disposition accounting. It
  compares verified observable components rather than requiring run-specific final descriptor digests to be equal.
- **Certificate issuer** writes an immutable pass/fail record bound to all inputs and evidence. The phase-014 verifier
  recomputes freshness and refuses partial, failed, stale, wrong-mode, or unverifiable evidence.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Define the versioned drill-manifest and certificate schemas from `spec.md` without inventing new authority policy.
- Inventory each cutover-eligible mode's rollback anchor, parity certificate, classification manifest, regression
  fixtures, legacy/spine entry points, projections, receipt adapters, and stricter operational deadline if declared.
- Build the isolated authority store, lane roots, synthetic clock, hermetic effect targets, and unchanged-real-authority guard.

### Phase 2: Implementation
- Implement preflight, capsule cloning, the control continuation, simulated forward flip, bounded spine workload, and
  durable evidence capture at each authority and effect boundary.
- Implement declared fault injection plus detector adapters for fingerprint, projection, epoch, receipt/effect, and
  crash/timeout regressions; require exact fault-to-detector matching.
- Implement admission freeze, spine fencing, disposition-driven reconstruction, legacy compare-and-swap restoration,
  durable state replacement and readback, stale-writer denial, and resumed legacy continuation.
- Implement fingerprint-component, projection-byte/reader, state/artifact/event, receipt/effect, epoch, timing, and
  isolation verifiers plus immutable drill-certificate issuance.
- Implement the phase-014 consumer that checks certificate signature/receipt chain, complete evidence, mode identity,
  policy compatibility, and drift across every bound input before a real flip.

### Phase 3: Verification
- Run one clean pass per cutover-eligible mode and one negative case for every declared regression class.
- Prove injected failures are detected, rollback completes before closure, legacy resumes correctly, cutover-lane
  events remain auditable, and real authority/effects remain unchanged.
- Mutate each bound identity independently and verify the phase-014 preflight rejects the stale certificate.
- Run crash injection at the authority/effect cut points and verify recovery produces one terminal receipt outcome,
  no double application, and no automatic success for `in_doubt`.
- Run strict packet validation and the blocking SOL verifier against the exact candidate evidence set.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Feed valid and cross-mode/stale/production-target manifests; only the complete isolated mode manifest starts |
| REQ-002 | Assert the evidence timeline contains every forward, detection, rollback, and resumed-legacy transition in order |
| REQ-003 | Inject each registered fault and require the exact detector class and durable trigger receipt; wrong or missing detection fails |
| REQ-004 | Vary one declared disposition and prove reconstructed state changes; reject `BLOCK` and unknown dispositions before mutation; verify real applied counts, fences, epochs, preserved events, and stale-writer denial |
| REQ-005 | Exercise normal and synthetic near-closure clocks; rollback must complete before the policy window and stricter deadline |
| REQ-006 | Verify both transcripts through bounded work, effects, forward cutover, rollback transitions, and restored state; assert the range end exceeds the sealed head and compare effective-event/canonical-projection digests |
| REQ-007 | Corrupt the durable post-restore record and short-circuit restoration independently; both must fail raw-byte, reader, state, or replay integrity against control |
| REQ-008 | Reconcile state/artifact/event counts and every effect intent to one confirmed/reconciled result; reject conflict or `in_doubt` |
| REQ-009 | Verify certificate bindings, evidence receipts, immutable ranges, reason codes, and verifier identity; tampering fails verification |
| REQ-010 | Drift code, BASE, policy, parity, classification, adapter, projection, comparator, or rollback assets and require phase-014 refusal |
| REQ-011 | Compare real authority and live-effect snapshots before and after every pass/failure; any mutation fails and quarantines the run |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase declares no hard graph dependency (`depends_on: []`). Its execution inputs are the governing
`../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`,
the sibling `../003-shadow-parity-harness/spec.md`, predecessor `004-inflight-state-classification`, the phase-007
`../../007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md`, and
`../../manifest/phase-tree.json`. It also consumes the registered replay-fingerprint verifier and sibling legacy
projection contract. Phase 013 mode gates and phase 014 cutover preflight consume the resulting certificate; phase 015
may not treat a rehearsal as live zero-use or retirement evidence.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation of the drill machinery remains additive and disabled by default. If the runner or verifier is unsafe,
disable its test-only registration, invalidate certificates produced by the affected version, and retain all drill
evidence for diagnosis. No real authority or live effect must need restoration because isolation preflight blocks those
targets. Re-enable only after the affected manifests and complete mode closure rerun with a corrected runner version;
phase 014 continues to reject cutover while evidence is absent or invalid.
<!-- /ANCHOR:rollback -->
