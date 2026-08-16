---
title: "Tasks: Legacy Hub Compiled Routing Refresh"
description: "Deferred task breakdown for repairing the system-deep-loop owner harness, rebuilding two stale class-H hubs, promoting safely, and proving fleet freshness"
trigger_phrases:
  - "legacy hub refresh tasks"
  - "owner harness prior manifest"
  - "seven hub freshness proof"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/022-legacy-hub-compiled-routing-refresh"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored deferred legacy hub refresh plan"
    next_safe_action: "Run in complete compiled-routing environment"
    blockers:
      - "system-deep-loop harness lacks prior activation manifest"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Legacy Hub Compiled Routing Refresh

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

All tasks are pending because this packet records deferred work rather than an implementation.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Enter the complete 015 compiled-routing environment with activation state and retained rollback.
- [ ] T002 Capture baseline route status for all seven hubs before any refresh action.
- [ ] T003 Capture frozen replay/scorer bytes and protected digests before the build pipeline.
- [ ] T004 Confirm the current `ROUTER.md` sources and both owner harness entry points.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Repair the `system-deep-loop` owner harness so the prior activation manifest is created or no longer required.
- [ ] T011 Run the `sk-prompt` owner build from its current `ROUTER.md`.
- [ ] T012 Run the `system-deep-loop` owner build from its current `ROUTER.md`.
- [ ] T013 Compare both effective policy hashes with the current authored-policy target before promotion.
- [ ] T014 Stop and revert any partial rebuild instead of continuing from incomplete activation state.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Refresh both activation manifests in the complete 015 environment.
- [ ] T021 Promote through `compiled-route-sync` with the retained-rollback closure.
- [ ] T022 Run the program canary and stop on any failure.
- [ ] T023 Run `node .opencode/bin/compiled-route-status.cjs --all` and confirm all seven hubs are compiled and fresh.
- [ ] T024 Compare frozen replay/scorer bytes and protected digests with the captured baseline.
- [ ] T025 Record the build, promotion, canary, route-status, rollback-readiness, and frozen-artifact receipts.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implementation and verification tasks are complete with execution evidence.
- [ ] No failed gate or unresolved rollback condition remains.
- [ ] All seven hubs report compiled and fresh.
- [ ] Frozen replay/scorer files and protected digests remain byte-identical.
- [ ] The implementation summary is updated from Planned only after the deferred work is actually executed.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
