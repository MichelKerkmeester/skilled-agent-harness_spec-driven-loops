---
title: "Tasks: semantic communities"
description: "Tasks for deterministic semantic communities and concept-level novelty in phase 010 child 001."
trigger_phrases:
  - "semantic communities tasks"
  - "concept-level novelty tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
    last_updated_at: "2026-07-15T17:00:00Z"
    last_updated_by: "codex"
    recent_action: "Decomposed semantic community formation, novelty wiring, and replay verification"
    next_safe_action: "Create the labeled semantic-equivalence and bridge-claim fixture corpus"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Semantic Communities

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

- [ ] T001 Confirm parent-program ledger, stable-identity, compatibility, and durable fan-in prerequisites are available; record that this child has no sibling dependency
- [ ] T002 Build and freeze labeled fixtures for paraphrases, notation variants, adjacent concepts, contradictions, repeated evidence, bridge claims, and namespace isolation
- [ ] T003 Pin existing `computeGraphNoveltyDelta` and `computeWindowedGraphNoveltyDelta` outputs for the fixture graph as the backward-compatibility baseline
- [ ] T004 Specify the model/config version, normalization fingerprint, metric, candidate bounds, edge-admission threshold, cohesion rule, deterministic tie-breaks, and quality budgets
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add immutable claim-embedding records and canonical semantic-equivalence edges with complete version and provenance fields
- [ ] T006 Implement namespace-scoped bounded candidate retrieval, exact scoring, edge admission, and explicit unavailable/ambiguous outcomes
- [ ] T007 Implement deterministic full community reduction with stable IDs, representatives, membership-version hashes, and merge/split lineage
- [ ] T008 Implement the bridge/cohesion guard so one ambiguous edge cannot chain distinct established concepts
- [ ] T009 Implement transactional affected-component updates for arriving claims and semantic edges, plus periodic full-rebuild comparison
- [ ] T010 Add shadow novelty classifications for new communities, existing-community members, ambiguity, and new evidence
- [ ] T011 Add projection-version, assignment-path, candidate-count, merge-decision, latency, and rebuild-drift telemetry with disable/rebuild controls
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify semantic-equivalence precision/recall and false-merge/fragmentation bounds on the frozen fixture corpus
- [ ] T013 Verify shuffled arrival orders and repeated ledger replays produce identical edges, communities, membership versions, lineage, and novelty classifications
- [ ] T014 Verify every incremental state equals a full deterministic rebuild after join, ambiguous, bridge, merge, split, and model-version cases
- [ ] T015 Verify paraphrases do not increment concept novelty while new evidence for an existing concept remains independently visible
- [ ] T016 Verify namespace isolation, embedding failures, bounded candidate work, atomic projection commits, version transitions, and historical-version readability
- [ ] T017 Verify existing coverage-graph tests and pinned novelty baselines remain green with the feature disabled and shadow parity is recorded when enabled
- [ ] T018 Run strict packet validation and attach the exact implementation test, replay, and metric evidence to the phase completion record
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
