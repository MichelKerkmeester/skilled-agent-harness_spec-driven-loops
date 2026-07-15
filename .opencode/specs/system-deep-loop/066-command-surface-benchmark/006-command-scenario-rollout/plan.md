---
title: "Implementation Plan: command scenario rollout"
description: "Plan for authoring DAB-012 to 027 and a complete pinned Claude baseline."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/006-command-scenario-rollout"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the rollout child for the full command behavioral suite"
    next_safe_action: "Author DAB-012 through DAB-027 extending the existing package"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: command scenario rollout

<!-- ANCHOR:summary -->
## 1. SUMMARY

Author the full DAB-012 to 027 suite, reconcile index and baseline rows, and capture a complete pinned Claude baseline across topologies.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Exactly sixteen command-suite scenarios exist and reconcile with the index.
- All Claude baseline cells are quotable.
- DAB-001 to 011 remain unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Scenarios DAB-012 to 027 extend the deep-alignment behavior_benchmark package under the shared framework. Each scenario is a machine contract with a suite tag of command-surface and a command-topology field. Results live in the executing spec phase; the package holds only contracts, rubric, and baselines.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenario authoring
Author DAB-012 to 027 covering every family and topology as scored contracts.

### Phase 2: Baseline and reconciliation
Capture a complete pinned Claude baseline and reconcile ids, index, hashes, and baseline rows.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Confirm exactly sixteen scenarios exist, ids and index and hashes reconcile, every Claude baseline cell is quotable, and DAB-001 to 011 scores are unchanged.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The pilot calibration, the schema v2 evaluator, and the existing DAB package.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Scenarios and baselines are additive files, so rollback is removing DAB-012 to 027 and their baseline rows. Existing scenarios are unaffected.
<!-- /ANCHOR:rollback -->
