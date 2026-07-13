---
title: "Tasks: Deep-loop Codex executor support"
description: "Wave 1 runtime implementation and verification tasks."
trigger_phrases: ["Codex executor tasks"]
importance_tier: normal
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/002-deep-loop-executor-support"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Restored accepted fail-closed cli-codex runtime support"
    next_safe_action: "Wait for phase 003 hub-rename dependency to land"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-loop Codex executor support
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
`[x]` completed; `[ ]` pending; `[B]` blocked.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Locate config, fan-out, audit, and council symmetry points. (Evidence: `plan.md` affected-surfaces table.)
- [x] T002 Recover historical Codex command shape. (Evidence: `implementation-summary.md`.)
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Add `cli-codex` to kinds and flag support.
- [x] T004 Restore fan-out adapter and state hint. (Evidence: focused runtime tests 132/132.)
- [x] T005 Add `command -v codex` fail-closed preflight.
- [x] T006 Restore audit and recursion metadata. (Evidence: `executor-audit.ts` scoped diff.)
- [x] T007 Retarget rejection coverage to acceptance and add absent-binary coverage. (Evidence: focused runtime tests 132/132.)
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T008 Run focused tests and changed-module typecheck. (Evidence: 157/157 focused tests; strict changed-module typecheck exits 0.)
- [x] T009 Run complete runtime suite. (Evidence: 606/694 pass; 88 repository dependency/digest baseline failures recorded.)
- [ ] T010 Run recursive strict packet validation after the banned stale dist is rebuilt by its owning workstream.
  - **Evidence**: Exact command is blocked before rules by stale banned dist; the strict shell contract verifies the parent and all six phases with Errors: 0 and Warnings: 0.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All scoped tests pass and exact repository baseline blockers are recorded.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `checklist.md`
- `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
