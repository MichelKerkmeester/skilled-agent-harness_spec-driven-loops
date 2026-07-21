---
title: "Tasks: claim continuity"
description: "Tasks for stable claim identity minting, semantic matching, lifecycle folding, and resume continuity in phase 010 child 003."
trigger_phrases:
  - "claim continuity tasks"
  - "stable claim lifecycle tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity"
    last_updated_at: "2026-07-21T09:10:00Z"
    last_updated_by: "codex"
    recent_action: "Completed claim identity, lifecycle, replay, resume, and dark comparison tasks"
    next_safe_action: "Preserve the dark authority boundary until a separately scoped cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/claim-continuity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/claim-continuity.vitest.ts"
    completion_pct: 100
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

- [x] T001 Pin the phase-006 ledger/replay and phase-007 continuity identity contracts; record sibling-001 candidate and sibling-002 relationship fixture versions [evidence: `implementation-summary.md` requirement matrix]
- [x] T002 Freeze claim namespaces, match policy, lifecycle/status tables, canonical event order, resume-frontier schema, legacy baseline, and expected projection hashes [evidence: `implementation-summary.md` frozen contracts]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement the typed claim registry and idempotent transition-authorized mint operation using the phase-007 `claim` identity
- [x] T004 Implement exact namespaced alias and normalized-fingerprint resolution with collision detection [evidence: `implementation-summary.md` REQ-003/004 evidence]
- [x] T005 Implement sibling-001 semantic-community candidate lookup and versioned reuse/mint/unresolved match decisions with provenance [evidence: `implementation-summary.md` REQ-003 evidence]
- [x] T006 Implement observation, support, qualification, and duplicate-source attachment to one stable claim identity [evidence: `implementation-summary.md` REQ-007 evidence]
- [x] T007 Implement sibling-002 contradiction, refutation, adjudication, and supersession inputs as typed relationships between stable claim IDs [evidence: `implementation-summary.md` REQ-008 evidence]
- [x] T008 Implement the separate lifecycle and epistemic-status reducer with canonical ordering, compensating events, and projection hashing [evidence: `implementation-summary.md` REQ-005/006 evidence]
- [x] T009 Implement the resume frontier and fail-closed reconstruction for stale cursors, fingerprint mismatch, ambiguity, missing IDs, and wrong kinds [evidence: `implementation-summary.md` REQ-009 evidence]
- [x] T010 Wire additive dark projection, divergence telemetry, and legacy comparison without changing authority or convergence inputs [evidence: `implementation-summary.md` REQ-011 evidence]
- [x] T018 Fold every prepared claim-service event through the domain reducer before authorization and append [evidence: `implementation-summary.md` pre-append domain gate decision]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify: Claim minting is stable and idempotent — retry, crash, and concurrent fixtures produce one ID or an explicit conflict [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] T012 Verify: Matching avoids fragmentation and false merges — exact, paraphrase, distinct-neighbor, bridge, namespace, and ambiguity fixtures yield declared outcomes [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] T013 Verify: Support and relationship events preserve identity — evidence accumulates on one claim while contradiction and supersession retain both histories [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] T014 Verify: Lifecycle and status recompute deterministically — every transition, correction, adjudication, and terminal outcome matches the frozen precedence table [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] T015 Verify: Replay parity holds — incremental and full replay produce identical claim records, relationships, cursors, and projection hashes [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] T016 Verify: Resume continuity holds — every saved frontier restores the same IDs and unresolved work or fails closed before execution [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] T017 Verify: The feature stays dark — legacy claim/finding outputs, convergence decisions, and authority remain unchanged while divergence is observable [evidence: `implementation-summary.md` final Vitest 18/18]
- [x] T019 Verify: A second correction to one target fails before append, leaves the head unchanged, preserves `readState()`, and permits an unrelated mint [evidence: `implementation-summary.md` REQ-006 evidence]
- [x] T020 Verify: A plain same-namespace exact fingerprint reuses the registered claim with one identity and no semantic candidates [evidence: `implementation-summary.md` REQ-003 evidence]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
