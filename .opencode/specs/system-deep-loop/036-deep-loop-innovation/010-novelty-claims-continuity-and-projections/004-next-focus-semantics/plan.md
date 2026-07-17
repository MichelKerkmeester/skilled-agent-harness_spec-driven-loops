---
title: "Implementation Plan: next-focus semantics (recommendations implementation phase 010 child 004)"
description: "Implementation plan for typed candidate derivation, deterministic scoring and tie-breaking, and replayable next-focus ledger decisions."
trigger_phrases:
  - "next-focus semantics implementation plan"
  - "deep-loop focus selection plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
    last_updated_at: "2026-07-15T15:30:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the candidate, scoring, selection, and replay architecture"
    next_safe_action: "Implement the typed selector behind the additive-dark runtime boundary"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Next-Focus Semantics

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime |
| **Change class** | Typed decision logic + append-only ledger event |
| **Execution** | Isolated worktree pinned to BASE; additive-dark and non-authoritative |

### Overview
Generalize the shipped divergent-pivot candidate and transaction semantics into a routine next-focus decision. The implementation derives a typed frontier from one immutable coverage/novelty/contradiction snapshot, validates and deduplicates it with pivot-compatible invariants, scores every candidate in integer basis points, applies a total deterministic tie-break, and records the full decision on the transition-authorized ledger. Detailed integration points are finalized against the pinned baseline, but the score, event, replay, and fail-closed behavior are fixed by this packet.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The candidate schema covers coverage gaps, open contradictions, and under-covered communities
- [ ] Signal adapters expose one immutable projection watermark and evidence set
- [ ] Integer score normalization and the total tie-break comparator are frozen and versioned
- [ ] The selected/no-eligible ledger event is accepted by the transition-authorization boundary
- [ ] Existing pivot candidate and divergent-pivot fixtures are captured as protected compatibility behavior
- [ ] Shadow comparison has no path that mutates authoritative current focus

### Definition of Done
- [ ] Every candidate is typed, evidence-linked, scored, and deterministically ordered
- [ ] Every decision is replayable from the ledger without prompt re-judgment
- [ ] Invalid, stale, empty, and conflicting inputs fail with typed outcomes
- [ ] Existing divergent-pivot behavior remains green and the new selector remains dark
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Candidate boundary**: introduce a `NextFocusCandidate` discriminated union whose common fields preserve the shipped `PivotCandidate` identity, evidence, boundary, fingerprint, and provenance invariants from `runtime/lib/deep-loop/pivot-candidates.ts`.
- **Snapshot adapters**: convert coverage, contradiction, and semantic-community projections into candidate-local basis-point inputs, all bound to one ledger watermark and candidate-set fingerprint. Mixed or stale watermarks fail before scoring.
- **Scorer**: use checked integer arithmetic for `coverageGapBps + contradictionUrgencyBps + (10000 - noveltyDecayBps)` and persist the scoring-policy version plus raw components; no hidden prompt weight or floating-point reduction participates.
- **Selector**: sort by total score, contradiction urgency, coverage gap, inverse novelty decay, then stable candidate ID. Candidate enumeration order is deliberately non-semantic.
- **Ledger recorder**: append a typed `next_focus_selected` or `next_focus_unavailable` event with deterministic decision identity, previous focus, source snapshot, full ranked frontier, comparator trace, and evidence references through the canonical authorization gateway.
- **Replay reducer**: restore focus from the recorded outcome, validate its candidate-set fingerprint and policy version, accept byte-equivalent duplicate appends idempotently, and reject conflicting semantic payloads.
- **Compatibility adapter**: reuse or extract the validator/deduplicator semantics in `runtime/lib/deep-loop/pivot-candidates.ts`; compare dark next-focus output with the Council-selected focus in `runtime/lib/deep-loop/divergent-pivot.ts` without changing Council quorum, veto, budgets, recursion, or artifact behavior.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin BASE; locate the canonical typed-ledger writer, transition gateway, replay fingerprint, projection watermark, and current-focus compatibility seams.
- Capture the existing pivot candidate/dedup and divergent-pivot transaction tests as protected behavior; confirm the phase-010 placement in `manifest/phase-tree.json`.

### Phase 2: Implementation
- Add the focus-candidate union, normalized signal snapshot, validation errors, selected/no-eligible outcome, and versioned scoring-policy types.
- Implement deterministic candidate identity/fingerprints and pivot-compatible validation, boundary checks, exact duplicate rejection, and material-similarity rejection.
- Implement snapshot adapters and checked basis-point scoring for coverage gap, contradiction urgency, and novelty decay.
- Implement the total comparator and order-independent selector, including typed empty-frontier handling.
- Add transition-authorized ledger append and replay reduction with full ranked-frontier evidence and conflicting-replay refusal.
- Wire the selector in additive-dark mode and emit parity observations without modifying authoritative focus.

### Phase 3: Verification
- Invalid candidate fields, signal ranges, evidence references, and mixed/stale watermarks fail closed
- Basis-point scores and candidate-set fingerprints are stable across repeated runs and supported platforms
- Every tie-break tier is covered, including input-order permutations and stable-ID final ordering
- Selected and no-eligible events replay from the ledger without accessing prompt state or current projections
- Same-identity/same-payload appends are idempotent; same-identity/different-payload appends fail
- Existing pivot candidate and divergent-pivot suites remain green with unchanged Council semantics
- Shadow comparison emits evidence but never changes authoritative current focus
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Schema table tests cover all three region kinds and every required common field; invalid fields return stable typed errors |
| REQ-002 | Snapshot fixtures accept one watermark and reject mixed, stale, or unsupported projection versions |
| REQ-003 | Golden vectors verify integer components, total scores, overflow guards, policy versions, and cross-platform stability |
| REQ-004 | Permutation/property fixtures exercise every tie-break tier and prove input-order invariance |
| REQ-005 | Ledger round-trips selected and no-eligible outcomes with ranked frontier, evidence, fingerprint, and previous focus intact |
| REQ-006 | Existing `pivot-candidates` and `divergent-pivot` suites pass unchanged; compatibility fixtures compare rejection and replay semantics |
| REQ-007 | Malformed, stale, non-finite, duplicate-conflict, and fingerprint-drift fixtures produce typed failures without guessed focus |
| REQ-008 | Shadow-mode integration asserts that the authoritative focus writer is untouched and parity observations are append-only |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child has `depends_on: []` as an independently authorable planning contract. Runtime execution consumes the outer
program's typed ledger, transition authorization, replay fingerprint, compatibility bridge, stable logical identities,
and durable fan-in named by `manifest/phase-tree.json`. Adjacent 003 and 005 folders are navigation/ordering references,
not hard planning dependencies; their eventual event and projection interfaces are integrated through typed adapters.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation lands additive and dark on an isolated worktree. Disable the next-focus shadow hook and `git revert`
the phase's path-scoped commits to restore the existing implicit-focus and divergent-pivot paths; recorded dark events
remain readable under their schema version but never acquire authority. No historical pivot event or authoritative focus
is rewritten during rollback.
<!-- /ANCHOR:rollback -->
