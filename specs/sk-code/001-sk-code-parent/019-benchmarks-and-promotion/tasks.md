---
title: "Tasks: Phase 19 benchmarks, validator promotion, and parent rollup"
description: "Executed task list for the final 124 parent-hub gate: Lane-C baselines, validator promotion (checks 5-9 WARN->FAIL), and the 124 parent rollup."
trigger_phrases:
  - "phase 19 tasks"
  - "benchmark promotion tasks"
  - "parent rollup tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/019-benchmarks-and-promotion"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase executed; checks 5-9 promoted, 124 rolled up"
    next_safe_action: "Close 124 goal; sk-code re-baseline handed to rename follow-up"
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

- [x] T001 Confirm phases 015, 016, 017, 018a, and 018b have landed [medium] — all landed; 018 STRICT 0/0
- [x] T002 Confirm deep-loop 018b cleared the live-agent collision [medium] — registry returned git-clean; 018b executed (`e1a266b07c`)
- [x] T003 Inventory existing sk-code benchmark folders to prove add-only behavior [small] — rich history (baseline/after/full/live*/router-final) preserved
- [x] T004 Inventory existing sk-design benchmark folders to prove add-only behavior [small]
- [x] T005 Inventory existing deep-loop benchmark folders to prove add-only behavior [small]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### sk-code Baseline
- [x] T006 Re-derive fresh sk-code Lane-C benchmark run after the surface-packet move [large] — fresh router run scores 48 (D5 100/100); DIAGNOSED as stale playbook gold (the 29 scenarios encode the pre-013 single-skill file-loading model; the current two-axis hub routes to packets, so resourceRecall drops). No hub-router misconfiguration (check 5d passes; all router paths resolve). Full playbook-gold rewrite + re-baseline DEFERRED to the rename follow-up packet (operator-decided) since it re-routes sk-code and mandates a fresh baseline anyway.
- [x] T007 Verify the sk-code router resolves nested `webflow/`, `opencode/`, `animation/` evidence paths [medium] — router resolves all paths (parent-skill-check 5d PASS); the stale gold is in the playbook expectations, not the router.

### sk-design Baseline
- [x] T008 Produce sk-design Lane-C benchmark baseline [large] — CONDITIONAL 69/100, D5 100/100, frozen at `benchmark/baseline/` (`fc4644a98a`)
- [x] T009 Verify the sk-design baseline is add-only [small] — historical runs untouched

### deep-loop Baseline
- [x] T010 Produce deep-loop Lane-C benchmark baseline after 018b settled [large] — CONDITIONAL 71/100, D5 100/100, frozen at `benchmark/baseline/` (`50fbe53094`); the 018b gate cleared so this unblocked
- [x] T011 Verify the deep-loop baseline is add-only and aligned to the settled hub-router [small]

### Comparison
- [x] T012 Record cross-hub benchmark comparison [medium] — D5 connectivity hard gate 100/100 on all three; sk-design 69, deep-loop 71 (CONDITIONAL); sk-code 48 (stale-gold, deferred)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Pre-Promotion Gate
- [x] T013 Run parent-skill-check strict for sk-code and record 0-fail output [small] — STRICT 0/0
- [x] T014 Run parent-skill-check strict for sk-design and record 0-fail output [small] — STRICT 0/0
- [x] T015 Run parent-skill-check strict for deep-loop and record 0-fail output [small] — STRICT 0/0 (unblocked once 018b landed)

### Severity Promotion
- [x] T016 Promote parent-skill-check checks 5-9 from WARN to FAIL [medium] — `769845c5a8`; flipped STRICT_HUB_CANON default to FAIL with a PARENT_HUB_CHECK_STRICT=0 WIP opt-out; doctor + create assets updated
- [x] T017 Re-run strict parent-skill-check for all three hubs after promotion [medium] — all three pass under the new FAIL-by-default gate (0 warnings)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Rollup and Optional Catalogs

### Parent Rollup
- [x] T018 Update 124 parent `graph-metadata.children_ids` to include phases 001-019 [small]
- [x] T019 Set 124 parent `last_active_child_id` to `019-benchmarks-and-promotion` [small]
- [x] T020 Set 124 parent status to match final-gate completion state [small] — parent rolled up to complete

### Optional Feature Catalogs
- [x] T021 [P] Optional sk-code feature catalog entry [medium] — SKIPPED (explicitly optional, not canon-required)
- [x] T022 [P] Optional sk-design feature catalog entry [medium] — SKIPPED (optional, not canon-required)
- [x] T023 [P] Optional deep-loop feature catalog entry [medium] — SKIPPED (optional, not canon-required)

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [x] T024 Verify no historical benchmark run folders changed [medium] — read-only inventory; historical runs untouched
- [x] T025 Run recursive `validate.sh --strict` after metadata generation/backfill [medium] — 124 tree recursive validate clean
- [x] T026 Update implementation summary with actual benchmark, promotion, rollup, and validation evidence [medium]
- [x] T027 Mark checklist items with evidence after execution completed [small]

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks completed (the sk-code full re-baseline is explicitly deferred to the rename follow-up with the stale-gold finding documented).
- [x] Validator promotion occurred only after all three hubs passed strict parent-skill-check.
- [x] Benchmark packages are add-only; historical runs untouched.
- [x] Parent rollup metadata lists children 001-019 and active child 019.
- [x] Checklist marked with execution evidence.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
