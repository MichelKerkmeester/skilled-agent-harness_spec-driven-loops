---
title: "Tasks: Cursor deep-loop executor support"
description: "Task breakdown for adding cli-cursor as a typed deep-loop executor kind."
trigger_phrases: ["cli-cursor executor support tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/002-deep-loop-executor-support"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md for phase 002"
    next_safe_action: "Begin T001 after phase 001 facts re-read"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cursor deep-loop executor support

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Re-read `../001-cursor-contract-pin/implementation-summary.md` for the confirmed flag surface, approval flags, binary name, and model-roster shape
- [x] T002 Confirm or mark TBD: Cursor session-id env var, `SandboxMode → approval-flag` mapping, reasoning-effort-via-model-bracket — all confirmed live (session-id: `CURSOR_CONVERSATION_ID`; approval mapping: read-only→ask/workspace-write→auto-review/danger-full-access→force; reasoning-effort-via-bracket: **rejected outright by the live CLI**, unsupported instead)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Widen `EXECUTOR_KINDS` to include `'cli-cursor'`; add matching rows to `EXECUTOR_KIND_FLAG_SUPPORT` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` (`executor-config.ts`)
- [x] T004 Add `CURSOR_SUPPORTED_MODELS`, `CursorSupportedModel`, `CursorApprovalMode`, `resolveCursorApprovalMode()` (`executor-config.ts`)
- [x] T005 Add `cli-cursor` rows to the binary/session/state/home-dir/env-prefix maps (`executor-audit.ts`)
- [x] T006 Add `cli-cursor` to `SPECKIT_STATE_ENV_BY_KIND`; implement + register `buildCursorLineageCommand` with a `command -v cursor-agent` fail-closed preflight (`fanout-run.cjs`)
- [x] T007 [P] Add `cli-cursor` to `KNOWN_EXECUTORS` + `buildSpawnSpec` case with `CURSOR_AGENT_BIN` override (`dispatch-model.cjs`)
- [x] T008 [P] Add `cli-cursor` to `KNOWN_EXECUTORS` in the same commit (`profile-validator.cjs`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 Run the 4 focused Vitest files; confirm zero regressions in existing kinds' assertions — 178/178 in the 3 runtime files; 24/25 in remediation.vitest.ts (the 1 failure is a pre-existing, unrelated `cli-opencode`-naming bug, confirmed identical on `HEAD` before this phase via `git stash` isolation — not a regression)
- [x] T010 Add + pass a new `cli-cursor` absent-binary fail-closed test in `fanout-run.vitest.ts`; assert the guard ignores the (always-0) `-p` exit code
- [x] T011 Run strict typecheck on `executor-config.ts` and `executor-audit.ts`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T012 `validate.sh 002-deep-loop-executor-support --strict` passes 0/0; `SC-001`..`SC-005` all met
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Consumes `../001-cursor-contract-pin/implementation-summary.md`; blocks `../003-cli-cursor-skill-packet/`.
- Structural precedent: `../../027-cli-codex-revival/002-deep-loop-executor-support/`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
