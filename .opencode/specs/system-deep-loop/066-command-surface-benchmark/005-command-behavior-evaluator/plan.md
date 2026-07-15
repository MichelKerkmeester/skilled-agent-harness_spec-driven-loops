---
title: "Implementation Plan: command behavior evaluator"
description: "Plan for framework schema v2 evidence kinds and terminal buckets, preserving v1 scores."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/005-command-behavior-evaluator"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the evaluator child that upgrades the shared framework to schema v2"
    next_safe_action: "Add direct-dispatch and outcome-probe evidence kinds with v1 compatibility"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: command behavior evaluator

<!-- ANCHOR:summary -->
## 1. SUMMARY

Upgrade the shared behavior-benchmark framework to schema v2 with the evidence kinds and terminal buckets command behavior needs, preserving existing DAB scores under v1 parsing.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The framework test suite exits 0 in a writable environment.
- All new evidence and compatibility fixtures pass.
- DAB-001 to 011 scores are unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The shared framework gains a schema v2 that adds a direct-dispatch evidence kind, allowlisted postcondition probes, structured boundary evidence, and a boundary-violation terminal bucket. The runner parses v1 and v2 scenarios; the single shared framework remains the only evaluator and create-benchmark never defines the rubric.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence kinds
Add direct-dispatch, outcome-probe, setup-misbind, and boundary evidence with allowlisted probes.

### Phase 2: Compatibility and buckets
Add the boundary-violation bucket and prove v1 parsing preserves existing DAB scores.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the framework test suite in a writable environment and confirm the new evidence, boundary, and v1-compatibility fixtures pass and one hermetic v2 scored result is produced.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The shared behavior-benchmark framework, the behavior runner, and the existing DAB-001 to 011 fixtures.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Schema v2 is additive, so rollback is reverting the framework and runner changes; v1 scenarios continue to parse. Existing scores are unaffected.
<!-- /ANCHOR:rollback -->
