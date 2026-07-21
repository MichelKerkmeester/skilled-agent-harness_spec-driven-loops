---
title: "Tasks: semantic communities"
description: "Completed tasks for deterministic semantic communities and shadow concept-level novelty."
trigger_phrases:
  - "semantic communities tasks"
  - "concept-level novelty tasks"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
    last_updated_at: "2026-07-21T08:33:34Z"
    last_updated_by: "codex"
    recent_action: "Verified canonical edge and bridge-order replay parity"
    next_safe_action: "Keep semantic novelty shadow-only until an authority change is separately approved"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/semantic-communities/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/semantic-communities.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Semantic Communities

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Confirm ledger, stable identity, and replay prerequisites [evidence: `semantic-community-events.ts` imports the frozen substrate APIs]
- [x] T002 Freeze labeled semantic fixtures [evidence: `semantic-communities.vitest.ts` contains 16 passing adversarial tests]
- [x] T003 Pin both legacy novelty outputs [evidence: `semantic-communities.vitest.ts` direct graph and windowed parity assertions]
- [x] T004 Pin model, metric, thresholds, bounds, and tie-breaks [evidence: `semantic-communities.vitest.ts` fixture config]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add immutable claims and canonical provenance-complete edges [evidence: `semantic-communities.vitest.ts` reversed-arrival edge bytes]
- [x] T006 Implement isolated bounded retrieval and exact admission [evidence: `semantic-communities.vitest.ts` isolation and bound fixtures]
- [x] T007 Implement stable communities and lineage [evidence: `semantic-communities.vitest.ts` replay and lineage fixtures]
- [x] T008 Guard bridge cohesion [evidence: `semantic-communities.vitest.ts` bridge-first/middle/last ambiguity assertions]
- [x] T009 Implement affected-component updates and rebuild comparison [evidence: incremental results equal the independent whole-graph rebuild across six permutations]
- [x] T010 Add all shadow novelty classifications [evidence: `semantic-communities.vitest.ts` novelty assertions pass 16/16]
- [x] T011 Add deterministic telemetry and rebuild controls [evidence: candidate/rescan/affected counters, history transition, and verifier runtime are recorded]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify semantic quality bounds [evidence: `semantic-communities.vitest.ts` precision 1.0 and recall 1.0]
- [x] T013 Verify arrival permutations and repeated replay [evidence: `semantic-communities.vitest.ts` six-permutation canonical-byte assertions]
- [x] T014 Verify incremental/full parity [evidence: independent rebuild plus a hand-authored expected three-community partition]
- [x] T015 Verify both novelty directions [evidence: `semantic-communities.vitest.ts` concept increment 0 and evidence increment 1]
- [x] T016 Verify isolation, failures, bounds, atomicity, and history [evidence: `semantic-communities.vitest.ts` duplicate claim/rank, version collision, and drift tests]
- [x] T017 Verify legacy compatibility [evidence: 141/141 frozen substrate and coverage tests pass]
- [x] T018 Run completion gates [evidence: leaf Vitest 16/16 and pinned TypeScript 5.9 `tsc --noEmit` exit 0; strict validation recorded in summary]
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
