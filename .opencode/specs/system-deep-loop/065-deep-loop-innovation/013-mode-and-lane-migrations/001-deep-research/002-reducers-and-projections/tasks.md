---
title: "Tasks: Deep Research - Reducers & Projections"
description: "Tasks for planning and implementing deterministic deep-research reducers and projections over the typed event ledger."
trigger_phrases:
  - "deep research reducers tasks"
  - "deep research projection tasks"
  - "deep research replay fold tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
    last_updated_at: "2026-07-15T17:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined setup, fold, projection, and replay-verification work items"
    next_safe_action: "Build the event-to-field ownership matrix from the frozen schema"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Research - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the frozen typed-ledger event contract, phase-012 mode interface, and phase-013 write-set boundary before implementation
- [ ] T002 Build the deep-research event inventory for plan, branch, evidence, claim, community, convergence, artifact, receipt, and status families
- [ ] T003 Define the field-level reducer ownership matrix, canonical ordering tuple, reducer/version fingerprint inputs, and invalid-event policy
- [ ] T004 Capture legacy reducer and heartbeat output fixtures from `deep-research/scripts/reduce-state.cjs` and `deep_research_auto.yaml` for shadow comparison
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Implement the pure event router and canonical fold with no I/O, clock, randomness, model, network, seal, or ledger-append dependency
- [ ] T006 Implement the iteration projection for plan revisions, branch lifecycle, query recipes, admission outcomes, raw observations, claims, and next-focus obligations
- [ ] T007 Implement the convergence projection for observed/finalized frontiers, trusted evidence yield, contradiction/falsification blockers, health inputs, and incomplete outcomes
- [ ] T008 [P] Implement the reversible artifact index for artifact identity, digest, schema, provenance, receipts, validity, availability, and supersession
- [ ] T009 [P] Implement per-mode status derivation, impossible-transition rejection, terminal ambiguity, quarantine, and blocked/rebuild-required states
- [ ] T010 Implement incremental cursor/checkpoint folding and projection-fingerprint compatibility checks without changing canonical event history
- [ ] T011 Implement the read-only legacy-shaped compatibility projection with explicit lossy-field markers and shadow-only posture
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify deterministic replay: identical typed event sequences produce byte-equivalent projections, indexes, status, and fingerprints
- [ ] T013 Verify arrival-order invariance with independent-event permutations, duplicate events, late completions, and finalized-frontier advancement
- [ ] T014 Verify raw evidence and judgment lineage: supersession, retraction, contradiction, invalid admission, and unknown outcomes remain inspectable
- [ ] T015 Verify artifact behavior: digest mismatch, missing receipt, invalid reference, superseded artifact, and unavailable artifact never create success placeholders
- [ ] T016 Verify incremental/full parity across checkpoint restart, cursor gaps, log rotation, truncation, schema drift, and projection-version changes
- [ ] T017 Verify status safety: impossible transitions, missing terminal evidence, quarantine, incomplete exhaustion, and unknown event types fail closed
- [ ] T018 Verify the reducer boundary has no side effects and the compatibility projection cannot authorize a transition or authority cutover
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/replay as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Typed event input**: Planned predecessor `001-typed-ledger-schema`
- **Artifact consumer**: Planned successor `003-sealed-artifacts`
- **Research inputs**: See `002-deep-loop-effectiveness-and-fanout/research/findings-registry*.json`
<!-- /ANCHOR:cross-refs -->
