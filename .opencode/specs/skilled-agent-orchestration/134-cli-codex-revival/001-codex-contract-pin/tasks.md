---
title: "Tasks: Codex contract pin"
description: "Completed live and historical contract verification tasks."
trigger_phrases: ["Codex contract tasks"]
importance_tier: normal
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/001-codex-contract-pin"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Pinned Codex contract (v0.144.1; native hooks) and folded evidence into the phase doc"
    next_safe_action: "Proceed to phase 002 deep-loop executor support"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Codex contract pin
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
`[x]` completed; `[ ]` pending; `[B]` blocked.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read the supplied contract pin and prior deprecation boundary. (Evidence: phase `spec.md`.)
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T002 Verify Codex path and version. (Evidence: `implementation-summary.md` verification table.)
- [x] T003 Verify native hooks and related features. (Evidence: `codex features list` result in `implementation-summary.md`.)
- [x] T004 Inspect neutral hook cores and missing Codex adapters. (Evidence: phase `spec.md` scope.)
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T005 Record `CODEX_PROJECT_DIR` and fail-closed availability requirements.
- [x] T006 Preserve unverified hook-schema details for phase 004. (Evidence: `spec.md` open questions.)
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All phase tasks complete.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `../002-deep-loop-executor-support/spec.md`
<!-- /ANCHOR:cross-refs -->
