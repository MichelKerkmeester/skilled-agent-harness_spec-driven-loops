---
title: "Implementation Plan: Phase 19 benchmarks, validator promotion, and parent rollup"
description: "Forward-looking Level 2 plan for fresh cross-hub Lane-C baselines, gated parent-skill-check severity promotion, and 124 parent metadata rollup."
trigger_phrases:
  - "phase 19 benchmark plan"
  - "parent-skill-check promotion plan"
  - "124 rollup plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/019-benchmarks-and-promotion"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented; execution pending"
    next_safe_action: "Begin with T001 by confirming prerequisite phase and hub pass status"
---
# Implementation Plan: Phase 19 benchmarks, validator promotion, and parent rollup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JavaScript validator scripts, benchmark artifacts |
| **Framework** | OpenCode parent-hub canon, sk-doc benchmark package conventions, system-spec-kit phase docs |
| **Storage** | Repository filesystem: skill-local `benchmark/` packages and 124 parent metadata |
| **Testing** | 3x parent-skill-check strict, cross-hub benchmark comparison, recursive `validate.sh --strict` |

### Overview
This phase is the final gate for the 124 parent-hub canon program. It waits for the hub alignment phases to settle, creates fresh add-only Lane-C benchmark packages for sk-code, sk-design, and deep-loop, promotes parent-skill-check checks 5-9 from WARN to FAIL only after all three hubs pass, and repairs stale parent rollup metadata. Feature catalog entries are optional and low priority because the audit confirms they are not part of the parent-hub canon.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 015, 016, 017, 018a, and 018b have landed or their relevant prerequisites are explicitly verified.
- [ ] Deep-loop registry, router, and changelog files are no longer in a live-agent collision state.
- [ ] `sk-code`, `sk-design`, and `deep-loop-workflows` each pass parent-skill-check strict before validator promotion.
- [ ] Historical benchmark folders are inventoried so add-only behavior can be verified.

### Definition of Done
- [ ] Fresh Lane-C benchmark baselines exist for all three hubs as add-only packages.
- [ ] Cross-hub benchmark comparison is recorded.
- [ ] parent-skill-check checks 5-9 are promoted from WARN to FAIL after the 3-hub strict pass gate.
- [ ] 124 parent graph metadata children, active child, and parent status are rolled up.
- [ ] Recursive `validate.sh --strict` passes after orchestrator-owned metadata generation/backfill.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Final-gate sequencing: benchmark evidence first, strict conformance second, validator severity promotion third, parent rollup last.

### Key Components
- **Lane-C benchmark packages**: Hub-local `benchmark/` artifacts for sk-code, sk-design, and deep-loop, created add-only.
- **Parent-skill-check validator**: Shared canon checker whose checks 5-9 remain warning posture until all hubs are migrated and passing.
- **124 parent rollup**: Parent `graph-metadata.json` that must list children 001-019 and point at the final active child.
- **Optional feature catalogs**: Non-canon hub inventories that may be added only after P0/P1 work.

### Data Flow
Prerequisite hub phases settle, then benchmark generation reads the final hub artifacts and writes new benchmark packages. Strict parent-skill-check runs on each hub. Only after all three hubs pass does the validator promotion edit occur. The parent rollup then updates phase metadata so resume and graph traversal see phases 010-019.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness and Baseline Inventory
- [ ] Confirm phases 015, 016, 017, 018a, and 018b status.
- [ ] Confirm deep-loop 018b removed the live collision and settled the 7-mode registry/router state.
- [ ] Inventory existing benchmark folders for all three hubs to preserve historical runs.

### Phase 2: Fresh Benchmark Packages
- [ ] Re-derive sk-code Lane-C baseline after the 013 surface move and 016 content coherence repairs.
- [ ] Produce new sk-design Lane-C baseline after its hub-level artifacts pass strict checking.
- [ ] Produce new deep-loop Lane-C baseline after 018b settles.
- [ ] Record cross-hub comparison and any benchmark deltas.

### Phase 3: Validator Promotion
- [ ] Run strict parent-skill-check for `sk-code`.
- [ ] Run strict parent-skill-check for `sk-design`.
- [ ] Run strict parent-skill-check for `deep-loop-workflows`.
- [ ] Promote checks 5-9 WARN to FAIL only after all three strict runs report 0 fails.
- [ ] Re-run strict checks after promotion.

### Phase 4: Parent Rollup and Optional Catalogs
- [ ] Update 124 parent `graph-metadata.children_ids` to include 001-019.
- [ ] Set `last_active_child_id` to `019-benchmarks-and-promotion`.
- [ ] Set parent status to match final-gate completion state.
- [ ] Add optional low-priority feature catalog entries for the three hubs if P0/P1 work is complete.
- [ ] Run recursive `validate.sh --strict` after central metadata generation/backfill is complete.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Hub conformance | sk-code, sk-design, deep-loop parent hubs | `parent-skill-check` with strict mode |
| Benchmark evidence | Three fresh Lane-C baselines and historical preservation | Benchmark generation output plus git diff review |
| Validator promotion | Checks 5-9 WARN-to-FAIL behavior | parent-skill-check before/after strict runs |
| Parent rollup | 124 parent metadata children and active child | JSON review plus recursive spec validation |
| Spec validation | Phase parent and child spec docs | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 016 sk-code content coherence | Internal | Pending/verify before execution | sk-code re-derived baseline may capture stale playbook or reference paths |
| Phase 015 sk-design canon alignment | Internal | Pending/verify before execution | sk-design benchmark cannot be meaningful until hub artifacts exist |
| Phase 018b deep-loop canon alignment | Internal | Blocked until live collision clears | Deep-loop final baseline and validator promotion remain blocked |
| Phase 017 canon hardening | Internal | Pending/verify before execution | Validator promotion must not conflict with canon vocabulary changes |
| Three-hub strict parent-skill-check | Internal | Gated | Checks 5-9 cannot promote to FAIL until all hubs pass |
| Orchestrator metadata generation/backfill | Internal | External to this phase-doc authoring | Recursive strict validation may need central metadata files before final pass |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A promoted check breaks a hub that passed pre-promotion strict checks, a benchmark package mutates historical runs, or parent rollup metadata points at an incorrect child.
- **Procedure**: Revert the validator severity-change commit first, restore parent rollup metadata from the prior version, and remove only newly added benchmark packages from this phase if their evidence is invalid.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness and Baseline Inventory | 015, 016, 017, 018a, 018b status | Benchmark Packages |
| Fresh Benchmark Packages | Readiness and no deep-loop 018b collision | Validator Promotion |
| Validator Promotion | 3x strict parent-skill-check 0 fails | Parent Rollup final status |
| Parent Rollup and Optional Catalogs | Promotion outcome and benchmark comparison | Recursive validation and handoff |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readiness and Baseline Inventory | Medium | Requires phase-state and historical benchmark review |
| Fresh Benchmark Packages | High | Three hubs with different migration states and comparison output |
| Validator Promotion | Medium | Small code change but high migration-gate risk |
| Parent Rollup and Optional Catalogs | Medium | Parent metadata plus optional low-priority hub inventory docs |
| **Total** | | **Medium-high final-gate phase** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Record pre-promotion parent-skill-check strict output for all three hubs.
- [ ] Record pre-change benchmark directory inventory for all three hubs.
- [ ] Record pre-change 124 parent `graph-metadata.json` state.

### Rollback Procedure
1. Revert parent-skill-check severity promotion if any hub fails after promotion.
2. Remove only newly added benchmark packages from this phase if a baseline is invalid.
3. Restore prior 124 parent graph metadata if child ids, active child, or status are wrong.
4. Re-run 3x strict parent-skill-check and recursive strict spec validation.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Filesystem-only revert/removal of this phase's add-only benchmark packages, validator edit, and parent metadata edit.

<!-- /ANCHOR:enhanced-rollback -->
