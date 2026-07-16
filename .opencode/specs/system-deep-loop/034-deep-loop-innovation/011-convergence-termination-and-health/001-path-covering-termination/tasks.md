---
title: "Tasks: path-covering termination"
description: "Tasks for mode coverage profiles, replay-stable path reduction, blocker-aware termination, partial-coverage reporting, and shadow verification."
trigger_phrases:
  - "path-covering termination tasks"
  - "coverage certificate tasks"
  - "deep-loop phase 011 child 001 tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
    last_updated_at: "2026-07-15T15:19:24Z"
    last_updated_by: "codex"
    recent_action: "Defined implementation and verification tasks for path-covering termination"
    next_safe_action: "Implement the coverage universe, reducer, predicate, and partial report"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Path-Covering Termination

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

- [ ] T001 Freeze the supported mode inventory, owner, and versioned `ModeCoverageProfile` schema
- [ ] T002 Capture legacy coverage-snapshot and council-decision fixtures for shadow parity
- [ ] T003 Freeze complete, partial, blocked, excluded, late-expanding, paraphrase-heavy, contradiction-heavy, empty, replay, and limit-exhausted fixtures
- [ ] T004 Define coverage-universe, path-state, projection-freshness, evidence, exclusion, certificate, and outcome schemas
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement fail-closed profile validation and deterministic path-ID derivation for every supported mode
- [ ] T006 Implement frozen coverage-universe compilation with profile/input/projection/ledger fingerprints and successor-version semantics
- [ ] T007 Implement the incremental path-state reducer over evidence, semantic-community, contradiction, and exclusion events
- [ ] T008 Implement full-replay rebuilding and parity checks against incremental path states
- [ ] T009 Implement weighted and unweighted coverage aggregation while preserving mandatory-path vetoes
- [ ] T010 Implement the pure `STOP_ALLOWED`/`STOP_BLOCKED`/`CONTINUE`/`INCOMPLETE_LIMIT` predicate and trace
- [ ] T011 Implement complete and partial coverage certificates with evidence, gaps, blockers, contradictions, versions, ranking, and certificate hash
- [ ] T012 Implement the additive shadow bridge to existing council and coverage observability without changing authority
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify: Every supported mode has a complete versioned profile; unknown, incomplete, or invalid profiles fail closed
- [ ] T014 Verify: Identical inputs and full replay reproduce path IDs, denominators, path states, decisions, and certificate hashes
- [ ] T015 Verify: Committed semantic communities prevent paraphrase inflation while distinct concepts and new evidence remain visible
- [ ] T016 Verify: Any mandatory gap, stale projection, ambiguous major community, critical contradiction, or STOP blocker prevents `STOP_ALLOWED`
- [ ] T017 Verify: Iteration, time, and budget exhaustion below complete mandatory coverage returns `INCOMPLETE_LIMIT` with exact gaps
- [ ] T018 Verify: Partial reports expose the denominator, ratios, open/blocked paths, required evidence, contradictions, versions, and ranked next paths
- [ ] T019 Verify: Late major-region discovery or phase-010 projection drift supersedes stale stop candidates and certificates
- [ ] T020 Verify: Shadow comparisons preserve legacy authority and classify every old/new decision disagreement
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
