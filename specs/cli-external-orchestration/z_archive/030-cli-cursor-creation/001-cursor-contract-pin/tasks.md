---
title: "Tasks: Cursor CLI contract pin"
description: "Task breakdown for the Cursor CLI contract-pin phase."
trigger_phrases: ["cursor cli contract pin tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/001-cursor-contract-pin"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete"
    next_safe_action: "Proceed to 002"
    blockers: []
    key_files: []
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cursor CLI contract pin

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel; none needed here.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Install Cursor CLI via the official install script — evidence: `cursor-agent` build `2026.07.23-e383d2b` installed to `~/.local/bin/` (see `implementation-summary.md` "Install & Version")
- [x] T002 Confirm the canonical binary name and both symlinks (`cursor-agent`, `agent`) and print the build
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Capture `cursor-agent --help` (global flags, execution modes, subcommands)
- [x] T004 Capture `cursor-agent mcp --help`, `plugin --help`, `worker --help` (unique surfaces)
- [x] T005 Fetch and read `cursor.com/cli` + `cursor.com/docs/cli/overview` + `cursor.com/docs/cli/headless`
- [x] T006 Fetch and read `cursor.com/docs/cli/using` + `cursor.com/docs/cli/mcp` + `cursor.com/docs/hooks`
- [x] T007 Inspect the live shared config surface (`~/.cursor/` contents, `~/.cursor/hooks.json` schema, `~/.cursor/cli-config.json` keys)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T008 Run `cursor-agent about`/`status` to record auth state; run one `-p` dispatch to confirm fail-closed-without-auth
- [x] T009 Cross-check fetched docs against the live command surface and config files for consistency — evidence: hooks event names in `cursor.com/docs/hooks` agree with the live `~/.cursor/hooks.json` (see `implementation-summary.md` "Hooks")
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T010 Write `implementation-summary.md` with citable evidence for every REQ in `spec.md`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Consumed by `../002-deep-loop-executor-support/` (executor design) and `../003-cli-cursor-skill-packet/` (SKILL.md/README.md content).
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`, `implementation-summary.md`
