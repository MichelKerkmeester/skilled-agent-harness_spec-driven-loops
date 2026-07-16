---
title: "Implementation Plan: whole-system gate"
description: "Implementation Plan for phase 016 of the 006 recommendations-implementation program: the exact-SHA whole-system acceptance gate before integrate-latest and closeout."
trigger_phrases:
  - "whole-system gate implementation plan"
  - "deep-loop phase 016 implementation plan"
  - "exact-SHA acceptance gate plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/016-whole-system-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/016-whole-system-gate"
    last_updated_at: "2026-07-15T16:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped whole-system evidence to exact-SHA gate stages"
    next_safe_action: "Assemble the immutable gate manifest after phase 015"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Whole-System Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime + phase-008/004/008/009 gate harnesses |
| **Change class** | Verification and acceptance gate; no authoritative runtime change |
| **Execution** | Isolated clean worktree at one frozen candidate SHA, compared to the phase-003 BASE |

### Overview
The gate is a staged verifier, not a production rewrite. It first freezes the candidate SHA and its artifact
manifest, then runs the eight independent mode gates, cross-version replay, crash injection, counterfactual and
degeneration checks, full semantic parity against phase 003, the blocking SOL review, and recursive strict validation.
Every output is bound to the candidate SHA and BASE. Verification uses disposable backends and sanitized fixtures; any
failure classifies and reopens its owning phase rather than changing the baseline or weakening the pass bar.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `015-legacy-writer-retirement` has passed zero-use telemetry, rollback evidence, and archival-reader checks
- [ ] The phase-003 BASE manifest, protected behavior scenarios, replay fixtures, rollback anchors, and digests are available
- [ ] The phase-008 shadow-parity harness compares scenario IDs and semantics rather than counts alone
- [ ] Phase-007 effect recovery, receipts, blinded adjudication, and phase-011 health/degeneration contracts are executable
- [ ] Phase-012 mixed-version fixtures and the phase-013 per-mode gate outputs are frozen and addressable
- [ ] A clean candidate worktree, toolchain record, exact SHA, and disposable backend policy are established

### Definition of Done
- [ ] One exact candidate SHA and BASE SHA bind every gate result and verifier report
- [ ] All eight mode gates pass behavior, parity, replay, artifact/certificate, and rollback-switch checks
- [ ] Mixed-version replay, crash injection, counterfactual adjudication, and degeneration/health checks pass
- [ ] Full semantic parity against phase 003 is green, including budget, receipt, terminal, replay, and archival behavior
- [ ] The blocking SOL review approves the exact candidate commit with no unresolved blocking finding
- [ ] `validate.sh --strict --recursive` reports `Errors: 0` and `Warnings: 0`
- [ ] The tracked worktree remains unchanged and all failures have phase owners and reopen actions
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Immutable gate manifest**: records candidate SHA, phase-003 BASE SHA, source and fixture digests, tool versions,
  gate commands, expected results, and the failure-to-owner map; every result references its manifest hash.
- **Mode gate layer**: runs `deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`, `deep-alignment`,
  `agent-improvement`, `model-benchmark`, and `skill-benchmark` independently, then records shared-boundary evidence.
- **Compatibility layer**: replays phase-012 mixed-version fixtures through upcasters, dual reads, projections,
  archival readers, replay fingerprints, resume, and terminal projection checks.
- **Recovery layer**: injects failures at effect, receipt, dispatch, checkpoint, resume, and recovery boundaries and
  verifies phase-007 idempotency, fencing, receipt integrity, and salvage behavior.
- **Adjudication and health layer**: executes phase-007 blinded/counterfactual controls and phase-011 degeneration,
  cycle, repetition, collapse, quality-decay, and stopping-health checks.
- **Baseline layer**: uses phase-008 shadow parity against phase-003 protected scenarios, comparing semantics and
  invariants for budgets, receipts, terminal state, replay fingerprints, sealed artifacts, and archival reads.
- **Review and validation layer**: binds the blocking SOL review and recursive strict validator to the same candidate
  SHA; any failure emits an owner and blocks phase 017.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm `015-legacy-writer-retirement` evidence and the phase adjacency; do not start from a moving checkout.
- Resolve the phase-003 BASE and create the candidate exact-SHA manifest with tree state, toolchain, fixture, and
  artifact digests.
- Verify the phase-008 parity harness, phase-007 recovery/adjudication services, phase-011 health harness, phase-012
  fixtures, eight mode reports, cutover certificates, and archival-reader evidence are available.
- Define disposable backend roots, sanitized external-effect adapters, fault-injection points, expected controls, and
  the failure-to-owner reopen matrix before executing tests.

### Phase 2: Gate Execution
- Run all eight mode gates and retain their behavior, parity, sealed-artifact/certificate, replay, resume, and
  rollback-switch evidence under the manifest hash.
- Execute every phase-012 mixed-version fixture family and compare replay fingerprints, projections, archival reads,
  and terminal outcomes.
- Inject crashes at the declared phase-007 effect and checkpoint boundaries; recover and verify no lost, duplicated,
  or unauthorized effects and no stranded in-flight state.
- Run blinded/counterfactual adjudication cases and phase-011 health/degeneration cases with controls, preserving the
  decision evidence and expected threshold outcomes.
- Run phase-008 full parity against phase-003 by stable scenario ID and semantic assertion, including budgets,
  receipts, terminal state, replay fingerprints, sealed artifacts, and archival readers.

### Phase 3: Verification
- Check every result for candidate-SHA, BASE-SHA, manifest-hash, fixture-digest, and toolchain consistency.
- Run the blocking SOL verifier review against the exact candidate commit and record commands, exit codes, findings,
  mutation checks, and approval status.
- Run `validate.sh --strict --recursive` over the 006 tree; require `Errors: 0` and `Warnings: 0`.
- Confirm no tracked mutation, classify every failure, reopen the owning phase when required, and prevent phase 017
  handoff until the corrected candidate reruns the affected and dependent gates.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Freeze and hash the candidate/BASE pair, manifest, toolchain, source artifacts, fixtures, and every result reference |
| REQ-002 | Execute eight named mode gates; require behavior, parity, sealed artifact/certificate, replay, resume, and rollback-switch evidence for each |
| REQ-003 | Run mode scenarios through the phase-008 harness by stable ID and semantic assertion; classify all deltas |
| REQ-004 | Replay phase-012 old/new fixture families through upcasters, projections, archival readers, resume, and deterministic fingerprints |
| REQ-005 | Inject failures at effect/receipt/dispatch/checkpoint/resume boundaries and verify phase-007 recovery, fencing, idempotency, and salvage |
| REQ-006 | Run phase-007 blinded and counterfactual controls with order/identity perturbations and expected decision outcomes |
| REQ-007 | Run phase-011 repetition, cycle, collapse, quality-decay, stopping, and recovery health cases |
| REQ-008 | Compare full protected behavior against phase-003 with budget, receipt, terminal, replay, sealed-artifact, and archival-read assertions |
| REQ-009 | Require a blocking SOL report bound to candidate SHA and BASE SHA with exit codes, findings, and approval |
| REQ-010 | Run `validate.sh --strict --recursive`; require `Errors: 0` and `Warnings: 0` |
| REQ-011 | Use disposable backends and finish with tracked-worktree/index mutation checks |
| REQ-012 | Apply the failure-to-owner map and rerun affected/dependent gates on the corrected exact SHA |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The gate inherits the ordering and per-phase contract in `execution-sequencing-strategy.md` and
`manifest/phase-tree.json`. It depends on the phase-003 baseline and state census, phase-008
`003-shadow-parity-harness`, phase-007 `001-receipts-and-effect-recovery` and `003-blinded-adjudication-service`,
phase-011 `005-health-and-degeneration-harness`, phase-012 `003-mixed-version-fixtures`, the eight phase-013 mode
gates, phase-014 cutover certificates, and phase-015 writer-retirement evidence. Phase 017 is downstream and may not
integrate or close out until this gate has a green exact-SHA result.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The gate is verification-only and must not alter authoritative runtime state or the phase-003 baseline. If a harness
change is needed to execute the gate, keep it in a path-scoped, reversible commit and revert it without touching the
candidate under test. A mode/parity failure reopens its phase-013 mode or phase 008 when shared; mixed-version or
replay failure reopens phase 012, 005, or the owning ledger/orchestration phase; effect failure reopens phase 007 or
the affected cutover/retirement phase; counterfactual or degeneration failure reopens phase 007, 008, or the affected
mode; baseline drift reopens phase 003 or the owning contract; and strict-validation or SOL failure reopens the
reported packet or owning phase. The corrected candidate receives a new exact SHA and must rerun all affected and
dependent checks before phase 017 is unblocked.
<!-- /ANCHOR:rollback -->
