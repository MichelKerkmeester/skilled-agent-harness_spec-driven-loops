---
title: "Implementation Plan: command scenario rollout"
description: "Plan for completing DAB-012 to 027 authoring while deferring the operator-gated Claude baseline."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout"
    last_updated_at: "2026-07-15T10:49:30Z"
    last_updated_by: "codex"
    recent_action: "Completed scenario authoring, fixture authoring, reconciliation, and hermetic regression checks"
    next_safe_action: "Capture the sixteen live Claude baseline cells after operator green-light"
    blockers:
      - "Live Claude baseline capture is deferred pending operator green-light"
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: command scenario rollout

<!-- ANCHOR:summary -->
## 1. SUMMARY

Preserve DAB-012 to 015, author DAB-016 to 027, reconcile the sixteen-cell command suite, and keep live Claude baseline capture as the only deferred phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Exactly sixteen schema-v2 command-suite scenarios exist and reconcile 16/16 with the index and pending baseline rows.
- Every new marker hash matches its current command source and every fixture boundary is non-empty.
- The DAB-001 to 011 golden regression and shared hermetic runner test pass.
- All Claude baseline cells become quotable only after the deferred live capture.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Scenarios DAB-012 to 027 extend the deep-alignment behavior_benchmark package under the frozen shared framework. Each scenario is a schema-v2 machine contract with a command topology, topology-correct delegation evidence, allowlisted postconditions, and fixture-local boundary. Results live in the executing spec phase; the package holds contracts, index, and baseline ledger only.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenario authoring
Retain DAB-012 to 015 and author DAB-016 to 027 across workflow, subaction, direct-dispatch, and monolithic topologies. Add dedicated fixtures and source-pinned presentation markers.

### Phase 2: Reconciliation and regression
Reconcile the exact sixteen-scenario set, index, marker hashes, fixtures, and pending baseline rows. Pin DAB-001 to 011 against the existing golden and run the shared hermetic regression.

### Phase 3: Deferred live baseline
After operator green-light, capture all sixteen Claude cells, replace pending values with quotable measurements, and close the phase.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/command-scenario-rollout.test.cjs` and the frozen shared runner test. The phase test must pass contract, marker, and v1-golden assertions now; only the quotable baseline-value assertion may skip while all sixteen rows are pending.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The pilot calibration, the schema v2 evaluator, and the existing DAB package.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The new authoring is additive. Rollback removes DAB-016 to 027 and their fixture roots, restores the package index and baseline ledger, removes the phase-owned test, and restores these four phase documents. DAB-001 to 015 and the frozen framework/runner remain untouched.
<!-- /ANCHOR:rollback -->
