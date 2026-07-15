---
title: "Tasks: Governance and Rollout Layer"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "governance rollout layer tasks"
  - "seventeen stage rollout sequence tasks"
  - "four beat migration runbook tasks"
  - "inv-1 inv-2 safety model tasks"
  - "eighteen item no-go list tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/003-governance-rollout"
    last_updated_at: "2026-07-04T17:12:03.094Z"
    last_updated_by: "benchmark-test-author"
    recent_action: "Mirrored benchmark and flags-off test as T013 to T016"
    next_safe_action: "Start T004 author rollout-sequence.md"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-028-gov-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Governance and Rollout Layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the five inviolable edges and the seventeen-stage order (`../research/research.md:104-118`)
- [ ] T002 Confirm the Stage-0 census numbers against the live spec root (`../research/research.md`, live spec root)
- [ ] T003 [P] Confirm the eighteen NO-GO items across both research tables (`../research/research.md:55-66`, `../research/research.md:78-85`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author the topological sort with each edge named at its stage boundary (`028-governance-rollout/rollout-sequence.md`)
- [ ] T005 Author the four-beat runbook and the Stage-0 census table (`028-governance-rollout/migration-runbook.md`)
- [ ] T006 Author INV-1 and INV-2 as a reviewable checklist with the four boundaries and four drift guards (`028-governance-rollout/safety-model.md`)
- [ ] T007 Author one reader and one metric with the three sweep escape classes (`028-governance-rollout/measurement-plan.md`)
- [ ] T008 Author the eighteen NO-GO items keyed to ten anti-patterns (`028-governance-rollout/no-go-list.md`)
- [ ] T009 Add a grep guard that no sibling phase spec is modified by this phase (`028-governance-rollout`)
- [ ] T013 Specify the rollout-manifest conformance benchmark test, topo-sort 0 edge-violations plus a planted out-of-order fixture caught 1 of 1 (`scripts/tests/governance-rollout-manifest.vitest.ts`)
- [ ] T014 Specify the flags-off byte-identical proof, ALL_SPECKIT_FLAGS gains no flag and no `validator-registry.json` rule is added (`mcp_server/tests/flag-ceiling.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Confirm the rollout order violates none of the five edges
- [ ] T011 Confirm every gate phase can import the four-beat runbook by reference
- [ ] T012 Confirm the NO-GO list enumerates all eighteen items and marks the three rail-crossing novel rewrites
- [ ] T015 Confirm the benchmark PASS gate reads 0 edge-violations and 18 NO-GO items with every gate-phase runbook import resolving
- [ ] T016 Confirm the REGRESS proof, the planted out-of-order fixture is flagged and the flags-off corpus output stays byte-identical
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
