---
title: "Feature Specification: whole-system gate"
description: "Plan the final whole-system acceptance gate for the 006 recommendations-implementation program: freeze an exact candidate SHA, run every mode and cross-system parity gate, exercise mixed-version replay and crash recovery, test counterfactual adjudication and degeneration health, obtain a blocking SOL review, and recursively strict-validate the complete packet before closeout."
trigger_phrases:
  - "whole-system gate"
  - "deep-loop phase 016"
  - "exact-SHA deep-loop acceptance"
  - "recursive strict deep-loop validation"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/016-whole-system-gate"
    last_updated_at: "2026-07-15T16:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the exact-SHA whole-system acceptance gate contract"
    next_safe_action: "Execute the frozen-SHA gate after phase 015 writer retirement"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Whole-System Gate

> Phase adjacency under the 006 parent (grouping order, not a runtime dependency): predecessor `015-legacy-writer-retirement`; successor `017-integrate-latest-and-closeout`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/016-whole-system-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 016 of the 006 recommendations-implementation program; final pre-integration gate in `manifest/phase-tree.json` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 006 program changes a live, stateful runtime through additive-dark writes, compatibility adapters, shadow parity,
staged authority cutover, and gated legacy-writer retirement. A green unit or per-mode result is not enough to prove that
the complete system still runs consistently after phase `015-legacy-writer-retirement`: shared ledger transitions,
receipts, effect recovery, replay, budgets, health signals, archival readers, and mode-specific behavior can regress at
their boundaries. The parent specification names this phase as the whole-system gate, and the
`execution-sequencing-strategy.md` requires every phase gate to be bound to an exact commit and to produce a blocking
SOL verifier receipt.

The phase-003 baseline is the only accepted comparison authority. The gate therefore freezes one candidate commit SHA
and verifies that every report, fixture, toolchain record, mode result, replay fingerprint, and parity result references
that same SHA and the phase-003 BASE. It consumes the phase-008 shadow-parity harness, the phase-007 effect-recovery
and blinded/counterfactual adjudication services, the phase-011 health/degeneration harness, and the phase-012
mixed-version fixtures. It must catch failures that per-mode gates cannot see: mixed-version state, injected crashes,
cross-mode degeneration, receipt or budget drift, and packet-wide strict-validation errors.

This is an acceptance gate, not a late implementation pass. Verification mutates no tracked runtime or spec file. A
failure blocks phase 017 and reopens the phase that owns the failed contract; the gate may not be made green by changing
the phase-003 baseline, suppressing a fixture, accepting an unexplained parity delta, or waiving a strict-validation
error.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Freeze an immutable candidate exact SHA after `015-legacy-writer-retirement`, record its relationship to the
  phase-003 BASE, and bind tool versions, source/artifact digests, fixture versions, and gate-manifest hash to it.
- Run independent behavior and parity gates for all eight phase-013 workstreams named in the manifest:
  `deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`, `deep-alignment`,
  `agent-improvement`, `model-benchmark`, and `skill-benchmark`.
- Replay the phase-012 mixed-version fixtures across old and new event/state shapes, including upcasters, legacy
  archival readers, projections, replay fingerprints, resume, and deterministic terminal outcomes.
- Inject crashes at effect claim, dispatch, receipt commit, checkpoint, resume, and recovery boundaries and verify the
  phase-007 receipts/effect-recovery contract, idempotency, locks/fencing, and salvage behavior.
- Run counterfactual and blinded adjudication cases from phase 007, including order/identity perturbations and known
  decision-changing controls, then run phase-011 generic health and degeneration cases for repetition, collapse,
  quality decay, cycle signals, and stopping behavior.
- Run full parity against the phase-003 baseline through the phase-008 shadow-parity harness, comparing stable scenario
  IDs and semantic outcomes rather than package or scenario counts alone; include budgets, receipts, terminal state,
  replay fingerprints, and sealed artifacts.
- Produce a blocking SOL verifier review bound to the exact candidate commit, with commands, exit codes, artifact
  digests, fixture IDs, baseline SHA, mutation checks, findings, and a final approval verdict.
- Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <parent> --strict --recursive` and require
  `Errors: 0` and `Warnings: 0` across the complete 006 tree before handoff to phase 017.
- Apply a failure-to-owner map that reopens the relevant phase and reruns all dependent gates after a correction.

### Out of Scope
- Implementing or correcting the ledger, adapters, effect-recovery service, adjudication service, health harness,
  mode migrations, or legacy-writer retirement; failures are routed back to their owning phases.
- Changing the phase-003 BASE, baseline scenario semantics, phase-008 parity rules, phase-012 fixtures, or any frozen
  acceptance threshold to make a candidate pass.
- Integrating later origin changes, reconciling packet metadata, or closing the parent program; phase 017 owns those
  actions and must rerun this gate after integration.
- Re-running the 065 research or adding `ai-system-improvement`, which the phase tree explicitly excludes.
- Treating a count-only comparison, a non-blocking review, a skipped mode, or a validation warning as acceptance.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The candidate is frozen at one exact SHA | The gate manifest records one full candidate SHA, the phase-003 BASE SHA, ref provenance, tree state, tool versions, source/artifact digests, and fixture versions; every result names the same candidate SHA |
| REQ-002 | Every mode passes an independent whole-mode gate | All eight manifest workstreams run their behavior, parity, sealed-artifact/certificate, replay, resume, and rollback-switch checks; no mode is skipped or represented by a count-only result |
| REQ-003 | Mode behavior remains semantically compatible | Each mode's stable scenario IDs and semantic assertions match the phase-003 protected baseline through the phase-008 parity harness, with every difference classified and assigned to an owning phase |
| REQ-004 | Mixed-version state remains readable and deterministic | Every phase-012 fixture family replays old/new event and state combinations through upcasters, projections, archival readers, and resume; fingerprints and terminal projections are deterministic |
| REQ-005 | Crash recovery preserves effects and state | Injected failures at the declared effect and checkpoint boundaries recover through phase-007 receipts/effect-recovery, locks/fencing, and resume/salvage without lost, duplicated, or unauthorized effects |
| REQ-006 | Counterfactual adjudication remains blinded and reproducible | Phase-007 adjudication cases preserve the declared blindness, order/identity perturbation controls, decision evidence, and replayable adjudication result; counterfactual controls expose an expected decision delta when specified |
| REQ-007 | Degeneration and health controls detect unsafe continuation | Phase-011 cases cover repetition, cycle signals, mode collapse, quality decay, stopping-clock interaction, and recovery; health results are recorded without suppressing a declared failure |
| REQ-008 | Full-system parity holds against phase-003 | The phase-008 harness reports parity by scenario ID and semantics for protected behavior, including budget accounting, receipt/certificate presence, terminal state, replay fingerprints, sealed artifacts, and archival reads |
| REQ-009 | The gate is reviewed as a blocking SOL contract | The SOL report is bound to the candidate SHA and BASE SHA, includes commands and exit codes, lists all findings, and records an approval verdict with no unresolved blocking finding |
| REQ-010 | The complete packet passes recursive strict validation | `validate.sh --strict --recursive` reports `Errors: 0` and `Warnings: 0` for the 006 parent tree, including every phase child and generated metadata available at gate time |
| REQ-011 | Verification cannot hide tracked mutation | Gate execution uses disposable backends and sanitized fixtures, then proves the tracked worktree and index are unchanged except for explicitly pre-approved gate evidence |
| REQ-012 | Failures reopen the correct contract | Each failed assertion maps to an owning phase; phase 017 remains blocked until the owner is corrected, downstream gates are rerun on a new exact SHA, and the SOL report is renewed |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One immutable candidate SHA and the phase-003 BASE SHA are recorded, and every gate artifact is digest-bound to that pair.
- **SC-002**: The eight mode gates pass with behavior and shadow-parity evidence, sealed artifacts or certificates, replay checks, and rollback-switch checks.
- **SC-003**: All phase-012 mixed-version fixture families replay deterministically, including retained archival reads and resume paths.
- **SC-004**: Crash injection proves phase-007 effect recovery and receipt integrity without lost, duplicated, or unauthorized effects.
- **SC-005**: Counterfactual adjudication and phase-011 degeneration/health tests pass with their controls and evidence preserved.
- **SC-006**: Full parity against the phase-003 baseline is green by stable scenario ID and semantic assertion, including budget and receipt parity.
- **SC-007**: The blocking SOL verifier approves the exact candidate commit and `validate.sh --strict --recursive` reports Errors 0 and Warnings 0.
- **SC-008**: Verification leaves no unexplained tracked mutation, and any failure has a recorded reopen owner rather than a waiver.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is testing a moving checkout: another commit, regenerated fixture, or changed toolchain can make a
green result incomparable. The mitigation is a candidate SHA freeze, a phase-003 BASE digest, immutable gate manifest,
and per-result SHA binding. Other risks are false parity caused by count-only comparisons, nondeterministic replay,
crash injection that exercises only the happy path, external side effects that are not isolated, degeneration
thresholds that are not versioned, mode gates that omit shared write-set behavior, and recursive validation that sees
files different from those reviewed. The gate must use the semantic phase-008 harness, deterministic phase-012
fixtures, disposable backends, phase-007 effect recovery, and phase-011 health controls.

Dependencies are the phase-003 baseline manifest and replay/rollback corpus, the phase-008 `003-shadow-parity-harness`,
the phase-007 `001-receipts-and-effect-recovery` and `003-blinded-adjudication-service` contracts, the phase-011
`005-health-and-degeneration-harness`, the phase-012 `003-mixed-version-fixtures`, all eight mode-gate outputs from
phase 013, phase-014 cutover certificates, phase-015 zero-use and archival-reader evidence, the parent
`manifest/phase-tree.json`, and `execution-sequencing-strategy.md`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None block authoring. During execution, the verifier must resolve the exact candidate SHA after phase 015, the final
fault-injection point matrix, the concrete phase-011 health thresholds and expected counterfactual controls, and the
SOL verifier identity. These choices must be recorded in the exact-SHA gate manifest before any result is accepted; they
must not alter the phase-003 baseline, the phase-008 parity semantics, or the recursive strict-validation pass bar.
<!-- /ANCHOR:questions -->
