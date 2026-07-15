---
title: "Feature Specification: cycle detection (008 phase 002)"
description: "Plan deterministic detection of repeated loop states, claim frontiers, and next-foci over ledger history, with progress-gated thresholds that surface degeneration as a health signal and stopping-clock input."
trigger_phrases:
  - "deep-loop cycle detection"
  - "repeated claim and focus signatures"
  - "convergence degeneration signal"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
    last_updated_at: "2026-07-15T15:19:57Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned cycle-detection contract for repeated states, claims, and foci"
    next_safe_action: "Implement fingerprint history, progress gating, health signals, and stopping-clock input"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Cycle Detection

> Phase adjacency under the 008 parent (grouping order, not a runtime dependency): predecessor `001-path-covering-termination`; successor `003-stopping-clocks`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Second child of phase 008; the program manifest assigns repeated-state, claim, and focus detection to the convergence, termination, and health layer |
| **Child depends_on** | `[]` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped council convergence path evaluates one session snapshot against fixed agreement, dissent, evidence-depth,
critical-disagreement, and confidence thresholds. It emits explicit blockers and a decision trace, but it has no
longitudinal memory of prior states and therefore cannot distinguish productive revisitation from a loop that is cycling
(`.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs`). A repeated focus can be useful when new independent
evidence changes a durable claim; the same focus, claim frontier, or short state sequence without any coverage, evidence, or
claim-lifecycle progress is a degeneration signal that a point-in-time score cannot observe.

Phase 007 supplies the identities needed to make that distinction. Claim continuity keeps paraphrases, support,
contradictions, and supersession attached to stable claim IDs instead of iteration-local wording
(`.opencode/specs/system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity/spec.md`).
Next-focus semantics records the selected region, ranked frontier, policy version, projection watermark, and candidate-set
fingerprint rather than relying on prompt text
(`.opencode/specs/system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics/spec.md`).
The parent program and phase manifest place cycle detection after durable fan-in and phase-007 projections, keep it additive
and dark until staged cutover, and require phase 008 to hand shared mode contracts a generic termination-and-health boundary
(`.opencode/specs/system-deep-loop/065-deep-loop-innovation/spec.md` and
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`).

This phase plans a deterministic ledger-window detector. At each authorized iteration boundary, a versioned projector derives
separate focus, claim-frontier, and composite-state signatures from one committed watermark, appends their fingerprints to a
bounded history, and searches for repeated signatures and repeated suffix sequences. A cycle is confirmed only when the
pattern repeats at the configured sensitivity and the enclosed interval contains no qualifying progress. The detector records
the evidence and emits a typed health signal; it does not silently stop the loop or mutate any claim, focus, or historical event.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned `CycleObservation` at each completed iteration boundary with run lineage, ledger cursor, projection watermark, focus signature, claim-frontier signature, composite-state signature, and progress vector.
- Focus signatures derived from the recorded next-focus region/candidate identity, decision-policy version, and candidate-set fingerprint; prompt wording and display labels are excluded.
- Claim-frontier signatures derived from sorted stable claim IDs plus lifecycle/epistemic state, unresolved contradiction or match work, and claim-fold policy version; array order and current wording are excluded.
- Composite-state signatures that bind the focus and claim fingerprints to path/community coverage, unresolved blockers, and relevant reducer versions at one immutable watermark.
- A bounded fingerprint-history projection over authorized ledger events, rebuilt deterministically on replay and incrementally updated only after a committed iteration boundary.
- Detection of fixed-point cycles and short repeated sequences by comparing periods `1..4` over the latest `12` observations, requiring three complete traversals of the same period before confirmation.
- A progress gate that breaks a candidate cycle when the interval adds independent evidence, mints or materially transitions a durable claim, resolves a contradiction/blocker, or increases path/community coverage by the versioned minimum.
- A secondary repetition signal when the same focus or claim-frontier fingerprint appears at least three times within eight completed observations without qualifying progress, even when the full composite state differs.
- Typed `cycle_suspected`, `cycle_confirmed`, and `cycle_cleared` health events carrying detector-policy version, signature kind, period, occurrence count, start/end cursors, progress assessment, source fingerprints, and trace evidence.
- A non-authoritative handoff from confirmed cycle severity to sibling `003-stopping-clocks`; clock policy decides whether the signal contributes to stop, warning, or continued-observation behavior.
- Shadow fixtures covering productive revisitation, fixed points, two-to-four-state oscillation, paraphrased claims, repeated focus decisions, late progress, history gaps, reducer-version changes, resume, and replay.

### Out of Scope
- Defining path-covering termination, clock arbitration, value-of-computation allocation, or the generic cross-mode health harness owned by adjacent phase-008 children.
- Replacing claim identity, claim matching, claim status folds, next-focus candidate selection, contradiction semantics, semantic-community clustering, or transactional projection ownership from phase 007.
- Changing the shipped council thresholds or treating `convergence.cjs` snapshot results as sufficient cycle evidence.
- Making a cycle signal an unconditional stop, moving authority before shadow parity and cutover, or rewriting/deleting the ledger observations that formed the pattern.
- Mode-specific calibration, historical packet migration, unbounded history retention, fuzzy text-only cycle matching, or model judgment in the replay path.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define canonical focus, claim-frontier, and composite-state signatures from one committed ledger/projection boundary | Equivalent semantic state produces byte-stable fingerprints under input reordering; mixed watermarks, missing typed IDs, or unknown reducer versions fail closed |
| REQ-002 | Preserve a bounded, replayable fingerprint history over completed iterations | Incremental application and full replay produce the same ordered observations, eviction boundary, and history hash for the latest 12 entries |
| REQ-003 | Detect fixed points and short repeated sequences deterministically | Fixtures for periods 1, 2, 3, and 4 confirm only after three complete traversals and return the same start/end cursors and evidence trace on replay |
| REQ-004 | Detect repeated focus or claim-frontier degeneration even when the composite fingerprint changes | Three matching focus or claim fingerprints inside eight completed observations produce a typed suspicion only when no qualifying progress occurred between the first and last match |
| REQ-005 | Separate repetition from productive revisitation through a versioned progress gate | New independent evidence, a material claim transition, contradiction/blocker resolution, or sufficient coverage gain breaks the candidate cycle and records the exact progress basis |
| REQ-006 | Make sensitivity explicit, bounded, and versioned | Detector policy records window 12, max period 4, minimum traversals 3, repetition window 8, occurrence threshold 3, and the progress-floor policy; policy changes mint a new version |
| REQ-007 | Emit auditable cycle health events through the transition-authorized ledger | Every suspected, confirmed, and cleared event cites source cursors/fingerprints, signature kind, period, occurrences, policy version, progress verdict, and idempotency identity |
| REQ-008 | Feed cycle health into stopping clocks without claiming stop authority | Sibling-clock input is typed and replayable; a cycle event alone cannot produce `STOP_ALLOWED` outside the clock arbitration contract |
| REQ-009 | Fail closed on insufficient or inconsistent history | Gaps, stale watermarks, conflicting fingerprints, non-monotonic cursors, unsupported policy versions, and incomplete periods return `not_evaluable` or a typed error, never `no_cycle` |
| REQ-010 | Keep the detector additive, dark, and cross-mode neutral | Shadow results are observable beside legacy convergence, no current stop decision changes in this phase, and signatures use shared typed identities rather than mode-local text keys |
<!-- /ANCHOR:requirements -->

### Cycle signature, sensitivity, and action contract

The observation projector reads exactly one authorized ledger prefix. It canonicalizes the selected focus from the recorded
phase-007 decision, sorts typed claim references before folding their lifecycle and epistemic states, and binds those
fingerprints to coverage and blocker summaries produced at the same watermark. Canonical serialization includes schema,
reducer, and detector-policy versions. A replay that encounters an unknown version or cannot reproduce a stored fingerprint
stops evaluation rather than comparing unlike states.

The initial sensitivity policy retains 12 completed observations and tests candidate periods from one through four. A
confirmed sequence cycle requires three identical consecutive traversals of the period; a fixed point is period one. In
parallel, three occurrences of the same focus or claim-frontier signature inside the latest eight observations create a
suspected degeneration signal. Neither path confirms degeneration if the enclosed progress vector contains accepted
independent evidence, a durable claim mint or material lifecycle/status transition, a resolved contradiction or blocker, or
coverage gain meeting the versioned integer-basis-point floor. Execution must calibrate that floor in shadow fixtures, but it
cannot weaken the typed progress categories or make absence of data count as absence of progress.

Detection appends an idempotent health event keyed by run lineage, ending cursor, signature kind, period, and policy version.
A confirmed event raises the cycle contribution consumed by the stopping-clock projection; a later observation with qualifying
progress appends `cycle_cleared`. The event is evidence, not authority: sibling 003 owns clock arbitration, and the generic
health harness owns cross-mode presentation and aggregation. Historical observations and claims remain append-only.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fixed-point and period-two-to-four cycles are detected from canonical ledger fingerprints with identical results under incremental execution, resume, and full replay.
- **SC-002**: Productive revisitation does not confirm a cycle when typed evidence, claim, contradiction, blocker, or coverage progress occurs.
- **SC-003**: Every suspicion, confirmation, and clearing decision is traceable to policy version, watermarks, cursors, fingerprints, progress evidence, and the exact repeated period.
- **SC-004**: Confirmed cycle health contributes to the stopping-clock input while remaining dark, non-authoritative, and neutral across deep-loop modes.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has no hard sibling planning dependency (`depends_on: []`); predecessor and successor names provide navigation
and contract ordering only. Runtime implementation consumes the phase-003 authorized ledger, phase-004 continuity and health
services, phase-006 durable iteration/fan-in boundaries, and phase-007 claim-continuity plus next-focus projections. The
program manifest requires those shared inputs before convergence activation, even though this planning packet remains an
independent sibling contract.

Principal risks are false positives from intentional focus revisitation, false negatives from unstable text or ordering,
unbounded history growth, cycles hidden by inconsequential state churn, progress misclassified across modes, replay drift after
policy changes, and accidental promotion of a shadow signal into stop authority. Mitigations are stable typed identities,
canonical versioned serialization, a fixed bounded window, explicit material-progress categories, stored decision traces,
fail-closed version/watermark checks, shadow calibration, and a typed clock boundary that keeps authority in sibling 003.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must freeze the integer coverage-progress floor, independent-evidence qualification,
mode adapters for material claim progress, suspected/confirmed severity mapping, and clock contribution weight against pinned
shadow fixtures. Those calibrations may mint a new detector-policy version; they cannot remove the three-traversal rule,
bounded history, fail-closed replay checks, or separation between health evidence and stop authority.
<!-- /ANCHOR:questions -->
