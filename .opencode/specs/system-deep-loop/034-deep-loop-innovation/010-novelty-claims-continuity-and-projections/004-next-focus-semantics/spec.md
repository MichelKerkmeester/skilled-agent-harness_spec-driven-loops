---
title: "Feature Specification: next-focus semantics (recommendations implementation phase 010 child 004)"
description: "Plan typed, deterministic next-focus semantics that rank coverage gaps, open contradictions, and under-covered semantic communities from ledger-derived novelty signals, then record the selected region and complete decision basis for replay."
trigger_phrases:
  - "next-focus semantics"
  - "where to look next"
  - "deep-loop focus candidate selection"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
    last_updated_at: "2026-07-15T15:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the typed next-focus planning contract"
    next_safe_action: "Implement candidate derivation, scoring, selection, and ledger replay"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Next-Focus Semantics

> Phase adjacency under the 007 parent (grouping order, not a runtime dependency): predecessor `003-claim-continuity`; successor `005-transactional-projections-and-gauges`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 007 of the 007 novelty, claims, continuity, and projections intelligence layer |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The loop currently carries a focus largely as prompt/runtime context. The shipped divergent-pivot path makes a new direction durable only when anti-convergence activates near a legal stop: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/pivot-candidates.ts` validates a generic `PivotCandidate`, rejects duplicate IDs, exact fingerprints, and materially similar title/focus pairs, while `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` asks three fixed Council seats to endorse the surviving frontier, requires two-of-three agreement with no high-severity blocker, and records `pivot_selected` plus `pivot_completed` events that restore `currentFocus`. That is a strong transaction and replay precedent, but it does not routinely derive or score the next region from coverage, novelty, and contradiction state.

This phase plans the generalized decision contract: each iteration can derive typed focus candidates for a coverage gap, an open contradiction, or an under-covered semantic community; normalize the candidate's coverage gap, novelty decay, and contradiction urgency into deterministic basis-point inputs; choose one candidate with a fixed score and tie-break order; and append the selected focus, ranked frontier, scoring-policy version, source projection watermark, and candidate-set fingerprint to the typed ledger. Replay consumes the recorded decision rather than repeating prompt judgment. The outer ordering and additive-dark constraints come from `.opencode/specs/system-deep-loop/034-deep-loop-innovation/manifest/phase-tree.json`: phase 010 follows the compatibility bridge and durable fan-in, remains non-authoritative until staged cutover, and supplies phase 011 with stable semantic signals.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `NextFocusCandidate` contract with stable candidate and region identity; region kind (`coverage_gap`, `open_contradiction`, or `under_covered_community`); a concrete focus directive; ledger evidence references; a mode-owned boundary verdict; projection watermark; candidate fingerprint; and normalized signal inputs.
- Candidate derivation from a single immutable signal snapshot: uncovered/weakly covered regions, unresolved contradiction records, semantic-community coverage, and per-region novelty-yield history.
- Deterministic scoring in integer basis points: `coverageGapBps + contradictionUrgencyBps + (10000 - noveltyDecayBps)`, with every input constrained to `0..10000` and the scoring-policy version stored with the decision.
- Deterministic selection: highest total score, then higher contradiction urgency, then higher coverage gap, then lower novelty decay, then ascending stable candidate ID.
- A typed selected/no-eligible outcome recorded through the transition-authorized append-only ledger, including the complete ranked frontier and enough source identity to replay or detect drift without re-running prompt judgment.
- Compatibility with the shipped pivot candidate invariants: non-empty typed fields, evidence and provenance, boundary validation, stable fingerprints, exact/material-similarity rejection, deterministic identity, idempotent append, and conflicting-replay refusal.

### Out of Scope
- Replacing the divergent Council transaction or changing its two-of-three endorsement, blocker veto, recursion guard, budgets, or artifact layout.
- Defining semantic-community clustering, contradiction/supersession event semantics, or claim-continuity identity; adjacent children own those independent planning contracts.
- Implementing the transactional projection engine or convergence/termination policy; phase 008 projects the recorded events and outer phase 011 consumes their signals.
- Calibrating mode-specific authority or enabling next-focus decisions as authoritative before shadow parity and staged cutover.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define a complete typed focus-candidate model for coverage gaps, open contradictions, and under-covered communities | Invalid identity, region kind, directive, evidence, boundary verdict, fingerprint, watermark, or signal values fail closed with field-specific errors |
| REQ-002 | Derive candidate inputs from one immutable ledger/projection snapshot | Every candidate cites the same projection watermark and evidence IDs; mixed-watermark input is rejected |
| REQ-003 | Score candidates deterministically from coverage gap, contradiction urgency, and novelty decay | Basis-point normalization and the versioned formula produce byte-stable ranked scores across repeated runs and supported platforms |
| REQ-004 | Select one outcome with an explicit, total tie-break rule | Fixtures cover each tie-break tier and produce the same selected candidate regardless of input enumeration order |
| REQ-005 | Record the complete next-focus decision on the typed ledger for replay | The event contains decision identity, policy version, source watermark/fingerprint, ranked frontier, selected candidate or typed no-eligible reason, previous focus, and evidence references |
| REQ-006 | Generalize the shipped divergent-pivot semantics without weakening them | Existing pivot candidate validation/dedup and divergent-pivot replay fixtures remain green; equivalent candidate sets preserve rejection semantics |
| REQ-007 | Fail closed on stale, incomplete, non-finite, or conflicting decisions | No focus is guessed; malformed signals, stale watermarks, duplicate identities with different payloads, and replay fingerprint drift produce typed failures |
| REQ-008 | Keep the new selector additive, dark, and non-authoritative | Shadow output can be compared with legacy/pivot focus behavior, but no current-focus authority moves in this phase |
<!-- /ANCHOR:requirements -->

### Deterministic decision and replay contract

The scorer operates on integers, never runtime floating-point accumulation. Each input projector supplies a normalized basis-point value plus the ledger event IDs that justify it. `coverageGapBps` is higher for less-covered regions; `contradictionUrgencyBps` is higher for unresolved, material contradictions; `noveltyDecayBps` is higher for directions whose recent novelty yield is exhausted, so the scorer uses its complement. A candidate missing an applicable signal uses a typed zero only when the candidate-kind adapter declares that signal non-applicable; absent required evidence is an error.

The selector first removes invalid, out-of-boundary, exact-duplicate, and materially similar candidates using the shipped pivot semantics. It sorts the accepted frontier by total score descending, contradiction urgency descending, coverage gap descending, novelty decay ascending, then stable candidate ID ascending. The ledger event stores that ordered frontier, the winner, and the comparator trace for the winning boundary. An empty accepted frontier records a typed `next_focus_unavailable` outcome; it never fabricates a prompt direction.

Replay identifies a decision from immutable run lineage, source iteration, projection watermark, and scoring-policy version. Reusing the identity with the same semantic payload is idempotent; reusing it with a different frontier, score, or selection fails as a conflicting replay. Reducers restore the recorded focus from the event and verify the stored candidate-set fingerprint, rather than re-deriving rankings from later projections.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every eligible next region is represented by a validated, evidence-linked typed candidate.
- **SC-002**: Candidate scoring and tie-breaking are deterministic under input reordering and replay.
- **SC-003**: The ledger alone explains and restores each selected focus or no-eligible outcome.
- **SC-004**: Existing divergent-pivot behavior remains green while the generalized selector stays dark.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 006 parent spec: the new path must remain additive/dark, every typed write must
pass transition authorization, replay fingerprints must remain versioned, and authority cannot move before shadow
parity and rollback evidence. Phase-specific risks are enumerated in this phase's plan.md. This child has no hard sibling
planning dependency; its runtime interfaces consume the parent program's ledger, stable identities, and durable fan-in.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The equal-component basis-point policy is the deterministic initial contract; shadow evidence may justify
a later versioned policy, but changing weights or normalization must mint a new policy version and must never rewrite
recorded decisions. Adjacent child names in the H1 blockquote express navigation order only, not runtime dependency.
<!-- /ANCHOR:questions -->
