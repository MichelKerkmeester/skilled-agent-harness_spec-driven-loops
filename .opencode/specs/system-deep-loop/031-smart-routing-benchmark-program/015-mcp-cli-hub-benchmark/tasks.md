---
title: "Tasks: mcp-tooling + cli-external Hub Benchmark & Router Improvements"
description: "Task breakdown for benchmark enablement, both-mode runs, and the five per-child router fixes."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/015-mcp-cli-hub-benchmark"
    last_updated_at: "2026-07-10T22:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All tasks complete"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-tooling + cli-external Hub Benchmark & Router Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Confirm children router parseability; identify mcp-figma's INTENT_MODEL as unparseable.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Normalize mcp-figma (mirror INTENT_SIGNALS + key-sync test).
- [x] Author per-child Type-1 gold (5 children) + hub Type-2 blind holdouts.
- [x] Five per-child router fixes (keyword broadening + structural cleanups).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] Full Mode-A matrix (7 targets) + genuine Mode-B live smoke.
- [x] Integrity gate: fresh positives + adjacent negatives (no over-firing, no generalization).
- [x] T1 rows unchanged by every fix; mcp-figma key-sync green.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All 7 targets scoreable both modes + 5 fixes landed + integrity gate run + honest findings recorded.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Extends the Lane C smart-routing benchmark program to the mcp-tooling + cli-external hub families.
<!-- /ANCHOR:cross-refs -->
