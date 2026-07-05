---
title: "Tasks: Phase 19 benchmarks, validator promotion, and parent rollup"
description: "Unchecked future task list for the final 124 parent-hub gate: Lane-C baselines, gated validator promotion, parent rollup, and optional feature catalogs."
trigger_phrases:
  - "phase 19 tasks"
  - "benchmark promotion tasks"
  - "parent rollup tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/019-benchmarks-and-promotion"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented; execution pending"
    next_safe_action: "Begin with T001 by confirming prerequisite phase status and deep-loop 018b unblock state"
---
# Tasks: Phase 19 benchmarks, validator promotion, and parent rollup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 015, 016, 017, 018a, and 018b have landed or identify missing prerequisites (`.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/`) [medium]
- [ ] T002 Confirm deep-loop 018b has cleared the live-agent collision before touching deep-loop-dependent work (`.opencode/skills/deep-loop-workflows/`) [medium]
- [ ] T003 Inventory existing sk-code benchmark folders to prove add-only behavior (`.opencode/skills/sk-code/benchmark/`) [small]
- [ ] T004 Inventory existing sk-design benchmark folders to prove add-only behavior (`.opencode/skills/sk-design/benchmark/`) [small]
- [ ] T005 Inventory existing deep-loop benchmark folders to prove add-only behavior (`.opencode/skills/deep-loop-workflows/benchmark/`) [small]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### sk-code Baseline
- [ ] T006 Re-derive fresh sk-code Lane-C benchmark baseline after the surface-packet move (`.opencode/skills/sk-code/benchmark/`) [large]
- [ ] T007 Verify the sk-code baseline resolves nested `webflow/`, `opencode/`, and `animation/` evidence paths (`.opencode/skills/sk-code/benchmark/`) [medium]

### sk-design Baseline
- [ ] T008 Produce new sk-design Lane-C benchmark baseline once hub artifacts pass strict checks (`.opencode/skills/sk-design/benchmark/`) [large]
- [ ] T009 Verify the sk-design baseline is add-only and leaves historical runs untouched (`.opencode/skills/sk-design/benchmark/`) [small]

### deep-loop Baseline
- [ ] T010 [B] Produce new deep-loop Lane-C benchmark baseline after 018b settles (`.opencode/skills/deep-loop-workflows/benchmark/`) [large] BLOCKED: deep-loop 018b must complete so the benchmark reflects the final 7-mode registry/router state.
- [ ] T011 [B] Verify the deep-loop baseline is add-only and aligned to the settled hub-router (`.opencode/skills/deep-loop-workflows/benchmark/`) [medium] BLOCKED: depends on T010 and deep-loop 018b.

### Comparison
- [ ] T012 [B] Record cross-hub benchmark comparison across sk-code, sk-design, and deep-loop (`.opencode/skills/*/benchmark/`) [medium] BLOCKED: requires T006, T008, and T010.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Pre-Promotion Gate
- [ ] T013 Run parent-skill-check strict for sk-code and record 0-fail output (`.opencode/skills/sk-code/`) [small]
- [ ] T014 Run parent-skill-check strict for sk-design and record 0-fail output (`.opencode/skills/sk-design/`) [small]
- [ ] T015 [B] Run parent-skill-check strict for deep-loop and record 0-fail output (`.opencode/skills/deep-loop-workflows/`) [small] BLOCKED: deep-loop 018b must complete.

### Severity Promotion
- [ ] T016 [B] Promote parent-skill-check checks 5-9 from WARN to FAIL (`.opencode/commands/doctor/scripts/parent-skill-check.cjs`) [medium] BLOCKED: requires T013, T014, and T015 all passing.
- [ ] T017 [B] Re-run strict parent-skill-check for all three hubs after promotion (`.opencode/skills/`) [medium] BLOCKED: requires T016.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Rollup and Optional Catalogs

### Parent Rollup
- [ ] T018 Update 124 parent `graph-metadata.children_ids` to include phases 001-019 (`.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/graph-metadata.json`) [small]
- [ ] T019 Set 124 parent `last_active_child_id` to `019-benchmarks-and-promotion` (`.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/graph-metadata.json`) [small]
- [ ] T020 Set 124 parent status to match final-gate completion state (`.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/graph-metadata.json`) [small]

### Optional Feature Catalogs
- [ ] T021 [P] Add optional low-priority feature catalog entry for sk-code if time permits (`.opencode/skills/sk-code/feature_catalog/`) [medium]
- [ ] T022 [P] Add optional low-priority feature catalog entry for sk-design if time permits (`.opencode/skills/sk-design/feature_catalog/`) [medium]
- [ ] T023 [P] Add optional low-priority feature catalog entry for deep-loop if time permits (`.opencode/skills/deep-loop-workflows/feature_catalog/`) [medium]

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [ ] T024 Verify no historical benchmark run folders changed (`.opencode/skills/*/benchmark/`) [medium]
- [ ] T025 Run recursive `validate.sh --strict` after orchestrator-owned metadata generation/backfill (`.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/`) [medium]
- [ ] T026 Update implementation summary with actual benchmark, promotion, rollup, and validation evidence (`implementation-summary.md`) [medium]
- [ ] T027 Mark checklist items with evidence only after execution completes (`checklist.md`) [small]

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks completed or still explicitly blocked by deep-loop 018b.
- [ ] No validator promotion occurs until all three hubs pass strict parent-skill-check.
- [ ] Three fresh benchmark packages are add-only and historical runs are untouched.
- [ ] Parent rollup metadata lists children 001-019 and active child 019.
- [ ] Checklist remains unchecked until execution evidence exists.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
