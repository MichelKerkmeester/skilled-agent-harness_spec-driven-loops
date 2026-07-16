---
title: "Implementation Plan: command lane integration"
description: "Plan for lane registration, full-corpus run, and convergence gating."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/004-command-lane-integration"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the lane-integration child for the full-corpus deterministic run"
    next_safe_action: "Register the peer adapter lane and run scoping against the command scope"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: command lane integration

<!-- ANCHOR:summary -->
## 1. SUMMARY

Register the peer adapter as a lane, run the full command corpus to convergence, and hard-gate state agreement, keeping the peer lane isolated from generic validation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Scoping resolves the peer adapter lane and exits 0.
- The run reaches converged true.
- Raw-delta and reduced counts and codes agree exactly.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

A lane-config entry selects the command adapter over the command scope. The deep-alignment loop runs discovery, partitioning, per-command checks, and convergence, then the reducer produces the finding registry and dashboard. A hard gate compares raw deltas to the reduced report before the verdict is accepted.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Lane registration
Author the lane-config entry and confirm scoping resolves the peer adapter over the command scope.

### Phase 2: Convergence and gating
Run the full corpus to convergence and hard-gate raw-delta and reducer agreement.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run scoping in JSON mode and confirm it resolves the command adapter, run the loop to convergence, and diff raw deltas against the reduced report for exact agreement.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The command adapter, the scoping and convergence scripts, and the reducer.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The lane is a config entry and generated run state, so rollback is removing the lane-config entry and archiving the run packet. No source code changes.
<!-- /ANCHOR:rollback -->
