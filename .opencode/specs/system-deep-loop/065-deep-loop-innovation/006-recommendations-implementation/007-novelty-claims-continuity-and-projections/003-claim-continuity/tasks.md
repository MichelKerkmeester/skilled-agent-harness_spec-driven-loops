---
title: "Tasks: claim continuity (007 phase 003)"
description: "Tasks for stable claim identity minting, semantic matching, lifecycle folding, and resume continuity in phase 007 child 003."
trigger_phrases:
  - "claim continuity tasks"
  - "stable claim lifecycle tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/007-novelty-claims-continuity-and-projections/003-claim-continuity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/007-novelty-claims-continuity-and-projections/003-claim-continuity"
    last_updated_at: "2026-07-15T15:08:14Z"
    last_updated_by: "codex"
    recent_action: "Mapped claim-continuity work into setup, implementation, and verification tasks"
    next_safe_action: "Execute claim identity, lifecycle, and resume tasks against the dark ledger"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Claim Continuity

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

- [ ] T001 Pin the phase-003 ledger/replay and phase-004 continuity identity contracts; record sibling-001 candidate and sibling-002 relationship fixture versions
- [ ] T002 Freeze claim namespaces, match policy, lifecycle/status tables, canonical event order, resume-frontier schema, legacy baseline, and expected projection hashes
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Implement the typed claim registry and idempotent transition-authorized mint operation using the phase-004 `claim` identity
- [ ] T004 Implement exact namespaced alias and normalized-fingerprint resolution with collision detection
- [ ] T005 Implement sibling-001 semantic-community candidate lookup and versioned reuse/mint/unresolved match decisions with provenance
- [ ] T006 Implement observation, support, qualification, and duplicate-source attachment to one stable claim identity
- [ ] T007 Implement sibling-002 contradiction, refutation, adjudication, and supersession inputs as typed relationships between stable claim IDs
- [ ] T008 Implement the separate lifecycle and epistemic-status reducer with canonical ordering, compensating events, and projection hashing
- [ ] T009 Implement the resume frontier and fail-closed reconstruction for stale cursors, fingerprint mismatch, ambiguity, missing IDs, and wrong kinds
- [ ] T010 Wire additive dark projection, divergence telemetry, and legacy comparison without changing authority or convergence inputs
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify: Claim minting is stable and idempotent — retry, crash, and concurrent fixtures produce one ID or an explicit conflict
- [ ] T012 Verify: Matching avoids fragmentation and false merges — exact, paraphrase, distinct-neighbor, bridge, namespace, and ambiguity fixtures yield declared outcomes
- [ ] T013 Verify: Support and relationship events preserve identity — evidence accumulates on one claim while contradiction and supersession retain both histories
- [ ] T014 Verify: Lifecycle and status recompute deterministically — every transition, correction, adjudication, and terminal outcome matches the frozen precedence table
- [ ] T015 Verify: Replay parity holds — incremental and full replay produce identical claim records, relationships, cursors, and projection hashes
- [ ] T016 Verify: Resume continuity holds — every saved frontier restores the same IDs and unresolved work or fails closed before execution
- [ ] T017 Verify: The feature stays dark — legacy claim/finding outputs, convergence decisions, and authority remain unchanged while divergence is observable
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
